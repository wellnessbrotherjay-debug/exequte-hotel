import { Check } from "lucide-react";

const benefitsData = [
  {
    category: "Guest Experience",
    items: [
      "Personalized AI workouts in-room",
      "Multi-language video guidance",
      "Beautiful TV interface",
    ],
  },
  {
    category: "Operations",
    items: [
      "No staff training required",
      "Integrates with existing tech",
      "Energy efficient",
    ],
  },
  {
    category: "Brand Impact",
    items: [
      "Wellness differentiator",
      "Boosts reviews & loyalty",
      "Adds premium brand value",
    ],
  },
];

const Benefits = () => {
  return (
    <section id="technology" className="py-32 px-6 bg-white">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <p className="text-primary text-xs font-semibold uppercase tracking-[0.2em] mb-4">
            FOR HOTELS
          </p>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-foreground uppercase tracking-tight">
            Why Hotels Choose Hotel Fit Solutions
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            More than fitness—it's a competitive advantage engineered for hospitality excellence
          </p>
        </div>

        {/* Benefits Table */}
        <div className="grid md:grid-cols-3 gap-1 mb-20 max-w-5xl mx-auto animate-fade-in">
          {benefitsData.map((category, index) => (
            <div 
              key={category.category}
              className="bg-gradient-to-b from-[hsl(220,20%,98%)] to-white border-2 border-primary/20 rounded-lg p-8 transition-all duration-300 hover:shadow-xl hover:border-primary/40"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <h3 className="text-2xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
                {category.category}
              </h3>
              <ul className="space-y-4">
                {category.items.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-muted-foreground leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Testimonial Placeholder */}
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-2xl p-12 animate-fade-in">
          <div className="text-4xl text-primary mb-6">"</div>
          <p className="text-xl text-muted-foreground italic mb-6">
            Testimonials from pilot hotels will be featured here as programs launch
          </p>
          <div className="text-sm text-muted-foreground uppercase tracking-wider">
            — Coming Soon from Partner Hotels
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;
