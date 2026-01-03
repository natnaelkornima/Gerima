"use client"

import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { GraduationCap, ArrowRight } from "lucide-react"

export function Navbar() {
    return (
        <header className="fixed top-0 z-[100] w-full border-b border-white/5 bg-[#050505]/60 backdrop-blur-xl supports-[backdrop-filter]:bg-[#050505]/40 transition-all duration-500">
            <div className="container mx-auto flex h-20 items-center px-6 justify-between">
                <div className="flex items-center gap-12">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="h-10 w-10 rounded-xl bg-violet-600 flex items-center justify-center shadow-lg shadow-violet-600/20 group-hover:scale-110 transition-transform duration-300">
                            <GraduationCap className="text-white h-6 w-6" />
                        </div>
                        <span className="text-xl font-black italic tracking-tighter text-white">
                            A+ GERIMA
                        </span>
                    </Link>

                    <nav className="hidden lg:flex items-center space-x-8">
                        {["Manifesto", "Modules", "Intelligence", "Pricing"].map((item) => (
                            <Link
                                key={item}
                                href={`#${item.toLowerCase()}`}
                                className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/50 hover:text-white transition-colors"
                            >
                                {item}
                            </Link>
                        ))}
                    </nav>
                </div>

                <div className="flex items-center gap-6">
                    <div className="hidden sm:flex items-center gap-2">
                        <Link href="/login">
                            <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/5 font-bold uppercase tracking-widest text-[10px]">
                                Protocol Access
                            </Button>
                        </Link>
                        <Link href="/signup">
                            <Button className="bg-white text-black hover:bg-gray-200 rounded-lg px-6 font-bold uppercase tracking-widest text-[10px] flex items-center gap-2">
                                Begin Quest <ArrowRight size={14} />
                            </Button>
                        </Link>
                    </div>
                    <div className="h-8 w-px bg-white/10 hidden sm:block" />
                    <ModeToggle />
                </div>
            </div>
        </header>
    )
}
