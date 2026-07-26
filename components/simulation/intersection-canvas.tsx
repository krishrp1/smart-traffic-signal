"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Siren } from "lucide-react";

import { SignalLight } from "@/components/simulation/signal-light";
import { cn } from "@/lib/utils";
import type { Direction, SimulationState } from "@/lib/simulation/types";

const DIRECTION_LABELS: Record<Direction, string> = {
  north: "North",
  south: "South",
  east: "East",
  west: "West",
};

const MAX_VISIBLE_VEHICLES = 8;

interface LaneProps {
  direction: Direction;
  state: SimulationState;
  orientation: "vertical" | "horizontal";
}

function VehicleQueueLane({ direction, state, orientation }: LaneProps) {
  const dirState = state.directions[direction];
  const isActive = state.activeDirection === direction;
  const isCaution = isActive && state.currentGreenTimeSeconds <= 2;
  const isBlocked = state.scenario.accidentDirection === direction;

  const visible = dirState.queue.slice(0, MAX_VISIBLE_VEHICLES);
  const overflow = dirState.queue.length - visible.length;
  // Front of queue (index 0, next to depart) renders nearest the intersection.
  const ordered =
    orientation === "vertical" && direction === "north" ? [...visible].reverse() : visible;
  const orderedFinal =
    orientation === "horizontal" && direction === "west" ? [...visible].reverse() : ordered;

  return (
    <div
      className={cn(
        "relative flex min-h-0 min-w-0 flex-1 items-center justify-center gap-2 p-2",
        orientation === "vertical" ? "flex-col" : "flex-row",
      )}
    >
      <div
        className={cn(
          "text-muted-foreground flex items-center gap-1.5 text-xs font-medium",
          orientation === "horizontal" && "flex-col",
        )}
      >
        <SignalLight active={isActive} caution={isCaution} />
        <span>{DIRECTION_LABELS[direction]}</span>
      </div>

      <div
        className={cn(
          "bg-muted/40 flex flex-1 items-center justify-center gap-1 overflow-hidden rounded-md p-1.5",
          orientation === "vertical" ? "min-h-16 w-10 flex-col" : "h-10 min-w-16 flex-row",
          isBlocked && "bg-destructive/10",
        )}
        role="img"
        aria-label={`${DIRECTION_LABELS[direction]} approach: ${dirState.queue.length} vehicles waiting${isBlocked ? ", blocked by accident" : ""}`}
      >
        <AnimatePresence initial={false}>
          {orderedFinal.map((vehicle) => (
            <motion.div
              key={vehicle.id}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "flex size-4 shrink-0 items-center justify-center rounded-sm",
                vehicle.type === "emergency" ? "bg-destructive" : "bg-primary/70",
              )}
              aria-hidden="true"
            >
              {vehicle.type === "emergency" && (
                <Siren className="text-destructive-foreground size-2.5" />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <span className="text-muted-foreground min-w-6 text-center text-xs tabular-nums">
        {dirState.queue.length}
        {overflow > 0 && `+`}
      </span>
    </div>
  );
}

export function IntersectionCanvas({ state }: { state: SimulationState }) {
  return (
    <div
      className="bg-card grid aspect-square w-full grid-cols-[1fr_auto_1fr] grid-rows-[1fr_auto_1fr] gap-1 rounded-xl border p-3 sm:p-4"
      aria-live="off"
    >
      <div />
      <VehicleQueueLane direction="north" state={state} orientation="vertical" />
      <div />

      <VehicleQueueLane direction="west" state={state} orientation="horizontal" />
      <div className="border-border bg-secondary/30 flex aspect-square w-16 flex-col items-center justify-center gap-1 self-center justify-self-center rounded-lg border-2 border-dashed text-center sm:w-24">
        <span className="text-muted-foreground text-[10px] tracking-wide uppercase">Active</span>
        <span className="text-sm font-semibold capitalize">{state.activeDirection ?? "idle"}</span>
        {state.activeDirection && (
          <span className="text-muted-foreground text-xs tabular-nums">
            {state.currentGreenTimeSeconds}s
          </span>
        )}
      </div>
      <VehicleQueueLane direction="east" state={state} orientation="horizontal" />

      <div />
      <VehicleQueueLane direction="south" state={state} orientation="vertical" />
      <div />

      <span className="sr-only" aria-live="polite">
        {state.activeDirection
          ? `${DIRECTION_LABELS[state.activeDirection]} has a green signal for ${state.currentGreenTimeSeconds} more seconds.`
          : "All signals red, selecting next direction."}
      </span>
    </div>
  );
}

export { DIRECTION_LABELS };
