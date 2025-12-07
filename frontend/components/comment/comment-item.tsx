// src/components/comment/comment-item.tsx
"use client";

import { useEffect, useState } from "react";
import { CommentTree } from "@/types/comment";
import CommentForm from "./comment-form";
import { getProfile } from "@/lib/api/profile";

type CommentItemProps = {
  comment: CommentTree;
  depth?: number;
  onReply: (content: string, parentId: number) => Promise<void> | void;
  onDelete: (commentId: number) => Promise<void> | void;
};

let cachedCurrentUserId: number | null | undefined = undefined;

export default function CommentItem({
  comment,
  depth = 0,
  onReply,
  onDelete
}: CommentItemProps) {
  const [showReply, setShowReply] = useState(false);
  const [replying, setReplying] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  useEffect(() => {
    let active = true;

    const loadUser = async () => {
      if (typeof window === "undefined") return;

      if (cachedCurrentUserId !== undefined) {
        if (active) setCurrentUserId(cachedCurrentUserId);
        return;
      }

      try {
        const res = await getProfile();
        const id = res.user?.id ?? null;
        cachedCurrentUserId = id;
        if (active) setCurrentUserId(id);
      } catch {
        cachedCurrentUserId = null;
        if (active) setCurrentUserId(null);
      }
    };

    loadUser();

    return () => {
      active = false;
    };
  }, []);

  const isOwner = currentUserId !== null && comment.userId === currentUserId;

  const handleReply = async (content: string) => {
    if (replying) return;
    setReplying(true);
    try {
      await onReply(content, comment.id);
      setShowReply(false);
    } finally {
      setReplying(false);
    }
  };

  const handleDeleteClick = () => {
    if (deleting) return;
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (deleting) return;
    setDeleting(true);
    try {
      await onDelete(comment.id);
      setShowConfirm(false);
    } finally {
      setDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    if (deleting) return;
    setShowConfirm(false);
  };

  const createdAtLabel = comment.createdAt
    ? new Date(comment.createdAt).toLocaleString()
    : "";

  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="flex gap-3">
          <div className="h-9 w-9 flex-shrink-0 overflow-hidden rounded-full bg-muted flex items-center justify-center text-xs font-medium">
            {comment.userAvatar ? (
              <img
                src={comment.userAvatar}
                alt={comment.username ?? "User avatar"}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-muted-foreground">
                {comment.username ? comment.username.charAt(0).toUpperCase() : "U"}
              </span>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between gap-2">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-foreground">
                  {comment.username ?? "Unknown user"}
                </span>
                {createdAtLabel && (
                  <span className="text-[10px] text-muted-foreground">
                    {createdAtLabel}
                  </span>
                )}
              </div>
            </div>
            <p className="mt-1 whitespace-pre-wrap text-sm text-foreground">
              {comment.content}
            </p>
            <div className="mt-1 flex items-center gap-3 text-[11px]">
              <button
                type="button"
                onClick={() => setShowReply((prev) => !prev)}
                className="font-medium text-muted-foreground hover:text-foreground"
                disabled={replying}
              >
                {showReply ? "Cancel" : "Reply"}
              </button>
              {isOwner && (
                <button
                  type="button"
                  onClick={handleDeleteClick}
                  className="text-muted-foreground hover:text-destructive"
                  disabled={deleting}
                >
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              )}
            </div>
            {showReply && (
              <div className="mt-2">
                <CommentForm
                  onSubmit={handleReply}
                  placeholder="Write a reply..."
                  autoFocus
                  submitLabel={replying ? "Replying..." : "Reply"}
                />
              </div>
            )}
          </div>
        </div>
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-2 border-l border-border/60 pl-4">
            <div className="flex flex-col gap-3">
              {comment.replies.map((child) => (
                <CommentItem
                  key={child.id}
                  comment={child}
                  depth={depth + 1}
                  onReply={onReply}
                  onDelete={onDelete}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-[280px] rounded-xl border border-border bg-card px-4 py-3 shadow-lg">
            <p className="text-sm text-foreground">Delete this comment?</p>
            <p className="mt-1 text-xs text-muted-foreground">
              This action cannot be undone.
            </p>
            <div className="mt-3 flex justify-end gap-2">
              <button
                type="button"
                onClick={handleCancelDelete}
                className="rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="rounded-xl bg-destructive px-3 py-1.5 text-xs font-medium text-destructive-foreground hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
