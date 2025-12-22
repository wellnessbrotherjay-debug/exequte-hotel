import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Sailboat, Wind, Settings2, Save, Plus, Eye, Edit, ExternalLink, Wand2, MessageCircle, X, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const boatSetupSchema = z.object({
  boat_class_id: z.string().optional(),
  custom_boat_class: z.string().optional(),
  sailmaker: z.string().optional(),
  wind_band: z.string().min(1, "Wind band is required"),
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
  notes: z.string().optional(),
  reference_link: z.string().url().optional().or(z.literal('')),
});

interface BoatClass {
  id: string;
  class_name: string;
}

interface BoatSetup {
  id: string;
  wind_band: string;
  sailmaker?: string;
  boat_class_id?: string;
  boat_classes?: { class_name: string };
  custom_boat_class?: string;
  mast_rake?: string;
  shroud_tension?: string;
  forestay?: string;
  backstay?: string;
  jib_lead?: string;
  outhaul?: string;
  cunningham?: string;
  vang?: string;
  traveler?: string;
  mainsheet?: string;
  rig_tension_inner_pt?: number;
  rig_tension_inner_kg?: number;
  rig_tension_outer_pt?: number;
  rig_tension_outer_kg?: number;
  notes?: string;
  reference_link?: string;
}

const WIND_BANDS = [
  "0-5",
  "6-10",
  "11-15",
  "16-20",
  "21-25",
  "26-30"
];

