"use client"

import * as React from "react"
import { useDropzone, type FileRejection } from "react-dropzone"
import { motion, AnimatePresence } from "framer-motion"
import { UploadCloud, File, X, AlertCircle, FileAudio, FileText, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"

interface FileUploadProps {
    onUpload?: (files: File[]) => Promise<void>
    maxFiles?: number
    maxSize?: number // in bytes
    accept?: Record<string, string[]>
}

export function FileUpload({
    onUpload,
    maxFiles = 5,
    maxSize = 10 * 1024 * 1024, // 10MB
    accept = {
        'application/pdf': ['.pdf'],
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
        'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
        'image/*': ['.png', '.jpg', '.jpeg'],
        'audio/*': ['.mp3', '.wav', '.m4a']
    }
}: FileUploadProps) {
    const [files, setFiles] = React.useState<File[]>([])
    const [uploading, setUploading] = React.useState(false)
    const [progress, setProgress] = React.useState(0)

    const onDrop = React.useCallback((acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
        if (files.length + acceptedFiles.length > maxFiles) {
            toast.error(`You can only upload up to ${maxFiles} files at a time.`)
            return
        }

        if (rejectedFiles.length > 0) {
            rejectedFiles.forEach(({ errors }) => {
                if (errors[0]?.code === 'file-too-large') {
                    toast.error(`File is too large. Max size is ${maxSize / 1024 / 1024}MB`)
                } else {
                    toast.error(errors[0]?.message)
                }
            })
        }

        setFiles(prev => [...prev, ...acceptedFiles])
    }, [files, maxFiles, maxSize])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        maxFiles,
        maxSize,
        accept
    })

    const removeFile = (name: string) => {
        setFiles(files.filter(file => file.name !== name))
    }

    const handleUpload = async () => {
        if (!files.length) return
        if (!onUpload) {
            toast.info("Upload logic not implemented yet")
            return
        }

        setUploading(true)
        // Simulate upload progress if onUpload is generic, otherwise real progress usually comes from XHR
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 90) {
                    clearInterval(interval)
                    return 90
                }
                return prev + 10
            })
        }, 500)

        try {
            await onUpload(files)
            setProgress(100)
            toast.success("Files uploaded successfully!")
            setFiles([])
        } catch (error) {
            toast.error("Upload failed. Please try again.")
            console.error(error)
        } finally {
            setUploading(false)
            clearInterval(interval)
            setTimeout(() => setProgress(0), 1000)
        }
    }

    return (
        <div className="w-full max-w-2xl mx-auto space-y-4">
            <div
                {...getRootProps()}
                className={cn(
                    "border-2 border-dashed rounded-xl p-10 transition-all duration-200 ease-in-out cursor-pointer flex flex-col items-center justify-center gap-4 text-center group",
                    isDragActive
                        ? "border-primary bg-primary/5 scale-[1.01]"
                        : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50",
                    files.length > 0 && "border-solid"
                )}
            >
                <input {...getInputProps()} />
                <div className={cn(
                    "p-4 rounded-full bg-muted transition-colors group-hover:bg-background",
                    isDragActive && "bg-primary/10 text-primary"
                )}>
                    <UploadCloud className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div className="space-y-1">
                    <p className="text-lg font-medium">
                        {isDragActive ? "Drop files here" : "Click or drag files to upload"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        PDF, Audio, PowerPoint, or Images (Max {maxSize / 1024 / 1024}MB)
                    </p>
                </div>
            </div>

            <AnimatePresence>
                {files.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-2"
                    >
                        {files.map((file) => (
                            <div
                                key={file.name}
                                className="flex items-center justify-between p-3 rounded-lg border bg-card text-card-foreground shadow-sm group"
                            >
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className="p-2 rounded-md bg-primary/10">
                                        {file.type.includes('pdf') ? <FileText className="h-5 w-5 text-primary" /> :
                                            file.type.includes('audio') ? <FileAudio className="h-5 w-5 text-orange-500" /> :
                                                <File className="h-5 w-5 text-blue-500" />}
                                    </div>
                                    <div className="flex flex-col truncate">
                                        <span className="text-sm font-medium truncate">{file.name}</span>
                                        <span className="text-xs text-muted-foreground">
                                            {(file.size / 1024 / 1024).toFixed(2)} MB
                                        </span>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-muted-foreground hover:text-destructive"
                                    onClick={(e) => { e.stopPropagation(); removeFile(file.name) }}
                                    disabled={uploading}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}

                        {uploading && (
                            <div className="space-y-1 pt-2">
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>Uploading...</span>
                                    <span>{progress}%</span>
                                </div>
                                <Progress value={progress} className="h-2" />
                            </div>
                        )}

                        {!uploading && (
                            <div className="flex justify-end pt-2">
                                <Button onClick={handleUpload} size="lg" className="w-full md:w-auto">
                                    Generate Study Materials
                                </Button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
