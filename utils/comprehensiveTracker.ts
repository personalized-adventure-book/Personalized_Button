"use client";

// ==================== COMPREHENSIVE TRACKING SERVICE ====================

export interface TrackingEvent {
  session_id: string;
  url_id: string;
  timestamp: number;
  time_on_page: number;
  event_type: string;
  page_url: string;
  user_agent: string;
  screen_size: string;
  viewport_size: string;
  [key: string]: any;
}

export interface TrackingData {
  session_id: string;
  url_id: string;
  start_time: number;
  events: TrackingEvent[];
}

class ComprehensiveTrackingService {
  private sessionId: string;
  private startTime: number;
  private trackingData: TrackingData;
  private currentUrlId: string;
  private scrollTimeout: NodeJS.Timeout | null = null;
  private inputTracking: { [key: string]: NodeJS.Timeout } = {};
  private lastScrollTop = 0;
  private isInitialized = false;
  private consecutiveFailures = 0;
  private circuitOpenUntil = 0; // timestamp ms
  private lastSendTs = 0;
  private minIntervalMs = 800; // throttle outbound network calls
  private queuedWhileOpen: TrackingEvent[] = [];

  // Configuration
  private readonly TRACK_URL = "https://script.google.com/macros/s/AKfycbxomnBCc-HtyYOogmi0ljnrK_SLyWAIM57TkUfemDO1Ou0lo9_08DnuMKnW-7qF3wdB/exec";
  private readonly SESSION_KEY = "session_id";

  constructor() {
    this.sessionId = this.getSessionId();
    this.startTime = Date.now();
    this.currentUrlId = this.getInitialUrlId();
    this.trackingData = {
      session_id: this.sessionId,
      url_id: this.currentUrlId,
      start_time: this.startTime,
      events: []
    };
  }

  public initialize(): void {
    if (typeof window === 'undefined' || this.isInitialized) return;
    
    this.isInitialized = true;
    this.initializeTracking();
  }

  private getSessionId(): string {
    if (typeof window === 'undefined') return 'ssr_session';
    
    let sid = sessionStorage.getItem(this.SESSION_KEY);
    if (!sid) {
      sid = 'sess_' + Math.random().toString(36).substr(2, 10) + '_' + Date.now();
      sessionStorage.setItem(this.SESSION_KEY, sid);
    }
    return sid;
  }

  private getInitialUrlId(): string {
    if (typeof window === 'undefined') return '1';
    
    // Try to get ID from URL params
    const searchParams = new URLSearchParams(window.location.search);
    const urlId = searchParams.get('id');
    if (urlId) {
      console.log('🔍 Tracker: Found initial URL ID from params:', urlId);
      return urlId;
    }
    
    // Try to get from sessionStorage
    const storedId = sessionStorage.getItem('current-id');
    if (storedId) {
      console.log('🔍 Tracker: Found initial URL ID from storage:', storedId);
      return storedId;
    }
    
    console.log('🔍 Tracker: No URL ID found, defaulting to 1');
    return '1';
  }

  public setUrlId(urlId: string): void {
    console.log('🔍 Tracker: Setting URL ID from', this.currentUrlId, 'to', urlId);
    this.currentUrlId = urlId;
    this.trackingData.url_id = urlId;
  }

  public sendTrackingEvent(eventType: string, details: Record<string, any> = {}): void {
    if (typeof window === 'undefined') return;

    const payload: TrackingEvent = {
      session_id: this.sessionId,
      url_id: this.currentUrlId,
      timestamp: Date.now(),
      time_on_page: Date.now() - this.startTime,
      event_type: eventType,
      page_url: window.location.href,
      user_agent: navigator.userAgent,
      screen_size: `${screen.width}x${screen.height}`,
      viewport_size: `${window.innerWidth}x${window.innerHeight}`,
      ...details
    };

    // Store locally
    this.trackingData.events.push(payload);

    // Send to endpoint in simplified format
    this.sendToEndpoint(payload);

    // Debug log
    console.log(`📊 Tracking: ${eventType}`, payload);
  }

