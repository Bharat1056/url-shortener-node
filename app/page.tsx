"use client";

import { LinkTable } from "@/components/LinkTable";
import { CreateLinkModal } from "@/components/CreateLinkModal";
import { Toaster } from "@/components/ui/sonner";
import { StatsCards } from "@/components/StatsCards";
import { Link as LinkIcon } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex items-center space-x-2">
            <LinkIcon className="h-6 w-6" />
            <span className="font-bold text-xl tracking-tight">TinyLink</span>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <a
                href="https://github.com/Bharat1056/tinylink"
                target="_blank"
                rel="noreferrer"
                className="text-foreground/60 transition-colors hover:text-foreground/80"
              >
                GitHub
              </a>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-10 px-4 space-y-10">
        {/* Hero Section */}
        <section className="text-center space-y-4 pb-8 border-b">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
            Simplify your links, <span className="text-primary">amplify your reach.</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-[700px] mx-auto">
            A professional URL shortener designed for modern teams. Track clicks, analyze performance, and manage your links with ease.
          </p>
          <div className="pt-4">
            <CreateLinkModal onSuccess={() => window.location.reload()} />
          </div>
        </section>

        {/* Stats Section */}
        <section>
          <h2 className="text-2xl font-bold tracking-tight mb-4">System Overview</h2>
          <StatsCards />
        </section>

        {/* Links Table Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold tracking-tight">Your Links</h2>
          </div>
          <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
            <div className="p-6">
              <LinkTable />
            </div>
          </div>
        </section>
      </main>

      <Toaster />
    </div>
  );
}
