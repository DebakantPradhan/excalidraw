// excalidraw-app/services/googleDrive/types.ts
export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
}

export interface SaveToDriveOptions {
  name: string;
  content: string;
  folderId?: string;
}