  private async sendToEndpoint(payload: TrackingEvent): Promise<void> {
    // Throttle
    const now = Date.now();
  const bypassThrottle = payload.event_type.startsWith('audio_') || payload.event_type.startsWith('form_') || payload.event_type.startsWith('ui_box_');
    if (!bypassThrottle && now - this.lastSendTs < this.minIntervalMs) {
      return; // drop (we already store locally in trackingData)
    }
    this.lastSendTs = now;

    // Circuit breaker check
    if (now < this.circuitOpenUntil) {
      // queue only first few for potential later flush
      if (this.queuedWhileOpen.length < 5) this.queuedWhileOpen.push(payload);
      return;
    }
    try {
      // Convert to the simplified format your Google Apps Script expects
      const scriptPayload = {
        session_id: payload.session_id,
        event: payload.event_type,
        url_id: payload.url_id,
        time: new Date(payload.timestamp).toISOString(),
        // Enhanced tracking data for better insights
        ...(payload.element_text && { element_text: payload.element_text }),
        ...(payload.element_type && { element_type: payload.element_type }),
        ...(payload.element_id && { element_id: payload.element_id }),
        ...(payload.element_name && { element_name: payload.element_name }),
        ...(payload.element_value && { element_value: payload.element_value }),
        ...(payload.element_placeholder && { element_placeholder: payload.element_placeholder }),
        ...(payload.button_type && { button_type: payload.button_type }),
        ...(payload.field_name && { field_name: payload.field_name }),
        ...(payload.field_type && { field_type: payload.field_type }),
        ...(payload.field_value && { field_value: payload.field_value }),
        ...(payload.field_label && { field_label: payload.field_label }),
        ...(payload.parent_component && { parent_component: payload.parent_component }),
        ...(payload.form_step !== undefined && { form_step: payload.form_step }),
        ...(payload.step_number !== undefined && { step_number: payload.step_number }),
        ...(payload.scroll_percentage !== undefined && { scroll_percentage: payload.scroll_percentage }),
        ...(payload.previous_language && { previous_language: payload.previous_language }),
        ...(payload.new_language && { new_language: payload.new_language }),
        ...(payload.previous_theme && { previous_theme: payload.previous_theme }),
        ...(payload.new_theme && { new_theme: payload.new_theme }),
        ...(payload.modal_type && { modal_type: payload.modal_type }),
        ...(payload.action && { action: payload.action }),
        ...(payload.reason && { reason: payload.reason }),
        ...(payload.draft_id && { draft_id: payload.draft_id })
      };

      console.log('🚀 Sending to endpoint:', this.TRACK_URL);
      console.log('📦 Simplified payload:', JSON.stringify(scriptPayload, null, 2));
      
      const res = await fetch(this.TRACK_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(scriptPayload)
      });
      // In no-cors we can't reliably inspect status; treat as success
      this.consecutiveFailures = 0;
      // If circuit was open previously and now closed, attempt flush
      if (this.queuedWhileOpen.length && now >= this.circuitOpenUntil) {
        const queued = [...this.queuedWhileOpen];
        this.queuedWhileOpen = [];
        queued.forEach(q => this.sendToEndpoint(q));
      }
    } catch (err) {
      this.consecutiveFailures += 1;
      // Backoff: open circuit exponentially up to 5 minutes
      const backoffMs = Math.min(300000, 2000 * Math.pow(2, Math.min(this.consecutiveFailures, 6)));
      this.circuitOpenUntil = Date.now() + backoffMs;
      if (this.consecutiveFailures <= 3) {
        console.warn(`Tracking endpoint unreachable (attempt ${this.consecutiveFailures}). Backing off for ${Math.round(backoffMs/1000)}s`);
      } else if (this.consecutiveFailures === 4) {
        console.warn('Further tracking errors muted until service recovers.');
      }
    }
  }

  private initializeTracking(): void {
    // Initialize all tracking listeners
    this.setupPageTracking();
    this.setupClickTracking();
    this.setupFormTracking();
    this.setupScrollTracking();
    this.setupNavigationTracking();
    this.setupErrorTracking();
    this.setupPerformanceTracking();
  }

  private setupPageTracking(): void {
    // Page load events
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.sendTrackingEvent('session_start', {
          referrer: document.referrer,
          language: navigator.language,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        });
        
        this.sendTrackingEvent('page_load', {
          load_time: Date.now() - this.startTime
        });
      });
    } else {
      this.sendTrackingEvent('session_start', {
        referrer: document.referrer,
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      });
    }
  }

  private setupClickTracking(): void {
    document.addEventListener('click', (e) => {
      const element = e.target as HTMLElement;
      const tag = element.tagName.toLowerCase();
  // Derive field/option context early (for nested icons/spans inside option buttons)
  const fieldCtx = this.deriveFieldContext(element);
      const currentStep = this.getCurrentFormStep();
      const basePayload = {
        element_type: tag,
        element_text: element.textContent?.trim().substring(0, 100) || '',
        element_id: element.id || '',
        element_class: element.className || '',
        element_href: (element as HTMLAnchorElement).href || '',
        element_name: (element as HTMLInputElement).name || '',
        element_value: (element as HTMLInputElement).value || '',
        element_placeholder: (element as HTMLInputElement).placeholder || '',
        element_aria_label: element.getAttribute('aria-label') || '',
        element_title: element.title || '',
        button_type: tag === 'button' ? (element as HTMLButtonElement).type : '',
        form_step: currentStep,
        step_number: currentStep,
        parent_component: this.getParentComponent(element),
        click_x: e.clientX,
        click_y: e.clientY
      };

      // Generic click (legacy)
      this.sendTrackingEvent('click', basePayload);

      // If we detected a field context AND an option (e.g., clicking an option inside a multi-choice field)
      if (fieldCtx && (fieldCtx.option_label || fieldCtx.option_value)) {
        this.sendTrackingEvent('form_field_option_click', {
          ...basePayload,
          field_name: fieldCtx.field_name,
            field_label: fieldCtx.field_label,
          field_type: fieldCtx.field_type,
          group_name: fieldCtx.group_name,
          option_value: fieldCtx.option_value,
          option_label: fieldCtx.option_label,
          option_index: fieldCtx.option_index,
          is_selected: fieldCtx.is_selected,
          form_step: currentStep
        });
      }

      // Form field specific click
      if (['input','textarea','select'].includes(tag)) {
        const field_name = (element as HTMLInputElement).name || element.id || '';
        const field_type = (element as HTMLInputElement).type || tag;
        this.sendTrackingEvent('form_field_click', {
          ...basePayload,
          field_name,
          field_type
        });
        // Re-send enriched generic click with field context (optional)
        this.sendTrackingEvent('click', { ...basePayload, field_name, field_type });
      }

      // UI box / card detection (div or button with certain classes or roles)
      const className = (element.className || '').toString();
      if (['div','button'].includes(tag) && /(card|box|container|panel|tile|item|option)/i.test(className)) {
        this.sendTrackingEvent('ui_box_click', {
          ...basePayload,
          ui_box_hint: className.substring(0,120)
        });
      }
    });
  }

  // Attempt to derive field + option context for clicks deep inside custom option UIs
  private deriveFieldContext(element: HTMLElement): {
    field_name: string;
    field_label?: string;
    field_type?: string;
    group_name?: string;
    option_value?: string;
    option_label?: string;
    option_index?: number;
    is_selected?: boolean;
  } | null {
    let el: HTMLElement | null = element;
    let depth = 0;
    const maxDepth = 6;
    let optionCandidate: HTMLElement | null = null;
    while (el && depth < maxDepth) {
      // Identify option containers via data attributes or role
      if (!optionCandidate && (el.hasAttribute('data-option') || /option|choice|item|card|box/i.test(el.className) || el.getAttribute('role') === 'option')) {
        optionCandidate = el;
      }
      // If element itself is input/select we can stop early for field context
      if (['INPUT','SELECT','TEXTAREA'].includes(el.tagName)) {
        const input = el as HTMLInputElement;
        const field_name = input.name || input.id || '';
        if (!field_name) break;
        const label = this.getFieldLabel(input);
        const value = input.value || optionCandidate?.getAttribute('data-value') || optionCandidate?.getAttribute('data-option') || '';
        return {
          field_name,
          field_label: label,
          field_type: input.type || input.tagName.toLowerCase(),
          group_name: input.type === 'radio' ? input.name : undefined,
          option_value: value,
          option_label: optionCandidate ? (optionCandidate.getAttribute('data-label') || optionCandidate.textContent?.trim().substring(0,80) || value) : (value),
          option_index: this.computeSiblingIndex(optionCandidate || input),
          is_selected: input.type === 'checkbox' || input.type === 'radio' ? input.checked : undefined
        };
      }
      // Look for explicit data-field markers
      if (el.hasAttribute('data-field') || el.hasAttribute('data-field-name')) {
        const field_name = el.getAttribute('data-field-name') || el.getAttribute('data-field') || '';
        if (field_name) {
          const option_value = optionCandidate?.getAttribute('data-value') || optionCandidate?.getAttribute('data-option') || '';
          const option_label = optionCandidate?.getAttribute('data-label') || optionCandidate?.textContent?.trim().substring(0,80) || option_value;
          return {
            field_name,
            field_label: el.getAttribute('data-field-label') || field_name,
            field_type: el.getAttribute('data-field-type') || undefined,
            group_name: el.getAttribute('data-group') || undefined,
            option_value,
            option_label,
            option_index: optionCandidate ? this.computeSiblingIndex(optionCandidate) : undefined,
            is_selected: optionCandidate?.getAttribute('aria-selected') === 'true' || undefined
          };
        }
      }
      el = el.parentElement;
      depth++;
    }
    return null;
  }

  private computeSiblingIndex(el: HTMLElement): number | undefined {
    if (!el || !el.parentElement) return undefined;
    const siblings = Array.from(el.parentElement.children).filter(c => c instanceof HTMLElement);
    return siblings.indexOf(el);
  }

  private setupFormTracking(): void {
    // Enhanced input tracking with actual values
    document.addEventListener('input', (e) => {
      const element = e.target as HTMLElement;
      if (['input', 'textarea', 'select'].includes(element.tagName.toLowerCase())) {
        const inputElement = element as HTMLInputElement;
        const key = inputElement.name || inputElement.id || 'unnamed';
        
        // Debounce input tracking
        if (this.inputTracking[key]) {
          clearTimeout(this.inputTracking[key]);
        }
        
        this.inputTracking[key] = setTimeout(() => {
          this.sendTrackingEvent('input', {
            field_name: inputElement.name || inputElement.id || '',
            field_type: inputElement.type || inputElement.tagName.toLowerCase(),
            field_value: this.getSafeValue(inputElement),
            field_value_length: inputElement.value.length,
            field_placeholder: inputElement.placeholder || '',
            field_required: inputElement.required,
            field_step: this.getCurrentFormStep(),
            field_label: this.getFieldLabel(inputElement),
            parent_component: this.getParentComponent(inputElement)
          });
        }, 300);
      }
    });

    // Enhanced focus tracking
    document.addEventListener('focusin', (e) => {
      const element = e.target as HTMLElement;
      const tag = element.tagName.toLowerCase();
      if (['input', 'textarea', 'select', 'button'].includes(tag)) {
        const inputElement = element as HTMLInputElement;
        const payload = {
          element_type: tag,
          element_name: inputElement.name || inputElement.id || '',
          element_text: element.textContent?.trim().substring(0, 50) || '',
          element_placeholder: inputElement.placeholder || '',
          element_value: this.getSafeValue(inputElement),
          element_label: this.getFieldLabel(inputElement),
          form_step: this.getCurrentFormStep(),
          parent_component: this.getParentComponent(element),
          element_aria_label: element.getAttribute('aria-label') || ''
        };
        this.sendTrackingEvent('focus', payload); // legacy
        if (['input','textarea','select'].includes(tag)) {
          this.sendTrackingEvent('form_field_focus', {
            ...payload,
            field_name: payload.element_name,
            field_type: (inputElement as HTMLInputElement).type || tag
          });
        }
      }
    });

    // Blur tracking to capture when user leaves a field
    document.addEventListener('focusout', (e) => {
      const element = e.target as HTMLElement;
      const tag = element.tagName.toLowerCase();
      if (['input', 'textarea', 'select'].includes(tag)) {
        const inputElement = element as HTMLInputElement;
        const payload = {
          element_type: tag,
          element_name: inputElement.name || inputElement.id || '',
          element_value: this.getSafeValue(inputElement),
          field_completed: inputElement.value.length > 0,
          form_step: this.getCurrentFormStep(),
          parent_component: this.getParentComponent(element)
        };
        this.sendTrackingEvent('blur', payload); // legacy
        this.sendTrackingEvent('form_field_blur', {
          ...payload,
          field_name: payload.element_name,
          field_type: (inputElement as HTMLInputElement).type || tag
        });
      }
    });

    // Form submission tracking
    document.addEventListener('submit', (e) => {
      const form = e.target as HTMLFormElement;
      this.sendTrackingEvent('form_submit', {
        form_id: form.id || '',
        form_name: form.name || '',
        form_action: form.action || '',
        form_method: form.method || 'get'
      });
    });
  }

  private setupScrollTracking(): void {
    let ticking = false;
    
    const updateScrollTracking = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercentage = Math.round((scrollTop / documentHeight) * 100);
      
      // Only track significant scroll changes
      if (Math.abs(scrollTop - this.lastScrollTop) > 100) {
        this.sendTrackingEvent('scroll', {
          scroll_position: scrollTop,
          scroll_percentage: scrollPercentage,
          scroll_direction: scrollTop > this.lastScrollTop ? 'down' : 'up'
        });
        this.lastScrollTop = scrollTop;
      }
      
      ticking = false;
    };

    document.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollTracking);
        ticking = true;
      }
    });
  }

  private setupNavigationTracking(): void {
    // Track navigation events
    window.addEventListener('beforeunload', () => {
      this.sendTrackingEvent('page_unload', {
        time_on_page: Date.now() - this.startTime
      });
    });

    // Track back/forward navigation
    window.addEventListener('popstate', () => {
      this.sendTrackingEvent('navigation', {
        navigation_type: 'back_forward',
        page_url: window.location.href
      });
    });
  }

  private setupErrorTracking(): void {
    window.addEventListener('error', (e) => {
      this.sendTrackingEvent('javascript_error', {
        error_message: e.message,
        error_filename: e.filename,
        error_line: e.lineno,
        error_column: e.colno
      });
    });

    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', (e) => {
      this.sendTrackingEvent('promise_rejection', {
        error_reason: e.reason?.toString() || 'Unknown'
      });
    });
  }

  private setupPerformanceTracking(): void {
    window.addEventListener('load', () => {
      if (window.performance && window.performance.timing) {
        const timing = window.performance.timing;
        this.sendTrackingEvent('performance_metrics', {
          dns_lookup: timing.domainLookupEnd - timing.domainLookupStart,
          tcp_connect: timing.connectEnd - timing.connectStart,
          request_response: timing.responseEnd - timing.requestStart,
          dom_processing: timing.domComplete - timing.domLoading,
          total_load_time: timing.loadEventEnd - timing.navigationStart
        });
      }
    });
  }

  // ==================== HELPER METHODS ====================

  private getSafeValue(element: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement): string {
    // For sensitive fields, only return length or placeholder
    const sensitiveTypes = ['password', 'email', 'phone', 'tel'];
    const fieldName = (element.name || element.id || '').toLowerCase();
    const elementType = (element as HTMLInputElement).type || element.tagName.toLowerCase();
    
    if (sensitiveTypes.includes(elementType) || 
        fieldName.includes('password') || 
        fieldName.includes('email') ||
        fieldName.includes('phone')) {
      return `[${element.value.length} chars]`;
    }
    
    // For select elements, return the selected value and text
    if (element.tagName.toLowerCase() === 'select') {
      const selectElement = element as HTMLSelectElement;
      const selectedOption = selectElement.options[selectElement.selectedIndex];
      return selectedOption ? `${selectedOption.value} (${selectedOption.text})` : element.value;
    }
    
    // For other fields, return actual value but limit length
    return element.value.substring(0, 100);
  }

  private getFieldLabel(element: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement): string {
    // Try multiple ways to find the field label
    if ('labels' in element && element.labels && element.labels.length > 0) {
      return element.labels[0].textContent?.trim() || '';
    }
    
    // Look for label with for attribute
    const labelFor = document.querySelector(`label[for="${element.id}"]`);
    if (labelFor) {
      return labelFor.textContent?.trim() || '';
    }
    
    // Look for closest label
    const closestLabel = element.closest('label');
    if (closestLabel) {
      return closestLabel.textContent?.trim() || '';
    }
    
    // Look for aria-label or placeholder
    return element.getAttribute('aria-label') || (element as HTMLInputElement).placeholder || '';
  }

  private getParentComponent(element: HTMLElement): string {
    // Try to identify the parent component/section
    let parent = element.parentElement;
    while (parent) {
      const className = typeof parent.className === 'string' ? parent.className : '';
      const id = typeof parent.id === 'string' ? parent.id : '';
      
      // Look for component indicators
      if (className.includes('step') || id.includes('step')) {
        return `step-${className || id}`;
      }
      if (className.includes('form') || parent.tagName === 'FORM') {
        return 'form-section';
      }
      if (className.includes('modal') || className.includes('dialog')) {
        return 'modal';
      }
      if (className.includes('header') || parent.tagName === 'HEADER') {
        return 'header';
      }
      if (className.includes('nav') || parent.tagName === 'NAV') {
        return 'navigation';
      }
      if (parent.id) {
        return parent.id;
      }
      parent = parent.parentElement;
    }
    return 'unknown';
  }

  private getCurrentFormStep(): number {
    // Try to determine current form step from various indicators
    const stepIndicator = document.querySelector('[data-step]');
    if (stepIndicator) {
      return parseInt(stepIndicator.getAttribute('data-step') || '0');
    }
    
    const progressBar = document.querySelector('.progress-bar, .step-indicator, .progress');
    if (progressBar) {
      const activeStep = progressBar.querySelector('.active, .current, .bg-primary');
      const allSteps = progressBar.querySelectorAll('.step, .progress-step, div');
      if (activeStep && allSteps) {
        return Array.from(allSteps).indexOf(activeStep) + 1;
      }
    }
    
    // Check for step in URL
    const urlParams = new URLSearchParams(window.location.search);
    const stepParam = urlParams.get('step');
    if (stepParam) {
      return parseInt(stepParam);
    }
    
    return 0;
  }

  // ==================== PUBLIC TRACKING METHODS ====================

  public trackPageView(pageName?: string): void {
    // Page view tracking disabled per user request
    console.log('📍 Page view tracking disabled:', pageName || document.title);
  }

  public trackFormStart(formData: any): void {
    this.sendTrackingEvent('form_start', {
      form_type: 'button_builder'
    });
  }

  public trackFormStep(stepNumber: number, timeOnStep?: number): void {
    this.sendTrackingEvent('form_step', {
      step_number: stepNumber,
      time_on_step: timeOnStep
    });
  }

  public trackFormStepStart(stepNumber: number, totalSteps: number): void {
    this.sendTrackingEvent('form_step_start', {
      step_number: stepNumber,
      total_steps: totalSteps
    });
  }

  public trackFormSubmission(formData: any): void {
    this.sendTrackingEvent('form_submission', {
      total_steps: formData.totalSteps,
      completion_time: Date.now() - this.startTime
    });
  }

  public trackLanguageChange(from: string, to: string): void {
    this.sendTrackingEvent('language_change', {
      previous_language: from,
      new_language: to,
      trigger: 'user_selection'
    });
  }

  public trackThemeChange(from: string, to: string): void {
    this.sendTrackingEvent('theme_change', {
      previous_theme: from,
      new_theme: to
    });
  }

  public trackDraftSave(draftData: any): void {
    this.sendTrackingEvent('draft_save', {
      draft_id: draftData.id,
      current_step: draftData.currentStep
    });
  }

  public trackDraftLoad(draftData: any): void {
    this.sendTrackingEvent('draft_load', {
      draft_id: draftData.id,
      source_key: draftData.sourceKey
    });
  }

  public trackOrderCreation(orderData: any): void {
    this.sendTrackingEvent('order_creation', {
      order_id: orderData.orderId
    });
  }

  public trackCancelAction(reason: string, hasData: boolean): void {
    this.sendTrackingEvent('cancel_action', {
      reason: reason,
      has_data: hasData
    });
  }

  public trackModalOpen(modalType: string): void {
    this.sendTrackingEvent('modal_open', {
      modal_type: modalType
    });
  }

  public trackModalClose(modalType: string, action: string): void {
    this.sendTrackingEvent('modal_close', {
      modal_type: modalType,
      action: action
    });
  }

  public trackSearchAction(query: string, resultsCount?: number): void {
    this.sendTrackingEvent('search', {
      search_query: query,
      results_count: resultsCount || 0
    });
  }

  public trackFormInput(fieldName: string, value: any, stepNumber?: number): void {
    this.sendTrackingEvent('form_input_manual', {
      field_name: fieldName,
      field_value_type: typeof value,
      field_value_length: value ? String(value).length : 0,
      step_number: stepNumber || this.getCurrentFormStep(),
      has_value: value !== null && value !== undefined && value !== ''
    });
  }

  // Additional methods for TrackingProvider compatibility
  public trackButtonClick(buttonName: string, additionalData?: any): void {
    this.sendTrackingEvent('button_click', {
      button_name: buttonName,
      additional_data: additionalData
    });
  }

  public trackFormSubmit(formName: string, formData?: any): void {
    this.sendTrackingEvent('form_submit', {
      form_name: formName,
      form_data: formData
    });
  }

  public trackError(error: string, context?: string): void {
    this.sendTrackingEvent('error', {
      error_message: error,
      error_context: context,
      error_timestamp: Date.now()
    });
  }

  public trackCustomEvent(eventName: string, data?: any): void {
    this.sendTrackingEvent('custom_event', {
      event_name: eventName,
      event_data: data
    });
  }

  // Debounced input tracking - only track final values
  private debouncedInputTracking: Map<string, NodeJS.Timeout> = new Map();

  public trackFormInputDebounced(fieldName: string, value: any, stepNumber?: number, delayMs: number = 1000): void {
    // Clear existing timeout for this field
    const existingTimeout = this.debouncedInputTracking.get(fieldName);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    // Set new timeout to track the final value
    const timeoutId = setTimeout(() => {
      this.sendTrackingEvent('form_input_final', {
        field_name: fieldName,
        field_value_type: typeof value,
        field_value_length: value ? String(value).length : 0,
        step_number: stepNumber || this.getCurrentFormStep(),
        has_value: value !== null && value !== undefined && value !== '',
        final_value: true
      });
      
      // Clean up the timeout reference
      this.debouncedInputTracking.delete(fieldName);
    }, delayMs);

    // Store the timeout reference
    this.debouncedInputTracking.set(fieldName, timeoutId);
  }

  public trackFormInputBlur(fieldName: string, value: any, stepNumber?: number): void {
    this.sendTrackingEvent('form_input_blur', {
      field_name: fieldName,
      field_value_type: typeof value,
      field_value_length: value ? String(value).length : 0,
      step_number: stepNumber || this.getCurrentFormStep(),
      has_value: value !== null && value !== undefined && value !== '',
      interaction_type: 'blur'
    });
  }

  // ==================== AUDIO SPECIFIC EVENTS ====================
  public trackAudioPlay(index: number, baseName: string, duration: number): void {
  this.sendTrackingEvent('audio_play', { audio_index: index, audio_name: baseName, audio_duration: Math.round(duration), form_step: this.getCurrentFormStep() });
  }
  public trackAudioPause(index: number, baseName: string, duration: number, currentTime?: number): void {
  this.sendTrackingEvent('audio_pause', { audio_index: index, audio_name: baseName, audio_duration: Math.round(duration), audio_position: Math.round(currentTime || 0), form_step: this.getCurrentFormStep() });
  }
  public trackAudioEnd(index: number, baseName: string, duration: number): void {
  this.sendTrackingEvent('audio_end', { audio_index: index, audio_name: baseName, audio_duration: Math.round(duration), form_step: this.getCurrentFormStep() });
  }
  public trackAudioSeek(index: number, baseName: string, from: number, to: number, duration: number): void {
  this.sendTrackingEvent('audio_seek', { audio_index: index, audio_name: baseName, from: Math.round(from), to: Math.round(to), audio_duration: Math.round(duration), form_step: this.getCurrentFormStep() });
  }
  public trackAudioGalleryScroll(percent: number): void {
  this.sendTrackingEvent('audio_gallery_scroll', { scroll_percent: percent, form_step: this.getCurrentFormStep() });
  }
  public trackAudioCardClick(index: number, baseName: string): void {
  this.sendTrackingEvent('audio_card_click', { audio_index: index, audio_name: baseName, form_step: this.getCurrentFormStep() });
  }
}

// Create singleton instance
const comprehensiveTracker = new ComprehensiveTrackingService();

export default comprehensiveTracker;
