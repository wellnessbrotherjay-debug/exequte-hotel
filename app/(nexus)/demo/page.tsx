'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, Video, Menu } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

// Simple placeholders for missing components
const Navigation = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-md border-b border-white/10">
    <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
      <Link href="/" className="text-xl font-bold text-white tracking-widest">
        HOTEL FIT
      </Link>
      <div className="hidden md:flex items-center gap-8">
        <Link href="/brand-book" className="text-sm font-medium text-white/80 hover:text-white transition-colors">
          Brand OS
        </Link>
        <Link href="/marketing" className="text-sm font-medium text-white/80 hover:text-white transition-colors">
          Marketing
        </Link>
        <Button variant="outline" className="text-white border-white/20 hover:bg-white/10">
          Sign In
        </Button>
      </div>
      <Button variant="ghost" size="icon" className="md:hidden text-white">
        <Menu />
      </Button>
    </div>
  </nav>
);

const Footer = () => (
  <footer className="bg-black text-white/60 py-12 border-t border-white/10">
    <div className="max-w-[1400px] mx-auto px-6 text-center">
      <p>&copy; {new Date().getFullYear()} Hotel Fit Solutions. All rights reserved.</p>
    </div>
  </footer>
);

export default function DemoPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    hotel: "",
    phone: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Replaced toast with alert for now to fix build
    alert("Demo Request Submitted! Our team will contact you within 24 hours.");
    setFormData({ name: "", email: "", hotel: "", phone: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-gray-900 to-black text-white">
        <div className="max-w-[1400px] mx-auto px-6 text-center">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 font-serif">
            Book Your Demo
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            See Hotel Fit Solutions in action. Schedule a personalized walkthrough with our team.
          </p>
        </div>
      </section>

      {/* Demo Options */}
      <section className="py-16 bg-white">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center p-6 bg-gray-50 rounded-2xl">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Video className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Live Demo</h3>
              <p className="text-gray-600">30-minute video call with our team</p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-2xl">
              <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Flexible Scheduling</h3>
              <p className="text-gray-600">Choose a time that works for you</p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-2xl">
              <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quick Response</h3>
              <p className="text-gray-600">We'll get back to you within 24 hours</p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Form */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-2xl mx-auto px-6">
          <div className="bg-white border text-gray-900 border-gray-200 rounded-2xl p-8 md:p-12 shadow-xl">
            <h2 className="text-3xl font-bold text-center mb-8 font-serif">
              Request Your Demo
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Full Name *</label>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Smith"
                  className="h-12"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Work Email *</label>
                <Input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@hotel.com"
                  className="h-12"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Hotel Name *</label>
                <Input
                  required
                  value={formData.hotel}
                  onChange={(e) => setFormData({ ...formData, hotel: e.target.value })}
                  placeholder="Grand Hotel & Resort"
                  className="h-12"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Phone Number</label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 123-4567"
                  className="h-12"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Tell us about your needs</label>
                <Textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Number of rooms, specific features you're interested in, timeline, etc."
                  rows={4}
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-6"
              >
                Book Your Demo
              </Button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
