"use client";

import { useEffect, useState, lazy, Suspense } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import BackgroundBlobs from "@/components/background-blobs";
import { getHomeAssets } from "@/lib/api/home";
import { likeAsset, unlikeAsset } from "@/lib/api/like";
import { Asset } from "@/types/asset";

const LazyAssetGrid = lazy(() => import("@/components/assetgrid"));

const CATEGORIES = [
  "All",
  "Graphics",
  "Photos",
  "Vectors",
  "3D",
  "Templates",
  "Icons"
];

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loadingMain, setLoadingMain] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/landing");
    }
  }, [router]);

  useEffect(() => {
    async function fetchAssets() {
      try {
        const data = await getHomeAssets();
        const mapped: Asset[] = data.map((item: any) => ({
          id: item.id,
          type: "Photos",
          title: item.fileName || "Untitled",
          creator: item.uploaderUsername || "Unknown",
          likes: item.likesCount ?? 0,
          image: item.thumbnailUrl || "",
          isLiked: item.likedByCurrentUser ?? false
        }));
        setAssets(mapped);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingMain(false);
      }
    }
    fetchAssets();
  }, []);

  const handleToggleLike = async (id: number, currentlyLiked: boolean) => {
    setAssets((prev) =>
      prev.map((asset) =>
        asset.id === id
          ? {
              ...asset,
              isLiked: !currentlyLiked,
              likes: asset.likes + (currentlyLiked ? -1 : 1)
            }
          : asset
      )
    );

    try {
      if (currentlyLiked) {
        await unlikeAsset(id);
      } else {
        await likeAsset(id);
      }
    } catch (error) {
      console.error(error);
      setAssets((prev) =>
        prev.map((asset) =>
          asset.id === id
            ? {
                ...asset,
                isLiked: currentlyLiked,
                likes: asset.likes + (currentlyLiked ? 1 : -1)
              }
            : asset
        )
      );
    }
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <BackgroundBlobs />
      <Header />

      {loadingMain ? (
        <main className="min-h-screen relative z-10 pt-16 flex justify-center items-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
            <p className="text-sm text-muted-foreground">Loading your assets</p>
          </div>
        </main>
      ) : (
        <main className="min-h-screen relative z-10 pt-16">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="mb-8 max-w-3xl mx-auto">
              <div className="relative">
                <svg
                  className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
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
              {CATEGORIES.map((category) => (
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

            <Suspense>
              <LazyAssetGrid
                assets={assets}
                searchQuery={searchQuery}
                activeCategory={activeCategory}
                onToggleLike={handleToggleLike}
              />
            </Suspense>

            <div className="text-center py-16">
              <button className="px-8 py-4 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition shadow-lg shadow-primary/20 font-semibold border border-primary/20">
                Load More Assets
              </button>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
