'use client';

import { useEffect } from "react";
import type { ReactNode } from "react";

export default function NexusLayout({ children }: { children: ReactNode }) {
  useEffect(() => {
    document.body.classList.add("nexus-mode");
    return () => document.body.classList.remove("nexus-mode");
  }, []);

  return (
    <div className="nexus-theme">
      {children}
    </div>
  );
}
