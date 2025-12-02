import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center space-y-4">
        <div className="p-4 rounded-full bg-muted/50">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">TinyLink</h2>
        <p className="text-muted-foreground animate-pulse">Redirecting you to your destination...</p>
      </div>
    </div>
  );
}
