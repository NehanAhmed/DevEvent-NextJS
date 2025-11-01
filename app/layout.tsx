import type { Metadata } from "next";
import { Geist, Geist_Mono, Martian_Mono, Schibsted_Grotesk } from "next/font/google";
import "./globals.css";
import LightRays from '../components/LightRays';
import Navbar from "@/components/Navbar";

const schibstedGrotesk = Schibsted_Grotesk({
  variable: "--font-schibsted-grotesk",
  subsets: ["latin"],
});

const martianMono = Martian_Mono({
  variable: "--font-martian-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DevEvent",
  description: "THe hub for every DEv Event you Must'nt miss.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${schibstedGrotesk.variable} min-h-screen ${martianMono.variable} antialiased`}
      >

          <Navbar />
        <div className="absolute inset-0 top-0 z-[-1] min-h-screen">
          <LightRays
            raysOrigin="top-center-offset"
            raysColor="#5dfeca"
            raysSpeed={0.5}

            lightSpread={0.8}
            rayLength={1.2}
            followMouse={false}
            mouseInfluence={0.02}
            noiseAmount={0.0}
            distortion={0.01}
          />

        </div>
        <main>
        {children}
        </main>
      </body>
    </html>
  );
}
