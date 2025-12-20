'use client';

import { useState } from "react";
import { Button } from "@/hotel-nexus/components/ui/button";
import { Input } from "@/hotel-nexus/components/ui/input";
import { Textarea } from "@/hotel-nexus/components/ui/textarea";
import { useToast } from "@/hotel-nexus/hooks/use-toast";
import { Linkedin } from "lucide-react";
import { nexusAssets } from "@/hotel-nexus/lib/assets";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    hotel: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message sent!",
      description: "We'll get back to you within 24 hours.",
    });
    setFormData({ name: "", email: "", hotel: "", message: "" });
  };

  return (
    <section id="contact" className="py-32 px-6 bg-white">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid lg:grid-cols-5 gap-12">
          {/* Form - 60% */}
          <div className="lg:col-span-3">
            <div className="animate-fade-in">
              <p className="text-primary text-xs font-semibold uppercase tracking-[0.2em] mb-4">
                PARTNER WITH US
              </p>
              <h2 className="text-4xl md:text-6xl font-bold mb-6 text-foreground uppercase tracking-tight">
                Partner With Hotel Fit Solutions
              </h2>
              <p className="text-lg text-muted-foreground mb-4">
                Join the movement redefining global hospitality wellness.
              </p>
              <p className="text-base text-muted-foreground mb-10">
                Our integration is quick, cost-efficient, and future-proof. Let's discuss how Hotel Fit can work for your property.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Input
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="h-14 bg-white border-border rounded-lg text-base"
                  />
                </div>
                <div>
                  <Input
                    type="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="h-14 bg-white border-border rounded-lg text-base"
                  />
                </div>
                <div>
                  <Input
                    placeholder="Hotel / Company Name"
                    value={formData.hotel}
                    onChange={(e) => setFormData({ ...formData, hotel: e.target.value })}
                    required
                    className="h-14 bg-white border-border rounded-lg text-base"
                  />
                </div>
                <div>
                  <Textarea
                    placeholder="Tell us about your needs..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    className="min-h-[150px] bg-white border-border rounded-lg text-base resize-none"
                  />
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  <Button type="submit" size="lg" className="sm:col-span-2">
                    Send Message
                  </Button>
                  <Button type="button" size="lg" variant="outline" className="border-2">
                    Schedule Meeting
                  </Button>
                </div>
              </form>

              <div className="flex items-center gap-6 mt-10">
                <p className="text-sm text-muted-foreground">Follow us:</p>
                <div className="flex gap-4">
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Linkedin size={24} />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Image - 40% */}
          <div className="lg:col-span-2">
            <div className="h-full min-h-[500px] rounded-lg overflow-hidden animate-fade-in">
              <img
                src={nexusAssets.heroRoom}
                alt="Contact us"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
