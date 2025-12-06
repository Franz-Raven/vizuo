"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Moodboard } from "@/types/moodboard";

type MoodboardCardProps = {
  board: Moodboard;
  thumbnails: string[];
};

export default function MoodboardCard({ board, thumbnails }: MoodboardCardProps) {
  const router = useRouter();
  const [t0, t1, t2] = thumbnails;

  return (
    <div 
      onClick={() => router.push(`/moodboard/${board.id}`)}
      className="rounded-2xl bg-card border border-border overflow-hidden shadow-lg transform transition-transform transition-shadow duration-200 hover:shadow-primary/20 hover:-translate-y-0.5 cursor-pointer group"
    >
      {thumbnails.length === 0 ? (
        <div className="h-40 w-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
          <span className="text-primary-foreground/70 text-sm">
            {board.savedImageIds.length} items
          </span>
        </div>
      ) : (
        <div className="relative h-50 w-full bg-muted/10">
          <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-1 p-1">
            <div className="col-span-1 row-span-2 rounded-xl overflow-hidden bg-card/40">
              {t0 && (
                <Image
                  src={t0}
                  alt={board.name}
                  width={400}
                  height={400}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="rounded-xl overflow-hidden bg-card/40">
              {t1 && (
                <Image
                  src={t1}
                  alt={board.name}
                  width={400}
                  height={400}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="rounded-xl overflow-hidden bg-card/40">
              {t2 && (
                <Image
                  src={t2}
                  alt={board.name}
                  width={400}
                  height={400}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          </div>

          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 flex items-end justify-start">
            <span className="m-3 text-xs font-medium text-white/80">
              {board.savedImageIds.length} items
            </span>
          </div>
        </div>
      )}

      <div className="p-4">
        <p className="text-base font-semibold truncate">{board.name}</p>
        <p className="text-sm text-muted-foreground mt-1 truncate">
          {board.description || "No description"}
        </p>
      </div>
    </div>
  );
}
