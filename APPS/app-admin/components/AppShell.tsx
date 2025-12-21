"use client";

import { usePathname, useSearchParams } from "next/navigation";
import HomeButton from "@/components/HomeButton";
import VenueSwitcher from "@/components/VenueSwitcher";

export default function AppShell() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    
    // Don't show app shell on the marketing landing page (root path)
    if (pathname === "/") {
        return null;
    }
    
    // Don't show app shell in GLVT app (standalone experience)
    if (pathname.startsWith("/glvt")) {
        return null;
    }
    
    // Don't show if coming from GLVT landing (source parameter)
    if (searchParams.get("source") === "glvt_landing") {
        return null;
    }

    return (
        <div className="app-shell-chrome fixed left-4 top-4 z-50 flex items-center gap-3">
            <HomeButton />
            <VenueSwitcher />
        </div>
    );
}