const BoatSetup = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [boatClasses, setBoatClasses] = useState<BoatClass[]>([]);
  const [savedSetups, setSavedSetups] = useState<BoatSetup[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [useCustomClass, setUseCustomClass] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [viewMode, setViewMode] = useState<'reference' | 'manage'>('reference');
  
  // Filters for reference view
  const [selectedBoatClass, setSelectedBoatClass] = useState<string>("all");
  const [selectedSailmaker, setSelectedSailmaker] = useState<string>("all");
  
  // AI chatbot state
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{role: 'user' | 'assistant', content: string}>>([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  
  // AI populate state
  const [isPopulating, setIsPopulating] = useState(false);

  const form = useForm<z.infer<typeof boatSetupSchema>>({
    resolver: zodResolver(boatSetupSchema),
    defaultValues: {
      wind_band: "",
    },
  });

  useEffect(() => {
    fetchBoatClasses();
    fetchSavedSetups();
    fetchSailMakers();
  }, []);

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

  const [sailMakers, setSailMakers] = useState<Array<{ id: string; maker_name: string }>>([]);

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

  const fetchSavedSetups = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("boat_setups")
      .select("*, boat_classes(class_name)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching setups:", error);
    } else {
      setSavedSetups(data || []);
    }
  };

  const onSubmit = async (values: z.infer<typeof boatSetupSchema>) => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to save boat setups",
          variant: "destructive",
        });
        return;
      }

      if (!useCustomClass && !values.boat_class_id) {
        toast({
          title: "Boat Class Required",
          description: "Please select a boat class or enter a custom one",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.from("boat_setups").insert({
        user_id: user.id,
        boat_class_id: useCustomClass ? null : values.boat_class_id,
        custom_boat_class: useCustomClass ? values.custom_boat_class : null,
        sailmaker: values.sailmaker,
        wind_band: values.wind_band,
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
        notes: values.notes,
        reference_link: values.reference_link,
      });

      if (error) throw error;

      toast({
        title: "Setup Saved!",
        description: "Your boat setup configuration has been saved",
      });
      
      form.reset();
      setShowAddForm(false);
      fetchSavedSetups();
      setViewMode('reference'); // Switch to reference view to see the new setup
    } catch (error: any) {
      toast({
        title: "Error Saving Setup",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSetup = async (id: string) => {
    const { error } = await supabase
      .from("boat_setups")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete setup",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Deleted",
        description: "Setup removed successfully",
      });
      fetchSavedSetups();
    }
  };

  const handlePopulateWithAI = async () => {
    if (!boatClasses.length || !sailMakers.length) {
      toast({
        title: "Error",
        description: "Boat classes and sail makers must be loaded first",
        variant: "destructive",
      });
      return;
    }

    // Ask user which boat class to populate
    if (selectedBoatClass === "all") {
      toast({
        title: "Select a Boat Class",
        description: "Please select a specific boat class to generate setups for",
        variant: "destructive",
      });
      return;
    }

    setIsPopulating(true);
    let successCount = 0;
    let errorCount = 0;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const boatClass = boatClasses.find(bc => bc.class_name === selectedBoatClass);
      if (!boatClass) throw new Error("Boat class not found");

      // Generate setups for selected boat class with all sailmakers and wind bands
      for (const sailMaker of sailMakers) {
        for (const windBand of WIND_BANDS) {
          try {
            // Check if setup already exists
            const { data: existing } = await supabase
              .from("boat_setups")
              .select("id")
              .eq("boat_class_id", boatClass.id)
              .eq("sailmaker", sailMaker.maker_name)
              .eq("wind_band", windBand)
              .maybeSingle();

            if (existing) {
              console.log(`Skipping existing setup for ${boatClass.class_name} - ${sailMaker.maker_name} - ${windBand}`);
              continue;
            }

            const { data, error } = await supabase.functions.invoke('generate-boat-setup', {
              body: {
                boatClassName: boatClass.class_name,
                sailMaker: sailMaker.maker_name,
                windBand: windBand
              }
            });

            if (error) {
              console.error('AI function error:', error);
              errorCount++;
              continue;
            }

            // Save to database
            const { error: insertError } = await supabase
              .from("boat_setups")
              .insert({
                user_id: user.id,
                boat_class_id: boatClass.id,
                sailmaker: sailMaker.maker_name,
                wind_band: windBand,
                ...data
              });

            if (insertError) {
              console.error('Insert error:', insertError);
              errorCount++;
            } else {
              successCount++;
            }
          } catch (err) {
            console.error('Error generating setup:', err);
            errorCount++;
          }
        }
      }

      toast({
        title: "Population Complete!",
        description: `Generated ${successCount} setups for ${selectedBoatClass}${errorCount > 0 ? ` (${errorCount} errors)` : ''}`,
      });
      
      fetchSavedSetups();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsPopulating(false);
    }
  };

  const handleSendChatMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage = chatInput;
    setChatInput("");
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsChatLoading(true);

    try {
      // Get current setup context if available
      const currentSetup = filteredSetups.length > 0 ? {
        boatClass: selectedBoatClass !== "all" ? selectedBoatClass : undefined,
        sailmaker: selectedSailmaker !== "all" ? selectedSailmaker : undefined,
        windBand: filteredSetups[0]?.wind_band,
        ...filteredSetups[0]
      } : undefined;

      const { data, error } = await supabase.functions.invoke('boat-tuning-assistant', {
        body: {
          message: userMessage,
          currentSetup
        }
      });

      if (error) throw error;

      setChatMessages(prev => [...prev, { role: 'assistant', content: data.advice }]);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsChatLoading(false);
    }
  };

  // Filter setups based on selected boat class and sailmaker
  const filteredSetups = savedSetups.filter(setup => {
    const matchesBoat = selectedBoatClass === "all" || 
      setup.boat_classes?.class_name === selectedBoatClass || 
      setup.custom_boat_class === selectedBoatClass;
    const matchesSailmaker = selectedSailmaker === "all" || setup.sailmaker === selectedSailmaker;
    return matchesBoat && matchesSailmaker;
  });

  // Get sailmakers that have data for the selected boat class
  const sailmakersWithData = selectedBoatClass === "all"
    ? new Set(savedSetups.map(s => s.sailmaker).filter(Boolean))
    : new Set(
        savedSetups
          .filter(s => {
            const boatMatch = s.boat_classes?.class_name === selectedBoatClass || 
                            s.custom_boat_class === selectedBoatClass;
            return boatMatch && s.sailmaker;
          })
          .map(s => s.sailmaker)
      );

  // Organize setups by wind band for reference view
  const setupsByWindBand = WIND_BANDS.reduce((acc, band) => {
    acc[band] = filteredSetups.find(s => s.wind_band === band);
    return acc;
  }, {} as Record<string, BoatSetup | undefined>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Sailboat className="h-8 w-8 text-primary" />
            Boat Setup
          </h1>
          <p className="text-muted-foreground">Quick reference guide for all wind conditions</p>
        </div>
        <Button variant="outline" onClick={() => navigate("/boat")}>
          Back to Boat
        </Button>
      </div>

      {/* View Mode Toggle */}
      <div className="flex gap-2">
        <Button
          variant={viewMode === 'reference' ? 'default' : 'outline'}
          onClick={() => setViewMode('reference')}
        >
          <Eye className="mr-2 h-4 w-4" />
          Quick Reference
        </Button>
        <Button
          variant={viewMode === 'manage' ? 'default' : 'outline'}
          onClick={() => setViewMode('manage')}
        >
          <Edit className="mr-2 h-4 w-4" />
          Manage Setups
        </Button>
      </div>

      {/* Reference View - Show all wind ranges at once */}
      {viewMode === 'reference' && (
        <div className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Select Configuration</CardTitle>
              <CardDescription>Choose boat class and sailmaker to view setups</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Boat Class</Label>
                  <Select 
                    value={selectedBoatClass} 
                    onValueChange={(value) => {
                      setSelectedBoatClass(value);
                      setSelectedSailmaker("all"); // Reset sailmaker when boat changes
                    }}
                  >
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="All boat classes" />
                    </SelectTrigger>
                    <SelectContent className="bg-background z-50">
                      <SelectItem value="all">All classes</SelectItem>
                      {boatClasses.map((boatClass) => {
                        const hasData = savedSetups.some(s => s.boat_classes?.class_name === boatClass.class_name);
                        return (
                          <SelectItem key={boatClass.id} value={boatClass.class_name}>
                            {boatClass.class_name} {hasData ? "✓" : "(No data)"}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Sailmaker</Label>
                  <Select 
                    value={selectedSailmaker} 
                    onValueChange={setSelectedSailmaker}
                    disabled={selectedBoatClass === "all"}
                  >
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder={selectedBoatClass === "all" ? "Select a boat class first" : "All sailmakers"} />
                    </SelectTrigger>
                    <SelectContent className="bg-background z-50">
                      <SelectItem value="all">All sailmakers</SelectItem>
                      {sailMakers.map((maker) => {
                        const hasData = sailmakersWithData.has(maker.maker_name);
                        return (
                          <SelectItem 
                            key={maker.id} 
                            value={maker.maker_name}
                            disabled={!hasData && selectedBoatClass !== "all"}
                          >
                            {maker.maker_name} {!hasData && selectedBoatClass !== "all" ? "(No data)" : ""}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {selectedBoatClass !== "all" && filteredSetups.length === 0 && (
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">
                    No setup data available for {selectedBoatClass}. Generate AI-powered setups?
                  </p>
                  <Button 
                    size="sm" 
                    onClick={handlePopulateWithAI}
                    disabled={isPopulating}
                  >
                    <Wand2 className="mr-2 h-4 w-4" />
                    {isPopulating ? "Generating..." : `Generate ${selectedBoatClass} Setups`}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Setup Reference Table */}
          <Card>
            <CardHeader>
              <CardTitle>Setup Guide - All Wind Ranges</CardTitle>
              <CardDescription>
                {selectedBoatClass !== "all" ? selectedBoatClass : 'All boats'} • {selectedSailmaker !== "all" ? selectedSailmaker : 'All sailmakers'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-24">Wind (kts)</TableHead>
                      <TableHead>Mast Rake</TableHead>
                      <TableHead>Shroud</TableHead>
                      <TableHead>Forestay</TableHead>
                      <TableHead>Backstay</TableHead>
                      <TableHead>Jib Lead</TableHead>
                      <TableHead>Outhaul</TableHead>
                      <TableHead>Cunningham</TableHead>
                      <TableHead>Vang</TableHead>
                      <TableHead>Traveler</TableHead>
                      <TableHead>Mainsheet</TableHead>
                      <TableHead>Reference</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {WIND_BANDS.map((band) => {
                      const setup = setupsByWindBand[band];
                      return (
                        <TableRow key={band}>
                          <TableCell className="font-medium">
                            <Badge variant="outline">{band}</Badge>
                          </TableCell>
                          <TableCell className="text-sm">{setup?.mast_rake || '-'}</TableCell>
                          <TableCell className="text-sm">{setup?.shroud_tension || '-'}</TableCell>
                          <TableCell className="text-sm">{setup?.forestay || '-'}</TableCell>
                          <TableCell className="text-sm">{setup?.backstay || '-'}</TableCell>
                          <TableCell className="text-sm">{setup?.jib_lead || '-'}</TableCell>
                          <TableCell className="text-sm">{setup?.outhaul || '-'}</TableCell>
                          <TableCell className="text-sm">{setup?.cunningham || '-'}</TableCell>
                          <TableCell className="text-sm">{setup?.vang || '-'}</TableCell>
                          <TableCell className="text-sm">{setup?.traveler || '-'}</TableCell>
                          <TableCell className="text-sm">{setup?.mainsheet || '-'}</TableCell>
                          <TableCell className="text-sm">
                            {setup?.reference_link ? (
                              <a 
                                href={setup.reference_link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-primary hover:underline flex items-center gap-1"
                              >
                                View <ExternalLink className="h-3 w-3" />
                              </a>
                            ) : '-'}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
              {filteredSetups.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No setups found for this configuration. Add setups in Manage mode.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Manage View - Add/Edit/Delete setups */}
      {viewMode === 'manage' && (
        <div className="space-y-6">
          <Card className="border-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wand2 className="h-5 w-5" />
                Generate Setup Data with AI
              </CardTitle>
              <CardDescription>
                To generate AI-powered setup data: Go to "Quick Reference" view, select a boat class with no data, and click "Generate Setups"
              </CardDescription>
            </CardHeader>
          </Card>
          
          <div className="flex gap-2">
            {!showAddForm && (
              <Button onClick={() => setShowAddForm(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Manual Setup
              </Button>
            )}
          </div>

          {showAddForm && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings2 className="h-5 w-5" />
                  New Setup Configuration
                </CardTitle>
                <CardDescription>
                  Create a setup guide for specific wind conditions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Boat Class Selection */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <Label>Boat Class</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setUseCustomClass(!useCustomClass)}
                        >
                          {useCustomClass ? "Use Predefined" : "Use Custom"}
                        </Button>
                      </div>

                      {useCustomClass ? (
                        <FormField
                          control={form.control}
                          name="custom_boat_class"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Custom Boat Class</FormLabel>
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
                              <FormLabel>Select Boat Class</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Choose from 50+ classes" />
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

                    <div className="grid gap-4 md:grid-cols-2">
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
                      <FormField
                        control={form.control}
                        name="wind_band"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-1">
                              <Wind className="h-4 w-4" />
                              Wind Range (knots) *
                            </FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select wind range" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {WIND_BANDS.map(band => (
                                  <SelectItem key={band} value={band}>{band} knots</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Separator />

                    {/* Rig Setup */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Rig Setup</h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="mast_rake"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Mast Rake</FormLabel>
                              <FormControl>
                                <Input placeholder="Measurement or description" {...field} />
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
                                <Input placeholder="Loos PT 18, 22, etc." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="forestay"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Forestay</FormLabel>
                              <FormControl>
                                <Input placeholder="Neutral, Slack, Tight" {...field} />
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
                                <Input placeholder="Setting or tension" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Sail Controls */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Sail Controls</h3>
                      <div className="grid gap-4 md:grid-cols-3">
                        <FormField
                          control={form.control}
                          name="jib_lead"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Jib Lead</FormLabel>
                              <FormControl>
                                <Input placeholder="Hole position" {...field} />
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
                                <Input placeholder="Ease, Flat, etc." {...field} />
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
                                <Input placeholder="Wrinkle visible, smooth luff" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="vang"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Vang</FormLabel>
                              <FormControl>
                                <Input placeholder="Loose, Medium, Hard" {...field} />
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
                                <Input placeholder="Tension setting" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Rig Tension */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Rig Tension Measurements</h3>
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
                    </div>

                    {/* Notes */}
                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notes</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Additional setup notes, crew weight, trim tips..."
                              className="min-h-20"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Reference Link */}
                    <FormField
                      control={form.control}
                      name="reference_link"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Reference Link (Optional)</FormLabel>
                          <FormControl>
                            <Input 
                              type="url"
                              placeholder="https://example.com/tuning-guide"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Link to sailmaker guide, tuning manual, or other documentation
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex gap-2">
                      <Button type="submit" disabled={isLoading}>
                        <Save className="mr-2 h-4 w-4" />
                        {isLoading ? "Saving..." : "Save Setup"}
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}

          {/* Saved Setups List */}
          {savedSetups.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Saved Configurations</CardTitle>
                <CardDescription>All your boat setups</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {savedSetups.map((setup) => (
                    <div
                      key={setup.id}
                      className="flex items-center justify-between p-4 rounded-lg border bg-muted/30"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="default">{setup.wind_band} knots</Badge>
                          <span className="font-semibold">
                            {setup.boat_classes?.class_name || setup.custom_boat_class}
                          </span>
                          {setup.sailmaker && (
                            <Badge variant="outline">{setup.sailmaker}</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {[setup.mast_rake, setup.shroud_tension, setup.forestay].filter(Boolean).join(' • ') || 'No details'}
                        </p>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteSetup(setup.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
      
      {/* AI Tuning Assistant Chatbot */}
      <Sheet open={chatOpen} onOpenChange={setChatOpen}>
        <SheetTrigger asChild>
          <Button 
            className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg"
            size="icon"
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent className="w-full sm:max-w-md flex flex-col">
          <SheetHeader>
            <SheetTitle>AI Tuning Assistant</SheetTitle>
            <SheetDescription>
              Ask about boat handling issues, setup adjustments, or tuning advice
            </SheetDescription>
          </SheetHeader>
          
          <div className="flex-1 overflow-y-auto space-y-4 py-4">
            {chatMessages.length === 0 && (
              <div className="text-sm text-muted-foreground space-y-2">
                <p>Try asking:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>"My boat has lee helm in heavy air, what should I adjust?"</li>
                  <li>"How do I reduce weather helm?"</li>
                  <li>"Boat feels sluggish upwind, any suggestions?"</li>
                </ul>
              </div>
            )}
            {chatMessages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`p-3 rounded-lg ${
                  msg.role === 'user' 
                    ? 'bg-primary text-primary-foreground ml-8' 
                    : 'bg-muted mr-8'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              </div>
            ))}
            {isChatLoading && (
              <div className="bg-muted p-3 rounded-lg mr-8">
                <p className="text-sm text-muted-foreground">Thinking...</p>
              </div>
            )}
          </div>
          
          <div className="flex gap-2 pt-4 border-t">
            <Input
              placeholder="Describe your issue..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendChatMessage();
                }
              }}
              disabled={isChatLoading}
            />
            <Button 
              onClick={handleSendChatMessage} 
              disabled={isChatLoading || !chatInput.trim()}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default BoatSetup;