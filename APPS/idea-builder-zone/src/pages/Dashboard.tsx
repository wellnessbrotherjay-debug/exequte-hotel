
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Anchor, Brain, ChevronRight, TrendingUp, Smile, Meh, Frown, CheckCircle2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import NutritionTracker from "@/components/NutritionTracker";

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  // Track which area cards have been used (clicked) in session
  const [usedAreas, setUsedAreas] = useState<string[]>(() => {
    const stored = localStorage.getItem('usedAreas');
    return stored ? JSON.parse(stored) : [];
  });
  const [workoutStats, setWorkoutStats] = useState({
    completed: 0,
    totalTime: 0,
    lastWorkout: null as any,
  });
  const [mindsetStats, setMindsetStats] = useState({
    stateOfMind: "",
    completedExercises: [] as string[],
    totalEntries: 0
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
      } else {
        setLoading(false);
        loadWorkoutStats(session.user.id);
        loadMindsetStats(session.user.id);
      }
    };
    checkAuth();
  }, [navigate]);

  const loadWorkoutStats = async (userId: string) => {
    try {
      const { data: sessions } = await supabase
        .from("workout_sessions")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (sessions) {
        const completed = sessions.filter(s => s.completed_at).length;
        const totalTime = sessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0);
        const lastWorkout = sessions[0];
        
        setWorkoutStats({
          completed,
          totalTime,
          lastWorkout,
        });
      }
    } catch (error) {
      console.error("Error loading workout stats:", error);
    }
  };

  const loadMindsetStats = async (userId: string) => {
    try {
      // Get today's entry
      const today = new Date().toISOString().split('T')[0];
      const { data: todayEntry } = await (supabase
        .from("mindset_entries")
        .select("*")
        .eq("user_id", userId)
        .gte("created_at", today)
        .order("created_at", { ascending: false })
        .limit(1) as any);

      // Get total entries count
      const { count } = await (supabase
        .from("mindset_entries")
        .select("*", { count: 'exact', head: true })
        .eq("user_id", userId) as any);

      if (todayEntry && todayEntry.length > 0) {
        const entry = todayEntry[0];
        setMindsetStats({
          stateOfMind: entry.state_of_mind || "",
          completedExercises: entry.completed_exercises || [],
          totalEntries: count || 0
        });
      } else {
        setMindsetStats({
          stateOfMind: "",
          completedExercises: [],
          totalEntries: count || 0
        });
      }
    } catch (error) {
      console.error("Error loading mindset stats:", error);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const totalDays = 9;
  const progress = (workoutStats.completed / totalDays) * 100;

  const stats = [
    { label: "Workouts Completed", value: `${workoutStats.completed}/9`, change: `${Math.round(progress)}%`, trend: "up" },
    { label: "Total Training Time", value: `${Math.floor(workoutStats.totalTime / 60)}h ${workoutStats.totalTime % 60}m`, change: `${workoutStats.totalTime}min`, trend: "neutral" },
    { label: "Last Workout", value: workoutStats.lastWorkout ? `Day ${workoutStats.lastWorkout.workout_day}` : "None", change: workoutStats.lastWorkout ? new Date(workoutStats.lastWorkout.completed_at).toLocaleDateString() : "-", trend: "neutral" },
  ];

  const areas = [
    {
      key: "body",
      title: "Body",
      description: "9-day fitness program",
      icon: Activity,
      color: "from-primary to-primary-light",
      link: "/body",
      status: `Day ${workoutStats.completed + 1} of ${totalDays}`,
    },
    {
      key: "boat",
      title: "Boat",
      description: "Setup guide & race tracking",
      icon: Anchor,
      color: "from-secondary via-secondary to-black",
      link: "/boat-setup",
      status: "Quick access",
    },
    {
      key: "mindset",
      title: "Mindset",
      description: "Mental fitness",
      icon: Brain,
      color: "from-primary to-primary-light",
      link: "/mindset",
      status: "Daily exercises",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary-light to-primary p-8 text-white shadow-strong border border-primary/20">
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome Back, Sailor</h1>
          <p className="text-white/90 mb-6">
            Your complete 9-day fitness journey for peak sailing performance
          </p>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Program Progress</span>
              <span className="font-semibold">{workoutStats.completed} of {totalDays} completed</span>
            </div>
            <Progress value={progress} className="h-2 bg-white/20" />
          </div>
        </div>
        <div className="pointer-events-none absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-black/30 to-transparent" />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-3">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <CardDescription>{stat.label}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline justify-between">
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <TrendingUp className="h-4 w-4" />
                      <span>{stat.change}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/10 to-transparent shadow-strong">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  {workoutStats.completed < totalDays ? `Day ${workoutStats.completed + 1} Workout` : "Program Complete!"}
                </CardTitle>
                <CardDescription>
                  {workoutStats.completed < totalDays 
                    ? "Continue your fitness journey" 
                    : "You've completed all 9 days!"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/body">
                  <button
                    type="button"
                    className="w-full bg-gradient-to-r from-primary to-primary-light text-white hover:opacity-90 shadow-glow rounded-md text-sm font-medium flex items-center justify-center gap-2 py-2 px-4"
                  >
                    {workoutStats.completed < totalDays ? "Start Workout" : "Review Program"}
                    <span className="ml-2 h-4 w-4">
                      <ChevronRight />
                    </span>
                  </button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Workout History
                </CardTitle>
                <CardDescription>
                  View past workouts and track progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <button
                  type="button"
                  className="w-full border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md text-sm font-medium flex items-center justify-center gap-2 py-2 px-4"
                  onClick={() => navigate("/workout-history")}
                >
                  View All Workouts
                  <span className="ml-2 h-4 w-4">
                    <ChevronRight />
                  </span>
                </button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Column (Nutrition) */}
        <div className="space-y-6">
          <NutritionTracker />
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardHeader className="pb-2">
              <CardDescription>Mental Status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                {mindsetStats.stateOfMind === "positive" && (
                  <>
                    <Smile className="h-8 w-8 text-green-500" />
                    <div>
                      <div className="text-lg font-bold">Positive</div>
                      <div className="text-xs text-muted-foreground">{mindsetStats.completedExercises.length}/3 exercises</div>
                    </div>
                  </>
                )}
                {mindsetStats.stateOfMind === "neutral" && (
                  <>
                    <Meh className="h-8 w-8 text-yellow-500" />
                    <div>
                      <div className="text-lg font-bold">Neutral</div>
                      <div className="text-xs text-muted-foreground">{mindsetStats.completedExercises.length}/3 exercises</div>
                    </div>
                  </>
                )}
                {mindsetStats.stateOfMind === "negative" && (
                  <>
                    <Frown className="h-8 w-8 text-orange-500" />
                    <div>
                      <div className="text-lg font-bold">Struggling</div>
                      <div className="text-xs text-muted-foreground">{mindsetStats.completedExercises.length}/3 exercises</div>
                    </div>
                  </>
                )}
                {!mindsetStats.stateOfMind && (
                  <>
                    <Brain className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <div className="text-lg font-bold">Not set</div>
                      <div className="text-xs text-muted-foreground">Check in today</div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
