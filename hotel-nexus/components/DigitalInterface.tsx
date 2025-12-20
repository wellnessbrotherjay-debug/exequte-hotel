import { Monitor, Video, Smartphone, Plug, Dumbbell, Tv } from "lucide-react";
import { nexusAssets } from "@/hotel-nexus/lib/assets";

const features = [
  {
    icon: Monitor,
    title: "In-Room Workout Display",
    description: "Branded workout interfaces displayed seamlessly on hotel room TVs—guests follow professional trainers without leaving their room.",
  },
  {
    icon: Dumbbell,
    title: "Smart Gym Stations with iPad Displays",
    description: "Custom workout stations in your gym equipped with iPad displays showing guided video workouts. Each station is tailored to your space and equipment—no two setups are identical.",
  },
  {
    icon: Video,
    title: "Professional Video Library",
    description: "High-quality guided workout content with professional trainers. From strength training to cardio—full video libraries synced across all devices and stations.",
  },
  {
    icon: Plug,
    title: "Zero Investment Required",
    description: "Our plug-and-play technology integrates seamlessly with your existing hotel systems. No capital expenditure—just instant transformation of your fitness offering.",
  },
  {
    icon: Tv,
    title: "Fully Customized to Your Space",
    description: "We design each installation around your property's unique layout, brand identity, and guest demographic. From boutique hotels to large resorts—every solution is bespoke.",
  },
  {
    icon: Smartphone,
    title: "Seamless System Integration",
    description: "Connects with your hotel management system, guest apps, and F&B ordering. Everything works together to create a unified wellness experience.",
  },
];

const DigitalInterface = () => {
  return (
    <section className="py-32 px-6 bg-gradient-to-b from-white to-secondary/20">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <p className="text-primary text-xs font-semibold uppercase tracking-wider mb-4">
            COMPLETE TECH SOLUTION
          </p>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            Full-Service Fitness Technology
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            We provide end-to-end fitness technology for both in-room workouts and gym spaces. From smart workout 
            stations with iPad displays to TV-based room training—every element is customized to your property. 
            Best of all: zero capital investment required. Our plug-and-play system integrates with your existing 
            infrastructure and transforms your fitness offering overnight.
          </p>
        </div>

        {/* Device Mockup */}
        <div className="mb-20 animate-fade-in flex justify-center">
          <img
            src={nexusAssets.deviceMockup}
            alt="Workout interface displayed across laptop, tablet, and mobile devices"
            className="w-full max-w-7xl rounded-lg shadow-[0_0_40px_rgba(66,133,244,0.3)]"
          />
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 animate-fade-in">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="text-center"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                <feature.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-foreground">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DigitalInterface;
