"use client"

import { useState, useRef, KeyboardEvent, ChangeEvent, useEffect } from "react"
import { useRouter } from "next/navigation"
import Header from "@/components/header"
import BackgroundBlobs from "@/components/background-blobs"
import { getProfile } from "@/lib/api/profile"

export default function UploadPage() {
  const router = useRouter()
  const thumbnailInputRef = useRef<HTMLInputElement>(null)
  const assetsInputRef = useRef<HTMLInputElement>(null)

  const [thumbnail, setThumbnail] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("")
  const [assetFiles, setAssetFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [notification, setNotification] = useState<{ message: string; type: 'error' | 'info' } | null>(null)

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

  const showNotification = (message: string, type: 'error' | 'info' = 'info') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 4000)
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
          showNotification(`Video files are not allowed: ${f.name}`, 'error')
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
      showNotification("Thumbnail is required!", 'error')
      return
    }

    if (assetFiles.length === 0) {
      showNotification("Please attach at least one asset file", 'error')
      return
    }

    if (!fileName.trim()) {
      showNotification("File name is required!", 'error')
      return
    }

    if (!description.trim()) {
      showNotification("Description is required!", 'error')
      return
    }

    if (keywords.length === 0) {
      showNotification("Please add at least one keyword!", 'error')
      return
    }

    try {
      setUploading(true)
      setUploadProgress(0)
      
      const formData = new FormData()
      formData.append("email", user.email)
      formData.append("fileName", fileName)
      formData.append("description", description)
      formData.append("keywords", keywords.join(","))
      formData.append("previewFiles", thumbnail)
      
      assetFiles.forEach(file => {
        formData.append("attachmentFiles", file)
      })
      
      // Use XMLHttpRequest for real progress tracking
      const xhr = new XMLHttpRequest()
      
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = Math.round((e.loaded / e.total) * 100)
          setUploadProgress(percentComplete)
        }
      })
      
      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          setUploadProgress(100)
          if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview)
          
          // Show success modal
          setShowSuccessModal(true)
          
          // Redirect after 2 seconds
          setTimeout(() => {
            router.push("/home")
          }, 2000)
        } else {
          throw new Error(`Upload failed with status ${xhr.status}`)
        }
      })
      
      xhr.addEventListener('error', () => {
        throw new Error('Network error occurred')
      })
      
      xhr.open('POST', 'http://localhost:8080/api/images/upload')
      xhr.send(formData)
      
    } catch (error) {
      console.error("Upload error:", error)
      showNotification("Upload failed: " + error, 'error')
      setUploadProgress(0)
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

      {/* Notification */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 animate-in slide-in-from-top-5 fade-in duration-300">
          <div className={`rounded-xl border px-6 py-4 shadow-2xl backdrop-blur-xl min-w-[300px] ${
            notification.type === 'error' 
              ? 'bg-destructive/90 border-destructive text-destructive-foreground' 
              : 'bg-card/90 border-border text-foreground'
          }`}>
            <div className="flex items-center gap-3">
              {notification.type === 'error' ? (
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              <p className="text-sm font-semibold">{notification.message}</p>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="relative animate-in zoom-in-95 duration-500">
            <div className="w-64 h-64 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-2xl">
              <svg 
                className="w-32 h-32 text-white animate-in zoom-in duration-700 delay-200" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                strokeWidth={3}
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M5 13l4 4L19 7"
                  className="animate-[dash_0.6s_ease-in-out_0.3s_forwards]"
                  style={{
                    strokeDasharray: 50,
                    strokeDashoffset: 50,
                  }}
                />
              </svg>
            </div>
            <p className="text-2xl font-bold text-white text-center mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-500">
              Upload Successful!
            </p>
          </div>
        </div>
      )}

      <main className="relative z-10 min-h-screen pt-16">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <h1 className="mb-2 text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Upload Asset
          </h1>
          <p className="mb-8 text-muted-foreground">Share your creative work with the community</p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Thumbnail & Assets */}
            <div className="rounded-3xl border border-border bg-card/50 backdrop-blur-xl p-8 shadow-2xl">
              <div className="space-y-6">

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
                    <div className="relative w-full rounded-2xl overflow-hidden border-2 border-primary bg-card group">
                      <img
                        src={thumbnailPreview}
                        alt="Thumbnail preview"
                        className="w-full h-auto object-contain"
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

                <div className="h-px bg-border"></div>

                {/* Asset Files Section */}
                <div>
                  <label className="block text-lg font-bold mb-3">
                    Asset Files
                  </label>
                  
                  {assetFiles.length > 0 && (
                    <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
                      {assetFiles.map((file, index) => (
                        <div key={index} className="rounded-xl border border-border bg-background p-3 hover:bg-card transition">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex-shrink-0">
                              <svg
                                className="h-5 w-5 text-purple-400"
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
                                className="h-4 w-4 text-muted-foreground group-hover:text-destructive transition"
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
                    className="w-full rounded-xl border-2 border-dashed border-border hover:border-primary/50 bg-background hover:bg-card px-6 py-4 transition-all flex items-center justify-center gap-3 group"
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
              </div>
            </div>

            {/* Right Column - Metadata */}
            <div className="rounded-3xl border border-border bg-card/50 backdrop-blur-xl p-8 shadow-2xl">
              <div className="space-y-6">

              {/* File Name */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  File Name <span className="text-destructive">*</span>
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
                  Description <span className="text-destructive">*</span>
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
                  Keywords <span className="text-destructive">*</span>
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

                {/* Upload Progress Bar */}
                {uploading && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold">Uploading...</span>
                      <span className="text-muted-foreground">{uploadProgress}%</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 ease-out"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  <button
                    onClick={handleCancel}
                    disabled={uploading}
                    className="flex-1 rounded-xl border-2 border-border bg-background hover:bg-muted px-6 py-4 text-sm font-bold transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpload}
                    disabled={!thumbnail || assetFiles.length === 0 || !fileName.trim() || !description.trim() || keywords.length === 0 || uploading}
                    className="flex-1 rounded-xl bg-primary hover:bg-primary/90 px-6 py-4 text-sm font-bold text-primary-foreground transition disabled:opacity-50 disabled:cursor-not-allowed"
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
