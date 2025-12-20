'use client';

import { useState, useEffect } from "react";
import { Button } from "@/hotel-nexus/components/ui/button";
import { Calendar } from "lucide-react";

const FloatingDemoButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling past hero section
      setIsVisible(window.scrollY > 600);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToContact = () => {
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      className={`fixed bottom-8 right-8 z-40 transition-all duration-300 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0 pointer-events-none"
      }`}
    >
      <Button
        onClick={scrollToContact}
        size="lg"
        className="shadow-2xl hover:shadow-primary/40"
      >
        <Calendar className="mr-2" />
        Book a Demo
      </Button>
    </div>
  );
};

export default FloatingDemoButton;
