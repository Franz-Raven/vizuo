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
