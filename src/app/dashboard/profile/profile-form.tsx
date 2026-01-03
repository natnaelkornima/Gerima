"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { User, Mail, Loader2 } from "lucide-react"
import { updateProfile } from "./actions"
import { toast } from "sonner"

interface ProfileFormProps {
    initialData: {
        name: string | null
        email: string
    }
}

export function ProfileForm({ initialData }: ProfileFormProps) {
    const [isPending, startTransition] = useTransition()

    const handleSubmit = async (formData: FormData) => {
        startTransition(async () => {
            const result = await updateProfile(formData)
            if (result.success) {
                toast.success("Profile updated successfully!")
            } else {
                toast.error(result.error || "Failed to update profile")
            }
        })
    }

    return (
        <form action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Display Name
                </label>
                <Input
                    name="name"
                    defaultValue={initialData.name || ""}
                    placeholder="Enter your name"
                    className="rounded-xl border-primary/10 focus-visible:ring-primary/20"
                />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium leading-none opacity-50">
                    Email Address (Locked)
                </label>
                <div className="relative">
                    <Input
                        value={initialData.email}
                        disabled
                        className="rounded-xl bg-muted/50 border-dashed border-primary/5 pl-10"
                    />
                    <Mail size={16} className="absolute left-3 top-3 text-muted-foreground" />
                </div>
            </div>
            <Button type="submit" className="rounded-xl px-8 shadow-lg shadow-primary/20" disabled={isPending}>
                {isPending ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                    </>
                ) : (
                    "Save Changes"
                )}
            </Button>
        </form>
    )
}
