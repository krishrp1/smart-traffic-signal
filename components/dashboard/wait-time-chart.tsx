"use client";

import {
  Line,
  LineChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyChartState } from "@/components/dashboard/throughput-chart";
import type { SimulationState } from "@/lib/simulation/types";

export function WaitTimeChart({ state }: { state: SimulationState }) {
  const data = state.metricsHistory.map((m) => ({
    tick: m.tick,
    waitTime: m.avgWaitTimeSeconds,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Average wait time</CardTitle>
        <CardDescription>Rolling average across the last 50 vehicles processed</CardDescription>
      </CardHeader>
      <CardContent className="h-64">
        {data.length < 2 ? (
          <EmptyChartState />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis
                dataKey="tick"
                tick={{ fontSize: 11 }}
                stroke="var(--color-muted-foreground)"
                tickFormatter={(v: number) => `${v}s`}
              />
              <YAxis
                tick={{ fontSize: 11 }}
                stroke="var(--color-muted-foreground)"
                width={32}
                allowDecimals={false}
                domain={[0, (max: number) => Math.max(5, Math.ceil(max))]}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--color-popover)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
                labelFormatter={(v) => `t = ${v}s`}
                formatter={(value) => [`${value}s`, "Avg. wait"]}
              />
              <Line
                type="monotone"
                dataKey="waitTime"
                name="Avg. wait (s)"
                stroke="var(--color-signal-amber)"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
