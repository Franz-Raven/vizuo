"use client";

import { useState } from "react";
import { Palette, MoreVertical, Flag, Share2 } from "lucide-react";
import DownloadMenu from "./download-menu";
import CommentSection from "@/components/comment/comment-section";

type Attachment = {
  url: string;
  format: string | null;
};

type AssetViewerModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  creator: string;
  imageUrl: string;
  attachments: Attachment[];
  imageId: number;
  avatarUrl?: string | null;
  onSaveToMoodboards?: () => void;
};

export default function AssetViewerModal({
  open,
  onClose,
  title,
  creator,
  imageUrl,
  attachments,
  imageId,
  avatarUrl,
  onSaveToMoodboards
}: AssetViewerModalProps) {
  const [moreOpen, setMoreOpen] = useState(false);

  if (!open) return null;

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ url, title }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        alert("Link copied to clipboard");
      });
    } else {
      alert("Share not supported in this browser");
    }
    setMoreOpen(false);
  };

  const handleReport = () => {
    alert("Report content coming soon.");
    setMoreOpen(false);
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <button
        type="button"
        onClick={onClose}
        className="absolute right-10 top-10 z-20 flex h-8 w-8 items-center justify-center rounded-full text-white hover:bg-muted transition"
      >
        <svg
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5 5L15 15M15 5L5 15"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <div className="relative w-full max-w-7xl max-h-[90vh] rounded-tl-2xl rounded-bl-2xl rounded-tr rounded-br bg-background border border-border shadow-2xl shadow-black/40 overflow-y-auto custom-scrollbar">
        <div className="flex h-full flex-col gap-4 p-5 md:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={creator}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-muted" />
                )}
              </div>
              <div className="flex flex-col">
                <h2 className="text-base md:text-lg font-semibold text-foreground">
                  {title}
                </h2>
                <p className="text-xs md:text-sm text-muted-foreground">
                  {creator}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                title="Save to moodboards"
                onClick={onSaveToMoodboards}
                className="flex h-9 w-9 items-center justify-center rounded-xl hover:bg-muted text-muted-foreground transition"
              >
                <Palette className="h-5 w-5" />
              </button>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setMoreOpen((prev) => !prev)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl hover:bg-muted text-muted-foreground transition"
                >
                  <MoreVertical className="h-5 w-5" />
                </button>

                {moreOpen && (
                  <div className="absolute p-2 right-0 mt-2 w-50 rounded-lg border border-border bg-popover shadow-xl shadow-black/30 z-50">
                    <div className="px-4 py-2 border-border">
                      <p className="text-xs font-semibold text-muted-foreground">
                        MORE OPTIONS
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleReport}
                      className="w-full flex items-center gap-2 px-4 py-2 rounded-md text-sm text-left hover:bg-muted transition"
                    >
                      <Flag className="h-4 w-4" />
                      Report content
                    </button>

                    <button
                      type="button"
                      onClick={handleShare}
                      className="w-full flex items-center gap-2 px-4 py-2 rounded-md text-sm text-left hover:bg-muted transition"
                    >
                      <Share2 className="h-4 w-4" />
                      Share
                    </button>
                  </div>
                )}
              </div>

              <DownloadMenu attachments={attachments} />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 h-[70vh]">
            <div className="relative w-full md:w-1/2 rounded-xl bg-card border border-border flex items-center justify-center overflow-hidden">
              <img
                src={imageUrl}
                alt={title}
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <div className="w-full md:w-1/2 rounded-xl bg-card border border-border p-4 flex flex-col overflow-hidden">
              <CommentSection imageId={imageId} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
