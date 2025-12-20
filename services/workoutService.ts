import { supabase } from "@/lib/supabase";

export interface Exercise {
    id: string;
    name: string;
    description: string | null;
    video_url: string | null;
    thumbnail_url: string | null;
    muscle_groups: string[] | null;
    equipment_needed: string[] | null;
}

export interface WorkoutBlock {
    id: string;
    title: string;
    type: string;
    rounds: number;
    exercises: WorkoutExercise[];
}

export interface WorkoutExercise {
    id: string;
    exercise_id: string;
    exercise?: Exercise;
    target_sets: number;
    target_reps: number | null;
    target_time_sec: number | null;
    rest_time_sec: number;
    notes: string | null;
}

export interface WorkoutFull {
    id: string;
    title: string;
    description: string | null;
    difficulty_level: string | null;
    duration_minutes: number | null;
    category: string | null;
    blocks: WorkoutBlock[];
}

export const workoutService = {
    /**
     * Fetch all workouts for a specific hotel/venue.
     */
    async getWorkouts(hotelId: string) {
        const { data, error } = await supabase
            .from("workouts")
            .select("*")
            .eq("hotel_id", hotelId)
            .order("created_at", { ascending: false });

        if (error) throw error;
        return data;
    },

    /**
     * Fetch a full workout detail including blocks and exercises.
     */
    async getWorkoutDetails(workoutId: string): Promise<WorkoutFull | null> {
        // 1. Get Workout
        const { data: workout, error: wError } = await supabase
            .from("workouts")
            .select("*")
            .eq("id", workoutId)
            .single();

        if (wError) throw wError;
        if (!workout) return null;

        // 2. Get Blocks
        const { data: blocks, error: bError } = await supabase
            .from("workout_blocks")
            .select("*")
            .eq("workout_id", workoutId)
            .order("sort_order", { ascending: true });

        if (bError) throw bError;

        // 3. Get Exercises for these blocks
        // We'll do a second query or a join if Supabase types allow deep nesting easily.
        // For manual control, we fetch all workout_exercises for these blocks.
        const blockIds = blocks.map((b) => b.id);
        const { data: workoutExercises, error: weError } = await supabase
            .from("workout_exercises")
            .select("*, exercise:exercises(*)")
            .in("block_id", blockIds)
            .order("sort_order", { ascending: true });

        if (weError) throw weError;

        // 4. Assemble Tree
        const fullBlocks = blocks.map((block) => ({
            ...block,
            exercises: workoutExercises.filter((we) => we.block_id === block.id),
        }));

        return {
            ...workout,
            blocks: fullBlocks,
        };
    },

    /**
     * Start a new user session for a workout.
     */
    async startSession(userId: string, hotelId: string, workoutId: string) {
        const { data, error } = await supabase
            .from("user_workout_sessions")
            .insert({
                user_id: userId,
                hotel_id: hotelId,
                workout_id: workoutId,
                status: "in_progress",
                started_at: new Date().toISOString(),
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Log a single set performance.
     */
    async logSet(sessionId: string, blockId: string, exerciseId: string, setNumber: number, data: {
        weight_kg?: number;
        reps_completed?: number;
        time_sec?: number;
    }) {
        const { data: log, error } = await supabase
            .from("user_set_logs")
            .insert({
                session_id: sessionId,
                block_id: blockId,
                exercise_id: exerciseId,
                set_number: setNumber,
                weight_kg: data.weight_kg,
                reps_completed: data.reps_completed,
                time_sec: data.time_sec,
                logged_at: new Date().toISOString(),
            })
            .select()
            .single();

        if (error) throw error;
        return log;
    },

    /**
     * Complete a session.
     */
    async completeSession(sessionId: string, summary: {
        feeling_rating?: number;
        notes?: string;
        total_time_sec?: number;
    }) {
        const { data, error } = await supabase
            .from("user_workout_sessions")
            .update({
                status: "completed",
                completed_at: new Date().toISOString(),
                ...summary,
            })
            .eq("id", sessionId)
            .select()
            .single();

        if (error) throw error;
        return data;
    }
};
