import { redirect } from "next/navigation";
import axios from "axios";

export default async function RedirectPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

  try {
    const response = await axios.get(`${API_URL}/${code}`, {
      maxRedirects: 0,
      validateStatus: (status) => status >= 200 && status < 400,
    });

    if (response.status === 302 || response.status === 301 || response.status === 307 || response.status === 308) {
      const location = response.headers["location"];
      if (location) {
        redirect(location);
      }
    }

    // Fallback
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
        <p className="text-muted-foreground">Could not redirect to target URL.</p>
      </div>
    );

  } catch (error: any) {
    // Next.js redirect throws an error
    if (error.message === "NEXT_REDIRECT") {
      throw error;
    }

    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        return (
          <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-4xl font-bold mb-4">404 - Link Not Found</h1>
            <p className="text-muted-foreground">The requested short link does not exist.</p>
          </div>
        );
      }
    }
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <p className="text-muted-foreground">Failed to process redirect.</p>
      </div>
    );
  }
}

