import { Monitor, Users, Zap, Palette } from "lucide-react";
import { nexusAssets } from "@/hotel-nexus/lib/assets";

const features = [
  {
    icon: Monitor,
    title: "AI Personalization",
    description: "Adapts workouts to each guest's energy and goals automatically",
  },
  {
    icon: Users,
    title: "Cloud Infrastructure",
    description: "Secure, cloud-native backend powering live data analytics",
  },
  {
    icon: Zap,
    title: "Wearable API Integration",
    description: "Syncs with Apple Health, Fitbit, Garmin seamlessly",
  },
  {
    icon: Palette,
    title: "Automated Updates",
    description: "New content and challenges appear automatically across rooms",
  },
  {
    icon: Monitor,
    title: "White-Label Flexibility",
    description: "Rebrand easily for each hotel's style and tone",
  },
];

const TechShowcase = () => {
  return (
    <section className="py-32 px-6 bg-gradient-to-b from-[hsl(220,15%,95%)] to-white">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center mb-20 animate-fade-in">
          <p className="text-primary text-xs font-semibold uppercase tracking-[0.2em] mb-4">
            POWERED BY PRECISION TECHNOLOGY
          </p>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-foreground uppercase tracking-tight">
            Powered by Precision Technology
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-6">
            Built with modern cloud architecture to ensure secure, scalable performance across hotels worldwide.
          </p>
          <p className="text-2xl font-semibold text-primary max-w-2xl mx-auto">
            Integrating Data, Design, and Guest Experience
          </p>
        </div>

        {/* Key Pillars Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 mb-20 animate-fade-in">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="text-center group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/60 mb-4 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/30">
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-3 text-foreground">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* ... keep existing code (Interface Screenshots Grid and Bottom CTA) */}

        <div className="space-y-16">
          {/* Warrior Stations Interface */}
          <div className="animate-fade-in">
            <div className="mb-6">
              <h3 className="text-2xl md:text-3xl font-bold mb-3 text-foreground">
                Circuit Training Station Management
              </h3>
              <p className="text-muted-foreground max-w-3xl">
                Run high-intensity circuit workouts with multiple stations synchronized across your gym. 
                Guests see current phase, time remaining, and which station to move to next—all managed from one central system.
              </p>
            </div>
            <img
              src={nexusAssets.warriorStations}
              alt="Multi-station circuit training interface showing current phase, time remaining, and active gym stations"
              className="w-full rounded-lg shadow-2xl border border-border"
            />
          </div>

          {/* Heart Rate Monitoring */}
          <div className="animate-fade-in">
            <div className="mb-6">
              <h3 className="text-2xl md:text-3xl font-bold mb-3 text-foreground">
                Real-Time Heart Rate & Performance Tracking
              </h3>
              <p className="text-muted-foreground max-w-3xl">
                Display live participant data on screens throughout your facility. Each guest sees their heart rate zone, 
                calories burned, and intensity level—creating competitive energy and accountability.
              </p>
            </div>
            <img
              src={nexusAssets.heartRateMonitoring}
              alt="Live heart rate monitoring dashboard showing multiple participants with individual zones, calories, and intensity metrics"
              className="w-full rounded-lg shadow-2xl border border-border"
            />
          </div>

          {/* Two Column Layout for Station Detail & Setup Console */}
          <div className="grid lg:grid-cols-2 gap-12 animate-fade-in">
            <div>
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-3 text-foreground">
                  Video-Guided Station Experience
                </h3>
                <p className="text-muted-foreground">
                  Each iPad or TV displays professional workout videos with exercise names, 
                  instructions, and real-time countdowns. Guests know exactly what to do at every station.
                </p>
              </div>
              <img
                src={nexusAssets.stationDetail}
                alt="Individual workout station interface showing exercise video, countdown timer, and form instructions"
                className="w-full rounded-lg shadow-2xl border border-border"
              />
            </div>

            <div>
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-3 text-foreground">
                  Custom Setup Console
                </h3>
                <p className="text-muted-foreground">
                  Hotel staff configure everything through our intuitive setup console—number of stations, 
                  branding colors, themes, fonts, and equipment types. Make it yours in minutes.
                </p>
              </div>
              <img
                src={nexusAssets.setupConsole}
                alt="Hotel fitness setup console showing customization options for stations, branding, colors, and themes"
                className="w-full rounded-lg shadow-2xl border border-border"
              />
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center animate-fade-in">
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-12">
            <h3 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
              Your Brand. Your Space. Our Technology.
            </h3>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Every element is customized to your hotel—from colors and fonts to station configurations and equipment types. 
              No two installations look the same. Zero capital investment required.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechShowcase;
