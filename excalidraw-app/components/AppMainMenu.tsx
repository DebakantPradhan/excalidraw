import React from "react";
import { useGoogleAuth } from "../auth/googleAuth";
// import { useGoogleLogin } from "@react-oauth/google";

// import { SaveToDriveButton } from "../services/googleDrive/saveToDrive";
import { DriveApiService } from "../services/googleDrive/api";
import { DRIVE_CONFIG } from "../services/googleDrive/config";

import type {
  ExcalidrawImperativeAPI,
  AppState,
  BinaryFiles,
} from "@excalidraw/excalidraw/types";
import type { ExcalidrawElement } from "@excalidraw/excalidraw/element/types";
import { getDefaultAppState } from "../../packages/excalidraw/appState";
// import type { NormalizedZoomValue } from "../../packages/excalidraw/types";
import { getNormalizedZoom } from "../../packages/excalidraw/scene/index";

import {
  loginIcon,
  ExcalLogo,
  eyeIcon,
  GoogleDriveLogo,
} from "../../packages/excalidraw/components/icons";
import type { Theme } from "../../packages/excalidraw/element/types";
import { MainMenu } from "../../packages/excalidraw/index";
// import { isExcalidrawPlusSignedUser } from "../app_constants";
import { LanguageList } from "../app-language/LanguageList";
import { saveDebugState } from "./DebugCanvas";

