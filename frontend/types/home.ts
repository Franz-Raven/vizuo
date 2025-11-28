export interface ImageResponse {
  id: number;
  fileName: string | null;
  description: string | null;
  keywords: string[];
  thumbnailUrl: string | null;
  attachmentUrls: string[];
  createdAt: string;
  likesCount: number;
  uploaderUsername: string | null;
  likedByCurrentUser: boolean;
}
