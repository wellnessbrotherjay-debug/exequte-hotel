import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Watch, Activity, CheckCircle2, Info } from "lucide-react";

const WearableDevices = () => {
  const { toast } = useToast();

  const devices = [
    {
      name: "Apple Watch",
      icon: "⌚",
      description: "Sync workouts, heart rate, and activity data",
      connected: false,
      apiRequired: "HealthKit API",
      setupUrl: "https://developer.apple.com/documentation/healthkit",
    },
    {
      name: "Garmin",
      icon: "📊",
      description: "Connect to Garmin Connect for detailed metrics",
      connected: false,
      apiRequired: "Garmin Health API",
      setupUrl: "https://developer.garmin.com/health-api/overview/",
    },
    {
      name: "Fitbit",
      icon: "🏃",
      description: "Import fitness and sleep data from Fitbit",
      connected: false,
      apiRequired: "Fitbit Web API",
      setupUrl: "https://dev.fitbit.com/build/reference/web-api/",
    },
  ];

  const handleConnect = (deviceName: string) => {
    toast({
      title: "Setup Required",
      description: `To connect ${deviceName}, you'll need to set up OAuth authentication with their API. Check the docs for details.`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Wearable Devices</h2>
        <p className="text-muted-foreground">Connect your fitness trackers for automatic workout data</p>
      </div>

      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">
              Wearable integrations require API keys and OAuth setup with each platform. Once configured, your workout data will sync automatically.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        {devices.map((device, index) => (
          <Card key={index} className="hover:border-primary/50 transition-all">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <div className="text-4xl">{device.icon}</div>
                {device.connected && (
                  <Badge className="bg-green-500">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Connected
                  </Badge>
                )}
              </div>
              <CardTitle>{device.name}</CardTitle>
              <CardDescription>{device.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Required API:</p>
                <Badge variant="outline" className="text-xs">
                  {device.apiRequired}
                </Badge>
              </div>

              <Button 
                onClick={() => handleConnect(device.name)}
                className={
                  device.connected 
                    ? "w-full" 
                    : "w-full bg-gradient-to-r from-primary to-primary-light text-white hover:opacity-90"
                }
                variant={device.connected ? "outline" : "default"}
              >
                {device.connected ? "Disconnect" : "Connect"}
              </Button>

              <a 
                href={device.setupUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block text-xs text-primary hover:underline text-center"
              >
                View Setup Documentation →
              </a>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Features Overview */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            What Gets Synced
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h3 className="font-semibold">During Workouts</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3 w-3 text-primary" />
                  Real-time heart rate monitoring
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3 w-3 text-primary" />
                  Calories burned tracking
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3 w-3 text-primary" />
                  Workout duration and intensity
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3 w-3 text-primary" />
                  Exercise type detection
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Daily Metrics</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3 w-3 text-primary" />
                  Steps and active minutes
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3 w-3 text-primary" />
                  Sleep quality and duration
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3 w-3 text-primary" />
                  Resting heart rate trends
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3 w-3 text-primary" />
                  Recovery metrics
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Technical Setup Info */}
      <Card>
        <CardHeader>
          <CardTitle>Setup Instructions</CardTitle>
          <CardDescription>How to enable wearable integrations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div>
            <h3 className="font-semibold mb-2">1. Register for Developer Access</h3>
            <p className="text-muted-foreground">
              Each platform requires you to create a developer account and register your application to get API credentials.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">2. Configure OAuth</h3>
            <p className="text-muted-foreground">
              Set up OAuth 2.0 authentication to securely connect user accounts. You'll need to add your API keys to Lovable Cloud secrets.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">3. Test the Integration</h3>
            <p className="text-muted-foreground">
              Use the device's testing tools to verify data is flowing correctly before deploying to production.
            </p>
          </div>

          <Card className="border-primary/20 bg-muted/30">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  Need help with setup? Contact support or check our integration guides in the documentation.
                </p>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default WearableDevices;