export const AppMainMenu: React.FC<{
  onCollabDialogOpen: () => any;
  isCollaborating: boolean;
  isCollabEnabled: boolean;
  theme: Theme | "system";
  setTheme: (theme: Theme | "system") => void;
  refresh: () => void;

  excalidrawAPI: ExcalidrawImperativeAPI | null;
}> = React.memo((props) => {
  // const login = useGoogleAuth();
  const { login, authState } = useGoogleAuth();
  /*TODO: Implement logout also*/

  // const login = useGoogleLogin({
  //   onSuccess: (tokenResponse) => console.log(tokenResponse),
  // });

  /*const handleSaveToGoogleDrive = async () => {
    if (!authState.isAuthenticated) {
      await login();
      return;
    }
  
    try {
      // Load the picker API
      await new Promise((resolve) => {
        gapi.load('picker', resolve);
      });
  
      // Get or create Excalidraw folder
      const folderId = await DriveApiService.findOrCreateAppFolder(authState.accessToken!);
  
      // Create and configure the picker
      const picker = new google.picker.PickerBuilder()
        .addView(new google.picker.DocsView()
          .setParent(folderId)
          .setMimeTypes(DRIVE_CONFIG.MIME_TYPE))
        .setOAuthToken(authState.accessToken!)
        .setDeveloperKey(DRIVE_CONFIG.API_KEY)
        .setCallback(async (data) => {
          if (data[google.picker.Response.ACTION] === google.picker.Action.PICKED) {
            const documents = data[google.picker.Response.DOCUMENTS];
            if (!documents || !documents.length) {
              throw new Error('No document selected');
            }
            const doc = documents[0];
            
            // Create test scene data (replace with actual scene data later)
            const testSceneData = {
              type: "excalidraw",
              version: 2,
              source: "https://excalidraw.com",
              elements: [
                {
                  id: "test-" + Date.now(),
                  type: "rectangle",
                  x: 100,
                  y: 100,
                  width: 100,
                  height: 100,
                  backgroundColor: "#40c4ff"
                }
              ]
            };
  
            const file = new Blob([JSON.stringify(testSceneData)], {
              type: 'application/json'
            });
  
            const form = new FormData();
            const metadata = {
              name: doc.name || `excalidraw-${new Date().toISOString()}.json`,
              mimeType: 'application/json',
              parents: [folderId]
            };
  
            form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
            form.append('file', file);
  
            const response = await fetch(
              'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
              {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${authState.accessToken}`,
                },
                body: form
              }
            );
  
            if (!response.ok) {
              throw new Error('Failed to upload to Drive');
            }
  
            console.log('File saved successfully');
          }
        })
        .build();
  
      picker.setVisible(true);
    } catch (error) {
      console.error('Error saving to Drive:', error);
    }
  };*/

  const handleSaveToGoogleDrive = async () => {
    if (!props.excalidrawAPI) {
      console.error("Excalidraw API not initialized");
      return;
    }

    if (!authState.isAuthenticated) {
      await login();
      return;
    }

    try {
      // Get or create Excalidraw folder
      const folderId = await DriveApiService.findOrCreateAppFolder(
        authState.accessToken!,
      );

      // Get file name from user
      const fileName = prompt(
        "Enter file name:",
        `excalidraw-${new Date().toISOString()}.excalidraw`,
      );
      if (!fileName) {
        return;
      }

      // TODO: Replace this with actual scene data
      // const sceneData = {
      //   type: "excalidraw",
      //   version: 2,
      //   source: "https://excalidraw.com",
      //   elements: [], // Will be replaced with actual elements
      //   appState: {}, // Will be replaced with actual state
      //   files: {}, // Will be replaced with actual files
      // };

      //handle the null case written at top of this function itself
      // if (!props.excalidrawAPI) {
      //   console.warn("Excalidraw API not available");
      //   return;
      // }

      const sceneData = {
        type: "excalidraw",
        version: 2,
        source: "https://excalidraw.com",
        elements: props.excalidrawAPI.getSceneElements(),
        appState: props.excalidrawAPI.getAppState(),
        files: props.excalidrawAPI.getFiles(),
      };

      // const sceneData = await saveAsJSON(
      //   props.excalidrawAPI.getSceneElements(),
      //   props.excalidrawAPI.getAppState(),
      //   props.excalidrawAPI.getFiles(),
      //   fileName
      // );

      // Create file blob
      const file = new Blob([JSON.stringify(sceneData)], {
        type: "application/json",
      });

      // Prepare upload metadata
      const form = new FormData();
      const metadata = {
        name: fileName,
        mimeType: "application/json",
        parents: [folderId],
      };

      form.append(
        "metadata",
        new Blob([JSON.stringify(metadata)], { type: "application/json" }),
      );
      form.append("file", file);

      // Upload to Drive
      const response = await fetch(
        "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authState.accessToken}`,
          },
          body: form,
        },
      );

      if (!response.ok) {
        throw new Error("Failed to upload to Drive");
      }

      console.log("File saved successfully\n", response);
    } catch (error) {
      console.error("Error saving to Drive:", error);
    }
  };

  interface ExcalidrawSceneData {
    type: string;
    elements: ExcalidrawElement[];
    appState?: AppState;
    files?: BinaryFiles;
  }

  const handleImportFromDrive = async () => {
    if (!props.excalidrawAPI) {
      console.error("Excalidraw API not initialized");
      return;
    }

    if (!authState.isAuthenticated) {
      await login();
      return;
    }

    try {
      // Load the picker API
      await new Promise((resolve) => {
        gapi.load("picker", resolve);
      });

      // Get or create Excalidraw folder
      const folderId = await DriveApiService.findOrCreateAppFolder(
        authState.accessToken!,
      );

      // Create and configure the picker
      const picker = new google.picker.PickerBuilder()
        .addView(
          new google.picker.DocsView()
            .setParent(folderId)
            .setMimeTypes(DRIVE_CONFIG.MIME_TYPE)
            .setIncludeFolders(false),
        )
        .setOAuthToken(authState.accessToken!)
        .setDeveloperKey(DRIVE_CONFIG.API_KEY)
        .setCallback(async (data) => {
          if (
            data[google.picker.Response.ACTION] === google.picker.Action.PICKED
          ) {
            const documents = data[google.picker.Response.DOCUMENTS];
            if (!documents?.length) {
              throw new Error("No document selected");
            }
            const file = documents[0];
            const fileId = file.id;

            // Fetch the file content
            const response = await fetch(
              `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
              {
                headers: {
                  Authorization: `Bearer ${authState.accessToken}`,
                },
              },
            );

            if (!response.ok) {
              throw new Error("Failed to fetch file from Drive");
            }

            const sceneData = await response.json();
            console.log("File imported successfully", sceneData);
            // TODO: Load the file content into Excalidraw
            // This will be implemented when we add the excalidrawAPI prop
            if (
              !sceneData ||
              sceneData.type !== "excalidraw" ||
              !Array.isArray(sceneData.elements)
            ) {
              throw new Error("Invalid Excalidraw file format");
            }

            // Type assertion after validation
            const validatedScene = sceneData as ExcalidrawSceneData;
            const currentAppState = props.excalidrawAPI!.getAppState();

            // Update the scene using excalidrawAPI
            props.excalidrawAPI!.updateScene({
              elements: validatedScene.elements,
              // appState: {
              //   ...currentAppState, // Start with current state as base
              //   ...validatedScene.appState, // Override with imported state
              //   // Ensure required properties are set
              //   theme: validatedScene.appState?.theme || currentAppState.theme,
              //   collaborators: new Map(),
              //   currentChartType: validatedScene.appState?.currentChartType || "bar",
              //   viewBackgroundColor: validatedScene.appState?.viewBackgroundColor || "#ffffff",
              //   gridSize: validatedScene.appState?.gridSize || 20,
              //   name: validatedScene.appState?.name || currentAppState.name,
              //   viewModeEnabled: validatedScene.appState?.viewModeEnabled ?? false,
              //   zenModeEnabled: validatedScene.appState?.zenModeEnabled ?? false,
              //   gridModeEnabled: validatedScene.appState?.gridModeEnabled ?? false,
              //   objectsSnapModeEnabled: validatedScene.appState?.objectsSnapModeEnabled ?? false,
              // },
              appState: {
                ...getDefaultAppState(),
                ...validatedScene.appState,
                // Keep essential properties
                theme: validatedScene.appState?.theme || currentAppState.theme,
                collaborators: new Map(),
                currentChartType:
                  validatedScene.appState?.currentChartType || "bar",
                viewBackgroundColor:
                  validatedScene.appState?.viewBackgroundColor || "#ffffff",
                name: validatedScene.appState?.name || currentAppState.name,
                // Reset view properties
                width: window.innerWidth,
                height: window.innerHeight,
                zoom: { value: getNormalizedZoom(1) },
                scrollX: 0,
                scrollY: 0,
                offsetTop: 0,
                offsetLeft: 0,
              },
            });

            // Handle binary files if present
            if (validatedScene.files) {
              await props.excalidrawAPI!.addFiles(sceneData.files);
            }

            console.log("Scene updated successfully");
          }
        })
        .build();

      picker.setVisible(true);
    } catch (error) {
      console.error("Error importing from Drive:", error);
    }
  };

  return (
    <MainMenu>
      <MainMenu.DefaultItems.LoadScene />
      <MainMenu.DefaultItems.SaveToActiveFile />

      {/* Items that need excalidraw API */}
      {props.excalidrawAPI && (
        <>
          <MainMenu.Item icon={GoogleDriveLogo} onClick={handleImportFromDrive}>
            Import from Drive
          </MainMenu.Item>

          <MainMenu.Item //Added 'save to google drive' option in main menu
            icon={GoogleDriveLogo} // Import or create an icon
            onClick={handleSaveToGoogleDrive}
          >
            Save to Google Drive
          </MainMenu.Item>
        </>
      )}
      <MainMenu.DefaultItems.Export />
      <MainMenu.DefaultItems.SaveAsImage />
      {props.isCollabEnabled && (
        <MainMenu.DefaultItems.LiveCollaborationTrigger
          isCollaborating={props.isCollaborating}
          onSelect={() => props.onCollabDialogOpen()}
        />
      )}
      <MainMenu.DefaultItems.CommandPalette className="highlighted" />
      <MainMenu.DefaultItems.SearchMenu />
      <MainMenu.DefaultItems.Help />
      <MainMenu.DefaultItems.ClearCanvas />
      <MainMenu.Separator />
      <MainMenu.ItemLink
        icon={ExcalLogo}
        href={`${
          import.meta.env.VITE_APP_PLUS_LP
        }/plus?utm_source=excalidraw&utm_medium=app&utm_content=hamburger`}
        className=""
      >
        Excalidraw+
      </MainMenu.ItemLink>
      <MainMenu.DefaultItems.Socials />

      {/* <MainMenu.ItemLink
        icon={loginIcon}
        href={`${import.meta.env.VITE_APP_PLUS_APP}${
          isExcalidrawPlusSignedUser ? "" : "/sign-up"
        }?utm_source=signin&utm_medium=app&utm_content=hamburger`}
        className="highlighted"
      >
        {isExcalidrawPlusSignedUser ? "Sign in" : "Sign up"}
      </MainMenu.ItemLink> */}

      <MainMenu.Item
        icon={loginIcon}
        onClick={() => login()}
        className="highlighted"
      >
        {authState.isAuthenticated ? "Signed in" : "Sign in with Google"}
      </MainMenu.Item>

      {import.meta.env.DEV && (
        <MainMenu.Item
          icon={eyeIcon}
          onClick={() => {
            if (window.visualDebug) {
              delete window.visualDebug;
              saveDebugState({ enabled: false });
            } else {
              window.visualDebug = { data: [] };
              saveDebugState({ enabled: true });
            }
            props?.refresh();
          }}
        >
          Visual Debug
        </MainMenu.Item>
      )}
      <MainMenu.Separator />
      <MainMenu.DefaultItems.ToggleTheme
        allowSystemTheme
        theme={props.theme}
        onSelect={props.setTheme}
      />
      <MainMenu.ItemCustom>
        <LanguageList style={{ width: "100%" }} />
      </MainMenu.ItemCustom>
      <MainMenu.DefaultItems.ChangeCanvasBackground />
    </MainMenu>
  );
});
