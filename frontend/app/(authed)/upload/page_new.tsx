"use client"

import { useState, useRef, KeyboardEvent, ChangeEvent, useEffect } from "react"
import { useRouter } from "next/navigation"
import Header from "@/components/header"
import BackgroundBlobs from "@/components/background-blobs"
import { getProfile } from "@/lib/api/profile"
import { uploadImage } from "@/lib/api/upload"

export default function UploadPage() {
  const router = useRouter()
  const thumbnailInputRef = useRef<HTMLInputElement>(null)
  const assetsInputRef = useRef<HTMLInputElement>(null)

  const [thumbnail, setThumbnail] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("")
  const [assetFiles, setAssetFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)

  // Upload metadata
  const [fileName, setFileName] = useState("")
  const [description, setDescription] = useState("")
  const [keywords, setKeywords] = useState<string[]>([])
  const [keywordInput, setKeywordInput] = useState("")

  const [user, setUser] = useState({
    username: "",
    email: "",
  })

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const response = await getProfile()
      setUser(response.user)
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  }

  const handleThumbnailSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      setThumbnail(file)
      setThumbnailPreview(URL.createObjectURL(file))
    }
  }

  const handleAssetsSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files
    if (selectedFiles && selectedFiles.length > 0) {
      const imageFiles = Array.from(selectedFiles).filter(f => {
        if (f.type.startsWith('video/')) {
          alert(`Video files are not allowed: ${f.name}`)
          return false
        }
        return true
      })
      setAssetFiles(prev => [...prev, ...imageFiles])
    }
  }

  const removeThumbnail = () => {
    if (thumbnailPreview) {
      URL.revokeObjectURL(thumbnailPreview)
    }
    setThumbnail(null)
    setThumbnailPreview("")
  }

  const removeAssetFile = (index: number) => {
    setAssetFiles(prev => prev.filter((_, i) => i !== index))
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

  const handleUpload = async () => {
    if (!thumbnail) {
      alert("Thumbnail is required!")
      return
    }

    if (assetFiles.length === 0) {
      alert("Please attach at least one asset file")
      return
    }

    try {
      setUploading(true)
      
      // Create FileItem objects for the upload API
      const thumbnailItem = {
        id: 'thumbnail',
        file: thumbnail,
        previewUrl: thumbnailPreview
      }
      
      const assetItems = assetFiles.map((file, index) => ({
        id: `asset-${index}`,
        file: file,
        previewUrl: URL.createObjectURL(file)
      }))
      
      // Combine all files as attachments
      const allAttachments = [thumbnail, ...assetFiles]
      
      await uploadImage(user.email, [thumbnailItem], allAttachments, description, keywords, fileName)
      
      alert("Upload successful!")
      if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview)
      assetItems.forEach(item => URL.revokeObjectURL(item.previewUrl))
      router.push("/home")
    } catch (error) {
      console.error("Upload error:", error)
      alert("Upload failed: " + error)
    } finally {
      setUploading(false)
    }
  }

  const handleCancel = () => {
    if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview)
    router.push("/home")
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <BackgroundBlobs />
      <Header />

      <main className="relative z-10 min-h-screen pt-16">
        <div className="mx-auto max-w-4xl px-6 py-8">
          <h1 className="mb-2 text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Upload Asset
          </h1>
          <p className="mb-8 text-muted-foreground">Share your creative work with the community</p>

          <div className="rounded-3xl border border-border bg-card/50 backdrop-blur-xl p-8 shadow-2xl">
            <div className="space-y-8">

              {/* Thumbnail Section */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-lg font-bold">
                    Thumbnail <span className="text-destructive">*</span>
                  </label>
                  <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
                    Required
                  </span>
                </div>
                
                {thumbnail ? (
                  <div className="relative w-full aspect-video rounded-2xl overflow-hidden border-2 border-primary bg-card group">
                    <img
                      src={thumbnailPreview}
                      alt="Thumbnail preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button
                        onClick={() => thumbnailInputRef.current?.click()}
                        className="px-4 py-2 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition"
                      >
                        Change
                      </button>
                      <button
                        onClick={removeThumbnail}
                        className="px-4 py-2 bg-destructive text-white rounded-lg font-semibold hover:bg-destructive/90 transition"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => thumbnailInputRef.current?.click()}
                    className="w-full aspect-video rounded-2xl border-2 border-dashed border-border hover:border-primary/50 bg-background hover:bg-card transition-all flex flex-col items-center justify-center gap-4 group"
                  >
                    <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition">
                      <svg
                        className="w-10 h-10 text-primary"
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
                    <div className="text-center">
                      <p className="text-lg font-semibold mb-1">Attach Thumbnail</p>
                      <p className="text-sm text-muted-foreground">Click to select an image file (PNG, JPG)</p>
                    </div>
                  </button>
                )}
                <input
                  ref={thumbnailInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={handleThumbnailSelect}
                  className="hidden"
                />
              </div>

              {/* Asset Files Section */}
              <div>
                <label className="block text-lg font-bold mb-3">
                  Asset Files
                </label>
                
                {assetFiles.length > 0 && (
                  <div className="space-y-2 mb-4">
                    {assetFiles.map((file, index) => (
                      <div key={index} className="rounded-xl border border-border bg-background p-4 hover:bg-card transition">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex-shrink-0">
                            <svg
                              className="h-6 w-6 text-purple-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate">{file.name}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                          <button
                            onClick={() => removeAssetFile(index)}
                            className="flex-shrink-0 w-8 h-8 rounded-lg hover:bg-destructive/10 flex items-center justify-center transition group"
                          >
                            <svg
                              className="h-5 w-5 text-muted-foreground group-hover:text-destructive transition"
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

                <button
                  onClick={() => assetsInputRef.current?.click()}
                  className="w-full rounded-xl border-2 border-dashed border-border hover:border-primary/50 bg-background hover:bg-card px-6 py-5 transition-all flex items-center justify-center gap-3 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition">
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
                        d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                      />
                    </svg>
                  </div>
                  <span className="font-semibold">
                    {assetFiles.length === 0 ? "Attach Assets" : "Attach More Assets"}
                  </span>
                </button>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Note: Video files are not allowed
                </p>
                <input
                  ref={assetsInputRef}
                  type="file"
                  accept="image/*,.zip,.rar,.7z,.psd,.ai,.fig,.sketch"
                  multiple
                  onChange={handleAssetsSelect}
                  className="hidden"
                />
              </div>

              <div className="h-px bg-border"></div>

              {/* File Name */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  File Name
                </label>
                <input
                  type="text"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  placeholder="Enter file name"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary transition"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your asset..."
                  rows={4}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary transition resize-none"
                />
              </div>

              {/* Keywords */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Keywords
                </label>
                <input
                  type="text"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyDown={handleKeywordKeyDown}
                  placeholder="Type keyword and press Enter"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary transition"
                />
                
                {keywords.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 px-4 py-2 text-sm font-medium"
                      >
                        {keyword}
                        <button
                          onClick={() => removeKeyword(index)}
                          className="hover:bg-white/10 rounded-full p-0.5 transition"
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

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleCancel}
                  className="flex-1 rounded-xl border-2 border-border bg-background hover:bg-muted px-6 py-4 text-sm font-bold transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  disabled={!thumbnail || assetFiles.length === 0 || uploading}
                  className="flex-1 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-6 py-4 text-sm font-bold text-white transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-purple-500 disabled:hover:to-pink-500"
                >
                  {uploading ? "Uploading..." : "Upload"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
