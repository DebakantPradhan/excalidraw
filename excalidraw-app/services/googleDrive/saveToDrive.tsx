// excalidraw-app/components/GoogleDrive/SaveToDriveButton.tsx
import React from "react";
// import React, { FC } from "react";
import { DriveApiService } from "./api";
import { DrivePickerService } from "./picker";

interface Props {
  accessToken: string;
  onSave: (fileId: string) => void;
}

export const SaveToDriveButton: React.FC<Props> = ({
  accessToken,
  onSave,
}): JSX.Element => {
  const handleSave = async () => {
    const folderId = await DriveApiService.findOrCreateAppFolder(accessToken);
    const picker = await DrivePickerService.createPicker(accessToken, folderId);

    picker.setCallback((data) => {
      if (data.action === google.picker.Action.PICKED) {
        const documents = data[google.picker.Response.DOCUMENTS];
        if (documents && documents.length > 0) {
          const file = documents[0];
          onSave(file.id);
        }
      }
    });

    picker.build().setVisible(true);
  };

  return (
    <button onClick={handleSave} type="button">
      Save to Drive
    </button>
  );
};
