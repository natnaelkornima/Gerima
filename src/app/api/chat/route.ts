import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { materialId, role, content } = body

        if (!materialId || !role || !content) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        // Fallback for Windows Prisma lock
        let message;
        try {
            if ((prisma as any).chatMessage) {
                message = await (prisma as any).chatMessage.create({
                    data: {
                        materialId,
                        role,
                        content,
                    },
                })
            } else {
                const results: any[] = await prisma.$queryRawUnsafe(
                    `INSERT INTO "ChatMessage" ("id", "materialId", "role", "content", "createdAt") 
                     VALUES (gen_random_uuid(), $1, $2, $3, NOW()) 
                     RETURNING *`,
                    materialId, role, content
                )
                message = results[0]
            }
        } catch (e) {
            console.error("Persistence Error:", e)
            // Still return success so chat isn't blocked by persistence failure
            return NextResponse.json({ success: true, persisted: false })
        }

        return NextResponse.json(message)
    } catch (error) {
        console.error("[CHAT_PERSISTENCE_ERROR]", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
