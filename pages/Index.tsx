import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-8 text-center">
        <h1 className="text-4xl md:text-6xl font-bold">
          Welcome to Exequte Hotel
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground">
          Complete Workout Management System with Analytics Platform
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/app">
            <Button size="lg">Analytics Dashboard</Button>
          </Link>
          <Link to="/auth/login">
            <Button size="lg" variant="outline">
              Sign In
            </Button>
          </Link>
          <Link to="/checkout">
            <Button size="lg" variant="outline">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
