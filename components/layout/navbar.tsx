import Link from "next/link";
import { TrafficCone } from "lucide-react";

import { ThemeToggle } from "@/components/layout/theme-toggle";

export function Navbar() {
  return (
    <header className="border-border/60 bg-background/80 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40 w-full border-b backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="focus-visible:ring-ring focus-visible:ring-offset-background flex items-center gap-2 rounded-md font-semibold tracking-tight focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          <TrafficCone className="text-primary size-5" aria-hidden="true" />
          <span>Smart Traffic Signal</span>
        </Link>
        <nav className="flex items-center gap-1" aria-label="Primary">
          <a
            href="https://github.com/krishrp1/smart-traffic-signal"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground focus-visible:ring-ring focus-visible:ring-offset-background rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            GitHub
          </a>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
