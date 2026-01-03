"use client"

import { Navbar } from "@/components/navbar-landing"
import { motion, useScroll, useTransform, useSpring } from "framer-motion"
import { ArrowRight, Sparkles, BrainCircuit, Upload, BarChart3, Globe2, Layers, ShieldCheck, ChevronRight, Users, Zap, GraduationCap } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useRef, useState } from "react"

const MagneticButton = ({ children, className, variant = "default", size = "lg" }: any) => {
  const ref = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e
    const { left, top, width, height } = ref.current?.getBoundingClientRect() || { left: 0, top: 0, width: 0, height: 0 }
    const x = clientX - (left + width / 2)
    const y = clientY - (top + height / 2)
    setPosition({ x: x * 0.3, y: y * 0.3 })
  }

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 })
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
    >
      <Button variant={variant} size={size} className={className}>
        {children}
      </Button>
    </motion.div>
  )
}

const ScrollReveal = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay, ease: "easeOut" }}
  >
    {children}
  </motion.div>
)

export default function Home() {
  const [collabActive, setCollabActive] = useState(false)

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-violet-500/30 overflow-x-hidden">
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-violet-600/10 blur-[150px] rounded-full" />
            <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />
          </div>

          <div className="container mx-auto px-4 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-4xl mx-auto space-y-10"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-bold uppercase tracking-widest mb-4 backdrop-blur-md">
                <Sparkles size={12} className="text-violet-400" />
                <span>The Sovereign Study Architecture</span>
              </div>

              <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.9] italic">
                STUDY <span className="bg-clip-text text-transparent bg-gradient-to-br from-violet-400 via-lavender-200 to-violet-600">FASTER</span>. <br />
                KNOW MORE.
              </h1>

              <p className="text-gray-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
                A+ Gerima is the executive suite for your mind. <br className="hidden md:block" />
                Advanced AI modeling meets intuitive knowledge engineering.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-8">
                <Link href="/signup">
                  <MagneticButton className="h-16 px-12 text-xl rounded-[20px] bg-violet-600 hover:bg-violet-700 shadow-[0_0_40px_rgba(124,58,237,0.3)] font-bold group">
                    Initialize Protocol
                    <ArrowRight className="ml-3 group-hover:translate-x-2 transition-transform" />
                  </MagneticButton>
                </Link>
                <Link href="/login">
                  <MagneticButton variant="ghost" className="h-16 px-12 text-xl rounded-[20px] border border-white/5 hover:bg-white/5 font-bold">
                    Resume Session
                  </MagneticButton>
                </Link>
              </div>
            </motion.div>

            {/* 3D Hero Artifact */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 80 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="mt-24 md:mt-36 max-w-6xl mx-auto relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-violet-500/10 to-transparent blur-[100px] pointer-events-none" />
              <div className="relative bg-[#050505] border border-white/10 rounded-[40px] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,1)]">
                <div className="h-14 bg-white/[0.03] border-b border-white/5 flex items-center px-8 justify-between">
                  <div className="flex gap-2">
                    <div className="h-3 w-3 rounded-full bg-white/10" />
                    <div className="h-3 w-3 rounded-full bg-white/10" />
                    <div className="h-3 w-3 rounded-full bg-white/10" />
                  </div>
                  <div className="text-[10px] font-black tracking-widest uppercase text-white/20">A+ Gerima Intelligence Display • Terminal v4.0</div>
                  <div className="w-16" />
                </div>
                <div className="p-12 md:p-20 grid md:grid-cols-5 gap-16 text-left">
                  <div className="md:col-span-3 space-y-10">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-violet-500 animate-pulse" />
                      <span className="text-xs font-bold text-violet-400 uppercase tracking-widest">Live Amharic Stream</span>
                    </div>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 1 }}
                      className="text-2xl md:text-4xl lg:text-5xl font-bold text-white/95 leading-[1.2] font-geez"
                    >
                      "እውቀት የነፃነት ቁልፍ ነው። በA+ Gerima አማካኝነት ይህንን ቁልፍ ለሁሉም ሰው ተደራሽ እናደርጋለን።"
                    </motion.p>
                    <div className="flex gap-4">
                      <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/5 text-[10px] uppercase font-bold tracking-widest text-white/40">Concept: Freedom</div>
                      <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/5 text-[10px] uppercase font-bold tracking-widest text-white/40">Context: Educational Access</div>
                    </div>
                  </div>
                  <div className="md:col-span-2 flex flex-col justify-between border-l border-white/5 pl-16">
                    <div className="space-y-6">
                      <p className="text-xs font-black uppercase tracking-widest text-white/30">Semantic Match</p>
                      <div className="space-y-2">
                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: "94%" }} transition={{ duration: 2, delay: 1 }} className="h-full bg-violet-500" />
                        </div>
                        <div className="flex justify-between text-[10px] font-mono text-white/50 uppercase">
                          <span>Intent Accuracy</span>
                          <span>94.2%</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-12 p-6 rounded-2xl bg-violet-500/5 border border-violet-500/10">
                      <p className="text-sm font-medium text-violet-300 italic mb-4">"Summary generated: Knowledge is identified as a key to freedom, with Gerima facilitating universal access through AI."</p>
                      <div className="flex items-center gap-2">
                        <div className="h-1 w-1 bg-violet-400 rounded-full" />
                        <div className="h-1 w-1 bg-violet-400 rounded-full opacity-50" />
                        <div className="h-1 w-1 bg-violet-400 rounded-full opacity-20" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="py-32 border-y border-white/5 bg-white/[0.01]">
          <div className="container mx-auto px-4 text-center">
            <ScrollReveal>
              <p className="text-[10px] uppercase tracking-[0.4em] font-black text-white/20 mb-16 underline underline-offset-8">Endorsed by Global Scholars</p>
              <div className="flex flex-wrap justify-center items-center gap-16 md:gap-32 opacity-20">
                {["OXFORD", "COLUMBIA", "MIT", "STANFORD", "YALE"].map(uni => (
                  <span key={uni} className="text-3xl font-black tracking-tighter italic">{uni}</span>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Bento Grid */}
        <section className="py-48">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="mb-32 space-y-4">
                <h2 className="text-5xl md:text-7xl font-black tracking-tighter italic text-center md:text-left">THE INTELLIGENCE <br /> BENTO.</h2>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-6 h-auto md:h-[900px]">
              {/* AI Tutor */}
              <motion.div
                whileHover={{ y: -10 }}
                className="md:col-span-2 md:row-span-2 group relative p-12 rounded-[40px] bg-gradient-to-br from-violet-600/20 via-transparent to-transparent border border-white/10 overflow-hidden flex flex-col justify-between"
              >
                <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:opacity-100 transition-opacity duration-700">
                  <BrainCircuit size={120} className="text-violet-500 rotate-12" />
                </div>
                <div className="space-y-6 relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/20 text-violet-400 text-[10px] font-bold uppercase tracking-widest">Live Engine</div>
                  <h3 className="text-4xl md:text-6xl font-black italic tracking-tighter">Live AI <br /> Study Tutor.</h3>
                  <p className="text-gray-400 text-lg leading-relaxed max-w-sm">A direct neuro-link to your study materials. Ask anything, anytime, in any tongue.</p>
                </div>
                <div className="mt-20">
                  <div className="flex items-end gap-3 h-24">
                    {[...Array(20)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{ height: [20, Math.random() * 80 + 20, 20] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                        className="w-2 md:w-3 bg-violet-500/30 rounded-full"
                      />
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Smart Import */}
              <motion.div
                whileHover={{ y: -10 }}
                className="md:col-span-2 group relative p-10 rounded-[40px] bg-white/[0.02] border border-white/5 flex flex-col md:flex-row justify-between items-center gap-10 overflow-hidden"
              >
                <div className="space-y-4 text-left">
                  <h3 className="text-3xl font-black italic tracking-tighter underline decoration-violet-500/50 underline-offset-4">Smart Import.</h3>
                  <p className="text-gray-500 text-sm max-w-[200px]">Drag, drop, and witness the frosted glass deconstruction of your PDFs and Audio.</p>
                </div>
                <div className="relative h-40 w-44">
                  <div className="absolute inset-0 bg-violet-500/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all" />
                  <div className="absolute inset-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md">
                    <Upload className="text-violet-400" size={32} />
                  </div>
                </div>
              </motion.div>

              {/* Analytics */}
              <motion.div
                whileHover={{ y: -10 }}
                className="group relative p-10 rounded-[40px] bg-white/[0.02] border border-white/5 flex flex-col justify-between overflow-hidden"
              >
                <div className="space-y-4">
                  <BarChart3 className="text-blue-500" size={32} />
                  <h3 className="text-2xl font-black italic tracking-tighter leading-none">Quantum <br /> Analytics.</h3>
                </div>
                <div className="h-24 w-full flex items-end gap-1">
                  {[40, 70, 45, 90, 65].map((h, i) => (
                    <div key={i} className="flex-1 bg-blue-500/20 rounded-t-lg group-hover:bg-blue-500/40 transition-colors" style={{ height: `${h}%` }} />
                  ))}
                </div>
              </motion.div>

              {/* Collab Toggle */}
              <motion.div
                whileHover={{ y: -10 }}
                className="group relative p-10 rounded-[40px] bg-[#0c0c0c] border border-white/5 flex flex-col justify-between overflow-hidden"
              >
                <div className="space-y-4 text-left">
                  <Users className="text-lavender-400 shadow-glow shadow-lavender-400/20" size={32} />
                  <h3 className="text-2xl font-black italic tracking-tighter leading-none">Collab <br /> Network.</h3>
                </div>
                <div
                  onClick={() => setCollabActive(!collabActive)}
                  className={`relative h-10 w-20 rounded-full cursor-pointer transition-all duration-500 p-1 ${collabActive ? 'bg-violet-600 shadow-[0_0_20px_rgba(124,58,237,0.5)]' : 'bg-white/10 border border-white/5'}`}
                >
                  <motion.div
                    animate={{ x: collabActive ? 40 : 0 }}
                    className="h-8 w-8 rounded-full bg-white shadow-lg"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Professional Library Showcase */}
        <section className="py-48 bg-white/[0.01]">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-end justify-between gap-12 mb-32">
              <ScrollReveal>
                <div className="space-y-8 max-w-2xl text-left">
                  <div className="h-px w-24 bg-violet-600" />
                  <h2 className="text-6xl md:text-8xl font-black tracking-[0.02em] leading-[0.9] italic">VAULTED <br /> REPOSITORY.</h2>
                  <p className="text-gray-500 text-xl font-medium">A high-fidelity minimalist architecture for your academic assets.</p>
                </div>
              </ScrollReveal>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { title: "NEURAL NETWORKS", count: 12, icon: BrainCircuit },
                { title: "CIVIC PROTOCOL", count: 8, icon: Globe2 },
                { title: "DATA ETHICS", count: 18, icon: ShieldCheck },
                { title: "MACRO ANALYSIS", count: 5, icon: Layers },
              ].map((topic, i) => (
                <ScrollReveal key={i} delay={i * 0.1}>
                  <motion.div
                    whileHover={{ y: -10 }}
                    className="p-10 rounded-[30px] bg-white/[0.02] border border-white/5 hover:border-violet-600/30 transition-all cursor-crosshair group"
                  >
                    <div className="h-16 w-16 rounded-2xl bg-white/[0.03] flex items-center justify-center mb-8 group-hover:bg-violet-600 group-hover:shadow-glow shadow-violet-600/40 transition-all duration-500">
                      <topic.icon size={28} className="text-violet-400 group-hover:text-white" />
                    </div>
                    <h4 className="text-lg font-black tracking-tighter mb-2 italic">{topic.title}</h4>
                    <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">{topic.count} Classified Assets</p>
                  </motion.div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Final Call to Action */}
        <section className="py-64 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-violet-600/10 to-transparent pointer-events-none" />
          <div className="container mx-auto px-4 text-center space-y-20 relative z-10">
            <ScrollReveal>
              <h2 className="text-7xl md:text-[10rem] font-black tracking-tighter leading-none italic opacity-95">ASCEND <br /> NOW.</h2>
            </ScrollReveal>
            <div className="flex flex-col md:flex-row items-center justify-center gap-10">
              <Link href="/signup">
                <MagneticButton className="h-20 px-16 text-2xl rounded-[30px] bg-white text-black hover:bg-gray-100 font-black shadow-[0_0_80px_rgba(255,255,255,0.1)] transition-all">
                  JOIN THE REGIMEN
                </MagneticButton>
              </Link>
              <div className="flex items-center gap-6 px-8 py-5 rounded-[25px] border border-white/10 backdrop-blur-lg group cursor-help">
                <Zap className="text-yellow-500 h-6 w-6 animate-pulse" />
                <span className="text-xs font-black uppercase tracking-[0.3em] text-white/40 group-hover:text-white/80 transition-colors">Neural Sync Optimized</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-24 border-t border-white/5 bg-black/90">
        <div className="container mx-auto px-4 grid md:grid-cols-4 gap-20">
          <div className="md:col-span-2 space-y-8">
            <div className="flex items-center gap-3 font-black text-2xl tracking-tighter italic">
              <div className="h-8 w-8 bg-violet-600 rounded-lg flex items-center justify-center shadow-glow shadow-violet-600/30">
                <GraduationCap size={20} />
              </div>
              <span>A+ GERIMA</span>
            </div>
            <p className="text-gray-500 text-sm font-medium leading-relaxed max-w-sm">Architecting the next epoch of individual education through autonomous knowledge management and high-fidelity AI integration.</p>
          </div>
          <div className="space-y-6">
            <p className="text-[10px] uppercase font-black tracking-widest text-violet-500">Foundation</p>
            <ul className="space-y-4 text-xs font-bold text-gray-500">
              <li className="hover:text-white cursor-pointer transition-colors">Neural Protocol</li>
              <li className="hover:text-white cursor-pointer transition-colors">Knowledge Vault</li>
              <li className="hover:text-white cursor-pointer transition-colors">Case Studies</li>
            </ul>
          </div>
          <div className="space-y-6">
            <p className="text-[10px] uppercase font-black tracking-widest text-violet-500">Governance</p>
            <ul className="space-y-4 text-xs font-bold text-gray-500">
              <li className="hover:text-white cursor-pointer transition-colors">Academic Ethics</li>
              <li className="hover:text-white cursor-pointer transition-colors">Privacy Paradigm</li>
              <li className="hover:text-white cursor-pointer transition-colors">Support Lab</li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-24 pt-12 border-t border-white/5 text-[9px] font-black tracking-[0.4em] text-gray-700 text-center uppercase">
          © 2026 GERIMA ARTIFICIAL INTELLIGENCE LABS. ALL REQUISITIONS REGISTERED.
        </div>
      </footer>

      <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Ethiopic:wght@400;700;900&display=swap');
                
                .font-geez {
                    font-family: 'Noto Sans Ethiopic', sans-serif;
                }
                .shadow-glow {
                    box-shadow: 0 0 30px var(--tw-shadow-color);
                }
                @keyframes pulse-soft {
                    0%, 100% { opacity: 0.1; }
                    50% { opacity: 0.3; }
                }
                .animate-pulse-soft {
                    animation: pulse-soft 10s ease-in-out infinite;
                }
            `}</style>
    </div>
  )
}
