"use server"

import { createClient } from "@/lib/supabase/server"
import { PrismaClient } from "@prisma/client"
import { revalidatePath } from "next/cache"

const prisma = new PrismaClient()

export async function deleteMaterial(id: string) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) throw new Error("Unauthorized")

        // 1. Fetch to get storage path
        const material = await prisma.studyMaterial.findUnique({
            where: { id, userId: user.id }
        })

        if (!material) throw new Error("Material not found")

        // 2. Delete from Storage
        if (material.contentUrl) {
            const urlParts = material.contentUrl.split('/materials/');
            if (urlParts.length > 1) {
                const storagePath = urlParts[1];
                await supabase.storage
                    .from("materials")
                    .remove([storagePath]);
            }
        }

        // 3. Delete from DB
        await prisma.studyMaterial.delete({
            where: { id }
        })

        revalidatePath("/dashboard/library")
        return { success: true }

    } catch (error: any) {
        console.error("[DELETE ACTION] Error:", error.message)
        return { success: false, error: error.message }
    }
}
