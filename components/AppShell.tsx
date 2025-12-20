"use client";

import { usePathname } from "next/navigation";
import HomeButton from "@/components/HomeButton";
import VenueSwitcher from "@/components/VenueSwitcher";

export default function AppShell() {
    const pathname = usePathname();

    // Don't show app shell on the marketing landing page (root path)
    if (pathname === "/") {
        return null;
    }

    return (
        <div className="app-shell-chrome fixed left-4 top-4 z-50 flex items-center gap-3">
            <HomeButton />
            <VenueSwitcher />
        </div>
    );
}
