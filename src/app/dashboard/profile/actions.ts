"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import prisma from "@/lib/prisma"

export async function updateProfile(formData: FormData) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) throw new Error("Unauthorized")

        const name = formData.get("name") as string

        await prisma.user.update({
            where: { id: user.id },
            data: { name }
        })

        revalidatePath("/dashboard/profile")
        return { success: true }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}
