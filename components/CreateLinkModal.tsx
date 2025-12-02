"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner"
import { Plus } from "lucide-react";

interface CreateLinkModalProps {
  onSuccess: () => void;
}

export function CreateLinkModal({ onSuccess }: CreateLinkModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [targetUrl, setTargetUrl] = useState("");
  const [customCode, setCustomCode] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.createLink(targetUrl, customCode || undefined);
      toast("Success", {
        description: "Link created successfully",
      });
      setOpen(false);
      setTargetUrl("");
      setCustomCode("");
      onSuccess();
    } catch (error: any) {
      toast("Error", {
        description: error.message || "Failed to create link",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Link
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Link</DialogTitle>
            <DialogDescription>
              Enter a long URL to shorten it. You can optionally provide a custom
              short code.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="url" className="text-right">
                URL
              </Label>
              <Input
                id="url"
                type="url"
                required
                placeholder="https://example.com"
                className="col-span-3"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="code" className="text-right">
                Code
              </Label>
              <Input
                id="code"
                placeholder="custom-code (optional)"
                className="col-span-3"
                value={customCode}
                onChange={(e) => setCustomCode(e.target.value)}
                maxLength={8}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Link"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
