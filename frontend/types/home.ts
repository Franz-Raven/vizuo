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
}

export interface AssetCard {
  id: number;
  type: string;
  title: string;
  creator: string;
  likes: number;
  image: string;
}
