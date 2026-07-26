"use client";

import { useId } from "react";
import { CloudRain, Siren, TriangleAlert, Sun } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
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
    <Card>
      <CardHeader>
        <CardTitle>Scenario controls</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="flex items-center justify-between gap-3">
          <label htmlFor={rushHourId} className="flex flex-col gap-0.5 text-sm font-medium">
            Rush hour
            <span className="text-muted-foreground text-xs font-normal">Higher arrival rate</span>
          </label>
          <Switch
            id={rushHourId}
            checked={state.scenario.rushHour}
            onCheckedChange={() => sim.toggleRushHour()}
          />
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="flex flex-col gap-0.5 text-sm font-medium">
            Weather
            <span className="text-muted-foreground text-xs font-normal">
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
          <span className="flex items-center gap-1.5 text-sm font-medium">
            <TriangleAlert className="text-destructive size-4" aria-hidden="true" />
            Trigger accident
          </span>
          <div className="grid grid-cols-2 gap-2">
            {DIRECTIONS.map((direction) => (
              <Button
                key={direction}
                size="sm"
                variant="outline"
                onClick={() => handleAccident(direction)}
                disabled={state.scenario.accidentDirection === direction}
              >
                {DIRECTION_LABELS[direction]}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="flex items-center gap-1.5 text-sm font-medium">
            <Siren className="text-destructive size-4" aria-hidden="true" />
            Dispatch emergency vehicle
          </span>
          <div className="grid grid-cols-2 gap-2">
            {DIRECTIONS.map((direction) => (
              <Button
                key={direction}
                size="sm"
                variant="outline"
                onClick={() => handleEmergency(direction)}
              >
                {DIRECTION_LABELS[direction]}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
