import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/dashboard");
      }
    };
    checkAuth();
  }, [navigate]);

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(180deg, hsl(200 25% 15%) 0%, hsl(200 20% 8%) 100%)' }}>
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/30 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/20 rounded-full blur-[120px]" />
      </div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-12">
        {/* Shield Icon */}
        <div className="mb-8 flex items-center justify-center w-24 h-24 rounded-3xl bg-card/80 backdrop-blur-sm border border-border/50 shadow-strong">
          <Shield className="w-12 h-12 text-primary" strokeWidth={2} />
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 tracking-tight">
          WELCOME TO<br />RACEFIT
        </h1>

        {/* Subtitle */}
        <p className="text-center text-muted-foreground text-base md:text-lg mb-12 max-w-md">
          Track your fitness, optimize boat setups, and improve race performance for competitive sailing
        </p>

        {/* Buttons */}
        <div className="w-full max-w-md space-y-4 mb-8">
          <Button
            size="lg"
            onClick={() => navigate("/auth")}
            variant="secondary"
            className="w-full h-14 text-base font-semibold bg-card/90 hover:bg-card border border-border/50 text-foreground shadow-medium"
          >
            CONTINUE WITH EMAIL
          </Button>
          
          <Button
            size="lg"
            onClick={() => navigate("/dashboard")}
            className="w-full h-14 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-strong"
          >
            CONTINUE AS GUEST
          </Button>
        </div>

        {/* Terms text */}
        <p className="text-sm text-muted-foreground/70 text-center max-w-md">
          By continuing you agree to our <span className="underline">privacy & terms Condition</span>
        </p>
      </div>
    </div>
  );
};

export default Index;