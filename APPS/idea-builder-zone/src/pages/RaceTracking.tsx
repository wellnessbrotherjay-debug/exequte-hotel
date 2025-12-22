import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { MapPin, Navigation, TrendingUp, Wind, Clock, Award, Gauge, Settings2, ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const raceFormSchema = z.object({
  race_name: z.string().min(1, "Race name is required"),
  race_date: z.string().min(1, "Date is required"),
  location: z.string().optional(),
  boat_class_id: z.string().optional(),
  custom_boat_class: z.string().optional(),
  wind_speed_knots: z.coerce.number().optional(),
  wind_direction: z.string().optional(),
  duration_minutes: z.coerce.number().optional(),
  placement: z.coerce.number().optional(),
  total_boats: z.coerce.number().optional(),
  avg_speed_knots: z.coerce.number().optional(),
  conditions: z.string().optional(),
  // Rig setup fields
  sailmaker: z.string().optional(),
  mast_rake: z.string().optional(),
  shroud_tension: z.string().optional(),
  forestay: z.string().optional(),
  backstay: z.string().optional(),
  jib_lead: z.string().optional(),
  outhaul: z.string().optional(),
  cunningham: z.string().optional(),
  vang: z.string().optional(),
  traveler: z.string().optional(),
  mainsheet: z.string().optional(),
  rig_tension_inner_pt: z.coerce.number().optional(),
  rig_tension_inner_kg: z.coerce.number().optional(),
  rig_tension_outer_pt: z.coerce.number().optional(),
  rig_tension_outer_kg: z.coerce.number().optional(),
});

interface BoatClass {
  id: string;
  class_name: string;
}

const RaceTracking = () => {
  const { toast } = useToast();
  const [isTracking, setIsTracking] = useState(false);
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [maxSpeed, setMaxSpeed] = useState(0);
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const [watchId, setWatchId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [boatClasses, setBoatClasses] = useState<BoatClass[]>([]);
  const [useCustomClass, setUseCustomClass] = useState(false);
  const [showRigSetup, setShowRigSetup] = useState(false);
  const [sailMakers, setSailMakers] = useState<Array<{ id: string; maker_name: string }>>([]);
  const [boatSetups, setBoatSetups] = useState<Array<any>>([]);
  const [selectedWindRange, setSelectedWindRange] = useState<string>("");

  const form = useForm<z.infer<typeof raceFormSchema>>({
    resolver: zodResolver(raceFormSchema),
    defaultValues: {
      race_name: "",
      race_date: "",
      location: "",
      wind_direction: "",
    },
  });

  const selectedBoatClassId = form.watch("boat_class_id");
  const windSpeed = form.watch("wind_speed_knots");

  useEffect(() => {
    fetchBoatClasses();
    fetchSailMakers();
  }, []);

  // Load boat setups when boat class is selected
  useEffect(() => {
    if (selectedBoatClassId && !useCustomClass) {
      loadBoatSetups(selectedBoatClassId);
    }
  }, [selectedBoatClassId, useCustomClass]);

  // Auto-populate rig setup when wind speed changes
  useEffect(() => {
    if (windSpeed && boatSetups.length > 0) {
      autoPopulateRigSetup(windSpeed);
    }
  }, [windSpeed, boatSetups]);

  const loadBoatSetups = async (boatClassId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("boat_setups")
        .select("*")
        .eq("user_id", user.id)
        .eq("boat_class_id", boatClassId)
        .order("wind_band");

      if (error) throw error;
      setBoatSetups(data || []);
    } catch (error) {
      console.error("Error loading boat setups:", error);
    }
  };

  const autoPopulateRigSetup = (windSpeed: number) => {
    // Determine wind range
    let windRange = "";
    if (windSpeed <= 5) windRange = "0-5";
    else if (windSpeed <= 10) windRange = "6-10";
    else if (windSpeed <= 15) windRange = "11-15";
    else if (windSpeed <= 20) windRange = "16-20";
    else if (windSpeed <= 25) windRange = "21-25";
    else windRange = "26-30";

    setSelectedWindRange(windRange);

    // Find matching setup
    const matchingSetup = boatSetups.find(s => s.wind_band === windRange);
    if (matchingSetup) {
      // Populate all rig fields
      form.setValue("sailmaker", matchingSetup.sailmaker || "");
      form.setValue("mast_rake", matchingSetup.mast_rake || "");
      form.setValue("shroud_tension", matchingSetup.shroud_tension || "");
      form.setValue("forestay", matchingSetup.forestay || "");
      form.setValue("backstay", matchingSetup.backstay || "");
      form.setValue("jib_lead", matchingSetup.jib_lead || "");
      form.setValue("outhaul", matchingSetup.outhaul || "");
      form.setValue("cunningham", matchingSetup.cunningham || "");
      form.setValue("vang", matchingSetup.vang || "");
      form.setValue("traveler", matchingSetup.traveler || "");
      form.setValue("mainsheet", matchingSetup.mainsheet || "");
      form.setValue("rig_tension_inner_pt", matchingSetup.rig_tension_inner_pt);
      form.setValue("rig_tension_inner_kg", matchingSetup.rig_tension_inner_kg);
      form.setValue("rig_tension_outer_pt", matchingSetup.rig_tension_outer_pt);
      form.setValue("rig_tension_outer_kg", matchingSetup.rig_tension_outer_kg);

      toast({
        title: "Rig Setup Loaded",
        description: `Settings for ${windRange} knots applied automatically`,
      });
    }
  };

  const fetchSailMakers = async () => {
    const { data, error } = await supabase
      .from("sail_makers")
      .select("id, maker_name")
      .order("maker_name");

    if (error) {
      console.error("Error fetching sail makers:", error);
    } else {
      setSailMakers(data || []);
    }
  };

  const fetchBoatClasses = async () => {
    const { data, error } = await supabase
      .from("boat_classes")
      .select("id, class_name")
      .order("class_name");

    if (error) {
      console.error("Error fetching boat classes:", error);
    } else {
      setBoatClasses(data || []);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTracking) {
      interval = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTracking]);

  const handleStartTracking = () => {
    if ("geolocation" in navigator) {
      const id = navigator.geolocation.watchPosition(
        (position) => {
          const speedKnots = position.coords.speed ? (position.coords.speed * 1.94384) : 0; // Convert m/s to knots
          setCurrentSpeed(Math.max(0, speedKnots));
          setMaxSpeed((prev) => Math.max(prev, speedKnots));
          // Distance calculation would require storing previous position
        },
        (error) => {
          console.error("GPS error:", error);
          toast({
            title: "GPS Error",
            description: "Unable to get accurate location data",
            variant: "destructive",
          });
        },
        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 5000,
        }
      );
      
      setWatchId(id);
      setIsTracking(true);
      setMaxSpeed(0);
      setCurrentSpeed(0);
      setDistance(0);
      setDuration(0);
      
      toast({
        title: "GPS Tracking Started",
        description: "Recording your race route and performance data",
      });
    } else {
      toast({
        title: "GPS Not Available",
        description: "Your device doesn't support GPS tracking",
        variant: "destructive",
      });
    }
  };

  const handleStopTracking = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
    setIsTracking(false);
    toast({
      title: "GPS Tracking Stopped",
      description: `Max speed: ${maxSpeed.toFixed(1)} knots`,
    });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const onSubmit = async (values: z.infer<typeof raceFormSchema>) => {
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to save race data",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.from("races").insert({
        user_id: user.id,
        race_name: values.race_name,
        race_date: values.race_date,
        location: values.location,
        boat_class_id: useCustomClass ? null : values.boat_class_id,
        custom_boat_class: useCustomClass ? values.custom_boat_class : null,
        wind_speed_knots: values.wind_speed_knots,
        wind_direction: values.wind_direction,
        duration_minutes: values.duration_minutes,
        placement: values.placement,
        total_boats: values.total_boats,
        avg_speed_knots: values.avg_speed_knots,
        conditions: values.conditions,
        max_speed_knots: maxSpeed > 0 ? maxSpeed : null,
        distance_nm: distance > 0 ? distance : null,
        // Rig setup
        sailmaker: values.sailmaker,
        mast_rake: values.mast_rake,
        shroud_tension: values.shroud_tension,
        forestay: values.forestay,
        backstay: values.backstay,
        jib_lead: values.jib_lead,
        outhaul: values.outhaul,
        cunningham: values.cunningham,
        vang: values.vang,
        traveler: values.traveler,
        mainsheet: values.mainsheet,
        rig_tension_inner_pt: values.rig_tension_inner_pt,
        rig_tension_inner_kg: values.rig_tension_inner_kg,
        rig_tension_outer_pt: values.rig_tension_outer_pt,
        rig_tension_outer_kg: values.rig_tension_outer_kg,
      });

      if (error) throw error;

      toast({
        title: "Race Saved!",
        description: "Your race data has been recorded successfully",
      });
      
      form.reset();
      setMaxSpeed(0);
      setDistance(0);
      
      // Navigate back to boat page after a short delay
      setTimeout(() => {
        window.location.href = "/boat";
      }, 1500);
    } catch (error: any) {
      toast({
        title: "Error Saving Race",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Race Tracking</h2>
        <p className="text-muted-foreground">Log races with GPS route tracking and performance metrics</p>
      </div>

      {/* GPS Tracking Card */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Navigation className="h-5 w-5 text-primary" />
            Live GPS Tracking
          </CardTitle>
          <CardDescription>Start tracking to record your race route automatically</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
            <div>
              <p className="font-semibold">GPS Status</p>
              <p className="text-sm text-muted-foreground">
                {isTracking ? "Actively recording route data" : "Ready to start"}
              </p>
            </div>
            {isTracking ? (
              <Button onClick={handleStopTracking} variant="destructive">
                <MapPin className="mr-2 h-4 w-4" />
                Stop Tracking
              </Button>
            ) : (
              <Button onClick={handleStartTracking} className="bg-gradient-to-r from-primary to-primary-light">
                <Navigation className="mr-2 h-4 w-4" />
                Start Tracking
              </Button>
            )}
          </div>

          {isTracking && (
            <div className="grid gap-3 md:grid-cols-4">
              <div className="p-4 rounded-lg bg-background border-2 border-primary/20">
                <div className="flex items-center gap-2 mb-1">
                  <Gauge className="h-4 w-4 text-primary" />
                  <p className="text-xs text-muted-foreground font-medium">Current Speed</p>
                </div>
                <p className="text-2xl font-bold text-primary">{currentSpeed.toFixed(1)} <span className="text-sm text-muted-foreground">kts</span></p>
              </div>
              <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <p className="text-xs text-muted-foreground font-medium">Max Speed</p>
                </div>
                <p className="text-2xl font-bold text-primary">{maxSpeed.toFixed(1)} <span className="text-sm text-muted-foreground">kts</span></p>
              </div>
              <div className="p-4 rounded-lg bg-background border-2 border-primary/20">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="h-4 w-4 text-primary" />
                  <p className="text-xs text-muted-foreground font-medium">Distance</p>
                </div>
                <p className="text-2xl font-bold">{distance.toFixed(1)} <span className="text-sm text-muted-foreground">nm</span></p>
              </div>
              <div className="p-4 rounded-lg bg-background border-2 border-primary/20">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="h-4 w-4 text-primary" />
                  <p className="text-xs text-muted-foreground font-medium">Duration</p>
                </div>
                <p className="text-2xl font-bold">{formatDuration(duration)}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Log New Race */}
      <Card>
        <CardHeader>
          <CardTitle>Log Race Details</CardTitle>
          <CardDescription>Record race information and conditions</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="race_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Race Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Spring Regatta 2025" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="race_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="Marina Bay" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Label>Boat Class</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setUseCustomClass(!useCustomClass)}
                    >
                      {useCustomClass ? "Use List" : "Custom"}
                    </Button>
                  </div>

                  {useCustomClass ? (
                    <FormField
                      control={form.control}
                      name="custom_boat_class"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Enter your boat class" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ) : (
                    <FormField
                      control={form.control}
                      name="boat_class_id"
                      render={({ field }) => (
                        <FormItem>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select from 50+ classes" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="max-h-[300px]">
                              {boatClasses.map((boatClass) => (
                                <SelectItem key={boatClass.id} value={boatClass.id}>
                                  {boatClass.class_name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="wind_speed_knots"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1">
                        <Wind className="h-3 w-3" />
                        Wind Speed (knots)
                      </FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="15" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="wind_direction"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Wind Direction</FormLabel>
                      <FormControl>
                        <Input placeholder="N, NE, E..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="duration_minutes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Duration (min)
                      </FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="45" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="placement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1">
                        <Award className="h-3 w-3" />
                        Placement
                      </FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="3" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="total_boats"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Boats</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="15" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="avg_speed_knots"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        Avg Speed (knots)
                      </FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" placeholder="6.5" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="conditions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Conditions & Notes</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Sea state, tactics used, key moments..."
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Rig Setup Section */}
              <Collapsible open={showRigSetup} onOpenChange={setShowRigSetup}>
                <CollapsibleTrigger asChild>
                  <Button type="button" variant="outline" className="w-full">
                    <Settings2 className="mr-2 h-4 w-4" />
                    {showRigSetup ? "Hide" : "Add"} Rig Setup (for performance tracking)
                    <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${showRigSetup ? 'rotate-180' : ''}`} />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-4 pt-4">
                  {selectedWindRange && boatSetups.length > 0 && (
                    <div className="p-3 bg-primary/10 border border-primary/30 rounded-lg flex items-start gap-2">
                      <Settings2 className="h-4 w-4 text-primary mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-primary">Auto-Loaded Rig Settings</p>
                        <p className="text-xs text-muted-foreground">
                          Configuration for {selectedWindRange} knots loaded from your saved boat setups
                        </p>
                      </div>
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground">
                    Track your rig settings to analyze how they affect race performance
                  </p>

                  <FormField
                    control={form.control}
                    name="sailmaker"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sailmaker</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select sailmaker" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-[300px]">
                            {sailMakers.map((maker) => (
                              <SelectItem key={maker.id} value={maker.maker_name}>
                                {maker.maker_name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="mast_rake"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mast Rake</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 6530mm" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="shroud_tension"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Shroud Tension</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., PT 18" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="forestay"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Forestay</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Neutral" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="backstay"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Backstay</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Medium" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <FormField
                      control={form.control}
                      name="jib_lead"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Jib Lead</FormLabel>
                          <FormControl>
                            <Input placeholder="Hole #" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="outhaul"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Outhaul</FormLabel>
                          <FormControl>
                            <Input placeholder="Setting" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="cunningham"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cunningham</FormLabel>
                          <FormControl>
                            <Input placeholder="Setting" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <FormField
                      control={form.control}
                      name="vang"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Vang</FormLabel>
                          <FormControl>
                            <Input placeholder="Setting" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="traveler"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Traveler</FormLabel>
                          <FormControl>
                            <Input placeholder="Position" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="mainsheet"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mainsheet</FormLabel>
                          <FormControl>
                            <Input placeholder="Tension" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-4">
                    <FormField
                      control={form.control}
                      name="rig_tension_inner_pt"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Inner PT</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="18" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="rig_tension_inner_kg"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Inner Kg</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="200" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="rig_tension_outer_pt"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Outer PT</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="22" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="rig_tension_outer_kg"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Outer Kg</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="250" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-primary to-primary-light"
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save Race"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RaceTracking;
