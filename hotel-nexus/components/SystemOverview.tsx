import { Monitor, Smartphone, Brain, BarChart3 } from "lucide-react";
import { nexusAssets } from "@/hotel-nexus/lib/assets";

const modules = [
  {
    icon: Monitor,
    title: "In-Room Fitness",
    description: "Guests scan a QR or access through TV. The system recommends personalized workouts based on guest profile, time of day, and available equipment. Each session blends AI guidance, music, and lighting for a fully immersive experience.",
  },
  {
    icon: Smartphone,
    title: "Smart Gym Integration",
    description: "Our system seamlessly connects to your existing equipment and wearables, syncing HR and performance metrics to deliver real-time coaching feedback and progress tracking.",
  },
  {
    icon: Brain,
    title: "Wellness Content Library",
    description: "A curated catalog of yoga, strength, HIIT, and recovery programs designed by elite coaches. Updated monthly with global trends and seasonal themes.",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Live data for management: view usage, engagement trends, and wellness ROI. Understand what guests love most and how it drives satisfaction.",
  },
];

const SystemOverview = () => {
  return (
    <section id="system" className="py-32 px-6 bg-gradient-to-b from-white to-[hsl(220,20%,98%)]">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div className="relative h-[600px] rounded-lg overflow-hidden animate-fade-in shadow-[0_0_40px_rgba(66,133,244,0.3)]">
            <img
              src={nexusAssets.tvWorkout}
              alt="Hotel Fit Solutions System on Hotel TV"
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>

          {/* Content */}
          <div className="animate-fade-in">
            <p className="text-primary text-xs font-semibold uppercase tracking-[0.2em] mb-4">
              THE HOTEL FIT ECOSYSTEM
            </p>
            <h2 className="text-4xl md:text-6xl font-bold mb-8 text-foreground uppercase tracking-tight">
              THE HOTEL FIT ECOSYSTEM
            </h2>
            
            <div className="space-y-8">
              {modules.map((module) => (
                <div key={module.title} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <module.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-foreground">
                      {module.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {module.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SystemOverview;
