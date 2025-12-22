import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { TrendingDown, TrendingUp, Activity, Calendar, Plus, AreaChart } from "lucide-react";
import { format } from "date-fns";
import { Area, AreaChart as RechartsAreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface BodyMetric {
  id: string;
  recorded_at: string;
  weight_kg: number | null;
  body_fat_percentage: number | null;
  muscle_mass_kg: number | null;
  notes: string | null;
}

const BodyMetrics = () => {
  const [metrics, setMetrics] = useState<BodyMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    weight_kg: "",
    body_fat_percentage: "",
    muscle_mass_kg: "",
    notes: "",
  });

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("body_metrics")
        .select("*")
        .eq("user_id", user.id)
        .order("recorded_at", { ascending: false });

      if (error) throw error;
      setMetrics(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading metrics",
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

      const { error } = await supabase.from("body_metrics").insert({
        user_id: user.id,
        weight_kg: formData.weight_kg ? parseFloat(formData.weight_kg) : null,
        body_fat_percentage: formData.body_fat_percentage ? parseFloat(formData.body_fat_percentage) : null,
        muscle_mass_kg: formData.muscle_mass_kg ? parseFloat(formData.muscle_mass_kg) : null,
        notes: formData.notes || null,
      });

      if (error) throw error;

      toast({
        title: "Metric added",
        description: "Your body metrics have been recorded.",
      });

      setFormData({ weight_kg: "", body_fat_percentage: "", muscle_mass_kg: "", notes: "" });
      setShowForm(false);
      loadMetrics();
    } catch (error: any) {
      toast({
        title: "Error adding metric",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getLatestMetric = () => metrics[0];
  const getPreviousMetric = () => metrics[1];

  const calculateChange = (current: number | null, previous: number | null) => {
    if (!current || !previous) return null;
    return current - previous;
  };

  const latestMetric = getLatestMetric();
  const previousMetric = getPreviousMetric();

  const weightChange = calculateChange(latestMetric?.weight_kg || null, previousMetric?.weight_kg || null);
  const bodyFatChange = calculateChange(latestMetric?.body_fat_percentage || null, previousMetric?.body_fat_percentage || null);
  const muscleChange = calculateChange(latestMetric?.muscle_mass_kg || null, previousMetric?.muscle_mass_kg || null);

  const chartData = metrics
    .map(m => ({
      date: format(new Date(m.recorded_at), "MMM dd"),
      weight: m.weight_kg,
      bodyFat: m.body_fat_percentage,
      muscle: m.muscle_mass_kg,
    }))
    .reverse();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Body Metrics</h2>
          <p className="text-muted-foreground">Track your physical progress over time</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus className="h-4 w-4" />
          {showForm ? "Cancel" : "Add Metric"}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Record New Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    placeholder="75.5"
                    value={formData.weight_kg}
                    onChange={(e) => setFormData({ ...formData, weight_kg: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bodyfat">Body Fat %</Label>
                  <Input
                    id="bodyfat"
                    type="number"
                    step="0.1"
                    placeholder="15.0"
                    value={formData.body_fat_percentage}
                    onChange={(e) => setFormData({ ...formData, body_fat_percentage: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="muscle">Muscle Mass (kg)</Label>
                  <Input
                    id="muscle"
                    type="number"
                    step="0.1"
                    placeholder="65.0"
                    value={formData.muscle_mass_kg}
                    onChange={(e) => setFormData({ ...formData, muscle_mass_kg: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Feeling great today..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
              <Button type="submit" className="w-full">Save Metrics</Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Current Stats */}
      {latestMetric && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Weight</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{latestMetric.weight_kg?.toFixed(1)} kg</div>
              {weightChange !== null && (
                <div className={`flex items-center gap-1 text-sm ${weightChange > 0 ? 'text-blue-500' : 'text-green-500'}`}>
                  {weightChange > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  {Math.abs(weightChange).toFixed(1)} kg
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Body Fat %</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{latestMetric.body_fat_percentage?.toFixed(1)}%</div>
              {bodyFatChange !== null && (
                <div className={`flex items-center gap-1 text-sm ${bodyFatChange < 0 ? 'text-green-500' : 'text-blue-500'}`}>
                  {bodyFatChange < 0 ? <TrendingDown className="h-4 w-4" /> : <TrendingUp className="h-4 w-4" />}
                  {Math.abs(bodyFatChange).toFixed(1)}%
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Muscle Mass</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{latestMetric.muscle_mass_kg?.toFixed(1)} kg</div>
              {muscleChange !== null && (
                <div className={`flex items-center gap-1 text-sm ${muscleChange > 0 ? 'text-green-500' : 'text-blue-500'}`}>
                  {muscleChange > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  {Math.abs(muscleChange).toFixed(1)} kg
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Progress Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AreaChart className="h-5 w-5" />
            Progress Over Time
          </CardTitle>
          <CardDescription>Visualizing your body metric trends</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsAreaChart data={chartData}>
              <defs>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
                <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00f5d4" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#00f5d4" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorBodyFat" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ffc300" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#ffc300" stopOpacity={0}/>
                </linearGradient>
                 <linearGradient id="colorMuscle" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f000b8" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#f000b8" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
              <XAxis dataKey="date" stroke="#888888" fontSize={12} />
              <YAxis stroke="#888888" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  borderColor: 'hsl(var(--border))',
                  color: 'hsl(var(--foreground))',
                  borderRadius: '0.5rem',
                }}
                cursor={{ stroke: '#888888', strokeWidth: 1, strokeDasharray: '3 3' }}
              />
              <Area type="monotone" dataKey="weight" stroke="#00f5d4" fill="url(#colorWeight)" name="Weight (kg)" strokeWidth={2} filter="url(#glow)" />
              <Area type="monotone" dataKey="bodyFat" stroke="#ffc300" fill="url(#colorBodyFat)" name="Body Fat (%)" strokeWidth={2} filter="url(#glow)" />
              <Area type="monotone" dataKey="muscle" stroke="#f000b8" fill="url(#colorMuscle)" name="Muscle (kg)" strokeWidth={2} filter="url(#glow)" />
            </RechartsAreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Metrics History
          </CardTitle>
          <CardDescription>Your body composition over time</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : metrics.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No metrics recorded yet. Start tracking your progress!
            </div>
          ) : (
            <div className="space-y-4">
              {metrics.map((metric) => (
                <div key={metric.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {format(new Date(metric.recorded_at), "MMM dd, yyyy")}
                    </div>
                    <div className="flex gap-4 text-sm">
                      {metric.weight_kg && <span className="font-medium">{metric.weight_kg} kg</span>}
                      {metric.body_fat_percentage && <span className="text-muted-foreground">{metric.body_fat_percentage}% BF</span>}
                      {metric.muscle_mass_kg && <span className="text-muted-foreground">{metric.muscle_mass_kg} kg muscle</span>}
                    </div>
                  </div>
                  {metric.notes && (
                    <p className="text-sm text-muted-foreground italic">{metric.notes}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BodyMetrics;
