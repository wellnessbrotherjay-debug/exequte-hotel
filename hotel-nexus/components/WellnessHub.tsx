import { Calculator, Utensils, TrendingUp, Sparkles, Scan, LineChart } from "lucide-react";
import { nexusAssets } from "@/hotel-nexus/lib/assets";

const features = [
  {
    icon: Calculator,
    title: "TDEE-Based Meal Calculations",
    description: "Our AI-powered system calculates each guest's Total Daily Energy Expenditure and creates personalized meal plans that align with their fitness goals—whether weight loss, maintenance, or muscle gain.",
  },
  {
    icon: Utensils,
    title: "Smart Food Ordering",
    description: "Guests order nutritionally optimized meals directly through the interface. Every dish includes precise macros, calories, and portion sizes tailored to their workout intensity and health objectives.",
  },
  {
    icon: TrendingUp,
    title: "Revenue Generation for Hotels",
    description: "Transform your property into a premium wellness destination. Health-conscious travelers pay premium rates for integrated fitness and nutrition services—creating a new, high-margin revenue stream.",
  },
  {
    icon: Sparkles,
    title: "Complete Wellness Experience",
    description: "Combine custom workouts, guided training videos, and personalized nutrition in one seamless platform. Guests track progress, adjust goals, and maintain their health routines while traveling.",
  },
];

const WellnessHub = () => {
  return (
    <section className="py-32 px-6 bg-gradient-to-b from-secondary/20 to-white">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <p className="text-primary text-xs font-semibold uppercase tracking-wider mb-4">
            SMART WELLNESS INTEGRATION
          </p>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            Transform Your Hotel Into a Wellness Hub
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Health and wellness is the world's fastest-growing travel trend. Our intelligent nutrition system 
            calculates guests' needs and delivers customized meal plans—turning your hotel into a complete 
            wellness destination that commands premium rates.
          </p>
        </div>

        {/* Meal Selection Image - Protein Bowl */}
        <div className="mb-12 animate-fade-in max-w-xl mx-auto">
          <div className="rounded-xl overflow-hidden shadow-[0_0_40px_rgba(66,133,244,0.3)]">
            <img
              src={nexusAssets.mealSelection}
              alt="Customized meal selection interface showing protein power bowl with nutritional information"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Post-Workout Meal Ordering */}
        <div className="mb-20 animate-fade-in">
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
              Post-Workout In-Room Meal Ordering
            </h3>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              After completing their workout, guests can instantly order nutritionally optimized recovery meals 
              delivered directly to their room. Each meal is calculated based on their workout intensity and goals.
            </p>
          </div>
          <div className="rounded-xl overflow-hidden shadow-[0_0_40px_rgba(66,133,244,0.3)] max-w-5xl mx-auto">
            <img
              src={nexusAssets.recoveryMeal}
              alt="Recovery meal selection screen with goal-based portion sizing and macro tracking for post-workout nutrition"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-12 animate-fade-in">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="flex gap-6"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex-shrink-0">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-3 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* 3D Body Scan Integration */}
        <div className="mt-32 mb-20">
          <div className="text-center mb-16 animate-fade-in">
            <p className="text-primary text-xs font-semibold uppercase tracking-wider mb-4">
              3D BODY SCAN INTEGRATION
            </p>
            <h3 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
              Track Real Progress with Precision Data
            </h3>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Our system integrates with 3D body scanning technology to provide guests with detailed body 
              composition analysis, posture assessment, and progress tracking over time. Data syncs seamlessly 
              with the app, showing measurable results that keep guests motivated throughout their stay.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 mb-16 animate-fade-in">
            <div className="rounded-xl overflow-hidden shadow-[0_0_40px_rgba(66,133,244,0.3)]">
            <img
                src={nexusAssets.bodyScanner}
                alt="3D body scanner with measurement points tracking posture, body composition, and physical metrics"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="rounded-xl overflow-hidden shadow-[0_0_40px_rgba(66,133,244,0.3)]">
            <img
                src={nexusAssets.bodyAnalytics}
                alt="Detailed body composition reports showing posture analysis, muscle-fat ratio, and progress tracking"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 animate-fade-in">
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10">
                  <Scan className="w-7 h-7 text-primary" />
                </div>
              </div>
              <div>
                <h4 className="text-xl font-bold mb-3 text-foreground">
                  Comprehensive Body Analysis
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  Full-body scans measure body composition, posture alignment, muscle symmetry, and fat distribution. 
                  Guests receive detailed reports with actionable insights to optimize their training and nutrition.
                </p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10">
                  <LineChart className="w-7 h-7 text-primary" />
                </div>
              </div>
              <div>
                <h4 className="text-xl font-bold mb-3 text-foreground">
                  Progress Tracking Over Time
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  Historical data tracking shows guests exactly how their body is changing—muscle gain, fat loss, 
                  posture improvements—all visualized in easy-to-understand charts and 3D comparisons.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Value Proposition */}
        <div className="mt-20 p-10 rounded-2xl bg-primary/5 border-2 border-primary/20 animate-fade-in">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
              The Wellness Travel Revolution
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Modern travelers prioritize health and wellness above all else. By integrating smart fitness 
              equipment with personalized nutrition ordering, your hotel becomes more than accommodation—it's 
              a destination for health-focused guests willing to pay premium rates for a truly integrated 
              wellness experience. Increase guest satisfaction, boost F&B revenue, and differentiate your 
              property in the world's fastest-growing hospitality segment.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WellnessHub;
