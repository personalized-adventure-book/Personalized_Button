import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ScrollToTop } from "@/components/ScrollToTop";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { LanguageWrapper } from "@/components/LanguageWrapper";
import { TrackingProvider } from "@/components/TrackingProvider";
import { ConditionalFooter } from "@/components/ConditionalFooter";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MyMood Button - Light Your Personality",
  description:
    "Customize your smart button with personalized lighting effects and controls.",
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <LanguageProvider>
          <LanguageWrapper>
            <ThemeProvider>
              <TrackingProvider>
                <ScrollToTop />
                <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
                  <Header />
                  <main className="flex-1">{children}</main>
                  <ConditionalFooter />
                </div>
              </TrackingProvider>
            </ThemeProvider>
          </LanguageWrapper>
        </LanguageProvider>
      </body>
    </html>
  );
}
