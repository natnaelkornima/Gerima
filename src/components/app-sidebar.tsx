"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
    LayoutDashboard,
    UploadCloud,
    BookOpen,
    MessageSquare,
    Settings,
    Menu,
    X,
    LogOut,
    GraduationCap,
    User as UserIcon,
    ChevronUp
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { cn } from "@/lib/utils"
import { signOut } from "@/app/auth/actions"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Smart Upload", href: "/dashboard/upload", icon: UploadCloud },
    { name: "Library", href: "/dashboard/library", icon: BookOpen },
    { name: "AI Tutor", href: "/dashboard/tutor", icon: MessageSquare },
]

interface SidebarProps {
    user: {
        name: string
        email: string
        level: number
        xp: number
    } | null
}

export function AppSidebar({ user }: SidebarProps) {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(true)
    const [isMobileOpen, setIsMobileOpen] = useState(false)

    // Close mobile menu when page changes
    useEffect(() => {
        setIsMobileOpen(false)
    }, [pathname])

    const handleLogout = async () => {
        await signOut()
    }

    return (
        <>
            {/* Mobile Menu Button - Top Left */}
            <div className="md:hidden fixed top-4 left-4 z-[60]">
                <Button
                    variant="outline"
                    size="icon"
                    className="bg-background/80 backdrop-blur shadow-sm border-primary/10"
                    onClick={() => setIsMobileOpen(!isMobileOpen)}
                >
                    {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
            </div>

            {/* Mobile Backdrop */}
            <AnimatePresence>
                {isMobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsMobileOpen(false)}
                        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[45] md:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar Container */}
            <motion.aside
                data-mobile={isMobileOpen}
                initial={false}
                className={cn(
                    "fixed inset-y-0 left-0 z-50 flex flex-col border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300",
                    isOpen ? "w-64" : "w-20 hidden md:flex",
                    // Mobile states: show when isMobileOpen is true
                    isMobileOpen ? "translate-x-0 w-64 flex" : "-translate-x-full md:translate-x-0"
                )}
            >
                {/* Header */}
                <div className="flex h-16 items-center justify-between px-4 border-b">
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
                        <GraduationCap className="h-7 w-7" />
                        <span className={cn("transition-opacity duration-200", !isOpen && "md:hidden")}>
                            A+ Gerima
                        </span>
                    </Link>
                    {/* Hide hamburger toggle on desktop when closed */}
                    {isOpen && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="hidden md:flex flex-shrink-0"
                            onClick={() => setIsOpen(false)}
                        >
                            <Menu className="h-5 w-5" />
                        </Button>
                    )}
                    {/* Show simple expand button when closed on desktop */}
                    {!isOpen && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="hidden md:flex flex-shrink-0 absolute -right-4 top-1/2 -translate-y-1/2 bg-background border rounded-full h-8 w-8 shadow-sm z-50"
                            onClick={() => setIsOpen(true)}
                        >
                            <ChevronUp className="h-4 w-4 rotate-90" />
                        </Button>
                    )}
                </div>

                {/* Nav Items */}
                <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link key={item.href} href={item.href}>
                                <Button
                                    variant={isActive ? "secondary" : "ghost"}
                                    className={cn(
                                        "w-full justify-start h-12 rounded-xl transition-all duration-200",
                                        isActive ? "bg-primary/10 text-primary shadow-sm" : "hover:bg-primary/5",
                                        !isOpen && "md:justify-center md:px-0"
                                    )}
                                >
                                    <item.icon className={cn("h-6 w-6 shrink-0 transition-transform duration-200", isActive && "scale-110", isOpen ? "mr-3" : "md:mx-auto")} />
                                    <span className={cn("font-medium transition-all duration-300", !isOpen && "md:hidden md:opacity-0 md:w-0")}>{item.name}</span>
                                </Button>
                            </Link>
                        )
                    })}
                </nav>

                {/* Footer / Profile Section */}
                <div className="p-4 border-t space-y-4">
                    <div className={cn("flex items-center gap-2", !isOpen && "md:justify-center")}>
                        <ModeToggle />
                        <span className={cn("text-xs font-semibold text-muted-foreground uppercase tracking-tight", !isOpen && "md:hidden")}>Theme</span>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className={cn(
                                    "w-full h-14 p-2 rounded-2xl hover:bg-accent group transition-all duration-200",
                                    !isOpen ? "justify-center" : "justify-start px-3"
                                )}
                            >
                                <div className="flex items-center gap-3 w-full">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 flex-shrink-0 group-hover:bg-primary/20 transition-colors shadow-sm">
                                        <UserIcon size={20} className="text-primary" />
                                    </div>
                                    {isOpen && (
                                        <div className="flex flex-col items-start overflow-hidden flex-1 text-left">
                                            <p className="text-sm font-bold truncate w-full tracking-tight">{user?.name || "Scholar"}</p>
                                            <p className="text-[10px] text-muted-foreground truncate w-full font-medium">{user?.email}</p>
                                        </div>
                                    )}
                                    {isOpen && <ChevronUp size={14} className="text-muted-foreground opacity-50 group-hover:opacity-100 transition-opacity" />}
                                </div>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" side="top" className="w-64 mb-4 rounded-[20px] p-2 shadow-2xl border border-primary/10 backdrop-blur-xl bg-background/95">
                            <DropdownMenuLabel className="font-normal px-3 py-4">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-bold leading-none tracking-tight">{user?.name}</p>
                                    <p className="text-xs leading-none text-muted-foreground font-medium">{user?.email}</p>
                                </div>
                                <div className="mt-4 pt-4 border-t border-primary/5 flex items-center justify-between">
                                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                                        Level {user?.level}
                                    </div>
                                    <span className="text-[11px] text-muted-foreground font-mono font-bold tracking-tighter">{user?.xp} XP</span>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-primary/5" />
                            <Link href="/dashboard/profile">
                                <DropdownMenuItem className="rounded-xl cursor-pointer py-3 px-3 gap-3 hover:bg-primary/5 transition-colors">
                                    <Settings size={16} className="text-muted-foreground" />
                                    <span className="font-medium">Account Settings</span>
                                </DropdownMenuItem>
                            </Link>
                            <DropdownMenuItem
                                onClick={handleLogout}
                                className="rounded-xl cursor-pointer py-3 px-3 gap-3 text-destructive focus:bg-destructive/10 focus:text-destructive transition-colors"
                            >
                                <LogOut size={16} />
                                <span className="font-medium">Sign Out</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </motion.aside>
        </>
    )
}
