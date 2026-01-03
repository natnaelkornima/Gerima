import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { title, type, content, userId } = body

        if (!title || !type || !content || !userId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        const material = await prisma.studyMaterial.create({
            data: {
                title,
                type,
                content,
                userId,
            },
        })

        return NextResponse.json(material)
    } catch (error) {
        console.error("[GENERATE_ERROR]", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
