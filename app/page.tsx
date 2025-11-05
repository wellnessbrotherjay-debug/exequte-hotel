"use client";

import { useEffect, useState } from "react";
import { storage, type WorkoutSetup, type StationSetup } from "@/lib/workout-engine/storage";

const DEFAULT_STATIONS: StationSetup[] = Array.from({ length: 6 }, (_, index) => ({
  id: index + 1,
  equipment: "bodyweight",
}));

const DEFAULT_SETUP: WorkoutSetup = {
  facilityName: "MGM Hotel Gym",
  stations: DEFAULT_STATIONS,
  logo: null,
  theme: "Gold",
  workTime: 45,
  restTime: 15,
  rounds: 1,
  colors: {
    primary: "#0A84FF",
    secondary: "#38D9A9",
    accent: "#FFB703",
  },
};

export default function HomePage() {
  const [setup, setSetup] = useState<WorkoutSetup | null>(null);

  useEffect(() => {
    const workoutSetup = storage.getSetup();
    setSetup(workoutSetup ?? DEFAULT_SETUP);
  }, []);

  if (!setup) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full mx-auto mb-4"></div>
          <div className="text-xl font-bold">Loading...</div>
        </div>
      </div>
    );
  }

  const features = [
    {
      title: "Gym TV Display",
      description: "Full lineup view for every gym station",
      href: "/display-tv",
    },
    {
      title: "Gym HRM Wall",
      description: "Real-time heart rate monitoring for the floor",
      href: "/hrm-tv",
    },
    {
      title: "Gym Timer Display",
      description: "Large-format timer for the workout stage",
      href: "/display-timer",
    },
    {
      title: "Tablet Station Display",
      description: "Trainer tablet control for each station",
      href: "/display-tablet/1",
    },
    {
      title: "Room Workout Screen",
      description: "In-room guided workout experience for guests",
      href: "/tv/workout",
    },
    {
      title: "Mobile Workout Screen",
      description: "User-controlled workout experience on mobile",
      href: "/mobile",
    },
    {
      title: "Workout Builder",
      description: "Create and assign exercises to stations",
      href: "/builder",
    },
    {
      title: "HRM Management",
      description: "Heart rate monitor control center",
      href: "/hrm-management",
    },
    {
      title: "QR Codes",
      description: "Generate workout access QR codes",
      href: "/qr-codes",
    },
    {
      title: "Setup Console",
      description: "Configure stations, equipment, and branding",
      href: "/setup",
    },
  ];

  return (
    <div
      className="body-font min-h-screen text-white"
      style={{
        background:
          "radial-gradient(1200px 800px at 50% 20%, rgba(0,175,255,0.12), transparent), linear-gradient(180deg,#05060a,#0b1420)",
      }}
    >
      <header className="border-b border-white/10 px-6 py-12 text-center">
        <div className="mx-auto max-w-3xl space-y-4">
          <h1 className="heading-font text-4xl font-semibold text-slate-300">
            {setup.facilityName || "Hotel Fitness Solutions"}
          </h1>
          <p className="text-sm uppercase tracking-[0.4em] text-sky-400/70">
            Complete Workout Management System
          </p>
          <p className="text-base text-slate-400">
            Professional fitness platform with synchronized displays, mobile control, and real-time monitoring.
          </p>
        </div>
      </header>

      <main className="px-6 py-12">
        <div className="mx-auto flex max-w-6xl flex-col gap-12">
          <section className="space-y-6">
            <div className="text-center">
              <h2 className="heading-font text-3xl uppercase tracking-[0.35em] text-slate-300">
                System Features
              </h2>
              <p className="mt-3 text-sm text-slate-400">
                Launch any display or control surface directly from your dashboard.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5">
              {features.map((feature) => (
                <a
                  key={feature.href}
                  href={feature.href}
                  className="group rounded-2xl border border-white/10 bg-black/35 p-6 text-left shadow-[0_0_24px_rgba(0,175,255,0.15)] transition hover:border-sky-400/40 hover:shadow-[0_0_32px_rgba(0,175,255,0.25)]"
                >
                  <div className="heading-font text-xs uppercase tracking-[0.35em] text-sky-300 group-hover:text-sky-200">
                    {feature.title}
                  </div>
                  <p className="mt-4 text-sm text-slate-300">{feature.description}</p>
                </a>
              ))}
            </div>
          </section>

          <section className="grid grid-cols-2 gap-4 rounded-2xl border border-white/10 bg-black/30 p-6 text-center shadow-[0_0_30px_rgba(0,175,255,0.15)] md:grid-cols-4">
            <div>
              <div className="heading-font text-3xl font-semibold text-sky-200">
                {setup.stations?.length || 0}
              </div>
              <div className="text-xs uppercase tracking-[0.35em] text-slate-400">Stations</div>
            </div>
            <div>
              <div className="heading-font text-3xl font-semibold text-sky-200">
                {setup.rounds}
              </div>
              <div className="text-xs uppercase tracking-[0.35em] text-slate-400">Rounds</div>
            </div>
            <div>
              <div className="heading-font text-3xl font-semibold text-sky-200">
                {setup.workTime}s
              </div>
              <div className="text-xs uppercase tracking-[0.35em] text-slate-400">Work Time</div>
            </div>
            <div>
              <div className="heading-font text-3xl font-semibold text-sky-200">
                {setup.restTime}s
              </div>
              <div className="text-xs uppercase tracking-[0.35em] text-slate-400">Rest Time</div>
            </div>
          </section>
        </div>
      </main>

      <footer className="border-t border-white/10 px-6 py-8 text-center text-xs uppercase tracking-[0.3em] text-slate-500">
        Unified displays • Real-time synchronization • Mobile & TV experiences
      </footer>
    </div>
  );
}
