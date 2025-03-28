import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Paycrest Payment App",
  description: "A payment app for SMEs using Paycrest Sender API",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}