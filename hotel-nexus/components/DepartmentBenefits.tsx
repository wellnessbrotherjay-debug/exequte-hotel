import { UserCheck, UtensilsCrossed, Activity, TrendingUp, Shield } from "lucide-react";

const DepartmentBenefits = () => {
  const departments = [
    {
      icon: UserCheck,
      department: "Front Desk",
      benefits: "Manage guests, send offers, see engagement scores",
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      icon: UtensilsCrossed,
      department: "F&B Team",
      benefits: "Real-time stock & cost tracking, easy menu updates",
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      icon: Activity,
      department: "Trainers & Spa Staff",
      benefits: "Control workouts, HRM data, and bookings",
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      icon: TrendingUp,
      department: "Marketing & GM",
      benefits: "Analytics dashboard with ROI insights",
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      icon: Shield,
      department: "IT Team",
      benefits: "Secure, cloud-hosted, multi-tenant control",
      color: "text-red-600",
      bg: "bg-red-50",
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-cormorant font-bold text-luxury-black mb-6">
            For Every Department
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Empowering your entire team with the tools they need to deliver exceptional guest experiences
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {departments.map((dept, index) => {
            const Icon = dept.icon;
            return (
              <div
                key={index}
                className="bg-white border-2 border-border rounded-2xl p-8 hover:border-luxury-gold/50 hover:shadow-shadow-luxury transition-all duration-300"
              >
                <div className={`w-16 h-16 ${dept.bg} rounded-xl flex items-center justify-center mb-6`}>
                  <Icon className={`w-8 h-8 ${dept.color}`} />
                </div>
                <h3 className="text-2xl font-cormorant font-semibold text-luxury-black mb-3">
                  {dept.department}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {dept.benefits}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default DepartmentBenefits;
