import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "~/components/ui/dropdown-menu";
import { Folder as LucideFolder, MoreVertical } from "lucide-react";
import Link from "next/link";
import type { DBFolder } from "~/server/db/types";
import { Button } from "~/components/ui/button";
import { deleteFolder, moveFileToFolder, renameFolder } from "~/server/actions";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";

interface FolderRowProps {
  folder: DBFolder;
}

export function FolderRow({ folder }: FolderRowProps) {
  const navigate = useRouter();
  const [isDragOver, setIsDragOver] = useState(false);
  const dragCounter = useRef(0); // Track drag enter/leave events
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  const handleDelete = async () => {
    await deleteFolder(folder.id);
    navigate.refresh();
  };

  const handleRename = () => {
    setNewFolderName(folder.name);
    setRenameDialogOpen(true);
  };

  const handleRenameSubmit = async () => {
    if (newFolderName.trim() && newFolderName.trim() !== folder.name) {
      try {
        await renameFolder(folder.id, newFolderName.trim());
        setRenameDialogOpen(false);
        setNewFolderName("");
      } catch (error) {
        console.error("Failed to rename folder:", error);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current++;
    if (e.dataTransfer.types.includes("text/plain")) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragOver(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current = 0;
    setIsDragOver(false);

    const fileId = e.dataTransfer.getData("text/plain");

    if (fileId) {
      try {
        await moveFileToFolder(parseInt(fileId), folder.id);
        console.log(`Moving file ${fileId} to folder ${folder.id}`);
        navigate.refresh();
      } catch (error) {
        console.error("Failed to move file:", error);
      }
    }
  };

  return (
    <div
      className={`hover:bg-accent flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-all duration-200 ${
        isDragOver && "border-2 border-blue-400 bg-blue-50 shadow-lg"
      }`}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <Link href={`/f/${folder.id}`} className="flex flex-1 items-center gap-3">
        <LucideFolder
          className={`h-6 w-6 flex-shrink-0 transition-colors ${
            isDragOver ? "text-blue-600" : "text-blue-500"
          }`}
        />
        <span className="flex-1 text-sm font-medium">{folder.name}</span>
        <span className="text-muted-foreground text-xs">Folder</span>
      </Link>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleRename}>Rename</DropdownMenuItem>
          <DropdownMenuItem>Share</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-500" onClick={handleDelete}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Rename Dialog */}
      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Folder</DialogTitle>
            <DialogDescription>
              Enter a new name for the folder
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              placeholder="Folder name"
              value={newFolderName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewFolderName(e.target.value)
              }
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === "Enter") {
                  handleRenameSubmit();
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRenameDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRenameSubmit}
              disabled={
                !newFolderName.trim() || newFolderName.trim() === folder.name
              }
            >
              Rename
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
