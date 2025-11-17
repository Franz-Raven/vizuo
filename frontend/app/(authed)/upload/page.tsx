"use client"

import { useState, useRef, KeyboardEvent, ChangeEvent, useEffect, ClipboardEvent } from "react"
import { useRouter } from "next/navigation"
import Header from "@/components/header"
import BackgroundBlobs from "@/components/background-blobs"

type FileItem = {
  id: string
  file: File
  previewUrl: string
}

export default function UploadPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const previewFileInputRef = useRef<HTMLInputElement>(null)
  
  const [files, setFiles] = useState<FileItem[]>([])
  const [currentFileId, setCurrentFileId] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [attachedFiles, setAttachedFiles] = useState<File[]>([])
  
  // Batch upload metadata
  const [fileName, setFileName] = useState("")
  const [description, setDescription] = useState("")
  const [keywords, setKeywords] = useState<string[]>([])
  const [keywordInput, setKeywordInput] = useState("")

  useEffect(() => {
    // Enable paste functionality
    const handlePaste = (e: globalThis.ClipboardEvent) => {
      const items = e.clipboardData?.items
      if (!items) return

      const imageFiles: File[] = []
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile()
          if (file) imageFiles.push(file)
        }
      }

      if (imageFiles.length > 0) {
        addFiles(imageFiles)
      }
    }

    document.addEventListener('paste', handlePaste)
    return () => document.removeEventListener('paste', handlePaste)
  }, [])

  const addFiles = (newFiles: File[]) => {
    const fileItems: FileItem[] = newFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      previewUrl: URL.createObjectURL(file)
    }))

    setFiles(prev => [...prev, ...fileItems])
    
    // Select the first newly added file
    if (fileItems.length > 0 && !currentFileId) {
      setCurrentFileId(fileItems[0].id)
    }
  }

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    // This is for the "Select Files" button - save attached files
    const selectedFiles = e.target.files
    if (selectedFiles && selectedFiles.length > 0) {
      setAttachedFiles(prev => [...prev, ...Array.from(selectedFiles)])
    }
  }

  const handlePreviewUpload = (e: ChangeEvent<HTMLInputElement>) => {
    // This is for uploading images to the preview grid
    const selectedFiles = e.target.files
    if (selectedFiles && selectedFiles.length > 0) {
      addFiles(Array.from(selectedFiles))
    }
  }

  const removeAttachedFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const droppedFiles = e.dataTransfer.files
    if (droppedFiles.length > 0) {
      addFiles(Array.from(droppedFiles).filter(f => f.type.startsWith('image/')))
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const removeFile = (id: string) => {
    setFiles(prev => {
      const filtered = prev.filter(f => f.id !== id)
      const fileToRemove = prev.find(f => f.id === id)
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.previewUrl)
      }
      
      // If removing current file, select another
      if (currentFileId === id && filtered.length > 0) {
        setCurrentFileId(filtered[0].id)
      } else if (filtered.length === 0) {
        setCurrentFileId(null)
      }
      
      return filtered
    })
  }

  const handleKeywordKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && keywordInput.trim()) {
      e.preventDefault()
      if (!keywords.includes(keywordInput.trim())) {
        setKeywords(prev => [...prev, keywordInput.trim()])
      }
      setKeywordInput("")
    }
  }

  const removeKeyword = (index: number) => {
    setKeywords(prev => prev.filter((_, i) => i !== index))
  }

  const handleAttachFile = () => {
    fileInputRef.current?.click()
  }

  const handleUploadImageClick = () => {
    previewFileInputRef.current?.click()
  }

  const handleUpload = async () => {
    if (files.length === 0 && attachedFiles.length === 0) {
      alert("Please select at least one file to upload")
      return
    }

    setUploading(true)
    
    try {
      const token = localStorage.getItem("authToken")
      if (!token) {
        alert("Please login first")
        router.push("/login")
        return
      }

      // Get user email from localStorage or fetch from profile
      let userEmail = localStorage.getItem("userEmail")
      if (!userEmail) {
        try {
          const profileResponse = await fetch("http://localhost:8080/api/profile", {
            headers: { "Authorization": `Bearer ${token}` }
          })
          if (profileResponse.ok) {
            const profileData = await profileResponse.json()
            userEmail = profileData.user?.email
            if (userEmail) {
              localStorage.setItem("userEmail", userEmail)
            }
          }
        } catch (err) {
          console.error("Failed to fetch profile:", err)
        }
      }
      
      if (!userEmail) {
        alert("User session expired. Please login again.")
        router.push("/login")
        return
      }

      const formData = new FormData()
      formData.append("email", userEmail)
      
      // Add metadata
      if (fileName) formData.append("fileName", fileName)
      if (description) formData.append("description", description)
      if (keywords.length > 0) formData.append("keywords", keywords.join(","))
      
      // Add preview files
      files.forEach(fileItem => {
        formData.append("previewFiles", fileItem.file)
      })
      
      // Add attachment files
      attachedFiles.forEach(file => {
        formData.append("attachmentFiles", file)
      })

      const response = await fetch("http://localhost:8080/api/images/upload", {
        method: "POST",
        body: formData
      })

      if (response.ok) {
        alert("Upload successful!")
        // Clean up URLs
        files.forEach(f => URL.revokeObjectURL(f.previewUrl))
        router.push("/home")
      } else {
        const error = await response.text()
        alert("Upload failed: " + error)
      }
    } catch (error) {
      console.error("Upload error:", error)
      alert("Upload failed: " + error)
    } finally {
      setUploading(false)
    }
  }

  const handleCancel = () => {
    files.forEach(f => URL.revokeObjectURL(f.previewUrl))
    router.push("/home")
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <BackgroundBlobs />
      <Header />
      
      <main className="relative z-10 min-h-screen pt-16">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <h1 className="mb-8 text-3xl font-bold">Upload Image</h1>
          
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Left Side - Image Preview Grid */}
            <div className="flex flex-col gap-4">
              
              {/* Grid Preview */}
              <div 
                className="relative rounded-2xl border-2 border-dashed border-border bg-card/50 backdrop-blur-sm p-6 min-h-[500px]"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                {files.length === 0 ? (
                  <div className="grid grid-cols-2 gap-4 auto-rows-max opacity-30">
                    {/* Empty placeholder with low opacity icon */}
                    <div className="aspect-square rounded-xl border-2 border-dashed border-border bg-background/50 flex items-center justify-center">
                      <svg
                        className="h-12 w-12 text-muted-foreground"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    
                    {/* Upload Image Button with opacity */}
                    <button
                      type="button"
                      onClick={handleUploadImageClick}
                      className="aspect-square rounded-xl border-2 border-dashed border-border bg-background/50 hover:bg-background/70 hover:border-primary/50 transition flex flex-col items-center justify-center gap-2 cursor-pointer group"
                    >
                      <div className="w-12 h-12 rounded-lg border-2 border-border group-hover:border-primary/50 flex items-center justify-center transition">
                        <svg
                          className="h-6 w-6 text-muted-foreground group-hover:text-primary transition"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                      </div>
                      <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition">
                        Upload Image
                      </span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4 auto-rows-max">
                    {files.map(fileItem => (
                      <div
                        key={fileItem.id}
                        onClick={() => setCurrentFileId(fileItem.id)}
                        className={`relative aspect-square rounded-xl border-2 cursor-pointer transition overflow-hidden ${
                          currentFileId === fileItem.id
                            ? 'border-primary ring-2 ring-primary/20'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <img
                          src={fileItem.previewUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            removeFile(fileItem.id)
                          }}
                          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-destructive text-white flex items-center justify-center hover:bg-destructive/90 transition shadow-lg z-10"
                        >
                          <svg
                            className="h-3.5 w-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2.5}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                    
                    {/* Upload Image Button for preview grid */}
                    <button
                      type="button"
                      onClick={handleUploadImageClick}
                      className="aspect-square rounded-xl border-2 border-dashed border-border bg-background hover:border-primary/50 hover:bg-card transition flex flex-col items-center justify-center gap-3 group"
                    >
                      <div className="w-16 h-16 rounded-xl border-2 border-border flex items-center justify-center group-hover:border-primary/50 transition">
                        <svg
                          className="h-8 w-8 text-muted-foreground group-hover:text-primary transition"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                      </div>
                      <span className="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition">
                        Upload Image
                      </span>
                    </button>
                  </div>
                )}
                
                {/* Hidden file input for preview uploads - outside conditional */}
                <input
                  ref={previewFileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePreviewUpload}
                  className="hidden"
                />
              </div>
            </div>

            {/* Right Side - Upload Form */}
            <div className="rounded-2xl border border-border bg-card p-8 shadow-xl">
              <div className="space-y-6">

                {/* File Name Input */}
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    File Name
                  </label>
                  <input
                    type="text"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    placeholder="Enter file name"
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring transition"
                  />
                </div>

                {/* Description Input */}
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your image..."
                    rows={4}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring transition resize-none"
                  />
                </div>

                {/* Keywords Input */}
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Keywords
                  </label>
                  <input
                    type="text"
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyDown={handleKeywordKeyDown}
                    placeholder="Type keyword and press Enter"
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring transition"
                  />
                  
                  {/* Keywords Display */}
                  {keywords.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {keywords.map((keyword, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-3 py-1.5 text-sm font-medium text-primary"
                        >
                          {keyword}
                          <button
                            type="button"
                            onClick={() => removeKeyword(index)}
                            className="hover:bg-primary/20 rounded-full p-0.5 transition"
                          >
                            <svg
                              className="h-3.5 w-3.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2.5}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Attached Files Display */}
                {attachedFiles.length > 0 && (
                  <div className="space-y-2">
                    {attachedFiles.map((file, index) => (
                      <div key={index} className="rounded-xl border border-border bg-background p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
                            <svg
                              className="h-5 w-5 text-primary"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {file.name}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {file.type.split('/')[1]?.toUpperCase() || 'Image'}/{file.type.split('/')[1] || 'png'} • {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                          <button
                            onClick={() => removeAttachedFile(index)}
                            className="flex-shrink-0 w-6 h-6 rounded-full hover:bg-muted flex items-center justify-center transition"
                          >
                            <svg
                              className="h-4 w-4 text-muted-foreground"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Hidden File Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />

                {/* Attach Files Button */}
                <button
                  type="button"
                  onClick={handleAttachFile}
                  className="w-full rounded-xl border-2 border-dashed border-border bg-background px-4 py-4 text-sm font-semibold hover:border-primary/50 hover:bg-card transition flex items-center justify-center gap-2"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                    />
                  </svg>
                  {attachedFiles.length === 0 ? "Select Files" : "Attach More Files"}
                </button>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 rounded-xl border border-border bg-background px-4 py-3 text-sm font-semibold hover:bg-muted transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleUpload}
                    disabled={files.length === 0 || uploading}
                    className="flex-1 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading ? "Uploading..." : "Upload"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
