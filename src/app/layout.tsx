import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Numberly — Virtual Numbers", description: "A secure platform for managing virtual phone numbers." };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
