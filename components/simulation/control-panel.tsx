"use client";

import { Pause, Play, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TrafficSimulationApi } from "@/hooks/useTrafficSimulation";

export function ControlPanel({ sim }: { sim: TrafficSimulationApi }) {
  const { state } = sim;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Simulation controls</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="flex items-center gap-2">
          <Button
            onClick={state.running ? sim.pause : sim.play}
            variant={state.running ? "secondary" : "default"}
            className="flex-1"
          >
            {state.running ? (
              <>
                <Pause aria-hidden="true" /> Pause
              </>
            ) : (
              <>
                <Play aria-hidden="true" /> {state.tick === 0 ? "Start" : "Resume"}
              </>
            )}
          </Button>
          <Button onClick={sim.reset} variant="outline" aria-label="Reset simulation">
            <RotateCcw aria-hidden="true" /> Reset
          </Button>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label htmlFor="speed-slider" className="text-sm font-medium">
              Simulation speed
            </label>
            <span className="text-muted-foreground text-sm tabular-nums">
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

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label htmlFor="density-slider" className="text-sm font-medium">
              Traffic density
            </label>
            <span className="text-muted-foreground text-sm tabular-nums">
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
      </CardContent>
    </Card>
  );
}
