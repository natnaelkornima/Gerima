import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import Link from "next/link";
import { ArrowRight, Upload, BookOpen, BrainCircuit } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 flex flex-col">
        {/* Hero Section */}
        <section className="flex-1 flex flex-col items-center justify-center space-y-10 py-24 text-center md:py-32 lg:py-40 bg-gradient-to-b from-background to-secondary/20">
          <div className="container px-4 md:px-6 flex flex-col items-center space-y-6">
            <div className="space-y-4 max-w-3xl">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                Study Smarter, <br className="hidden sm:inline" /> Not Harder.
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Upload your lectures, slides, and notes. let A+ Gerima turn them into interactive quizzes, summaries, and a personal AI tutor.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 min-w-[300px] justify-center">
              <Link href="/dashboard">
                <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-lg gap-2">
                  Get Started <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/demo">
                <Button variant="outline" size="lg" className="w-full sm:w-auto h-12 px-8 text-lg">
                  View Demo
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="container px-4 py-12 md:py-24 lg:py-32">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center space-y-4 p-6 rounded-xl border bg-card text-card-foreground shadow-sm">
              <div className="p-3 bg-primary/10 rounded-full">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Smart Import</h3>
              <p className="text-center text-muted-foreground">
                Drag & drop PDFs, PowerPoints, or audio. We handle the rest with advanced OCR and transcription.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 p-6 rounded-xl border bg-card text-card-foreground shadow-sm">
              <div className="p-3 bg-primary/10 rounded-full">
                <BrainCircuit className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">AI Tutor</h3>
              <p className="text-center text-muted-foreground">
                Chat with your materials. Ask questions in English or Amharic and get instant, cited answers.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 p-6 rounded-xl border bg-card text-card-foreground shadow-sm">
              <div className="p-3 bg-primary/10 rounded-full">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Active Recall</h3>
              <p className="text-center text-muted-foreground">
                Automatically generated flashcards and quizzes to ensure you retain what you learn.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
