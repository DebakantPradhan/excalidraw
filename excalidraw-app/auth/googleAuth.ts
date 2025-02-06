import { useGoogleLogin } from "@react-oauth/google";

export const useGoogleAuth = () => {
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log("Google OAuth Success:", tokenResponse);
      localStorage.setItem("googleAccessToken", tokenResponse.access_token);
      return tokenResponse;
    },
    onError: (error) => {
      console.error("Google Login Failed:", error);
    },
    scope: "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/drive.file"
  });

  return login;
};

