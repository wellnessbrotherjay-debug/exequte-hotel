export type ExerciseMedia = {
  name: string;
  equipment: string;
  video: string;
};

export const EXERCISE_MEDIA: ExerciseMedia[] = [
  {
    name: "TRX Row",
    equipment: "trx",
    video: "" // No video available
  },
  {
    name: "Bosu Side Plank Hip Drops",
    equipment: "bosu",
    video: "/videos/bosu side plank hip drops.mp4"
  },
  {
    name: "DB Squat Woodchops",
    equipment: "dumbbells",
    video: "/videos/db-squat-woodchops.mp4"
  },
  {
    name: "Barbell Shoulder Press",
    equipment: "barbell",
    video: "/videos/barbell shoulder press.mp4"
  },
  {
    name: "Slow Wide Arm Push Up",
    equipment: "bodyweight",
    video: "/videos/slow wide arm push up.mp4"
  },
];

export function getMediaForExercise(exerciseName: string): ExerciseMedia | null {
  return EXERCISE_MEDIA.find(
    (item) => item.name.trim().toLowerCase() === exerciseName.trim().toLowerCase()
  ) || null;
}
