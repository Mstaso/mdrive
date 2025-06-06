import { auth } from "@clerk/nextjs/server";
import { HardDrive, ArrowRight } from "lucide-react";
import { redirect } from "next/navigation";
import { Button } from "~/components/ui/button";

export default function HomePage() {
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
      <main className="flex flex-1 items-center">
        <div className="container mx-auto px-6 py-12 md:py-24">
          <div className="max-w-3xl">
            <h1 className="mb-6 text-4xl leading-tight font-bold text-white md:text-6xl">
              Your files, anywhere you go
            </h1>
            <p className="mb-12 max-w-2xl text-xl text-gray-300 md:text-2xl">
              Simple, secure cloud storage for all your documents, photos, and
              videos. Access everything from any device, anytime.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <form
                action={async () => {
                  "use server";

                  const session = await auth();

                  if (!session.userId) {
                    return redirect("/sign-in");
                  }
                  return redirect("/drive");
                }}
              >
                <Button
                  size="lg"
                  className="rounded-lg border-0 bg-gradient-to-r from-purple-700 to-purple-900 px-8 py-6 text-lg text-white hover:from-purple-800 hover:to-purple-950"
                  type="submit"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
