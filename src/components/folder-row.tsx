import { Folder as LucideFolder } from "lucide-react";
import Link from "next/link";
import type { DBFolder } from "~/server/db/types";

interface FolderRowProps {
  folder: DBFolder;
}

export function FolderRow({ folder }: FolderRowProps) {
  return (
    <Link href={`/f/${folder.id}`}>
      <div className="hover:bg-accent flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors">
        <LucideFolder className="h-6 w-6 flex-shrink-0 text-blue-500" />
        <span className="flex-1 text-sm font-medium">{folder.name}</span>
        <span className="text-muted-foreground text-xs">Folder</span>
      </div>
    </Link>
  );
}
