import { Link } from "react-router-dom";
import { Activity, Anchor, ArrowRight, Brain, CheckCircle2, Clock, Dumbbell, Target, TrendingUp, Users, UtensilsCrossed } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const featureCards = [
  {
    title: "Body Intelligence",
    description: "Guided strength, mobility, and recovery sessions tailored for race days.",
    icon: Activity,
    href: "/body",
    cta: "Dial in your sessions",
  },
  {
    title: "Boat Mastery",
    description: "Sharpen boat handling with micro-drills, tuning tips, and setup checklists.",
    icon: Anchor,
    href: "/boat",
    cta: "Refine your setup",
  },
  {
    title: "Mindset Training",
    description: "Reset focus with breathing, visualization, and race debrief frameworks.",
    icon: Brain,
    href: "/mindset",
    cta: "Rewire your thinking",
  },
  {
    title: "Crew Community",
    description: "Share progress, swap debriefs, and learn from sailors pushing the line.",
    icon: Users,
    href: "/community",
    cta: "Meet the crew",
  },
];

const programPhases = [
  {
    range: "Days 1-3",
    title: "Prime the Fundamentals",
    description: "Reset your baseline with powerhouse mobility, fueling cues, and focus drills.",
    icon: Dumbbell,
  },
  {
    range: "Days 4-6",
    title: "Build Race Rhythm",
    description: "Boat handling scenarios, cadence workouts, and tactical checklists keep you sharp.",
    icon: Anchor,
  },
  {
    range: "Days 7-9",
    title: "Sharpen & Launch",
    description: "Mindset rehearsals, on-water strategy, and your personal performance plan.",
    icon: Brain,
  },
];

const benefitList = [
  "Daily missions blend body, boat, and mind in under 45 minutes.",
  "Dashboards track nutrition, workouts, and readiness at a glance.",
  "Private community shares video debriefs, drills, and support.",
  "Upgrade path unlocks personalized coaching and accountability.",
];

