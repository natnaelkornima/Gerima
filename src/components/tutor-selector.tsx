"use client"

import { useRouter, useSearchParams } from "next/navigation"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { BookOpen } from "lucide-react"

interface TutorSelectorProps {
    materials: { id: string, title: string }[]
    currentId: string
}

export function TutorSelector({ materials, currentId }: TutorSelectorProps) {
    const router = useRouter()

    return (
        <Select
            value={currentId}
            onValueChange={(val) => router.push(`/dashboard/tutor?doc=${val}`)}
        >
            <SelectTrigger className="w-[200px] lg:w-[300px] bg-card shadow-sm border-primary/20 hover:border-primary/40 transition-all">
                <SelectValue placeholder="Choose a document..." />
            </SelectTrigger>
            <SelectContent>
                {materials.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                        <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-primary/60" />
                            <span className="truncate max-w-[150px] lg:max-w-[220px]">{m.title}</span>
                        </div>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}
