export type Direction = "north" | "south" | "east" | "west";

export const DIRECTIONS: readonly Direction[] = ["north", "south", "east", "west"];

export type VehicleType = "car" | "emergency";

export interface Vehicle {
  id: number;
  type: VehicleType;
  arrivedAtTick: number;
}

export interface DirectionState {
  direction: Direction;
  queue: Vehicle[];
  processedTotal: number;
}

export type WeatherCondition = "clear" | "rain";

export interface ScenarioState {
  rushHour: boolean;
  weather: WeatherCondition;
  accidentDirection: Direction | null;
  accidentTicksRemaining: number;
}

export interface SignalCycleRecord {
  cycle: number;
  tick: number;
  direction: Direction;
  greenTimeSeconds: number;
  vehiclesPassed: number;
  emergencyOverride: boolean;
}

export interface EventLogEntry {
  id: number;
  tick: number;
  message: string;
  kind: "info" | "warning" | "danger" | "success";
}

export interface MetricsSnapshot {
  tick: number;
  throughputPerMinute: number;
  totalProcessed: number;
  avgWaitTimeSeconds: number;
  congestionByDirection: Record<Direction, number>;
}

export interface SimulationState {
  tick: number;
  cycle: number;
  running: boolean;
  speedMultiplier: number;
  densityLevel: number;
  directions: Record<Direction, DirectionState>;
  activeDirection: Direction | null;
  currentGreenTimeSeconds: number;
  scenario: ScenarioState;
  history: SignalCycleRecord[];
  metricsHistory: MetricsSnapshot[];
  events: EventLogEntry[];
  totalVehiclesSpawned: number;
  totalVehiclesProcessed: number;
  emergencyOverrideCount: number;
  recentWaitTimesSeconds: number[];
  pendingPassesRemaining: number;
  nextVehicleId: number;
  nextEventId: number;
}

export const QUEUE_CAPACITY = 20;
export const BASE_GREEN_TIME_OFFSET = 5;
export const MAX_VEHICLES_PER_CYCLE = 5;
export const RAIN_MAX_VEHICLES_PER_CYCLE = 3;
export const ACCIDENT_DURATION_TICKS = 20;
export const METRICS_WINDOW_TICKS = 60;
export const METRICS_HISTORY_LIMIT = 180;
export const HISTORY_LIMIT = 40;
export const EVENT_LOG_LIMIT = 50;
export const WAIT_SAMPLE_LIMIT = 50;
