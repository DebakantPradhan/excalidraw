// excalidraw-app/auth/types.ts
export interface GoogleAuthResponse {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
}

export interface GoogleUserProfile {
  email: string;
  name: string;
  picture?: string;
  id: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: GoogleUserProfile | null;
  accessToken: string | null;
}
