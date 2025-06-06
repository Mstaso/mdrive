"use client";

import { File, FileText, HardDrive, ImageIcon, Plus } from "lucide-react";
import { Button } from "~/components/ui/button";
import { ThemeProvider } from "~/components/theme-provider";
import { FolderRow } from "./folder-row";
import { FileRow } from "./file-row";
import type { DBFile, DBFolder } from "~/server/db/types";
import Link from "next/link";
import {
  SignedOut,
  SignInButton,
  SignUpButton,
  SignedIn,
  UserButton,
} from "@clerk/nextjs";
import { UploadButton } from "@uploadthing/react";
import { useRouter } from "next/navigation";
import posthog from "posthog-js";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { createFolder } from "~/server/actions";

// Helper functions to get folders and files by parent
const getFoldersByParent = (folders: DBFolder[], parentId: number) =>
  folders.filter((f) => f.parent === parentId);
const getFilesByParent = (files: DBFile[], parentId: number) =>
  files.filter((f) => f.parent === parentId);

export default function DriveContents(props: {
  files: DBFile[];
  folders: DBFolder[];
  folderId: number;
  parents: DBFolder[];
}) {
  const currentFolder = props.folderId
    ? props.folderId
    : props.folders[0]?.id
      ? props.folders[0]?.id
      : 0;

  const navigate = useRouter();

  const [createFolderOpen, setCreateFolderOpen] = useState(false);
  const [folderName, setFolderName] = useState("");

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase();
    switch (ext) {
      case "docx":
        return <FileText className="h-5 w-5 text-blue-500" />;
      case "xlsx":
        return <FileText className="h-5 w-5 text-green-500" />;
      case "pptx":
        return <FileText className="h-5 w-5 text-orange-500" />;
      case "pdf":
        return <FileText className="h-5 w-5 text-red-500" />;
      case "jpg":
      case "jpeg":
      case "png":
        return <ImageIcon className="h-5 w-5 text-purple-500" />;
      default:
        return <File className="h-5 w-5 text-gray-500" />;
    }
  };

  const handleCreateFolder = async () => {
    if (folderName.trim()) {
      // TODO: Add your folder creation logic here
      console.log("Creating folder:", folderName);

      // Reset form and close dialog
      setFolderName("");
      setCreateFolderOpen(false);

      try {
        await createFolder(folderName, currentFolder);
        setFolderName("");
        setCreateFolderOpen(false);
      } catch (error) {
        console.error("Failed to create folder:", error);
      }
    }
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <div className="bg-background dark h-screen">
        {/* Main content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <header className="bg-background flex items-center justify-between border-b p-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <HardDrive className="h-8 w-8 text-purple-400" />
                <span className="text-2xl font-bold text-white">Mdrive</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <SignedOut>
                <SignInButton />
                <SignUpButton />
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </header>
          <Button
            className="m-4 w-1/5 gap-2 overflow-hidden"
            onClick={() => setCreateFolderOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Folder
          </Button>

          {/* Breadcrumbs */}
          <div className="bg-secondary border-b p-4">
            <div className="flex items-center gap-1 text-sm">
              {props.parents?.map((crumb, index) => (
                <Link href={`/f/${crumb.id}`} key={crumb.id}>
                  <div className="flex items-center">
                    {index > 0 && (
                      <span className="text-muted-foreground mx-1">/</span>
                    )}
                    <Button variant="link" className="h-auto p-0">
                      {crumb.name === "root" ? "Mdrive" : crumb.name}
                    </Button>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-auto p-4">
            <div className="space-y-2">
              {/* List folders */}
              {getFoldersByParent(props.folders, currentFolder)?.map(
                (folder) => <FolderRow key={folder.id} folder={folder} />,
              )}
              {/* List files */}
              {getFilesByParent(props.files, currentFolder)?.map((file) => (
                <FileRow key={file.id} file={file} getFileIcon={getFileIcon} />
              ))}
            </div>
          </div>

          {/* @ts-ignore */}
          <UploadButton
            label="Upload"
            content={{
              button: "Upload File",
            }}
            endpoint="driveUploader"
            onClientUploadComplete={() => {
              navigate.refresh();
              posthog.capture("fileupload", { fileId: currentFolder });
            }}
            input={{
              folderId: currentFolder,
            }}
          />
        </div>

        {/* Create Folder Dialog */}
        <Dialog open={createFolderOpen} onOpenChange={setCreateFolderOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Folder</DialogTitle>
              <DialogDescription>
                Enter a name for your new folder
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Input
                placeholder="Folder name"
                value={folderName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFolderName(e.target.value)
                }
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === "Enter") {
                    handleCreateFolder();
                  }
                }}
              />
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setCreateFolderOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateFolder}
                disabled={!folderName.trim()}
              >
                Create Folder
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ThemeProvider>
  );
}
