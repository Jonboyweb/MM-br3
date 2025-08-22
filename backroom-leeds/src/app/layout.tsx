import type { Metadata } from "next";
import { Inter, Bebas_Neue, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas-neue",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Backroom Leeds | Premier Prohibition Experience",
  description: "Leeds' hidden speakeasy bar and event space. Interactive table booking, regular events (La Fiesta, Shhh!, Nostalgia), private hire, and bottle service. 18+ only venue with late license until 6am.",
  keywords: "Leeds nightclub, speakeasy bar, table booking, private hire, La Fiesta, Shhh, Nostalgia, prohibition bar, Call Lane Leeds",
  authors: [{ name: "The Backroom Leeds" }],
  creator: "The Backroom Leeds",
  publisher: "The Backroom Leeds",
  openGraph: {
    title: "The Backroom Leeds | Premier Prohibition Experience",
    description: "Leeds' hidden speakeasy bar featuring interactive table booking and regular events",
    url: "https://thebackroomleeds.com",
    siteName: "The Backroom Leeds",
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Backroom Leeds | Premier Prohibition Experience",
    description: "Leeds' hidden speakeasy bar featuring interactive table booking and regular events",
    creator: "@thebackroomleeds",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${bebasNeue.variable} ${playfair.variable} font-body antialiased bg-primary text-primary min-h-screen`}
      >
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
