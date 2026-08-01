import type { Metadata } from "next";
import "./globals.css";

const publicUrl = "https://saahirvazirani.github.io/hoagiespaces";

export const metadata: Metadata = {
  metadataBase: new URL(publicUrl),
  title: "HoagieSpaces — Find your space at Princeton",
  description: "Student-powered, real-time study space matching across Princeton University.",
  icons: { icon: `${publicUrl}/favicon.svg`, shortcut: `${publicUrl}/favicon.svg` },
  openGraph: {
    title: "HoagieSpaces",
    description: "Your next study spot is already waiting.",
    url: publicUrl,
    images: [{ url: `${publicUrl}/og-v2.png`, width: 1200, height: 630, alt: "HoagieSpaces first-year group study finder" }],
  },
  twitter: { card: "summary_large_image", title: "HoagieSpaces", description: "Find a place your whole group can use.", images: [`${publicUrl}/og-v2.png`] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
