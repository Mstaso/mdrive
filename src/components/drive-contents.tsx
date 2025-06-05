"use client";

import { useState } from "react";
import {
  Cloud,
  File,
  FileText,
  ImageIcon,
  Loader2,
  Plus,
  Upload,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Progress } from "~/components/ui/progress";
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

  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const navigate = useRouter();
  const handleUpload = () => {
    setUploadDialogOpen(true);
    setUploadProgress(0);
    setIsUploading(false);
  };

  const simulateUpload = () => {
    setIsUploading(true);
    let progress = 0;

    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsUploading(false);
          setUploadDialogOpen(false);
        }, 500);
      }
    }, 300);
  };

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

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <div className="bg-background dark h-screen">
        {/* Main content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Header */}
          <header className="bg-background flex items-center justify-between border-b p-4">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="md:hidden">
                <Cloud className="h-6 w-6" />
              </Button>
              <Button onClick={handleUpload} className="gap-2">
                <Plus className="h-4 w-4" />
                New
              </Button>
              <div className="relative w-full max-w-md">
                <Input placeholder="Search in Drive" className="pl-10" />
                <div className="absolute top-1/2 left-3 -translate-y-1/2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-muted-foreground h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <SignedOut>
              <SignInButton />
              <SignUpButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </header>

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

        {/* Upload Dialog */}
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload files</DialogTitle>
              <DialogDescription>Upload files to your drive</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="rounded-lg border-2 border-dashed p-8 text-center">
                <div className="flex flex-col items-center gap-2">
                  <Upload className="text-muted-foreground h-8 w-8" />
                  <p className="text-sm font-medium">
                    Drag and drop files here or click to browse
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Supports any file type up to 15GB
                  </p>
                  <Button
                    variant="secondary"
                    className="mt-2"
                    onClick={simulateUpload}
                    disabled={isUploading}
                  >
                    Select files
                  </Button>
                </div>
              </div>

              {isUploading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Uploading...</span>
                    <span className="text-muted-foreground text-sm">
                      {uploadProgress}%
                    </span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setUploadDialogOpen(false)}
                disabled={isUploading}
              >
                Cancel
              </Button>
              <Button onClick={simulateUpload} disabled={isUploading}>
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading
                  </>
                ) : (
                  "Upload"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ThemeProvider>
  );
}
