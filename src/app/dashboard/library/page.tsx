import { createClient } from "@/lib/supabase/server"
import { PrismaClient } from "@prisma/client"
import Link from "next/link"
import { FileText, FileAudio, FileImage, Presentation, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DeleteMaterialButton } from "@/components/delete-material-button"

const prisma = new PrismaClient()

const typeIcons: Record<string, React.ReactNode> = {
    PDF: <FileText className="h-8 w-8 text-red-500" />,
    AUDIO: <FileAudio className="h-8 w-8 text-purple-500" />,
    IMAGE: <FileImage className="h-8 w-8 text-green-500" />,
    POWERPOINT: <Presentation className="h-8 w-8 text-orange-500" />,
}

export default async function LibraryPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Middleware handles auth redirect, but we still need user for query
    // If no user here (edge case), show empty state
    const materials = user ? await prisma.studyMaterial.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        include: {
            quizzes: true,
            decks: true,
        }
    }) : []

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Your Library</h1>
                    <p className="text-muted-foreground">
                        All your study materials in one place.
                    </p>
                </div>
                <Link href="/dashboard/upload">
                    <Button>Upload New</Button>
                </Link>
            </div>

            {materials.length === 0 ? (
                <div className="text-center py-12 border rounded-lg bg-muted/50">
                    <p className="text-muted-foreground mb-4">No materials yet.</p>
                    <Link href="/dashboard/upload">
                        <Button>Upload your first file</Button>
                    </Link>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {materials.map((material) => (
                        <Link key={material.id} href={`/dashboard/library/${material.id}`}>
                            <div className="group p-6 border rounded-xl bg-card hover:border-primary transition-colors cursor-pointer h-full flex flex-col">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        {typeIcons[material.type] || <FileText className="h-8 w-8" />}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-muted-foreground mr-2" suppressHydrationWarning>
                                            {new Date(material.createdAt).toLocaleDateString("en-US")}
                                        </span>
                                        <DeleteMaterialButton id={material.id} title={material.title} />
                                    </div>
                                </div>
                                <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                                    {material.title}
                                </h3>
                                <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
                                    {material.summary?.substring(0, 100) || "Processing..."}
                                </p>
                                <div className="flex items-center justify-between mt-4">
                                    <div className="flex gap-2 text-xs">
                                        <span className="px-2 py-1 bg-secondary rounded-full">
                                            {material.quizzes.length} Quiz{material.quizzes.length !== 1 ? "zes" : ""}
                                        </span>
                                        <span className="px-2 py-1 bg-secondary rounded-full">
                                            {material.decks.length} Deck{material.decks.length !== 1 ? "s" : ""}
                                        </span>
                                    </div>
                                    <Link href={`/dashboard/tutor?doc=${material.id}`} onClick={(e) => e.stopPropagation()}>
                                        <Button variant="ghost" size="sm" className="h-8 gap-2 text-primary hover:text-primary hover:bg-primary/10">
                                            <MessageSquare className="h-3.5 w-3.5" />
                                            Chat
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}
