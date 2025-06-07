import { MoreVertical } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import React from "react";
import type { DBFile } from "~/server/db/types";
import { deleteFile } from "~/server/actions";

interface FileRowProps {
  file: DBFile;
  getFileIcon: (fileName: string) => React.ReactNode;
}

export function FileRow({ file, getFileIcon }: FileRowProps) {
  function formatFileSize(bytes: number): string {
    const units = ["B", "KB", "MB", "GB"];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
  }
  const handleDelete = async () => {
    await deleteFile(file.id);
  };

  const handleDownload = () => {
    window.open(file.url, "_blank");
    fetch(file.url)
      .then((res) => res.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = file.name;
        a.click();
      });
  };

  const handleDragStart = (e: React.DragEvent) => {
    // Store the file ID in the drag data
    e.dataTransfer.setData("text/plain", file.id.toString());
    e.dataTransfer.effectAllowed = "move";
  };
  return (
    <a
      href={file.url}
      className="hover:bg-accent flex items-center gap-3 rounded-lg border p-3 transition-colors"
      target="_blank"
      rel="noopener noreferrer"
      draggable="true"
      onDragStart={handleDragStart}
    >
      <div className="flex-shrink-0">{getFileIcon(file.name)}</div>
      <span className="flex-1 truncate text-sm font-medium">{file.name}</span>
      <span className="text-muted-foreground min-w-0 text-xs">
        {formatFileSize(file.size)}
      </span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleDownload}>Download</DropdownMenuItem>
          {/* <DropdownMenuItem>Share</DropdownMenuItem> */}
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-500" onClick={handleDelete}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </a>
  );
}
