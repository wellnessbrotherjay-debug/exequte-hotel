import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Play, 
  Pause, 
  CheckCircle2, 
  Circle, 
  Heart, 
  Flame, 
  Clock,
  TrendingUp,
  Watch,
  Dumbbell,
  Video,
  Crown,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSubscription } from "@/contexts/SubscriptionContext";

interface Exercise {
  name: string;
  sets?: number;
  reps?: string;
  duration?: string;
  completed: boolean;
  setsCompleted: number;
  repsCompleted: number;
  videoUrl?: string;
  exerciseLibraryId?: string;
}

interface SetLog {
  reps: number;
  weight: number;
}

const WorkoutTracker = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const { subscribed, loading: subscriptionLoading } = useSubscription();
  const [showWelcome, setShowWelcome] = useState(false);
  const day = parseInt(searchParams.get("day") || "1");
  
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [heartRate, setHeartRate] = useState(0);
  const [caloriesBurned, setCaloriesBurned] = useState(0);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [logDialogOpen, setLogDialogOpen] = useState(false);
  const [selectedExerciseIndex, setSelectedExerciseIndex] = useState<number | null>(null);
  const [currentSetReps, setCurrentSetReps] = useState("");
  const [currentSetWeight, setCurrentSetWeight] = useState("");
  
  const [exercises, setExercises] = useState<Exercise[]>([
    { name: "Cat-cow", reps: "8 reps", completed: false, setsCompleted: 0, repsCompleted: 0 },
    { name: "Thread-the-needle", reps: "4 reps/side", completed: false, setsCompleted: 0, repsCompleted: 0 },
    { name: "World's greatest lunge", reps: "2 reps/side", completed: false, setsCompleted: 0, repsCompleted: 0 },
    { name: "Plank Hold w/ Shoulder Taps", sets: 3, reps: "30-45s", completed: false, setsCompleted: 0, repsCompleted: 0 },
    { name: "Hollow Rocks", sets: 3, reps: "12-15", completed: false, setsCompleted: 0, repsCompleted: 0 },
    { name: "Side Plank (each side)", sets: 3, reps: "30s", completed: false, setsCompleted: 0, repsCompleted: 0 },
    { name: "Russian Twists (weighted)", sets: 3, reps: "20", completed: false, setsCompleted: 0, repsCompleted: 0 },
    { name: "Dead Bugs", sets: 3, reps: "10 per side", completed: false, setsCompleted: 0, repsCompleted: 0 },
  ]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isWorkoutActive && !isPaused) {
      interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
        // Simulate heart rate and calories (in real app, get from wearable)
        setHeartRate(Math.floor(120 + Math.random() * 40));
        setCaloriesBurned((prev) => prev + 0.1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isWorkoutActive, isPaused]);

  useEffect(() => {
    // Show welcome banner for newly upgraded users
    if (subscriptionLoading) return; // Wait for subscription check to complete
    
    console.log('WorkoutTracker: subscribed =', subscribed, 'loading =', subscriptionLoading);
    
    if (subscribed) {
      const hasSeenWelcome = localStorage.getItem('workout-tracker-welcome');
      if (!hasSeenWelcome) {
        setShowWelcome(true);
        localStorage.setItem('workout-tracker-welcome', 'true');
      }
    } else {
      // Redirect free users to upgrade page
      console.log('Redirecting to upgrade page - not subscribed');
      navigate("/upgrade");
    }
  }, [subscribed, subscriptionLoading, navigate]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartWorkout = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to track workouts",
          variant: "destructive",
        });
        return;
      }

      const { data: session, error } = await supabase
        .from("workout_sessions")
        .insert({
          user_id: user.id,
          workout_day: day,
        })
        .select()
        .single();

      if (error) throw error;

      setCurrentSessionId(session.id);
      setIsWorkoutActive(true);
      setIsPaused(false);
      
      toast({
        title: "Workout Started",
        description: "Track your progress and log each exercise",
      });
    } catch (error: any) {
      toast({
        title: "Error Starting Workout",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
  };

  const handleCompleteExercise = (index: number) => {
    const newExercises = [...exercises];
    newExercises[index].completed = !newExercises[index].completed;
    setExercises(newExercises);
  };

  const handleOpenLogDialog = (index: number) => {
    setSelectedExerciseIndex(index);
    setLogDialogOpen(true);
    setCurrentSetReps("");
    setCurrentSetWeight("");
  };

  const handleSaveSet = async () => {
    if (selectedExerciseIndex === null || !currentSessionId) return;

    try {
      const exercise = exercises[selectedExerciseIndex];
      const reps = parseInt(currentSetReps);
      const weight = parseFloat(currentSetWeight);

      if (isNaN(reps) || reps <= 0) {
        toast({
          title: "Invalid Input",
          description: "Please enter valid reps",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.from("exercise_logs").insert({
        session_id: currentSessionId,
        exercise_name: exercise.name,
        sets_completed: 1,
        reps_completed: reps,
        weight_kg: isNaN(weight) ? null : weight,
        exercise_library_id: exercise.exerciseLibraryId,
      });

      if (error) throw error;

      const newExercises = [...exercises];
      newExercises[selectedExerciseIndex].setsCompleted++;
      if (newExercises[selectedExerciseIndex].setsCompleted === newExercises[selectedExerciseIndex].sets) {
        newExercises[selectedExerciseIndex].completed = true;
      }
      setExercises(newExercises);

      toast({
        title: "Set Logged",
        description: `${reps} reps${weight ? ` @ ${weight}kg` : ""} recorded`,
      });

      setLogDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Error Logging Set",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleFinishWorkout = async () => {
    if (!currentSessionId) return;

    try {
      const { error } = await supabase
        .from("workout_sessions")
        .update({
          completed_at: new Date().toISOString(),
          duration_minutes: Math.floor(elapsedTime / 60),
          calories_burned: Math.floor(caloriesBurned),
          heart_rate_avg: heartRate,
          heart_rate_max: heartRate + 10,
        })
        .eq("id", currentSessionId);

      if (error) throw error;

      toast({
        title: "Workout Complete!",
        description: `Duration: ${formatTime(elapsedTime)} | Calories: ${caloriesBurned.toFixed(0)}`,
      });
      
      navigate("/body");
    } catch (error: any) {
      toast({
        title: "Error Saving Workout",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const completedCount = exercises.filter(e => e.completed).length;
  const progress = (completedCount / exercises.length) * 100;

  // Show loading while checking subscription
  if (subscriptionLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="text-muted-foreground">Checking access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Day {day} Workout Tracker</h1>
          <p className="text-muted-foreground">Log your exercises in real-time</p>
        </div>
        <Button variant="outline" onClick={() => navigate("/body")}>
          Exit
        </Button>
      </div>

      {/* Premium Welcome Banner */}
      {showWelcome && (
        <Alert className="border-primary bg-gradient-to-r from-primary/10 to-transparent">
          <Crown className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>
                <strong>Welcome to Premium!</strong> You now have access to advanced workout tracking, 
                heart rate monitoring, and performance insights.
              </span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowWelcome(false)}
              className="ml-4"
            >
              ×
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Dashboard */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-primary/30 bg-gradient-to-br from-primary/10 to-transparent">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Duration</p>
                <p className="text-2xl font-bold">{formatTime(elapsedTime)}</p>
              </div>
              <Clock className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Heart Rate</p>
                <p className="text-2xl font-bold">{isWorkoutActive ? heartRate : "--"} <span className="text-sm text-muted-foreground">bpm</span></p>
              </div>
              <Heart className="h-8 w-8 text-red-500 animate-pulse" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Calories</p>
                <p className="text-2xl font-bold">{caloriesBurned.toFixed(0)} <span className="text-sm text-muted-foreground">kcal</span></p>
              </div>
              <Flame className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Progress</p>
                <p className="text-2xl font-bold">{completedCount}/{exercises.length}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Workout Progress</span>
              <span className="font-semibold">{progress.toFixed(0)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Control Buttons */}
      {!isWorkoutActive ? (
        <Button 
          onClick={handleStartWorkout}
          className="w-full bg-gradient-to-r from-primary to-primary-light text-white hover:opacity-90 shadow-glow"
          size="lg"
        >
          <Play className="mr-2 h-5 w-5" />
          Start Workout
        </Button>
      ) : (
        <div className="flex gap-3">
          <Button 
            onClick={handlePauseResume}
            variant="outline"
            className="flex-1"
            size="lg"
          >
            {isPaused ? <Play className="mr-2 h-5 w-5" /> : <Pause className="mr-2 h-5 w-5" />}
            {isPaused ? "Resume" : "Pause"}
          </Button>
          <Button 
            onClick={handleFinishWorkout}
            className="flex-1 bg-gradient-to-r from-primary to-primary-light text-white hover:opacity-90"
            size="lg"
          >
            <CheckCircle2 className="mr-2 h-5 w-5" />
            Finish Workout
          </Button>
        </div>
      )}

      {/* Exercise List */}
      <Card>
        <CardHeader>
          <CardTitle>Exercises</CardTitle>
          <CardDescription>Check off or log sets as you complete them</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {exercises.map((exercise, index) => (
            <div key={index}>
              <div 
                className={cn(
                  "flex items-start gap-4 p-4 rounded-lg border transition-all",
                  exercise.completed 
                    ? "border-primary/50 bg-primary/5" 
                    : "border-border hover:border-primary/30"
                )}
              >
                <button
                  onClick={() => handleCompleteExercise(index)}
                  className="mt-1 flex-shrink-0"
                  disabled={!isWorkoutActive}
                >
                  {exercise.completed ? (
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                  ) : (
                    <Circle className="h-6 w-6 text-muted-foreground" />
                  )}
                </button>

                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className={cn(
                        "font-semibold",
                        exercise.completed && "text-muted-foreground line-through"
                      )}>
                        {exercise.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {exercise.sets ? `${exercise.sets} sets × ` : ""}{exercise.reps}
                      </p>
                    </div>
                    {exercise.sets && (
                      <Badge variant={exercise.completed ? "default" : "outline"}>
                        {exercise.setsCompleted}/{exercise.sets} sets
                      </Badge>
                    )}
                  </div>

                  {exercise.videoUrl && (
                    <div className="mt-2 relative aspect-video rounded-lg overflow-hidden bg-muted border-2 border-primary/20">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Video className="h-12 w-12 text-muted-foreground" />
                      </div>
                      <p className="absolute bottom-2 left-2 text-xs bg-background/80 px-2 py-1 rounded">
                        Video tutorial available
                      </p>
                    </div>
                  )}

                  {exercise.sets && isWorkoutActive && !exercise.completed && (
                    <Dialog open={logDialogOpen && selectedExerciseIndex === index} onOpenChange={(open) => {
                      if (!open) setLogDialogOpen(false);
                    }}>
                      <DialogTrigger asChild>
                        <Button 
                          onClick={() => handleOpenLogDialog(index)}
                          size="sm"
                          variant="outline"
                          className="w-full"
                        >
                          <Dumbbell className="mr-2 h-4 w-4" />
                          Log Set
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Log Set - {exercise.name}</DialogTitle>
                          <DialogDescription>
                            Set {exercise.setsCompleted + 1} of {exercise.sets}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="reps">Reps Completed *</Label>
                            <Input
                              id="reps"
                              type="number"
                              placeholder="12"
                              value={currentSetReps}
                              onChange={(e) => setCurrentSetReps(e.target.value)}
                              min="1"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="weight">Weight (kg)</Label>
                            <Input
                              id="weight"
                              type="number"
                              step="0.5"
                              placeholder="20.0"
                              value={currentSetWeight}
                              onChange={(e) => setCurrentSetWeight(e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground">
                              Leave empty for bodyweight exercises
                            </p>
                          </div>
                          <Button 
                            onClick={handleSaveSet}
                            className="w-full"
                          >
                            Save Set
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </div>
              {index < exercises.length - 1 && <Separator className="my-2" />}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Wearable Status */}
      <Card className="border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <Watch className="h-5 w-5 text-primary" />
            <div className="flex-1">
              <p className="text-sm font-medium">Wearable Device</p>
              <p className="text-xs text-muted-foreground">
                Connect Apple Watch, Garmin, or Fitbit to track heart rate automatically
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate("/body?tab=devices")}
            >
              Connect
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkoutTracker;
