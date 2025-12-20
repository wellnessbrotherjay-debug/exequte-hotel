'use client';

export const dynamic = "force-dynamic";

import Navigation from "../hotel-nexus/components/Navigation";
import Hero from "../hotel-nexus/components/Hero";
import CoreIdea from "../hotel-nexus/components/CoreIdea";
import TheSuite from "../hotel-nexus/components/TheSuite";
import DynamicExperiences from "../hotel-nexus/components/DynamicExperiences";
import DepartmentBenefits from "../hotel-nexus/components/DepartmentBenefits";
import TechStack from "../hotel-nexus/components/TechStack";
import BusinessImpact from "../hotel-nexus/components/BusinessImpact";
import PricingTiers from "../hotel-nexus/components/PricingTiers";
import FinalCTA from "../hotel-nexus/components/FinalCTA";
import Footer from "../hotel-nexus/components/Footer";
import FloatingDemoButton from "../hotel-nexus/components/FloatingDemoButton";

export default function NexusHomePage() {
    return (
        <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
            <Navigation />
            <Hero />
            <CoreIdea />
            <TheSuite />
            <DynamicExperiences />
            <DepartmentBenefits />
            <TechStack />
            <BusinessImpact />
            <PricingTiers />
            <FinalCTA />
            <Footer />
            <FloatingDemoButton />
        </div>
    );
}
