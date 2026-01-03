import { createClient } from "@/lib/supabase/server"
import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import { User, Shield, Zap, Trophy, Settings as SettingsIcon } from "lucide-react"
import { ProfileForm } from "./profile-form"
import { Separator } from "@/components/ui/separator"

export default async function ProfilePage() {
    const supabase = await createClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()

    if (!authUser) notFound()

    const dbUser = await prisma.user.findUnique({
        where: { id: authUser.id }
    })

    if (!dbUser) notFound()

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12 px-4 md:px-0">
            <div className="flex flex-col gap-2 relative">
                <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
                <p className="text-muted-foreground text-lg">
                    Manage your profile, preferences, and view your study progress.
                </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
                {/* Stats Cards */}
                <div className="md:col-span-1 space-y-4">
                    <div className="p-6 rounded-2xl border bg-card/50 backdrop-blur-sm flex flex-col items-center text-center gap-4 shadow-sm">
                        <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center border-4 border-background shadow-xl">
                            <User size={48} className="text-primary" />
                        </div>
                        <div className="space-y-1">
                            <h2 className="text-xl font-bold leading-tight">{dbUser.name || "Scholar"}</h2>
                            <p className="text-sm text-muted-foreground truncate max-w-[200px]">{dbUser.email}</p>
                        </div>
                        <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                            Level {dbUser.level} Scholar
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl border bg-card/30 flex flex-col gap-1 shadow-sm">
                            <div className="flex items-center gap-2 text-orange-500 font-bold text-xs uppercase tracking-wider">
                                <Zap size={14} /> Streak
                            </div>
                            <div className="text-2xl font-bold">{dbUser.streak} Days</div>
                        </div>
                        <div className="p-4 rounded-xl border bg-card/30 flex flex-col gap-1 shadow-sm">
                            <div className="flex items-center gap-2 text-blue-500 font-bold text-xs uppercase tracking-wider">
                                <Trophy size={14} /> XP
                            </div>
                            <div className="text-2xl font-bold">{dbUser.xp.toLocaleString()}</div>
                        </div>
                    </div>
                </div>

                {/* Forms Section */}
                <div className="md:col-span-2 space-y-6">
                    <div className="rounded-2xl border bg-card overflow-hidden shadow-sm">
                        <div className="p-6 border-b bg-muted/30">
                            <h3 className="font-semibold flex items-center gap-2">
                                <Shield size={18} className="text-muted-foreground" />
                                Personal Information
                            </h3>
                        </div>
                        <div className="p-6">
                            <ProfileForm initialData={{ name: dbUser.name, email: dbUser.email }} />
                        </div>
                    </div>

                    <div className="rounded-2xl border bg-card overflow-hidden shadow-sm opacity-60 grayscale-[0.3]">
                        <div className="p-6 border-b bg-muted/30">
                            <h3 className="font-semibold flex items-center gap-2">
                                <SettingsIcon size={18} className="text-muted-foreground" />
                                Preferences (Coming Soon)
                            </h3>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <p className="text-sm font-medium">Email Notifications</p>
                                    <p className="text-xs text-muted-foreground font-light">Receive weekly study summaries.</p>
                                </div>
                                <div className="h-5 w-10 rounded-full bg-slate-200" />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <p className="text-sm font-medium">High Performance Mode</p>
                                    <p className="text-xs text-muted-foreground font-light">Faster AI responses with reduced detail.</p>
                                </div>
                                <div className="h-5 w-10 rounded-full bg-slate-200" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
