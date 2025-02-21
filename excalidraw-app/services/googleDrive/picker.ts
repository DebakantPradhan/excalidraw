// excalidraw-app/services/googleDrive/picker.ts
import { DRIVE_CONFIG } from "./config";
import "google.picker";
import "gapi";
declare let google: any;

export class DrivePickerService {
  static async createPicker(
    accessToken: string,
    folderId: string,
  ): Promise<google.picker.PickerBuilder> {
    await new Promise((resolve) => {
      gapi.load("picker", resolve);
    });

    const view = new google.picker.DocsView(google.picker.ViewId.DOCS)
      .setParent(folderId)
      .setMimeTypes(DRIVE_CONFIG.MIME_TYPE);

    return new google.picker.PickerBuilder()
      .addView(view)
      .setOAuthToken(accessToken)
      .setDeveloperKey(DRIVE_CONFIG.API_KEY)
      .enableFeature(google.picker.Feature.NAV_HIDDEN)
      .enableFeature(google.picker.Feature.SUPPORT_DRIVES);
  }
}
