import { Button } from "@/hotel-nexus/components/ui/button";
import { nexusAssets } from "@/hotel-nexus/lib/assets";

const Hero = () => {
  return (
    <section className="relative h-screen flex items-center overflow-hidden bg-luxury-black">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${nexusAssets.heroRoom})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-luxury-black/95 via-luxury-black/60 to-luxury-black/20" />
      </div>

      {/* Animated Keywords Overlay */}
      <div className="absolute top-1/4 right-12 text-white/5 text-9xl font-cormorant font-bold hidden xl:block animate-fade-in">
        <div className="space-y-4">
          <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>Wellness</div>
          <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>Unified</div>
          <div className="animate-slide-up" style={{ animationDelay: '0.6s' }}>Excellence</div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 w-full">
        <div className="max-w-3xl animate-fade-in">
          {/* Tagline */}
          <div className="mb-6 animate-slide-up">
            <span className="inline-block px-5 py-2 bg-luxury-gold/10 backdrop-blur-sm border border-luxury-gold/30 rounded-full text-luxury-gold text-sm font-semibold uppercase tracking-wider">
              The All-in-One Wellness Operating System
            </span>
          </div>
          
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-cormorant font-bold mb-8 text-white leading-[1.1]">
            Transform Your Hotel Into a Wellness Ecosystem
          </h1>
          
          {/* Sub-Hero Executive Pitch */}
          <p className="text-xl md:text-2xl text-white/90 mb-5 leading-relaxed font-light">
            One connected platform that powers in-room workouts, digital menus, stock control, CRM, and guest analytics — all from one CMS.
          </p>
          <p className="text-lg md:text-xl text-white/75 mb-12 leading-relaxed max-w-2xl">
            Hotel Fit Solutions unifies your fitness, F&B, and digital signage systems into a single intelligent platform that adapts to every guest, every moment.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              size="lg" 
              className="bg-luxury-gold hover:bg-luxury-gold/90 text-luxury-black font-semibold shadow-glow-gold hover:shadow-glow-gold transition-all duration-300"
              asChild
            >
              <a href="/demo">Book a Demo</a>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-white/80 text-white hover:bg-white hover:text-luxury-black backdrop-blur-sm font-semibold transition-all duration-300"
              asChild
            >
              <a href="#download">Download Product Deck</a>
            </Button>
            <Button 
              size="lg" 
              variant="ghost" 
              className="text-white/90 hover:text-white hover:bg-white/10 backdrop-blur-sm font-semibold"
              asChild
            >
              <a href="/suite">Explore the Suite →</a>
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full p-1">
          <div className="w-1 h-2 bg-white/50 rounded-full mx-auto animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
