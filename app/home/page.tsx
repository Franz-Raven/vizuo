"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
//   const router = useRouter()
//   const [user, setUser] = useState<string | null>(null)
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     const token = localStorage.getItem("token")
//     const username = localStorage.getItem("username")
    
//     if (!token) {
//       // redirect to login
//       router.push("/login")
//     } else {
//       setUser(username || "User")
//       setLoading(false)
//     }
//   }, [router])

//   const handleLogout = () => {
//     localStorage.removeItem("token")
//     localStorage.removeItem("username")
//     router.push("/login")
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-background flex items-center justify-center">
//         <div className="text-center">
//           <p className="text-muted-foreground">Loading...</p>
//         </div>
//       </div>
//     )
//   }

  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")

  // mock data only
  const assets = [
    { 
      id: 1, 
      type: "image", 
      title: "Spiderpunk", 
      creator: "designer_alex", 
      likes: 142,
      image: "https://i.pinimg.com/736x/0b/cc/6e/0bcc6ec00b417c9ee1f0be258e018fbb.jpg"
    },
    { 
      id: 2, 
      type: "image", 
      title: "Cyber Cat", 
      creator: "urban_shots", 
      likes: 89,
      image: "https://i.pinimg.com/1200x/38/ed/fa/38edfa3d653bfd96611e202ebc9c3d8d.jpg"
    },
    { 
      id: 3, 
      type: "image", 
      title: "Smashing Pumpkins", 
      creator: "spray_artist", 
      likes: 256,
      image: "https://i.pinimg.com/736x/7a/52/f8/7a52f89bc4b4598fe50d7a749110c853.jpg"
    },
    { 
      id: 4, 
      type: "image", 
      title: "Spiderman", 
      creator: "city_creator", 
      likes: 178,
      image: "https://i.pinimg.com/736x/2b/76/fb/2b76fb6008c1b5e2841c156a50b90d4a.jpg"
    },
    { 
      id: 5, 
      type: "image", 
      title: "Vintage Car", 
      creator: "Astronaut", 
      likes: 321,
      image: "https://i.pinimg.com/736x/42/91/ec/4291ecdf87037abc45712311f89e236d.jpg"
    },
    { 
      id: 6, 
      type: "image", 
      title: "Soda Cat", 
      creator: "sound_visuals", 
      likes: 94,
      image: "https://i.pinimg.com/1200x/0c/e2/7f/0ce27f9fd5acd5a500e8458746bb4e2c.jpg"
    },
    { 
      id: 7, 
      type: "image", 
      title: "Eziokwu", 
      creator: "abstract_mind", 
      likes: 203,
      image: "https://i.pinimg.com/1200x/71/9f/98/719f98be467f2760a075a3434cf335ff.jpg"
    },
    { 
      id: 8, 
      type: "image", 
      title: "Ambush!", 
      creator: "portrait_pro", 
      likes: 167,
      image: "https://i.pinimg.com/1200x/0b/aa/9f/0baa9fd7ebcbe9e07440ef21655e0351.jpg"
    },
    { 
      id: 9, 
      type: "image", 
      title: "Graffiti", 
      creator: "skate_culture", 
      likes: 145,
      image: "https://i.pinimg.com/1200x/14/0c/10/140c10b2be92ae092f683cb715b2542b.jpg"
    },
    { 
      id: 10, 
      type: "image", 
      title: "5 Seconds of Summer", 
      creator: "luke_is_a_penguin", 
      likes: 278,
      image: "https://i.pinimg.com/1200x/4c/db/ad/4cdbad0c03f75842d9b611c95ed00495.jpg"
    },
    { 
      id: 11, 
      type: "image", 
      title: "Brooklyn99", 
      creator: "jacobb_", 
      likes: 192,
      image: "https://i.pinimg.com/1200x/91/3a/01/913a01c804137bc1fb973a35a2fad185.jpg"
    },
    { 
      id: 12, 
      type: "image", 
      title: "Street Style", 
      creator: "fashion_lens", 
      likes: 134,
      image: "https://i.pinimg.com/1200x/eb/20/a5/eb20a5a64b4791f1b7c18fe1b7e37a89.jpg"
    },
  ]

  const categories = [
    "All",
    "Graphics",
    "Photos",
    "Vectors",
    "3D",
    "Templates",
    "Icons"
  ]

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      {/* bg */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div 
          className="absolute -top-140 -left-140 h-[180vh] w-[180vh] rounded-full blur-[130px] opacity-70"
          style={{ backgroundImage: "radial-gradient(closest-side, var(--color-secondary), transparent 70%)" }} 
        />
        <div 
          className="absolute -bottom-190 -right-140 h-[250vh] w-[250vh] rounded-full blur-[140px] opacity-70"
          style={{ backgroundImage: "radial-gradient(closest-side, var(--color-primary), transparent 70%)" }} 
        />
      </div>

      {/* insert sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-16 bg-card border-r border-border flex flex-col items-center py-6 gap-4 z-40">
      </aside>

      <main className="ml-16 min-h-screen relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-8">

          <div className="mb-8 max-w-3xl mx-auto">
            <div className="relative">
              <svg 
                className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search assets"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-card border-2 border-primary/30 rounded-xl focus:outline-none focus:border-primary transition text-foreground placeholder:text-muted-foreground shadow-lg shadow-primary/5"
              />
            </div>
          </div>

          <div className="mb-8 flex justify-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition whitespace-nowrap ${
                  activeCategory === category
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "bg-card border border-border hover:border-primary/50 text-foreground"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* assets layout */}
          <div className="flex justify-center">
            <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-6 space-y-6 max-w-full">
              {assets.map((asset, index) => (
                <div
                  key={asset.id}
                  className="break-inside-avoid group relative overflow-hidden rounded-xl bg-card border border-border cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1"
                >
                  
                  <div className="w-full h-auto">
                    <img
                      src={asset.image}
                      alt={asset.title}
                      className="w-full h-auto object-cover"
                      loading="lazy"
                    />
                  </div>
                  
                  
                  <div className="absolute top-4 right-4 bg-black/80 rounded-full px-3 py-1.5 text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1.5">
                    <svg 
                      className="w-4 h-4 fill-current text-red-400" 
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                    {asset.likes}
                  </div>

                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <button className="px-6 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition shadow-lg border border-primary/20">
                      Save
                    </button>
                  </div>

                  {/* asset info */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <p className="text-white text-sm font-semibold truncate">{asset.title}</p>
                    <p className="text-white/70 text-xs mt-1">Free • {asset.creator}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          
          <div className="text-center py-16">
            <button className="px-8 py-4 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition shadow-lg shadow-primary/20 font-semibold border border-primary/20">
              Load More Assets
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}