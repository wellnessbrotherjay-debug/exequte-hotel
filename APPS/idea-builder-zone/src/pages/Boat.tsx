import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Anchor, Navigation, Package, Settings2, MapPin, Award, Database } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import RaceTracking from "./RaceTracking";
import SailManagement from "./SailManagement";
import BoatSetup from "./BoatSetup";

const DataLog = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Data Log</CardTitle>
          <CardDescription>View all your sailing data in one place</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Coming soon: Comprehensive data logs for all your races, setups, and performance metrics.</p>
        </CardContent>
      </Card>
    </div>
  );
};

const Boat = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalRaces: 0,
    gpsTracks: 0,
    sailsTracked: 0,
    bestFinish: "-",
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Get race count
    const { count: raceCount } = await supabase
      .from("races")
      .select("*", { count: 'exact', head: true })
      .eq("user_id", user.id);

    // Get GPS track count
    const { count: trackCount } = await supabase
      .from("race_tracks")
      .select("*", { count: 'exact', head: true });

    // Get sail count
    const { count: sailCount } = await supabase
      .from("sails")
      .select("*", { count: 'exact', head: true })
      .eq("user_id", user.id);

    // Get best finish
    const { data: races } = await supabase
      .from("races")
      .select("placement")
      .eq("user_id", user.id)
      .not("placement", "is", null)
      .order("placement", { ascending: true })
      .limit(1);

    setStats({
      totalRaces: raceCount || 0,
      gpsTracks: trackCount || 0,
      sailsTracked: sailCount || 0,
      bestFinish: races && races.length > 0 ? `#${races[0].placement}` : "-",
    });
  };

  const statsDisplay = [
    { label: "Total Races", value: stats.totalRaces.toString(), icon: Anchor, color: "text-primary" },
    { label: "GPS Tracks", value: stats.gpsTracks.toString(), icon: Navigation, color: "text-primary" },
    { label: "Sails Tracked", value: stats.sailsTracked.toString(), icon: Package, color: "text-primary" },
    { label: "Best Finish", value: stats.bestFinish, icon: Award, color: "text-primary" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Boat & Race Management</h1>
        <p className="text-muted-foreground">Track races with GPS, manage sails, setups, and analyze performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-4">
        {statsDisplay.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="overflow-hidden">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="races" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="races" className="flex items-center gap-2">
            <Navigation className="h-4 w-4" />
            Race Tracking
          </TabsTrigger>
          <TabsTrigger value="setup" className="flex items-center gap-2">
            <Settings2 className="h-4 w-4" />
            Boat Setup
          </TabsTrigger>
          <TabsTrigger value="sails" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Sail Management
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Data Log
          </TabsTrigger>
        </TabsList>

        <TabsContent value="races" className="space-y-6">
          <RaceTracking />
        </TabsContent>

        <TabsContent value="setup" className="space-y-6">
          <BoatSetup />
        </TabsContent>

        <TabsContent value="sails" className="space-y-6">
          <SailManagement />
        </TabsContent>

        <TabsContent value="data" className="space-y-6">
          <DataLog />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Boat;
