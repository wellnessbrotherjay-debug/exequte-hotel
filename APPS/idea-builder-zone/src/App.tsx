import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import racefitLogo from "./assets/racefit-logo.png";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Community from "./pages/Community";
import Upgrade from "./pages/Upgrade";
import Body from "./pages/Body";
import Boat from "./pages/Boat";
import BoatSetup from "./pages/BoatSetup";
import Mindset from "./pages/Mindset";
import WorkoutTracker from "./pages/WorkoutTracker";
import NutritionTargets from "./pages/NutritionTargets";
import FoodTracking from "./pages/FoodTracking";
import WorkoutHistory from "./pages/WorkoutHistory";
import NotFound from "./pages/NotFound";
import DebugEnv from "./pages/DebugEnv";


import RaceTracking from "./pages/RaceTracking";

const App = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    {/* RaceFit Logo at top center */}
    <div style={{ 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center", 
      marginTop: "20px", 
      marginBottom: "10px" 
    }}>
      <img 
        src={racefitLogo} 
        alt="RaceFit Logo" 
        style={{ 
          height: "180px", 
          maxWidth: "600px", 
          objectFit: "contain" 
        }} 
      />
    </div>

    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/community" element={<Community />} />
        <Route path="/upgrade" element={<Upgrade />} />
        <Route path="/body" element={<Body />} />
        <Route path="/boat" element={<Boat />} />
        <Route path="/boat-setup" element={<BoatSetup />} />
        <Route path="/mindset" element={<Mindset />} />
        <Route path="/workout-tracker" element={<WorkoutTracker />} />
        <Route path="/nutrition-targets" element={<NutritionTargets />} />
        <Route path="/food-tracking" element={<FoodTracking />} />
        <Route path="/workout-history" element={<WorkoutHistory />} />


        <Route path="/race-tracking" element={<RaceTracking />} />
        <Route path="/debug-env" element={<DebugEnv />} />

        {/* Catch-all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  </TooltipProvider>
);

export default App;
