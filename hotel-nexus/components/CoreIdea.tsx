import { Database, Tv, UtensilsCrossed, Activity, BarChart3, Users } from "lucide-react";

const CoreIdea = () => {
  const connections = [
    { icon: Tv, label: "Smart TV" },
    { icon: Activity, label: "Gym Display" },
    { icon: UtensilsCrossed, label: "F&B Systems" },
    { icon: Users, label: "CRM" },
    { icon: BarChart3, label: "Analytics" },
  ];

  return (
    <section className="py-24 bg-gradient-subtle">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-cormorant font-bold text-luxury-black mb-6">
            One CMS. Total Control.
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Hotel Fit Solutions unifies your fitness, F&B, and digital signage systems into a single platform — powering TV, tablets, and mobile with dynamic content that adapts to time, location, and guest profiles.
          </p>
        </div>

        {/* Hub Diagram */}
        <div className="relative max-w-5xl mx-auto">
          {/* Center Hub */}
          <div className="relative z-10 flex justify-center mb-12">
            <div className="bg-gradient-luxury text-white rounded-2xl p-8 shadow-shadow-luxury border border-luxury-gold/20">
              <Database className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-2xl font-cormorant font-semibold text-center">Hotel Fit CMS</h3>
              <p className="text-white/80 text-center text-sm mt-2">Central Control Hub</p>
            </div>
          </div>

          {/* Connected Modules */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {connections.map((item, index) => {
              const Icon = item.icon;
              return (
                <div 
                  key={index}
                  className="bg-white border border-border rounded-xl p-6 text-center hover:shadow-lg hover:border-luxury-gold/30 transition-all duration-300 group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-12 h-12 mx-auto mb-3 bg-luxury-light rounded-lg flex items-center justify-center group-hover:bg-luxury-gold/10 transition-colors">
                    <Icon className="w-6 h-6 text-primary group-hover:text-luxury-gold transition-colors" />
                  </div>
                  <p className="text-sm font-semibold text-foreground">{item.label}</p>
                </div>
              );
            })}
          </div>

          {/* Connecting Lines (decorative) */}
          <div className="absolute inset-0 pointer-events-none hidden lg:block">
            <svg className="w-full h-full" style={{ opacity: 0.1 }}>
              <line x1="50%" y1="30%" x2="20%" y2="70%" stroke="currentColor" strokeWidth="2" className="text-primary" />
              <line x1="50%" y1="30%" x2="35%" y2="70%" stroke="currentColor" strokeWidth="2" className="text-primary" />
              <line x1="50%" y1="30%" x2="50%" y2="70%" stroke="currentColor" strokeWidth="2" className="text-primary" />
              <line x1="50%" y1="30%" x2="65%" y2="70%" stroke="currentColor" strokeWidth="2" className="text-primary" />
              <line x1="50%" y1="30%" x2="80%" y2="70%" stroke="currentColor" strokeWidth="2" className="text-primary" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoreIdea;
