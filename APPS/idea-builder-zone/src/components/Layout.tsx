import { useState, useEffect, ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Anchor, Activity, Brain, LayoutDashboard, User, Users, Dumbbell, TrendingUp, Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import logo from "@/assets/racefit-logo.png";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useSubscription } from "@/contexts/SubscriptionContext";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { subscribed } = useSubscription();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const navigation = [
    { name: "Home", path: "/", icon: LayoutDashboard },
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Body", path: "/body", icon: Activity },
    { name: "Boat", path: "/boat", icon: Anchor },
    { name: "Mindset", path: "/mindset", icon: Brain },
    { name: "Community", path: "/community", icon: Users },
  ];

  const premiumNavigation = [
    { name: "Workouts", path: "/workout-tracker", icon: Dumbbell },
    { name: "History", path: "/workout-history", icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Geometric Red Accent Lines Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Diagonal line 1 */}
        <div className="absolute top-0 right-[20%] w-[2px] h-[200%] bg-gradient-to-b from-transparent via-primary/30 to-transparent rotate-[25deg] blur-sm" />
        <div className="absolute top-0 right-[20%] w-[1px] h-[200%] bg-gradient-to-b from-transparent via-primary/60 to-transparent rotate-[25deg]" />
        
        {/* Diagonal line 2 */}
        <div className="absolute bottom-0 left-[15%] w-[3px] h-[180%] bg-gradient-to-t from-transparent via-primary/40 to-transparent rotate-[30deg] blur-sm" />
        <div className="absolute bottom-0 left-[15%] w-[1px] h-[180%] bg-gradient-to-t from-transparent via-primary/70 to-transparent rotate-[30deg]" />
        
        {/* Diagonal line 3 */}
        <div className="absolute top-[20%] right-[40%] w-[2px] h-[150%] bg-gradient-to-b from-transparent via-primary/25 to-transparent rotate-[28deg] blur-sm" />
        
        {/* Additional accent glow */}
        <div className="absolute top-[30%] right-[10%] w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[20%] left-[5%] w-40 h-40 bg-primary/8 rounded-full blur-3xl" />
      </div>
      
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-3 shrink-0">
            <img src={logo} alt="RaceFit Logo" className="h-10 w-auto" />
            <div className="hidden sm:block">
              <p className="text-xs text-muted-foreground font-medium whitespace-nowrap">9-Day Sailor Program</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
            
            {/* Premium Navigation */}
            {subscribed && premiumNavigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all border border-primary/30",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-primary hover:text-primary-foreground hover:bg-primary/80"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                  <Crown className="h-3 w-3" />
                </Link>
              );
            })}
            
            {/* Upgrade button for free users */}
            {!subscribed && isAuthenticated && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/upgrade")}
                className="ml-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                <Crown className="h-4 w-4 mr-2" />
                Upgrade
              </Button>
            )}
            
            {isAuthenticated ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/profile")}
                className="ml-2"
              >
                <User className="h-4 w-4 mr-2" />
                Profile
              </Button>
            ) : (
              <Button
                variant="default"
                size="sm"
                onClick={() => navigate("/auth")}
                className="ml-2"
              >
                Login
              </Button>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-6 md:py-8 relative z-10">{children}</main>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className={cn(
          "grid gap-1 p-2",
          subscribed ? "grid-cols-7" : "grid-cols-5"
        )}>
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center gap-1 p-2 rounded-lg transition-all",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium">{item.name}</span>
              </Link>
            );
          })}
          
          {/* Premium Navigation for Mobile */}
          {subscribed && premiumNavigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center gap-1 p-2 rounded-lg transition-all border border-primary/30",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-primary hover:text-primary-foreground hover:bg-primary/80"
                )}
              >
                <div className="relative">
                  <Icon className="h-5 w-5" />
                  <Crown className="h-2 w-2 absolute -top-1 -right-1" />
                </div>
                <span className="text-xs font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Mobile bottom padding */}
      <div className="h-20 md:hidden" />
    </div>
  );
};

export default Layout;
