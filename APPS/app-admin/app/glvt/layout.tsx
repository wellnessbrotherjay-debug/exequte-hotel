"use client";

import { useEffect } from "react";
import "./mobile.css";
import { RouterBottomNav } from "./_components/RouterBottomNav";

export default function GlvtLayout({ children }: { children: React.ReactNode }) {
    // Enforce dark mode
    useEffect(() => {
        document.body.style.backgroundColor = "#0a0a0a";
        return () => {
            document.body.style.backgroundColor = "";
        };
    }, []);

    return (
        <div className="min-h-screen w-full flex flex-col bg-[#0a0a0a] text-white">
            {/* App Content */}
            <div className="flex-1 overflow-y-auto pb-24">
                {children}
            </div>

            {/* Bottom Navigation */}
            <div className="fixed bottom-0 w-full z-50">
                <RouterBottomNav />
            </div>
        </div>
    );
}
