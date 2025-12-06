import { SavedImage } from "./save-image";

export interface Moodboard {
  id: number;
  name: string;
  description: string | null;
  isPrivate: boolean;
  createdAt: string;
  savedImageIds: number[];
  userId?: number;
  username?: string;
  saveCount?: number;
  isSaved?: boolean;
  previewImages?: string[];
}

export interface MoodboardCreatePayload {
  name: string;
  description?: string;
  isPrivate?: boolean;
}

export interface CreateMoodboardModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (data: MoodboardCreatePayload) => void;
}

export interface OrganizeModalProps {
  open: boolean;
  onClose: () => void;
  savedImages: SavedImage[];
  moodboards: Moodboard[];
  onAssignToBoard: (
    moodboardId: number,
    savedImageIds: number[]
  ) => Promise<void> | void;
  onCreateBoardWithImages: (
    savedImageIds: number[]
  ) => Promise<void> | void;
  mode?: "multi" | "single";
  preselectedSavedIds?: number[];
  disableBack?: boolean;
}