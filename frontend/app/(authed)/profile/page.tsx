"use client"

import { useState, useEffect } from "react"
import BackgroundBlobs from "@/components/background-blobs"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { getProfile, getProfileAssets, updateProfile, uploadImage } from "@/lib/api/profile"
import { ProfileAsset } from "@/types/profile"
import Header from "@/components/header"
import { getSpaceImages, getAvailableForSpace, addToSpace, removeFromSpace } from "@/lib/api/save-image"
import { SavedImage } from "@/types/save-image"
import { GripVertical, Plus, X } from "lucide-react"

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("Space")
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingAssets, setLoadingAssets] = useState(true)
  const [isEditingSpace, setIsEditingSpace] = useState(false)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  const [user, setUser] = useState({
    username: "",
    avatar: "https://i.pinimg.com/736x/9f/4c/f0/9f4cf0f24b376077a2fcdab2e85c3584.jpg",
    coverImage: "https://i.pinimg.com/1200x/45/c0/86/45c08695ac7400476965367aababdd3b.jpg",
    bio: ""
  })

  const [editForm, setEditForm] = useState({ ...user })

  const [spaceImages, setSpaceImages] = useState<SavedImage[]>([])
  const [availableImages, setAvailableImages] = useState<SavedImage[]>([])
  const [uploads, setUploads] = useState<ProfileAsset[]>([])
  const [favorites, setFavorites] = useState<ProfileAsset[]>([])

  const tabs = ["Space", "Uploads", "Favorites"]

  useEffect(() => {
    fetchUserData()
    fetchProfileAssets()
  }, [])

  const fetchUserData = async () => {
    try {
      setIsLoading(true)
      const response = await getProfile()
      setUser(response.user)
      setEditForm(response.user)
    } catch (error) {
      toast.error('Failed to load profile data');
      console.error('Profile fetch error:', error);
    } finally {
      setIsLoading(false)
    }
  }

  const fetchProfileAssets = async () => {
    try {
      setLoadingAssets(true)

      // isSpaceItem = true
      const spaceImagesData = await getSpaceImages();
      setSpaceImages(spaceImagesData);

      // (isSpaceItem = false)
      const availableImagesData = await getAvailableForSpace();
      setAvailableImages(availableImagesData);

      const response = await getProfileAssets();
      setUploads(response.uploads || []);
      setFavorites(response.favorites || []);
      
    } catch (error) {
      toast.error('Failed to load profile assets');
      console.error('Assets fetch error:', error);
    } finally {
      setLoadingAssets(false)
    }
  }

  const handleAddToSpace = async (savedImageId: number) => {
    try {
      await addToSpace(savedImageId);
      
      const imageToAdd = availableImages.find(img => img.id === savedImageId);
      if (imageToAdd) {
        setAvailableImages(prev => prev.filter(img => img.id !== savedImageId));
        setSpaceImages(prev => [...prev, { ...imageToAdd, spaceItem: true }]);
      }
      
      toast.success("Added to space!");
    } catch (error) {
      console.error("Error adding to space:", error);
      toast.error("Failed to add to space");
    }
  };

  const handleRemoveFromSpace = async (savedImageId: number) => {
    try {
      await removeFromSpace(savedImageId);
      
      const imageToRemove = spaceImages.find(img => img.id === savedImageId);
      if (imageToRemove) {
        setSpaceImages(prev => prev.filter(img => img.id !== savedImageId));
        setAvailableImages(prev => [...prev, { ...imageToRemove, spaceItem: false }]);
      }
      
      toast.success("Removed from space!");
    } catch (error) {
      console.error("Error removing from space:", error);
      toast.error("Failed to remove from space");
    }
  };

  // Drag and Drop handlers
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === index) return;
    
    const newOrder = [...spaceImages];
    const draggedItem = newOrder[draggedIndex];
    
    newOrder.splice(draggedIndex, 1);
    newOrder.splice(index, 0, draggedItem);
    
    setSpaceImages(newOrder);
    setDraggedIndex(index);
  };

  const handleDragEnd = async () => {
    if (draggedIndex === null) return;
    
    try {
      toast.success("Order updated!");
    } catch (error) {
      console.error("Error reordering:", error);
      toast.error("Failed to update order");
      fetchProfileAssets();
    } finally {
      setDraggedIndex(null);
    }
  };

  const getCurrentItems = () => {
    switch(activeTab) {
      case "Space": 
        if (isEditingSpace) {
          return [];
        } else {
          // Show space images directly
          return spaceImages.map(img => ({
            id: img.id,
            title: img.title,
            imageUrl: img.thumbnailUrl,
            type: "image" as const,
          }));
        }
      case "Uploads": return uploads;
      case "Favorites": return favorites;
      default: return [];
    }
  };

  const currentItems = getCurrentItems();

  const handleImageUpload = async (file: File, type: 'avatar' | 'cover') => {
    try {
      setIsLoading(true)
      const response = await uploadImage(file, type)

      if (type === 'avatar') {
            setEditForm(prev => ({ ...prev, avatar: response.url }))
      } else {
        setEditForm(prev => ({ ...prev, coverImage: response.url }))
      }

      toast.success('Image uploaded successfully!')
    } catch (error) {
      toast.error('Failed to load upload data');
      console.error('Profile fetch error:', error);
      if (error instanceof Error) {
        toast.error("Failed to update image: " + error.message)
      } else {
        toast.error("Failed to update image: Unknown error")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      handleImageUpload(file, 'avatar')
    }
  }

  const handleCoverChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      handleImageUpload(file, 'cover')
    }
  }

  const handleSaveProfile = async () => {
    try {
      setIsLoading(true)
      const response = await updateProfile(editForm)
      setUser(response.user)
      setIsEditingProfile(false)
      toast.success('Profile updated successfully!')
    } catch (error) {
      console.error('Update error:', error)
      if (error instanceof Error) {
        toast.error("Failed to update profile: " + error.message)
      } else {
        toast.error("Failed to update profile: Unknown error")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelEdit = () => {
    setEditForm(user)
    setIsEditingProfile(false)
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <BackgroundBlobs />
      <Header />  
      <main className="relative z-10 pt-16">
        {/* cover and profile */}
        <div className="max-w-7xl mx-auto px-6 pt-8">
          <div className="relative">
            <div className="relative w-full h-48 md:h-64 rounded-2xl overflow-hidden shadow-2xl shadow-purple-300/30 group">
              {isEditingProfile ? (
                <div className="relative w-full h-full">
                  <img
                    src={editForm.coverImage}
                    alt="Cover"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <label className="px-4 py-2 bg-card/80 backdrop-blur-md border border-border rounded-lg text-sm font-medium hover:bg-card transition flex items-center gap-2 cursor-pointer">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Change Cover
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleCoverChange}
                        disabled={isLoading}
                      />
                    </label>
                  </div>
                </div>
              ) : (
                <img
                  src={user.coverImage}
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            {/* if user is editing profile */}
            <div className="flex items-end justify-center relative -mt-16">
              <div className="relative">
                <div className="w-32 h-32 rounded-[2rem] bg-gradient-to-br from-[#A99DFF] via-[#8B7FCC] to-[#655E99] p-1 shadow-xl">
                  <div className="w-full h-full rounded-[1.75rem] overflow-hidden bg-card">
                    <img
                      src={isEditingProfile ? editForm.avatar : user.avatar}
                      alt={user.username}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                {isEditingProfile && (
                  <label className="absolute -bottom-2 -right-2 w-9 h-9 bg-gradient-to-br from-[#A99DFF] via-[#8B7FCC] to-[#655E99] rounded-full flex items-center justify-center border-3 border-background hover:opacity-90 transition shadow-lg cursor-pointer">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      disabled={isLoading}
                    />
                  </label>
                )}
              </div>

              {isEditingProfile ? (
                <div className="absolute right-0 bottom-2 flex gap-2">
                  <Button
                    onClick={handleCancelEdit}
                    className="bg-transparent text-primary-foreground hover:bg-primary rounded-lg font-semibold px-6 border-2 border-primary/60"
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveProfile}
                    className="bg-primary text-primary-foreground rounded-lg font-semibold px-6 hover:bg-primary/90 relative overflow-hidden group"
                    disabled={isLoading}
                  >
                    <span className="relative z-10">
                      {isLoading ? "Saving..." : "Save"}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => setIsEditingProfile(true)}
                  className="absolute right-0 bottom-2 bg-transparent text-primary-foreground hover:bg-primary rounded-lg font-semibold px-6 border-2 border-primary/60"
                >
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* info */}
        <div className="max-w-7xl mx-auto px-6 pt-4 pb-6">
          {isEditingProfile ? (
            <div className="max-w-md mx-auto space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Username</label>
                <input
                  type="text"
                  value={editForm.username}
                  onChange={(e) => setEditForm(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="Enter your username"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Bio</label>
                <textarea
                  value={editForm.bio || ''}
                  onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Tell us about yourself..."
                  rows={3}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground"
                />
              </div>
            </div>
          ) : (
            <div className="text-center">
              <h1 className="text-3xl font-bold">
                {user.username}
              </h1>
              {user.bio && (
                <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">{user.bio}</p>
              )}
            </div>
          )}
        </div>

        {/* profile tabs */}
        <div className="flex justify-center gap-3 px-6 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${activeTab === tab
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "bg-card border border-border hover:border-primary/50 text-foreground"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* content */}
        {loadingAssets ? (
          <div className="flex justify-center py-12">
            <div className="flex flex-col items-center gap-4">
              <div className="h-10 w-10 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
              <p className="text-sm text-muted-foreground">Loading {activeTab.toLowerCase()}...</p>
            </div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-6">
            {/* Edit Space button */}
            {activeTab === "Space" && (
              <div className="flex justify-end mb-6">
                <Button
                  onClick={() => setIsEditingSpace(!isEditingSpace)}
                  variant={isEditingSpace ? "default" : "outline"}
                  className="flex items-center gap-2"
                >
                  {isEditingSpace ? "👁️ View Space" : "✏️ Edit Space"}
                </Button>
              </div>
            )}

            {/* empty content */}
            {(activeTab === "Space" && !isEditingSpace && spaceImages.length === 0) || 
             (activeTab !== "Space" && currentItems.length === 0) ? (
              <div className="text-center py-16">
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 mx-auto rounded-full bg-card flex items-center justify-center mb-6">
                    <span className="text-3xl text-muted-foreground">
                      {activeTab === "Space" ? "🎨" : 
                      activeTab === "Uploads" ? "📤" : "❤️"}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    No {activeTab.toLowerCase()} yet
                  </h3>
                  <p className="text-muted-foreground">
                    {activeTab === "Space" && "Add images to your space to see them here"}
                    {activeTab === "Uploads" && "Upload your first artwork to get started"}
                    {activeTab === "Favorites" && "Like some images to see them here"}
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* editing interface for space */}
                {activeTab === "Space" && isEditingSpace ? (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* (left) current space items with drag and drop */}
                    <div className="lg:col-span-2">
                      <div className="bg-card border border-border rounded-xl p-4">
                        <h3 className="font-semibold mb-4">
                          Arrange Your Space ({spaceImages.length})
                        </h3>
                        
                        {spaceImages.length === 0 ? (
                          <div className="text-center py-12 text-muted-foreground border-2 border-dashed border-border rounded-lg">
                            <p className="text-lg mb-2">No items in your space yet</p>
                            <p className="text-sm">Add items from your saved assets →</p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {spaceImages.map((image, index) => (
                              <div
                                key={image.id}
                                draggable
                                onDragStart={() => handleDragStart(index)}
                                onDragOver={(e) => handleDragOver(e, index)}
                                onDragEnd={handleDragEnd}
                                className={`flex items-center gap-3 p-3 bg-background border-2 rounded-lg cursor-move transition-all ${
                                  draggedIndex === index
                                    ? "border-primary opacity-50 scale-95"
                                    : "border-border hover:border-primary/50 hover:shadow-md"
                                }`}
                              >
                                <GripVertical className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                                <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                                  <img
                                    src={image.thumbnailUrl}
                                    alt={image.title}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium truncate">{image.title}</p>
                                  <p className="text-sm text-muted-foreground">Position #{index + 1}</p>
                                </div>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleRemoveFromSpace(image.id)}
                                  className="hover:bg-destructive hover:text-destructive-foreground"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* (right) add from available images */}
                    <div>
                      <div className="bg-card border border-border rounded-xl p-4 sticky top-6">
                        <h3 className="font-semibold mb-4">Add from Saved Assets</h3>
                        
                        {availableImages.length === 0 ? (
                          <div className="text-center py-8 text-muted-foreground">
                            <p>All saved images are already in your space</p>
                          </div>
                        ) : (
                          <div className="space-y-2 max-h-[calc(100vh-250px)] overflow-y-auto pr-2">
                            {availableImages.map(asset => (
                              <div 
                                key={asset.id} 
                                className="p-2 bg-background border border-border rounded-lg hover:border-primary/50 transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                                    <img
                                      src={asset.thumbnailUrl}
                                      alt={asset.title}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm truncate">{asset.title}</p>
                                  </div>
                                  <Button
                                    size="sm"
                                    onClick={() => handleAddToSpace(asset.id)}
                                    className="flex-shrink-0"
                                  >
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  // grid view for all tabs
                  <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-6 space-y-6">
                    {currentItems.map((item) => (
                      <div
                        key={item.id}
                        className="break-inside-avoid group relative overflow-hidden rounded-xl bg-card border border-border cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1"
                      >
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-auto object-cover"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <Button className="bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 shadow-lg border border-primary/20">
                            View
                          </Button>
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <p className="text-white text-sm font-semibold truncate">{item.title}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </main>
    </div>
  )
}