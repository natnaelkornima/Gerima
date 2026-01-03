"use client"

import { useState, useRef, useEffect } from "react"
import { Send, User, Bot, Loader2, Sparkles, Command } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Message {
    role: "user" | "bot"
    content: string
}

interface ChatTutorProps {
    materialId: string
    materialTitle: string
    initialMessages?: Message[]
}

export function ChatTutor({ materialId, materialTitle, initialMessages = [] }: ChatTutorProps) {
    const router = useRouter()
    const [messages, setMessages] = useState<Message[]>(initialMessages.length > 0 ? initialMessages : [
        {
            role: "bot",
            content: `Hello! I'm your Gerima AI Tutor. I'm ready to discuss **${materialTitle}** with you. What would you like to explore?`
        }
    ])
    const [input, setInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (initialMessages.length > 0) {
            setMessages(initialMessages)
        } else {
            setMessages([{
                role: "bot",
                content: `Hello! I'm your Gerima AI Tutor. I'm ready to discuss **${materialTitle}** with you. What would you like to explore?`
            }])
        }
    }, [materialId, initialMessages, materialTitle])

    useEffect(() => {
        const timer = setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
        }, 100)
        return () => clearTimeout(timer)
    }, [messages, isLoading])

    const handleSend = async (text?: string) => {
        const messageToSend = text || input
        if (!messageToSend.trim() || isLoading) return

        const userMsg: Message = { role: "user", content: messageToSend }
        setMessages(prev => [...prev, userMsg])
        setInput("")
        setIsLoading(true)

        try {
            const history = messages.slice(-10).map(m => ({
                role: m.role === "bot" ? "assistant" : "user",
                content: m.content
            }))

            const res = await fetch("/api/chat", {
                method: "POST",
                body: JSON.stringify({ materialId, message: messageToSend, history }),
                headers: { "Content-Type": "application/json" }
            })

            const data = await res.json()
            if (data.success) {
                setMessages(prev => [...prev, { role: "bot", content: data.response }])
                router.refresh()
            } else {
                toast.error(data.error || "Failed to get response")
            }
        } catch (error) {
            toast.error("An error occurred")
        } finally {
            setIsLoading(false)
        }
    }

    const suggestions = [
        "Give me a deep summary",
        "Explain the key concepts",
        "Create a study plan for this",
    ]

    return (
        <div className="flex flex-col h-full bg-background/30 chat-container">
            {/* Message Area - Full Height */}
            <div className="flex-1 overflow-y-auto scroll-smooth hide-scrollbar px-4 md:px-0">
                <div className="max-w-4xl mx-auto py-12 pb-40 space-y-10">
                    <AnimatePresence initial={false}>
                        {messages.map((msg, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ duration: 0.5, ease: "circOut" }}
                                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div className={`flex gap-2 max-w-[90%] md:max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm transition-transform hover:scale-105 ${msg.role === "user"
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-background border-2 border-primary/20 text-primary"
                                        }`}>
                                        {msg.role === "user" ? <User size={14} /> : <Bot size={14} />}
                                    </div>
                                    <div className={`relative p-3 px-4 rounded-2xl shadow-sm text-sm ${msg.role === "user"
                                        ? "bg-primary text-primary-foreground rounded-tr-none shadow-primary/10"
                                        : "bg-card/70 backdrop-blur-xl text-foreground border border-primary/10 rounded-tl-none prose prose-sm prose-indigo dark:prose-invert max-w-none prose-p:leading-normal"
                                        }`}>
                                        {msg.role === "user" ? (
                                            <p className="whitespace-pre-wrap">{msg.content}</p>
                                        ) : (
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                {msg.content}
                                            </ReactMarkdown>
                                        )}

                                        {/* Subtle corner accent */}
                                        <div className={`absolute top-0 ${msg.role === "user" ? "-right-1 border-l-primary" : "-left-1 border-r-card"} border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent`} />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {isLoading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex justify-start gap-2"
                        >
                            <div className="h-8 w-8 rounded-lg bg-background border-2 border-primary/15 flex items-center justify-center shadow-sm">
                                <Bot size={14} className="animate-pulse text-primary font-bold" />
                            </div>
                            <div className="bg-primary/5 p-3 px-4 rounded-xl rounded-tl-none border border-primary/10 backdrop-blur-sm shadow-sm flex items-center gap-2">
                                <span className="text-primary font-bold text-[10px] mr-1 uppercase tracking-tighter">Thinking</span>
                                <div className="flex gap-1">
                                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                    <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                    <span className="w-1.5 h-1.5 bg-primary/30 rounded-full animate-bounce"></span>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    <div ref={messagesEndRef} className="h-10" />
                </div>
            </div>

            {/* Input Station - Compact & Low Profile */}
            <div className="fixed bottom-0 left-0 right-0 md:left-20 lg:left-64 p-4 md:p-6 pointer-events-none z-20">
                <div className="max-w-3xl mx-auto pointer-events-auto">
                    {messages.length < 3 && !isLoading && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-wrap gap-2 mb-4 justify-center"
                        >
                            {suggestions.map((s, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleSend(s)}
                                    className="text-[11px] font-bold px-3 py-1.5 rounded-xl bg-background/80 border border-primary/20 hover:border-primary hover:bg-primary/5 transition-all flex items-center gap-1.5 backdrop-blur-xl shadow-md"
                                >
                                    <Sparkles size={12} className="text-primary" />
                                    {s}
                                </button>
                            ))}
                        </motion.div>
                    )}

                    <div className="relative group">
                        <div className="relative flex gap-2 items-center bg-background/95 backdrop-blur-2xl rounded-2xl p-1.5 px-3 shadow-2xl border border-primary/10 focus-within:border-primary/40 transition-all duration-300">
                            <div className="hidden md:flex pl-1 text-primary/30">
                                <Command size={18} />
                            </div>
                            <Input
                                placeholder="Ask Gerima..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                className="border-none focus-visible:ring-0 shadow-none bg-transparent text-sm md:text-base h-10 md:h-11 placeholder:text-muted-foreground/30 font-medium"
                                disabled={isLoading}
                            />
                            <Button
                                size="icon"
                                onClick={() => handleSend()}
                                disabled={isLoading || !input.trim()}
                                className="shrink-0 rounded-xl h-9 w-9 md:h-10 md:w-10 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all"
                            >
                                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
