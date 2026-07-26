import Link from "next/link";
import { TrafficCone } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <TrafficCone className="text-primary size-10" aria-hidden="true" />
      <h1 className="text-xl font-semibold">404 — Page not found</h1>
      <p className="text-muted-foreground max-w-md text-sm">
        This route doesn&apos;t exist. The intersection you&apos;re looking for isn&apos;t on the
        map.
      </p>
      <Button asChild>
        <Link href="/">Back to the simulation</Link>
      </Button>
    </div>
  );
}
