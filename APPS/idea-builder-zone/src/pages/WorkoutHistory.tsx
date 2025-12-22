import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Calendar, Clock, Flame, Heart, TrendingUp, ArrowUpDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSubscription } from "@/contexts/SubscriptionContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface WorkoutSession {
  id: string;
  workout_day: number;
  started_at: string;
  completed_at: string | null;
  duration_minutes: number | null;
  calories_burned: number | null;
  heart_rate_avg: number | null;
  heart_rate_max: number | null;
  notes: string | null;
}

const WorkoutHistory = () => {
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedSession1, setSelectedSession1] = useState<string>("");
  const [selectedSession2, setSelectedSession2] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("date");
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [compareSessions, setCompareSessions] = useState<WorkoutSession[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { subscribed, loading: subscriptionLoading } = useSubscription();

  useEffect(() => {
    // Redirect free users to upgrade page
    if (subscriptionLoading) return; // Wait for subscription check to complete
    
    if (!subscribed) {
      navigate("/upgrade");
      return;
    }
    loadSessions();
  }, [subscribed, subscriptionLoading, navigate]);

  const loadSessions = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase
        .from("workout_sessions")
        .select("*")
        .eq("user_id", user.id)
        .not("completed_at", "is", null)
        .order("completed_at", { ascending: false });

      if (error) throw error;
      setSessions(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading workout history",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCompare = (day: number) => {
    const daySessions = sessions.filter(s => s.workout_day === day);
    if (daySessions.length < 2) {
      toast({
        title: "Not enough data",
        description: "You need at least 2 completed workouts for this day to compare",
        variant: "destructive",
      });
      return;
    }
    setSelectedDay(day);
    setCompareSessions(daySessions.slice(0, 2));
    setCompareMode(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (minutes: number | null) => {
    if (!minutes) return "N/A";
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (compareMode && compareSessions.length === 2) {
    const [first, second] = compareSessions;
    const improvement = {
      time: ((first.duration_minutes || 0) - (second.duration_minutes || 0)),
      calories: ((second.calories_burned || 0) - (first.calories_burned || 0)),
      heartRate: ((first.heart_rate_avg || 0) - (second.heart_rate_avg || 0)),
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setCompareMode(false)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Day {selectedDay} Comparison</h1>
            <p className="text-muted-foreground">Track your strength gains over time</p>
          </div>
        </div>

        {/* Comparison Cards */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-2 border-primary">
            <CardHeader>
              <CardTitle>Most Recent</CardTitle>
              <CardDescription>{formatDate(second.completed_at!)}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="text-2xl font-bold">{formatTime(second.duration_minutes)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Calories Burned</p>
                <p className="text-2xl font-bold">{second.calories_burned || 0}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Heart Rate</p>
                <p className="text-2xl font-bold">{second.heart_rate_avg || 0} bpm</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Previous</CardTitle>
              <CardDescription>{formatDate(first.completed_at!)}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="text-2xl font-bold">{formatTime(first.duration_minutes)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Calories Burned</p>
                <p className="text-2xl font-bold">{first.calories_burned || 0}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Heart Rate</p>
                <p className="text-2xl font-bold">{first.heart_rate_avg || 0} bpm</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Improvements */}
        <Card className="border-2 border-green-500/50 bg-green-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Performance Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground">Time Difference</p>
              <p className={`text-2xl font-bold ${improvement.time < 0 ? 'text-green-500' : 'text-red-500'}`}>
                {improvement.time < 0 ? '' : '+'}{improvement.time} min
              </p>
              <p className="text-xs text-muted-foreground">
                {improvement.time < 0 ? 'Faster!' : 'Took longer'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Calories</p>
              <p className={`text-2xl font-bold ${improvement.calories > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {improvement.calories > 0 ? '+' : ''}{improvement.calories}
              </p>
              <p className="text-xs text-muted-foreground">
                {improvement.calories > 0 ? 'Burned more' : 'Burned less'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg HR Change</p>
              <p className={`text-2xl font-bold ${improvement.heartRate < 0 ? 'text-green-500' : 'text-red-500'}`}>
                {improvement.heartRate > 0 ? '+' : ''}{improvement.heartRate} bpm
              </p>
              <p className="text-xs text-muted-foreground">
                {improvement.heartRate < 0 ? 'More efficient' : 'Higher intensity'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Group sessions by day
  const sessionsByDay = sessions.reduce((acc, session) => {
    const day = session.workout_day;
    if (!acc[day]) acc[day] = [];
    acc[day].push(session);
    return acc;
  }, {} as { [key: number]: WorkoutSession[] });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Workout History</h1>
            <p className="text-muted-foreground">View all completed workouts and track progress</p>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Workouts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{sessions.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {formatTime(sessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Calories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {sessions.reduce((sum, s) => sum + (s.calories_burned || 0), 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Unique Days</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{Object.keys(sessionsByDay).length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Workout Days */}
      {Object.entries(sessionsByDay)
        .sort(([a], [b]) => Number(a) - Number(b))
        .map(([day, daySessions]) => (
          <Card key={day}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Day {day}</CardTitle>
                  <CardDescription>{daySessions.length} workout{daySessions.length > 1 ? 's' : ''} completed</CardDescription>
                </div>
                {daySessions.length >= 2 && (
                  <Button variant="outline" onClick={() => handleCompare(Number(day))}>
                    <ArrowUpDown className="mr-2 h-4 w-4" />
                    Compare
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {daySessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{formatDate(session.completed_at!)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{formatTime(session.duration_minutes)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Flame className="h-4 w-4 text-muted-foreground" />
                          <span>{session.calories_burned || 0} cal</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Heart className="h-4 w-4 text-muted-foreground" />
                          <span>{session.heart_rate_avg || 0} bpm</span>
                        </div>
                      </div>
                      {session.notes && (
                        <p className="text-sm text-muted-foreground">{session.notes}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

      {sessions.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No completed workouts yet. Start your first workout!</p>
            <Button className="mt-4" onClick={() => navigate("/body")}>
              Start Training
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WorkoutHistory;
