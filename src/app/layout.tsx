import type { Metadata, Viewport } from "next";
import { AppProvider } from "@/context/AppContext";
import { MainLayout } from "@/components/MainLayout";
import "./globals.css";

export const metadata: Metadata = {
  title: "LifeOS AI | Your AI Rescue System for High-Stakes Days",
  description: "LifeOS AI is an AI-powered intervention system that helps students and professionals rescue important deadlines before they fail, using explainable predictive intelligence and domain copilots.",
  keywords: ["LifeOS", "AI Productivity", "Deadline Rescue", "Crisis Management", "Save My Day", "Google Cloud AI", "Student Copilot", "Hackathon Copilot"],
  authors: [{ name: "LifeOS AI Team" }],
};

export const viewport: Viewport = {
  themeColor: "#030303",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <head>
        {/* Load premium fonts from Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full bg-[#030303] text-slate-100 flex flex-col antialiased">
        <AppProvider>
          <MainLayout>{children}</MainLayout>
        </AppProvider>
      </body>
    </html>
  );
}
