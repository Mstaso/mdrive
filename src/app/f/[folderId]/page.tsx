import DriveContents from "~/components/drive-contents";
import { QUERIES } from "~/server/db/queries";

export default async function FolderPage(props: {
  params: {
    folderId: string;
  };
}) {
  const params = await props.params;

  const parsedFolderId = parseInt(params.folderId);

  if (isNaN(parsedFolderId)) {
    return <div>Invalid folder ID</div>;
  }

  const [folders, files, parents] = await Promise.all([
    QUERIES.getFolders(parsedFolderId),
    QUERIES.getFiles(parsedFolderId),
    QUERIES.getAllParentsForFolder(parsedFolderId),
  ]);

  return (
    <DriveContents
      files={files}
      folders={folders}
      folderId={parsedFolderId}
      parents={parents}
    />
  );
}
