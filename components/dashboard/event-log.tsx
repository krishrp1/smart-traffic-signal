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
      <CardHeader>
        <CardTitle>Event log</CardTitle>
        <CardDescription>Accidents, emergency overrides, and scenario changes</CardDescription>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <p className="text-muted-foreground text-sm">No events yet — start the simulation.</p>
        ) : (
          <ul className="flex max-h-72 flex-col gap-2 overflow-y-auto pr-1" aria-live="polite">
            {events.map((event) => (
              <li
                key={event.id}
                className={cn(
                  "border-border/60 bg-muted/30 flex items-start justify-between gap-3 rounded-md border px-3 py-2 text-sm",
                )}
              >
                <span className="text-foreground">{event.message}</span>
                <div className="flex shrink-0 items-center gap-2">
                  <span className="text-muted-foreground text-xs tabular-nums">
                    t={event.tick}s
                  </span>
                  <Badge variant={KIND_VARIANT[event.kind]} className="capitalize">
                    {event.kind}
                  </Badge>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
