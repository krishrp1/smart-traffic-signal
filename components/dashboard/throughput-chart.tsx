"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { SimulationState } from "@/lib/simulation/types";

export function ThroughputChart({ state }: { state: SimulationState }) {
  const data = state.metricsHistory.map((m) => ({
    tick: m.tick,
    throughput: m.throughputPerMinute,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Throughput &amp; wait time</CardTitle>
        <CardDescription>Vehicles cleared per minute vs. average wait, over time</CardDescription>
      </CardHeader>
      <CardContent className="h-64">
        {data.length < 2 ? (
          <EmptyChartState />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="throughputFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis
                dataKey="tick"
                tick={{ fontSize: 11 }}
                stroke="var(--color-muted-foreground)"
                tickFormatter={(v: number) => `${v}s`}
              />
              <YAxis tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" width={36} />
              <Tooltip
                contentStyle={{
                  background: "var(--color-popover)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
                labelFormatter={(v) => `t = ${v}s`}
              />
              <Area
                type="monotone"
                dataKey="throughput"
                name="Throughput (veh/min)"
                stroke="var(--color-primary)"
                fill="url(#throughputFill)"
                strokeWidth={2}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

export function EmptyChartState() {
  return (
    <div className="text-muted-foreground flex h-full items-center justify-center text-sm">
      Start the simulation to see live data.
    </div>
  );
}
