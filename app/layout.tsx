import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;

  return {
    metadataBase: new URL(origin),
    title: "HoagieSpaces — Find your space at Princeton",
    description: "Student-powered, real-time study space matching across Princeton University.",
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
    openGraph: {
      title: "HoagieSpaces",
      description: "Your next study spot is already waiting.",
      images: [{ url: `${origin}/og.png`, width: 1200, height: 630, alt: "HoagieSpaces live study-space matching" }],
    },
    twitter: { card: "summary_large_image", title: "HoagieSpaces", description: "Your next study spot is already waiting.", images: [`${origin}/og.png`] },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
