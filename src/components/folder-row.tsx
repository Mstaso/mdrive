import { Folder as LucideFolder } from "lucide-react";
import type { DBFolder } from "~/server/db/types";

interface FolderRowProps {
  folder: DBFolder;
  navigateToFolder: (id: number, name: string) => void;
}

export function FolderRow({ folder, navigateToFolder }: FolderRowProps) {
  return (
    <div
      key={folder.id}
      className="hover:bg-accent flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors"
      onClick={() => navigateToFolder(folder.id, folder.name)}
    >
      <LucideFolder className="h-6 w-6 flex-shrink-0 text-blue-500" />
      <span className="flex-1 text-sm font-medium">{folder.name}</span>
      <span className="text-muted-foreground text-xs">Folder</span>
    </div>
  );
}