const Home = () => {
  return (
    <div className="space-y-16 pb-20 md:space-y-24">
      <section className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-secondary/60 via-background to-background p-8 shadow-[0_0_60px_rgba(64,224,208,0.15)] md:p-12">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-24 right-0 h-64 w-64 rounded-full bg-primary/15 blur-3xl" />
          <div className="absolute bottom-0 left-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(64,224,208,0.2),transparent)]" />
        </div>

        <div className="grid items-center gap-10 md:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <Badge className="w-fit bg-primary/20 text-primary hover:bg-primary/20">RaceFit Beta • Day 0</Badge>
            <h1 className="text-3xl font-semibold leading-tight text-foreground md:text-5xl">
              The 9-day training lab for high-performing sailors.
            </h1>
            <p className="max-w-2xl text-lg text-muted-foreground md:text-xl">
              RaceFit blends body conditioning, boat handling, nutrition, and mindset coaching into a single daily
              playbook. Build race-day confidence faster with guided missions, live dashboards, and an engaged crew.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Button size="lg" asChild className="h-12 px-8 text-base">
                <Link to="/auth">Start the free program</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="h-12 border-primary/40 px-8 text-base text-primary hover:bg-primary/10"
              >
                <Link to="/community">Preview the community</Link>
              </Button>
            </div>

            <div className="grid gap-6 pt-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-border/50 bg-background/80 p-4 shadow-[0_10px_40px_rgba(64,224,208,0.12)]">
                <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">Program</p>
                <p className="text-2xl font-semibold text-foreground">9 missions</p>
                <p className="text-sm text-muted-foreground">Body, boat, mindset focus daily.</p>
              </div>
              <div className="rounded-2xl border border-border/50 bg-background/80 p-4 shadow-[0_10px_40px_rgba(64,224,208,0.12)]">
                <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">Time</p>
                <p className="text-2xl font-semibold text-foreground">45 min avg</p>
                <p className="text-sm text-muted-foreground">Built for busy training windows.</p>
              </div>
              <div className="rounded-2xl border border-border/50 bg-background/80 p-4 shadow-[0_10px_40px_rgba(64,224,208,0.12)]">
                <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">Crew</p>
                <p className="text-2xl font-semibold text-foreground">Live feedback</p>
                <p className="text-sm text-muted-foreground">Coaches and sailors in one hub.</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 -z-10 rounded-[32px] border border-primary/30 bg-primary/10 blur-2xl" />
            <div className="rounded-[28px] border border-border/60 bg-secondary/50 p-6 backdrop-blur shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Daily scorecard</p>
                  <p className="text-lg font-semibold text-foreground">Day 4 • Upwind Power</p>
                </div>
                <Badge className="bg-background/80 text-foreground">In progress</Badge>
              </div>

              <div className="mt-6 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Mission completion</span>
                    <span>72%</span>
                  </div>
                  <Progress value={72} className="h-2 bg-muted" />
                </div>

                <Card className="border border-border/50 bg-background/80">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Body readiness</CardTitle>
                    <Activity className="h-4 w-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-semibold">82%</p>
                    <p className="text-xs text-muted-foreground">Mobility unlock + tempo workout complete.</p>
                  </CardContent>
                </Card>

                <Card className="border border-border/50 bg-background/80">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Nutrition tracker</CardTitle>
                    <UtensilsCrossed className="h-4 w-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-semibold">On target</p>
                    <p className="text-xs text-muted-foreground">Hydration: 78% • Fuel plan locked for AM.</p>
                  </CardContent>
                </Card>

                <Card className="border border-border/50 bg-background/80">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Mindset focus</CardTitle>
                    <Target className="h-4 w-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-semibold">Calm • Ready</p>
                    <p className="text-xs text-muted-foreground">Visualization debrief logged at 06:30.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="text-2xl font-semibold text-foreground md:text-3xl">What you unlock inside RaceFit</h2>
            <p className="max-w-3xl text-base text-muted-foreground">
              Focus on the area holding you back or run the complete 9-day mission plan. Every track is backed with
              checklists, dashboards, and accountability.
            </p>
          </div>
          <Button variant="ghost" asChild className="w-fit px-0 text-primary hover:text-primary">
            <Link to="/dashboard" className="flex items-center gap-2">
              View the dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {featureCards.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} className="group h-full border border-border/60 bg-secondary/40 backdrop-blur transition hover:border-primary/60 hover:shadow-[0_20px_60px_rgba(64,224,208,0.15)]">
                <CardHeader className="space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary transition group-hover:scale-110">
                    <Icon className="h-6 w-6" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" asChild className="px-0 text-primary">
                    <Link to={feature.href} className="flex items-center gap-2">
                      {feature.cta}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="grid gap-8 rounded-3xl border border-border/60 bg-secondary/40 p-8 md:grid-cols-[0.65fr_0.35fr] md:gap-12 md:p-12">
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground md:text-3xl">How the 9-day sprint runs</h2>
          <p className="text-base text-muted-foreground md:text-lg">
            Each mission stacks onto the last so you leave with a repeatable race plan. Choose self-paced or add
            coaching support when you&apos;re ready for more.
          </p>

          <div className="space-y-4">
            {programPhases.map((phase) => {
              const Icon = phase.icon;
              return (
                <Card key={phase.title} className="border border-border/50 bg-background/70">
                  <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                    <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <CardTitle className="text-base font-semibold text-foreground">{phase.title}</CardTitle>
                      <p className="text-xs uppercase tracking-wide text-primary">{phase.range}</p>
                      <CardDescription className="text-sm text-muted-foreground">{phase.description}</CardDescription>
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col justify-between gap-6 rounded-2xl border border-border/60 bg-background/70 p-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Coaches are watching for:</h3>
            <ul className="mt-4 space-y-3">
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                Body readiness scores trending up over the sprint.
              </li>
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                Boat setup logs and race notes shared with your crew.
              </li>
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                Mindset reflections that move from reactive to proactive.
              </li>
            </ul>
          </div>

          <div className="rounded-xl border border-primary/30 bg-primary/10 p-4">
            <p className="text-sm font-medium text-primary">New!</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Add-on telemetry sync pulls workout history and nutrition data automatically.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-8 md:grid-cols-[0.45fr_0.55fr] md:gap-12">
        <div className="rounded-3xl border border-border/60 bg-secondary/50 p-8">
          <div className="flex items-center gap-3 text-xs uppercase tracking-wide text-primary">
            <Clock className="h-4 w-4" />
            Real sailors, real results
          </div>
          <h2 className="mt-4 text-2xl font-semibold text-foreground md:text-3xl">
            &ldquo;In nine days I went from scattershot sessions to a repeatable race morning routine.&rdquo;
          </h2>
          <p className="mt-4 text-sm text-muted-foreground">
            — Jess, Laser Radial skipper
          </p>
          <div className="mt-6 grid gap-4">
            <div className="flex items-center justify-between rounded-xl border border-border/40 bg-background/70 p-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Body readiness</p>
                <p className="text-lg font-semibold text-foreground">+18%</p>
              </div>
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div className="flex items-center justify-between rounded-xl border border-border/40 bg-background/70 p-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Mindset confidence</p>
                <p className="text-lg font-semibold text-foreground">+3.2 pts</p>
              </div>
              <Target className="h-5 w-5 text-primary" />
            </div>
            <div className="flex items-center justify-between rounded-xl border border-border/40 bg-background/70 p-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Nutrition compliance</p>
                <p className="text-lg font-semibold text-foreground">94%</p>
              </div>
              <UtensilsCrossed className="h-5 w-5 text-primary" />
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-border/60 bg-secondary/40 p-8">
          <h2 className="text-2xl font-semibold text-foreground md:text-3xl">Built for the way sailors train</h2>
          <p className="mt-4 text-base text-muted-foreground">
            RaceFit keeps the signal high and the noise low so you can focus on execution.
          </p>
          <ul className="mt-6 space-y-4">
            {benefitList.map((benefit) => (
              <li key={benefit} className="flex items-start gap-3 text-sm text-muted-foreground">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                {benefit}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="relative overflow-hidden rounded-3xl border border-primary/40 bg-gradient-to-br from-primary/15 via-background to-background p-10 text-center shadow-[0_0_50px_rgba(64,224,208,0.15)]">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-primary/20 to-transparent" />
        </div>
        <Badge className="mx-auto bg-background/70 text-primary">Ready to race?</Badge>
        <h2 className="mt-6 text-3xl font-semibold text-foreground md:text-4xl">Launch your 9-day sprint today.</h2>
        <p className="mt-4 text-base text-muted-foreground md:text-lg">
          Set your baseline, sharpen your systems, and show up on the start line locked in.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button size="lg" asChild className="h-12 px-10 text-base">
            <Link to="/auth">Claim your spot</Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="h-12 border-primary/40 px-10 text-base text-primary hover:bg-primary/10">
            <Link to="/upgrade">See premium options</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;
