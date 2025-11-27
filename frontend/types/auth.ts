export interface AuthUser {
  id: number;
  email: string;
  username: string;
  avatar?: string | null;
  coverImage?: string | null;
  bio?: string | null;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export interface ErrorResponse {
  error: string;
}
