import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"
import { User } from "lucide-react"

export async function Navbar() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-14 items-center px-4">
                <div className="mr-4 hidden md:flex">
                    <Link href="/" className="mr-6 flex items-center space-x-2">
                        <span className="hidden font-bold sm:inline-block">
                            A+ Gerima
                        </span>
                    </Link>
                    <nav className="flex items-center space-x-6 text-sm font-medium">
                        <Link
                            href="/dashboard"
                            className="transition-colors hover:text-foreground/80 text-foreground/60"
                        >
                            Dashboard
                        </Link>
                        <Link
                            href="/library"
                            className="transition-colors hover:text-foreground/80 text-foreground/60"
                        >
                            Library
                        </Link>
                    </nav>
                </div>
                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    <div className="w-full flex-1 md:w-auto md:flex-none">
                        {/* Search placeholder */}
                    </div>
                    <div className="flex items-center gap-2">
                        {user ? (
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-medium hidden sm:inline-block">
                                    {user.email}
                                </span>
                                <Link href="/dashboard">
                                    <Button variant="outline" size="sm">
                                        <User className="mr-2 h-4 w-4" /> Dashboard
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <>
                                <Link href="/login">
                                    <Button variant="ghost" size="sm">
                                        Log in
                                    </Button>
                                </Link>
                                <Link href="/signup">
                                    <Button size="sm">Sign Up</Button>
                                </Link>
                            </>
                        )}
                        <ModeToggle />
                    </div>
                </div>
            </div>
        </header>
    )
}
