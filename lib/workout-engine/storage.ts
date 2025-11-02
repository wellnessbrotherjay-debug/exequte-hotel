import type { EquipmentOption } from "./constants";
import { EXERCISE_MEDIA as EXERCISE_LIBRARY, type ExerciseMedia } from "@/lib/lib/exercise-library";

export interface BrandPalette {
  primary: string;
  secondary: string;
  accent: string;
}

export interface StationSetup {
  id: number;
  equipment: EquipmentOption;
}

export interface WorkoutSetup {
  stations: StationSetup[];
  logo: string | null;
  theme: string;
  workTime: number;
  restTime: number;
  rounds: number;
  facilityName?: string;
  colors?: BrandPalette;
  quote?: string;
}

export interface StationExercise {
  stationId: number;
  name: string;
}

export interface WorkoutPlan {
  goal: "Fat Loss" | "Strength" | "Endurance";
  exercises: StationExercise[];
}

export type SessionPhase = "prep" | "work" | "rest" | "complete";

export interface SessionState {
  stationId: number;
  round: number;
  phase: SessionPhase;
  remaining: number;
  updatedAt: number;
}

export const STORAGE_KEYS = {
  setup: "workoutSetup",
  plan: "workoutPlan",
  session: "workoutSessionState",
} as const;

function readJSON<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(key);
    if (!value) return null;
    return JSON.parse(value) as T;
  } catch (error) {
    console.error(`Failed to read ${key}`, error);
    return null;
  }
}

function writeJSON<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Failed to write ${key}`, error);
  }
}

export const storage = {
  getSetup(): WorkoutSetup | null {
    return readJSON<WorkoutSetup>(STORAGE_KEYS.setup);
  },
  saveSetup(setup: WorkoutSetup) {
    writeJSON(STORAGE_KEYS.setup, setup);
  },
  getPlan(): WorkoutPlan | null {
    return readJSON<WorkoutPlan>(STORAGE_KEYS.plan);
  },
  savePlan(plan: WorkoutPlan) {
    writeJSON(STORAGE_KEYS.plan, plan);
  },
  getSession(): SessionState | null {
    return readJSON<SessionState>(STORAGE_KEYS.session);
  },
  saveSession(session: SessionState) {
    writeJSON(STORAGE_KEYS.session, session);
  },
  clearSession() {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(STORAGE_KEYS.session);
  },
  subscribe(key: string, callback: (value: any) => void) {
    if (typeof window === "undefined") return;
    const handler = (event: StorageEvent) => {
      if (event.key === key) {
        try {
          callback(event.newValue ? JSON.parse(event.newValue) : null);
        } catch (error) {
          console.error(`Failed to parse storage event for ${key}`, error);
        }
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  },
};

export function buildStationList(
  count: number,
  existing: StationSetup[] | undefined,
  defaultEquipment: EquipmentOption = "dumbbells"
): StationSetup[] {
  return Array.from({ length: count }, (_, index) => {
    const id = index + 1;
    const found = existing?.find((station) => station.id === id);
    return {
      id,
      equipment: found?.equipment ?? existing?.[index]?.equipment ?? defaultEquipment,
    };
  });
}

const THEME_COLOR_MAP: Record<string, BrandPalette> = {
  gold: {
    primary: "#FFD100",
    secondary: "#00BFFF",
    accent: "#FFFFFF",
  },
  neon: {
    primary: "#FF6BFF",
    secondary: "#2CDBFF",
    accent: "#FFFFFF",
  },
  "luxury-dark": {
    primary: "#F4D03F",
    secondary: "#76D7C4",
    accent: "#FDFEFE",
  },
};

export function getDefaultBrandColors(theme: string | undefined): BrandPalette {
  if (!theme) return THEME_COLOR_MAP.gold;
  return THEME_COLOR_MAP[theme] ?? THEME_COLOR_MAP.gold;
}

// ✅ Updated to pull from your new real dataset
export function getExercisesForEquipment(equipment: EquipmentOption): ExerciseMedia[] {
  return EXERCISE_LIBRARY.filter(
    (exercise: ExerciseMedia) =>
      exercise.equipment.toLowerCase() === equipment.toLowerCase()
  );
}
