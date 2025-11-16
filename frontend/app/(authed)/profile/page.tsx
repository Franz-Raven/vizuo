"use client"

import { useState } from "react"
import Link from "next/link"
import BackgroundBlobs from "@/components/background-blobs"
import { Button } from "@/components/ui/button"

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("Space")
  const [isEditingCover, setIsEditingCover] = useState(false)

  // Mock user data
  const user = {
    username: "Kiru",
    avatar: "https://i.pravatar.cc/150?img=12",
    coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&h=400&fit=crop"
  }

  // Mock boards/content data
  const spaceItems = [
    {
      id: 1,
      image: "https://i.pinimg.com/736x/0b/cc/6e/0bcc6ec00b417c9ee1f0be258e018fbb.jpg",
      title: "Spiderpunk Collection"
    },
    {
      id: 2,
      image: "https://i.pinimg.com/1200x/38/ed/fa/38edfa3d653bfd96611e202ebc9c3d8d.jpg",
      title: "Cyber Aesthetics"
    },
    {
      id: 3,
      image: "https://i.pinimg.com/736x/7a/52/f8/7a52f89bc4b4598fe50d7a749110c853.jpg",
      title: "Street Art"
    },
    {
      id: 4,
      image: "https://i.pinimg.com/736x/2b/76/fb/2b76fb6008c1b5e2841c156a50b90d4a.jpg",
      title: "Urban Photography"
    },
    {
      id: 5,
      image: "https://i.pinimg.com/736x/42/91/ec/4291ecdf87037abc45712311f89e236d.jpg",
      title: "Retro Vibes"
    },
    {
      id: 6,
      image: "https://i.pinimg.com/1200x/0c/e2/7f/0ce27f9fd5acd5a500e8458746bb4e2c.jpg",
      title: "Pop Culture"
    },
  ]

  const tabs = ["Space", "Uploads", "Favorites"]

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <BackgroundBlobs />

      <header className="relative z-10 flex items-center justify-between px-8 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-purple-200/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-purple-400/30">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-purple-300">
              <path d="M4 4L20 20M4 20L20 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="text-2xl font-bold text-white">Vizuo</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" className="text-foreground hover:bg-foreground/10">
              Home
            </Button>
          </Link>
          <Button variant="ghost" className="text-foreground hover:bg-foreground/10">
            Settings
          </Button>
        </div>
      </header>

      <main className="relative z-10">
        {/* cover and profile */}
        <div className="max-w-7xl mx-auto px-6 pt-8">
          <div className="relative">
            <div className="relative w-full h-48 md:h-64 rounded-2xl overflow-hidden shadow-2xl shadow-purple-300/30 group">
              <img
                src={user.coverImage}
                alt="Cover"
                className="w-full h-full object-cover"
              />

              <button
                onClick={() => setIsEditingCover(!isEditingCover)}
                className="absolute top-4 left-4 px-4 py-2 bg-card/80 backdrop-blur-md border border-border rounded-lg text-sm font-medium hover:bg-card transition flex items-center gap-2 opacity-0 group-hover:opacity-100 shadow-lg"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Add Cover
              </button>
            </div>

            <div className="flex items-end justify-center relative -mt-16">
              <div className="relative">
                <div className="w-32 h-32 rounded-[2rem] bg-gradient-to-br from-[#A99DFF] via-[#8B7FCC] to-[#655E99] p-1 shadow-xl">
                  <div className="w-full h-full rounded-[1.75rem] overflow-hidden bg-card">
                    <img
                      src={user.avatar}
                      alt={user.username}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <button className="absolute -bottom-2 -right-2 w-9 h-9 bg-gradient-to-br from-[#A99DFF] via-[#8B7FCC] to-[#655E99] rounded-full flex items-center justify-center border-3 border-background hover:opacity-90 transition shadow-lg">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>

              <Button className="absolute right-0 bottom-2 bg-transparent text-primary-foreground hover:bg-primary rounded-lg font-semibold px-6 border-2 border-primary/60">
                Edit
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-4 pb-6">
          <h1 className="text-3xl font-bold text-center">{user.username}</h1>
        </div>

        {/* profile tabs */}
        <div className="flex justify-center gap-3 px-6 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${
                activeTab === tab
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "bg-card border border-border hover:border-primary/50 text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* content */}
        <div className="max-w-7xl mx-auto px-6 pb-16">
          <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-6 space-y-6">
            {spaceItems.map((item) => (
              <div
                key={item.id}
                className="break-inside-avoid group relative overflow-hidden rounded-xl bg-card border border-border cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1"
              >
                <img
                  src={item.image}
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
        </div>
      </main>
    </div>
  )
}