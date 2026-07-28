"use client";

import { useState } from "react";

import { useTrafficSimulation } from "@/hooks/useTrafficSimulation";
import { IntersectionCanvas } from "@/components/simulation/intersection-canvas";
import { ControlPanel } from "@/components/simulation/control-panel";
import { ScenarioControls } from "@/components/simulation/scenario-controls";
import { MetricsGrid } from "@/components/dashboard/metrics-grid";
import { ThroughputChart } from "@/components/dashboard/throughput-chart";
import { WaitTimeChart } from "@/components/dashboard/wait-time-chart";
import { CongestionChart } from "@/components/dashboard/congestion-chart";
import { SignalTimingChart } from "@/components/dashboard/signal-timing-chart";
import { EventLog } from "@/components/dashboard/event-log";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const INFO_CHIPS = [
  {
    label: "Priority scheduling algorithm",
    detail:
      "Each cycle, the approach with the most queued vehicles gets priority — a greedy scheduler, not round-robin.",
  },
  {
    label: "Circular queue",
    detail:
      "Vehicles are stored in a fixed-capacity circular queue per approach — O(1) enqueue/dequeue, no array shifting.",
  },
  {
    label: "Runs entirely in your browser",
    detail: "No backend, no database — the simulation and scheduler run client-side in this tab.",
  },
] as const;

export default function Home() {
  const sim = useTrafficSimulation();
  const [activeChip, setActiveChip] = useState<string | null>(null);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 sm:py-10">
      <section className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {INFO_CHIPS.map((chip) => {
            const isActive = activeChip === chip.label;
            return (
              <button
                key={chip.label}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActiveChip(isActive ? null : chip.label)}
                className={cn(
                  "font-mono rounded-full border px-3 py-1 text-[10px] font-bold tracking-widest uppercase transition-all",
                  isActive
                    ? "bg-primary text-primary-foreground border-primary glow-primary"
                    : "bg-secondary/60 text-muted-foreground border-border hover:bg-secondary hover:text-foreground",
                )}
              >
                {chip.label}
              </button>
            );
          })}
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Smart Traffic Signal Controller
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          An interactive simulation of a four-way intersection managed by a queue-based priority
          scheduler: the approach with the most vehicles gets a green light for{" "}
          <span className="text-foreground font-mono">5 + vehicle count</span> seconds, capped at 5
          vehicles per cycle. Adjust density, trigger rush hour, rain, accidents, and emergency
          vehicles, and watch the scheduler adapt in real time.
        </p>
        {activeChip && (
          <p className="text-primary bg-primary/10 border-primary/20 max-w-2xl rounded-md border px-3 py-2 text-sm">
            {INFO_CHIPS.find((chip) => chip.label === activeChip)?.detail}
          </p>
        )}
      </section>

      <MetricsGrid state={sim.state} />

      <Tabs defaultValue="simulation">
        <TabsList>
          <TabsTrigger value="simulation">Simulation</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent
          value="simulation"
          className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]"
        >
          <IntersectionCanvas state={sim.state} />
          <div className="flex flex-col gap-4">
            <ControlPanel sim={sim} />
            <ScenarioControls sim={sim} />
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="flex flex-col gap-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <ThroughputChart state={sim.state} />
            <WaitTimeChart state={sim.state} />
            <CongestionChart state={sim.state} />
            <SignalTimingChart state={sim.state} />
          </div>
          <EventLog state={sim.state} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
