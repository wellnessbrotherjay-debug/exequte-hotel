import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { Target, Flame, Apple, Beef, Zap, TrendingUp, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface NutritionProfile {
  sex: string;
  activity_level: string;
  goal: string;
  goal_rate_kg_per_week: number;
  meals_per_day: number;
  diet_type: string;
  protein_g_per_kg: number;
  fat_g_per_kg: number;
  calculated_bmr: number | null;
  calculated_tdee: number | null;
  target_calories: number | null;
  target_protein_g: number | null;
  target_fat_g: number | null;
  target_carbs_g: number | null;
}

const NutritionPlanner = () => {
  const [profile, setProfile] = useState<NutritionProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [userWeight, setUserWeight] = useState<number>(0);
  const [userHeight, setUserHeight] = useState<number>(0);
  const [userAge, setUserAge] = useState<number>(0);
  const { toast } = useToast();
  const { subscribed, loading: subLoading } = useSubscription();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    sex: "M",
    activity_level: "moderate",
    goal: "maintain",
    goal_rate_kg_per_week: "0.5",
    meals_per_day: "3",
    diet_type: "balanced",
  });

  // Diet type presets for macronutrient ratios
  const getDietMacros = (dietType: string) => {
    const presets: { [key: string]: { protein: number; fat: number } } = {
      balanced: { protein: 1.6, fat: 1.0 },
      high_protein: { protein: 2.2, fat: 0.8 },
      low_carb: { protein: 1.8, fat: 1.2 },
      keto: { protein: 1.6, fat: 1.8 },
      custom: { protein: 1.8, fat: 1.0 },
    };
    return presets[dietType] || presets.balanced;
  };

  useEffect(() => {
    loadProfile();
    loadUserMetrics();
  }, []);

  const loadUserMetrics = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profileData } = await supabase
        .from("profiles")
        .select("weight_kg, height_cm, age")
        .eq("id", user.id)
        .single();

      if (profileData) {
        setUserWeight(profileData.weight_kg || 0);
        setUserHeight(profileData.height_cm || 0);
        setUserAge(profileData.age || 0);
      }
    } catch (error: any) {
      console.error("Error loading user metrics:", error);
    }
  };

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("nutrition_profile")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setProfile(data);
        setFormData({
          sex: data.sex || "M",
          activity_level: data.activity_level,
          goal: data.goal,
          goal_rate_kg_per_week: data.goal_rate_kg_per_week?.toString() || "0.5",
          meals_per_day: data.meals_per_day?.toString() || "3",
          diet_type: data.diet_type || "balanced",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error loading nutrition profile",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateBMR = (weight: number, height: number, age: number, sex: string) => {
    // Mifflin-St Jeor Equation
    if (sex === "M") {
      return (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else {
      return (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }
  };

  const calculateTDEE = (bmr: number, activityLevel: string) => {
    const multipliers: { [key: string]: number } = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      very_active: 1.725,
      extra_active: 1.9,
    };
    return bmr * (multipliers[activityLevel] || 1.55);
  };

  const calculateTargetCalories = (tdee: number, goal: string, goalRate: number) => {
    const caloriesPerKg = 7700; // approximate calories in 1kg of body weight
    const dailyDeficitSurplus = (goalRate * caloriesPerKg) / 7;

    if (goal === "lose") return tdee - dailyDeficitSurplus;
    if (goal === "gain") return tdee + dailyDeficitSurplus;
    return tdee;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userWeight || !userHeight || !userAge) {
      toast({
        title: "Missing profile data",
        description: "Please update your profile with weight, height, and age first.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const bmr = calculateBMR(userWeight, userHeight, userAge, formData.sex);
      const tdee = calculateTDEE(bmr, formData.activity_level);
      const targetCals = calculateTargetCalories(tdee, formData.goal, parseFloat(formData.goal_rate_kg_per_week));

      // Get macros based on selected diet type
      const macros = getDietMacros(formData.diet_type);
      const proteinG = userWeight * macros.protein;
      const fatG = userWeight * macros.fat;
      const proteinCals = proteinG * 4;
      const fatCals = fatG * 9;
      const carbsCals = targetCals - proteinCals - fatCals;
      const carbsG = carbsCals / 4;

      const profileData = {
        user_id: user.id,
        sex: formData.sex,
        activity_level: formData.activity_level,
        goal: formData.goal,
        goal_rate_kg_per_week: parseFloat(formData.goal_rate_kg_per_week),
        meals_per_day: parseInt(formData.meals_per_day),
        diet_type: formData.diet_type,
        protein_g_per_kg: macros.protein,
        fat_g_per_kg: macros.fat,
        calculated_bmr: bmr,
        calculated_tdee: tdee,
        target_calories: targetCals,
        target_protein_g: proteinG,
        target_fat_g: fatG,
        target_carbs_g: carbsG,
      };

      const { error } = await supabase
        .from("nutrition_profile")
        .upsert(profileData, { onConflict: "user_id" });

      if (error) throw error;

      toast({
        title: "Nutrition plan updated",
        description: "Your nutrition targets have been calculated.",
      });

      loadProfile();
      
      // Navigate to targets page after calculation
      setTimeout(() => {
        navigate("/nutrition-targets");
      }, 500);
    } catch (error: any) {
      toast({
        title: "Error saving nutrition profile",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const isPremiumFeature = formData.diet_type !== "balanced" || parseInt(formData.meals_per_day) > 3;

  if (loading || subLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Nutrition Planner</h2>
        <p className="text-muted-foreground">Calculate your TDEE and macro targets</p>
      </div>

      {/* Current Targets */}
      {profile && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Flame className="h-4 w-4" />
                Daily Calories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profile.target_calories?.toFixed(0)}</div>
              <p className="text-xs text-muted-foreground">TDEE: {profile.calculated_tdee?.toFixed(0)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Beef className="h-4 w-4" />
                Protein
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profile.target_protein_g?.toFixed(0)}g</div>
              <p className="text-xs text-muted-foreground">{((profile.target_protein_g || 0) * 4 / (profile.target_calories || 1) * 100).toFixed(0)}% of cals</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Apple className="h-4 w-4" />
                Carbs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profile.target_carbs_g?.toFixed(0)}g</div>
              <p className="text-xs text-muted-foreground">{((profile.target_carbs_g || 0) * 4 / (profile.target_calories || 1) * 100).toFixed(0)}% of cals</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Fat
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profile.target_fat_g?.toFixed(0)}g</div>
              <p className="text-xs text-muted-foreground">{((profile.target_fat_g || 0) * 9 / (profile.target_calories || 1) * 100).toFixed(0)}% of cals</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Configuration Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Nutrition Goals
          </CardTitle>
          <CardDescription>Set your goals and activity level to calculate your targets</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Plan Features */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Basic Plan</Badge>
                <span className="text-sm text-muted-foreground">Available to all users</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Sex</Label>
                  <Select value={formData.sex} onValueChange={(value) => setFormData({ ...formData, sex: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="M">Male</SelectItem>
                      <SelectItem value="F">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Activity Level</Label>
                  <Select value={formData.activity_level} onValueChange={(value) => setFormData({ ...formData, activity_level: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sedentary">Sedentary (little to no exercise)</SelectItem>
                      <SelectItem value="light">Light (1-3 days/week)</SelectItem>
                      <SelectItem value="moderate">Moderate (3-5 days/week)</SelectItem>
                      <SelectItem value="very_active">Very Active (6-7 days/week)</SelectItem>
                      <SelectItem value="extra_active">Extra Active (2x per day)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Goal</Label>
                  <Select value={formData.goal} onValueChange={(value) => setFormData({ ...formData, goal: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lose">Lose Weight</SelectItem>
                      <SelectItem value="maintain">Maintain Weight</SelectItem>
                      <SelectItem value="gain">Gain Weight (Bulk)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Goal Rate (kg/week)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.goal_rate_kg_per_week}
                    onChange={(e) => setFormData({ ...formData, goal_rate_kg_per_week: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Premium Features */}
            <div className="space-y-4 border-t pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="bg-gradient-to-r from-primary to-primary-light">
                    Premium Plan
                  </Badge>
                  {!subscribed && (
                    <span className="text-sm text-muted-foreground">Advanced nutrition features</span>
                  )}
                </div>
                {!subscribed && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => navigate("/upgrade")}
                    className="gap-2"
                  >
                    <Lock className="h-4 w-4" />
                    Upgrade
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Meals Per Day {!subscribed && <Lock className="inline h-3 w-3 ml-1" />}</Label>
                  <Select
                    value={formData.meals_per_day}
                    onValueChange={(value) => setFormData({ ...formData, meals_per_day: value })}
                    disabled={!subscribed}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 Meals</SelectItem>
                      <SelectItem value="4">4 Meals</SelectItem>
                      <SelectItem value="5">5 Meals</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Diet Type {!subscribed && <Lock className="inline h-3 w-3 ml-1" />}</Label>
                  <Select
                    value={formData.diet_type}
                    onValueChange={(value) => setFormData({ ...formData, diet_type: value })}
                    disabled={!subscribed}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="balanced">Balanced (1.6g/kg protein, 1.0g/kg fat)</SelectItem>
                      <SelectItem value="high_protein">High Protein (2.2g/kg protein, 0.8g/kg fat)</SelectItem>
                      <SelectItem value="low_carb">Low Carb (1.8g/kg protein, 1.2g/kg fat)</SelectItem>
                      <SelectItem value="keto">Keto (1.6g/kg protein, 1.8g/kg fat)</SelectItem>
                      <SelectItem value="custom">Custom (1.8g/kg protein, 1.0g/kg fat)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Macros are automatically calculated based on your diet type
                  </p>
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full">
              <TrendingUp className="mr-2 h-4 w-4" />
              Calculate Nutrition Plan
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NutritionPlanner;
