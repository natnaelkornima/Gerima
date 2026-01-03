"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ArrowLeft, RefreshCw, Check, X, Sparkles, Loader2 } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { DeleteMaterialButton } from "@/components/delete-material-button"

interface MaterialViewProps {
    material: {
        id: string
        title: string
        summary: string | null
        type: string
        createdAt: Date
    }
    flashcards: { id: string; front: string; back: string }[]
    quizQuestions: { id: string; question: string; options: string[]; correctAnswer: string }[]
}

export function MaterialView({ material, flashcards: initialFlashcards, quizQuestions: initialQuiz }: MaterialViewProps) {
    const router = useRouter()
    const [isGenerating, setIsGenerating] = useState<string | null>(null)

    // States for data (so we can update them after generation)
    const [summary, setSummary] = useState(material.summary)
    const [flashcards, setFlashcards] = useState(initialFlashcards)
    const [quizQuestions, setQuizQuestions] = useState(initialQuiz)

    // UI States
    const [currentCardIndex, setCurrentCardIndex] = useState(0)
    const [isFlipped, setIsFlipped] = useState(false)
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
    const [showResult, setShowResult] = useState(false)
    const [score, setScore] = useState(0)
    const [quizComplete, setQuizComplete] = useState(false)

    const handleGenerate = async (type: "summary" | "quiz" | "flashcards") => {
        setIsGenerating(type)
        try {
            const res = await fetch("/api/generate", {
                method: "POST",
                body: JSON.stringify({ materialId: material.id, type }),
                headers: { "Content-Type": "application/json" }
            })
            const result = await res.json()

            if (result.success) {
                toast.success(`${type} generated successfully!`)

                // For immediate UI update
                if (type === "summary") setSummary(result.data.summary)
                if (type === "flashcards") {
                    setFlashcards(result.data.flashcards.map((c: any, i: number) => ({ id: `new-${i}`, ...c })))
                }
                if (type === "quiz") {
                    setQuizQuestions(result.data.quiz.map((q: any, i: number) => ({ id: `new-${i}`, ...q, correctAnswer: q.answer })))
                }
                router.refresh()
            } else {
                toast.error(result.error || result.message || "Generation failed. Please try again.")
            }
        } catch (e) {
            toast.error("An error occurred.")
        } finally {
            setIsGenerating(null)
        }
    }

    const currentCard = flashcards[currentCardIndex]
    const currentQuestion = quizQuestions[currentQuestionIndex]

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/library">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">{material.title}</h1>
                        <p className="text-sm text-muted-foreground" suppressHydrationWarning>
                            {material.type} • {new Date(material.createdAt).toLocaleDateString("en-US")}
                        </p>
                    </div>
                </div>
                <DeleteMaterialButton id={material.id} title={material.title} variant="full" />
            </div>

            <Tabs defaultValue="summary" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="summary">Summary</TabsTrigger>
                    <TabsTrigger value="flashcards">Flashcards {flashcards.length > 0 && `(${flashcards.length})`}</TabsTrigger>
                    <TabsTrigger value="quiz">Quiz {quizQuestions.length > 0 && `(${quizQuestions.length})`}</TabsTrigger>
                </TabsList>

                {/* Summary Tab */}
                <TabsContent value="summary" className="mt-6">
                    <div className="p-6 border rounded-lg bg-card min-h-[300px] flex flex-col items-center justify-center text-center">
                        {summary ? (
                            <div className="prose dark:prose-invert max-w-none text-left w-full">
                                <p className="whitespace-pre-wrap">{summary}</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="p-3 bg-primary/10 rounded-full w-fit mx-auto">
                                    <Sparkles className="h-8 w-8 text-primary" />
                                </div>
                                <h3 className="text-xl font-semibold">Ready to Summarize?</h3>
                                <p className="text-muted-foreground max-w-sm">
                                    Our AI can create a concise summary of your document in seconds.
                                </p>
                                <Button
                                    onClick={() => handleGenerate("summary")}
                                    disabled={isGenerating !== null}
                                >
                                    {isGenerating === "summary" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                                    Generate Summary
                                </Button>
                            </div>
                        )}
                    </div>
                </TabsContent>

                {/* Flashcards Tab */}
                <TabsContent value="flashcards" className="mt-6">
                    {flashcards.length === 0 ? (
                        <div className="text-center py-20 border rounded-lg bg-card space-y-4 flex flex-col items-center">
                            <div className="p-3 bg-primary/10 rounded-full w-fit mx-auto">
                                <Sparkles className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold">No Flashcards yet</h3>
                            <p className="text-muted-foreground">Turn your notes into a smart study deck.</p>
                            <Button
                                onClick={() => handleGenerate("flashcards")}
                                disabled={isGenerating !== null}
                            >
                                {isGenerating === "flashcards" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                                Create Study Deck
                            </Button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-6">
                            <div className="relative w-full max-w-md aspect-[3/2] perspective-1000">
                                <motion.div
                                    className="w-full h-full cursor-pointer"
                                    onClick={() => setIsFlipped(!isFlipped)}
                                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                                    transition={{ duration: 0.6 }}
                                    style={{ transformStyle: "preserve-3d" }}
                                >
                                    <div className="absolute inset-0 flex items-center justify-center p-6 border rounded-xl bg-card backface-hidden shadow-sm overflow-auto" style={{ backfaceVisibility: "hidden" }}>
                                        <p className="text-xl font-medium text-center">{currentCard?.front}</p>
                                    </div>
                                    <div className="absolute inset-0 flex items-center justify-center p-6 border rounded-xl bg-primary/5 backface-hidden shadow-sm overflow-auto" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
                                        <p className="text-lg text-center">{currentCard?.back}</p>
                                    </div>
                                </motion.div>
                            </div>
                            <div className="flex gap-4 items-center">
                                <Button variant="outline" size="icon" onClick={() => { setIsFlipped(false); setCurrentCardIndex((i) => (i - 1 + flashcards.length) % flashcards.length) }}>
                                    <ArrowLeft className="h-4 w-4" />
                                </Button>
                                <span className="text-sm font-medium">
                                    {currentCardIndex + 1} / {flashcards.length}
                                </span>
                                <Button variant="outline" size="icon" className="rotate-180" onClick={() => { setIsFlipped(false); setCurrentCardIndex((i) => (i + 1) % flashcards.length) }}>
                                    <ArrowLeft className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </TabsContent>

                {/* Quiz Tab */}
                <TabsContent value="quiz" className="mt-6">
                    {quizQuestions.length === 0 ? (
                        <div className="text-center py-20 border rounded-lg bg-card space-y-4 flex flex-col items-center">
                            <div className="p-3 bg-primary/10 rounded-full w-fit mx-auto">
                                <Sparkles className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold">Test your knowledge</h3>
                            <p className="text-muted-foreground">Generate a quiz based on the key concepts of this document.</p>
                            <Button
                                onClick={() => handleGenerate("quiz")}
                                disabled={isGenerating !== null}
                            >
                                {isGenerating === "quiz" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                                Start AI Quiz
                            </Button>
                        </div>
                    ) : quizComplete ? (
                        <div className="text-center py-12 border rounded-lg bg-card space-y-4">
                            <h2 className="text-2xl font-bold">Quiz Complete!</h2>
                            <p className="text-4xl font-bold text-primary">{score} / {quizQuestions.length}</p>
                            <Button onClick={() => { setQuizComplete(false); setCurrentQuestionIndex(0); setScore(0); }}>
                                Try Again
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-6 p-6 border rounded-lg bg-card">
                            <div className="flex justify-between items-center text-sm text-muted-foreground">
                                <span>Question {currentQuestionIndex + 1} of {quizQuestions.length}</span>
                                <span>Score: {score}</span>
                            </div>
                            <h2 className="text-xl font-semibold">{currentQuestion?.question}</h2>
                            <div className="grid gap-3">
                                {currentQuestion?.options.map((opt, i) => {
                                    const isCorrect = opt === currentQuestion.correctAnswer
                                    const isSelected = opt === selectedAnswer
                                    return (
                                        <Button
                                            key={i}
                                            variant={showResult ? (isCorrect ? "default" : (isSelected ? "destructive" : "outline")) : (isSelected ? "default" : "outline")}
                                            className="justify-start h-auto py-3 px-4 text-left"
                                            onClick={() => {
                                                if (selectedAnswer) return
                                                setSelectedAnswer(opt)
                                                setShowResult(true)
                                                if (opt === currentQuestion.correctAnswer) setScore(s => s + 1)
                                            }}
                                            disabled={showResult}
                                        >
                                            <span className="flex-1">{opt}</span>
                                            {showResult && isCorrect && <Check className="ml-2 h-4 w-4 text-white" />}
                                            {showResult && isSelected && !isCorrect && <X className="ml-2 h-4 w-4 text-white" />}
                                        </Button>
                                    )
                                })}
                            </div>
                            {showResult && (
                                <Button className="w-full mt-4" onClick={() => {
                                    if (currentQuestionIndex < quizQuestions.length - 1) {
                                        setCurrentQuestionIndex(i => i + 1)
                                        setSelectedAnswer(null)
                                        setShowResult(false)
                                    } else {
                                        setQuizComplete(true)
                                    }
                                }}>
                                    {currentQuestionIndex === quizQuestions.length - 1 ? "Finish" : "Next"}
                                </Button>
                            )}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    )
}
