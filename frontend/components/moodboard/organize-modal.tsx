"use client";

import { useState } from "react";
import Image from "next/image";
import { OrganizeModalProps } from "@/types/moodboard";

export default function OrganizeModal({
  open,
  onClose,
  savedImages,
  moodboards,
  onAssignToBoard,
  onCreateBoardWithImages
}: OrganizeModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const resetAndClose = () => {
    setStep(1);
    setSelectedIds([]);
    setSubmitting(false);
    onClose();
  };

  const handleNext = () => {
    if (selectedIds.length === 0) return;
    setStep(2);
  };

  const handleMoveToBoard = async (boardId: number) => {
    if (!selectedIds.length || submitting) return;
    setSubmitting(true);
    try {
      await onAssignToBoard(boardId, selectedIds);
      resetAndClose();
    } catch (err) {
      console.error(err);
      setSubmitting(false);
    }
  };

  const handleCreateBoard = async () => {
    if (!selectedIds.length || submitting) return;
    setSubmitting(true);
    try {
      await onCreateBoardWithImages(selectedIds);
      resetAndClose();
    } catch (err) {
      console.error(err);
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-4xl max-h-[80vh] bg-background rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-8 pt-6 pb-4 border-b border-border/60">
          {step === 1 ? (
            <h2 className="text-lg font-semibold">Organize into a board</h2>
          ) : (
            <div className="flex items-center gap-3">
              <button
                className="text-sm text-muted-foreground hover:text-foreground"
                onClick={() => setStep(1)}
                disabled={submitting}
              >
                ←
              </button>
              <h2 className="text-lg font-semibold">Move to a board</h2>
            </div>
          )}

          <div className="flex items-center gap-4">
            {step === 1 && selectedIds.length > 0 && (
              <span className="text-sm text-muted-foreground">
                {selectedIds.length} selected
              </span>
            )}
            <button
              className="text-sm text-muted-foreground hover:text-foreground disabled:opacity-50"
              onClick={resetAndClose}
              disabled={submitting}
            >
              ✕
            </button>
          </div>
        </div>

        {step === 1 ? (
          <div className="flex-1 px-8 py-6 overflow-auto flex items-center justify-center">
            {savedImages.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                No saved assets to organize.
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {savedImages.map((img) => {
                  const selected = selectedIds.includes(img.id);
                  return (
                    <button
                      key={img.id}
                      type="button"
                      onClick={() => toggleSelect(img.id)}
                      className={`relative rounded-2xl overflow-hidden border transition-all ${
                        selected
                          ? "border-primary ring-2 ring-primary/60"
                          : "border-border hover:border-primary/60"
                      }`}
                    >
                      <div className="w-full h-auto">
                        <Image
                          src={img.thumbnailUrl}
                          alt={img.title}
                          width={400}
                          height={400}
                          className="w-full h-auto object-cover"
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 px-8 py-6 overflow-auto">
            <div className="space-y-4">
              {moodboards.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-3">All boards</p>
                  <div className="space-y-3">
                    {moodboards.map((board) => (
                      <button
                        key={board.id}
                        type="button"
                        onClick={() => handleMoveToBoard(board.id)}
                        className="w-full flex items-center justify-between rounded-2xl border border-border px-4 py-3 hover:border-primary/60 hover:bg-primary/5 transition disabled:opacity-50"
                        disabled={submitting}
                      >
                        <div className="flex flex-col text-left">
                          <span className="text-sm font-semibold">
                            {board.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {board.savedImageIds.length} items
                          </span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          +
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6">
                <p className="text-sm font-medium mb-3">Create</p>
                <button
                  type="button"
                  onClick={handleCreateBoard}
                  className="w-full flex items-center gap-3 rounded-2xl border border-dashed border-border px-4 py-3 hover:border-primary/70 hover:bg-primary/5 transition disabled:opacity-50"
                  disabled={submitting || selectedIds.length === 0}
                >
                  <div className="w-10 h-10 rounded-xl bg-card flex items-center justify-center text-lg">
                    +
                  </div>
                  <span className="text-sm font-semibold">
                    Create board
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end px-8 py-4 border-t border-border/60">
          {step === 1 ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={selectedIds.length === 0}
              className="px-6 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold shadow-md hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={resetAndClose}
              className="px-6 py-2 rounded-full bg-card border border-border text-sm font-semibold hover:border-primary/70 hover:bg-primary/5 transition disabled:opacity-50"
              disabled={submitting}
            >
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
