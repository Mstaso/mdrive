"use server";

import { and, eq } from "drizzle-orm";
import { db } from "./db";
import { files_table, folders_table } from "./db/schema";
import { auth } from "@clerk/nextjs/server";
import { UTApi } from "uploadthing/server";
import { cookies } from "next/headers";
import { MUTATIONS } from "~/server/db/queries";
import { revalidatePath } from "next/cache";

const utApi = new UTApi();

export async function deleteFile(fileId: number, noCookies?: boolean) {
  const session = await auth();
  if (!session.userId) {
    return { error: "Unauthorized" };
  }

  const [file] = await db
    .select()
    .from(files_table)
    .where(
      and(eq(files_table.id, fileId), eq(files_table.ownerId, session.userId)),
    );

  if (!file) {
    return { error: "File not found" };
  }

  const utapiResult = await utApi.deleteFiles([
    file.url.replace("https://utfs.io/f/", ""),
  ]);

  console.log(utapiResult);

  if (!noCookies) {
    const dbDeleteResult = await db
      .delete(files_table)
      .where(eq(files_table.id, fileId));

    console.log(dbDeleteResult);

    const c = await cookies();

    c.set("force-refresh", JSON.stringify(Math.random()));
  }

  return { success: true };
}

export async function createFolder(folderName: string, parentId: number) {
  const session = await auth();

  if (!session.userId) {
    throw new Error("Unauthorized");
  }

  const newFolder = await MUTATIONS.createFolder({
    folder: {
      name: folderName,
      parent: parentId,
    },
    userId: session.userId,
  });

  // Revalidate the page to show the new folder
  revalidatePath("/");

  return newFolder;
}

export async function deleteFolder(folderId: number) {
  const session = await auth();

  if (!session.userId) {
    throw new Error("Unauthorized");
  }

  // const folders = await db.select().from(folders_table).where(eq(folders_table.id, parentId));
  const files = await db
    .select()
    .from(files_table)
    .where(eq(files_table.parent, folderId));

  console.log("been hit files", files);

  if (files.length > 0) {
    files.forEach(async (file) => {
      await deleteFile(file.id, true);
    });
  }

  const dbDeleteResult = await db
    .delete(folders_table)
    .where(eq(folders_table.id, folderId));

  console.log(dbDeleteResult, "deleted folder and files");

  // Revalidate the page to show the new folder
  revalidatePath("/");
}
