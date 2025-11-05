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
    name: "Bosu Roller Russian Twists",
    equipment: "bosu",
    video: "https://iwkhqmonkmvyeemlihlz.supabase.co/storage/v1/object/public/Videos/Bosu%20roller%20russian%20twists%20.MP4"
  },
  {
    name: "Band Lunges",
    equipment: "band",
    video: "https://iwkhqmonkmvyeemlihlz.supabase.co/storage/v1/object/public/Videos/Band%20lunges%20.MP4"
  },
  {
    name: "Barbell Shoulder Press",
    equipment: "barbell",
    video: "https://iwkhqmonkmvyeemlihlz.supabase.co/storage/v1/object/public/Videos/Barbell%20shoulder%20press%20.MP4"
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
