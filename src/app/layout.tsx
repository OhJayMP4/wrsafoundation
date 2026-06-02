import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { AuthProvider } from "@/context/AuthContext";
import ActivityTicker from "@/components/ActivityTicker";
import PublicNav from "@/components/PublicNav";
import PageLoader from "@/components/PageLoader";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "The Wildlife Pledge Chain | WRSA Foundation",
  description: "A chain-reaction fundraising campaign for wildlife and agriculture.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body>
        <AuthProvider>
          <AppProvider>
            <PageLoader />
            <PublicNav />
            {/* Push content below the fixed nav (64px) + ticker (~38px) */}
            <div style={{ paddingTop: "64px" }}>
              <ActivityTicker />
              {children}
            </div>
          </AppProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
