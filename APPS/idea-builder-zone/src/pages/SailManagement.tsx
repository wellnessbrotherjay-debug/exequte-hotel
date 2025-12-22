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
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ExternalLink, Plus, TrendingUp, Star, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const sailSchema = z.object({
  sail_name: z.string().min(1, "Sail name is required"),
  sail_type: z.string().min(1, "Sail type is required"),
  sail_maker_id: z.string().optional(),
  material: z.string().optional(),
  condition: z.string().optional(),
  size_sqm: z.coerce.number().optional(),
  purchase_date: z.string().optional(),
  boat_class_id: z.string().optional(),
  notes: z.string().optional(),
});

interface SailMaker {
  id: string;
  maker_name: string;
  website_url?: string;
  specialty?: string;
}

interface BoatClass {
  id: string;
  class_name: string;
}

interface Sail {
  id: string;
  sail_name: string;
  sail_type: string;
  material?: string;
  condition?: string;
  size_sqm?: number;
  purchase_date?: string;
  notes?: string;
  sail_maker_id?: string;
  sail_makers?: { maker_name: string };
  boat_class_id?: string;
  boat_classes?: { class_name: string };
}

const SailManagement = () => {
  const { toast } = useToast();
  const [sailMakers, setSailMakers] = useState<SailMaker[]>([]);
  const [boatClasses, setBoatClasses] = useState<BoatClass[]>([]);
  const [mySails, setMySails] = useState<Sail[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof sailSchema>>({
    resolver: zodResolver(sailSchema),
    defaultValues: {
      sail_name: "",
      sail_type: "",
      condition: "good",
    },
  });

  useEffect(() => {
    fetchSailMakers();
    fetchBoatClasses();
    fetchMySails();
  }, []);

  const fetchSailMakers = async () => {
    const { data, error } = await supabase
      .from("sail_makers")
      .select("*")
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

  const fetchMySails = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("sails")
      .select("*, sail_makers(maker_name), boat_classes(class_name)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching sails:", error);
    } else {
      setMySails(data || []);
    }
  };

  const onSubmit = async (values: z.infer<typeof sailSchema>) => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to add sails",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.from("sails").insert({
        user_id: user.id,
        sail_name: values.sail_name,
        sail_type: values.sail_type,
        sail_maker_id: values.sail_maker_id || null,
        material: values.material,
        condition: values.condition,
        size_sqm: values.size_sqm,
        purchase_date: values.purchase_date || null,
        boat_class_id: values.boat_class_id || null,
        notes: values.notes,
      });

      if (error) throw error;

      toast({
        title: "Sail Added!",
        description: "Your sail has been added to inventory",
      });
      
      form.reset();
      setShowAddForm(false);
      fetchMySails();
    } catch (error: any) {
      toast({
        title: "Error Adding Sail",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSail = async (id: string) => {
    const { error } = await supabase
      .from("sails")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete sail",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Deleted",
        description: "Sail removed from inventory",
      });
      fetchMySails();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Sail Management</h2>
          <p className="text-muted-foreground">Track your sail inventory and performance</p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="mr-2 h-4 w-4" />
          {showAddForm ? "Cancel" : "Add Sail"}
        </Button>
      </div>

      {/* Sail Makers Directory */}
      <Card>
        <CardHeader>
          <CardTitle>Sail Makers Directory</CardTitle>
          <CardDescription>Leading sailmakers with direct links to their websites</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {sailMakers.map((maker) => (
              <div
                key={maker.id}
                className="flex items-start justify-between p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
              >
                <div className="space-y-1 flex-1">
                  <h3 className="font-semibold">{maker.maker_name}</h3>
                  <p className="text-sm text-muted-foreground">{maker.specialty}</p>
                </div>
                {maker.website_url && (
                  <a
                    href={maker.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    Visit
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add New Sail Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add Sail to Inventory
            </CardTitle>
            <CardDescription>Log details about your sails</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="sail_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sail Name/ID *</FormLabel>
                        <FormControl>
                          <Input placeholder="Main - 2024" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="sail_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sail Type *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Main">Main</SelectItem>
                            <SelectItem value="Jib">Jib</SelectItem>
                            <SelectItem value="Genoa">Genoa</SelectItem>
                            <SelectItem value="Spinnaker">Spinnaker</SelectItem>
                            <SelectItem value="Gennaker">Gennaker</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="sail_maker_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sail Maker</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select maker" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {sailMakers.map((maker) => (
                              <SelectItem key={maker.id} value={maker.id}>
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
                    name="material"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Material</FormLabel>
                        <FormControl>
                          <Input placeholder="3Di, Dacron, Mylar..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="purchase_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Purchase Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="size_sqm"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Size (sq m)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.1" placeholder="25.5" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="condition"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Condition</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="excellent">Excellent</SelectItem>
                            <SelectItem value="good">Good</SelectItem>
                            <SelectItem value="fair">Fair</SelectItem>
                            <SelectItem value="poor">Poor</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="boat_class_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Boat Class (Optional)</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select boat class" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
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

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Special features, when to use, maintenance history..."
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-primary to-primary-light"
                  disabled={isLoading}
                >
                  {isLoading ? "Adding..." : "Add to Inventory"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      {/* My Sails Inventory */}
      <Card>
        <CardHeader>
          <CardTitle>My Sails ({mySails.length})</CardTitle>
          <CardDescription>Your sail inventory</CardDescription>
        </CardHeader>
        <CardContent>
          {mySails.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No sails in your inventory yet.</p>
              <p className="text-sm">Click "Add Sail" to get started!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {mySails.map((sail) => (
                <div
                  key={sail.id}
                  className="flex items-start gap-4 p-4 rounded-lg border border-border hover:border-primary/20 transition-colors"
                >
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-primary">{sail.sail_type[0]}</span>
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{sail.sail_name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {sail.sail_makers?.maker_name || "Unknown maker"} 
                          {sail.material && ` • ${sail.material}`}
                        </p>
                        {sail.boat_classes?.class_name && (
                          <p className="text-sm text-muted-foreground">
                            For: {sail.boat_classes.class_name}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {sail.condition && (
                          <Badge variant={sail.condition === "excellent" ? "default" : "secondary"}>
                            {sail.condition}
                          </Badge>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteSail(sail.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                    {sail.notes && (
                      <p className="text-sm text-muted-foreground">{sail.notes}</p>
                    )}
                    {sail.size_sqm && (
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Size: {sail.size_sqm} m²</span>
                        {sail.purchase_date && (
                          <span>Purchased: {new Date(sail.purchase_date).toLocaleDateString()}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SailManagement;
