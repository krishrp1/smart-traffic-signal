"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyChartState } from "@/components/dashboard/throughput-chart";
import { DIRECTION_LABELS } from "@/components/simulation/intersection-canvas";
import { DIRECTIONS, type SimulationState } from "@/lib/simulation/types";

const DIRECTION_COLORS: Record<string, string> = {
  north: "var(--color-primary)",
  south: "var(--color-signal-green)",
  east: "var(--color-signal-amber)",
  west: "var(--color-signal-red)",
};

export function CongestionChart({ state }: { state: SimulationState }) {
  const data = DIRECTIONS.map((direction) => ({
    direction: DIRECTION_LABELS[direction],
    key: direction,
    queueLength: state.directions[direction].queue.length,
  }));

  const hasData = state.tick > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Congestion by approach</CardTitle>
        <CardDescription>Live queue length per direction (capacity: 20)</CardDescription>
      </CardHeader>
      <CardContent className="h-64">
        {!hasData ? (
          <EmptyChartState />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis
                dataKey="direction"
                tick={{ fontSize: 11 }}
                stroke="var(--color-muted-foreground)"
              />
              <YAxis
                tick={{ fontSize: 11 }}
                stroke="var(--color-muted-foreground)"
                width={28}
                domain={[0, 20]}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--color-popover)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Bar
                dataKey="queueLength"
                name="Vehicles waiting"
                radius={[6, 6, 0, 0]}
                isAnimationActive={false}
              >
                {data.map((entry) => (
                  <Cell key={entry.key} fill={DIRECTION_COLORS[entry.key]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
