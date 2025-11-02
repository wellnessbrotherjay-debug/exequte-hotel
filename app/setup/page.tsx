"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  EQUIPMENT_OPTIONS,
  type EquipmentOption,
} from "@/lib/workout-engine/constants";
import {
  buildStationList,
  getDefaultBrandColors,
  storage,
  type StationSetup,
  type WorkoutSetup,
} from "@/lib/workout-engine/storage";

const THEMES = ["gold", "neon", "luxury-dark"] as const;
const WORK_TIMES = [30, 40, 45, 60];
const REST_TIMES = [10, 15, 20, 30];
const ROUNDS = [1, 2, 3, 4];

const MIN_STATIONS = 1;
const MAX_STATIONS = 12;

export default function SetupPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const previousSetup = useMemo(() => storage.getSetup(), []);
  const themeRef = useRef<string>(previousSetup?.theme ?? "gold");
  const defaultPalette = useMemo(
    () => getDefaultBrandColors(previousSetup?.theme),
    [previousSetup?.theme]
  );

  const [stationCount, setStationCount] = useState<number>(
    previousSetup?.stations.length ?? 6
  );
  const [stations, setStations] = useState<StationSetup[]>(() =>
    buildStationList(previousSetup?.stations.length ?? 6, previousSetup?.stations)
  );
  const [logoData, setLogoData] = useState<string | null>(previousSetup?.logo ?? null);
  const [theme, setTheme] = useState<string>(previousSetup?.theme ?? "gold");
  const [workTime, setWorkTime] = useState<number>(previousSetup?.workTime ?? 45);
  const [restTime, setRestTime] = useState<number>(previousSetup?.restTime ?? 20);
  const [rounds, setRounds] = useState<number>(previousSetup?.rounds ?? 1);
  const [facilityName, setFacilityName] = useState<string>(
    previousSetup?.facilityName ?? "RaceFit Warrior Series"
  );
  const [quote, setQuote] = useState<string>(
    previousSetup?.quote ??
      "Strength grows in the moments when you think you can't go on but you keep going anyway."
  );
  const [primaryColor, setPrimaryColor] = useState<string>(
    previousSetup?.colors?.primary ?? defaultPalette.primary
  );
  const [secondaryColor, setSecondaryColor] = useState<string>(
    previousSetup?.colors?.secondary ?? defaultPalette.secondary
  );
  const [accentColor, setAccentColor] = useState<string>(
    previousSetup?.colors?.accent ?? defaultPalette.accent
  );

  useEffect(() => {
    if (themeRef.current !== theme) {
      const palette = getDefaultBrandColors(theme);
      setPrimaryColor(palette.primary);
      setSecondaryColor(palette.secondary);
      setAccentColor(palette.accent);
      themeRef.current = theme;
    }
  }, [theme]);

  const handleStationCountChange = (value: number) => {
    const clamped = Math.min(Math.max(value, MIN_STATIONS), MAX_STATIONS);
    setStationCount(clamped);
    setStations((prev) => buildStationList(clamped, prev));
  };

  const handleEquipmentChange = (id: number, equipment: EquipmentOption) => {
    setStations((prev) =>
      prev.map((station) =>
        station.id === id
          ? {
              ...station,
              equipment,
            }
          : station
      )
    );
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const base64 = loadEvent.target?.result;
      if (typeof base64 === "string") {
        setLogoData(base64);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload: WorkoutSetup = {
      stations,
      logo: logoData,
      theme,
      workTime,
      restTime,
      rounds,
      facilityName: facilityName.trim(),
      quote: quote.trim(),
      colors: {
        primary: primaryColor,
        secondary: secondaryColor,
        accent: accentColor,
      },
    };

    storage.saveSetup(payload);
    storage.clearSession();
    router.push("/builder");
  };

  const themeLabel = (value: string) =>
    value.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-12 text-neutral-100">
      <form
        onSubmit={handleSubmit}
        className="mx-auto flex w-full max-w-5xl flex-col gap-10 rounded-3xl border border-[#F4D03F]/40 bg-neutral-900/70 p-10 shadow-[0_0_60px_rgba(244,208,63,0.25)]"
      >
        <header className="space-y-3 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-[#00BFFF]">MGM Hotel Gym</p>
          <h1 className="text-4xl font-bold text-[#F4D03F]">Setup Workout Flow</h1>
          <p className="text-sm text-neutral-400">
            Configure stations and equipment before building your workout.
          </p>
        </header>

        <section className="grid gap-6 lg:grid-cols-2">
          <label className="flex flex-col gap-2 lg:col-span-2">
            <span className="text-xs uppercase tracking-[0.3em] text-[#F4D03F]">Facility Name</span>
            <input
              className="rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3 text-sm focus:border-[#F4D03F] focus:outline-none"
              value={facilityName}
              onChange={(event) => setFacilityName(event.target.value)}
              placeholder="e.g. MGM Sky Fitness"
              required
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-[0.3em] text-[#F4D03F]">
              Number of Stations
            </span>
            <select
              className="rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3 text-sm focus:border-[#F4D03F] focus:outline-none"
              value={stationCount}
              onChange={(event) => handleStationCountChange(Number(event.target.value))}
            >
              {Array.from({ length: MAX_STATIONS }, (_, index) => index + 1).map((count) => (
                <option key={count} value={count}>
                  {count}
                </option>
              ))}
            </select>
          </label>

          <div className="flex flex-col gap-3">
            <span className="text-xs uppercase tracking-[0.3em] text-[#F4D03F]">Branding</span>
            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-lg border border-[#F4D03F]/60 bg-[#F4D03F]/10 px-4 py-2 text-sm font-semibold text-[#F4D03F] transition hover:bg-[#F4D03F]/20"
              >
                Upload Logo
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleLogoUpload}
              />
              {logoData && (
                <Image
                  src={logoData}
                  alt="Gym logo preview"
                  width={64}
                  height={64}
                  className="h-16 w-16 rounded-lg border border-[#F4D03F]/40 object-contain"
                />
              )}
            </div>

            <label className="flex flex-col gap-2">
              <span className="text-xs uppercase tracking-[0.3em] text-[#F4D03F]">Theme</span>
              <select
                className="rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3 text-sm focus:border-[#F4D03F] focus:outline-none"
                value={theme}
                onChange={(event) => setTheme(event.target.value)}
              >
                {THEMES.map((option) => (
                  <option key={option} value={option}>
                    {themeLabel(option)}
                  </option>
                ))}
              </select>
            </label>

            <div className="grid gap-4 sm:grid-cols-3">
              <label className="flex flex-col gap-2">
                <span className="text-xs uppercase tracking-[0.3em] text-[#00BFFF]">Primary Color</span>
                <input
                  type="color"
                  className="h-12 w-full cursor-pointer rounded border border-neutral-700 bg-transparent"
                  value={primaryColor}
                  onChange={(event) => setPrimaryColor(event.target.value)}
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-xs uppercase tracking-[0.3em] text-[#00BFFF]">Secondary Color</span>
                <input
                  type="color"
                  className="h-12 w-full cursor-pointer rounded border border-neutral-700 bg-transparent"
                  value={secondaryColor}
                  onChange={(event) => setSecondaryColor(event.target.value)}
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-xs uppercase tracking-[0.3em] text-[#00BFFF]">Accent Color</span>
                <input
                  type="color"
                  className="h-12 w-full cursor-pointer rounded border border-neutral-700 bg-transparent"
                  value={accentColor}
                  onChange={(event) => setAccentColor(event.target.value)}
                />
              </label>
            </div>
          </div>
        </section>

        <section className="grid gap-6 rounded-2xl border border-neutral-800 bg-neutral-950/60 p-6 sm:grid-cols-2 lg:grid-cols-3">
          <label className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-[0.3em] text-[#00BFFF]">Work Time</span>
            <select
              className="rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm focus:border-[#F4D03F] focus:outline-none"
              value={workTime}
              onChange={(event) => setWorkTime(Number(event.target.value))}
            >
              {WORK_TIMES.map((value) => (
                <option key={value} value={value}>
                  {value} seconds
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-[0.3em] text-[#00BFFF]">Rest Time</span>
            <select
              className="rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm focus:border-[#F4D03F] focus:outline-none"
              value={restTime}
              onChange={(event) => setRestTime(Number(event.target.value))}
            >
              {REST_TIMES.map((value) => (
                <option key={value} value={value}>
                  {value} seconds
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-[0.3em] text-[#00BFFF]">Rounds</span>
            <select
              className="rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm focus:border-[#F4D03F] focus:outline-none"
              value={rounds}
              onChange={(event) => setRounds(Number(event.target.value))}
            >
              {ROUNDS.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
        </section>

        <section className="flex flex-col gap-2">
          <span className="text-xs uppercase tracking-[0.3em] text-[#F4D03F]">Quote of the Day</span>
          <textarea
            className="min-h-[120px] rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3 text-sm focus:border-[#F4D03F] focus:outline-none"
            value={quote}
            onChange={(event) => setQuote(event.target.value)}
            placeholder="Enter an inspirational quote to display on the workout screens."
          />
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stations.map((station) => (
            <div
              key={station.id}
              className="flex flex-col gap-3 rounded-2xl border border-[#F4D03F]/25 bg-neutral-950/70 p-5"
            >
              <span className="text-xs uppercase tracking-[0.3em] text-[#00BFFF]">
                Station {station.id}
              </span>
              <select
                className="rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm focus:border-[#F4D03F] focus:outline-none"
                value={station.equipment}
                onChange={(event) =>
                  handleEquipmentChange(station.id, event.target.value as EquipmentOption)
                }
              >
                {EQUIPMENT_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </section>

        <div className="flex justify-center">
          <button
            type="submit"
            className="rounded-lg bg-[#F4D03F] px-8 py-3 text-sm font-semibold text-neutral-950 shadow-[0_0_25px_rgba(244,208,63,0.35)] transition hover:bg-[#d1b230]"
          >
            Continue
          </button>
        </div>
      </form>
    </main>
  );
}
