"use client";

import { useEffect, useMemo, useRef, useState, lazy, Suspense } from "react";
import { usePathname } from "next/navigation";
import { SendHorizontal } from "lucide-react";
import Header from "@/components/header";
import BackgroundBlobs from "@/components/background-blobs";
import { getHomeAssets, searchHomeAssets } from "@/lib/api/home";
import { likeAsset, unlikeAsset } from "@/lib/api/like";
import { getSavedImages, saveImage, unsaveImage } from "@/lib/api/save-image";
import { getMoodboards, assignSavedImagesToMoodboard } from "@/lib/api/moodboard";
import { Asset } from "@/types/asset";
import { ImageResponse } from "@/types/home";
import { SavedImage } from "@/types/save-image";
import { Moodboard } from "@/types/moodboard";
import AssetViewerModal from "@/components/preview/asset-viewer-modal";
import OrganizeModal from "@/components/moodboard/organize-modal";

const LazyAssetGrid = lazy(() => import("@/components/home/assetgrid"));

function normalizeQuery(q: string) {
  return q.trim().replace(/\s+/g, " ");
}

export default function HomePage() {
  const [searchInput, setSearchInput] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const normalizedSearch = useMemo(
    () => normalizeQuery(submittedSearch),
    [submittedSearch]
  );
  const isSearchMode = normalizedSearch.length > 0;

  const [assets, setAssets] = useState<Asset[]>([]);
  const [fullAssets, setFullAssets] = useState<ImageResponse[]>([]);

  const [savedImageIds, setSavedImageIds] = useState<number[]>([]);
  const [savedImages, setSavedImages] = useState<SavedImage[]>([]);
  const [moodboards, setMoodboards] = useState<Moodboard[]>([]);

  const [loadingMain, setLoadingMain] = useState(true);

  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<ImageResponse | null>(null);

  const [isOrganizeOpen, setIsOrganizeOpen] = useState(false);
  const [organizeSavedIds, setOrganizeSavedIds] = useState<number[]>([]);

  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const seenIdsRef = useRef<Set<number>>(new Set());
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const fetchingRef = useRef(false);

  const pathname = usePathname();

  const mapToAsset = (item: ImageResponse): Asset => ({
    id: item.id,
    type: "Photos",
    title: item.fileName || "Untitled",
    creator: item.uploaderUsername || "Unknown",
    likes: item.likesCount ?? 0,
    image: item.thumbnailUrl || "",
    isLiked: item.likedByCurrentUser ?? false
  });

  const resetFeedState = () => {
    setAssets([]);
    setFullAssets([]);
    setCursor(null);
    setHasMore(true);
    setLoadingMore(false);
    fetchingRef.current = false;
    seenIdsRef.current = new Set();
  };

  const fetchInitial = async (modeQuery: string) => {
    setLoadingMain(true);

    try {
      const [feed, savedData, boardData] = await Promise.all([
        modeQuery
          ? searchHomeAssets(modeQuery, 15, null)
          : getHomeAssets(15, null),
        getSavedImages(),
        getMoodboards()
      ]);

      const saved = savedData as SavedImage[];
      const savedIds = saved.map((s) => s.imageId);

      const newFull: ImageResponse[] = [];
      const newAssets: Asset[] = [];

      const nextSeen = new Set<number>();

      for (const item of feed.items) {
        nextSeen.add(item.id);
        newFull.push(item);
        newAssets.push(mapToAsset(item));
      }

      seenIdsRef.current = nextSeen;

      setFullAssets(newFull);
      setAssets(newAssets);

      setSavedImages(saved);
      setSavedImageIds(savedIds);
      setMoodboards(boardData);

      setCursor(feed.nextCursor);
      setHasMore(!!feed.nextCursor);
    } catch (e) {
      console.error(e);
      setFullAssets([]);
      setAssets([]);
      setCursor(null);
      setHasMore(false);
    } finally {
      setLoadingMain(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (pathname !== "/home") return;
      resetFeedState();
      try {
        await fetchInitial(normalizedSearch);
      } finally {
        if (cancelled) return;
      }
    }

    run();

    return () => {
      cancelled = true;
    };
  }, [pathname, normalizedSearch]);

  const fetchMore = async () => {
    if (!hasMore) return;
    if (fetchingRef.current) return;
    if (!cursor) return;

    fetchingRef.current = true;
    setLoadingMore(true);

    try {
      const feed = isSearchMode
        ? await searchHomeAssets(normalizedSearch, 15, cursor)
        : await getHomeAssets(15, cursor);

      const addFull: ImageResponse[] = [];
      const addAssets: Asset[] = [];

      for (const item of feed.items) {
        if (!seenIdsRef.current.has(item.id)) {
          seenIdsRef.current.add(item.id);
          addFull.push(item);
          addAssets.push(mapToAsset(item));
        }
      }

      setFullAssets((prev) => [...prev, ...addFull]);
      setAssets((prev) => [...prev, ...addAssets]);

      setCursor(feed.nextCursor);
      setHasMore(!!feed.nextCursor);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingMore(false);
      fetchingRef.current = false;
    }
  };

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting) fetchMore();
      },
      { root: null, rootMargin: "800px 0px", threshold: 0 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [cursor, hasMore, isSearchMode, normalizedSearch]);

  const handleSelectAsset = (id: number) => {
    const found = fullAssets.find((a) => a.id === id);
    if (found) {
      setSelectedAsset(found);
      setViewerOpen(true);
    }
  };

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

    setFullAssets((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              likedByCurrentUser: !currentlyLiked,
              likesCount: (item.likesCount ?? 0) + (currentlyLiked ? -1 : 1)
            }
          : item
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

      setFullAssets((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                likedByCurrentUser: currentlyLiked,
                likesCount: (item.likesCount ?? 0) + (currentlyLiked ? 1 : -1)
              }
            : item
        )
      );
    }
  };

  const handleToggleSave = async (imageId: number) => {
    const isCurrentlySaved = savedImageIds.includes(imageId);

    setSavedImageIds((prev) =>
      isCurrentlySaved ? prev.filter((id) => id !== imageId) : [...prev, imageId]
    );

    try {
      if (isCurrentlySaved) {
        await unsaveImage(imageId);
      } else {
        await saveImage(imageId);
      }
    } catch (error) {
      console.error(error);
      setSavedImageIds((prev) =>
        isCurrentlySaved ? [...prev, imageId] : prev.filter((id) => id !== imageId)
      );
    }
  };

  const handleSaveToMoodboards = async (imageId: number) => {
    try {
      const existing = savedImages.find((s) => s.imageId === imageId);
      let finalSaved: SavedImage;

      if (!existing) {
        const created = await saveImage(imageId);
        finalSaved = created as SavedImage;

        setSavedImages((prev) => [...prev, finalSaved]);
        setSavedImageIds((prev) => (prev.includes(imageId) ? prev : [...prev, imageId]));
      } else {
        finalSaved = existing;
      }

      if (moodboards.length === 0) {
        const boards = await getMoodboards();
        setMoodboards(boards);
      }

      setOrganizeSavedIds([finalSaved.id]);
      setIsOrganizeOpen(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAssignToBoard = async (moodboardId: number, savedIds: number[]) => {
    if (!savedIds.length) return;
    try {
      const updated = await assignSavedImagesToMoodboard(moodboardId, savedIds);
      setMoodboards((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
      setIsOrganizeOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateBoardWithImages = async () => {
    return;
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <BackgroundBlobs />
      <Header />

      {loadingMain ? (
        <main className="min-h-screen relative z-10 pt-16 flex justify-center items-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
            <p className="text-sm text-muted-foreground">
              {isSearchMode ? "Searching assets" : "Loading your assets"}
            </p>
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
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setSubmittedSearch(searchInput);
                    }
                  }}
                  className="w-full px-14 py-3 bg-card border-2 border-primary/30 rounded-xl focus:outline-none focus:border-primary transition text-foreground placeholder:text-muted-foreground shadow-lg shadow-primary/5"
                />

                <button
                  onClick={() => setSubmittedSearch(searchInput)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition"
                >
                  <SendHorizontal className="w-5 h-5" />
                </button>
              </div>
            </div>

            <Suspense>
              <LazyAssetGrid
                assets={assets}
                searchQuery={""}
                onToggleLike={handleToggleLike}
                savedImageIds={savedImageIds}
                onToggleSave={handleToggleSave}
                onSelect={handleSelectAsset}
              />
            </Suspense>

            <div ref={sentinelRef} className="h-1 w-full" />

            {loadingMore && (
              <div className="py-10 flex items-center justify-center gap-3 text-sm text-muted-foreground">
                <div className="h-5 w-5 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
                Loading more assets
              </div>
            )}

            {!hasMore && (
              <div className="py-12 text-center text-sm text-muted-foreground">
                You’ve reached the end.
              </div>
            )}
          </div>
        </main>
      )}

      {viewerOpen && selectedAsset && (
        <AssetViewerModal
          open={viewerOpen}
          onClose={() => setViewerOpen(false)}
          title={selectedAsset.fileName || "Untitled"}
          creator={selectedAsset.uploaderUsername || "Unknown"}
          imageUrl={selectedAsset.thumbnailUrl || ""}
          attachments={selectedAsset.attachments || []}
          isPremium={selectedAsset.premium ?? false}
          imageId={selectedAsset.id || 0}
          avatarUrl={selectedAsset.uploaderAvatar ?? null}
          onSaveToMoodboards={() => handleSaveToMoodboards(selectedAsset.id)}
        />
      )}

      <OrganizeModal
        open={isOrganizeOpen}
        onClose={() => setIsOrganizeOpen(false)}
        savedImages={savedImages}
        moodboards={moodboards}
        onAssignToBoard={handleAssignToBoard}
        onCreateBoardWithImages={handleCreateBoardWithImages}
        mode="single"
        preselectedSavedIds={organizeSavedIds}
        disableBack
      />
    </div>
  );
}
