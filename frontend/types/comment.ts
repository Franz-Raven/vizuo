// src/types/comment.ts
export type Comment = {
  id: number;
  content: string;
  createdAt: string;
  userId: number | null;
  username: string | null;
  userAvatar?: string | null;
  parentCommentId?: number | null;
};

export type CommentTree = Comment & {
  replies: CommentTree[];
};
