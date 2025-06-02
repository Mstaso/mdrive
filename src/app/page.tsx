"use client"

import { useState, type SetStateAction } from "react"
import { Cloud, File, FileText, Folder, ImageIcon, Loader2, MoreVertical, Plus, Upload } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog"
import { Progress } from "~/components/ui/progress"
import { ThemeProvider } from "~/components/theme-provider"

// Mock data structure
type FileType = "document" | "spreadsheet" | "presentation" | "pdf" | "image";

interface BaseItem {
  id: string;
  name: string;
  type: string;
}

interface FolderItem extends BaseItem {
  type: "folder";
  children: string[];
}

interface FileItem extends BaseItem {
  type: FileType;
  size: string;
  modified: string;
}

type Item = FolderItem | FileItem;

type MockData = Record<string, Item>;

const mockData: MockData = {
  root: {
    id: "root",
    name: "My Drive",
    type: "folder",
    children: ["folder1", "folder2", "file1", "file2", "file3"],
  },
  folder1: {
    id: "folder1",
    name: "Documents",
    type: "folder",
    children: ["file4", "file5", "folder3"],
  },
  folder2: {
    id: "folder2",
    name: "Images",
    type: "folder",
    children: ["file6", "file7"],
  },
  folder3: {
    id: "folder3",
    name: "Work",
    type: "folder",
    children: ["file8"],
  },
  file1: {
    id: "file1",
    name: "Project Proposal.docx",
    type: "document",
    size: "2.3 MB",
    modified: "May 26, 2025",
  },
  file2: {
    id: "file2",
    name: "Budget.xlsx",
    type: "spreadsheet",
    size: "1.5 MB",
    modified: "May 28, 2025",
  },
  file3: {
    id: "file3",
    name: "Profile Picture.jpg",
    type: "image",
    size: "3.2 MB",
    modified: "May 30, 2025",
  },
  file4: {
    id: "file4",
    name: "Resume.pdf",
    type: "pdf",
    size: "1.8 MB",
    modified: "May 15, 2025",
  },
  file5: {
    id: "file5",
    name: "Meeting Notes.docx",
    type: "document",
    size: "0.9 MB",
    modified: "May 20, 2025",
  },
  file6: {
    id: "file6",
    name: "Vacation.jpg",
    type: "image",
    size: "4.5 MB",
    modified: "Apr 12, 2025",
  },
  file7: {
    id: "file7",
    name: "Screenshot.png",
    type: "image",
    size: "2.1 MB",
    modified: "May 5, 2025",
  },
  file8: {
    id: "file8",
    name: "Presentation.pptx",
    type: "presentation",
    size: "5.7 MB",
    modified: "May 22, 2025",
  },
};

export default function GoogleDriveClone() {
  const [currentFolder, setCurrentFolder] = useState<string>("root")
  const [breadcrumbs, setBreadcrumbs] = useState<{ id: string; name: string }[]>([{ id: "root", name: "My Drive" }])
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  const folder = mockData[currentFolder]

  const navigateToFolder = (folderId: string, folderName: string) => {
    setCurrentFolder(folderId)

    // Update breadcrumbs
    if (folderId === "root") {
      setBreadcrumbs([{ id: "root", name: "My Drive" }])
    } else {
      const newBreadcrumbs = [...breadcrumbs]
      // Check if we're going back to a folder in the breadcrumb
      const existingIndex = newBreadcrumbs.findIndex((b) => b.id === folderId)

      if (existingIndex >= 0) {
        // If we're navigating to a folder already in breadcrumbs, trim the array
        setBreadcrumbs(newBreadcrumbs.slice(0, existingIndex + 1))
      } else {
        // Otherwise add the new folder to breadcrumbs
        setBreadcrumbs([...newBreadcrumbs, { id: folderId, name: folderName }])
      }
    }
  }

  const handleUpload = () => {
    setUploadDialogOpen(true)
    setUploadProgress(0)
    setIsUploading(false)
  }

  const simulateUpload = () => {
    setIsUploading(true)
    let progress = 0

    const interval = setInterval(() => {
      progress += 10
      setUploadProgress(progress)

      if (progress >= 100) {
        clearInterval(interval)
        setTimeout(() => {
          setIsUploading(false)
          setUploadDialogOpen(false)
        }, 500)
      }
    }, 300)
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case "document":
        return <FileText className="h-5 w-5 text-blue-500" />
      case "spreadsheet":
        return <FileText className="h-5 w-5 text-green-500" />
      case "presentation":
        return <FileText className="h-5 w-5 text-orange-500" />
      case "pdf":
        return <FileText className="h-5 w-5 text-red-500" />
      case "image":
        return <ImageIcon className="h-5 w-5 text-purple-500" />
      default:
        return <File className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <div className="h-screen bg-background dark">
        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="border-b bg-background p-4 flex items-center justify-between">
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
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-muted-foreground"
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

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="md:hidden" onClick={handleUpload}>
                <Plus className="h-5 w-5" />
              </Button>
              <Avatar>
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </div>
          </header>

          {/* Breadcrumbs */}
          <div className="bg-secondary p-4 border-b">
            <div className="flex items-center gap-1 text-sm">
              {breadcrumbs.map((crumb, index) => (
                <div key={crumb.id} className="flex items-center">
                  {index > 0 && <span className="mx-1 text-muted-foreground">/</span>}
                  <Button variant="link" className="p-0 h-auto" onClick={() => navigateToFolder(crumb.id, crumb.name)}>
                    {crumb.name}
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* File list */}
          <div className="flex-1 overflow-auto p-4">
            <div className="space-y-2">
              {folder?.type === "folder" && folder.children?.map((childId: string) => {
                const item = mockData[childId]
                if (!item) return null
                if (item.type === "folder") {
                  return (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-accent transition-colors border"
                      onClick={() => navigateToFolder(item.id, item.name)}
                    >
                      <Folder className="h-6 w-6 text-blue-500 flex-shrink-0" />
                      <span className="text-sm font-medium flex-1">{item.name}</span>
                      <span className="text-xs text-muted-foreground">Folder</span>
                    </div>
                  )
                } else {
                  return (
                    <a
                      key={item.id}
                      href={`#file-${item.id}`}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors border"
                    >
                      <div className="flex-shrink-0">{getFileIcon(item.type)}</div>
                      <span className="text-sm font-medium flex-1 truncate">{item.name}</span>
                      <span className="text-xs text-muted-foreground min-w-0">{item.size}</span>
                      <span className="text-xs text-muted-foreground min-w-0">{item.modified}</span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Download</DropdownMenuItem>
                          <DropdownMenuItem>Share</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </a>
                  )
                }
              })}
            </div>
          </div>
        </div>

        {/* Upload Dialog */}
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload files</DialogTitle>
              <DialogDescription>Upload files to your drive</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <div className="flex flex-col items-center gap-2">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <p className="text-sm font-medium">Drag and drop files here or click to browse</p>
                  <p className="text-xs text-muted-foreground">Supports any file type up to 15GB</p>
                  <Button variant="secondary" className="mt-2" onClick={simulateUpload} disabled={isUploading}>
                    Select files
                  </Button>
                </div>
              </div>

              {isUploading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Uploading...</span>
                    <span className="text-sm text-muted-foreground">{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setUploadDialogOpen(false)} disabled={isUploading}>
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
  )
}
