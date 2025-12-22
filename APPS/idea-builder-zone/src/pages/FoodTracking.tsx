import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Flame, Beef, Apple, Zap, Plus, ArrowLeft, Target, Trash2, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FoodSearch } from "@/components/FoodSearch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface NutritionProfile {
  target_calories: number | null;
  target_protein_g: number | null;
  target_fat_g: number | null;
  target_carbs_g: number | null;
}

interface FoodEntry {
  id: string;
  meal_name: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  created_at: string;
}

const FoodTracking = () => {
  const [profile, setProfile] = useState<NutritionProfile | null>(null);
  const [entries, setEntries] = useState<FoodEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    meal_name: "",
    calories: "",
    protein_g: "",
    carbs_g: "",
    fat_g: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      // Load nutrition profile
      const { data: profileData, error: profileError } = await supabase
        .from("nutrition_profile")
        .select("target_calories, target_protein_g, target_fat_g, target_carbs_g")
        .eq("user_id", user.id)
        .maybeSingle();

      if (profileError) throw profileError;
      setProfile(profileData);

      // Load today's food entries
      const today = new Date().toISOString().split("T")[0];
      const { data: entriesData, error: entriesError } = await supabase
        .from("food_logs")
        .select("*")
        .eq("user_id", user.id)
        .gte("created_at", `${today}T00:00:00`)
        .lte("created_at", `${today}T23:59:59`)
        .order("created_at", { ascending: false });

      if (entriesError) throw entriesError;
      setEntries(entriesData || []);
    } catch (error: any) {
      toast({
        title: "Error loading data",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("food_logs").insert({
        user_id: user.id,
        meal_name: formData.meal_name,
        calories: parseFloat(formData.calories),
        protein_g: parseFloat(formData.protein_g),
        carbs_g: parseFloat(formData.carbs_g),
        fat_g: parseFloat(formData.fat_g),
      });

      if (error) throw error;

      toast({
        title: "Meal logged",
        description: "Your food entry has been saved.",
      });

      setFormData({
        meal_name: "",
        calories: "",
        protein_g: "",
        carbs_g: "",
        fat_g: "",
      });

      setIsDialogOpen(false);
      loadData();
    } catch (error: any) {
      toast({
        title: "Error logging meal",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("food_logs").delete().eq("id", id);
      if (error) throw error;

      toast({
        title: "Entry deleted",
        description: "Food entry has been removed.",
      });

      loadData();
    } catch (error: any) {
      toast({
        title: "Error deleting entry",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const totals = entries.reduce(
    (acc, entry) => ({
      calories: acc.calories + entry.calories,
      protein: acc.protein + entry.protein_g,
      carbs: acc.carbs + entry.carbs_g,
      fat: acc.fat + entry.fat_g,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const getProgress = (current: number, target: number) => {
    return target > 0 ? Math.min((current / target) * 100, 100) : 0;
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!profile) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/body?tab=nutrition")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Food Tracking</h1>
            <p className="text-muted-foreground">No nutrition plan found</p>
          </div>
        </div>
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground mb-4">
              Please create a nutrition plan first to start tracking food.
            </p>
            <Button onClick={() => navigate("/body?tab=nutrition")}>
              Create Nutrition Plan
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/body?tab=nutrition")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Food Tracking</h1>
            <p className="text-muted-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/nutrition-targets")}>
            <Target className="mr-2 h-4 w-4" />
            View Targets
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Log Food
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Log a Meal</DialogTitle>
                <DialogDescription>
                  Search for food, scan an image, or enter manually
                </DialogDescription>
              </DialogHeader>
              <Tabs defaultValue="search" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="search">Search / Scan</TabsTrigger>
                  <TabsTrigger value="manual">Manual Entry</TabsTrigger>
                </TabsList>
                <TabsContent value="search" className="space-y-4">
                  <FoodSearch 
                    onSelectFood={(food) => {
                      setFormData({
                        meal_name: food.meal_name,
                        calories: food.calories.toString(),
                        protein_g: food.protein_g.toString(),
                        carbs_g: food.carbs_g.toString(),
                        fat_g: food.fat_g.toString(),
                      });
                    }}
                  />
                </TabsContent>
                <TabsContent value="manual">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Meal Name</Label>
                      <Input
                        placeholder="e.g., Breakfast, Chicken Salad"
                        value={formData.meal_name}
                        onChange={(e) => setFormData({ ...formData, meal_name: e.target.value })}
                        required
                      />
                    </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Calories</Label>
                    <Input
                      type="number"
                      step="1"
                      placeholder="500"
                      value={formData.calories}
                      onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Protein (g)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="30"
                      value={formData.protein_g}
                      onChange={(e) => setFormData({ ...formData, protein_g: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Carbs (g)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="50"
                      value={formData.carbs_g}
                      onChange={(e) => setFormData({ ...formData, carbs_g: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Fat (g)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="15"
                      value={formData.fat_g}
                      onChange={(e) => setFormData({ ...formData, fat_g: e.target.value })}
                      required
                    />
                  </div>
                </div>
                    <Button type="submit" className="w-full">
                      Add Entry
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
              
              {/* Preview of current values */}
              {formData.meal_name && (
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <p className="text-sm font-semibold mb-1">{formData.meal_name}</p>
                  <div className="flex gap-3 text-xs text-muted-foreground">
                    <span>{formData.calories || 0} cal</span>
                    <span>P: {formData.protein_g || 0}g</span>
                    <span>C: {formData.carbs_g || 0}g</span>
                    <span>F: {formData.fat_g || 0}g</span>
                  </div>
                  <Button 
                    onClick={handleSubmit} 
                    className="w-full mt-3"
                    disabled={!formData.calories}
                  >
                    Add to Diary
                  </Button>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Daily Progress */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Flame className="h-4 w-4" />
              Calories
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-bold">{totals.calories}</div>
              <div className="text-sm text-muted-foreground">/ {profile.target_calories?.toFixed(0)}</div>
            </div>
            <Progress value={getProgress(totals.calories, profile.target_calories || 0)} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {((totals.calories / (profile.target_calories || 1)) * 100).toFixed(0)}% of daily goal
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Beef className="h-4 w-4" />
              Protein
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-bold">{totals.protein.toFixed(0)}g</div>
              <div className="text-sm text-muted-foreground">/ {profile.target_protein_g?.toFixed(0)}g</div>
            </div>
            <Progress value={getProgress(totals.protein, profile.target_protein_g || 0)} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {((totals.protein / (profile.target_protein_g || 1)) * 100).toFixed(0)}% of daily goal
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Apple className="h-4 w-4" />
              Carbs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-bold">{totals.carbs.toFixed(0)}g</div>
              <div className="text-sm text-muted-foreground">/ {profile.target_carbs_g?.toFixed(0)}g</div>
            </div>
            <Progress value={getProgress(totals.carbs, profile.target_carbs_g || 0)} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {((totals.carbs / (profile.target_carbs_g || 1)) * 100).toFixed(0)}% of daily goal
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Fat
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-bold">{totals.fat.toFixed(0)}g</div>
              <div className="text-sm text-muted-foreground">/ {profile.target_fat_g?.toFixed(0)}g</div>
            </div>
            <Progress value={getProgress(totals.fat, profile.target_fat_g || 0)} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {((totals.fat / (profile.target_fat_g || 1)) * 100).toFixed(0)}% of daily goal
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Food Entries */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Meals</CardTitle>
          <CardDescription>
            {entries.length} {entries.length === 1 ? "entry" : "entries"} logged today
          </CardDescription>
        </CardHeader>
        <CardContent>
          {entries.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p className="mb-4">No meals logged yet today</p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Log Your First Meal
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {entries.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between p-4 border rounded-lg hover:border-primary/50 transition-colors">
                  <div className="flex-1">
                    <h4 className="font-semibold">{entry.meal_name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {new Date(entry.created_at).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                    <div className="flex gap-4 mt-2 text-sm">
                      <span className="flex items-center gap-1">
                        <Flame className="h-3 w-3" />
                        {entry.calories} cal
                      </span>
                      <span className="flex items-center gap-1">
                        <Beef className="h-3 w-3" />
                        {entry.protein_g}g
                      </span>
                      <span className="flex items-center gap-1">
                        <Apple className="h-3 w-3" />
                        {entry.carbs_g}g
                      </span>
                      <span className="flex items-center gap-1">
                        <Zap className="h-3 w-3" />
                        {entry.fat_g}g
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(entry.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FoodTracking;
