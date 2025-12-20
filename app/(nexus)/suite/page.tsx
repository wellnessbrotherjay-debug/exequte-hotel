'use client';

import Navigation from "../../../hotel-nexus/components/Navigation";
import Footer from "../../../hotel-nexus/components/Footer";
import TheSuite from "../../../hotel-nexus/components/TheSuite";
import { Button } from "../../../hotel-nexus/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function SuitePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-luxury text-white">
        <div className="max-w-[1400px] mx-auto px-6">
          <Button
            variant="ghost"
            className="text-white/80 hover:text-white mb-8"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-6xl md:text-7xl font-cormorant font-bold mb-6">
            The Complete Suite
          </h1>
          <p className="text-xl text-white/80 max-w-3xl">
            Six integrated modules that work together to transform your hotel into a wellness destination
          </p>
        </div>
      </section>

      <TheSuite />

      {/* Detailed Module Information */}
      <section className="py-24 bg-gradient-subtle">
        <div className="max-w-[1400px] mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-cormorant font-bold text-center mb-16">
            How It All Works Together
          </h2>
          <div className="prose prose-lg max-w-4xl mx-auto">
            <p className="text-muted-foreground text-xl leading-relaxed mb-6">
              Each module in the Hotel Fit Solutions suite is designed to work independently or as part of a unified ecosystem. Data flows seamlessly between systems, creating a cohesive experience for both guests and staff.
            </p>
            <p className="text-muted-foreground text-xl leading-relaxed">
              From the moment a guest books their stay to the time they check out, every touchpoint is enhanced by intelligent automation, personalized content, and real-time analytics.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
