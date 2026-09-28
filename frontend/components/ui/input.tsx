import * as React from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "flex h-11 w-full rounded-2xl border border-border bg-background px-4 text-sm outline-none transition focus:ring-2 focus:ring-primary",
        className,
      )}
      {...props}
    />
  );
}
