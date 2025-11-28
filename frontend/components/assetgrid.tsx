"use client";
import { AssetGridProps } from "@/types/asset";

export default function AssetGridComponent({ assets, searchQuery, activeCategory, onToggleLike }: AssetGridProps) {
  const filteredAssets = assets.filter(asset => {
    const matchesSearch =
      asset.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.creator.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "All" || asset.type === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex justify-center">
      <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-6 space-y-6 max-w-full">
        {filteredAssets.map((asset) => (
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

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleLike(asset.id, asset.isLiked);
              }}
              className="absolute top-4 right-4 z-20 bg-black/80 rounded-full px-3 py-1.5 text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1.5"
            >
              <svg
                className={`w-4 h-4 ${
                  asset.isLiked ? "fill-current text-red-400" : "stroke-current text-red-400 fill-transparent"
                }`}
                viewBox="0 0 24 24"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              {asset.likes}
            </button>

            <div className="absolute inset-0 z-10 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <button className="px-6 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition shadow-lg border border-primary/20">
                Save
              </button>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <p className="text-white text-sm font-semibold truncate">{asset.title}</p>
              <p className="text-white/70 text-xs mt-1">Free • {asset.creator}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
