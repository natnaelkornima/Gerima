"use client"

import { useState } from "react"
import { Trash2, Loader2, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { deleteMaterial } from "@/app/dashboard/library/actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { motion, AnimatePresence } from "framer-motion"

interface DeleteButtonProps {
    id: string
    title: string
    variant?: "icon" | "full"
}

export function DeleteMaterialButton({ id, title, variant = "icon" }: DeleteButtonProps) {
    const [isDeleting, setIsDeleting] = useState(false)
    const [open, setOpen] = useState(false)
    const router = useRouter()

    const handleDelete = async () => {
        setIsDeleting(true)
        try {
            const result = await deleteMaterial(id)
            if (result.success) {
                toast.success("Material deleted successfully")
                setOpen(false)
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

    const triggerButton = variant === "icon" ? (
        <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200"
            onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setOpen(true)
            }}
        >
            <Trash2 className="h-4 w-4" />
        </Button>
    ) : (
        <Button
            variant="destructive"
            className="w-full sm:w-auto shadow-lg shadow-destructive/20 hover:shadow-destructive/40 transition-all duration-300"
            onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setOpen(true)
            }}
        >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Material
        </Button>
    )

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {triggerButton}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] overflow-hidden border-none bg-background/80 backdrop-blur-xl shadow-2xl p-0">
                <AnimatePresence>
                    {open && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="p-6 space-y-4"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-full bg-destructive/10 text-destructive">
                                    <AlertTriangle className="h-6 w-6" />
                                </div>
                                <div>
                                    <DialogHeader className="text-left">
                                        <DialogTitle className="text-xl font-bold">Heads up!</DialogTitle>
                                        <DialogDescription className="text-muted-foreground">
                                            You are about to delete <span className="font-semibold text-foreground">"{title}"</span>. This action cannot be undone.
                                        </DialogDescription>
                                    </DialogHeader>
                                </div>
                            </div>

                            <DialogFooter className="flex flex-row gap-3 mt-6">
                                <Button
                                    variant="outline"
                                    className="flex-1 transition-all duration-200"
                                    onClick={() => setOpen(false)}
                                    disabled={isDeleting}
                                >
                                    Keep it
                                </Button>
                                <Button
                                    variant="destructive"
                                    className="flex-1 bg-gradient-to-r from-destructive to-red-600 hover:from-red-600 hover:to-destructive transition-all duration-300"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        handleDelete()
                                    }}
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Deleting...
                                        </>
                                    ) : (
                                        "Delete"
                                    )}
                                </Button>
                            </DialogFooter>
                        </motion.div>
                    )}
                </AnimatePresence>
            </DialogContent>
        </Dialog>
    )
}
