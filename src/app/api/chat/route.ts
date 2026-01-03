import { NextRequest, NextResponse } from "next/server";
import { createRouteClient } from "@/lib/supabase/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    try {
        const { supabase } = createRouteClient(req);
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { materialId, message, history } = await req.json();

        // 1. Fetch Material details (verify ownership)
        const material = await prisma.studyMaterial.findUnique({
            where: { id: materialId, userId: user.id }
        });

        if (!material || !material.contentUrl) {
            return NextResponse.json({ error: "Material not found" }, { status: 404 });
        }

        // 2. Call Python Microservice
        console.log(`[CHAT] Message for ${material.id}`);
        const aiResponse = await fetch("http://localhost:8000/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                file_url: material.contentUrl,
                file_type: material.type,
                message: message,
                history: history || []
            }),
        });

        if (!aiResponse.ok) {
            return NextResponse.json({ error: "AI Tutor service unavailable" }, { status: 500 });
        }

        const aiResult = await aiResponse.json();

        if (aiResult.status === "error") {
            return NextResponse.json({ error: aiResult.message }, { status: 500 });
        }

        const botResponse = aiResult.response;

        // 3. Persist Messages to DB (Resilient fallback for locked clients)
        try {
            if ((prisma as any).chatMessage) {
                // @ts-ignore
                await prisma.chatMessage.createMany({
                    data: [
                        { materialId, role: "user", content: message },
                        { materialId, role: "bot", content: botResponse }
                    ]
                });
            } else {
                // Fallback to raw SQL if prisma client isn't updated
                await prisma.$executeRawUnsafe(
                    `INSERT INTO "ChatMessage" (id, "materialId", role, content, "createdAt") VALUES 
                    (gen_random_uuid(), $1, 'user', $2, NOW()),
                    (gen_random_uuid(), $1, 'bot', $3, NOW())`,
                    materialId, message, botResponse
                );
            }
        } catch (dbError) {
            console.error("[CHAT] DB Save Error (Retrying with basic raw):", dbError);
            // One last attempt without gen_random_uuid in case it's not available in the current context
            try {
                await prisma.$executeRawUnsafe(
                    `INSERT INTO "ChatMessage" ("materialId", role, content) VALUES ($1, 'user', $2), ($1, 'bot', $3)`,
                    materialId, message, botResponse
                );
            } catch (innerError) {
                console.error("[CHAT] Final DB Save Error:", innerError);
            }
        }

        return NextResponse.json({ success: true, response: botResponse });

    } catch (error: any) {
        console.error("[CHAT] Error:", error.message);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
