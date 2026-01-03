"use client"
import { FileUpload } from "@/components/file-upload"

export default function UploadPage() {

    const handleUpload = async (files: File[]) => {
        // TODO: Implement actual Supabase upload
        await new Promise(resolve => setTimeout(resolve, 2000))
        console.log("Uploaded files:", files)
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex flex-col gap-2 text-center md:text-left">
                <h1 className="text-3xl font-bold tracking-tight">Upload Materials</h1>
                <p className="text-muted-foreground">
                    Upload your notes, lectures (audio), or slides.
                    We'll generate summaries, flashcards, and quizzes for you.
                </p>
            </div>

            <div className="mt-8">
                <FileUpload onUpload={handleUpload} />
            </div>

            <div className="grid gap-4 md:grid-cols-3 pt-8">
                <div className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
                    <h3 className="font-semibold mb-2">📄 Documents</h3>
                    <p className="text-sm text-muted-foreground">PDF, Word, TXT (Max 10MB)</p>
                </div>
                <div className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
                    <h3 className="font-semibold mb-2">🎤 Audio</h3>
                    <p className="text-sm text-muted-foreground">MP3, WAV recordings of lectures</p>
                </div>
                <div className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
                    <h3 className="font-semibold mb-2">📸 Images</h3>
                    <p className="text-sm text-muted-foreground">Photos of whiteboard/notes</p>
                </div>
            </div>
        </div>
    )
}
