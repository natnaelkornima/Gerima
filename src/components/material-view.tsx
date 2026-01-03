"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ArrowLeft, RefreshCw, Check, X } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

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

export function MaterialView({ material, flashcards, quizQuestions }: MaterialViewProps) {
    // Flashcard State
    const [currentCardIndex, setCurrentCardIndex] = useState(0)
    const [isFlipped, setIsFlipped] = useState(false)

    // Quiz State
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
    const [showResult, setShowResult] = useState(false)
    const [score, setScore] = useState(0)
    const [quizComplete, setQuizComplete] = useState(false)

    const currentCard = flashcards[currentCardIndex]
    const currentQuestion = quizQuestions[currentQuestionIndex]

    const nextCard = () => {
        setIsFlipped(false)
        setTimeout(() => {
            setCurrentCardIndex((prev) => (prev + 1) % flashcards.length)
        }, 200)
    }

    const prevCard = () => {
        setIsFlipped(false)
        setTimeout(() => {
            setCurrentCardIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length)
        }, 200)
    }

    const handleAnswerSelect = (answer: string) => {
        if (selectedAnswer) return
        setSelectedAnswer(answer)
        setShowResult(true)
        if (answer === currentQuestion.correctAnswer) {
            setScore(score + 1)
        }
    }

    const nextQuestion = () => {
        if (currentQuestionIndex < quizQuestions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1)
            setSelectedAnswer(null)
            setShowResult(false)
        } else {
            setQuizComplete(true)
        }
    }

    const resetQuiz = () => {
        setCurrentQuestionIndex(0)
        setSelectedAnswer(null)
        setShowResult(false)
        setScore(0)
        setQuizComplete(false)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/library">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">{material.title}</h1>
                    <p className="text-sm text-muted-foreground">
                        {material.type} • {new Date(material.createdAt).toLocaleDateString()}
                    </p>
                </div>
            </div>

            <Tabs defaultValue="summary" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="summary">Summary</TabsTrigger>
                    <TabsTrigger value="flashcards">Flashcards ({flashcards.length})</TabsTrigger>
                    <TabsTrigger value="quiz">Quiz ({quizQuestions.length})</TabsTrigger>
                </TabsList>

                {/* Summary Tab */}
                <TabsContent value="summary" className="mt-6">
                    <div className="prose dark:prose-invert max-w-none p-6 border rounded-lg bg-card">
                        {material.summary ? (
                            <p className="whitespace-pre-wrap">{material.summary}</p>
                        ) : (
                            <p className="text-muted-foreground">Summary is being generated...</p>
                        )}
                    </div>
                </TabsContent>

                {/* Flashcards Tab */}
                <TabsContent value="flashcards" className="mt-6">
                    {flashcards.length === 0 ? (
                        <div className="text-center py-12 border rounded-lg bg-card">
                            <p className="text-muted-foreground">No flashcards available yet.</p>
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
                                    {/* Front */}
                                    <div
                                        className="absolute inset-0 flex items-center justify-center p-6 border rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 backface-hidden"
                                        style={{ backfaceVisibility: "hidden" }}
                                    >
                                        <p className="text-xl font-medium text-center">{currentCard?.front}</p>
                                    </div>
                                    {/* Back */}
                                    <div
                                        className="absolute inset-0 flex items-center justify-center p-6 border rounded-xl bg-gradient-to-br from-green-500/10 to-green-500/5 backface-hidden"
                                        style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                                    >
                                        <p className="text-lg text-center">{currentCard?.back}</p>
                                    </div>
                                </motion.div>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Card {currentCardIndex + 1} of {flashcards.length} • Click to flip
                            </p>
                            <div className="flex gap-4">
                                <Button variant="outline" onClick={prevCard}>Previous</Button>
                                <Button onClick={nextCard}>Next</Button>
                            </div>
                        </div>
                    )}
                </TabsContent>

                {/* Quiz Tab */}
                <TabsContent value="quiz" className="mt-6">
                    {quizQuestions.length === 0 ? (
                        <div className="text-center py-12 border rounded-lg bg-card">
                            <p className="text-muted-foreground">No quiz available yet.</p>
                        </div>
                    ) : quizComplete ? (
                        <div className="text-center py-12 border rounded-lg bg-card space-y-4">
                            <h2 className="text-2xl font-bold">Quiz Complete!</h2>
                            <p className="text-4xl font-bold text-primary">
                                {score} / {quizQuestions.length}
                            </p>
                            <p className="text-muted-foreground">
                                {score === quizQuestions.length ? "Perfect! 🎉" : "Keep practicing!"}
                            </p>
                            <Button onClick={resetQuiz}>
                                <RefreshCw className="mr-2 h-4 w-4" /> Try Again
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-6 p-6 border rounded-lg bg-card">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">
                                    Question {currentQuestionIndex + 1} of {quizQuestions.length}
                                </span>
                                <span className="text-sm font-medium">Score: {score}</span>
                            </div>
                            <h2 className="text-xl font-semibold">{currentQuestion?.question}</h2>
                            <div className="grid gap-3">
                                {currentQuestion?.options.map((option, i) => {
                                    const isCorrect = option === currentQuestion.correctAnswer
                                    const isSelected = option === selectedAnswer
                                    return (
                                        <Button
                                            key={i}
                                            variant="outline"
                                            className={`justify-start text-left h-auto py-3 px-4 ${showResult && isCorrect
                                                    ? "border-green-500 bg-green-500/10"
                                                    : showResult && isSelected && !isCorrect
                                                        ? "border-red-500 bg-red-500/10"
                                                        : ""
                                                }`}
                                            onClick={() => handleAnswerSelect(option)}
                                            disabled={showResult}
                                        >
                                            <span className="flex-1">{option}</span>
                                            {showResult && isCorrect && <Check className="h-4 w-4 text-green-500" />}
                                            {showResult && isSelected && !isCorrect && <X className="h-4 w-4 text-red-500" />}
                                        </Button>
                                    )
                                })}
                            </div>
                            {showResult && (
                                <Button className="w-full" onClick={nextQuestion}>
                                    {currentQuestionIndex === quizQuestions.length - 1 ? "Finish Quiz" : "Next Question"}
                                </Button>
                            )}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    )
}
