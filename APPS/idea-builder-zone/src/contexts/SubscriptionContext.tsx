import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface SubscriptionState {
  subscribed: boolean;
  productId: string | null;
  subscriptionEnd: string | null;
  loading: boolean;
}

interface SubscriptionContextType extends SubscriptionState {
  checkSubscription: () => Promise<void>;
  createCheckoutSession: () => Promise<void>;
  freeUpgrade: () => Promise<void>;
  downgrade: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [state, setState] = useState<SubscriptionState>({
    subscribed: false,
    productId: null,
    subscriptionEnd: null,
    loading: true,
  });

  const checkSubscription = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setState({ subscribed: false, productId: null, subscriptionEnd: null, loading: false });
        return;
      }

      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role, subscription_status, current_period_end')
        .eq('user_id', session.user.id)
        .single();

      if (!roleError && roleData?.role === 'premium') {
        setState({
          subscribed: true,
          productId: 'direct_premium',
          subscriptionEnd: roleData.current_period_end || null,
          loading: false,
        });
        return;
      }

      // Fallback to Stripe check if needed (optional)
      setState({ subscribed: false, productId: null, subscriptionEnd: null, loading: false });

    } catch (error: any) {
      console.error("Error checking subscription:", error);
      setState({ subscribed: false, productId: null, subscriptionEnd: null, loading: false });
    }
  };

  const freeUpgrade = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({ title: "Authentication required", variant: "destructive" });
        return;
      }
      const { error } = await supabase.functions.invoke("manage-role", {
        headers: { Authorization: `Bearer ${session.access_token}` },
        body: { action: "upgrade" },
      });
      if (error) throw error;
      
      await checkSubscription(); // This will now update the global state
      
      toast({ title: "Upgraded!", description: "Premium unlocked! Redirecting..." });
      
      setTimeout(() => {
        navigate("/workout-tracker");
      }, 1500);

    } catch (error: any) {
      toast({ title: "Upgrade failed", description: error.message, variant: "destructive" });
    }
  };

  const downgrade = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const { error } = await supabase.functions.invoke("manage-role", {
        body: { action: "downgrade" },
      });
      if (error) throw error;
      await checkSubscription();
      toast({ title: "Downgraded", description: "Back to Free plan." });
    } catch (error: any) {
      toast({ title: "Downgrade failed", description: error.message, variant: "destructive" });
    }
  };
  
  const createCheckoutSession = async () => {
    // Implement Stripe checkout logic if needed
    toast({ title: "Note", description: "Live payments are not implemented in this demo." });
  };

  useEffect(() => {
    checkSubscription();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkSubscription();
    });
    return () => subscription.unsubscribe();
  }, []);

  const value = {
    ...state,
    checkSubscription,
    createCheckoutSession,
    freeUpgrade,
    downgrade,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error("useSubscription must be used within a SubscriptionProvider");
  }
  return context;
};
