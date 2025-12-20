
import { supabase } from "@/lib/supabase";

export interface NutritionProfile {
    id: string;
    user_id: string;
    tdee: number;
    bmr: number;
    target_calories: number;
    target_protein_g: number;
    target_carbs_g: number;
    target_fat_g: number;
    calculated_tdee?: number;
    calculated_bmr?: number;
}

export interface FoodLog {
    id: string;
    user_id: string;
    meal_name: string;
    calories: number;
    protein_g: number;
    carbs_g: number;
    fat_g: number;
    meal_type: string;
    created_at: string;
}

export const nutritionService = {
    async getProfile(): Promise<NutritionProfile | null> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        const { data, error } = await supabase
            .from('nutrition_profile')
            .select('*')
            .eq('user_id', user.id)
            .single();

        if (error && error.code !== 'PGRST116') {
            console.error('Error fetching nutrition profile:', error);
            return null;
        }

        return data as NutritionProfile | null;
    },

    async getDailyLogs(date: Date) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];

        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const { data, error } = await supabase
            .from('food_logs')
            .select('*')
            .eq('user_id', user.id)
            .gte('created_at', startOfDay.toISOString())
            .lte('created_at', endOfDay.toISOString())
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching food logs:', error);
            return [];
        }

        return data as FoodLog[];
    },

    async logFood(food: Omit<FoodLog, 'id' | 'user_id' | 'created_at'>) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const { data, error } = await (supabase
            .from('food_logs') as any)
            .insert({
                user_id: user.id,
                ...food
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async saveProfile(profile: any) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const { data, error } = await (supabase
            .from('nutrition_profile') as any)
            .upsert({
                user_id: user.id,
                ...profile,
                updated_at: new Date().toISOString()
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async createRecipe(recipe: any, ingredients: any[]) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const { data: recipeData, error: recipeError } = await (supabase
            .from('recipes') as any)
            .insert({
                user_id: user.id,
                ...recipe
            })
            .select()
            .single();

        if (recipeError) throw recipeError;

        if (ingredients.length > 0) {
            const ingredientsWithId = ingredients.map(ing => ({
                recipe_id: recipeData.id,
                ...ing
            }));

            const { error: ingError } = await (supabase
                .from('recipe_ingredients') as any)
                .insert(ingredientsWithId);

            if (ingError) throw ingError;
        }

        return recipeData;
    }
};
