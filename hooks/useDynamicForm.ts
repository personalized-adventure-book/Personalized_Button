import { useState, useEffect } from 'react';
import { useLocalContent } from './useLocalContent';
import comprehensiveTracker from '@/utils/comprehensiveTracker';

// Form field types
interface BaseField {
  type: string;
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
}

interface TextField extends BaseField {
  type: 'text' | 'email';
}

interface TextAreaField extends BaseField {
  type: 'textarea';
}

interface ChoiceField extends BaseField {
  type: 'choice';
  options: string[];
}

interface RadioField extends BaseField {
  type: 'radio';
  options: string[];
}

interface CheckboxField extends BaseField {
  type: 'checkbox';
  options: string[];
}

interface FileField extends BaseField {
  type: 'file';
}

interface AdventureOption {
  title: string;
  description: string;
  icon: string;
}

interface AdventureSelectorField extends BaseField {
  type: 'adventure_selector';
  options: AdventureOption[];
}

type FormField = TextField | TextAreaField | ChoiceField | RadioField | CheckboxField | FileField | AdventureSelectorField;

interface RepeatableGroup {
  name: string;
  label: string;
  min: number;
  fields: FormField[];
}

interface FormStep {
  id: string;
  title: string;
  icon: string;
  subtitle?: string;
  description?: string;
  fields: FormField[];
  repeatable_group?: RepeatableGroup;
}

export interface DynamicFormData {
  steps: FormStep[];
}

// Sample form configuration for testing/fallback
const sampleFormData: DynamicFormData = {
  steps: [
    {
      id: "purpose",
      title: "What's your button's purpose?",
      icon: "target",
      description: "Select the main function for your personalized button",
      fields: [
        {
          type: "adventure_selector",
          name: "purpose",
          label: "Select Purpose",
          required: true,
          options: [
            {
              title: "Smart Lighting Control",
              description: "Control your smart lights with a single press",
              icon: "lightbulb"
            },
            {
              title: "Music & Audio Control", 
              description: "Play, pause, and control your music",
              icon: "music"
            },
            {
              title: "Home Automation",
              description: "Trigger home automation scenes",
              icon: "home"
            },
            {
              title: "Custom Function",
              description: "Create your own custom action",
              icon: "settings"
            }
          ]
        }
      ]
    },
    {
      id: "design",
      title: "Design Your Button",
      icon: "palette",
      description: "Customize the appearance and feel",
      fields: [
        {
          type: "radio",
          name: "shape",
          label: "Button Shape",
          required: true,
          options: ["Round", "Square", "Rectangular"]
        },
        {
          type: "choice",
          name: "size",
          label: "Size",
          required: true,
          options: ["Small (2cm)", "Medium (4cm)", "Large (6cm)"]
        },
        {
          type: "text",
          name: "color",
          label: "Primary Color",
          placeholder: "#FF0000 or red",
          required: true
        }
      ]
    },
    {
      id: "customer_info",
      title: "Customer Information", 
      icon: "user",
      description: "Tell us about yourself",
      fields: [
        {
          type: "text",
          name: "full_name",
          label: "Full Name",
          placeholder: "John Doe",
          required: true
        },
        {
          type: "email",
          name: "email",
          label: "Email Address", 
          placeholder: "john@example.com",
          required: true
        },
        {
          type: "text",
          name: "phone",
          label: "Phone Number",
          placeholder: "+1 (555) 123-4567",
          required: false
        },
        {
          type: "textarea",
          name: "special_requirements",
          label: "Special Requirements",
          placeholder: "Any specific needs or customizations...",
          required: false
        }
      ]
    }
  ]
};

interface UseDynamicFormReturn {
  formData: DynamicFormData | null;
  loading: boolean;
  error: string | null;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  formValues: Record<string, any>;
  updateFormValue: (name: string, value: any) => void;
  isStepValid: (stepIndex: number) => boolean;
  totalSteps: number;
  clearAllFormData: () => void;
}

// Cache for form data (ID-specific to handle different IDs properly)
let formDataCache: { [id: string]: DynamicFormData } = {};

