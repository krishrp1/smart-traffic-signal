import Link from "next/link";
import { TrafficCone } from "lucide-react";

import { ThemeToggle } from "@/components/layout/theme-toggle";

export function Navbar() {
  return (
    <header className="glass sticky top-0 z-40 w-full border-x-0 border-t-0">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="focus-visible:ring-ring focus-visible:ring-offset-background flex items-center gap-2 rounded-md font-semibold tracking-tighter focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          <TrafficCone className="text-primary size-5" aria-hidden="true" />
          <span>Smart Traffic Signal</span>
        </Link>
        <nav className="flex items-center gap-3" aria-label="Primary">
          <div className="bg-secondary hidden items-center gap-2 rounded-full border border-transparent px-3 py-1 sm:flex">
            <span className="bg-success size-2 animate-pulse rounded-full" aria-hidden="true" />
            <span className="text-success font-mono text-[10px] font-bold tracking-widest uppercase">
              Live: sim_01
            </span>
          </div>
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
