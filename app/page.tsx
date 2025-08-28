"use client";

import { useEffect, useState, Suspense, useCallback, useMemo, useRef } from "react";
import { useUrlId } from "../hooks/useUrlIdStatic";
import { useStaticContent } from "../hooks/useStaticContent";
import { useLanguage } from "@/contexts/LanguageContext";
import { DynamicSectionRenderer } from "@/components/DynamicSectionRenderer";
import { LocalContentData } from "@/hooks/useLocalContent";
import { useDynamicForm } from '@/hooks/useDynamicForm';
import { DynamicFormField } from '@/components/DynamicFormComponents';
import { computePricing, initPricingFromContent } from '@/utils/pricing';
import { PricingProgress } from '@/components/PricingProgress';
import { ArrowLeft, ArrowRight, Save, X, Loader2, Edit3 } from 'lucide-react';
import { useTracking } from '@/components/TrackingProvider';

// Loading component
function LoadingSpinner() {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">{t("ui.loadingContent")}</p>
      </div>
    </div>
  );
}

// Error component
function ErrorDisplay({ error, onRetry }: { error: string; onRetry: () => void }) {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="text-red-500 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {t("ui.unableToLoadContent")}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {error}
        </p>
        <button
          onClick={onRetry}
          className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          {t("ui.retry")}
        </button>
      </div>
    </div>
  );
}

