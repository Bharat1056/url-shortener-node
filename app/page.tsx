"use client";

import { LinkTable } from "@/components/LinkTable";
import { CreateLinkModal } from "@/components/CreateLinkModal";
import { Toaster } from "@/components/ui/sonner";

export default function Home() {
  return (
    <main className="container mx-auto py-10 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">TinyLink</h1>
          <p className="text-muted-foreground mt-2">
            Manage your shortened URLs and track their performance.
          </p>
        </div>
        <CreateLinkModal onSuccess={() => window.location.reload()} />
      </div>

      <LinkTable />
      <Toaster />
    </main>
  );
}
