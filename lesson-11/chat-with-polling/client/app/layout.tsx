import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Polling chat demo",
  description: "A short polling demonstration",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="uk">
      <body>{children}</body>
    </html>
  );
}
