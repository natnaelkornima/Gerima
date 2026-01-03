"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
    LayoutDashboard,
    UploadCloud,
    BookOpen,
    MessageSquare,
    Calendar,
    Settings,
    Menu,
    X,
    LogOut,
    GraduationCap
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { cn } from "@/lib/utils"

const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Smart Upload", href: "/dashboard/upload", icon: UploadCloud },
    { name: "Library", href: "/dashboard/library", icon: BookOpen },
    { name: "AI Tutor", href: "/dashboard/tutor", icon: MessageSquare },
    { name: "Schedule", href: "/dashboard/schedule", icon: Calendar },
]

export function AppSidebar() {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(true)
    const [isMobileOpen, setIsMobileOpen] = useState(false)

    return (
        <>
            {/* Mobile Menu Button */}
            <div className="md:hidden fixed top-4 left-4 z-50">
                <Button variant="outline" size="icon" onClick={() => setIsMobileOpen(!isMobileOpen)}>
                    {isMobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                </Button>
            </div>

            {/* Sidebar Container */}
            <AnimatePresence mode="wait">
                <motion.aside
                    data-mobile={isMobileOpen}
                    className={cn(
                        "fixed inset-y-0 left-0 z-40 flex flex-col border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300",
                        isOpen ? "w-64" : "w-20 hidden md:flex",
                        // Mobile styles
                        "data-[mobile=false]:-translate-x-full md:data-[mobile=false]:translate-x-0",
                        "data-[mobile=true]:translate-x-0 data-[mobile=true]:w-64"
                    )}
                >
                    {/* Header */}
                    <div className="flex h-16 items-center justify-between px-4 border-b">
                        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
                            <GraduationCap className="h-6 w-6" />
                            <span className={cn("transition-opacity duration-200", !isOpen && "md:hidden")}>
                                A+ Gerima
                            </span>
                        </Link>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="hidden md:flex"
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            <Menu className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Nav Items */}
                    <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <Link key={item.href} href={item.href}>
                                    <Button
                                        variant={isActive ? "secondary" : "ghost"}
                                        className={cn(
                                            "w-full justify-start mb-1",
                                            !isOpen && "md:justify-center md:px-2"
                                        )}
                                    >
                                        <item.icon className={cn("h-5 w-5", isOpen && "mr-2")} />
                                        <span className={cn(!isOpen && "md:hidden")}>{item.name}</span>
                                    </Button>
                                </Link>
                            )
                        })}
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t space-y-2">
                        <div className={cn("flex items-center gap-2", !isOpen && "md:justify-center")}>
                            <ModeToggle />
                            <span className={cn("text-sm font-medium", !isOpen && "md:hidden")}>Theme</span>
                        </div>
                        <Button variant="ghost" className={cn("w-full justify-start text-muted-foreground", !isOpen && "md:justify-center")}>
                            <LogOut className={cn("h-5 w-5", isOpen && "mr-2")} />
                            <span className={cn(!isOpen && "md:hidden")}>Logout</span>
                        </Button>
                    </div>
                </motion.aside>
            </AnimatePresence>
        </>
    )
}
