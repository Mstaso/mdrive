import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@radix-ui/react-dropdown-menu";
import { Folder as LucideFolder, MoreVertical } from "lucide-react";
import Link from "next/link";
import type { DBFolder } from "~/server/db/types";
import { Button } from "./ui/button";
import { deleteFolder } from "~/server/actions";

interface FolderRowProps {
  folder: DBFolder;
}

export function FolderRow({ folder }: FolderRowProps) {
  const handleDelete = async () => {
    await deleteFolder(folder.id);
  };
  return (
    <Link href={`/f/${folder.id}`}>
      <div className="hover:bg-accent flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors">
        <LucideFolder className="h-6 w-6 flex-shrink-0 text-blue-500" />
        <span className="flex-1 text-sm font-medium">{folder.name}</span>
        <span className="text-muted-foreground text-xs">Folder</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 flex-shrink-0"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-500" onClick={handleDelete}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Link>
  );
}
