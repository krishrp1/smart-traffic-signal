"use client";

import { useId } from "react";
import { Brain, CloudRain, Siren, TriangleAlert, Sun } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { DIRECTIONS, type Direction } from "@/lib/simulation/types";
import type { TrafficSimulationApi } from "@/hooks/useTrafficSimulation";
import { DIRECTION_LABELS } from "@/components/simulation/intersection-canvas";

export function ScenarioControls({ sim }: { sim: TrafficSimulationApi }) {
  const { state } = sim;
  const rushHourId = useId();

  const handleAccident = (direction: Direction) => {
    if (state.scenario.accidentDirection) {
      toast.warning("An accident is already active", {
        description: "Wait for the current incident to clear first.",
      });
      return;
    }
    sim.triggerAccident(direction);
    toast.error(`Accident reported: ${DIRECTION_LABELS[direction]} approach blocked`);
  };

  const handleEmergency = (direction: Direction) => {
    sim.dispatchEmergencyVehicle(direction);
    toast.info(`Emergency vehicle dispatched from ${DIRECTION_LABELS[direction]}`, {
      description: "Signal priority will override the current cycle.",
    });
  };

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center gap-2 font-mono text-xs font-bold tracking-widest uppercase">
          <Brain className="text-success size-4" aria-hidden="true" />
          Scenario controls
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="flex items-center justify-between gap-3">
          <label
            htmlFor={rushHourId}
            className="text-muted-foreground flex flex-col gap-0.5 font-mono text-[11px] tracking-widest uppercase"
          >
            Rush hour
            <span className="text-muted-foreground/70 text-[10px] normal-case">
              Higher arrival rate
            </span>
          </label>
          <Switch
            id={rushHourId}
            checked={state.scenario.rushHour}
            onCheckedChange={() => sim.toggleRushHour()}
          />
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="text-muted-foreground flex flex-col gap-0.5 font-mono text-[11px] tracking-widest uppercase">
            Weather
            <span className="text-muted-foreground/70 text-[10px] normal-case">
              Rain reduces throughput
            </span>
          </span>
          <div className="flex gap-1">
            <Button
              size="sm"
              variant={state.scenario.weather === "clear" ? "default" : "outline"}
              onClick={() => sim.setWeather("clear")}
              aria-pressed={state.scenario.weather === "clear"}
            >
              <Sun aria-hidden="true" /> Clear
            </Button>
            <Button
              size="sm"
              variant={state.scenario.weather === "rain" ? "default" : "outline"}
              onClick={() => sim.setWeather("rain")}
              aria-pressed={state.scenario.weather === "rain"}
            >
              <CloudRain aria-hidden="true" /> Rain
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-muted-foreground flex items-center gap-1.5 font-mono text-[11px] tracking-widest uppercase">
            <TriangleAlert className="text-signal-red size-4" aria-hidden="true" />
            Trigger accident
          </span>
          <div className="grid grid-cols-2 gap-2">
            {DIRECTIONS.map((direction) => {
              const isBlocked = state.scenario.accidentDirection === direction;
              return (
                <button
                  key={direction}
                  type="button"
                  onClick={() => handleAccident(direction)}
                  disabled={isBlocked}
                  aria-pressed={isBlocked}
                  className={cn(
                    "flex items-center gap-2 rounded-lg border p-2.5 text-left text-sm font-medium transition-colors disabled:cursor-not-allowed",
                    isBlocked
                      ? "border-signal-red bg-signal-red/10 text-signal-red"
                      : "border-border bg-secondary/40 hover:bg-secondary text-foreground",
                  )}
                >
                  <TriangleAlert
                    className={cn(
                      "size-4 shrink-0",
                      isBlocked ? "text-signal-red" : "text-muted-foreground",
                    )}
                    aria-hidden="true"
                  />
                  {DIRECTION_LABELS[direction]}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-muted-foreground flex items-center gap-1.5 font-mono text-[11px] tracking-widest uppercase">
            <Siren className="text-success size-4" aria-hidden="true" />
            Dispatch emergency vehicle
          </span>
          <div className="grid grid-cols-2 gap-2">
            {DIRECTIONS.map((direction) => (
              <button
                key={direction}
                type="button"
                onClick={() => handleEmergency(direction)}
                className="border-border bg-secondary/40 hover:bg-success/10 hover:border-success group text-foreground flex items-center gap-2 rounded-lg border p-2.5 text-left text-sm font-medium transition-colors"
              >
                <Siren
                  className="text-muted-foreground group-hover:text-success size-4 shrink-0 transition-colors"
                  aria-hidden="true"
                />
                {DIRECTION_LABELS[direction]}
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
