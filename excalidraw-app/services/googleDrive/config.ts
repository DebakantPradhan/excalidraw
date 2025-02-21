// excalidraw-app/services/googleDrive/config.ts
export const DRIVE_CONFIG = {
  FOLDER_NAME: "Excalidraw Files",
  MIME_TYPE: "application/json",
  SCOPE: "https://www.googleapis.com/auth/drive.file",
  API_KEY: import.meta.env.VITE_GOOGLE_API_KEY,
};
