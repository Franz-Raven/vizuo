export interface UserProfile {
  id: number;
  username: string;
  email: string;
  avatar: string;
  coverImage: string;
  bio: string;
}

export interface GetProfileResponse {
  user: UserProfile;
}

export interface UpdateProfileResponse {
  user: UserProfile;
  message: string;
}

export interface UploadImageResponse {
  url: string;
  message: string;
}

export interface ProfileUpdatePayload {
  username?: string;
  email?: string;
  bio?: string;
  avatar?: string;
  coverImage?: string;
}

// for assets 
export interface ProfileAsset {
  id: number;
  imageUrl: string;
  title: string;
  type: 'space' | 'upload' | 'favorite';
  createdAt?: string;
  likesCount?: number;
}

export interface ProfileResponse {
  user: UserProfile;
  spaceItems: ProfileAsset[];
  uploads: ProfileAsset[];
  favorites: ProfileAsset[];
}