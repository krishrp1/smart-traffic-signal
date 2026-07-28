import type { ComponentType } from "react";
import { Activity, Car, Clock, Siren, TrafficCone, Gauge } from "lucide-react";

import { cn } from "@/lib/utils";
import type { SimulationState } from "@/lib/simulation/types";

function averageCongestion(state: SimulationState): number {
  const values = Object.values(state.directions).map((d) => d.queue.length);
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  return Math.round((avg / 20) * 100);
}

type Accent = "primary" | "success" | "signal-red" | "muted-foreground";

interface Metric {
  label: string;
  value: string;
  icon: ComponentType<{ className?: string }>;
  hint: string;
  accent: Accent;
}

const ACCENT_BAR: Record<Accent, string> = {
  primary: "bg-primary glow-primary",
  success: "bg-success glow-success",
  "signal-red": "bg-signal-red glow-signal-red",
  "muted-foreground": "bg-muted-foreground/40",
};

const ACCENT_TEXT: Record<Accent, string> = {
  primary: "text-primary",
  success: "text-success",
  "signal-red": "text-signal-red",
  "muted-foreground": "text-muted-foreground",
};

export function MetricsGrid({ state }: { state: SimulationState }) {
  const latest = state.metricsHistory.at(-1);
  const congestion = averageCongestion(state);

  const metrics: Metric[] = [
    {
      label: "Vehicles processed",
      value: state.totalVehiclesProcessed.toLocaleString(),
      icon: Car,
      hint: `${state.totalVehiclesSpawned.toLocaleString()} spawned`,
      accent: "success",
    },
    {
      label: "Throughput",
      value: `${latest?.throughputPerMinute ?? 0}/min`,
      icon: Activity,
      hint: "Vehicles cleared per minute",
      accent: "primary",
    },
    {
      label: "Avg. wait time",
      value: `${latest?.avgWaitTimeSeconds ?? 0}s`,
      icon: Clock,
      hint: "Rolling average, last 50 vehicles",
      accent: "primary",
    },
    {
      label: "Congestion",
      value: `${congestion}%`,
      icon: Gauge,
      hint: "Average queue fill across all approaches",
      accent: congestion >= 70 ? "signal-red" : "muted-foreground",
    },
    {
      label: "Signal cycle",
      value: `#${state.cycle}`,
      icon: TrafficCone,
      hint: state.activeDirection
        ? `${state.currentGreenTimeSeconds}s remaining`
        : "Selecting next…",
      accent: "muted-foreground",
    },
    {
      label: "Emergency overrides",
      value: state.emergencyOverrideCount.toLocaleString(),
      icon: Siren,
      hint: "Priority preemptions this session",
      accent: state.emergencyOverrideCount > 0 ? "signal-red" : "muted-foreground",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {metrics.map(({ label, value, icon: Icon, hint, accent }, index) => (
        <div
          key={label}
          className="bg-card/95 border-border animate-in fade-in-0 slide-in-from-bottom-2 fill-mode-backwards flex flex-col justify-between gap-2 rounded-lg border p-4 backdrop-blur-md duration-500"
          style={{ animationDelay: `${index * 60}ms` }}
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-muted-foreground font-mono text-[10px] font-bold tracking-widest uppercase">
              {label}
            </span>
            <Icon className="text-muted-foreground size-3.5" />
          </div>
          <div className="flex items-baseline justify-between gap-2">
            <p className="font-mono text-xl font-semibold tabular-nums">{value}</p>
          </div>
          <p className={cn("truncate text-[11px]", ACCENT_TEXT[accent])}>{hint}</p>
          <div className="bg-muted h-1 w-full overflow-hidden rounded-full">
            <div className={cn("h-full w-full", ACCENT_BAR[accent])} />
          </div>
        </div>
      ))}
    </div>
  );
}
