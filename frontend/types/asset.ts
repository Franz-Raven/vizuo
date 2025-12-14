export interface Asset {
  id: number;
  type: string;
  title: string;
  creator: string;
  likes: number;
  image: string;
  isLiked: boolean;
}

export interface AssetGridProps {
  assets: Asset[];
  searchQuery: string;
  onToggleLike: (id: number, currentlyLiked: boolean) => void;
  savedImageIds: number[];
  onToggleSave: (imageId: number) => void;
  onSelect: (id: number) => void;
}
