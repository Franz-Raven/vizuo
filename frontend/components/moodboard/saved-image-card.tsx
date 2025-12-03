"use client";

import Image from "next/image";
import { SavedImage } from "@/types/save-image";

export default function SavedImageCard({ img }: { img: SavedImage }) {
  return (
    <div
      className="group relative overflow-hidden rounded-xl bg-card border border-border cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1"
    >
      <div className="absolute top-0 left-0 right-0 p-4 z-20 bg-gradient-to-b from-black/70 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
        <p className="text-white text-sm font-semibold truncate">
          {img.title}
        </p>
        <p className="text-white/70 text-xs mt-1">
          Free • {img.creator}
        </p>
      </div>

      <div className="w-full h-auto">
        <Image
          src={img.thumbnailUrl}
          alt={img.title}
          width={500}
          height={500}
          className="w-full h-auto object-cover"
        />
      </div>

      <div className="absolute inset-0 z-10 bg-black/0 group-hover:bg-black/30 opacity-0 group-hover:opacity-100 transition-all duration-300" />
    </div>
  );
}
