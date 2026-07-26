"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  createInitialState,
  resetSimulation,
  setDensityLevel,
  setRunning,
  setSpeedMultiplier,
  setWeather,
  spawnEmergencyVehicle,
  tick,
  toggleRushHour,
  triggerAccident,
} from "@/lib/simulation/engine";
import type { Direction, SimulationState, WeatherCondition } from "@/lib/simulation/types";

const TICK_INTERVAL_MS = 1000;

export interface TrafficSimulationApi {
  state: SimulationState;
  play: () => void;
  pause: () => void;
  reset: () => void;
  setSpeed: (multiplier: number) => void;
  setDensity: (level: number) => void;
  toggleRushHour: () => void;
  setWeather: (weather: WeatherCondition) => void;
  triggerAccident: (direction: Direction) => void;
  dispatchEmergencyVehicle: (direction: Direction) => void;
}

export function useTrafficSimulation(): TrafficSimulationApi {
  const [state, setState] = useState<SimulationState>(() => createInitialState());
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!state.running) return;
    const intervalMs = TICK_INTERVAL_MS / state.speedMultiplier;
    intervalRef.current = setInterval(() => {
      setState((prev) => tick(prev));
    }, intervalMs);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [state.running, state.speedMultiplier]);

  const play = useCallback(() => setState((prev) => setRunning(prev, true)), []);
  const pause = useCallback(() => setState((prev) => setRunning(prev, false)), []);
  const reset = useCallback(() => setState(() => resetSimulation()), []);
  const setSpeed = useCallback(
    (multiplier: number) => setState((prev) => setSpeedMultiplier(prev, multiplier)),
    [],
  );
  const setDensity = useCallback(
    (level: number) => setState((prev) => setDensityLevel(prev, level)),
    [],
  );
  const toggleRush = useCallback(() => setState((prev) => toggleRushHour(prev)), []);
  const setWeatherCondition = useCallback(
    (weather: WeatherCondition) => setState((prev) => setWeather(prev, weather)),
    [],
  );
  const causeAccident = useCallback(
    (direction: Direction) => setState((prev) => triggerAccident(prev, direction)),
    [],
  );
  const dispatchEmergencyVehicle = useCallback(
    (direction: Direction) => setState((prev) => spawnEmergencyVehicle(prev, direction)),
    [],
  );

  return {
    state,
    play,
    pause,
    reset,
    setSpeed,
    setDensity,
    toggleRushHour: toggleRush,
    setWeather: setWeatherCondition,
    triggerAccident: causeAccident,
    dispatchEmergencyVehicle,
  };
}
