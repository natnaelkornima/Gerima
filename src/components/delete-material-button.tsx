"use client"

import { useState } from "react"
import { Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { deleteMaterial } from "@/app/dashboard/library/actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface DeleteButtonProps {
    id: string
    title: string
    variant?: "icon" | "full"
}

export function DeleteMaterialButton({ id, title, variant = "icon" }: DeleteButtonProps) {
    const [isDeleting, setIsDeleting] = useState(false)
    const router = useRouter()

    const handleDelete = async (e: React.MouseEvent) => {
        // Stop propagation so we don't trigger the parent Link
        e.preventDefault()
        e.stopPropagation()

        if (!confirm(`Are you sure you want to delete "${title}"?`)) return

        setIsDeleting(true)
        try {
            const result = await deleteMaterial(id)
            if (result.success) {
                toast.success("Material deleted")
                router.refresh()
            } else {
                toast.error(result.error || "Failed to delete")
            }
        } catch (error) {
            toast.error("An error occurred")
        } finally {
            setIsDeleting(false)
        }
    }

    if (variant === "icon") {
        return (
            <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                onClick={handleDelete}
                disabled={isDeleting}
            >
                {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            </Button>
        )
    }

    return (
        <Button
            variant="destructive"
            className="w-full sm:w-auto"
            onClick={handleDelete}
            disabled={isDeleting}
        >
            {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
            Delete Material
        </Button>
    )
}
