"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect } from "react";

export function LanguageWrapper({ children }: { children: React.ReactNode }) {
  const { language } = useLanguage();

  useEffect(() => {
    const isRTL = language === "🇸🇦"; // Arabic is RTL
    const langCode =
      {
        "🇺🇸": "en",
        "🇫🇷": "fr",
        "🇪🇸": "es",
        "🇩🇪": "de",
        "🇮🇹": "it",
        "🇳🇱": "nl",
        "🇸🇦": "ar",
      }[language] || "en";

    // Update HTML attributes
    document.documentElement.lang = langCode;
    document.documentElement.dir = isRTL ? "rtl" : "ltr";

    // Add RTL class for additional styling if needed
    if (isRTL) {
      document.documentElement.classList.add("rtl");
    } else {
      document.documentElement.classList.remove("rtl");
    }
  }, [language]);

  return <>{children}</>;
}
