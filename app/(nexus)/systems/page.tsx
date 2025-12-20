'use client';

import Navigation from "../../../hotel-nexus/components/Navigation";
import Footer from "../../../hotel-nexus/components/Footer";
import { ArrowRight, Zap, Utensils, Users, BarChart3 } from "lucide-react";
import { Button } from "../../../hotel-nexus/components/ui/button";

export default function SystemsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-muted to-background">
        <div className="max-w-[1400px] mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-foreground">
            Integrated Wellness Systems for Hotels
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto">
            Seamlessly connecting fitness, nutrition, and hospitality into one intelligent ecosystem.
          </p>
        </div>
      </section>

      {/* Overview */}
      <section className="py-20 px-6">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Overview</h2>
          <p className="text-lg text-muted-foreground text-center max-w-4xl mx-auto leading-relaxed">
            Hotel Fit Solutions brings together all aspects of hotel wellness into one modular platform.
            From in-room workouts to personalized nutrition menus, every system integrates into your hotel's
            existing infrastructure and guest experience.
          </p>
        </div>
      </section>

      {/* Connected Ecosystem */}
      <section className="py-20 px-6 bg-muted">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center">Connected Ecosystem</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <div className="bg-white rounded-lg p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/60 mb-6">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">Workouts & Performance</h3>
              <p className="text-muted-foreground">
                In-room and gym-based programs managed via QR or TV interface with real-time tracking.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/60 mb-6">
                <Utensils className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">Nutrition & Dining</h3>
              <p className="text-muted-foreground">
                Menu APIs connect guest dietary data to hotel restaurant or room service for macro-friendly meals.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/60 mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">Membership & Loyalty</h3>
              <p className="text-muted-foreground">
                Guests access their profiles, points, and progress across multiple visits and properties.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/60 mb-6">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">Hotel Dashboard</h3>
              <p className="text-muted-foreground">
                Central management for analytics, reports, and engagement insights across all wellness touchpoints.
              </p>
            </div>
          </div>

          {/* Advanced Tracking Systems */}
          <div className="mt-16 grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-primary/5 to-white rounded-lg p-8 border-2 border-primary/20">
              <h3 className="text-2xl font-bold mb-4">Heart Rate Monitoring System</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Custom heart rate monitors provided for gym use. Real-time data tracking displays each guest's heart rate zone,
                calories burned, and workout intensity on facility screens. Full workout history logged and accessible through
                guest profiles.
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Zap className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Live heart rate zone tracking during workouts</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Calories burned and intensity metrics</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Complete workout history and performance logs</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-primary/5 to-white rounded-lg p-8 border-2 border-primary/20">
              <h3 className="text-2xl font-bold mb-4">3D Body Scanning Integration</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                State-of-the-art 3D body scanning technology tracks guest transformation throughout their stay.
                Measure body composition, body fat percentage, and key metrics with precision scanning.
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Zap className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Full body composition analysis and body fat tracking</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Progress tracking across multiple visits</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Integrated with workout logs and performance data</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Custom Integration */}
      <section className="py-20 px-6">
        <div className="max-w-[1200px] mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Custom Integration</h2>
          <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-12">
            We can connect with your current property systems — PMS, CRM, POS, dining, and spa —
            so that wellness data enhances every department.
          </p>

          {/* Workflow Diagram */}
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 mb-12">
            <div className="bg-primary text-white px-6 py-4 rounded-lg font-semibold">Guest</div>
            <ArrowRight className="text-primary" />
            <div className="bg-primary text-white px-6 py-4 rounded-lg font-semibold">Room</div>
            <ArrowRight className="text-primary" />
            <div className="bg-primary text-white px-6 py-4 rounded-lg font-semibold">Restaurant</div>
            <ArrowRight className="text-primary" />
            <div className="bg-primary text-white px-6 py-4 rounded-lg font-semibold">Spa</div>
            <ArrowRight className="text-primary" />
            <div className="bg-primary text-white px-6 py-4 rounded-lg font-semibold">Hotel Dashboard</div>
          </div>

          <Button size="lg">See Integration Examples</Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
