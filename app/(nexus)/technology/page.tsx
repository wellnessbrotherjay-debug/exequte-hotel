'use client';

import Navigation from "../../../hotel-nexus/components/Navigation";
import Footer from "../../../hotel-nexus/components/Footer";
import { Monitor, Smartphone, Tv, Watch, Cloud, Shield, Zap, Globe } from "lucide-react";
import { Button } from "../../../hotel-nexus/components/ui/button";
import { nexusAssets } from "../../../hotel-nexus/lib/assets";

export default function TechnologyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-muted to-background">
        <div className="max-w-[1400px] mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-foreground">
            Technology That Redefines Hotel Wellness
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto">
            Smart devices, secure cloud, and AI personalization — all designed for hospitality.
          </p>
        </div>
      </section>

      {/* Architecture Overview */}
      <section className="py-20 px-6">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Architecture Overview</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/60 mb-6">
                <Cloud className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">Scalable Infrastructure</h3>
              <p className="text-muted-foreground">
                Built on enterprise-grade cloud architecture ensuring reliable, secure performance at any scale.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/60 mb-6">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">Multi-Property Ready</h3>
              <p className="text-muted-foreground">
                Designed for multi-property rollout (1 hotel → 100+ hotels).
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/60 mb-6">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">Secure & Reliable</h3>
              <p className="text-muted-foreground">
                Supports offline mode and multilingual interfaces with enterprise-grade security.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Hardware Integration */}
      <section className="py-20 px-6 bg-muted">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Hardware Integration</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-lg p-6 text-center shadow-lg">
              <Tv className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-bold mb-2">Any TV System</h3>
              <p className="text-sm text-muted-foreground">Works on any hotel TV or display</p>
            </div>

            <div className="bg-white rounded-lg p-6 text-center shadow-lg">
              <Monitor className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-bold mb-2">Tablet & iPad</h3>
              <p className="text-sm text-muted-foreground">Full compatibility with hotel tablets</p>
            </div>

            <div className="bg-white rounded-lg p-6 text-center shadow-lg">
              <Watch className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-bold mb-2">Wearables</h3>
              <p className="text-sm text-muted-foreground">Apple Watch, Fitbit, Garmin integration</p>
            </div>
          </div>

          {/* Advanced Hardware Systems */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary">
                  <Watch className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold">Custom Heart Rate Monitors</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                We provide custom heart rate monitoring systems for your gym space. Guests wear our monitors during workouts,
                with real-time data displayed on screens throughout the facility. Track heart rate zones, calories burned,
                and intensity levels—creating competitive energy and accountability.
              </p>
            </div>

            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold">3D Body Scanning</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Integrated 3D body scanning allows guests to track their transformation journey. Scan on arrival to measure
                body composition, body fat percentage, and key metrics. Return scans show progress over time—paired with
                workout logs, heart rate data, and performance tracking throughout their stay.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Software Features */}
      <section className="py-20 px-6">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Software Features</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-8">
              <Zap className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-3">Auto-Updating Content</h3>
              <p className="text-muted-foreground">
                AI-powered content library updates automatically with new workouts, challenges, and programs.
              </p>
            </div>

            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-8">
              <Shield className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-3">Secure User Profiles</h3>
              <p className="text-muted-foreground">
                Encrypted guest profiles that sync across properties for returning visitors.
              </p>
            </div>

            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-8">
              <Monitor className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-3">Analytics Dashboard</h3>
              <p className="text-muted-foreground">
                Real-time insights into guest usage, engagement patterns, and wellness ROI.
              </p>
            </div>

            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-8">
              <Globe className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-3">White-Label UI</h3>
              <p className="text-muted-foreground">
                Custom animations, colors, and branding to match each hotel's unique identity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Mockups */}
      <section className="py-20 px-6 bg-muted">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center">Interface Showcase</h2>

          <div className="grid lg:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Room Screen</h3>
              <img
                src={nexusAssets.warriorStations}
                alt="In-room fitness interface"
                className="w-full rounded-lg shadow-xl border border-border"
              />
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4">Performance Tracking</h3>
              <img
                src={nexusAssets.heartRateMonitoring}
                alt="Heart rate and performance monitoring"
                className="w-full rounded-lg shadow-xl border border-border"
              />
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4">Management Dashboard</h3>
              <img
                src={nexusAssets.dashboard}
                alt="Hotel management analytics dashboard"
                className="w-full rounded-lg shadow-xl border border-border"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-[1200px] mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to See It In Action?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Schedule a technical demo to explore how our platform integrates with your existing systems.
          </p>
          <Button size="lg">Book a Technical Demo</Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
