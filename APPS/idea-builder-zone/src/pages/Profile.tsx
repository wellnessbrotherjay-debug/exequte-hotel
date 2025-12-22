import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User, Activity, TrendingUp, LogOut, Crown, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useSubscription } from "@/contexts/SubscriptionContext";

const profileSchema = z.object({
  full_name: z.string().min(2, "Name required"),
  age: z.coerce.number().min(13, "Must be 13+").max(120, "Invalid age"),
  weight_kg: z.coerce.number().min(30, "Weight must be at least 30kg").max(300, "Weight must be less than 300kg"),
  height_cm: z.coerce.number().min(100, "Height must be at least 100cm").max(250, "Height must be less than 250cm"),
  sailing_experience: z.enum(["beginner", "intermediate", "advanced", "expert"]),
  years_sailing: z.coerce.number().min(0, "Cannot be negative").max(100, "Invalid years"),
});

const Profile = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [bmi, setBmi] = useState<number | null>(null);
  const [bmr, setBmr] = useState<number | null>(null);
  const [userRole, setUserRole] = useState<string>("free");
  const { subscribed, subscriptionEnd, checkSubscription, loading: subLoading } = useSubscription();

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    loadProfile();
    
    // Show success message if redirected from successful checkout
    if (searchParams.get("success") === "true") {
      toast({
        title: "Welcome to Premium!",
        description: "Your subscription is now active. Enjoy all premium features!",
      });
      // Force refresh subscription status
      setTimeout(() => checkSubscription(), 2000);
    }
  }, [searchParams]);

  useEffect(() => {
    const subscription = form.watch((value) => {
      if (value.weight_kg && value.height_cm) {
        const weightNum = Number(value.weight_kg);
        const heightNum = Number(value.height_cm);
        const bmiCalc = weightNum / ((heightNum / 100) ** 2);
        setBmi(bmiCalc);

        if (value.age) {
          const bmrCalc = 10 * weightNum + 6.25 * heightNum - 5 * Number(value.age) + 5;
          setBmr(bmrCalc);
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  const loadProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    const { data: role } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (role) setUserRole(role.role);

    if (profile) {
      form.reset({
        full_name: profile.full_name || "",
        age: profile.age || 0,
        weight_kg: profile.weight_kg || 0,
        height_cm: profile.height_cm || 0,
        sailing_experience: (profile.sailing_experience as "beginner" | "intermediate" | "advanced" | "expert") || "beginner",
        years_sailing: profile.years_sailing || 0,
      });
    }
  };

  const onSubmit = async (values: z.infer<typeof profileSchema>) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: values.full_name,
          age: values.age,
          weight_kg: values.weight_kg,
          height_cm: values.height_cm,
          sailing_experience: values.sailing_experience,
          years_sailing: values.years_sailing,
        })
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Profile updated!",
        description: "Your health metrics have been saved",
      });
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const getBMICategory = (bmiValue: number) => {
    if (bmiValue < 18.5) return { label: "Underweight", color: "text-yellow-600" };
    if (bmiValue < 25) return { label: "Normal", color: "text-green-600" };
    if (bmiValue < 30) return { label: "Overweight", color: "text-orange-600" };
    return { label: "Obese", color: "text-red-600" };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <User className="h-8 w-8 text-primary" />
            Your Profile
          </h1>
          <p className="text-muted-foreground">Manage your account and health metrics</p>
        </div>
        <div className="flex gap-2">
          {userRole === "free" && (
            <Button onClick={() => navigate("/upgrade")} className="bg-gradient-to-r from-primary to-primary-light">
              <Crown className="mr-2 h-4 w-4" />
              Upgrade to Premium
            </Button>
          )}
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Account Type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Badge variant={subscribed ? "default" : "outline"} className="text-lg">
                {subscribed ? "Premium" : "Free"}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={checkSubscription}
                disabled={subLoading}
              >
                <RefreshCw className={`h-4 w-4 ${subLoading ? "animate-spin" : ""}`} />
              </Button>
            </div>
            {subscriptionEnd && (
              <p className="text-xs text-muted-foreground mt-2">
                Renews {new Date(subscriptionEnd).toLocaleDateString()}
              </p>
            )}
          </CardContent>
        </Card>

        {bmi !== null && (
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Body Mass Index (BMI)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bmi.toFixed(1)}</div>
              <p className={`text-sm ${getBMICategory(bmi).color}`}>
                {getBMICategory(bmi).label}
              </p>
            </CardContent>
          </Card>
        )}

        {bmr !== null && (
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Basal Metabolic Rate (BMR)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(bmr)}</div>
              <p className="text-sm text-muted-foreground">calories/day</p>
            </CardContent>
          </Card>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Health & Performance Metrics</CardTitle>
          <CardDescription>Track your physical stats for optimal sailing performance</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="25" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="weight_kg"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weight (kg)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="70" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="height_cm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Height (cm)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="175" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="years_sailing"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Years Sailing</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="5" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="sailing_experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sailing Experience Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                        <SelectItem value="expert">Expert</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      This helps us tailor workouts and tips to your level
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Profile"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;