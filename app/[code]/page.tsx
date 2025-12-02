import { redirect } from "next/navigation";

export default async function RedirectPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

  try {
    const res = await fetch(`${API_URL}/${code}`, {
      method: "GET",
      redirect: "manual",
      cache: "no-store",
    });

    if (res.status === 404) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h1 className="text-4xl font-bold mb-4">404 - Link Not Found</h1>
          <p className="text-muted-foreground">The requested short link does not exist.</p>
        </div>
      );
    }

    if (res.status === 302 || res.status === 301 || res.status === 307 || res.status === 308) {
      const location = res.headers.get("location");
      if (location) {
        redirect(location);
      }
    }

    // Fallback if no redirect header found
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
        <p className="text-muted-foreground">Could not redirect to target URL.</p>
      </div>
    );

  } catch (error) {
    // Next.js redirect throws an error, so we need to re-throw it if it's a redirect error
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }
    console.error("Redirect error:", error);
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <p className="text-muted-foreground">Failed to process redirect.</p>
      </div>
    );
  }
}
