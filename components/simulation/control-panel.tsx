"use client";

import { Pause, Play, RotateCcw, SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TrafficSimulationApi } from "@/hooks/useTrafficSimulation";

export function ControlPanel({ sim }: { sim: TrafficSimulationApi }) {
  const { state } = sim;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-foreground flex items-center gap-2 font-mono text-xs font-bold tracking-widest uppercase">
          <SlidersHorizontal className="text-primary size-4" aria-hidden="true" />
          Control panel
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="border-border/60 flex items-center justify-between gap-3 border-y py-3">
          <span className="text-muted-foreground font-mono text-[11px] tracking-widest uppercase">
            Playback
          </span>
          <div className="flex items-center gap-2">
            <Button onClick={sim.reset} variant="secondary" size="icon" aria-label="Reset simulation">
              <RotateCcw aria-hidden="true" />
            </Button>
            <Button
              onClick={state.running ? sim.pause : sim.play}
              variant="default"
              size="icon"
              className="glow-primary"
              aria-label={state.running ? "Pause" : state.tick === 0 ? "Start" : "Resume"}
            >
              {state.running ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="density-slider"
              className="text-muted-foreground font-mono text-[11px] tracking-widest uppercase"
            >
              Traffic density
            </label>
            <span className="text-primary font-mono text-sm tabular-nums">
              {state.densityLevel}%
            </span>
          </div>
          <Slider
            id="density-slider"
            min={0}
            max={100}
            step={5}
            value={[state.densityLevel]}
            onValueChange={([value]) => sim.setDensity(value ?? 0)}
            aria-label="Traffic density level"
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="speed-slider"
              className="text-muted-foreground font-mono text-[11px] tracking-widest uppercase"
            >
              Simulation speed
            </label>
            <span className="text-primary font-mono text-sm tabular-nums">
              {state.speedMultiplier.toFixed(2)}x
            </span>
          </div>
          <Slider
            id="speed-slider"
            min={0.25}
            max={4}
            step={0.25}
            value={[state.speedMultiplier]}
            onValueChange={([value]) => sim.setSpeed(value ?? 1)}
            aria-label="Simulation speed multiplier"
          />
        </div>
      </CardContent>
    </Card>
  );
}
