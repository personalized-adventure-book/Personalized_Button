'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useDynamicForm } from '@/hooks/useDynamicForm';
import { useUrlId } from '../../hooks/useUrlIdStatic';
import { DynamicFormField } from '@/components/DynamicFormComponents';
import { computePricing, initPricingFromContent } from '@/utils/pricing';
import { useLocalContent } from '@/hooks/useLocalContent';
import { PricingProgress } from '@/components/PricingProgress';
import { ArrowLeft, ArrowRight, Save, X, Loader2, Edit3 } from 'lucide-react';
import { useTracking } from '@/components/TrackingProvider';

// Loading component
function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Loading customize page...</p>
      </div>
    </div>
  );
}

// Main content component
function CustomizePageContent() {
  const { id, navigateWithId, mounted } = useUrlId();
  const { data: contentData } = useLocalContent(id || 'BT1');
  const { trackFormStart, trackFormStep, trackFormStepStart, trackFormSubmission, trackCancelAction, trackDraftSave, trackDraftLoad, trackModalOpen, trackModalClose } = useTracking();
  const {
    formData,
    loading,
    error,
    currentStep,
    setCurrentStep,
    formValues,
    updateFormValue,
    isStepValid,
    totalSteps,
    clearAllFormData
  } = useDynamicForm(id);

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
    
    // Use setTimeout to ensure the step change is rendered first
    setTimeout(() => {
      try {
        // Method 1: Scroll to the form container
        const formContainer = document.getElementById('form-container');
        if (formContainer) {
          formContainer.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
          console.log('Scrolled to form container');
        } else {
          // Fallback methods
          window.scrollTo({ 
            top: 0, 
            behavior: 'smooth' 
          });
          console.log('Scrolled to window top');
        }
      } catch (error) {
        console.error('Scroll error:', error);
        // Fallback - instant scroll
        window.scrollTo(0, 0);
      }
    }, 100);
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showProgressRestored, setShowProgressRestored] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false); // Flag to prevent auto-save during delete
  const hasLoadedData = useRef(false);
  const stepStartTime = useRef(Date.now());
  const [pricing, setPricing] = useState(() => computePricing(formValues));
  // Field-level errors for current step validation attempts
  const [fieldErrors, setFieldErrors] = useState<Record<string,string>>({});
  // Initialize pricing config when content loads
  useEffect(() => {
    if (contentData) {
      initPricingFromContent(contentData);
      setPricing(computePricing(formValues));
    }
  }, [contentData]);
  useEffect(() => { setPricing(computePricing(formValues)); }, [formValues]);

  // -------------------------------------------------------------
  // Cookie-based draft persistence (customize page)
  // -------------------------------------------------------------
  const DRAFT_COOKIE = 'mymood-customize-form-draft';
  const DRAFT_COOKIE_MAX_AGE_DAYS = 30;
  const draftSaveTimeout = useRef<NodeJS.Timeout | null>(null);
  const lastSavedHashRef = useRef<string>('');
  const scrollPctRef = useRef<number>(0);

  const setCookie = (name: string, value: string, days: number) => {
    try {
      const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
      document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
    } catch (e) { console.error('Failed setting cookie', name, e); }
  };
  const getCookie = (name: string): string | null => {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()\[\]\\/+^])/g, '\\$1') + '=([^;]*)'));
    return match ? decodeURIComponent(match[1]) : null;
  };
  const deleteCookie = (name: string) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
  };

  // Restore draft once (from cookie or loadDraftData) and set step to last filled
  useEffect(() => {
    if (!mounted) return;
    if (!formData || !formData.steps.length) return;
    // If we already have data loaded into formValues, skip cookie restore
    if (Object.keys(formValues).length > 0) return;
    const cookieVal = getCookie(DRAFT_COOKIE);
    if (!cookieVal) return;
    try {
      const parsed = JSON.parse(decodeURIComponent(cookieVal));
      if (parsed && parsed.values) {
        Object.entries(parsed.values).forEach(([k, v]) => updateFormValue(k, v));
        // Determine last filled step: prefer parsed.step if valid; otherwise compute
        let targetStep = 0;
        if (typeof parsed.step === 'number' && parsed.step >= 0 && parsed.step < formData.steps.length) {
          targetStep = parsed.step;
        } else {
          // Compute the highest step index where at least one field has data
          for (let i = 0; i < formData.steps.length; i++) {
            const step = formData.steps[i];
            const hasAny = step.fields?.some((f: any) => {
              const val = parsed.values?.[f.name];
              if (val === undefined || val === null || val === '') return false;
              if (Array.isArray(val)) return val.length > 0;
              if (typeof val === 'object') return Object.keys(val).length > 0;
              return true;
            });
            if (hasAny) targetStep = i;
          }
        }
        setCurrentStep(targetStep);
        if (typeof parsed.scrollPct === 'number') {
          setTimeout(() => {
            const target = Math.min(Math.max(parsed.scrollPct, 0), 1) * (document.documentElement.scrollHeight - window.innerHeight);
            window.scrollTo({ top: target, behavior: 'instant' as ScrollBehavior });
          }, 300);
        }
        setShowProgressRestored(true);
        setTimeout(() => setShowProgressRestored(false), 4000);
        console.log('✅ Restored customize form draft from cookie');
      }
    } catch (e) { console.error('Failed to parse customize draft cookie', e); }
  }, [mounted, formData, updateFormValue, setCurrentStep, formValues]);

  // Track scroll pct
  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const maxScroll = doc.scrollHeight - window.innerHeight;
      if (maxScroll <= 0) return;
      const pct = window.scrollY / maxScroll;
      if (Math.abs(pct - scrollPctRef.current) > 0.01) {
        scrollPctRef.current = pct;
        scheduleDraftSave();
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const computeStateHash = (vals: Record<string, any>, step: number) => {
    try { return btoa(unescape(encodeURIComponent(JSON.stringify({ step, keys: Object.keys(vals).sort() })))); } catch { return Math.random().toString(); }
  };

  const persistDraft = () => {
    if (!formData || !formData.steps.length) return;
    if (Object.keys(formValues).length === 0) return;
    const payload = { v:1, ts:Date.now(), step: currentStep, values: formValues, scrollPct: scrollPctRef.current };
    let serialized = JSON.stringify(payload);
    if (serialized.length > 3500) {
      const shallow: any = { ...payload, values: {} };
      Object.entries(formValues).forEach(([k,v]) => {
        if (typeof v === 'string' && v.length < 200) shallow.values[k]=v; else if (typeof v === 'number' || typeof v === 'boolean') shallow.values[k]=v;
      });
      serialized = JSON.stringify(shallow);
    }
    setCookie(DRAFT_COOKIE, encodeURIComponent(serialized), DRAFT_COOKIE_MAX_AGE_DAYS);
    lastSavedHashRef.current = computeStateHash(formValues, currentStep);
  };
  const scheduleDraftSave = () => {
    if (draftSaveTimeout.current) clearTimeout(draftSaveTimeout.current);
    draftSaveTimeout.current = setTimeout(persistDraft, 600);
  };
  useEffect(() => {
    if (!mounted) return;
    const newHash = computeStateHash(formValues, currentStep);
    if (newHash !== lastSavedHashRef.current) scheduleDraftSave();
  }, [formValues, currentStep, mounted]);
  // Save on unload to capture last quick changes
  useEffect(() => {
    const handler = () => { try { persistDraft(); } catch {} };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [formValues, currentStep]);
  const clearDraft = () => deleteCookie(DRAFT_COOKIE);

  // Load draft data if coming from drafts page OR auto-saved data
  useEffect(() => {
    // Only run once
    if (hasLoadedData.current) return;

    // First, check for draft data from drafts page
    const draftData = localStorage.getItem('loadDraftData');
    if (draftData) {
      try {
        const draft = JSON.parse(draftData);
        // Set form values from draft
        Object.keys(draft.formData || {}).forEach(key => {
          updateFormValue(key, draft.formData[key]);
        });
        // Set current step from draft (compute fallback if missing/invalid)
        let targetStep = Number.isInteger(draft.currentStep) ? draft.currentStep : -1;
        if (!(targetStep >= 0 && targetStep < (formData?.steps?.length || 0))) {
          targetStep = 0;
          if (formData?.steps?.length) {
            for (let i = 0; i < formData.steps.length; i++) {
              const step = formData.steps[i];
              const hasAny = step.fields?.some((f: any) => {
                const val = (draft.formData || {})[f.name];
                if (val === undefined || val === null || val === '') return false;
                if (Array.isArray(val)) return val.length > 0;
                if (typeof val === 'object') return Object.keys(val).length > 0;
                return true;
              });
              if (hasAny) targetStep = i;
            }
          }
        }
        setCurrentStep(targetStep);
        // Clear the draft data from localStorage
        localStorage.removeItem('loadDraftData');
        console.log('Loaded draft data:', draft);
        // Track draft loading
        trackDraftLoad(draft);
        hasLoadedData.current = true;
        return; // Exit early, don't load auto-save data
      } catch (error) {
        console.error('Error loading draft data:', error);
      }
    }

    // If no draft data, check for auto-saved data
    const autoSavedData = sessionStorage.getItem('autoSavedFormData');
    if (autoSavedData) {
      try {
        const autoSave = JSON.parse(autoSavedData);
        // Set form values from auto-save
        Object.keys(autoSave.formData || {}).forEach(key => {
          updateFormValue(key, autoSave.formData[key]);
        });
        // Set current step from auto-save
        setCurrentStep(autoSave.currentStep || 0);
        console.log('Auto-restored form progress:', autoSave);
        
        // Show restoration notification
        setShowProgressRestored(true);
        setTimeout(() => setShowProgressRestored(false), 4000); // Hide after 4 seconds
        hasLoadedData.current = true;
      } catch (error) {
        console.error('Error loading auto-saved data:', error);
      }
    }

    // Mark as loaded even if no data was found
    hasLoadedData.current = true;
  }, []); // Remove formValues from dependencies to prevent infinite loop

  // Save form progress to cookies
  useEffect(() => {
    // Save form progress to cookies whenever it changes
    const saveProgressToCookies = () => {
      const progressData = {
        formValues,
        currentStep,
        scrollPosition: window.scrollY,
      };
      console.log('Saving progress to cookies (local helper):', progressData);
      try { setCookie('formProgress', JSON.stringify(progressData), 7); } catch (e) { console.error('Set cookie failed', e); }
    };

    window.addEventListener('beforeunload', saveProgressToCookies);

    return () => {
      window.removeEventListener('beforeunload', saveProgressToCookies);
    };
  }, [formValues, currentStep]);

  useEffect(() => {
    // Restore form progress from cookies on page load using local helper
    const savedProgress = getCookie('formProgress');
    console.log('Restoring progress from cookies (local helper):', savedProgress);
    if (savedProgress) {
      try {
        const { formValues: savedFormValues, currentStep: savedStep, scrollPosition } = JSON.parse(savedProgress);
        console.log('Parsed saved progress:', { savedFormValues, savedStep, scrollPosition });
        Object.keys(savedFormValues || {}).forEach((key) => {
          updateFormValue(key, savedFormValues[key]);
        });
        setCurrentStep(savedStep || 0);
        setTimeout(() => {
          window.scrollTo({ top: scrollPosition || 0, behavior: 'smooth' });
        }, 100);
      } catch (error) {
        console.error('Error restoring form progress from cookies:', error);
      }
    }
  }, []);

  // Show loading while not mounted or while loading
  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-md mx-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
          <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">Loading</h3>
          <p className="mt-2 text-gray-600 dark:text-gray-300">Setting up your personalized form...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-md mx-4">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Error Loading Form</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Failed to load form configuration</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!formData || !formData.steps || formData.steps.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-md mx-4">
          <div className="text-yellow-500 text-5xl mb-4">⏳</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Preparing Form</h3>
          <p className="text-gray-600 dark:text-gray-300">Setting up your personalized button builder</p>
        </div>
      </div>
    );
  }

  const currentStepData = formData.steps[currentStep];

  const handleComplete = async () => {
    setIsSubmitting(true);
    
    // Track form submission
    trackFormSubmission({
      totalSteps: formData.steps.length,
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
      console.log('🚀 Submitting order to Google Apps Script...');
      console.log('📄 Order data being sent:', JSON.stringify(orderDataWithId, null, 2));
      console.log('🔗 Target URL:', 'https://script.google.com/macros/s/AKfycbxomnBCc-HtyYOogmi0ljnrK_SLyWAIM57TkUfemDO1Ou0lo9_08DnuMKnW-7qF3wdB/exec');
      console.log('🆔 Using ID:', id || '1');
      
      const response = await fetch(`https://script.google.com/macros/s/AKfycbxomnBCc-HtyYOogmi0ljnrK_SLyWAIM57TkUfemDO1Ou0lo9_08DnuMKnW-7qF3wdB/exec`, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify(orderDataWithId)
      });
      
      console.log('✅ Request sent successfully (no-cors mode)');
      console.log('📊 Response object:', response);
      console.log('🔄 Response status:', response.status);
      console.log('🌐 Response type:', response.type);
      
    } catch (error) {
      console.error('❌ Error submitting order to Google Apps Script:', error);
      console.error('🔍 Error details:', {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        name: error instanceof Error ? error.name : 'Unknown'
      });
    }
    
    console.log('📋 Final form data for debugging:', formValues);
    
    setIsSubmitting(false);
    
    // Clear auto-save data since order is completed
    sessionStorage.removeItem('autoSavedFormData');
    
    // Navigate directly to order confirmation page
    navigateWithId('/order-confirmation');
  // Clear draft cookie on completion
  clearDraft();
  };

  const handleCancel = () => {
    // Check if user has entered any data
    console.log('handleCancel called, formValues:', formValues);
    
    const hasFormData = formValues && Object.keys(formValues).length > 0;
    console.log('hasFormData:', hasFormData);
    
    if (hasFormData) {
      console.log('Form values:', Object.entries(formValues));
    }
    
    const hasNonEmptyData = hasFormData && Object.values(formValues).some(value => {
      // Check if value exists and is not empty
      if (value === null || value === undefined || value === '') {
        console.log('Found empty value:', value);
        return false;
      }
      if (Array.isArray(value) && value.length === 0) {
        console.log('Found empty array:', value);
        return false;
      }
      if (typeof value === 'object' && value !== null && Object.keys(value).length === 0) {
        console.log('Found empty object:', value);
        return false;
      }
      console.log('Found non-empty value:', value, typeof value);
      return true;
    });
    
    console.log('hasNonEmptyData:', hasNonEmptyData);
    
    // Track cancel action
    trackCancelAction('user_clicked_cancel', hasNonEmptyData);
    
    if (!hasNonEmptyData) {
      // No data entered, go directly to home page
      console.log('No form data detected, navigating directly to home');
      navigateWithId('/');
    } else {
      // Data exists, show cancel modal
      console.log('Form data detected, showing cancel modal');
      trackModalOpen('cancel_modal');
      setShowCancelModal(true);
    }
  };

  const handleContinueEditing = () => {
    trackModalClose('cancel_modal', 'continue_editing');
    setShowCancelModal(false);
  };

  const handleSaveAsDraft = () => {
    // Save current progress to drafts
    const draftData = {
      id: Date.now().toString(),
      formData: formValues,
      currentStep,
      timestamp: new Date().toISOString(),
      title: `Draft - Step ${currentStep + 1}`,
    };
    
    // Track draft save
    trackDraftSave(draftData);
    
    // Save to localStorage for drafts
    const existingDrafts = JSON.parse(localStorage.getItem('formDrafts') || '[]');
    existingDrafts.push(draftData);
    localStorage.setItem('formDrafts', JSON.stringify(existingDrafts));
    
    // Clear auto-save data since we've manually saved as draft
    sessionStorage.removeItem('autoSavedFormData');
    
    trackModalClose('cancel_modal', 'save_as_draft');
    setShowCancelModal(false);
    navigateWithId('/orders');
  };

    const handleDeleteAndExit = () => {
    // Track delete and exit action
    trackCancelAction('delete_and_exit', Object.keys(formValues).length > 0);
    
    // Set flag to prevent auto-save during delete process
    setIsDeleting(true);
    sessionStorage.setItem('mymood-deleting', 'true');
    
    // First, clear all auto-save data and form data
    clearAllFormData();
    
    // Clear auto-save data specifically to prevent restoration
    sessionStorage.removeItem('autoSavedFormData');
    
    // Clear any loaded draft data to prevent re-loading
    localStorage.removeItem('loadDraftData');
    
    // Find and delete any existing drafts for this form session
    try {
      // Delete from formDrafts localStorage (main draft storage)
      const existingDrafts = JSON.parse(localStorage.getItem('formDrafts') || '[]');
      
      // If we have form values, try to identify and remove related drafts
      if (Object.keys(formValues).length > 0) {
        const currentFormKeys = Object.keys(formValues);
        const filteredDrafts = existingDrafts.filter((draft: any) => {
          if (!draft.formData) return true;
          const draftFormKeys = Object.keys(draft.formData);
          // If draft has significant overlap with current form, it's likely from this session
          const overlap = currentFormKeys.filter(key => draftFormKeys.includes(key));
          const overlapThreshold = Math.min(currentFormKeys.length * 0.5, 3);
          return overlap.length < overlapThreshold; // Less than 50% overlap or 3 keys
        });
        localStorage.setItem('formDrafts', JSON.stringify(filteredDrafts));
        console.log(`Removed ${existingDrafts.length - filteredDrafts.length} similar drafts from formDrafts`);
      }
      
      // Also clean other potential draft sources
      const draftSources = ['mymood-drafts', 'mymood-button-drafts', 'button-drafts'];
      draftSources.forEach(source => {
        try {
          const drafts = JSON.parse(localStorage.getItem(source) || '[]');
          if (Array.isArray(drafts) && Object.keys(formValues).length > 0) {
            const currentFormKeys = Object.keys(formValues);
            const filtered = drafts.filter((draft: any) => {
              if (!draft.formData && !draft.data) return true;
              const draftData = draft.formData || draft.data || {};
              const draftKeys = Object.keys(draftData);
              const overlap = currentFormKeys.filter(key => draftKeys.includes(key));
              const overlapThreshold = Math.min(currentFormKeys.length * 0.5, 3);
              return overlap.length < overlapThreshold;
            });
            localStorage.setItem(source, JSON.stringify(filtered));
            console.log(`Cleaned ${drafts.length - filtered.length} drafts from ${source}`);
          }
        } catch (error) {
          console.error(`Error cleaning drafts from ${source}:`, error);
        }
      });
      
      console.log('Deleted existing drafts and cleared all form data');
    } catch (error) {
      console.error('Error deleting drafts:', error);
    }
    
    trackModalClose('cancel_modal', 'delete_and_exit');
    setShowCancelModal(false);
    
    // Add a small delay to ensure cleanup is complete before navigation
    setTimeout(() => {
      // Remove the deleting flag before navigation
      sessionStorage.removeItem('mymood-deleting');
      navigateWithId('/');
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 main-content-with-header">
      {/* Progress Restored Notification */}
      {showProgressRestored && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
            <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
              ✓
            </div>
            <span className="font-medium">Your progress has been automatically restored</span>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 max-w-md mx-4 w-full">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <X className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Cancel Form Progress
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                What would you like to do with your current progress?
              </p>
            </div>

            <div className="space-y-3">
              {/* Continue Editing */}
              <button
                onClick={handleContinueEditing}
                className="w-full flex items-center justify-center gap-3 p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
              >
                <Edit3 className="w-5 h-5" />
                Continue Editing
              </button>

              {/* Save as Draft */}
              <button
                onClick={handleSaveAsDraft}
                className="w-full flex items-center justify-center gap-3 p-4 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium"
              >
                <Save className="w-5 h-5" />
                Save as Draft
              </button>

              {/* Delete and Exit */}
              <button
                onClick={handleDeleteAndExit}
                className="w-full flex items-center justify-center gap-3 p-4 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
              >
                <X className="w-5 h-5" />
                Delete & Exit
              </button>
            </div>

            {/* Close button */}
            <button
              onClick={() => setShowCancelModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0 pr-4">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white leading-tight">
                {id && id.startsWith('SG') ? 'Customize Your Personalized Song' : 'Customize Your Personalized Button'}
              </h1>
            </div>
            <button
              onClick={handleCancel}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base">Cancel</span>
            </button>
          </div>
        </div>
      </div>

  <div className="mx-auto px-4 py-4 min-[426px]:px-0 min-[426px]:w-[66.6667vw] min-[426px]:max-w-none" id="form-container">
        <div className="max-w-4xl mx-auto min-[426px]:max-w-none">
          {/* Progress Bar */}
          <PricingProgress currentStep={currentStep} totalSteps={totalSteps} pricing={pricing} />

          {/* Current Step */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-4">
            <div className="mb-8">
              <h2 className="font-bold text-gray-900 dark:text-white mb-3 text-[clamp(1.6rem,1.1rem+1.8vw,2.6rem)] leading-tight">
                {currentStepData.title}
              </h2>
              {currentStepData.description && (
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">{currentStepData.description}</p>
              )}
            </div>

            {/* Form Fields */}
            <div className="space-y-8 min-[426px]:space-y-0 min-[426px]:grid min-[426px]:gap-6 min-[426px]:grid-cols-[repeat(auto-fill,minmax(300px,1fr))] min-[426px]:w-full">
              {currentStepData.fields.map((field: any, index: number) => (
                <div key={`${field.name}-${index}`} className="w-full">
                  <DynamicFormField
                    field={field}
                    value={formValues[field.name]}
                    onChange={(value: any) => {
                      if (fieldErrors[field.name]) {
                        setFieldErrors(prev => { const n={...prev}; delete n[field.name]; return n; });
                      }
                      updateFormValue(field.name, value);
                    }}
                    error={fieldErrors[field.name]}
                  />
                </div>
              ))}

              {/* Repeatable Group */}
              {currentStepData.repeatable_group && (
                <div className="border-t border-gray-200 dark:border-gray-600 pt-8">
                  <h3 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-200">
                    {currentStepData.repeatable_group.label}
                  </h3>
                  
                  {/* Render existing groups */}
                  {(formValues[currentStepData.repeatable_group.name] || []).map((groupInstance: any, groupIndex: number) => (
                    <div key={groupIndex} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-4">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                          {currentStepData.repeatable_group?.label} {groupIndex + 1}
                        </h4>
                        {groupIndex >= (currentStepData.repeatable_group?.min || 0) && (
                          <button
                            onClick={() => {
                              if (currentStepData.repeatable_group) {
                                const currentGroups = formValues[currentStepData.repeatable_group.name] || [];
                                const updatedGroups = currentGroups.filter((_: any, index: number) => index !== groupIndex);
                                updateFormValue(currentStepData.repeatable_group.name, updatedGroups);
                              }
                            }}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      
                      {/* Render fields for this group */}
                      <div className="space-y-4">
                        {currentStepData.repeatable_group?.fields.map((field: any) => (
                          <DynamicFormField
                            key={`${groupIndex}-${field.name}`}
                            field={field}
                            value={groupInstance[field.name] || ''}
                            onChange={(value: any) => {
                              if (currentStepData.repeatable_group) {
                                const currentGroups = formValues[currentStepData.repeatable_group.name] || [];
                                const updatedGroups = [...currentGroups];
                                updatedGroups[groupIndex] = { ...updatedGroups[groupIndex], [field.name]: value };
                                updateFormValue(currentStepData.repeatable_group.name, updatedGroups);
                              }
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                  
                  {/* Add new group button */}
                  <button
                    onClick={() => {
                      if (currentStepData.repeatable_group) {
                        const currentGroups = formValues[currentStepData.repeatable_group.name] || [];
                        const newGroup = {};
                        updateFormValue(currentStepData.repeatable_group.name, [...currentGroups, newGroup]);
                      }
                    }}
                    className="w-full py-3 border-2 border-dashed border-blue-300 dark:border-blue-600 rounded-xl text-blue-600 dark:text-blue-400 hover:border-blue-500 hover:text-blue-700 dark:hover:text-blue-300 transition-colors font-medium"
                  >
                    + Add {currentStepData.repeatable_group?.label}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 mb-2">
            {/* Validation Message - Above buttons on mobile, between on desktop */}
            <div className="flex sm:hidden justify-center items-center mb-4">
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${isStepValid(currentStep) ? 'bg-green-500' : 'bg-red-500'}`}></span>
                <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">
                  {isStepValid(currentStep) ? 'Step Complete' : 'Please complete required fields'}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 sm:gap-0">
              <button
                onClick={() => navigateToStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-gray-500 dark:bg-gray-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 dark:hover:bg-gray-700 transition-colors font-medium text-sm sm:text-base order-2 sm:order-1"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                Previous
              </button>

              {/* Validation Message - Between buttons on desktop, hidden on mobile */}
              <div className="hidden sm:flex text-center px-4 order-2">
                <div className="flex items-center gap-2 justify-center">
                  <span className={`w-3 h-3 rounded-full ${isStepValid(currentStep) ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    {isStepValid(currentStep) ? 'Step Complete' : 'Please complete required fields'}
                  </span>
                </div>
              </div>

              {currentStep < totalSteps - 1 ? (
                <button
                  onClick={() => {
                    // Perform explicit validation when user clicks Next
                    if (!formData) return;
                    const step = formData.steps[currentStep];
                    const newErrors: Record<string,string> = {};
                    step.fields.forEach((f: any) => {
                      if (f.required) {
                        const val = formValues[f.name];
                        if (!val || (typeof val === 'string' && val.trim() === '')) {
                          newErrors[f.name] = 'Required';
                        }
                      }
                    });
                    if (Object.keys(newErrors).length > 0) {
                      setFieldErrors(newErrors);
                      // Scroll to first error field if possible
                      const firstKey = Object.keys(newErrors)[0];
                      const el: HTMLElement | null = document.querySelector(`[name='${firstKey}']`);
                      if (el && el.scrollIntoView) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }
                      return; // Block navigation
                    }
                    setFieldErrors({});
                    navigateToStep(currentStep + 1);
                  }}
                  className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors font-medium text-sm sm:text-base order-1 sm:order-3"
                >
                  Next
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              ) : (
                <button
                  onClick={handleComplete}
                  disabled={!isStepValid(currentStep) || isSubmitting}
                  className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-green-600 dark:bg-green-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-700 dark:hover:bg-green-800 transition-colors font-medium text-sm sm:text-base order-1 sm:order-3"
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
                      <span className="hidden sm:inline">Complete Order</span>
                      <span className="sm:hidden">Complete</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CustomizePage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <CustomizePageContent />
    </Suspense>
  );
}
