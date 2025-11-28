import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hello World Frame",
  description: "Simple Farcaster Miniapp",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}