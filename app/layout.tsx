import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Exequte Hotel",
  description: "Workout application for hotels",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans bg-neutral-950 text-neutral-100">
        {children}
      </body>
    </html>
  );
}
