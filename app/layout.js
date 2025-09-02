import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "DocSpire - Beautiful Documentation Hub for Teams",
  description:
    "Create beautiful, organized documentation for your business. Collaborate with your team, manage permissions, and keep your docs in one place.",
};

import { Toaster } from "@/components/ui/toaster";

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="lofi">
      

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        
        <Toaster />
      </body>
    </html>
  );
}
