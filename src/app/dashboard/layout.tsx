import { AppSidebar } from "@/components/app-sidebar"
import { createClient } from "@/lib/supabase/server"
import prisma from "@/lib/prisma"

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()

    let dbUser = null
    if (authUser) {
        dbUser = await prisma.user.findUnique({
            where: { id: authUser.id }
        })
    }

    return (
        <div className="flex min-h-screen bg-background text-foreground">
            <AppSidebar user={dbUser ? {
                name: dbUser.name || "Scholar",
                email: dbUser.email,
                level: dbUser.level,
                xp: dbUser.xp
            } : null} />
            <main className="flex-1 md:pl-20 lg:pl-64 transition-all duration-300">
                <div className="container mx-auto p-4 md:p-8 pt-20 md:pt-8 min-h-screen">
                    {children}
                </div>
            </main>
        </div>
    )
}
