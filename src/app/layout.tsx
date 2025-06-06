import "~/styles/globals.css";

import { type Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { PostHogProvider } from "./_providers/posthog-provider";

export const metadata: Metadata = {
  title: "Mdrive",
  description: "Mdrive is a modern cloud storage solution",
  icons: [{ rel: "icon", url: "/drive-icon.svg" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    throw new Error("Missing Clerk Publishable Key");
  }

  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      <html lang="en">
        <body>
          <PostHogProvider>{children}</PostHogProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
