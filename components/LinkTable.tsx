"use client";

import { useState, useEffect } from "react";
import { Link, api } from "@/lib/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner"
import { Copy, Trash2, ExternalLink, BarChart2, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";

export function LinkTable() {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const router = useRouter();

  const fetchLinks = async () => {
    setLoading(true);
    try {
      const res = await api.getLinks(page, limit, search);
      setLinks(res.data);
      setTotal(res.pagination.total);
    } catch (error) {
      toast("Error", {
        description: "Failed to fetch links",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLinks();
    }, 300);
    return () => clearTimeout(timer);
  }, [page, limit, search]);

  const copyToClipboard = (shortCode: string) => {
    const url = `${window.location.origin}/${shortCode}`;
    navigator.clipboard.writeText(url);
    toast( "Copied!", {
      description: "Link copied to clipboard",
    });
  };

  const handleDelete = async (code: string) => {
    if (!confirm("Are you sure you want to delete this link?")) return;
    try {
      await api.deleteLink(code);
      toast("Success", {
        description: "Link deleted successfully",
      });
      fetchLinks();
    } catch (error) {
      toast("Error", {
        description: "Failed to delete link",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search links..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select
          value={limit.toString()}
          onValueChange={(val) => setLimit(parseInt(val))}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Rows per page" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5 per page</SelectItem>
            <SelectItem value="10">10 per page</SelectItem>
            <SelectItem value="20">20 per page</SelectItem>
            <SelectItem value="50">50 per page</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Short Code</TableHead>
              <TableHead>Target URL</TableHead>
              <TableHead>Clicks</TableHead>
              <TableHead>Last Clicked</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : links.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No links found
                </TableCell>
              </TableRow>
            ) : (
              links.map((link) => (
                <TableRow key={link.id}>
                  <TableCell className="font-medium">
                    <a
                      href={`/${link.shortCode}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-1"
                    >
                      {link.shortCode}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate" title={link.targetUrl}>
                    {link.targetUrl}
                  </TableCell>
                  <TableCell>{link.totalClicks}</TableCell>
                  <TableCell>
                    {link.lastClicked
                      ? formatDistanceToNow(new Date(link.lastClicked), { addSuffix: true })
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {formatDistanceToNow(new Date(link.createdAt), { addSuffix: true })}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard(link.shortCode)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => router.push(`/code/${link.shortCode}`)}
                    >
                      <BarChart2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-600"
                      onClick={() => handleDelete(link.shortCode)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {links.length > 0 ? (page - 1) * limit + 1 : 0} to{" "}
          {Math.min(page * limit, total)} of {total} links
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => p + 1)}
            disabled={page * limit >= total}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
