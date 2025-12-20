import { Laptop, Tv, ChefHat, Dumbbell, TrendingUp, MessageCircle } from "lucide-react";
import { Button } from "@/hotel-nexus/components/ui/button";

const TheSuite = () => {
  const modules = [
    {
      icon: Laptop,
      title: "Admin CMS",
      description: "One dashboard for content, pricing, analytics, and staff control",
      gradient: "from-luxury-deep-blue to-primary",
    },
    {
      icon: Tv,
      title: "Smart TV App",
      description: "In-room workouts, digital menus, spa booking, wellness channel",
      gradient: "from-primary to-luxury-deep-blue",
    },
    {
      icon: ChefHat,
      title: "Kitchen Manager",
      description: "Live KDS orders, supplier management, food-cost analytics",
      gradient: "from-luxury-navy to-luxury-deep-blue",
    },
    {
      icon: Dumbbell,
      title: "Gym Display",
      description: "HRM tracking, live leaderboards, class management",
      gradient: "from-luxury-deep-blue to-luxury-navy",
    },
    {
      icon: TrendingUp,
      title: "Analytics Suite",
      description: "Hotel-wide wellness and financial performance in real time",
      gradient: "from-primary to-luxury-navy",
    },
    {
      icon: MessageCircle,
      title: "CRM & Guest Engagement",
      description: "Build profiles, track preferences, automate offers",
      gradient: "from-luxury-navy to-primary",
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-cormorant font-bold text-luxury-black mb-6">
            The Suite
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Six powerful modules working together to create the ultimate hotel wellness experience
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {modules.map((module, index) => {
            const Icon = module.icon;
            return (
              <div
                key={index}
                className="group bg-white border-2 border-border rounded-2xl p-8 hover:border-luxury-gold/50 hover:shadow-shadow-luxury transition-all duration-500"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${module.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-cormorant font-semibold text-luxury-black mb-3">
                  {module.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {module.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90 text-white font-semibold shadow-glow-blue"
            asChild
          >
            <a href="/suite">Explore the Full Suite →</a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TheSuite;
