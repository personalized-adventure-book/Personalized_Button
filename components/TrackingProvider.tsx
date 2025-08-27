'use client';

import React, { createContext, useContext, useRef, useEffect } from 'react';
import comprehensiveTracker from '@/utils/comprehensiveTracker';
import { usePathname } from 'next/navigation';

interface TrackingContextType {
  trackPageView: (pageName?: string) => void;
  trackButtonClick: (buttonName: string, additionalData?: any) => void;
  trackFormSubmit: (formName: string, formData?: any) => void;
  trackError: (error: string, context?: string) => void;
  trackCustomEvent: (eventName: string, data?: any) => void;
  trackLanguageChange: (newLanguage: string, oldLanguage: string) => void;
  trackThemeChange: (oldTheme?: string, newTheme?: string) => void;
  trackModalOpen: (modalName: string) => void;
  trackModalClose: (modalName: string, duration?: number | string) => void;
  trackSearchAction: (query: string, results?: number) => void;
  trackFormStart: (formData?: any) => void;
  trackFormStep: (step: any, timeOnStep?: any) => void;
  trackFormStepStart: (step: any, totalSteps?: any) => void;
  trackFormSubmission: (data?: any) => void;
  trackCancelAction: (action?: string, data?: any) => void;
  trackDraftSave: (data?: any) => void;
  trackDraftLoad: (data?: any) => void;
  trackFormInputDebounced: (fieldName: string, value: any, stepNumber?: number, delayMs?: number) => void;
  trackFormInputBlur: (fieldName: string, value: any, stepNumber?: number) => void;
}

const TrackingContext = createContext<TrackingContextType | null>(null);

export function TrackingProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isInitialized = useRef(false);

  useEffect(() => {
    if (!isInitialized.current) {
      // Initialize the tracking service
      comprehensiveTracker.initialize();
      isInitialized.current = true;
      
      // Track initial page view
      comprehensiveTracker.trackPageView();
    }
  }, []);

  // Track page changes
  useEffect(() => {
    if (isInitialized.current) {
      comprehensiveTracker.trackPageView(pathname);
    }
  }, [pathname]);

  const trackingApi: TrackingContextType = {
    trackPageView: (pageName?: string) => comprehensiveTracker.trackPageView(pageName),
    trackButtonClick: (buttonName: string, additionalData?: any) => 
      comprehensiveTracker.trackButtonClick(buttonName, additionalData),
    trackFormSubmit: (formName: string, formData?: any) => 
      comprehensiveTracker.trackFormSubmit(formName, formData),
    trackError: (error: string, context?: string) => 
      comprehensiveTracker.trackError(error, context),
    trackCustomEvent: (eventName: string, data?: any) => 
      comprehensiveTracker.trackCustomEvent(eventName, data),
    trackLanguageChange: (newLanguage: string, oldLanguage: string) => 
      comprehensiveTracker.trackLanguageChange(oldLanguage, newLanguage),
    trackThemeChange: (oldTheme?: string, newTheme?: string) => 
      comprehensiveTracker.trackThemeChange(oldTheme || 'unknown', newTheme || 'unknown'),
    trackModalOpen: (modalName: string) => 
      comprehensiveTracker.trackModalOpen(modalName),
    trackModalClose: (modalName: string, duration?: number | string) => 
      comprehensiveTracker.trackModalClose(modalName, duration?.toString() || '0'),
    trackSearchAction: (query: string, results?: number) => 
      comprehensiveTracker.trackSearchAction(query, results),
    trackFormStart: (formData?: any) => 
      comprehensiveTracker.trackFormStart(formData),
    trackFormStep: (step: any, timeOnStep?: any) => 
      comprehensiveTracker.trackFormStep(step, timeOnStep),
    trackFormStepStart: (step: any, totalSteps?: any) => 
      comprehensiveTracker.trackFormStepStart(step, totalSteps),
    trackFormSubmission: (data?: any) => 
      comprehensiveTracker.trackFormSubmission(data),
    trackCancelAction: (action?: string, data?: any) => 
      comprehensiveTracker.trackCancelAction(action || 'unknown', data),
    trackDraftSave: (data?: any) => 
      comprehensiveTracker.trackDraftSave(data),
    trackDraftLoad: (data?: any) => 
      comprehensiveTracker.trackDraftLoad(data),
    trackFormInputDebounced: (fieldName: string, value: any, stepNumber?: number, delayMs?: number) =>
      comprehensiveTracker.trackFormInputDebounced(fieldName, value, stepNumber, delayMs),
    trackFormInputBlur: (fieldName: string, value: any, stepNumber?: number) =>
      comprehensiveTracker.trackFormInputBlur(fieldName, value, stepNumber),
  };

  return (
    <TrackingContext.Provider value={trackingApi}>
      {children}
    </TrackingContext.Provider>
  );
}

export function useTracking() {
  const context = useContext(TrackingContext);
  if (!context) {
    throw new Error('useTracking must be used within a TrackingProvider');
  }
  return context;
}
