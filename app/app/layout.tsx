import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Secret Santa Letters - Aztec",
  description: "Send anonymous encrypted Christmas messages on Aztec",
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
