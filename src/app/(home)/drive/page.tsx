import { auth } from "@clerk/nextjs/server";
import { HardDrive } from "lucide-react";
import { redirect } from "next/navigation";
import { Button } from "~/components/ui/button";
import { MUTATIONS, QUERIES } from "~/server/db/queries";

export default async function DrivePage() {
  const session = await auth();

  if (!session.userId) {
    return redirect("/sign-in");
  }

  const rootFolder = await QUERIES.getRootFolderForUser(session.userId);

  if (!rootFolder) {
    return (
      <div className="flex min-h-screen flex-col bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
        {/* Header */}
        <header className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HardDrive className="h-8 w-8 text-purple-400" />
              <span className="text-2xl font-bold text-white">Mdrive</span>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <main className="flex flex-1 items-center justify-center">
          <form
            action={async () => {
              "use server";
              const session = await auth();

              if (!session.userId) {
                return redirect("/sign-in");
              }

              const rootFolderId = await MUTATIONS.onboardUser(session.userId);

              return redirect(`/f/${rootFolderId}`);
            }}
          >
            <Button className="rounded-lg border-0 bg-gradient-to-r from-purple-700 to-purple-900 px-8 py-6 text-lg text-white hover:from-purple-800 hover:to-purple-950">
              Create new Drive
            </Button>
          </form>
        </main>
      </div>
    );
  }
  return redirect(`/f/${rootFolder.id}`);
}
