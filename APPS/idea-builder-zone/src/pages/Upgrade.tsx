import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Crown, Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useSubscription } from "@/contexts/SubscriptionContext";

const Upgrade = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [currentRole, setCurrentRole] = useState<string>("free");
  const { subscribed, createCheckoutSession, loading: subLoading, freeUpgrade, downgrade } = useSubscription();

  useEffect(() => {
    checkAuth();
    
    // Show cancellation message if user canceled checkout
    if (searchParams.get("canceled") === "true") {
      toast({
        title: "Checkout canceled",
        description: "You can upgrade anytime from this page",
      });
    }
  }, [searchParams]);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }

    const { data: role } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (role) setCurrentRole(role.role);
  };

  const handleUpgrade = async () => {
    console.log("Upgrade button clicked");
    await freeUpgrade();
  };

  const features = {
    free: [
      { name: "9-day fitness program", included: true },
      { name: "Basic race tracking", included: true },
      { name: "Boat setup (3 configurations)", included: true },
      { name: "Community forum access", included: true },
      { name: "Advanced race analytics", included: false },
      { name: "Unlimited boat setups", included: false },
      { name: "Workout progress tracking", included: false },
      { name: "Heart rate integration", included: false },
      { name: "Performance insights", included: false },
      { name: "Priority support", included: false },
    ],
    premium: [
      { name: "9-day fitness program", included: true },
      { name: "Advanced race tracking", included: true },
      { name: "Unlimited boat setups", included: true },
      { name: "Community forum access", included: true },
      { name: "Advanced race analytics", included: true },
      { name: "Workout progress tracking", included: true },
      { name: "Heart rate integration", included: true },
      { name: "Performance insights & AI tips", included: true },
      { name: "Export data (CSV/PDF)", included: true },
      { name: "Priority support", included: true },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold flex items-center justify-center gap-2">
          <Crown className="h-10 w-10 text-primary" />
          Upgrade to Premium
        </h1>
        <p className="text-muted-foreground text-lg">
          Unlock all features and take your sailing performance to the next level
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {/* Free Plan */}
        <Card className={currentRole === "free" ? "border-2 border-primary" : ""}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">Free Plan</CardTitle>
              {currentRole === "free" && (
                <Badge>Current Plan</Badge>
              )}
            </div>
            <CardDescription>
              <span className="text-3xl font-bold">$0</span>
              <span className="text-muted-foreground">/month</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {features.free.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  {feature.included ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <X className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className={feature.included ? "" : "text-muted-foreground"}>
                    {feature.name}
                  </span>
                </div>
              ))}
            </div>
            {currentRole !== "free" && (
              <Button variant="outline" className="w-full" disabled>
                Current Plan
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Premium Plan */}
        <Card className={`${currentRole === "premium" ? "border-2 border-primary" : ""} relative overflow-hidden`}>
          <div className="absolute top-0 right-0 bg-gradient-to-br from-primary to-primary-light text-white px-3 py-1 text-sm font-semibold">
            POPULAR
          </div>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl flex items-center gap-2">
                <Crown className="h-6 w-6 text-primary" />
                Premium Plan
              </CardTitle>
              {currentRole === "premium" && (
                <Badge>Current Plan</Badge>
              )}
            </div>
            <CardDescription>
              <span className="text-3xl font-bold">$9.99</span>
              <span className="text-muted-foreground">/month</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {features.premium.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span>{feature.name}</span>
                </div>
              ))}
            </div>
            {currentRole === "free" && (
              <Button 
                onClick={handleUpgrade} 
                className="w-full bg-gradient-to-r from-primary to-primary-light"
                disabled={subLoading}
              >
                <Crown className="mr-2 h-4 w-4" />
                {subLoading ? "Processing..." : "Upgrade Now"}
              </Button>
            )}
            {currentRole === "premium" && (
              <div className="grid gap-2">
                <Button variant="outline" className="w-full" disabled>
                  <Crown className="mr-2 h-4 w-4" />
                  Current Plan
                </Button>
                <Button variant="destructive" className="w-full" onClick={downgrade}>
                  <X className="mr-2 h-4 w-4" />
                  Downgrade to Free
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="max-w-5xl mx-auto bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader>
          <CardTitle>Why Upgrade?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h3 className="font-semibold">Advanced Analytics</h3>
              <p className="text-sm text-muted-foreground">
                Deep insights into your race performance, trends, and improvement areas
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Unlimited Tracking</h3>
              <p className="text-sm text-muted-foreground">
                Save unlimited boat setups and track every aspect of your training
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Priority Support</h3>
              <p className="text-sm text-muted-foreground">
                Get help when you need it with dedicated premium support
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Upgrade;