"use client";

import { useEffect } from "react";
import { useUrlId } from "../hooks/useUrlIdStatic";
import { useStaticContent } from "../hooks/useStaticContent";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  DynamicHero,
  DynamicAbout,
  DynamicFeatures,
  DynamicAdventures,
  DynamicExamples,
  DynamicHowItWorks,
  DynamicPricing,
  DynamicCta
} from "@/components/DynamicSections";

export default function HomePage() {
  const { t } = useLanguage();
  const { id, navigateWithId, ensureIdInUrl } = useUrlId();
  const { getContent, loading, error } = useStaticContent();
  const data = getContent(id || 'BT1');

  // Ensure ID is in URL if it exists in sessionStorage
  useEffect(() => {
    ensureIdInUrl();
  }, [ensureIdInUrl]);

  // Handle cross-page navigation to sections
  useEffect(() => {
    const scrollToSection = sessionStorage.getItem("scrollToSection");
    if (scrollToSection) {
      // Clear the stored section ID
      sessionStorage.removeItem("scrollToSection");
      
      // Scroll to the section after a short delay to ensure the page is loaded
      setTimeout(() => {
        const targetElement = document.getElementById(scrollToSection);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  }, []);

  const handleStartCustomizing = () => {
    navigateWithId('/customize');
  };

  // Loading state
  if (loading && !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading content...</p>
        </div>
      </div>
    );
  }

  // Error state - show fallback content
  if (error && !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Unable to Load Content
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Show content when data is available
  if (!data) return null;

  return (
    <main className="relative">
      <DynamicHero data={data} onStartCustomizing={handleStartCustomizing} />
  <DynamicAbout data={data} />
      <DynamicFeatures data={data} />
      <DynamicAdventures data={data} />
      <DynamicExamples data={data} />
      <DynamicHowItWorks data={data} />
      <DynamicPricing data={data} onStartCustomizing={handleStartCustomizing} />
      <DynamicCta data={data} onStartCustomizing={handleStartCustomizing} />
    </main>
  );
}
