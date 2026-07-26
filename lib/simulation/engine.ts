import {
  ACCIDENT_DURATION_TICKS,
  BASE_GREEN_TIME_OFFSET,
  DIRECTIONS,
  EVENT_LOG_LIMIT,
  HISTORY_LIMIT,
  MAX_VEHICLES_PER_CYCLE,
  METRICS_HISTORY_LIMIT,
  METRICS_WINDOW_TICKS,
  QUEUE_CAPACITY,
  RAIN_MAX_VEHICLES_PER_CYCLE,
  WAIT_SAMPLE_LIMIT,
  type Direction,
  type DirectionState,
  type EventLogEntry,
  type MetricsSnapshot,
  type SimulationState,
  type Vehicle,
} from "./types";

/** Direct port of the original circular-queue priority scheduler in smartraffic.c:
 *  pick the direction with the strictly-highest vehicle count (ties favor the
 *  earlier direction, matching the original's sequential `>` comparisons),
 *  greenTime = 5 + count, throughput capped per cycle. */
export function selectPriorityDirection(
  counts: Record<Direction, number>,
  excluded: ReadonlySet<Direction> = new Set(),
): { direction: Direction; count: number } | null {
  let best: Direction | null = null;
  for (const direction of DIRECTIONS) {
    if (excluded.has(direction)) continue;
    if (best === null || counts[direction] > counts[best]) {
      best = direction;
    }
  }
  if (best === null || counts[best] === 0) return null;
  return { direction: best, count: counts[best] };
}

export function computeGreenTimeSeconds(count: number): number {
  return BASE_GREEN_TIME_OFFSET + count;
}

export function computeCycleCap(rain: boolean): number {
  return rain ? RAIN_MAX_VEHICLES_PER_CYCLE : MAX_VEHICLES_PER_CYCLE;
}

function makeDirectionState(direction: Direction): DirectionState {
  return { direction, queue: [], processedTotal: 0 };
}

export function createInitialState(): SimulationState {
  const directions = Object.fromEntries(
    DIRECTIONS.map((d) => [d, makeDirectionState(d)]),
  ) as Record<Direction, DirectionState>;

  return {
    tick: 0,
    cycle: 0,
    running: false,
    speedMultiplier: 1,
    densityLevel: 40,
    directions,
    activeDirection: null,
    currentGreenTimeSeconds: 0,
    scenario: {
      rushHour: false,
      weather: "clear",
      accidentDirection: null,
      accidentTicksRemaining: 0,
    },
    history: [],
    metricsHistory: [],
    events: [],
    totalVehiclesSpawned: 0,
    totalVehiclesProcessed: 0,
    emergencyOverrideCount: 0,
    recentWaitTimesSeconds: [],
    pendingPassesRemaining: 0,
    nextVehicleId: 1,
    nextEventId: 1,
  };
}

