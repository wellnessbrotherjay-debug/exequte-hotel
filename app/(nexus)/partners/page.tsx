'use client';

import Navigation from "../../../hotel-nexus/components/Navigation";
import Footer from "../../../hotel-nexus/components/Footer";
import { Button } from "../../../hotel-nexus/components/ui/button";
import { ArrowLeft, Building2, CreditCard, Users, Database } from "lucide-react";

export default function PartnersPage() {
  const integrations = [
    {
      category: "Property Management Systems",
      icon: Building2,
      partners: ["Oracle Opera", "Cloudbeds", "Mews", "Protel", "RoomRaccoon"],
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      category: "Point of Sale Systems",
      icon: CreditCard,
      partners: ["Oracle Micros", "Lightspeed", "Square", "Toast", "Revel"],
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      category: "CRM Platforms",
      icon: Users,
      partners: ["Salesforce", "HubSpot", "Zoho", "Mailchimp", "ActiveCampaign"],
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      category: "Accounting Software",
      icon: Database,
      partners: ["Xero", "QuickBooks", "Sage", "FreshBooks", "Wave"],
      color: "text-amber-600",
      bg: "bg-amber-50",
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
            Integration Partners
          </h1>
          <p className="text-xl text-white/80 max-w-3xl">
            Seamlessly connect with your existing hotel technology stack
          </p>
        </div>
      </section>

      {/* Integration Categories */}
      <section className="py-24 bg-white">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-cormorant font-bold mb-6">
              Works With Your Existing Systems
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our platform integrates with leading hospitality technology providers
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {integrations.map((integration, index) => {
              const Icon = integration.icon;
              return (
                <div key={index} className="bg-luxury-light border-2 border-border rounded-2xl p-8 hover:border-luxury-gold/50 hover:shadow-lg transition-all duration-300">
                  <div className={`w-16 h-16 ${integration.bg} rounded-xl flex items-center justify-center mb-6`}>
                    <Icon className={`w-8 h-8 ${integration.color}`} />
                  </div>
                  <h3 className="text-2xl font-cormorant font-semibold mb-4">{integration.category}</h3>
                  <div className="flex flex-wrap gap-3">
                    {integration.partners.map((partner, pIndex) => (
                      <span key={pIndex} className="px-4 py-2 bg-white border border-border rounded-lg text-sm font-medium hover:border-luxury-gold/50 transition-colors">
                        {partner}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Custom Integration CTA */}
      <section className="py-24 bg-gradient-subtle">
        <div className="max-w-[1400px] mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-cormorant font-bold mb-6">
            Need a Custom Integration?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Our team can build custom integrations for your specific technology stack
          </p>
          <Button size="lg" className="bg-luxury-gold hover:bg-luxury-gold/90 text-luxury-black font-semibold shadow-glow-gold">
            Contact Our Integration Team
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