// Main content component (wrapped in Suspense)
function HomePageContent() {
  const { t } = useLanguage();
  const { id, navigateWithId, ensureIdInUrl, mounted } = useUrlId();
  const { getContent, loading: contentLoading, error: contentError } = useStaticContent();
  const { trackFormStart, trackFormStep, trackFormStepStart, trackFormSubmission, trackCancelAction, trackDraftSave, trackDraftLoad, trackModalOpen, trackModalClose } = useTracking();
  // -------------------------------------------------------------
  // Cookie-based draft persistence for homepage embedded form
  // -------------------------------------------------------------
  const DRAFT_COOKIE = 'mymood-home-form-draft';
  const DRAFT_COOKIE_MAX_AGE_DAYS = 30; // retention
  const draftSaveTimeout = useRef<NodeJS.Timeout | null>(null);
  const lastSavedHashRef = useRef<string>('');
  const scrollPctRef = useRef<number>(0);
  const initPersistReadyRef = useRef<boolean>(false);
  const restoredOnceRef = useRef<boolean>(false);

  const setCookie = (name: string, value: string, days: number) => {
    try {
      const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
      document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
    } catch (e) {
      console.error('Failed setting cookie', name, e);
    }
  };
  const getCookie = (name: string): string | null => {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()\[\]\\/+^])/g, '\\$1') + '=([^;]*)'));
    return match ? decodeURIComponent(match[1]) : null;
  };
  const deleteCookie = (name: string) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
  };
  
  // Check if this is a BR (Branding) ID that should show form in homepage
  const shouldShowFormInHomepage = useMemo(() => {
    // Show embedded form for Button, Song (new), and keep existing Branding behavior if desired
    const show = !id || id.startsWith('BT') || id.startsWith('SG');
    console.log('🔍 Form in Homepage Check:', { id, show });
    return show;
  }, [id]);

  // Initialize form data for Button products
  const formHook = useDynamicForm(shouldShowFormInHomepage ? (id || 'BT1') : null);
  const {
    formData,
    loading: formLoading,
    error: formError,
    currentStep,
    setCurrentStep,
    formValues,
    updateFormValue,
    isStepValid,
    totalSteps,
    clearAllFormData
  } = shouldShowFormInHomepage ? formHook : {
    formData: null,
    loading: false,
    error: null,
    currentStep: 0,
    setCurrentStep: () => {},
    formValues: {},
    updateFormValue: () => {},
    isStepValid: () => false,
    totalSteps: 0,
    clearAllFormData: () => {}
  };

  // State for field errors
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [pricing, setPricing] = useState(() => computePricing(formValues));

  // Recompute pricing when form values change
  useEffect(() => {
    if (shouldShowFormInHomepage) {
      setPricing(computePricing(formValues));
    }
  }, [formValues, shouldShowFormInHomepage]);

  // Add debug logging for form data
  useEffect(() => {
    if (shouldShowFormInHomepage) {
      console.log('🔧 Form Debug:', { 
        shouldShowFormInHomepage, 
        id, 
        formData: !!formData, 
        formLoading, 
        formError,
        totalSteps,
        currentStep
      });
    }
  }, [shouldShowFormInHomepage, id, formData, formLoading, formError, totalSteps, currentStep]);
  
  // Use useMemo to avoid re-creating content on every render
  const data = useMemo(() => {
    if (!mounted || contentLoading || contentError) return null;
    
    const currentId = id || 'BT1';
    return getContent(currentId);
  }, [id, mounted, contentLoading, contentError, getContent]);

  // Initialize pricing config from localized content when available
  useEffect(() => {
    if (data) {
      initPricingFromContent(data);
      setPricing(computePricing(formValues));
    }
  }, [data]);

  const [error, setError] = useState<string | null>(null);
  
  // Form-related state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showProgressRestored, setShowProgressRestored] = useState(false);
  const hasLoadedData = useRef(false);
  const stepStartTime = useRef(Date.now());

  // Helper function to scroll to top and change step
  const navigateToStep = (stepIndex: number) => {
    const timeOnPreviousStep = Date.now() - stepStartTime.current;
    // Track step completion
    if (currentStep >= 0) {
      trackFormStep(currentStep + 1, timeOnPreviousStep);
    }
    setCurrentStep(stepIndex);
    // Track new step start
    trackFormStepStart(stepIndex + 1, totalSteps);
    stepStartTime.current = Date.now();
    // Wait for next animation frame after DOM update for smooth scroll
    requestAnimationFrame(() => {
      try {
        const formContainer = document.getElementById('form-container');
        if (formContainer) {
          // Optional: adjust for sticky header height if needed (e.g., 80px)
          const yOffset = -16; // adjust as needed for spacing
          const y = formContainer.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } catch (error) {
        console.error('Scroll error:', error);
        window.scrollTo(0, 0);
      }
    });
  };

  // Always persist homepage scroll percentage for return navigation
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onScroll = () => {
      const doc = document.documentElement;
      const maxScroll = doc.scrollHeight - window.innerHeight;
      if (maxScroll <= 0) return;
      const pct = window.scrollY / maxScroll;
      try { sessionStorage.setItem('homeScrollPct', String(pct)); } catch {}
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Helper: robust scroll restore (retry until content height stabilizes)
  const restoreScrollFromPct = useCallback((pct: number, initialDelay = 250, tries = 10, spacing = 150) => {
    const apply = (attempt: number) => {
      const doc = document.documentElement;
      const maxScroll = doc.scrollHeight - window.innerHeight;
      if (maxScroll > 0) {
        const clamped = Math.min(Math.max(pct, 0), 1);
        const target = clamped * maxScroll;
        window.scrollTo({ top: target, behavior: 'instant' as ScrollBehavior });
        return; // done
      }
      if (attempt < tries) {
        setTimeout(() => apply(attempt + 1), spacing);
      }
    };
    setTimeout(() => apply(0), initialDelay);
  }, []);

  // If reset was requested while away (from Orders page), apply it immediately on mount
  useEffect(() => {
    if (!shouldShowFormInHomepage) return;
    if (!mounted) return;
    try {
      const marker = localStorage.getItem('homeFormReset');
      if (marker) {
        // Clear cookie + all storages and in-memory state before any restore runs
        clearHomepageDraft();
        clearAllFormData();
        localStorage.removeItem('homeFormReset');
        lastSavedHashRef.current = '';
      }
    } catch (e) {
      console.error('Error applying deferred homepage reset:', e);
    }
  }, [shouldShowFormInHomepage, mounted, clearAllFormData]);

  // Restore draft from cookie (runs once after mount & form data available), then enable persisting
  useEffect(() => {
    if (!shouldShowFormInHomepage) return;
    if (!mounted) return;
    if (!formData || formData.steps.length === 0) return;
    try {
      if (!restoredOnceRef.current) {
        const cookieVal = getCookie(DRAFT_COOKIE);
        if (cookieVal) {
          const parsed = JSON.parse(decodeURIComponent(cookieVal));
          if (parsed && parsed.values) {
            Object.entries(parsed.values).forEach(([k, v]) => updateFormValue(k, v));
          }
          if (parsed && typeof parsed.step === 'number' && parsed.step >= 0 && parsed.step < formData.steps.length) {
            setCurrentStep(parsed.step);
          }
          if (parsed && typeof parsed.scrollPct === 'number') {
            restoreScrollFromPct(parsed.scrollPct, 300);
          } else {
            // Fallback: use session stored scroll percentage if cookie lacks scrollPct
            const ss = sessionStorage.getItem('homeScrollPct');
            if (ss) {
              const pct = parseFloat(ss);
              restoreScrollFromPct(pct, 300);
            }
          }
          setShowProgressRestored(true);
          setTimeout(() => setShowProgressRestored(false), 4000);
          console.log('✅ Restored homepage form draft from cookie');
    } else {
          // No cookie to restore; apply session-based scroll position if available
          const ss = sessionStorage.getItem('homeScrollPct');
          if (ss) {
      const pct = parseFloat(ss);
      restoreScrollFromPct(pct, 300);
          }
        }
        restoredOnceRef.current = true;
      }
    } catch (e) {
      console.error('Failed to parse homepage form draft cookie', e);
    } finally {
      // After attempting restore (whether or not a cookie existed), enable persisting
      initPersistReadyRef.current = true;
    }
  }, [shouldShowFormInHomepage, mounted, formData, setCurrentStep, updateFormValue]);

  // Restore scroll position when homepage doesn't show the embedded form
  useEffect(() => {
    if (shouldShowFormInHomepage) return; // handled above with cookie/session fallback
    if (!mounted) return;
    try {
      const ss = sessionStorage.getItem('homeScrollPct');
      if (ss) {
    const pct = parseFloat(ss);
    restoreScrollFromPct(pct, 200);
      }
    } catch {}
  }, [shouldShowFormInHomepage, mounted, restoreScrollFromPct]);

  // Track scroll percentage (throttled) when form visible
  useEffect(() => {
    if (!shouldShowFormInHomepage) return;
    const onScroll = () => {
      const doc = document.documentElement;
      const maxScroll = doc.scrollHeight - window.innerHeight;
      if (maxScroll <= 0) return;
      const pct = window.scrollY / maxScroll;
      // Simple throttle: only update if difference > 1%
      if (Math.abs(pct - scrollPctRef.current) > 0.01) {
        scrollPctRef.current = pct;
        scheduleDraftSave();
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [shouldShowFormInHomepage]);

  // Compute hash of current state for change detection
  const computeStateHash = (vals: Record<string, any>, step: number) => {
    try {
      return btoa(unescape(encodeURIComponent(JSON.stringify({ step, keys: Object.keys(vals).sort(), values: Object.entries(vals).map(([k,v]) => [k, typeof v === 'string' ? v.slice(0,50) : typeof v]) }))));
    } catch { return Math.random().toString(); }
  };

  const persistDraft = () => {
    if (!shouldShowFormInHomepage) return;
    if (!formData || formData.steps.length === 0) return;
    const payload = {
      v: 1,
      ts: Date.now(),
      step: currentStep,
      values: formValues,
      scrollPct: scrollPctRef.current,
    };
    let serialized = JSON.stringify(payload);
    // Guard cookie size ~4KB; trim if needed
    if (serialized.length > 3500) {
      // Remove large fields heuristically
      const shallow: any = { ...payload, values: {} };
      Object.entries(formValues).forEach(([k, v]) => {
        if (typeof v === 'string' && v.length < 200) shallow.values[k] = v; // keep small strings
        else if (typeof v === 'number' || typeof v === 'boolean') shallow.values[k] = v;
      });
      serialized = JSON.stringify(shallow);
    }
    setCookie(DRAFT_COOKIE, encodeURIComponent(serialized), DRAFT_COOKIE_MAX_AGE_DAYS);
    lastSavedHashRef.current = computeStateHash(formValues, currentStep);
  };

  const scheduleDraftSave = () => {
    if (draftSaveTimeout.current) clearTimeout(draftSaveTimeout.current);
    draftSaveTimeout.current = setTimeout(persistDraft, 600); // debounce
  };

  // Save draft whenever form values or step change (debounced) — gated until after restore attempt
  useEffect(() => {
    if (!shouldShowFormInHomepage) return;
    if (!mounted) return;
    if (!initPersistReadyRef.current) return;
    const newHash = computeStateHash(formValues, currentStep);
    if (newHash !== lastSavedHashRef.current) {
      scheduleDraftSave();
    }
  }, [formValues, currentStep, shouldShowFormInHomepage, mounted]);

  // Persist immediately when step changes to capture progress even with no field changes
  useEffect(() => {
    if (!shouldShowFormInHomepage) return;
    if (!mounted) return;
    if (!initPersistReadyRef.current) return;
  // If we just restored, skip the first immediate persist tick to avoid overwriting
  if (!restoredOnceRef.current) return;
    // Only persist on step changes; formValues debounce remains for content edits
    persistDraft();
  }, [currentStep, shouldShowFormInHomepage, mounted]);
  useEffect(() => {
    if (!shouldShowFormInHomepage) return;
    const handler = () => { try { persistDraft(); } catch {} };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [formValues, currentStep, shouldShowFormInHomepage]);

  // Clear cookie on successful completion (handled in handleComplete)
  const clearHomepageDraft = () => deleteCookie(DRAFT_COOKIE);

  // Listen for cross-page reset when all drafts are deleted from Orders page
  useEffect(() => {
    if (!shouldShowFormInHomepage) return;
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'homeFormReset') {
        try {
    // Clear cookie and fully reset all form state (values across all steps, storages, and step index)
    clearHomepageDraft();
    clearAllFormData();
    // Ensure local autosave hash is reset so no stale writes occur
    lastSavedHashRef.current = '';
        } catch (err) {
          console.error('Failed to reset home form after drafts cleared:', err);
        }
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [shouldShowFormInHomepage, clearAllFormData]);

  // Function to validate current step and scroll to first invalid field
  const validateStepAndScroll = useCallback(() => {
    if (!formData || currentStep >= formData.steps.length) return true;
    
    const step = formData.steps[currentStep];
    const requiredFields = step.fields.filter((field: any) => {
      // Check if field is conditionally required
      if ((field as any).conditional) {
        const { field: conditionalField, value: conditionalValue } = (field as any).conditional;
        const currentValue = formValues[conditionalField];
        return currentValue === conditionalValue && field.required;
      }
      return field.required;
    });
    
    const newErrors: Record<string, string> = {};
    let firstInvalidField: string | null = null;
    
    // Check all required fields
    for (const field of requiredFields) {
      const value = formValues[field.name];
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        const errorMessage = field.type === 'choice' || field.type === 'radio'
          ? `Please select ${field.label.toLowerCase()}`
          : `Please fill in ${field.label.toLowerCase()}`;
        newErrors[field.name] = errorMessage;
        if (!firstInvalidField) {
          firstInvalidField = field.name;
        }
      }
    }
    
    setFieldErrors(newErrors);
    
    // If there are errors, scroll to the first invalid field
    if (firstInvalidField) {
      setTimeout(() => {
        const element = document.querySelector(`[name="${firstInvalidField}"]`) as HTMLElement;
        if (element) {
          element.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
          // Focus on the element if it's an input
          if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' || element.tagName === 'SELECT') {
            element.focus();
          }
        }
      }, 100);
      return false;
    }
    
    // Clear errors if all fields are valid
    setFieldErrors({});
    return true;
  }, [formData, currentStep, formValues]);

  // Function to handle next button click
  const handleNextClick = useCallback(() => {
    if (validateStepAndScroll()) {
      navigateToStep(currentStep + 1);
    }
  }, [validateStepAndScroll, currentStep]);

  // Update error state when content loading fails
  useEffect(() => {
    if (contentError) {
      setError(contentError);
    } else if (data === null && mounted && !contentLoading) {
      setError('Content not available');
    } else {
      setError(null);
    }
  }, [data, contentError, mounted, contentLoading]);

  // Form completion handler
  const handleComplete = async () => {
    setIsSubmitting(true);
    
    // Track form submission
    trackFormSubmission({
      totalSteps: formData?.steps?.length || 0,
      formData: formValues,
      timestamp: new Date().toISOString()
    });
    
    // Add the ID to the order data for Google Apps Script routing
    const orderDataWithId = {
      ...formValues,
      id: id || '1' // Use the current ID or default to 1
    };
    
    // Save order data to localStorage for the confirmation page
    localStorage.setItem('completedOrderData', JSON.stringify(formValues));
    
    // Submit order to Google Apps Script
    try {
      const response = await fetch(`https://script.google.com/macros/s/AKfycbxomnBCc-HtyYOogmi0ljnrK_SLyWAIM57TkUfemDO1Ou0lo9_08DnuMKnW-7qF3wdB/exec`, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify(orderDataWithId)
      });
    } catch (error) {
      console.error('Error submitting order:', error);
    }
    
    setIsSubmitting(false);
    
    // Navigate directly to order confirmation page
    navigateWithId('/order-confirmation');
  // Clear persisted draft after completion so a new visit starts fresh
  clearHomepageDraft();
  };

  const handleCancel = () => {
    // Simply navigate back to home without form
    window.location.href = '/';
  // Keep draft cookie so user can resume later
  };

  // Ensure ID is in URL if it exists in sessionStorage
  useEffect(() => {
    if (mounted) {
      ensureIdInUrl();
    }
  }, [mounted, ensureIdInUrl]);

  // Handle cross-page navigation to sections
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined' || !mounted) return;
    
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
  }, [mounted]);

  const handleStartCustomizing = () => {
    navigateWithId('/customize');
  };

  const handleRetry = () => {
    window.location.reload();
  };

  // Show loading while content is being loaded or component is mounting
  if (contentLoading || !mounted || (shouldShowFormInHomepage && formLoading)) {
    return <LoadingSpinner />;
  }

  // Show error state
  if (error || (shouldShowFormInHomepage && formError)) {
    return <ErrorDisplay error={error || formError || 'Unknown error'} onRetry={handleRetry} />;
  }

  // Show content when data is available
  if (!data) {
    return <LoadingSpinner />;
  }

  // Check for debug mode from URL
  const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const debugMode = urlParams?.get('debug') === 'true';

  // If this is a Button product, render homepage with embedded form
  if (shouldShowFormInHomepage && formData) {
  console.log('🎯 Rendering product page with embedded form (Button/Song)');
    // Section order: gallery, then form, then the rest
    const homepageSections = [
      'urgency_banner',
      'gallery',
      'form',
      'hero',
      'demo_video',
  'about',
  'features',
      'adventure_possibilities',
      'book_examples',
      'examples',
      'how_it_works',
      'why_people_love_it',
      'pricing',
      'book_options',
      'testimonials',
      'faq',
      'cta',
    ];
    return (
      <DynamicSectionRenderer
        data={data}
        onStartCustomizing={handleStartCustomizing}
        debug={debugMode}
        sectionsToRender={homepageSections}
        renderFormSection={
          <section className="pt-4 pb-12 bg-gray-50 dark:bg-gray-800 -mt-6" id="form-container">
            <div className="max-w-5xl lg:max-w-none mx-auto px-4 sm:px-6 min-[426px]:px-0 lg:px-0 min-[426px]:w-[66.6667vw] min-[426px]:max-w-none">
              <div className="mb-6">
                <h3 className="font-bold text-gray-900 dark:text-white mb-3 text-[clamp(1.35rem,1rem+1.4vw,2.1rem)] leading-tight">
                  {formData.steps[currentStep]?.title}
                </h3>
                {formData.steps[currentStep]?.description && (
                  <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl">
                    {formData.steps[currentStep].description}
                  </p>
                )}
              </div>
              {/* Progress & Pricing at top for immediate feedback */}
              <div className="mb-8">
                <PricingProgress currentStep={currentStep} totalSteps={totalSteps} pricing={pricing} compact bare />
              </div>
              <div>
                {formData.steps[currentStep]?.fields?.map((field: any, idx: number) => (
                  <div
                    key={field.name}
                    className={`
                      ${idx === 0 ? 'pt-0' : 'mt-6 pt-6 border-t border-gray-200 dark:border-gray-700'}
                      ${idx === formData.steps[currentStep].fields.length - 1 ? 'pb-0' : ''}
                    `}
                  >
                    <DynamicFormField
                      field={field}
                      value={formValues[field.name]}
                      formValues={formValues}
                      error={fieldErrors[field.name]}
                      onChange={(value: any) => {
                        updateFormValue(field.name, value);
                        if (fieldErrors[field.name]) {
                          setFieldErrors(prev => {
                            const newErrors = { ...prev };
                            delete newErrors[field.name];
                            return newErrors;
                          });
                        }
                      }}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 sm:gap-0">
                  <button
                    onClick={() => navigateToStep(Math.max(0, currentStep - 1))}
                    disabled={currentStep === 0}
                    className="group flex items-center justify-center gap-2 px-4 sm:px-6 py-3 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-all duration-200 font-medium text-sm sm:text-base order-2 sm:order-1 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                  >
                    <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-0.5 transition-transform" />
                    {t("navigation.previous")}
                  </button>
                  {currentStep < totalSteps - 1 ? (
                    <button
                      onClick={handleNextClick}
                      className="group flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-700 dark:to-gray-800 text-white hover:from-gray-900 hover:to-black dark:hover:from-gray-600 dark:hover:to-gray-700 rounded-lg transition-all duration-200 font-medium text-sm sm:text-base order-1 sm:order-3 shadow-md hover:shadow-lg"
                    >
                      {t("navigation.next")}
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  ) : (
                    <button
                      onClick={handleComplete}
                      disabled={!isStepValid(currentStep) || isSubmitting}
                      className="group flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 dark:from-emerald-500 dark:to-emerald-600 text-white hover:from-emerald-700 hover:to-emerald-800 dark:hover:from-emerald-600 dark:hover:to-emerald-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium text-sm sm:text-base order-1 sm:order-3 shadow-md hover:shadow-lg disabled:shadow-none"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                          <span className="hidden sm:inline">Submitting Order...</span>
                          <span className="sm:hidden">Submitting...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                          <span className="hidden sm:inline">{t("navigation.completeOrder")}</span>
                          <span className="sm:hidden">Complete</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </section>
        }
      />
    );
  }

  // Fallback: Regular homepage rendering for non-Button products or when form data isn't available
  console.log('🏠 Rendering regular homepage for ID:', id);
  return (
    <DynamicSectionRenderer 
      data={data} 
      onStartCustomizing={handleStartCustomizing}
      debug={debugMode}
    />
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <HomePageContent />
    </Suspense>
  );
}
