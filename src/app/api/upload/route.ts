import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const body = await req.json()
        const { title, type, content, summary } = body

        if (!title || !type || !content) {
            return new NextResponse("Missing fields", { status: 400 })
        }

        const material = await prisma.studyMaterial.create({
            data: {
                title,
                type,
                transcription: content,
                summary,
                userId: user.id
            }
        })

        return NextResponse.json(material)
    } catch (error) {
        console.error("[UPLOAD_ERROR]", error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}
