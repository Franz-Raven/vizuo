"use client";

import { useState } from "react";
import type { UserSubscription } from "@/types/subscription";
import { Crown } from "lucide-react";
import SubscriptionModal from "@/components/subscription/subscription-modal";

type DownloadMenuProps = {
  attachments: { url: string; format: string | null }[];
  onDownloadZip?: () => void;
  isPremium?: boolean;
  currentSubscription?: UserSubscription | null;
  onSubscriptionChange?: () => void;
};

export default function DownloadMenu({
  attachments,
  onDownloadZip,
  isPremium,
  currentSubscription,
  onSubscriptionChange
}: DownloadMenuProps) {
  const [open, setOpen] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  const canDownloadPremium =
    currentSubscription &&
    currentSubscription.status === "active" &&
    (currentSubscription.plan.name === "Advanced" ||
      currentSubscription.plan.name === "Premium" ||
      currentSubscription.plan.name === "Pro");

  const showPremiumCta = !!isPremium && !canDownloadPremium;

  const handleButtonClick = () => {
    if (showPremiumCta) {
      setShowSubscriptionModal(true);
      return;
    }
    setOpen((prev) => !prev);
  };

  const handleDownloadSingle = async (url: string, format: string | null) => {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Download failed");
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);

      const ext = format ? format.toLowerCase() : "";
      const fallbackName = `vizuo-asset${ext ? `.${ext}` : ""}`;

      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = fallbackName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(blobUrl);
    } catch (e) {
      console.error(e);
      window.open(url, "_blank");
    }
  };

  const handleDownloadZip = () => {
    if (onDownloadZip) onDownloadZip();
  };

  return (
    <>
      <div className="relative">
        <button
          type="button"
          onClick={handleButtonClick}
          className={
            showPremiumCta
              ? "inline-flex items-center gap-2 rounded-xl bg-yellow-500 px-4 py-2 text-sm font-semibold text-yellow-950 shadow-md shadow-yellow-500/30 hover:bg-yellow-400 transition"
              : "inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90 transition"
          }
        >
          {showPremiumCta ? (
            <>
              <Crown className="h-4 w-4" />
              <span>Get Premium</span>
            </>
          ) : (
            <>
              <span>Download</span>
              <svg
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 7.5L10 12.5L15 7.5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </>
          )}
        </button>

        {!showPremiumCta && open && (
          <div className="absolute p-2 right-0 mt-2 w-56 rounded-xl border border-border bg-popover shadow-xl shadow-black/30 z-50">
            <div className="px-4 py-2 border-border/70">
              <p className="text-xs font-semibold tracking-wide text-muted-foreground">
                FILE TYPE
              </p>
            </div>

            <div className="max-h-60 overflow-y-auto">
              {attachments.map((att, index) => {
                const label = (att.format || "FILE").toUpperCase();
                return (
                  <button
                    key={att.url + index}
                    type="button"
                    onClick={() => handleDownloadSingle(att.url, att.format)}
                    className="flex w-full rounded-md items-center justify-between px-4 py-2 text-sm hover:bg-muted transition"
                  >
                    <span>{label}</span>
                    <span className="text-xs text-muted-foreground">
                      Download
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={handleDownloadZip}
              className="w-full border-t rounded-md border-border/70 px-4 py-2 text-sm font-semibold text-primary hover:bg-muted transition"
            >
              Download ZIP
            </button>
          </div>
        )}
      </div>

      <SubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
        onSubscriptionChange={onSubscriptionChange}
      />
    </>
  );
}
