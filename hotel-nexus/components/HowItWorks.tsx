import { Award, TrendingUp, Globe, Target } from "lucide-react";

const timeline = [
  { 
    year: "2018–2023", 
    icon: Target,
    label: "Foundation & Innovation", 
    description: "Our team developed advanced fitness automation systems for boutique studios",
    metric: ""
  },
  { 
    year: "2023", 
    icon: Award,
    label: "Industry Recognition", 
    description: "Multiple partner studios receive regional 'Gym of the Year' recognition",
    metric: ""
  },
  { 
    year: "2024–Now", 
    icon: Globe,
    label: "Global Expansion", 
    description: "Launching pilot programs across Bali and Southeast Asia hotels",
    metric: ""
  },
];

const metrics = [
  { value: "+40%", label: "Average Guest Participation Rate" },
  { value: "15 min", label: "Average Session Duration" },
  { value: "0", label: "Additional Staff Required" },
];

const HowItWorks = () => {
  return (
    <section id="solutions" className="py-32 px-6 bg-gradient-to-b from-white to-[hsl(220,20%,98%)]">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <p className="text-primary text-xs font-semibold uppercase tracking-[0.2em] mb-4">
            OUR JOURNEY
          </p>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-foreground uppercase tracking-tight">
            Proven Innovation, Real Results
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Built on years of expertise in fitness technology, now transforming hospitality wellness
          </p>
        </div>

        {/* Timeline */}
        <div className="relative max-w-4xl mx-auto mb-20">
          {/* Vertical Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-primary via-primary to-primary/20 hidden md:block" />

          <div className="space-y-16">
            {timeline.map((item, index) => (
              <div 
                key={item.year}
                className="relative flex items-center animate-fade-in"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className={`flex-1 ${index % 2 === 0 ? 'text-right pr-12' : 'text-left pl-12 md:pl-0'} ${index % 2 !== 0 ? 'md:order-2 md:pl-12' : ''}`}>
                  <div className="inline-block bg-white border-2 border-primary rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                    <span className="text-primary font-bold text-lg block mb-2">{item.year}</span>
                    <h3 className="text-xl font-bold mb-2 text-foreground">{item.label}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </div>

                {/* Timeline Dot */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg z-10 hidden md:flex">
                  <item.icon className="w-8 h-8 text-white" />
                </div>

                <div className={`flex-1 ${index % 2 === 0 ? 'md:order-2' : ''}`} />
              </div>
            ))}
          </div>
        </div>

        {/* Metrics Visualization */}
        <div className="grid md:grid-cols-3 gap-8 animate-fade-in">
          {metrics.map((metric, index) => (
            <div 
              key={metric.label}
              className="text-center bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-lg p-8 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
              style={{ animationDelay: `${(timeline.length * 200) + (index * 100)}ms` }}
            >
              <div className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60 mb-4">
                {metric.value}
              </div>
              <p className="text-sm text-muted-foreground uppercase tracking-wide">{metric.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
