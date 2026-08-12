import type { Metadata } from "next";
import LanguageProvider from "@/components/LanguageProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Genevieve Yeung — Applied AI Engineer",
  description: "Applied AI engineering across machine learning, data automation, and hardware-aware computing.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><LanguageProvider>{children}</LanguageProvider></body></html>;
}
