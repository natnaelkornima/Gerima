import { createClient } from "@/lib/supabase/server"
import prisma from "@/lib/prisma"

export const dynamic = 'force-dynamic'
import Link from "next/link"
import { FileText, FileAudio, FileImage, Presentation, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DeleteMaterialButton } from "@/components/delete-material-button"

const typeIcons: Record<string, React.ReactNode> = {
    PDF: <FileText className="h-8 w-8 text-red-500" />,
    AUDIO: <FileAudio className="h-8 w-8 text-purple-500" />,
    IMAGE: <FileImage className="h-8 w-8 text-green-500" />,
    POWERPOINT: <Presentation className="h-8 w-8 text-orange-500" />,
}

export default async function LibraryPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

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
                        <div key={material.id} className="relative group flex flex-col">
                            <Link href={`/dashboard/library/${material.id}`} className="flex-1">
                                <div className="p-6 border rounded-xl bg-card hover:border-primary transition-all cursor-pointer h-full flex flex-col group-hover:shadow-md">
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
                                    <p className="text-sm text-muted-foreground line-clamp-2 mb-10">
                                        {material.summary?.substring(0, 100) || "Processing..."}
                                    </p>
                                    <div className="flex gap-2 text-[10px] mt-auto">
                                        <span className="px-2 py-0.5 bg-secondary rounded-full font-medium">
                                            {material.quizzes.length} Quiz{material.quizzes.length !== 1 ? "zes" : ""}
                                        </span>
                                        <span className="px-2 py-0.5 bg-secondary rounded-full font-medium">
                                            {material.decks.length} Deck{material.decks.length !== 1 ? "s" : ""}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                            <div className="absolute bottom-4 right-4 z-20">
                                <Link href={`/dashboard/tutor?doc=${material.id}`}>
                                    <Button variant="ghost" size="sm" className="h-8 gap-2 text-primary hover:text-primary hover:bg-primary/10 bg-background/50 backdrop-blur-sm border border-primary/10 shadow-sm">
                                        <MessageSquare className="h-3.5 w-3.5" />
                                        Chat
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
