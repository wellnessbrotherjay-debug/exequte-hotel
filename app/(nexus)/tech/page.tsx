'use client';

import Navigation from "../../../hotel-nexus/components/Navigation";
import Footer from "../../../hotel-nexus/components/Footer";
import TechStack from "../../../hotel-nexus/components/TechStack";
import { Button } from "../../../hotel-nexus/components/ui/button";
import { ArrowLeft, Code, Database, Zap, Shield } from "lucide-react";

export default function TechPage() {
  const features = [
    {
      icon: Code,
      title: "API-First Architecture",
      description: "RESTful and GraphQL APIs for seamless integration with any system",
    },
    {
      icon: Database,
      title: "Real-Time Data Sync",
      description: "Instant updates across all platforms with WebSocket connections",
    },
    {
      icon: Zap,
      title: "High Performance",
      description: "Edge computing and CDN distribution for lightning-fast load times",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "SOC 2 compliant with end-to-end encryption and role-based access",
    },
  ];

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
            Technology Stack
          </h1>
          <p className="text-xl text-white/80 max-w-3xl">
            Enterprise-grade infrastructure designed for scale, security, and performance
          </p>
        </div>
      </section>

      <TechStack />

      {/* Technical Features */}
      <section className="py-24 bg-white">
        <div className="max-w-[1400px] mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-cormorant font-bold text-center mb-16">
            Built for the Enterprise
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-luxury-light border-2 border-border rounded-2xl p-8">
                  <Icon className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-2xl font-cormorant font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* System Architecture */}
      <section className="py-24 bg-gradient-subtle">
        <div className="max-w-[1400px] mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-cormorant font-bold text-center mb-8">
            System Architecture
          </h2>
          <p className="text-xl text-muted-foreground text-center max-w-3xl mx-auto mb-12">
            A modern, scalable architecture that grows with your business
          </p>
          <div className="bg-white border-2 border-border rounded-2xl p-12 max-w-4xl mx-auto">
            <div className="space-y-8">
              <div className="flex items-center gap-6">
                <div className="w-48 h-20 bg-gradient-blue rounded-lg flex items-center justify-center text-white font-semibold">
                  Guest Devices
                </div>
                <div className="flex-1 h-1 bg-gradient-to-r from-primary to-luxury-gold"></div>
                <div className="w-48 h-20 bg-gradient-luxury rounded-lg flex items-center justify-center text-white font-semibold">
                  API Gateway
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-48 h-20 bg-gradient-gold rounded-lg flex items-center justify-center text-luxury-black font-semibold">
                  Hotel Staff
                </div>
                <div className="flex-1 h-1 bg-gradient-to-r from-luxury-gold to-primary"></div>
                <div className="w-48 h-20 bg-gradient-blue rounded-lg flex items-center justify-center text-white font-semibold">
                  Core Services
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-48 h-20 bg-primary/10 border-2 border-primary rounded-lg flex items-center justify-center text-primary font-semibold">
                  Integrations
                </div>
                <div className="flex-1 h-1 bg-gradient-to-r from-primary/50 to-luxury-navy/50"></div>
                <div className="w-48 h-20 bg-luxury-navy rounded-lg flex items-center justify-center text-white font-semibold">
                  Data Layer
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
