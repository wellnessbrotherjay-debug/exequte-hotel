"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  storage,
  type WorkoutPlan,
  type WorkoutSetup,
} from "@/lib/workout-engine/storage";
import { getMediaForExercise } from "@/lib/workout-engine/media";
import { getExerciseInstructions } from "@/lib/workout-engine/instructions";

type WorkoutState = "welcome" | "exercise" | "transition" | "complete";

function hexToRgba(hex: string, alpha: number) {
  const sanitized = hex.replace("#", "");
  if (sanitized.length !== 6) return `rgba(255,255,255,${alpha})`;
  const numeric = parseInt(sanitized, 16);
  const r = (numeric >> 16) & 255;
  const g = (numeric >> 8) & 255;
  const b = numeric & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function MobilePage() {
  const router = useRouter();
  
  const [setup, setSetup] = useState<WorkoutSetup | null>(null);
  const [plan, setPlan] = useState<WorkoutPlan | null>(null);
  const [workoutState, setWorkoutState] = useState<WorkoutState>("welcome");
  const [currentStationIndex, setCurrentStationIndex] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [workoutStartTime, setWorkoutStartTime] = useState<number | null>(null);
  const [exerciseStartTime, setExerciseStartTime] = useState<number | null>(null);
  const [exerciseTime, setExerciseTime] = useState(0);

  // Brand colors
  const primaryBrand = "#00BFFF";
  const secondaryBrand = "#6B7280";

  useEffect(() => {
    const nextSetup = storage.getSetup();
    if (!nextSetup) {
      router.replace("/setup");
      return;
    }
    setSetup(nextSetup);
    setPlan(storage.getPlan());
  }, [router]);

  // Exercise timer
  useEffect(() => {
    if (workoutState === "exercise" && exerciseStartTime) {
      const interval = setInterval(() => {
        setExerciseTime(Math.floor((Date.now() - exerciseStartTime) / 1000));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [workoutState, exerciseStartTime]);

  // Get current exercise
  const currentExercise = plan?.exercises?.[currentStationIndex];
  const currentExerciseName = currentExercise?.name ?? "Exercise";
  const currentMedia = currentExercise ? getMediaForExercise(currentExercise.name) : null;
  const currentInstructions = currentExercise ? getExerciseInstructions(currentExercise.name) : [];
  const currentDescription = currentInstructions.length > 0 
    ? currentInstructions.join(" ") 
    : `Perform ${currentExerciseName} with proper form and control.`;
  const currentVideoSrc = currentMedia?.video || "/videos/fallback.mp4";
  const currentStationId = currentExercise?.stationId || currentStationIndex + 1;
  const currentEquipment = setup?.stations?.find(s => s.id === currentStationId)?.equipment || "Equipment";

  // Get next exercise
  const nextStationIndex = currentStationIndex + 1;
  const isLastStation = nextStationIndex >= (plan?.exercises?.length || 0);
  const nextExercise = !isLastStation ? plan?.exercises?.[nextStationIndex] : null;
  const nextExerciseName = nextExercise?.name ?? "Complete";
  const nextMedia = nextExercise ? getMediaForExercise(nextExercise.name) : null;
  const nextVideoSrc = nextMedia?.video || "/videos/fallback.mp4";
  const nextStationId = nextExercise?.stationId || nextStationIndex + 1;

  const totalStations = plan?.exercises?.length || 0;
  const totalRounds = setup?.rounds || 1;
  const progress = ((currentRound - 1) * totalStations + currentStationIndex + 1) / (totalRounds * totalStations) * 100;

  const startWorkout = () => {
    setWorkoutStartTime(Date.now());
    setCurrentStationIndex(0);
    setCurrentRound(1);
    setWorkoutState("exercise");
    setExerciseStartTime(Date.now());
  };

  const startExercise = () => {
    setWorkoutState("exercise");
    setExerciseStartTime(Date.now());
    setExerciseTime(0);
  };

  const finishExercise = () => {
    if (isLastStation) {
      if (currentRound < totalRounds) {
        // Next round
        setCurrentRound(currentRound + 1);
        setCurrentStationIndex(0);
        setWorkoutState("transition");
      } else {
        // Workout complete
        setWorkoutState("complete");
      }
    } else {
      // Next station
      setCurrentStationIndex(currentStationIndex + 1);
      setWorkoutState("transition");
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!setup || !plan) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full mx-auto mb-4"></div>
          <div className="text-xl font-bold mb-2">Loading Workout...</div>
          <div className="text-gray-400">Syncing your session</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center gap-3">
          {setup.logo && (
            <Image
              src={setup.logo}
              alt="Logo"
              width={40}
              height={40}
              className="rounded-full object-contain"
            />
          )}
          <div>
            <h1 className="text-lg font-bold" style={{ color: primaryBrand }}>
              {setup.facilityName || "Fitness Center"}
            </h1>
            <p className="text-xs text-gray-400">Personal Workout Guide</p>
          </div>
        </div>
        
        {workoutState !== "welcome" && (
          <div className="text-right">
            <div className="text-sm font-bold text-white">
              Round {currentRound}/{totalRounds}
            </div>
            <div className="text-xs text-gray-400">
              Station {currentStationIndex + 1}/{totalStations}
            </div>
          </div>
        )}
      </header>

      {/* Progress Bar */}
      {workoutState !== "welcome" && workoutState !== "complete" && (
        <div className="px-4 py-2">
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div 
              className="h-2 rounded-full transition-all duration-500"
              style={{ 
                width: `${progress}%`,
                backgroundColor: primaryBrand 
              }}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        
        {/* Welcome Screen */}
        {workoutState === "welcome" && (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            {setup.logo && (
              <Image
                src={setup.logo}
                alt="Logo"
                width={120}
                height={120}
                className="rounded-full object-contain mb-6"
              />
            )}
            <h2 className="text-3xl font-bold mb-4">Ready to Start?</h2>
            <p className="text-gray-400 mb-2">
              {totalStations} stations • {totalRounds} rounds
            </p>
            <p className="text-gray-400 mb-8">
              {setup.workTime}s work / {setup.restTime}s rest
            </p>
            
            <div className="bg-gray-900 rounded-xl p-6 mb-8 w-full max-w-sm">
              <h3 className="font-bold mb-4 text-blue-400">How it works:</h3>
              <div className="space-y-3 text-sm text-gray-300">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold">1</div>
                  <span>Watch exercise video & read instructions</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold">2</div>
                  <span>Tap "Start" when ready to begin</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold">3</div>
                  <span>Tap "Finished" when done</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold">4</div>
                  <span>Move to next station & repeat</span>
                </div>
              </div>
            </div>

            <button
              onClick={startWorkout}
              className="w-full max-w-sm bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl text-xl transition-colors"
            >
              🚀 Start Workout
            </button>
          </div>
        )}

        {/* Exercise Screen */}
        {workoutState === "exercise" && (
          <div className="flex-1 flex flex-col">
            {/* Station Info */}
            <div className="p-4 bg-gray-900">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h2 className="text-xl font-bold text-gray-400">
                    STATION {currentStationId}
                  </h2>
                  <p className="text-sm" style={{ color: primaryBrand }}>
                    {currentEquipment}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-400">
                    {formatTime(exerciseTime)}
                  </div>
                  <div className="text-xs text-gray-400">Exercise Time</div>
                </div>
              </div>
            </div>

            {/* Exercise Video */}
            <div className="flex-1 p-4">
              <div 
                className="relative w-full h-full rounded-xl border-2 overflow-hidden"
                style={{
                  borderColor: primaryBrand,
                  backgroundColor: hexToRgba(primaryBrand, 0.1),
                }}
              >
                <video
                  src={currentVideoSrc}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover bg-black"
                />
                
                {/* Exercise Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/90 to-transparent p-4">
                  <h3 className="text-xl font-bold text-white mb-2">
                    {currentExerciseName}
                  </h3>
                  <p className="text-sm text-blue-300 leading-relaxed">
                    {currentDescription}
                  </p>
                </div>
              </div>
            </div>

            {/* Finish Button */}
            <div className="p-4">
              <button
                onClick={finishExercise}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-xl text-lg transition-colors"
              >
                ✅ Finished - Next {isLastStation ? (currentRound < totalRounds ? "Round" : "Complete") : "Station"}
              </button>
            </div>
          </div>
        )}

        {/* Transition Screen */}
        {workoutState === "transition" && (
          <div className="flex-1 flex flex-col p-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2 text-green-400">
                Great job! 🎉
              </h2>
              <p className="text-gray-400">
                {isLastStation && currentRound < totalRounds 
                  ? `Round ${currentRound - 1} complete! Starting Round ${currentRound}`
                  : `Moving to Station ${currentStationId}`
                }
              </p>
            </div>

            {/* Next Exercise Preview */}
            <div className="flex-1 mb-6">
              <h3 className="text-lg font-bold mb-3 text-blue-400">
                Up Next: Station {currentStationId}
              </h3>
              <div 
                className="relative w-full h-64 rounded-xl border-2 overflow-hidden"
                style={{ borderColor: "#32CD32" }}
              >
                <video
                  src={currentVideoSrc}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover bg-black"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
                  <h4 className="text-lg font-bold text-white mb-1">
                    {currentExerciseName}
                  </h4>
                  <p className="text-sm text-green-400">
                    {currentEquipment}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-xl p-4 mb-6">
              <p className="text-center text-gray-300">
                Take your time to move to the next station. Tap "Start" when you're ready to begin.
              </p>
            </div>

            <button
              onClick={startExercise}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl text-lg transition-colors"
            >
              🚀 Start Exercise
            </button>
          </div>
        )}

        {/* Complete Screen */}
        {workoutState === "complete" && (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="text-6xl mb-6">🏆</div>
            <h2 className="text-3xl font-bold mb-4 text-green-400">
              Workout Complete!
            </h2>
            <p className="text-gray-400 mb-6">
              Amazing job completing {totalRounds} rounds of {totalStations} stations!
            </p>
            
            {workoutStartTime && (
              <div className="bg-gray-900 rounded-xl p-6 mb-8">
                <h3 className="font-bold mb-2 text-blue-400">Your Stats:</h3>
                <div className="text-2xl font-bold text-white">
                  {formatTime(Math.floor((Date.now() - workoutStartTime) / 1000))}
                </div>
                <div className="text-sm text-gray-400">Total Workout Time</div>
              </div>
            )}

            <button
              onClick={() => {
                setWorkoutState("welcome");
                setCurrentStationIndex(0);
                setCurrentRound(1);
                setWorkoutStartTime(null);
                setExerciseStartTime(null);
                setExerciseTime(0);
              }}
              className="w-full max-w-sm bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl text-lg transition-colors"
            >
              🔄 Start New Workout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}