function pushEvent(
  state: SimulationState,
  message: string,
  kind: EventLogEntry["kind"] = "info",
): void {
  state.events.push({ id: state.nextEventId++, tick: state.tick, message, kind });
  if (state.events.length > EVENT_LOG_LIMIT) state.events.shift();
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Bernoulli-trial arrivals per direction; density (0-100) and rush hour scale the rate. */
function spawnArrivals(state: SimulationState): void {
  const baseRate = 0.08 + (clamp(state.densityLevel, 0, 100) / 100) * 0.55;
  for (const direction of DIRECTIONS) {
    const isBlocked = state.scenario.accidentDirection === direction;
    const rushBoost = state.scenario.rushHour ? 1.7 : 1;
    const rainDamp = state.scenario.weather === "rain" ? 0.85 : 1;
    const effectiveRate = clamp(baseRate * rushBoost * rainDamp, 0, 0.9);

    const dirState = state.directions[direction];
    let spawned = 0;
    const attempts = state.scenario.rushHour ? 3 : 2;
    for (let i = 0; i < attempts; i++) {
      if (dirState.queue.length >= QUEUE_CAPACITY) break;
      if (Math.random() < effectiveRate / attempts) {
        dirState.queue.push({ id: state.nextVehicleId++, type: "car", arrivedAtTick: state.tick });
        spawned++;
      }
    }
    if (spawned > 0) {
      state.totalVehiclesSpawned += spawned;
    }
    if (
      !isBlocked &&
      dirState.queue.length >= QUEUE_CAPACITY &&
      spawned === 0 &&
      Math.random() < 0.02
    ) {
      pushEvent(
        state,
        `${capitalize(direction)} approach at capacity — vehicles turning away.`,
        "warning",
      );
    }
  }
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function tickAccident(state: SimulationState): void {
  if (!state.scenario.accidentDirection) return;
  state.scenario.accidentTicksRemaining -= 1;
  if (state.scenario.accidentTicksRemaining <= 0) {
    pushEvent(
      state,
      `Accident on ${capitalize(state.scenario.accidentDirection)} approach cleared.`,
      "success",
    );
    state.scenario.accidentDirection = null;
    state.scenario.accidentTicksRemaining = 0;
  }
}

function findEmergencyDirection(state: SimulationState): Direction | null {
  for (const direction of DIRECTIONS) {
    if (state.directions[direction].queue.some((v) => v.type === "emergency")) {
      return direction;
    }
  }
  return null;
}

function startNewCycle(state: SimulationState): void {
  const emergencyDirection = findEmergencyDirection(state);
  const excluded = new Set<Direction>();
  if (state.scenario.accidentDirection) excluded.add(state.scenario.accidentDirection);

  let chosen: { direction: Direction; count: number } | null = null;
  let isEmergency = false;

  if (emergencyDirection) {
    chosen = {
      direction: emergencyDirection,
      count: state.directions[emergencyDirection].queue.length,
    };
    isEmergency = true;
  } else {
    const counts = Object.fromEntries(
      DIRECTIONS.map((d) => [d, state.directions[d].queue.length]),
    ) as Record<Direction, number>;
    chosen = selectPriorityDirection(counts, excluded);
  }

  if (!chosen) {
    state.activeDirection = null;
    state.currentGreenTimeSeconds = 0;
    state.pendingPassesRemaining = 0;
    return;
  }

  const greenTime = computeGreenTimeSeconds(chosen.count);
  const cap = computeCycleCap(state.scenario.weather === "rain");
  const pass = Math.min(chosen.count, cap);

  state.cycle += 1;
  state.activeDirection = chosen.direction;
  state.currentGreenTimeSeconds = greenTime;
  state.pendingPassesRemaining = pass;

  state.history.push({
    cycle: state.cycle,
    tick: state.tick,
    direction: chosen.direction,
    greenTimeSeconds: greenTime,
    vehiclesPassed: pass,
    emergencyOverride: isEmergency,
  });
  if (state.history.length > HISTORY_LIMIT) state.history.shift();

  if (isEmergency) {
    state.emergencyOverrideCount += 1;
    pushEvent(
      state,
      `Emergency vehicle priority override: ${capitalize(chosen.direction)} signal forced green.`,
      "danger",
    );
  }
}

function runGreenPhase(state: SimulationState): void {
  if (!state.activeDirection) return;
  const dirState = state.directions[state.activeDirection];

  if (state.pendingPassesRemaining > 0 && dirState.queue.length > 0) {
    const emergencyIndex = dirState.queue.findIndex((v) => v.type === "emergency");
    const index = emergencyIndex !== -1 ? emergencyIndex : 0;
    const [vehicle] = dirState.queue.splice(index, 1) as [Vehicle];
    dirState.processedTotal += 1;
    state.totalVehiclesProcessed += 1;
    state.pendingPassesRemaining -= 1;

    const waitSeconds = state.tick - vehicle.arrivedAtTick;
    state.recentWaitTimesSeconds.push(waitSeconds);
    if (state.recentWaitTimesSeconds.length > WAIT_SAMPLE_LIMIT) {
      state.recentWaitTimesSeconds.shift();
    }
  }

  state.currentGreenTimeSeconds -= 1;
  if (state.currentGreenTimeSeconds <= 0) {
    state.activeDirection = null;
    state.pendingPassesRemaining = 0;
  }
}

function recordMetrics(state: SimulationState): void {
  const congestionByDirection = Object.fromEntries(
    DIRECTIONS.map((d) => [d, state.directions[d].queue.length / QUEUE_CAPACITY]),
  ) as Record<Direction, number>;

  const history = state.metricsHistory;
  const windowSize = Math.min(METRICS_WINDOW_TICKS, history.length);
  const baseline = windowSize > 0 ? history[history.length - windowSize] : undefined;
  const processedInWindow = state.totalVehiclesProcessed - (baseline?.totalProcessed ?? 0);
  const elapsedTicks = baseline ? Math.max(state.tick - baseline.tick, 1) : Math.max(state.tick, 1);
  const throughputPerMinute = Math.round((processedInWindow * 60) / elapsedTicks);

  const avgWaitTimeSeconds =
    state.recentWaitTimesSeconds.length > 0
      ? state.recentWaitTimesSeconds.reduce((a, b) => a + b, 0) /
        state.recentWaitTimesSeconds.length
      : 0;

  const snapshot: MetricsSnapshot = {
    tick: state.tick,
    throughputPerMinute,
    totalProcessed: state.totalVehiclesProcessed,
    avgWaitTimeSeconds: Math.round(avgWaitTimeSeconds * 10) / 10,
    congestionByDirection,
  };

  state.metricsHistory.push(snapshot);
  if (state.metricsHistory.length > METRICS_HISTORY_LIMIT) state.metricsHistory.shift();
}

/** Advances the simulation by exactly one simulated second. Pure: returns a new state object. */
export function tick(prev: SimulationState): SimulationState {
  const state: SimulationState = structuredClone(prev);
  state.tick += 1;

  tickAccident(state);
  spawnArrivals(state);

  const emergencyDirection = findEmergencyDirection(state);
  const shouldPreempt = emergencyDirection !== null && state.activeDirection !== emergencyDirection;
  if (shouldPreempt || !state.activeDirection) {
    startNewCycle(state);
  }
  runGreenPhase(state);
  recordMetrics(state);

  return state;
}

export function setSpeedMultiplier(
  state: SimulationState,
  speedMultiplier: number,
): SimulationState {
  return { ...structuredClone(state), speedMultiplier: clamp(speedMultiplier, 0.25, 4) };
}

export function setDensityLevel(state: SimulationState, densityLevel: number): SimulationState {
  return { ...structuredClone(state), densityLevel: clamp(densityLevel, 0, 100) };
}

export function setRunning(state: SimulationState, running: boolean): SimulationState {
  return { ...structuredClone(state), running };
}

export function toggleRushHour(state: SimulationState): SimulationState {
  const next = structuredClone(state);
  next.scenario.rushHour = !next.scenario.rushHour;
  pushEvent(
    next,
    next.scenario.rushHour ? "Rush hour started — arrival rate increased." : "Rush hour ended.",
    "info",
  );
  return next;
}

export function setWeather(
  state: SimulationState,
  weather: SimulationState["scenario"]["weather"],
): SimulationState {
  const next = structuredClone(state);
  next.scenario.weather = weather;
  pushEvent(
    next,
    weather === "rain" ? "Rain started — throughput per cycle reduced." : "Weather cleared.",
    "info",
  );
  return next;
}

export function triggerAccident(state: SimulationState, direction: Direction): SimulationState {
  const next = structuredClone(state);
  if (next.scenario.accidentDirection) return next;
  next.scenario.accidentDirection = direction;
  next.scenario.accidentTicksRemaining = ACCIDENT_DURATION_TICKS;
  pushEvent(
    next,
    `Accident reported on ${capitalize(direction)} approach — lane blocked.`,
    "danger",
  );
  if (next.activeDirection === direction) {
    next.activeDirection = null;
    next.pendingPassesRemaining = 0;
  }
  return next;
}

export function spawnEmergencyVehicle(
  state: SimulationState,
  direction: Direction,
): SimulationState {
  const next = structuredClone(state);
  const dirState = next.directions[direction];
  if (dirState.queue.length >= QUEUE_CAPACITY) return next;
  dirState.queue.push({ id: next.nextVehicleId++, type: "emergency", arrivedAtTick: next.tick });
  next.totalVehiclesSpawned += 1;
  pushEvent(next, `Emergency vehicle dispatched from ${capitalize(direction)}.`, "warning");
  return next;
}

export function resetSimulation(): SimulationState {
  return createInitialState();
}
