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

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 2. Parse Form Data
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        // 3. Upload to Supabase Storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from("materials")
            .upload(fileName, file);

        if (uploadError) {
            return NextResponse.json({ error: uploadError.message }, { status: 500 });
        }

        // 4. Get Public URL
        const { data: { publicUrl } } = supabase.storage
            .from("materials")
            .getPublicUrl(fileName);

        // 5. Save Metadata to Prisma
        const studyMaterial = await prisma.studyMaterial.create({
            data: {
                userId: user.id,
                title: file.name,
                type: mapFileType(file.type),
                contentUrl: publicUrl,
                language: "en",
            },
        });

        console.log("[UPLOAD] StudyMaterial created:", studyMaterial.id);

        return NextResponse.json({ success: true, material: studyMaterial });

    } catch (error) {
        console.error("Upload Handler Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
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
