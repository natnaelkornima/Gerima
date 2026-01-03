import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();

        // 1. Authenticate User
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // 2. Parse Form Data
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json(
                { error: "No file uploaded" },
                { status: 400 }
            );
        }

        // 3. Upload to Supabase Storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from("materials")
            .upload(fileName, file);

        if (uploadError) {
            console.error("Storage Error:", uploadError);
            return NextResponse.json(
                { error: "Failed to upload file to storage" },
                { status: 500 }
            );
        }

        // 4. Get Public/Signed URL (Assuming public for now, or signed later)
        // For RAG, we need server-side access mostly.
        const { data: { publicUrl } } = supabase.storage
            .from("materials")
            .getPublicUrl(fileName);

        // 5. Save Metadata to Prisma
        // First ensure User exists in Prisma (sync from Auth if needed, usually via hooks, but lazy create here for safety)
        let dbUser = await prisma.user.findUnique({ where: { id: user.id } });
        if (!dbUser) {
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
