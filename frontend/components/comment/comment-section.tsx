// src/components/comment/comment-section.tsx
"use client";

import { useEffect, useState } from "react";
import { Comment, CommentTree } from "@/types/comment";
import { createComment, deleteComment, getComments } from "@/lib/api/comments";
import CommentForm from "./comment-form";
import CommentItem from "./comment-item";

type CommentSectionProps = {
  imageId: number;
};

function buildCommentTree(comments: Comment[]): CommentTree[] {
  const map = new Map<number, CommentTree>();
  const roots: CommentTree[] = [];

  for (const c of comments) {
    map.set(c.id, { ...c, replies: [] });
  }

  for (const c of map.values()) {
    if (c.parentCommentId && map.has(c.parentCommentId)) {
      const parent = map.get(c.parentCommentId);
      if (parent) {
        parent.replies.push(c);
      }
    } else {
      roots.push(c);
    }
  }

  return roots;
}

function removeCommentFromTree(nodes: CommentTree[], id: number): CommentTree[] {
  const result: CommentTree[] = [];
  for (const node of nodes) {
    if (node.id === id) {
      continue;
    }
    const filteredReplies = removeCommentFromTree(node.replies, id);
    result.push({ ...node, replies: filteredReplies });
  }
  return result;
}

function addCommentToTree(
  nodes: CommentTree[],
  newComment: Comment,
  parentId?: number | null
): CommentTree[] {
  if (!parentId) {
    return [...nodes, { ...newComment, replies: [] }];
  }

  const result: CommentTree[] = [];

  for (const node of nodes) {
    if (node.id === parentId) {
      const updatedNode: CommentTree = {
        ...node,
        replies: [...node.replies, { ...newComment, replies: [] }],
      };
      result.push(updatedNode);
    } else {
      const updatedReplies = addCommentToTree(node.replies, newComment, parentId);
      result.push({ ...node, replies: updatedReplies });
    }
  }

  return result;
}


export default function CommentSection({ imageId }: CommentSectionProps) {
  const [tree, setTree] = useState<CommentTree[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [postingRoot, setPostingRoot] = useState(false);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getComments(imageId);
        if (!active) return;
        setTree(buildCommentTree(data));
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Failed to load comments");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [imageId]);

  const handlePostRoot = async (content: string) => {
    setPostingRoot(true);
    try {
      const created = await createComment(imageId, { content });
      setTree((prev) => addCommentToTree(prev, created, created.parentCommentId));
    } finally {
      setPostingRoot(false);
    }
  };

  const handleReply = async (content: string, parentId: number) => {
    const created = await createComment(imageId, { content, parentCommentId: parentId });
    setTree((prev) => addCommentToTree(prev, created, parentId));
  };

  const handleDelete = async (commentId: number) => {
    await deleteComment(commentId);
    setTree((prev) => removeCommentFromTree(prev, commentId));
  };

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="border-b border-border pb-3">
        <h3 className="text-sm font-semibold text-foreground">Comments</h3>
      </div>
      
      <div className="mt-3 flex-1 space-y-3 overflow-y-auto pr-1 custom-scrollbar">
        {loading && (
          <p className="text-xs text-muted-foreground">Loading comments...</p>
        )}
        {error && (
          <p className="text-xs text-destructive">
            {error}
          </p>
        )}
        {!loading && !error && tree.length === 0 && (
          <p className="text-xs text-muted-foreground ml-4 ">No comments yet. Be the first.</p>
        )}
        {!loading &&
          !error &&
          tree.map((c) => (
            <CommentItem
              key={c.id}
              comment={c}
              onReply={handleReply}
              onDelete={handleDelete}
            />
          ))}
      </div>
      <div className="space-y-3">
        <CommentForm
          onSubmit={handlePostRoot}
          placeholder="Share your thoughts..."
          submitLabel={postingRoot ? "Posting..." : "Post"}
        />
      </div>
    </div>
  );
}
