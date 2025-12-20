"use client";

import { useEffect } from "react";
import "./mobile.css"; // We'll create this for specific mobile tweaks if needed
import { RouterBottomNav } from "./_components/RouterBottomNav";


export default function GlvtLayout({ children }: { children: React.ReactNode }) {
    // Enforce dark mode and mobile-like body
    useEffect(() => {
        document.body.style.backgroundColor = "#111";
        document.body.style.overflow = "hidden"; // Prevent double scrollbars
        return () => {
            document.body.style.backgroundColor = "";
            document.body.style.overflow = "";
        };
    }, []);

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#111] p-4 font-sans text-white">
            {/* iPhone Frame Simulator */}
            <div className="relative w-full max-w-[400px] h-[850px] bg-black rounded-[50px] border-[8px] border-[#222] shadow-2xl overflow-hidden flex flex-col">

                {/* Dynamic Island / Notch Area */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[30px] bg-black rounded-b-[18px] z-50 flex items-center justify-center">
                    <div className="w-16 h-4 bg-[#111] rounded-full"></div>
                </div>

                {[/* Status Bar Time */]}
                <div className="absolute top-3 left-8 text-xs font-semibold z-40 text-white time-display">9:41</div>

                {[/* Status Bar Icons */]}
                <div className="absolute top-3 right-8 flex gap-1 z-40">
                    <div className="w-4 h-3 bg-white rounded-[2px]"></div>
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>

                {/* App Content */}
                <div className="flex-1 overflow-y-auto no-scrollbar pt-12 pb-24 bg-[#0a0a0a]">
                    {children}
                </div>

                <div className="absolute bottom-0 w-full z-50">
                    <RouterBottomNav />
                </div>

                {/* Home Indicator */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[130px] h-[5px] bg-white/20 rounded-full z-[60] pointer-events-none"></div>
            </div>
        </div>
    );
}
