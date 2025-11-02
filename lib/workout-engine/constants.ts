export type EquipmentOption =
  | "dumbbells"
  | "barbell"
  | "treadmill"
  | "trx"
  | "bosu"
  | "bodyweight"
  | "box"
  | "bench"
  | "bike";

export interface ExerciseDefinition {
  name: string;
  equipment: EquipmentOption;
}

export const EQUIPMENT_OPTIONS: EquipmentOption[] = [
  "dumbbells",
  "barbell",
  "treadmill",
  "trx",
  "bosu",
  "bodyweight",
  "box",
  "bench",
  "bike",
];

export const EXERCISES: ExerciseDefinition[] = [
  { name: "TRX Row", equipment: "trx" },
  { name: "BOSU Side Plank Hip Drops", equipment: "bosu" },
  { name: "Barbell Shoulder Press", equipment: "barbell" },
  { name: "Walking Lunge", equipment: "dumbbells" },
  { name: "Push-Up", equipment: "bodyweight" },
  { name: "Treadmill Run", equipment: "treadmill" },
  { name: "Box Step Up", equipment: "box" },
  { name: "Bench Press Hold", equipment: "bench" },
  { name: "Bike Sprint", equipment: "bike" },
];
