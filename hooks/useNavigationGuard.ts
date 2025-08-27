'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';

export function useNavigationGuard() {
  const router = useRouter();
  const pathname = usePathname();

  // Function to auto-save form progress
  const autoSaveProgress = () => {
    if (typeof window === "undefined") return;
    
    // Check if deletion is in progress - don't auto-save if so
    const isDeletingInProgress = sessionStorage.getItem('mymood-deleting');
    if (isDeletingInProgress === 'true') {
      console.log('Skipping auto-save: deletion in progress');
      return;
    }
    
    try {
      // Get current form values from sessionStorage
      const formValues = sessionStorage.getItem('dynamic-form-values');
      const currentStep = sessionStorage.getItem('dynamic-form-current-step');
      
      if (formValues && Object.keys(JSON.parse(formValues)).length > 0) {
        // Create auto-save data
        const autoSaveData = {
          formData: JSON.parse(formValues),
          currentStep: currentStep ? parseInt(currentStep) : 0,
          timestamp: new Date().toISOString(),
          isAutoSave: true
        };
        
        // Save to sessionStorage for auto-restoration
        sessionStorage.setItem('autoSavedFormData', JSON.stringify(autoSaveData));
        console.log('Form progress auto-saved');
      }
    } catch (error) {
      console.error('Error auto-saving form progress:', error);
    }
  };

  useEffect(() => {
    // Check if current page is a form page
    const isFormPage = pathname.includes('/customize') || 
                       pathname.includes('/customize-enhanced') || 
                       pathname.includes('/customize-new');

    if (!isFormPage) return;

    // Function to handle beforeunload (when user tries to close tab)
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Check if deletion is in progress - don't auto-save if so
      const isDeletingInProgress = sessionStorage.getItem('mymood-deleting');
      if (isDeletingInProgress !== 'true') {
        // Auto-save before leaving
        autoSaveProgress();
      }
      // No warning message needed
    };

    // Function to handle navigation away from form
    const handleNavigation = () => {
      // Check if deletion is in progress - don't auto-save if so
      const isDeletingInProgress = sessionStorage.getItem('mymood-deleting');
      if (isDeletingInProgress !== 'true') {
        autoSaveProgress();
      }
    };

    // Add event listeners
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('pagehide', handleNavigation);

    // Cleanup
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('pagehide', handleNavigation);
    };
  }, [pathname]);

  // Return a function that auto-saves and allows navigation
  const handleNavigation = (targetPath: string): boolean => {
    const isFormPage = pathname.includes('/customize') || 
                       pathname.includes('/customize-enhanced') || 
                       pathname.includes('/customize-new');
    
    if (isFormPage) {
      // Check if deletion is in progress - don't auto-save if so
      const isDeletingInProgress = sessionStorage.getItem('mymood-deleting');
      if (isDeletingInProgress !== 'true') {
        // Auto-save progress before navigation
        autoSaveProgress();
      } else {
        console.log('Skipping auto-save during navigation: deletion in progress');
      }
    }
    
    // Always allow navigation
    return true;
  };

  return { handleNavigation, autoSaveProgress };
}
