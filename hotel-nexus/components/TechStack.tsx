import { Code2, Database, Cloud, CreditCard, Film, Link2 } from "lucide-react";

const TechStack = () => {
  const technologies = [
    { icon: Code2, name: "Next.js / React", category: "Frontend Framework" },
    { icon: Database, name: "Supabase", category: "Database & Auth" },
    { icon: Cloud, name: "Vercel", category: "Cloud Hosting" },
    { icon: CreditCard, name: "Stripe", category: "Payments" },
    { icon: Film, name: "Mux / BunnyCDN", category: "Video Delivery" },
    { icon: Link2, name: "PMS / POS / CRM", category: "Hotel Integrations" },
  ];

  const integrations = [
    "Oracle Micros",
    "Lightspeed",
    "Cloudbeds",
    "Xero",
    "QuickBooks",
  ];

  return (
    <section className="py-24 bg-gradient-luxury text-white">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-cormorant font-bold mb-6">
            Built for Performance, Security, and Scalability
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            Enterprise-grade technology stack with seamless integrations
          </p>
        </div>

        {/* Technology Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {technologies.map((tech, index) => {
            const Icon = tech.icon;
            return (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 hover:border-luxury-gold/30 transition-all duration-300"
              >
                <Icon className="w-10 h-10 text-luxury-gold mb-4" />
                <h3 className="text-xl font-cormorant font-semibold mb-2">{tech.name}</h3>
                <p className="text-white/60 text-sm">{tech.category}</p>
              </div>
            );
          })}
        </div>

        {/* Integration Partners */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
          <h3 className="text-2xl font-cormorant font-semibold text-center mb-6">
            Fully API-Driven Architecture
          </h3>
          <p className="text-white/80 text-center mb-8 max-w-2xl mx-auto">
            Seamless integration with your existing hotel systems
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            {integrations.map((integration, index) => (
              <div
                key={index}
                className="px-6 py-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 text-sm font-semibold hover:bg-white/20 transition-all duration-300"
              >
                {integration}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechStack;
