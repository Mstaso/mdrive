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

interface FileRowProps {
  file: DBFile;
  getFileIcon: (fileName: string) => React.ReactNode;
}

export function FileRow({ file, getFileIcon }: FileRowProps) {
  return (
    <a
      key={file.id}
      href={file.url}
      className="hover:bg-accent flex items-center gap-3 rounded-lg border p-3 transition-colors"
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="flex-shrink-0">{getFileIcon(file.name)}</div>
      <span className="flex-1 truncate text-sm font-medium">{file.name}</span>
      <span className="text-muted-foreground min-w-0 text-xs">{file.size}</span>
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
  );
}
