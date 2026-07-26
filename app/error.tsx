"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <AlertTriangle className="text-destructive size-10" aria-hidden="true" />
      <h1 className="text-xl font-semibold">Something went wrong</h1>
      <p className="text-muted-foreground max-w-md text-sm">
        The simulation hit an unexpected error. This shouldn&apos;t affect any real traffic — try
        resetting the view below.
      </p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
