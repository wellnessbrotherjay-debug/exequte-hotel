"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootRedirect() {
    const router = useRouter();

    useEffect(() => {
        router.push("/glvt/launch");
    }, [router]);

    return (
        <div className="h-screen w-full flex items-center justify-center bg-black text-white">
            <p className="animate-pulse">Redirecting to GLVT Launch...</p>
        </div>
    );
}
