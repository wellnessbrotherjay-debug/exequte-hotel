"use client";

import { useEffect, useMemo, useState } from "react";
import {
  storage,
  STORAGE_KEYS,
  getDefaultBrandColors,
  type SessionPhase,
  type SessionState,
  type WorkoutPlan,
  type WorkoutSetup,
} from "@/lib/workout-engine/storage";
import { getMediaForExercise } from "@/lib/workout-engine/media";
import { getExerciseInstructions } from "@/lib/workout-engine/instructions";
import QRCode from "qrcode";

function formatTime(seconds: number) {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
}

const FALLBACK_VIDEO = "/videos/fallback.mp4";

type Phase = SessionPhase;

export default function RoomWorkoutDisplay() {
  const [setup, setSetup] = useState<WorkoutSetup | null>(null);
  const [plan, setPlan] = useState<WorkoutPlan | null>(null);
  const [session, setSession] = useState<SessionState | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [phase, setPhase] = useState<Phase>("prep");
  const [qrSrc, setQrSrc] = useState<string | null>(null);

  useEffect(() => {
    const nextSetup = storage.getSetup();
    setSetup(nextSetup);
    setPlan(storage.getPlan());

    const nextSession = storage.getSession();
    if (nextSession) {
      setSession(nextSession);
      setPhase(nextSession.phase);
      setTimeLeft(nextSession.remaining);
    }

    const interval = window.setInterval(() => {
      const latest = storage.getSession();
      if (!latest) return;
      setSession(latest);
      setPhase(latest.phase);
      setTimeLeft(Math.max(latest.remaining, 0));
    }, 1000);

    const handleSetupUpdate = (event: Event) => {
      const detail = (event as CustomEvent<WorkoutSetup>).detail ?? storage.getSetup();
      if (detail) setSetup(detail);
    };

    const unsubscribePlan = storage.subscribe(STORAGE_KEYS.plan, (value: WorkoutPlan | null) => {
      if (value) setPlan(value);
    });

    window.addEventListener("workoutSetupUpdated", handleSetupUpdate);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("workoutSetupUpdated", handleSetupUpdate);
      unsubscribePlan?.();
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const buildQr = async () => {
      try {
        const origin = window.location.origin;
        const startUrl = `${origin}/tv/workout/start`;
        const dataUrl = await QRCode.toDataURL(startUrl, {
          width: 220,
          margin: 1,
          color: {
            dark: "#00BFFF",
            light: "#00000000",
          },
        });
        setQrSrc(dataUrl);
      } catch (error) {
        console.error("Failed to generate QR code", error);
      }
    };
    buildQr();
  }, []);

  const stations = plan?.exercises ?? [];
  const currentIndex = useMemo(() => {
    if (!stations.length) return -1;
    if (!session?.stationId) return 0;
    return stations.findIndex((exercise) => exercise.stationId === session.stationId);
  }, [stations, session]);

  const currentExercise = useMemo(() => {
    if (!stations.length) return null;
    if (currentIndex >= 0) return stations[currentIndex] ?? null;
    return stations[0] ?? null;
  }, [stations, currentIndex]);

  const nextExercise = useMemo(() => {
    if (!stations.length) return null;
    if (currentIndex === -1) return stations.length > 1 ? stations[1] : null;
    const nextIndex = currentIndex + 1;
    if (nextIndex < stations.length) return stations[nextIndex];
    return null;
  }, [stations, currentIndex]);

  const brandColors = useMemo(() => {
    if (!setup) return getDefaultBrandColors(undefined);
    if (setup.colors) return setup.colors;
    return getDefaultBrandColors(setup.theme);
  }, [setup]);

  const currentMedia = currentExercise ? getMediaForExercise(currentExercise.name) : null;
  const nextMedia = nextExercise ? getMediaForExercise(nextExercise.name) : null;
  const currentVideo = currentMedia?.video ?? FALLBACK_VIDEO;
  const nextVideo = nextMedia?.video ?? currentVideo ?? FALLBACK_VIDEO;

  const facilityName = setup?.facilityName ?? "Hotel Fitness Workout";
  const workoutGoal = plan?.goal ?? "Full Body Training";

  const instructions = currentExercise ? getExerciseInstructions(currentExercise.name) ?? [] : [];
  const displayInstructions = instructions.length
    ? instructions.slice(0, 3)
    : [
        "Stay controlled through the entire range of motion.",
        "Keep breathing steady and focus on posture.",
        "Move with purpose and prepare for the next station.",
      ];

  const totalRounds = setup?.rounds ?? 1;
  const currentRound = session?.round ?? 1;

  const phaseColors: Record<Phase, string> = {
    prep: brandColors.primary,
    work: brandColors.secondary,
    rest: brandColors.accent,
    complete: "#FFD100",
  };

  const phaseLabel: Record<Phase, string> = {
    prep: "Get Ready",
    work: "Work",
    rest: "Rest",
    complete: "Complete",
  };

  const activePhaseColor = phaseColors[phase] ?? brandColors.primary;
  const digitsDisplay = formatTime(timeLeft);

  const activePhaseDuration = phase === "work"
    ? setup?.workTime ?? 1
    : phase === "rest"
      ? setup?.restTime ?? 1
      : setup?.workTime ?? 1;

  const phaseProgress = activePhaseDuration ? Math.max(0, Math.min(1, timeLeft / activePhaseDuration)) : 0;

  const nextPhase: SessionPhase | null = useMemo(() => {
    if (!session) return null;
    if (session.phase === "prep") return "work";
    if (session.phase === "work") return stations.length ? "rest" : null;
    if (session.phase === "rest") {
      if (!stations.length) return null;
      if (currentIndex === stations.length - 1 && currentRound >= totalRounds) {
        return "complete";
      }
      return "work";
    }
    return null;
  }, [session, stations.length, currentIndex, currentRound, totalRounds]);

  const nextPhaseLabel = nextPhase ? phaseLabel[nextPhase]?.toUpperCase() : null;

  const upcomingExerciseName = nextExercise?.name ?? "Next station coming soon";

  return (
    <main className="body-font relative flex min-h-screen flex-col bg-gradient-to-br from-[#05060A] to-[#0C1420] text-white">
      <header className="absolute left-0 right-0 top-0 z-10 flex flex-col items-center gap-3 px-8 py-8 text-center">
        {setup?.logo ? (
          <img
            src={setup.logo}
            alt={facilityName}
            className="mx-auto h-14 w-auto drop-shadow-[0_0_20px_rgba(0,175,255,0.35)]"
          />
        ) : null}
        <h1
          className="heading-font text-2xl font-bold uppercase tracking-[0.2em]"
          style={{ color: brandColors.primary }}
        >
          {facilityName}
        </h1>
        <h2 className="heading-font text-lg uppercase tracking-[0.15em]" style={{ color: brandColors.accent }}>
          {workoutGoal}
        </h2>
      </header>

      <div className="flex h-screen w-full gap-8 px-8 pb-10 pt-36">
        <section className="flex flex-[0_0_58%] flex-col pr-6 min-w-0">
          <div
            className="relative w-full overflow-hidden rounded-3xl border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.45)]"
            style={{ aspectRatio: "16 / 9", maxHeight: "72vh" }}
          >
            <video
              key={currentVideo}
              src={currentVideo}
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 flex flex-col gap-2 px-8 pb-8">
              <h3 className="heading-font text-3xl font-semibold uppercase tracking-[0.2em]">
                {currentExercise?.name ?? "Select an Exercise"}
              </h3>
              <p className="text-base uppercase tracking-[0.2em]" style={{ color: brandColors.primary }}>
                Equipment:{" "}
                {setup?.stations.find((station) => station.id === currentExercise?.stationId)?.equipment ??
                  currentMedia?.equipment ??
                  "Configured in Builder"}
              </p>
            </div>
          </div>
        </section>

        <section className="flex w-[30%] flex-col items-center justify-center px-6">
          <div className="relative w-full max-w-[420px]">
            <svg className="h-full w-full -rotate-90">
              <circle cx="50%" cy="50%" r="48%" fill="none" stroke={`${activePhaseColor}22`} strokeWidth="2" />
              <circle
                cx="50%"
                cy="50%"
                r="48%"
                fill="none"
                stroke={activePhaseColor}
                strokeWidth="2"
                strokeDasharray={`${phaseProgress * 100} 100`}
                className="transition-all duration-1000"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div
                className="heading-font text-4xl uppercase tracking-[0.35em]"
                style={{ color: activePhaseColor }}
              >
                {phaseLabel[phase]?.toUpperCase()}
              </div>
              <div
                className="numeric-font text-[180px] font-black leading-none"
                style={{
                  color: activePhaseColor,
                  textShadow: `0 0 30px ${activePhaseColor}40`,
                }}
              >
                {digitsDisplay}
              </div>
              <div className="heading-font mt-4 text-xs uppercase tracking-[0.3em]" style={{ color: brandColors.accent }}>
                {nextPhaseLabel ? `Next: ${nextPhaseLabel}` : ""}
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <div className="heading-font text-sm uppercase tracking-[0.4em]" style={{ color: brandColors.accent }}>
              Up Next
            </div>
            <div className="heading-font mt-2 text-2xl font-semibold">{upcomingExerciseName}</div>
            <div className="mt-4 text-xs uppercase tracking-[0.3em]" style={{ color: brandColors.primary }}>
              Round {currentRound} / {totalRounds}
            </div>
          </div>
        </section>

        <aside className="flex w-[25%] flex-col gap-6">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="heading-font text-sm uppercase tracking-[0.35em]" style={{ color: brandColors.accent }}>
              Up Next
            </div>
            <div className="mt-4 overflow-hidden rounded-2xl border border-white/10" style={{ aspectRatio: "16 / 9" }}>
              <video
                key={nextVideo}
                src={nextVideo}
                autoPlay
                loop
                muted
                playsInline
                className="h-full w-full object-cover"
              />
            </div>
            <div className="heading-font mt-3 text-lg font-semibold uppercase tracking-[0.2em]">
              {upcomingExerciseName}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/60 p-6">
            <div className="heading-font text-sm uppercase tracking-[0.35em]" style={{ color: brandColors.primary }}>
              Form Guide
            </div>
            <ul className="mt-4 space-y-4 text-sm text-white/85">
              {displayInstructions.map((tip) => (
                <li key={tip} className="border-l-2 border-white/10 pl-3 text-left">
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/60 p-6 text-center">
            <div className="heading-font text-sm uppercase tracking-[0.35em]" style={{ color: brandColors.accent }}>
              Interval Blueprint
            </div>
            <div className="mt-4 text-sm text-white/80">
              Work {setup?.workTime ?? 45}s · Rest {setup?.restTime ?? 15}s
            </div>
            <div className="mt-3 text-xs uppercase tracking-[0.3em]" style={{ color: brandColors.primary }}>
              Station {session?.stationId ?? currentExercise?.stationId ?? 1}
            </div>
          </div>

          {qrSrc && (
            <div className="rounded-3xl border border-white/10 bg-black/60 p-6 text-center">
              <div className="heading-font text-sm uppercase tracking-[0.35em]" style={{ color: brandColors.secondary }}>
                Scan To Start
              </div>
              <img
                src={qrSrc}
                alt="Scan to open remote start"
                className="mx-auto mt-4 h-40 w-40 rounded-2xl bg-black/30 p-3"
              />
              <p className="mt-3 text-xs uppercase tracking-[0.2em] text-white/70">
                Open on your phone to trigger the workout
              </p>
            </div>
          )}
        </aside>
      </div>

      <footer className="body-font absolute bottom-0 left-0 right-0 bg-black/50 px-6 py-4 text-sm uppercase tracking-[0.3em]" style={{ color: brandColors.accent }}>
        Powered by your customized workout builder — update fonts & colors in Setup.
      </footer>
    </main>
  );
}
