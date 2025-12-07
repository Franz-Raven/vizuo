// src/components/comment/comment-form.tsx
"use client";

import { FormEvent, useState } from "react";

type CommentFormProps = {
  onSubmit: (content: string) => Promise<void> | void;
  placeholder?: string;
  autoFocus?: boolean;
  submitLabel?: string;
};

export default function CommentForm({
  onSubmit,
  placeholder,
  autoFocus,
  submitLabel,
}: CommentFormProps) {
  const [value, setValue] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || submitting) return;
    setSubmitting(true);
    try {
      await onSubmit(trimmed);
      setValue("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <textarea
        className="w-full resize-none rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        rows={3}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder ?? "Add a comment..."}
        autoFocus={autoFocus}
        disabled={submitting}
      />
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={submitting || !value.trim()}
          className="inline-flex items-center rounded-xl bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground shadow-sm transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Posting..." : submitLabel ?? "Post"}
        </button>
      </div>
    </form>
  );
}
