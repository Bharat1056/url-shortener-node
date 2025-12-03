"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { MousePointer, Activity } from "lucide-react";

interface ChartToggleProps {
  value: 'clicks' | 'uptime';
  onChange: (value: 'clicks' | 'uptime') => void;
}

export function ChartToggle({ value, onChange }: ChartToggleProps) {
  const options = [
    { value: 'clicks', label: 'Clicks', icon: MousePointer },
    { value: 'uptime', label: 'Uptime', icon: Activity },
  ] as const;

  return (
    <div className="flex items-center p-1 bg-muted/50 border rounded-full relative w-fit">
      {options.map((option) => {
        const isActive = value === option.value;
        const Icon = option.icon;
        return (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={cn(
              "relative flex items-center gap-2 px-6 py-2 text-sm font-medium transition-colors duration-200 rounded-full z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {isActive && (
              <motion.div
                layoutId="active-pill"
                className="absolute inset-0 bg-background shadow-sm rounded-full border"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                style={{ zIndex: -1 }}
              />
            )}
            <Icon className="w-4 h-4" />
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
