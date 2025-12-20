import { Button } from "@/hotel-nexus/components/ui/button";
import { nexusAssets } from "@/hotel-nexus/lib/assets";

const FinalCTA = () => {
  return (
    <section className="py-24 bg-gradient-luxury text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-cormorant font-bold mb-6">
            Ready to Transform Your Guest Experience?
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed">
            Join leading hotels worldwide in delivering exceptional wellness experiences that drive revenue and guest satisfaction.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              className="bg-luxury-gold hover:bg-luxury-gold/90 text-luxury-black font-semibold shadow-glow-gold text-lg px-12"
              asChild
            >
              <a href="/demo">Book a Demo</a>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-white text-white hover:bg-white hover:text-luxury-black font-semibold text-lg px-12"
              asChild
            >
              <a href="#dashboard">See the Dashboard in Action →</a>
            </Button>
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10">
            <img 
              src={nexusAssets.dashboard} 
              alt="Hotel Fit Solutions Dashboard" 
              className="w-full h-auto"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/50 to-transparent" />
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-16 text-center">
          <p className="text-white/60 text-sm mb-6">Trusted by leading hospitality brands</p>
          <div className="flex flex-wrap justify-center gap-8">
            <div className="px-6 py-3 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
              <span className="text-white/80 font-semibold">TS Suites</span>
            </div>
            <div className="px-6 py-3 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
              <span className="text-white/80 font-semibold">COMO Hotels</span>
            </div>
            <div className="px-6 py-3 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
              <span className="text-white/80 font-semibold">Marriott</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
