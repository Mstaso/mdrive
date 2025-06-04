// import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { mockFiles, mockFolders } from "~/lib/mock-data";
import { db } from "~/server/db";
import { files_table, folders_table } from "~/server/db/schema";

export default async function Sandbox() {
  //   const user = await auth();
  //   if (!user.userId) {
  //     throw new Error("User not found");
  //   }

  const folders = await db.select().from(folders_table);
  // .where(eq(folders_table.ownerId, user.userId));

  console.log(folders);

  return (
    <div>
      <form
        action={async () => {
          "use server";
          function parseId(id: string): number {
            // You may want to use parseInt or a mapping if your IDs are not numeric
            return id === "root" ? 0 : parseInt(id, 10);
          }
          for (const folder of mockFolders) {
            await db.insert(folders_table).values({
              id: parseId(folder.id),
              name: folder.name,
              parent: folder.parent ? parseId(folder.parent) : null,
              // Add ownerId and createdAt if required by your schema
              ownerId: "mock-user-id",
              // createdAt: new Date(),
            });
          }

          // Insert files
          for (const file of mockFiles) {
            await db.insert(files_table).values({
              id: parseId(file.id),
              name: file.name,
              url: file.url,
              size: parseInt(file.size), // If your DB expects a number
              parent: parseId(file.parent),
              // Add ownerId and createdAt if required by your schema
              ownerId: "mock-user-id",
              // createdAt: new Date(),
            });
          }

          console.log("done");
        }}
      >
        <button type="submit">Create file</button>
      </form>
    </div>
  );
}
