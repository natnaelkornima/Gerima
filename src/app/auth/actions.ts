"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import prisma from "@/lib/prisma"

export async function login(formData: FormData) {
    const supabase = await createClient()

    const data = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
    }

    const { error, data: authData } = await supabase.auth.signInWithPassword(data)

    if (error) {
        return { error: error.message }
    }

    const user = authData.user
    if (user) {
        // Sync user to Prisma if they don't exist
        await prisma.user.upsert({
            where: { id: user.id },
            update: { email: user.email! },
            create: {
                id: user.id,
                email: user.email!,
                name: user.user_metadata.full_name || user.email?.split('@')[0],
            }
        })
    }

    revalidatePath("/", "layout")
    redirect("/dashboard")
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const full_name = formData.get("full_name") as string
    const data = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        options: {
            data: {
                full_name,
            }
        }
    }

    const { error, data: authData } = await supabase.auth.signUp(data)

    if (error) {
        return { error: error.message }
    }

    const user = authData.user
    if (user) {
        // Sync user to Prisma
        await prisma.user.upsert({
            where: { id: user.id },
            update: { email: user.email! },
            create: {
                id: user.id,
                email: user.email!,
                name: full_name || user.email?.split('@')[0],
            }
        })
    }

    revalidatePath("/", "layout")
    redirect("/dashboard?new=true")
}

export async function signOut() {
    const supabase = await createClient()
    const { error } = await supabase.auth.signOut()

    if (error) {
        return { error: error.message }
    }

    revalidatePath("/", "layout")
    redirect("/login")
}
