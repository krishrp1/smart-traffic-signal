"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyChartState } from "@/components/dashboard/throughput-chart";
import { DIRECTION_LABELS } from "@/components/simulation/intersection-canvas";
import type { SimulationState } from "@/lib/simulation/types";

const DIRECTION_COLORS: Record<string, string> = {
  north: "var(--color-primary)",
  south: "var(--color-signal-green)",
  east: "var(--color-signal-amber)",
  west: "var(--color-signal-red)",
};

export function SignalTimingChart({ state }: { state: SimulationState }) {
  const data = state.history.slice(-15).map((h) => ({
    cycle: h.cycle,
    direction: DIRECTION_LABELS[h.direction],
    key: h.direction,
    greenTime: h.greenTimeSeconds,
    emergency: h.emergencyOverride,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Signal timing history</CardTitle>
        <CardDescription>Green time per cycle (5 + vehicle count), last 15 cycles</CardDescription>
      </CardHeader>
      <CardContent className="h-64">
        {data.length === 0 ? (
          <EmptyChartState />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis
                dataKey="cycle"
                tick={{ fontSize: 11 }}
                stroke="var(--color-muted-foreground)"
              />
              <YAxis tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" width={28} />
              <Tooltip
                contentStyle={{
                  background: "var(--color-popover)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
                formatter={(value, _name, entry) => [
                  `${value}s${entry.payload.emergency ? " (emergency override)" : ""}`,
                  entry.payload.direction,
                ]}
              />
              <Bar
                dataKey="greenTime"
                name="Green time (s)"
                radius={[4, 4, 0, 0]}
                isAnimationActive={false}
              >
                <LabelList
                  dataKey="greenTime"
                  position="top"
                  style={{ fill: "var(--color-muted-foreground)", fontSize: 10 }}
                />
                {data.map((entry, index) => (
                  <Cell
                    key={`${entry.cycle}-${index}`}
                    fill={DIRECTION_COLORS[entry.key]}
                    stroke={entry.emergency ? "var(--color-destructive)" : undefined}
                    strokeWidth={entry.emergency ? 2 : 0}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
