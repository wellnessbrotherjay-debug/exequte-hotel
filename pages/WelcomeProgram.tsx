import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const WelcomeProgram = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome to the Program</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Welcome! You're now part of Exequte Hotel's comprehensive fitness
            and analytics platform.
          </p>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
            <li>Access to all workout displays</li>
            <li>Real-time heart rate monitoring</li>
            <li>Financial analytics dashboard</li>
            <li>Complete reporting suite</li>
          </ul>
          <div className="space-y-2">
            <Link to="/success">
              <Button className="w-full">Continue to Success</Button>
            </Link>
            <Link to="/">
              <Button variant="outline" className="w-full">
                Back to Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WelcomeProgram;
