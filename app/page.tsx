"use client";

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
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const sim = useTrafficSimulation();

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 sm:py-10">
      <section className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">Priority scheduling algorithm</Badge>
          <Badge variant="secondary">Circular queue</Badge>
          <Badge variant="secondary">Runs entirely in your browser</Badge>
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
