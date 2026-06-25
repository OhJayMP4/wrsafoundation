import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { AuthProvider } from "@/context/AuthContext";
import { SupporterAuthProvider } from "@/context/SupporterAuthContext";
import PublicNav from "@/components/PublicNav";
import PageLoader from "@/components/PageLoader";
import RootShell from "@/components/RootShell";

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
          <SupporterAuthProvider>
            <AppProvider>
              <PageLoader />
              {/* ActivityTicker hidden for now — re-add <ActivityTicker /> above PublicNav to restore,
                  and revert the top/padding offsets in PublicNav.tsx, RootShell.tsx, globals.css */}
              <PublicNav />
              {/* Shell applies correct padding and renders page + footer */}
              <RootShell>{children}</RootShell>
            </AppProvider>
          </SupporterAuthProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
