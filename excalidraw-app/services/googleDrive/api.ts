// excalidraw-app/services/googleDrive/api.ts
import { DRIVE_CONFIG } from "./config";
import type { DriveFile, SaveToDriveOptions } from "./types";

export class DriveApiService {
  static async findOrCreateAppFolder(accessToken: string): Promise<string> {
    const query = `name='${DRIVE_CONFIG.FOLDER_NAME}' and mimeType='application/vnd.google-apps.folder' and trashed=false`;
    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
        query,
      )}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );

    const { files } = await response.json();
    if (files.length > 0) {
      return files[0].id;
    }

    const folder = await this.createFolder(accessToken);
    return folder.id;
  }

  static async createFolder(accessToken: string): Promise<DriveFile> {
    const response = await fetch("https://www.googleapis.com/drive/v3/files", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: DRIVE_CONFIG.FOLDER_NAME,
        mimeType: "application/vnd.google-apps.folder",
      }),
    });

    return response.json();
  }
}
