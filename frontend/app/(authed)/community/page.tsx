"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import BackgroundBlobs from "@/components/background-blobs";
import {
  getPublicMoodboards,
  getSavedMoodboards,
  saveMoodboard,
  unsaveMoodboard,
} from "@/lib/api/moodboard";
import { Moodboard } from "@/types/moodboard";
import { Search } from "lucide-react";

export default function CommunityPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"explore" | "saved">("explore");
  const [searchQuery, setSearchQuery] = useState("");
  const [moodboards, setMoodboards] = useState<Moodboard[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  useEffect(() => {
    loadMoodboards();
  }, [activeTab]);

  const loadMoodboards = async () => {
    setLoading(true);
    try {
      const data =
        activeTab === "explore"
          ? await getPublicMoodboards()
          : await getSavedMoodboards();
      setMoodboards(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (activeTab !== "explore") return;
    setLoading(true);
    try {
      const data = await getPublicMoodboards(searchQuery);
      setMoodboards(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToggle = async (moodboard: Moodboard) => {
    try {
      if (moodboard.isSaved) {
        await unsaveMoodboard(moodboard.id);
        setMoodboards((prev) =>
          prev.map((m) =>
            m.id === moodboard.id
              ? {
                  ...m,
                  isSaved: false,
                  saveCount: (m.saveCount || 0) - 1,
                }
              : m
          )
        );
      } else {
        await saveMoodboard(moodboard.id);
        setMoodboards((prev) =>
          prev.map((m) =>
            m.id === moodboard.id
              ? {
                  ...m,
                  isSaved: true,
                  saveCount: (m.saveCount || 0) + 1,
                }
              : m
          )
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredMoodboards =
    activeTab === "saved"
      ? moodboards.filter((m) =>
          m.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : moodboards;

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <BackgroundBlobs />
      <Header />

      <main className="relative z-10 pt-20 pb-24 max-w-7xl mx-auto px-6">
        {/* Search Bar */}
        <div className="mb-8 flex justify-center">
          <div className="relative w-full max-w-3xl">
            <input
              type="text"
              placeholder="Search assets"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full px-6 py-4 pl-14 rounded-[2rem] bg-card/50 backdrop-blur-sm border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-all shadow-lg"
            />
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-3 mb-10">
          <button
            onClick={() => setActiveTab("explore")}
            className={`px-8 py-2.5 rounded-full font-medium transition-all ${
              activeTab === "explore"
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/40"
                : "bg-card/50 text-muted-foreground hover:bg-card hover:text-foreground border border-border/50"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveTab("saved")}
            className={`px-8 py-2.5 rounded-full font-medium transition-all ${
              activeTab === "saved"
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/40"
                : "bg-card/50 text-muted-foreground hover:bg-card hover:text-foreground border border-border/50"
            }`}
          >
            Saved
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-10 w-10 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
          </div>
        ) : filteredMoodboards.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">
              {activeTab === "explore"
                ? "No public moodboards found"
                : "No saved moodboards yet"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredMoodboards.map((moodboard) => (
              <div
                key={moodboard.id}
                className="group relative"
                onMouseEnter={() => setHoveredId(moodboard.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Moodboard Card */}
                <div className="relative rounded-xl bg-card border border-border overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1">
                  {/* Preview Images - Single Image or Grid */}
                  <div className="relative w-full aspect-square">
                    {moodboard.previewImages && moodboard.previewImages.length > 0 ? (
                      moodboard.previewImages.length === 1 ? (
                        <div className="relative w-full h-full bg-muted">
                          <img
                            src={moodboard.previewImages[0]}
                            alt={moodboard.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-full h-full grid grid-cols-2 gap-0.5 p-0.5">
                          {moodboard.previewImages.slice(0, 4).map((url, idx) => (
                            <div
                              key={idx}
                              className="relative bg-muted overflow-hidden"
                            >
                              <img
                                src={url}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                          {/* Fill empty slots */}
                          {Array.from({
                            length: Math.max(0, 4 - moodboard.previewImages.length),
                          }).map((_, idx) => (
                            <div
                              key={`empty-${idx}`}
                              className="bg-muted"
                            />
                          ))}
                        </div>
                      )
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                        <p className="text-muted-foreground text-sm">Empty</p>
                      </div>
                    )}

                    {/* Hover Overlay - Only covers the image area */}
                    <div className="absolute inset-0 z-10 bg-black/0 group-hover:bg-black/60 transition-all duration-300 flex flex-col items-center justify-center gap-2">
                      {/* Item Count - Show on Hover */}
                      <p className="opacity-0 group-hover:opacity-100 text-white text-xs font-medium transition-all duration-300">
                        {moodboard.previewImages?.length || 0} Items
                      </p>
                      
                      {/* View Button - Show on Hover in Center */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/moodboard/${moodboard.id}`);
                        }}
                        className="opacity-0 group-hover:opacity-100 px-6 py-2 rounded-full bg-white text-black text-sm font-semibold shadow-xl hover:bg-white/90 transition-all duration-300"
                      >
                        View
                      </button>
                    </div>
                  </div>

                  {/* Bottom Info Bar - Always Visible with Dark Background */}
                  <div className="bg-black/80 backdrop-blur-sm p-2.5 flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs font-semibold truncate">
                        {moodboard.name}
                      </p>
                      <p className="text-white/60 text-[10px] truncate">
                        by {moodboard.username || "Unknown"} · {moodboard.saveCount || 0} saves
                      </p>
                    </div>
                    
                    {/* Save Button - Always Visible */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSaveToggle(moodboard);
                      }}
                      className="ml-2 w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition-all flex-shrink-0"
                    >
                      <svg
                        className={`w-3.5 h-3.5 ${
                          moodboard.isSaved
                            ? "fill-primary text-primary"
                            : "text-white"
                        }`}
                        viewBox="0 0 24 24"
                        fill={moodboard.isSaved ? "currentColor" : "none"}
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
