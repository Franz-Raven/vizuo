// src/lib/api/comments.ts
import { apiRequest } from "@/lib/api";
import { Comment } from "@/types/comment";

export type CreateCommentPayload = {
  content: string;
  parentCommentId?: number | null;
};

export async function getComments(imageId: number) {
  return apiRequest<Comment[]>(`/comments/image/${imageId}`);
}

export async function createComment(imageId: number, payload: CreateCommentPayload) {
  return apiRequest<Comment>(`/comments/image/${imageId}`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function deleteComment(commentId: number) {
  return apiRequest<string>(`/comments/${commentId}`, {
    method: "DELETE",
  });
}
