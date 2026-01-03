import { createClient } from "@/lib/supabase/server"
import { PrismaClient } from "@prisma/client"
import { Bot, GraduationCap } from "lucide-react"
import { ChatTutor } from "@/components/chat-tutor"
import { TutorSelector } from "@/components/tutor-selector"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const prisma = new PrismaClient()

export default async function TutorPage({
    searchParams
}: {
    searchParams: { doc?: string }
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    const materials = await prisma.studyMaterial.findMany({
        where: { userId: user.id },
        orderBy: { updatedAt: 'desc' }
    })

    const selectedDocId = searchParams.doc || (materials.length > 0 ? materials[0].id : "")
    const selectedDoc = materials.find(m => m.id === selectedDocId)

    // Fetch initial history using raw query as fallback while prisma client is locked on Windows
    let initialHistory: any[] = []
    if (selectedDocId) {
        try {
            if ((prisma as any).chatMessage) {
                initialHistory = await (prisma as any).chatMessage.findMany({
                    where: { materialId: selectedDocId },
                    orderBy: { createdAt: 'asc' }
                })
            } else {
                initialHistory = await prisma.$queryRawUnsafe(
                    `SELECT * FROM "ChatMessage" WHERE "materialId" = $1 ORDER BY "createdAt" ASC`,
                    selectedDocId
                )
            }
        } catch (e) {
            console.error("Tutor History Load Error:", e)
            initialHistory = []
        }
    }

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)] -mt-4 md:-mt-8 -mx-4 md:-mx-8">
            {/* Header - Stays at top */}
            <div className="px-6 py-4 md:px-10 md:py-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b bg-background/50 backdrop-blur-md z-10">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-xl">
                            <Bot className="text-primary h-6 w-6 md:h-8 md:w-8" />
                        </div>
                        AI Lab <span className="text-primary">Tutor</span>
                    </h1>
                </div>

                {materials.length > 0 && (
                    <div className="flex items-center gap-3">
                        <TutorSelector materials={materials} currentId={selectedDocId} />
                    </div>
                )}
            </div>

            <div className="flex-1 relative overflow-hidden flex flex-col">
                {materials.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                        <div className="bg-muted/30 p-8 rounded-full mb-6">
                            <GraduationCap className="h-20 w-20 text-muted-foreground opacity-50" />
                        </div>
                        <h2 className="text-3xl font-bold mb-3">Your Lab is Empty</h2>
                        <p className="text-muted-foreground max-w-sm mb-8 text-lg">
                            Upload your study materials to unlock AI-powered tutoring and deep document analysis.
                        </p>
                        <Link href="/dashboard/upload">
                            <Button size="lg" className="rounded-2xl px-10 h-14 text-lg shadow-2xl hover:shadow-primary/20 transition-all font-semibold">
                                Start Uploading
                            </Button>
                        </Link>
                    </div>
                ) : selectedDoc ? (
                    <ChatTutor
                        materialId={selectedDoc.id}
                        materialTitle={selectedDoc.title}
                        initialMessages={initialHistory.map((m: any) => ({
                            role: m.role as "user" | "bot",
                            content: m.content
                        }))}
                    />
                ) : (
                    <div className="flex-1 flex items-center justify-center text-muted-foreground text-xl font-medium italic">
                        Select a document from above to begin your session.
                    </div>
                )}
            </div>
        </div>
    )
}
