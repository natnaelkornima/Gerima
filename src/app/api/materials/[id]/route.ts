import { NextRequest, NextResponse } from "next/server";
import { createRouteClient } from "@/lib/supabase/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const { supabase } = createRouteClient(req);
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        // 1. Fetch Material to get storage path
        const material = await prisma.studyMaterial.findUnique({
            where: { id, userId: user.id }
        });

        if (!material) {
            return NextResponse.json({ error: "Material not found" }, { status: 404 });
        }

        // 2. Delete from Supabase Storage
        if (material.contentUrl) {
            const urlParts = material.contentUrl.split('/materials/');
            if (urlParts.length > 1) {
                const storagePath = urlParts[1];
                const { error: storageError } = await supabase.storage
                    .from("materials")
                    .remove([storagePath]);

                if (storageError) {
                    console.error("[DELETE] Storage error:", storageError);
                }
            }
        }

        // 3. Delete from Database
        await prisma.studyMaterial.delete({
            where: { id }
        });

        return NextResponse.json({ success: true, message: "Material deleted successfully" });

    } catch (error) {
        console.error("[DELETE] Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
