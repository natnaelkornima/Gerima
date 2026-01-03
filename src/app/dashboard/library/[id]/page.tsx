import { createClient } from "@/lib/supabase/server"
import { PrismaClient } from "@prisma/client"
import { notFound } from "next/navigation"
import { MaterialView } from "@/components/material-view"

const prisma = new PrismaClient()

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function MaterialDetailPage({ params }: PageProps) {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Middleware handles redirect, but guard against edge case
    if (!user) {
        notFound()
    }

    const material = await prisma.studyMaterial.findUnique({
        where: { id, userId: user.id },
        include: {
            decks: {
                include: { cards: true }
            },
            quizzes: {
                include: { questions: true }
            }
        }
    })

    if (!material) {
        notFound()
    }

    // Flatten flashcards from all decks
    const flashcards = material.decks.flatMap(deck =>
        deck.cards.map(card => ({
            id: card.id,
            front: card.front,
            back: card.back
        }))
    )

    // Flatten quiz questions
    const quizQuestions = material.quizzes.flatMap(quiz =>
        quiz.questions.map(q => ({
            id: q.id,
            question: q.question,
            options: q.options,
            correctAnswer: q.correctAnswer
        }))
    )

    return (
        <MaterialView
            material={{
                id: material.id,
                title: material.title,
                summary: material.summary,
                type: material.type,
                createdAt: material.createdAt
            }}
            flashcards={flashcards}
            quizQuestions={quizQuestions}
        />
    )
}
