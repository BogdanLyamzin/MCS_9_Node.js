import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Long polling chat", description: "Long polling demonstration" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="uk"><body>{children}</body></html>;
}
