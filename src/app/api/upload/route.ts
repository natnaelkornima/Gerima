import { NextRequest, NextResponse } from "next/server";
import { createRouteClient } from "@/lib/supabase/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    try {
        console.log("[UPLOAD] Starting upload handler...");
        const { supabase } = createRouteClient(req);

        // 1. Authenticate User
        const {
            data: { user },
        } = await supabase.auth.getUser();

        console.log("[UPLOAD] User:", user?.id || "NO USER");

        if (!user) {
            console.log("[UPLOAD] ERROR: Unauthorized");
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // 2. Parse Form Data
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            console.log("[UPLOAD] ERROR: No file");
            return NextResponse.json(
                { error: "No file uploaded" },
                { status: 400 }
            );
        }

        console.log("[UPLOAD] File:", file.name, file.type);

        // 3. Upload to Supabase Storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from("materials")
            .upload(fileName, file);

        if (uploadError) {
            console.error("[UPLOAD] Storage Error:", uploadError);
            return NextResponse.json(
                { error: "Failed to upload file to storage: " + uploadError.message },
                { status: 500 }
            );
        }

        console.log("[UPLOAD] Storage upload success:", fileName);

        // 4. Get Public/Signed URL (Assuming public for now, or signed later)
        // For RAG, we need server-side access mostly.
        const { data: { publicUrl } } = supabase.storage
            .from("materials")
            .getPublicUrl(fileName);

        console.log("[UPLOAD] Public URL:", publicUrl);

        // 5. Save Metadata to Prisma
        // First ensure User exists in Prisma (sync from Auth if needed, usually via hooks, but lazy create here for safety)
        let dbUser = await prisma.user.findUnique({ where: { id: user.id } });
        if (!dbUser) {
            console.log("[UPLOAD] Creating new DB user...");
            dbUser = await prisma.user.create({
                data: {
                    id: user.id,
                    email: user.email!,
                    name: user.user_metadata?.full_name || "Student",
                    role: "STUDENT"
                }
            });
        }

        const studyMaterial = await prisma.studyMaterial.create({
            data: {
                userId: user.id,
                title: file.name,
                type: mapFileType(file.type),
                contentUrl: publicUrl, // or uploadData.path
                language: "en", // Default, detect later
            },
        });

        console.log("[UPLOAD] StudyMaterial created:", studyMaterial.id);

        // 6. Trigger AI Processing (Python Microservice) and Persist Data
        try {
            const aiResponse = await fetch("http://localhost:8000/process", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    file_url: publicUrl,
                    file_type: mapFileType(file.type),
                }),
            });

            if (!aiResponse.ok) {
                const errorText = await aiResponse.text();
                console.error("[UPLOAD] AI Service failed:", aiResponse.status, errorText);
            } else {
                const aiResult = await aiResponse.json();
                console.log("[UPLOAD] AI Result received:", JSON.stringify(aiResult).substring(0, 500));

                const aiData = aiResult.ai_data;

                if (aiData) {
                    console.log("[UPLOAD] Persisting AI Data to DB...");
                    // Update Material with Summary
                    await prisma.studyMaterial.update({
                        where: { id: studyMaterial.id },
                        data: {
                            summary: aiData.summary,
                        }
                    });
                    console.log("[UPLOAD] Summary updated.");

                    // Create Flashcards Deck
                    if (aiData.flashcards && aiData.flashcards.length > 0) {
                        await prisma.deck.create({
                            data: {
                                materialId: studyMaterial.id,
                                title: "Key Concepts",
                                cards: {
                                    create: aiData.flashcards.map((card: any) => ({
                                        front: card.front,
                                        back: card.back,
                                        difficulty: "MEDIUM"
                                    }))
                                }
                            }
                        });
                    }

                    // Create Quiz
                    if (aiData.quiz && aiData.quiz.length > 0) {
                        await prisma.quiz.create({
                            data: {
                                materialId: studyMaterial.id,
                                title: "Practice Quiz",
                                questions: {
                                    create: aiData.quiz.map((q: any) => ({
                                        question: q.question,
                                        options: q.options,
                                        correctAnswer: q.answer,
                                        explanation: "Generated by AI"
                                    }))
                                }
                            }
                        });
                    }
                }
            }

        } catch (e) {
            console.error("Python Trigger Error:", e);
        }

        return NextResponse.json({ success: true, material: studyMaterial });

    } catch (error) {
        console.error("Upload Handler Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

function mapFileType(mimeType: string) {
    if (mimeType.includes("pdf")) return "PDF";
    if (mimeType.includes("presentation")) return "POWERPOINT";
    if (mimeType.includes("word")) return "WORD";
    if (mimeType.includes("image")) return "IMAGE";
    if (mimeType.includes("audio")) return "AUDIO";
    return "Ref_TEXT";
}
