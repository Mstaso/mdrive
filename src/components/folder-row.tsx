import { Folder as LucideFolder } from "lucide-react";
import type { Folder as MockFolder } from "~/lib/mock-data";

interface FolderRowProps {
  folder: MockFolder;
  navigateToFolder: (id: string, name: string) => void;
}

export function FolderRow({ folder, navigateToFolder }: FolderRowProps) {
  return (
    <div
      key={folder.id}
      className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-accent transition-colors border"
      onClick={() => navigateToFolder(folder.id, folder.name)}
    >
      <LucideFolder className="h-6 w-6 text-blue-500 flex-shrink-0" />
      <span className="text-sm font-medium flex-1">{folder.name}</span>
      <span className="text-xs text-muted-foreground">Folder</span>
    </div>
  );
} 