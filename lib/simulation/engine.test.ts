import { describe, expect, it } from "vitest";
import {
  computeGreenTimeSeconds,
  createInitialState,
  resetSimulation,
  selectPriorityDirection,
  spawnEmergencyVehicle,
  tick,
  triggerAccident,
} from "./engine";
import { QUEUE_CAPACITY, type Direction } from "./types";

describe("selectPriorityDirection", () => {
  it("matches the original smartraffic.c example: N=10,S=2,E=3,W=1 -> North, 15s", () => {
    const counts = { north: 10, south: 2, east: 3, west: 1 };
    const result = selectPriorityDirection(counts);
    expect(result).toEqual({ direction: "north", count: 10 });
    expect(computeGreenTimeSeconds(result!.count)).toBe(15);
  });

  it("breaks ties in favor of the earlier direction (N > S > E > W)", () => {
    const counts = { north: 4, south: 4, east: 4, west: 4 };
    expect(selectPriorityDirection(counts)?.direction).toBe("north");
  });

  it("returns null when all directions are empty", () => {
    const counts = { north: 0, south: 0, east: 0, west: 0 };
    expect(selectPriorityDirection(counts)).toBeNull();
  });

  it("excludes a blocked direction even if it has the most vehicles", () => {
    const counts = { north: 10, south: 2, east: 3, west: 1 };
    const result = selectPriorityDirection(counts, new Set<Direction>(["north"]));
    expect(result?.direction).toBe("east");
  });
});

describe("simulation tick loop", () => {
  it("caps vehicles passed per cycle at 5 (original throughput cap)", () => {
    let state = createInitialState();
    state.directions.north.queue = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      type: "car" as const,
      arrivedAtTick: 0,
    }));
    state.densityLevel = 0;

    state = tick(state);
    const northCycle = state.history.find((h) => h.direction === "north");
    expect(northCycle?.vehiclesPassed).toBe(5);
    expect(northCycle?.greenTimeSeconds).toBe(17);
  });

  it("forces an emergency override regardless of queue counts", () => {
    let state = createInitialState();
    state.densityLevel = 0;
    state.directions.south.queue = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      type: "car" as const,
      arrivedAtTick: 0,
    }));
    state = spawnEmergencyVehicle(state, "west");
    state = tick(state);

    expect(state.activeDirection).toBe("west");
    expect(state.emergencyOverrideCount).toBe(1);
    expect(state.history.at(-1)?.emergencyOverride).toBe(true);
  });

  it("blocks throughput on the accident direction", () => {
    let state = createInitialState();
    state.densityLevel = 0;
    state.directions.east.queue = Array.from({ length: 6 }, (_, i) => ({
      id: i,
      type: "car" as const,
      arrivedAtTick: 0,
    }));
    state = triggerAccident(state, "east");
    state = tick(state);

    expect(state.activeDirection).not.toBe("east");
    expect(state.directions.east.queue.length).toBe(6);
  });

  it("never grows a queue beyond capacity", () => {
    let state = createInitialState();
    state.densityLevel = 100;
    for (let i = 0; i < 200; i++) {
      state = tick(state);
    }
    for (const direction of Object.keys(state.directions) as Direction[]) {
      expect(state.directions[direction].queue.length).toBeLessThanOrEqual(QUEUE_CAPACITY);
    }
  });
});

describe("resetSimulation", () => {
  it("returns a fresh, idle initial state", () => {
    const state = resetSimulation();
    expect(state.tick).toBe(0);
    expect(state.running).toBe(false);
    expect(state.totalVehiclesProcessed).toBe(0);
    expect(Object.values(state.directions).every((d) => d.queue.length === 0)).toBe(true);
  });
});