export function useDynamicForm(id: string | null): UseDynamicFormReturn {
  const [formData, setFormData] = useState<DynamicFormData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [contentProcessed, setContentProcessed] = useState(false);

  // Use the local content hook to get the content (which includes form data)
  const { data: contentData, loading: contentLoading, error: contentError } = useLocalContent(id);

  // Extract form data from content
  useEffect(() => {
    if (contentLoading) {
      setLoading(true);
      setError(null);
      setContentProcessed(false);
      return;
    }

    if (contentError) {
      setError(contentError);
      setLoading(false);
      setContentProcessed(true);
      return;
    }

    if (contentData) {
      // Check if form data exists in the content
      const rawFormData = (contentData as any).form;

      if (rawFormData && rawFormData.steps) {
        console.log('📋 FORM DATA SOURCE: Local JSON content');
        console.log('📋 FORM STEPS:', rawFormData.steps.map((step: any) => ({
          id: step.id,
          title: step.title,
          fieldsCount: step.fields.length
        })));
        setFormData(rawFormData as DynamicFormData);
        setError(null);
      } else {
        console.log('📋 FORM DATA SOURCE: Fallback sample data (no form in content)');
        // Fallback to sample data if no form found
        setFormData(sampleFormData);
        setError(null);
      }
      
      setLoading(false);
      setContentProcessed(true);
    } else if (!contentLoading) {
      // No content data and not loading - mark as processed so external fetch can run
      setContentProcessed(true);
    }
  }, [contentData, contentLoading, contentError]);

  // Load form data from cached response or fetch if needed
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    // Wait for content processing to complete before trying external fetch
    if (!contentProcessed) return;
    
    // If we already have form data from content, don't fetch externally
    if (formData) return;
    
    // Extract ID from URL or use provided ID
    const urlSearchId = new URLSearchParams(window.location.search).get("id");
    const actualId = id || urlSearchId || "1";
    
    // Don't proceed if we don't have a definitive ID yet and one is expected from URL
    if (!id && urlSearchId && urlSearchId !== "1") {
      return;
    }
    
    // Return cached data if available for this specific ID
    if (formDataCache[actualId]) {
      setFormData(formDataCache[actualId]);
      setLoading(false);
      return;
    }

    // Check if we already have cached data from the homepage request for this specific ID
    const homepageCache = (window as any)[`homepageRowCache_${actualId}`];
    if (homepageCache && homepageCache.length > 1 && typeof homepageCache[1] === "string") {
      try {
        console.log('📝 FORM DATA - Raw cached response for ID', actualId, ':', homepageCache);
        console.log('📝 FORM DATA - Raw JSON string (homepageCache[1]):', homepageCache[1]);
        
        const parsedFormData: DynamicFormData = JSON.parse(homepageCache[1]);
        
        console.log('📝 FORM DATA - Parsed form data object:');
        console.log(JSON.stringify(parsedFormData, null, 2));
        
        formDataCache[actualId] = parsedFormData;
        setFormData(parsedFormData);
        setLoading(false);
        return;
      } catch (e) {
        console.error('Error parsing cached form data, using sample data:', e);
        // Use sample data as fallback
        formDataCache[actualId] = sampleFormData;
        setFormData(sampleFormData);
        setLoading(false);
        return;
      }
    }

    // If no cached data and no content data, try to fetch real data from external source
    // Only fetch if we don't have any form data source at all
    // TEMPORARILY DISABLED for development to test local JSON conditional fields
    const enableExternalFetch = false; // Set to true to enable Google Sheets integration
    
    if (!formData && !contentData && !formDataCache[actualId] && enableExternalFetch) {
      // Set loading state while we fetch
      setLoading(true);
      setError(null);

      // Create global callback function with unique name  
      const callbackName = `formInit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      console.log('📝 ========== STARTING FORM DATA FETCH ==========');
      console.log('📝 Target ID:', actualId);
      console.log('📝 Callback function name:', callbackName);
      console.log('📝 About to create JSONP request for form data...');
      
      // Set a timeout to handle errors - fallback to sample data
      const timeoutId = setTimeout(() => {
        console.warn('⏰ FORM DATA TIMEOUT: Google Apps Script request timed out after 8 seconds');
        console.log('📊 Falling back to sample form data for ID:', actualId);
        formDataCache[actualId] = sampleFormData;
        setFormData(sampleFormData);
        setLoading(false);
        delete (window as any)[callbackName];
      }, 8000); // 8 second timeout for form data

        (window as any)[callbackName] = function(response: any) {
          console.log('📝 ========== FORM DATA CALLBACK TRIGGERED ==========');
          console.log('📥 Raw form response received from Google Apps Script:');
          console.log('📄 Response type:', typeof response);
          console.log('📄 Response is Array:', Array.isArray(response));
          console.log('📄 Response length:', response?.length);
          console.log('📄 Full response object:', response);
          
          // Check if we already have form data from another source (contentData) - if so, don't override
          if (formData || contentData) {
            console.log('⚠️ FORM DATA ALREADY EXISTS - Not overriding with external data');
            console.log('⚠️ Current formData exists:', !!formData);
            console.log('⚠️ Current contentData exists:', !!contentData);
            clearTimeout(timeoutId);
            setLoading(false);
            delete (window as any)[callbackName];
            return;
          }
          
          if (response && Array.isArray(response)) {
            console.log('📝 ========== FORM RESPONSE ARRAY BREAKDOWN ==========');
            response.forEach((item, index) => {
              console.log(`📄 response[${index}] type:`, typeof item);
              console.log(`📄 response[${index}] length:`, item?.length);
              console.log(`📄 response[${index}] preview:`, typeof item === 'string' ? item.substring(0, 100) + '...' : item);
            });
            console.log('📝 ===============================================');
          }
          
          try {
            clearTimeout(timeoutId);
            
            if (!response || !response.length || response.length < 2 || typeof response[1] !== "string") {
              console.error("❌ FORM DATA VALIDATION FAILED:");
              console.log("❌ - response exists:", !!response);
              console.log("❌ - response.length:", response?.length);
              console.log("❌ - response[1] type:", typeof response?.[1]);
              console.log("❌ - Expected: Array with at least 2 items, second item should be string");
              setLoading(false);
              delete (window as any)[callbackName];
              return;
            }
            
            console.log('✅ Form data response validation passed');
            console.log('🔍 About to parse form JSON from response[1]...');
            
            console.log('📝 FORM DATA - Fresh fetch response for ID', actualId, ':', response);
            console.log('📝 FORM DATA - Raw JSON string (response[1]):', response[1]);
            
            // Parse form JSON from second column
            const parsedFormData: DynamicFormData = JSON.parse(response[1]);
            
            console.log('📝 FORM DATA - Parsed form data object:');
            console.log(JSON.stringify(parsedFormData, null, 2));
            
            // Cache both homepage and form data with ID-specific key
            (window as any)[`homepageRowCache_${actualId}`] = response;
            formDataCache[actualId] = parsedFormData;
            console.log('📋 FORM DATA SOURCE: External Google Sheets (overriding local data)');
            setFormData(parsedFormData);
            setError(null);
            
          } catch (e) {
            console.error('Error parsing form data, keeping sample data:', e, response);
            // Keep sample data, don't show error
          } finally {
            setLoading(false);
            delete (window as any)[callbackName];
          }
        };

        // Create and append script tag for JSONP (same URL as homepage)
        const script = document.createElement('script');
        const baseUrl = 'https://script.google.com/macros/s/AKfycbxomnBCc-HtyYOogmi0ljnrK_SLyWAIM57TkUfemDO1Ou0lo9_08DnuMKnW-7qF3wdB/exec';
        const fullUrl = `${baseUrl}?id=${encodeURIComponent(actualId)}&callback=${callbackName}`;
        script.src = fullUrl;
        
        console.log('📝 ========== FORM DATA JSONP REQUEST ==========');
        console.log('📝 Base URL:', baseUrl);
        console.log('📝 Full request URL:', fullUrl);
        console.log('📝 Script element created for form data');
        console.log('📝 About to append script to document.body...');
        
        script.onerror = (errorEvent) => {
          console.error('❌ ========== FORM DATA SCRIPT ERROR ==========');
          console.error('❌ Failed to load form data from Google Apps Script');
          console.error('❌ Error event:', errorEvent);
          console.error('❌ Script src that failed:', script.src);
          console.warn('⚠️ Falling back to sample form data...');
          formDataCache[actualId] = sampleFormData;
          setFormData(sampleFormData);
          setLoading(false);
          delete (window as any)[callbackName];
          console.error('❌ ==========================================');
        };

        console.log('➕ Appending form data script to document.body...');
        document.body.appendChild(script);
        console.log('✅ Form data script appended, waiting for response...');
        console.log('📝 ============================================');

        // Cleanup function
        return () => {
          clearTimeout(timeoutId);
          if (script.parentNode) {
            document.body.removeChild(script);
          }
          delete (window as any)[callbackName];
        };
    } else {
      // If we already have form data, make sure loading is false
      setLoading(false);
    }
  }, [id, contentProcessed, formData, contentData]); // Added contentProcessed to ensure external fetch waits for content processing

  /* OLD GOOGLE SHEETS FETCHING CODE - REMOVED FOR LOCAL CONTENT SYSTEM
  // This code has been replaced by the useLocalContent integration above
  */

  // Initialize repeatable groups with minimum required instances
  useEffect(() => {
    if (!formData) return;

    let needsInitialization = false;
    const initializedValues = { ...formValues };

    formData.steps.forEach(step => {
      if (step.repeatable_group) {
        const groupName = step.repeatable_group.name;
        const minItems = step.repeatable_group.min || 1;
        const currentValues = formValues[groupName] || [];
        
        if (currentValues.length < minItems) {
          needsInitialization = true;
          const newGroups = [];
          
          // Keep existing groups
          for (let i = 0; i < currentValues.length; i++) {
            newGroups.push(currentValues[i]);
          }
          
          // Add missing groups with empty objects
          for (let i = currentValues.length; i < minItems; i++) {
            newGroups.push({});
          }
          
          initializedValues[groupName] = newGroups;
        }
      }
    });

    if (needsInitialization) {
      setFormValues(initializedValues);
    }
  }, [formData]); // Only depend on formData, not formValues to avoid infinite loop

  // Initialize form values and current step from sessionStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check for force reset flag
      const forceReset = sessionStorage.getItem('mymood-force-reset');
      if (forceReset === 'true') {
        // Clear all form data
        sessionStorage.removeItem('dynamic-form-values');
        sessionStorage.removeItem('dynamic-form-current-step');
        sessionStorage.removeItem('mymood-force-reset');
        localStorage.removeItem('mymood-config');
        localStorage.removeItem('mymood-drafts');
        setFormValues({});
        setCurrentStep(0);
        return;
      }
      
      // Restore saved form values
      const savedValues = sessionStorage.getItem('dynamic-form-values');
      if (savedValues) {
        try {
          console.log('📝 FORM DATA - Restored saved values from sessionStorage:', savedValues);
          const parsedValues = JSON.parse(savedValues);
          console.log('📝 FORM DATA - Parsed saved values object:');
          console.log(JSON.stringify(parsedValues, null, 2));
          setFormValues(parsedValues);
        } catch (e) {
          console.error('Error loading saved form values:', e);
        }
      }
      
      // Restore saved current step
      const savedStep = sessionStorage.getItem('dynamic-form-current-step');
      if (savedStep) {
        try {
          const stepNumber = parseInt(savedStep, 10);
          if (!isNaN(stepNumber) && stepNumber >= 0) {
            // We'll validate the step bounds after formData is loaded
            setCurrentStep(stepNumber);
          }
        } catch (e) {
          console.error('Error loading saved current step:', e);
        }
      }
    }
  }, []);

  // Validate current step bounds when formData changes
  useEffect(() => {
    if (formData && formData.steps && formData.steps.length > 0) {
      // Ensure current step is within valid bounds
      if (currentStep >= formData.steps.length) {
        setCurrentStep(Math.max(0, formData.steps.length - 1));
      } else if (currentStep < 0) {
        setCurrentStep(0);
      }
    }
  }, [formData, currentStep]);

  // Save form values to sessionStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && Object.keys(formValues).length > 0) {
      sessionStorage.setItem('dynamic-form-values', JSON.stringify(formValues));
    }
  }, [formValues]);

  // Save current step to sessionStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && currentStep >= 0) {
      sessionStorage.setItem('dynamic-form-current-step', currentStep.toString());
    }
  }, [currentStep]);

  // Function to update form values
  const updateFormValue = (name: string, value: any) => {
    setFormValues(prev => {
      const newValues = { ...prev, [name]: value };

      // Generic conditional clearing: if other fields depend on this one and the condition is no longer met, clear them
      try {
        if (formData) {
          formData.steps.forEach(step => {
            step.fields.forEach((field: any) => {
              if (field?.conditional?.field === name) {
                const shouldShow = value === field.conditional.value;
                const dependentName = field.name;
                if (!shouldShow && newValues[dependentName]) {
                  // Clear stale value
                  delete newValues[dependentName];
                  console.log('🧹 Cleared conditional field value', {
                    controller: name,
                    controllerValue: value,
                    clearedField: dependentName,
                    expectedValue: field.conditional.value
                  });
                }
              }
            });
            // Also handle repeatable groups if present
            if (step.repeatable_group) {
              step.repeatable_group.fields.forEach((field: any) => {
                if (field?.conditional?.field === name) {
                  const shouldShow = value === field.conditional.value;
                  const dependentName = field.name;
                  if (!shouldShow && newValues[dependentName]) {
                    delete newValues[dependentName];
                    console.log('🧹 Cleared conditional field value (repeatable)', {
                      controller: name,
                      controllerValue: value,
                      clearedField: dependentName,
                      expectedValue: field.conditional.value
                    });
                  }
                }
              });
            }
          });
        }
      } catch (e) {
        console.warn('Conditional clearing pass failed', e);
      }

      return newValues;
    });
  };

  // Function to check if a step is valid
  const isStepValid = (stepIndex: number): boolean => {
    if (!formData || stepIndex >= formData.steps.length) return false;
    
    const step = formData.steps[stepIndex];
    const requiredFields = step.fields.filter(field => field.required);
    
    // Check if all required fields are filled
    for (const field of requiredFields) {
      const value = formValues[field.name];
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        return false;
      }
    }
    
    // Check repeatable group if exists
    if (step.repeatable_group) {
      const groupValues = formValues[step.repeatable_group.name] || [];
      if (groupValues.length < step.repeatable_group.min) {
        return false;
      }
      
      // Check each group instance
      for (const groupInstance of groupValues) {
        const requiredGroupFields = step.repeatable_group.fields.filter(field => field.required);
        for (const field of requiredGroupFields) {
          const value = groupInstance[field.name];
          if (!value || (typeof value === 'string' && value.trim() === '')) {
            return false;
          }
        }
      }
    }
    
    return true;
  };

  // Function to clear all form data
  const clearAllFormData = () => {
    if (typeof window !== 'undefined') {
      // Clear all form-related localStorage items
      const localStorageKeys = [
        'mymood-config',
        'mymood-drafts',
        'mymood-button-enhanced-draft',
        'mymood-button-expanded-draft',
        'mymood-button-drafts',
        'dynamic-form-values',
        'completedOrderData'
      ];
      
      // Clear all form-related sessionStorage items
      const sessionStorageKeys = [
        'dynamic-form-values',
        'dynamic-form-current-step',
        'mymood-current-step',
        'mymood-current-config'
      ];
      
      localStorageKeys.forEach(key => localStorage.removeItem(key));
      sessionStorageKeys.forEach(key => sessionStorage.removeItem(key));
      
      // Reset form state
      setFormValues({});
      setCurrentStep(0);
      
      // Set force reset flag for other components
      sessionStorage.setItem('mymood-force-reset', 'true');
    }
  };

  return {
    formData,
    loading,
    error,
    currentStep,
    setCurrentStep,
    formValues,
    updateFormValue,
    isStepValid,
    totalSteps: formData?.steps.length || 0,
    clearAllFormData
  };
}
