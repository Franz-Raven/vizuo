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
  activeCategory: string;
  onToggleLike: (id: number, currentlyLiked: boolean) => void;
}
