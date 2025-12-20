import { TrendingDown, TrendingUp, Clock } from "lucide-react";

const BusinessImpact = () => {
  const metrics = [
    {
      icon: TrendingDown,
      value: "18%",
      label: "Reduction in F&B waste",
      description: "Smart inventory management and demand forecasting",
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      icon: TrendingUp,
      value: "240%",
      label: "Increase in wellness engagement",
      description: "Personalized content drives higher guest participation",
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      icon: Clock,
      value: "10+",
      label: "Hours saved per week",
      description: "Unified dashboards eliminate manual data entry",
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  return (
    <section className="py-24 bg-gradient-subtle">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-cormorant font-bold text-luxury-black mb-6">
            Business Impact
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Real results from hotels using Hotel Fit Solutions
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div
                key={index}
                className="bg-white border-2 border-border rounded-2xl p-8 hover:border-luxury-gold/50 hover:shadow-shadow-luxury transition-all duration-300 text-center"
              >
                <div className={`w-20 h-20 ${metric.bg} rounded-xl flex items-center justify-center mx-auto mb-6`}>
                  <Icon className={`w-10 h-10 ${metric.color}`} />
                </div>
                <div className={`text-6xl font-cormorant font-bold ${metric.color} mb-4`}>
                  {metric.value}
                </div>
                <h3 className="text-2xl font-cormorant font-semibold text-luxury-black mb-3">
                  {metric.label}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {metric.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Chart Visualization */}
        <div className="mt-16 bg-white border-2 border-border rounded-2xl p-8">
          <h3 className="text-2xl font-cormorant font-semibold text-luxury-black text-center mb-8">
            Engagement ↑ / Costs ↓
          </h3>
          <div className="flex justify-center items-end gap-4 h-64">
            <div className="flex flex-col items-center gap-2 w-1/3">
              <div className="w-full bg-red-100 rounded-t-lg relative overflow-hidden" style={{ height: '60%' }}>
                <div className="absolute inset-0 bg-gradient-to-t from-red-500 to-red-300" />
              </div>
              <p className="text-sm font-semibold text-muted-foreground">Before</p>
              <p className="text-xs text-muted-foreground">Costs</p>
            </div>
            <div className="flex flex-col items-center gap-2 w-1/3">
              <div className="w-full bg-green-100 rounded-t-lg relative overflow-hidden" style={{ height: '90%' }}>
                <div className="absolute inset-0 bg-gradient-to-t from-green-500 to-green-300" />
              </div>
              <p className="text-sm font-semibold text-muted-foreground">After</p>
              <p className="text-xs text-muted-foreground">Engagement</p>
            </div>
            <div className="flex flex-col items-center gap-2 w-1/3">
              <div className="w-full bg-blue-100 rounded-t-lg relative overflow-hidden" style={{ height: '35%' }}>
                <div className="absolute inset-0 bg-gradient-to-t from-blue-500 to-blue-300" />
              </div>
              <p className="text-sm font-semibold text-muted-foreground">After</p>
              <p className="text-xs text-muted-foreground">Costs</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessImpact;
