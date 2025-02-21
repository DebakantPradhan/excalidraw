import { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import type { TokenResponse } from "@react-oauth/google";
import type { GoogleAuthResponse, AuthState } from "./types";

export const useGoogleAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    accessToken: null,
  });

  const login = useGoogleLogin({
    onSuccess: async (response: GoogleAuthResponse) => {
      console.log("Google OAuth Success:", response);
      setAuthState((prev) => ({
        ...prev,
        isAuthenticated: true,
        accessToken: response.access_token,
      }));
      return response;
    },
    onError: (
      errorResponse: Pick<
        TokenResponse,
        "error" | "error_description" | "error_uri"
      >,
    ) => {
      console.error("Google Login Failed:", errorResponse);
      setAuthState({
        isAuthenticated: false,
        user: null,
        accessToken: null,
      });
    },
    scope:
      "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/drive.file",
  });

  return {
    login,
    authState,
  };
};
