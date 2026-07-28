import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { EventLogEntry, SimulationState } from "@/lib/simulation/types";
import { cn } from "@/lib/utils";

const KIND_VARIANT: Record<
  EventLogEntry["kind"],
  "default" | "destructive" | "warning" | "success"
> = {
  info: "default",
  warning: "warning",
  danger: "destructive",
  success: "success",
};

export function EventLog({ state }: { state: SimulationState }) {
  const events = [...state.events].reverse();

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="font-mono text-xs font-bold tracking-widest uppercase">
            System logs
          </CardTitle>
          <CardDescription>Accidents, emergency overrides, and scenario changes</CardDescription>
        </div>
        <span className="bg-success size-2 animate-pulse rounded-full" aria-hidden="true" />
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <p className="text-muted-foreground font-mono text-xs">
            No events yet — start the simulation.
          </p>
        ) : (
          <ul
            className="bg-muted/40 border-border/60 flex max-h-72 flex-col gap-1.5 overflow-y-auto rounded-md border p-2"
            aria-live="polite"
          >
            {events.map((event) => (
              <li
                key={event.id}
                className={cn(
                  "flex items-start justify-between gap-3 rounded px-2 py-1.5 font-mono text-[11px]",
                )}
              >
                <span className="text-foreground/90">
                  <span className="text-muted-foreground">[t={event.tick}s]</span> {event.message}
                </span>
                <Badge
                  variant={KIND_VARIANT[event.kind]}
                  className="shrink-0 font-mono text-[9px] capitalize"
                >
                  {event.kind}
                </Badge>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
