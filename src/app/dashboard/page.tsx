import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, Book, Flame, Trophy, MessageSquare, Sparkles } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import prisma from "@/lib/prisma"

export default async function DashboardPage({
    searchParams
}: {
    searchParams: Promise<{ new?: string }>
}) {
    const isNew = (await searchParams).new === "true"
    const supabase = await createClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()

    if (!authUser) return null

    const dbUser = await prisma.user.findUnique({
        where: { id: authUser.id },
        include: {
            _count: {
                select: { materials: true }
            },
            materials: {
                take: 3,
                orderBy: { updatedAt: 'desc' }
            }
        }
    })

    if (!dbUser) return null

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col gap-2 relative">
                {isNew && (
                    <div className="absolute -top-12 left-0 right-0 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-4">
                            <Sparkles size={16} /> Welcome to A+ Gerima! Your learning journey starts here.
                        </div>
                    </div>
                )}
                <h1 className="text-3xl font-bold tracking-tight">
                    {isNew ? `Welcome, ${dbUser.name}! 🚀` : `Welcome back, ${dbUser.name}! 👋`}
                </h1>
                <p className="text-muted-foreground text-lg">
                    {isNew
                        ? "We're excited to help you excel. Start by uploading your first study material."
                        : "Ready to continue your quest for knowledge? Here's your progress."
                    }
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-orange-500/10 bg-orange-500/[0.02]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Study Streak</CardTitle>
                        <Flame className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{dbUser.streak} Days</div>
                        <p className="text-xs text-muted-foreground">Keep the flame alive! 🔥</p>
                    </CardContent>
                </Card>
                <Card className="border-blue-500/10 bg-blue-500/[0.02]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Materials</CardTitle>
                        <Book className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{dbUser._count.materials}</div>
                        <p className="text-xs text-muted-foreground">Documents analyzed</p>
                    </CardContent>
                </Card>
                <Card className="border-yellow-500/10 bg-yellow-500/[0.02]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">XP Gained</CardTitle>
                        <Trophy className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{dbUser.xp.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Level {dbUser.level} Pioneer</p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Sections */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <Card className="lg:col-span-4 rounded-2xl overflow-hidden shadow-sm">
                    <CardHeader className="border-b bg-muted/30">
                        <CardTitle className="text-lg">Recent Materials</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="">
                            {dbUser.materials.length > 0 ? (
                                dbUser.materials.map((m) => (
                                    <Link key={m.id} href={`/dashboard/library/${m.id}`}>
                                        <div className="flex items-center justify-between p-6 hover:bg-muted/50 transition-colors border-b last:border-0 group">
                                            <div className="space-y-1">
                                                <p className="font-semibold group-hover:text-primary transition-colors">{m.title}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    Added {new Date(m.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-medium px-2 py-1 bg-secondary rounded-md">
                                                    {m.type}
                                                </span>
                                                <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="p-12 text-center space-y-4">
                                    <div className="bg-muted/50 h-16 w-16 rounded-full flex items-center justify-center mx-auto text-muted-foreground">
                                        <Book size={32} />
                                    </div>
                                    <p className="text-muted-foreground italic">No materials yet. Start your journey by uploading a file!</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <div className="lg:col-span-3 space-y-6">
                    <Card className="rounded-2xl border-primary/20 bg-primary/[0.02]">
                        <CardHeader>
                            <CardTitle className="text-lg">Quick Start</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <Link href="/dashboard/upload">
                                <Button className="w-full justify-between h-14 text-lg rounded-xl group px-6 shadow-md hover:shadow-primary/20" size="lg">
                                    <span>Upload New Material</span>
                                    <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                                </Button>
                            </Link>
                            <Link href="/dashboard/tutor">
                                <Button variant="outline" className="w-full justify-between h-14 text-lg rounded-xl px-6 border-primary/10 hover:bg-primary/5 shadow-sm" size="lg">
                                    <span>Ask AI Tutor</span>
                                    <MessageSquare className="h-5 w-5 text-primary" />
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card className="rounded-2xl border-dashed opacity-70">
                        <CardHeader>
                            <CardTitle className="text-sm text-muted-foreground uppercase tracking-wider font-bold italic">Challenge of the Day</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-4">
                                <div className="bg-yellow-500/10 p-3 rounded-xl border border-yellow-500/20">
                                    <Trophy className="text-yellow-600" />
                                </div>
                                <div>
                                    <p className="font-semibold text-sm">Review 5 Flashcards</p>
                                    <p className="text-xs text-muted-foreground">+50 XP Reward</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
