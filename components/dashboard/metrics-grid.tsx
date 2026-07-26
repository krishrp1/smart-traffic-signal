import type { ComponentType } from "react";
import { Activity, Car, Clock, Siren, TrafficCone, Gauge } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SimulationState } from "@/lib/simulation/types";

function averageCongestion(state: SimulationState): number {
  const values = Object.values(state.directions).map((d) => d.queue.length);
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  return Math.round((avg / 20) * 100);
}

interface Metric {
  label: string;
  value: string;
  icon: ComponentType<{ className?: string }>;
  hint: string;
}

export function MetricsGrid({ state }: { state: SimulationState }) {
  const latest = state.metricsHistory.at(-1);
  const congestion = averageCongestion(state);

  const metrics: Metric[] = [
    {
      label: "Vehicles processed",
      value: state.totalVehiclesProcessed.toLocaleString(),
      icon: Car,
      hint: `${state.totalVehiclesSpawned.toLocaleString()} spawned`,
    },
    {
      label: "Throughput",
      value: `${latest?.throughputPerMinute ?? 0}/min`,
      icon: Activity,
      hint: "Vehicles cleared per minute",
    },
    {
      label: "Avg. wait time",
      value: `${latest?.avgWaitTimeSeconds ?? 0}s`,
      icon: Clock,
      hint: "Rolling average, last 50 vehicles",
    },
    {
      label: "Congestion",
      value: `${congestion}%`,
      icon: Gauge,
      hint: "Average queue fill across all approaches",
    },
    {
      label: "Signal cycle",
      value: `#${state.cycle}`,
      icon: TrafficCone,
      hint: state.activeDirection
        ? `${state.currentGreenTimeSeconds}s remaining`
        : "Selecting next…",
    },
    {
      label: "Emergency overrides",
      value: state.emergencyOverrideCount.toLocaleString(),
      icon: Siren,
      hint: "Priority preemptions this session",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {metrics.map(({ label, value, icon: Icon, hint }) => (
        <Card key={label}>
          <CardHeader className="flex-row items-center justify-between gap-2 space-y-0 p-4 pb-1">
            <CardTitle className="text-muted-foreground text-xs font-medium">{label}</CardTitle>
            <Icon className="text-muted-foreground size-4" />
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <p className="text-2xl font-semibold tabular-nums">{value}</p>
            <p className="text-muted-foreground mt-0.5 truncate text-xs">{hint}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
