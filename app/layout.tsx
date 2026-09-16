import type { Metadata } from "next";
import { IBM_Plex_Sans, Poppins } from "next/font/google";
import "./globals.css";

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-plex-sans",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  applicationName: "Portfolio OS",
  title: "Portfolio OS — Jinwh",
  description: "An interactive design knowledge system for exploring decisions, evidence, and product thinking.",
  metadataBase: new URL("https://os.jinwh.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Portfolio OS — Jinwh",
    description: "An interactive design knowledge system for exploring decisions, evidence, and product thinking.",
    url: "https://os.jinwh.com/",
    siteName: "Portfolio OS",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Portfolio OS — Jinwh",
    description: "An interactive design knowledge system for exploring decisions, evidence, and product thinking.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${ibmPlexSans.variable} ${poppins.variable}`}>
      <body>{children}</body>
    </html>
  );
}
