import { Check } from "lucide-react";
import { Button } from "@/hotel-nexus/components/ui/button";

const PricingTiers = () => {
  const tiers = [
    {
      name: "Essential",
      ideal: "Boutique Hotels",
      price: "$5",
      period: "/room/month",
      features: [
        "Smart TV App",
        "Digital Signage",
        "Menu Viewer",
        "Basic Analytics",
        "Email Support",
      ],
      cta: "Get Started",
      highlighted: false,
    },
    {
      name: "Pro Suite",
      ideal: "Lifestyle Resorts",
      price: "$12",
      period: "/room/month",
      features: [
        "Everything in Essential",
        "Gym Display System",
        "Kitchen Manager",
        "Inventory Control",
        "Recipe Costing",
        "Priority Support",
        "API Access",
      ],
      cta: "Book a Demo",
      highlighted: true,
    },
    {
      name: "Enterprise",
      ideal: "Multi-Property Chains",
      price: "Custom",
      period: "pricing",
      features: [
        "Everything in Pro Suite",
        "Full CRM Integration",
        "Advanced Analytics",
        "Custom Integrations",
        "Dedicated Account Manager",
        "White-Label Options",
        "24/7 Premium Support",
      ],
      cta: "Contact Sales",
      highlighted: false,
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-cormorant font-bold text-luxury-black mb-6">
            Pricing & Tiers
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Flexible plans that scale with your hotel's needs
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {tiers.map((tier, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl p-8 transition-all duration-300 ${
                tier.highlighted
                  ? 'border-4 border-luxury-gold shadow-shadow-luxury scale-105'
                  : 'border-2 border-border hover:border-luxury-gold/50 hover:shadow-lg'
              }`}
            >
              {tier.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-gold text-luxury-black text-sm font-bold rounded-full">
                  Most Popular
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-3xl font-cormorant font-bold text-luxury-black mb-2">
                  {tier.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Ideal for {tier.ideal}
                </p>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-5xl font-cormorant font-bold text-luxury-black">
                    {tier.price}
                  </span>
                  <span className="text-muted-foreground">{tier.period}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {tier.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-luxury-gold flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full font-semibold ${
                  tier.highlighted
                    ? 'bg-luxury-gold hover:bg-luxury-gold/90 text-luxury-black shadow-glow-gold'
                    : 'bg-primary hover:bg-primary/90 text-white'
                }`}
                size="lg"
              >
                {tier.cta}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingTiers;
