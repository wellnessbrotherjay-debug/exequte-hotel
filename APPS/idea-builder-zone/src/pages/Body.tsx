import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, Circle, ChevronRight, Clock, Target, Watch, Activity, Apple } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import WearableDevices from "./WearableDevices";
import BodyMetrics from "@/components/BodyMetrics";
import NutritionPlanner from "@/components/NutritionPlanner";

const Body = () => {
  const [currentDay, setCurrentDay] = useState(1);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "workouts";

  const workoutProgram = [
    {
      day: 1,
      title: "Core Stability",
      duration: "60-70 min",
      focus: "Foundation of core stability—the keel of your body",
      completed: false,
      blocks: [
        { name: "Warm Up", exercises: ["Cat-cow — 8 reps", "Thread-the-needle — 4 reps/side", "World's greatest lunge — 2 reps/side"] },
        { name: "Block 1", exercises: ["Plank Hold w/ Shoulder Taps — 3×30–45s", "Hollow Rocks — 3×12–15"] },
        { name: "Block 2", exercises: ["Side Plank (each side) — 3×30s", "Russian Twists (weighted) — 3×20"] },
        { name: "Block 3", exercises: ["Dead Bugs — 3×10 per side"] },
        { name: "Cool Down", exercises: ["Child's pose — 30s", "Hip flexor stretch — 30s/side", "Hamstring hinge fold — 30s", "Box breathing — 3 rounds"] },
      ],
      note: "Core is your keel. Lock it in and every other movement becomes more stable.",
    },
    {
      day: 2,
      title: "Grip & Pull Power",
      duration: "60-70 min",
      focus: "Build grip endurance + pulling power for trimming",
      completed: false,
      blocks: [
        { name: "Warm Up", exercises: ["Band pull-aparts — 15 reps", "Scap push-ups — 10 reps", "Farmer carries — 2×20m"] },
        { name: "Block 1", exercises: ["Farmer Carries — 4×40m", "Pull-ups (or Band Rows) — 3×8–12"] },
        { name: "Block 2", exercises: ["Bent-over Rows — 3×10–12", "KB Swings — 3×15"] },
        { name: "Block 3", exercises: ["Box Jumps — 3×8", "Broad Jumps — 3×8"] },
        { name: "Cool Down", exercises: ["Forearm stretches — 30s", "Grip openers — 30s", "Pec doorway stretch — 30s"] },
      ],
      note: "Grip = trimming strength. Every rep builds your ability to hold tension longer.",
    },
    {
      day: 3,
      title: "Leg Drive & Balance",
      duration: "60-70 min",
      focus: "Lower-body endurance for hiking power and stable balance",
      completed: false,
      blocks: [
        { name: "Warm Up", exercises: ["Bodyweight squats — 20 reps", "Glute bridges — 20 reps", "Walking lunges — 10/leg"] },
        { name: "Block 1", exercises: ["Split squats — 3×12/leg", "Wall sit — 3×45–60s", "Walking lunges — 3×12/leg"] },
        { name: "Block 2", exercises: ["Bulgarian split squat — 3×10/leg", "Step-ups (knee drive) — 3×10/leg"] },
        { name: "Block 3", exercises: ["Broad jumps — 4×8", "Lateral bounds — 3×12/side", "Calf raises — 3×20"] },
        { name: "Cool Down", exercises: ["Quad stretch — 45s/side", "Pigeon pose — 45s/side", "Calf stretch — 45s/side"] },
      ],
      note: "Legs are your engine—drive hard, stay balanced.",
    },
    {
      day: 4,
      title: "Back & Biceps Pull Power",
      duration: "60 min",
      focus: "Lats, upper back, biceps for trimming sheets and pulling halyards",
      completed: false,
      blocks: [
        { name: "Block 1 (AMRAP 10min)", exercises: ["Pull-Ups — 12 reps", "Barbell Row — 12 reps", "KB Hammer Curls — 12 reps"] },
        { name: "Block 2 (4×8)", exercises: ["Deadlift", "Lat Pulldown", "Single Arm DB Row"] },
        { name: "Block 3 (3 rounds)", exercises: ["Banded Face Pulls — 3×15", "EZ Bar Curls — 3×12", "Chin-Ups — Max reps"] },
        { name: "Finisher", exercises: ["Max Pull-Ups in 3 minutes"] },
      ],
      note: "Pull with your lats, not just arms. Keep back flat, chest up on rows.",
    },
    {
      day: 5,
      title: "Active Recovery",
      duration: "30-40 min",
      focus: "Light movement, mobility, and mental reset",
      completed: false,
      blocks: [
        { name: "Movement", exercises: ["20-30 min easy cardio (walk, bike, swim)", "Foam rolling — 10 min"] },
        { name: "Mobility", exercises: ["Hip openers", "Shoulder circles", "Spinal twists"] },
      ],
      note: "Recovery is training. Move light, breathe deep, prepare for tomorrow.",
    },
    {
      day: 6,
      title: "Chest & Shoulders Press",
      duration: "60-70 min",
      focus: "Upper body pushing power for spinnaker work and control",
      completed: false,
      blocks: [
        { name: "Block 1", exercises: ["Bench Press — 4×8", "Overhead Press — 4×8"] },
        { name: "Block 2", exercises: ["Incline DB Press — 3×10", "Arnold Press — 3×12"] },
        { name: "Block 3", exercises: ["Push-ups — 3×15", "Lateral Raises — 3×15", "Front Raises — 3×12"] },
      ],
      note: "Press with purpose. Chest and shoulders power your upper body control.",
    },
    {
      day: 7,
      title: "Full Body Power Circuit",
      duration: "50-60 min",
      focus: "Explosive power and cardiovascular endurance",
      completed: false,
      blocks: [
        { name: "Circuit (4 rounds)", exercises: ["KB Swings — 15", "Box Jumps — 10", "Battle Ropes — 30s", "Burpees — 10", "Rest — 90s"] },
        { name: "Finisher", exercises: ["500m row for time"] },
      ],
      note: "Bring it all together. Power + conditioning = race-ready.",
    },
    {
      day: 8,
      title: "Endurance & Stamina",
      duration: "45-60 min",
      focus: "Build the endurance to outlast the competition",
      completed: false,
      blocks: [
        { name: "Main Set", exercises: ["30 min steady cardio (row, bike, run)", "Every 5 min: 20 jump squats"] },
        { name: "Core Finisher", exercises: ["Plank hold — 2 min", "Russian twists — 2×50"] },
      ],
      note: "Long races require deep tanks. Build yours here.",
    },
    {
      day: 9,
      title: "Peak Performance Test",
      duration: "60 min",
      focus: "Test your progress and celebrate your gains",
      completed: false,
      blocks: [
        { name: "Tests", exercises: ["Max Pull-ups", "Max Plank Hold", "500m Row for Time", "Max Wall Sit"] },
        { name: "Cool Down", exercises: ["Full body stretch — 15 min", "Reflection time"] },
      ],
      note: "You've earned this. Test your limits and see how far you've come.",
    },
  ];

  const selectedWorkout = workoutProgram[currentDay - 1];
  const completedCount = workoutProgram.filter(w => w.completed).length;
  const progress = (completedCount / workoutProgram.length) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Body Training</h1>
          <p className="text-muted-foreground">9-day sailing fitness program</p>
        </div>
        
        <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/30 shadow-medium">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Overall Progress</span>
                <span className="font-semibold">{completedCount} of 9 days completed</span>
              </div>
              <Progress value={progress} className="h-2 bg-muted" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="workouts" onClick={() => navigate("/body?tab=workouts")}>
            Workouts
          </TabsTrigger>
          <TabsTrigger value="metrics" onClick={() => navigate("/body?tab=metrics")}>
            <Activity className="h-4 w-4 mr-2" />
            Metrics
          </TabsTrigger>
          <TabsTrigger value="nutrition" onClick={() => navigate("/body?tab=nutrition")}>
            <Apple className="h-4 w-4 mr-2" />
            Nutrition
          </TabsTrigger>
          <TabsTrigger value="devices" onClick={() => navigate("/body?tab=devices")}>
            <Watch className="h-4 w-4 mr-2" />
            Devices
          </TabsTrigger>
        </TabsList>

        <TabsContent value="workouts" className="space-y-6">
          {/* Day Selector */}
          <div className="flex gap-2 overflow-x-auto pb-2">
        {workoutProgram.map((workout) => (
          <Button
            key={workout.day}
            variant={currentDay === workout.day ? "default" : "outline"}
            size="sm"
            onClick={() => setCurrentDay(workout.day)}
            className={cn(
              "flex-shrink-0",
              workout.completed && "border-green-500"
            )}
          >
            {workout.completed ? (
              <CheckCircle2 className="mr-1 h-3 w-3" />
            ) : (
              <Circle className="mr-1 h-3 w-3" />
            )}
            Day {workout.day}
          </Button>
        ))}
      </div>

      {/* Workout Detail */}
      <Card className="overflow-hidden shadow-strong">
        <div className="bg-gradient-to-r from-primary via-primary-light to-primary p-6 text-white">
          <div className="flex items-start justify-between">
            <div>
              <Badge variant="secondary" className="mb-2 bg-black/30 text-white border-white/20">Day {selectedWorkout.day}</Badge>
              <h2 className="text-2xl font-bold mb-2">{selectedWorkout.title}</h2>
              <p className="text-white/90">{selectedWorkout.focus}</p>
            </div>
            <div className="flex items-center gap-2 text-sm bg-black/20 px-3 py-2 rounded-lg">
              <Clock className="h-4 w-4" />
              <span>{selectedWorkout.duration}</span>
            </div>
          </div>
        </div>

        <CardContent className="p-6 space-y-6">
          {/* Workout Blocks */}
          {selectedWorkout.blocks.map((block, index) => (
            <div key={index} className="space-y-3">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                <h3 className="font-semibold text-lg">{block.name}</h3>
              </div>
              <div className="space-y-2 pl-6">
                {block.exercises.map((exercise, exIndex) => (
                  <div key={exIndex} className="flex items-start gap-2 text-sm">
                    <Circle className="h-3 w-3 mt-1 text-muted-foreground flex-shrink-0" />
                    <span className="text-muted-foreground">{exercise}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Coach's Note */}
          <div className="rounded-lg bg-accent/10 border border-accent/20 p-4">
            <p className="text-sm font-medium text-accent mb-1">Coach's Note</p>
            <p className="text-sm text-foreground">{selectedWorkout.note}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button 
              onClick={() => navigate(`/workout-tracker?day=${selectedWorkout.day}`)}
              className="flex-1 bg-gradient-to-r from-primary to-primary-light text-white hover:opacity-90"
              size="lg"
            >
              {selectedWorkout.completed ? "Review Workout" : "Start Workout"}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
            {selectedWorkout.completed && (
              <Button variant="outline" size="lg">
                Mark Incomplete
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
        </TabsContent>

        <TabsContent value="metrics">
          <BodyMetrics />
        </TabsContent>

        <TabsContent value="nutrition">
          <NutritionPlanner />
        </TabsContent>

        <TabsContent value="devices">
          <WearableDevices />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Body;
