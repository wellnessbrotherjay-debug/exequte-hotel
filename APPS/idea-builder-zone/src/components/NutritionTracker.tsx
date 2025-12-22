import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Flame, Zap, Droplet, Wheat } from 'lucide-react';

interface MacroBarProps {
  label: string;
  consumed: number;
  target: number;
  icon: React.ReactNode;
  color: string;
}

const MacroBar = ({ label, consumed, target, icon, color }: MacroBarProps) => {
  const progress = target > 0 ? (consumed / target) * 100 : 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center text-sm">
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-medium">{label}</span>
        </div>
        <span className="text-muted-foreground">
          <span className="font-bold text-foreground">{Math.round(consumed)}</span> / {Math.round(target)}g
        </span>
      </div>
      <Progress value={progress} className={`h-2 [&>*]:bg-${color}`} />
    </div>
  );
};

const NutritionTracker = () => {
  const [stats, setStats] = useState({
    targetCalories: 0,
    consumedCalories: 0,
    targetProtein: 0,
    consumedProtein: 0,
    targetCarbs: 0,
    consumedCarbs: 0,
    targetFat: 0,
    consumedFat: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNutritionStats = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: profile } = await supabase
          .from("nutrition_targets")
          .select("target_calories, target_protein_g, target_carbs_g, target_fat_g")
          .eq("user_id", user.id)
          .single();

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const { data: foodLog } = await supabase
          .from("food_logs")
          .select("calories, protein_g, carbs_g, fat_g")
          .eq("user_id", user.id)
          .gte("created_at", today.toISOString())
          .lt("created_at", tomorrow.toISOString());

        const consumed = foodLog?.reduce((acc, item) => ({
          calories: acc.calories + (item.calories || 0),
          protein: acc.protein + (item.protein_g || 0),
          carbs: acc.carbs + (item.carbs_g || 0),
          fat: acc.fat + (item.fat_g || 0),
        }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

        if (profile) {
          setStats({
            targetCalories: profile.target_calories || 0,
            consumedCalories: consumed?.calories || 0,
            targetProtein: profile.target_protein_g || 0,
            consumedProtein: consumed?.protein || 0,
            targetCarbs: profile.target_carbs_g || 0,
            consumedCarbs: consumed?.carbs || 0,
            targetFat: profile.target_fat_g || 0,
            consumedFat: consumed?.fat || 0,
          });
        }
      } catch (error) {
        console.error("Error loading nutrition stats:", error);
      } finally {
        setLoading(false);
      }
    };

    loadNutritionStats();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Today's Nutrition</CardTitle>
          <CardDescription>Loading your progress...</CardDescription>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground">
          Loading...
        </CardContent>
      </Card>
    );
  }

  if (stats.targetCalories === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Today's Nutrition</CardTitle>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground">
          Set your nutrition targets in the 'Body' section to start tracking.
        </CardContent>
      </Card>
    );
  }

  const calorieProgress = stats.targetCalories > 0 ? (stats.consumedCalories / stats.targetCalories) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Nutrition</CardTitle>
        <CardDescription>Your progress towards your daily goals.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-center gap-4">
          <div 
            className="relative h-32 w-32 rounded-full flex items-center justify-center text-center"
            style={{ background: `conic-gradient(hsl(var(--primary)) ${calorieProgress}%, hsl(var(--muted)) ${calorieProgress}%)`}}
          >
            <div className="absolute h-28 w-28 rounded-full bg-background flex flex-col items-center justify-center">
              <span className="text-2xl font-bold">{Math.round(stats.consumedCalories)}</span>
              <span className="text-sm text-muted-foreground">/ {Math.round(stats.targetCalories)} kcal</span>
            </div>
          </div>
        </div>
        <div className="space-y-3 pt-4">
          <MacroBar label="Protein" consumed={stats.consumedProtein} target={stats.targetProtein} icon={<Zap className="h-4 w-4 text-blue-500" />} color="blue-500" />
          <MacroBar label="Carbs" consumed={stats.consumedCarbs} target={stats.targetCarbs} icon={<Wheat className="h-4 w-4 text-orange-500" />} color="orange-500" />
          <MacroBar label="Fat" consumed={stats.consumedFat} target={stats.targetFat} icon={<Droplet className="h-4 w-4 text-yellow-500" />} color="yellow-500" />
        </div>
      </CardContent>
    </Card>
  );
};

export default NutritionTracker;
