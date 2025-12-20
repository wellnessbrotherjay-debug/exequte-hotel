import { Sunrise, Coffee, Dumbbell, Sparkles, Moon } from "lucide-react";

const DynamicExperiences = () => {
  const timeline = [
    {
      icon: Sunrise,
      time: "7:00 AM",
      title: "Morning Yoga",
      description: "In-room guided session on TV",
      color: "bg-orange-100 text-orange-600",
    },
    {
      icon: Coffee,
      time: "8:30 AM",
      title: "Breakfast Menu",
      description: "Personalized nutrition options",
      color: "bg-amber-100 text-amber-600",
    },
    {
      icon: Dumbbell,
      time: "10:00 AM",
      title: "Gym Session",
      description: "HRM tracking & live feedback",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: Sparkles,
      time: "3:00 PM",
      title: "Spa Offer",
      description: "AI-triggered recovery promotion",
      color: "bg-purple-100 text-purple-600",
    },
    {
      icon: Moon,
      time: "8:00 PM",
      title: "Evening Wellness",
      description: "Healthy room service & meditation",
      color: "bg-indigo-100 text-indigo-600",
    },
  ];

  return (
    <section className="py-24 bg-luxury-light">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-cormorant font-bold text-luxury-black mb-6">
            Personalized for Every Guest, Every Moment
          </h2>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            The system adapts automatically — morning yoga on the TV, lunch menus in the café, recovery programs in the gym, and healthy room service after a long day.
          </p>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mt-4 leading-relaxed">
            AI-powered logic tailors content by time, occupancy, and weather to deliver the right experience — instantly.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative max-w-5xl mx-auto">
          {/* Timeline Line */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-luxury-gold/20 via-luxury-gold to-luxury-gold/20 -translate-y-1/2" />

          {/* Timeline Items */}
          <div className="grid md:grid-cols-5 gap-8 md:gap-4">
            {timeline.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="relative">
                  {/* Connector Dot */}
                  <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-luxury-gold rounded-full border-4 border-white shadow-lg z-10" />
                  
                  {/* Card */}
                  <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 mt-20 md:mt-0">
                    <div className={`w-14 h-14 ${item.color} rounded-lg flex items-center justify-center mb-4 mx-auto`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <p className="text-sm font-semibold text-luxury-gold text-center mb-2">
                      {item.time}
                    </p>
                    <h3 className="text-lg font-cormorant font-semibold text-luxury-black text-center mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground text-center">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DynamicExperiences;
