import { Play, Target, BarChart3, Trophy } from "lucide-react";
import { nexusAssets } from "@/hotel-nexus/lib/assets";

const features = [
  {
    icon: Play,
    title: "Guided Video Instructions",
    description: "Professional trainers demonstrate every exercise with clear form cues, real-time feedback, and motivational coaching—right on the in-room screen.",
  },
  {
    icon: Target,
    title: "Skill Level Matching",
    description: "From beginner to advanced, our system recommends workouts that match each guest's fitness level. No intimidation, just progression.",
  },
  {
    icon: BarChart3,
    title: "Progress Tracking",
    description: "Guests track calories burned, workout duration, and exercise completion. Data syncs across devices so they can maintain consistency throughout their stay.",
  },
  {
    icon: Trophy,
    title: "Seamless User Experience",
    description: "Intuitive navigation with arrow keys or touch controls. Guests select their workout in seconds and start training immediately—no complicated setup.",
  },
];

const InRoomWorkout = () => {
  return (
    <section className="py-32 px-6 bg-gradient-to-b from-[hsl(220,20%,98%)] to-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, hsl(220 50% 25%) 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
      
      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <p className="text-primary text-xs font-semibold uppercase tracking-[0.2em] mb-4">
            FOR GUESTS
          </p>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-foreground uppercase tracking-tight">
            Your Wellness, Your Way
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Every stay becomes an opportunity to recharge. Whether it's yoga at sunrise, HIIT before meetings, 
            or guided recovery before sleep—Hotel Fit makes fitness effortless and inspiring.
          </p>
        </div>

        {/* Large Centered Mockup */}
        <div className="mb-20 animate-fade-in max-w-4xl mx-auto">
          <div className="rounded-xl overflow-hidden shadow-[0_0_40px_rgba(66,133,244,0.3)]">
            <img
              src={nexusAssets.workoutSelection}
              alt="Interactive workout selection screen showing beginner to advanced programs with exercise details and calorie estimates"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Room Workout Screen Interface */}
        <div className="mb-20 animate-fade-in max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
              In-Room Workout Experience
            </h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Guests access guided workouts directly from their room TV. Clear timers, exercise demonstrations, 
              form guides, and QR code scanning for seamless session tracking—all displayed beautifully on any screen.
            </p>
          </div>
          <div className="rounded-xl overflow-hidden shadow-[0_0_40px_rgba(66,133,244,0.3)]">
            <img
              src={nexusAssets.roomWorkoutScreen}
              alt="In-room workout screen interface showing live workout timer, exercise demonstration, form guide, and QR code for session start"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Customized Video Experience */}
        <div className="mb-20 animate-fade-in max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
              Fully Customized for Your Hotel
            </h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Every workout video and exercise program is uniquely tailored to your hotel's in-house system and environment. 
              Your guests experience a cohesive brand journey, from the moment they check in to every training session.
            </p>
          </div>
          <div className="rounded-xl overflow-hidden shadow-[0_0_40px_rgba(66,133,244,0.3)]">
            <img
              src={nexusAssets.tvWorkout}
              alt="Customized workout video interface designed specifically for hotel in-room fitness experience"
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

        {/* Guest Experience Highlight */}
        <div className="mt-20 p-10 rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 border-2 border-primary/20 animate-fade-in">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
              Zero Learning Curve, Maximum Results
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Your guests don't need to be tech-savvy or fitness experts. Our interface is designed for immediate 
              use—select a goal, choose a difficulty level, and start training. The system handles everything from 
              form guidance to calorie tracking, creating a premium fitness experience that rivals personal training 
              sessions at a fraction of the cost.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InRoomWorkout;
