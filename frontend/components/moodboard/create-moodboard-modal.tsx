"use client";

import { useEffect, useState } from "react";
import { MoodboardCreatePayload } from "@/types/moodboard";
import { CreateMoodboardModalProps } from "@/types/moodboard";

export default function CreateMoodboardModal({
  open,
  onClose,
  onCreate
}: CreateMoodboardModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);

  useEffect(() => {
    if (open) {
      setName("");
      setDescription("");
      setIsPrivate(false);
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = () => {
    if (!name.trim()) return;

    const payload: MoodboardCreatePayload = {
      name: name.trim(),
      description: description.trim() || undefined,
      isPrivate
    };

    onCreate(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-xl bg-background rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-8 pt-6 pb-4 border-b border-border/60">
          <h2 className="text-xl font-semibold">Create moodboard</h2>
          <button
            className="text-sm text-muted-foreground hover:text-foreground"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="px-8 py-6 space-y-6 overflow-auto max-h-[70vh]">
          {/* Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={`Like "Branding ideas" or "Thumbnails to Try"`}
              className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/40 transition"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Optional – add a short description for this moodboard"
              className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm outline-none resize-none focus:border-primary focus:ring-2 focus:ring-primary/40 transition"
            />
          </div>

          {/* Private checkbox */}
          <div className="flex items-start gap-3">
            <button
              type="button"
              onClick={() => setIsPrivate((prev) => !prev)}
              className="mt-1 h-5 w-5 rounded-md border border-border flex items-center justify-center bg-card hover:border-primary transition"
            >
              {isPrivate && (
                <span className="block h-3 w-3 rounded-[4px] bg-primary" />
              )}
            </button>
            <div className="space-y-1">
              <p className="text-sm font-medium">Make this moodboard private</p>
              <p className="text-xs text-muted-foreground">
                Only you will be able to see this moodboard.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 px-8 py-4 border-t border-border/60">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-card border border-border text-sm font-medium hover:bg-muted transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!name.trim()}
            className="px-6 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold shadow-md hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
