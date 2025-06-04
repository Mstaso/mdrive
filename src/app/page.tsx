import DriveContents from "./drive-contents";
import { QUERIES } from "~/server/db/queries";

export default async function Mdrive() {
  const [folders, files] = await Promise.all([
    QUERIES.getAllFolders(),
    QUERIES.getAllFiles(),
  ]);

  return (
    <DriveContents files={files} folders={folders} folderId={0} parents={[]} />
  );
}
