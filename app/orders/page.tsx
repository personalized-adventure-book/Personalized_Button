"use client";

import { useState, useEffect, Suspense } from "react";
import { Package, Eye, Calendar, User, ArrowLeft, Download, Trash2, Home, Edit3, Play, X } from "lucide-react";
import { useUrlId } from "../../hooks/useUrlIdStatic";
import { useStaticContent } from "../../hooks/useStaticContent";
import { orderStorage, CompletedOrder } from "@/utils/orderStorage";
import { useTracking } from "@/components/TrackingProvider";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

// Loading component
function LoadingSpinner() {
  return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
}

// Main orders content
function OrdersPageContent() {
  const { navigateWithId, id, mounted, getCurrentId, parseId } = useUrlId();
  const { getContent, loading } = useStaticContent();
  const { trackPageView, trackDraftLoad, trackModalOpen, trackModalClose } = useTracking();
  const { t } = useLanguage();
  const [orders, setOrders] = useState<CompletedOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<CompletedOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Drafts state
  const [drafts, setDrafts] = useState<any[]>([]);
  
  // Confirmation modal state
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (!mounted) return;
    // Load orders from cookies
    const loadOrders = () => {
      const currentId = (getCurrentId() || 'BT1').toUpperCase();
      const allOrders = orderStorage.getCompletedOrders();
      const { productType } = parseId(currentId);
      const ordersForProduct = allOrders.filter(o => o.id?.toUpperCase().startsWith(productType));

      console.log('📋 All orders:', allOrders);
      console.log('🧩 Product type', productType, '→ Orders:', ordersForProduct);

      setOrders(ordersForProduct);
      setIsLoading(false);
    };

    // Load drafts from localStorage
    const loadDrafts = () => {
      try {
        const allDrafts: any[] = [];
        
        // Load from different draft sources
        const sources = [
          { key: 'mymood-drafts', name: 'Button Builder Drafts' },
          { key: 'formDrafts', name: 'Form Drafts' },
          { key: 'mymood-button-drafts', name: 'Enhanced Drafts' },
          { key: 'button-drafts', name: 'Legacy Drafts' }
        ];
        
        sources.forEach(source => {
          const savedDrafts = localStorage.getItem(source.key);
          if (savedDrafts) {
            try {
              const parsedDrafts = JSON.parse(savedDrafts);
              if (Array.isArray(parsedDrafts)) {
                // Add source info to each draft
                const draftsWithSource = parsedDrafts.map(draft => ({
                  ...draft,
                  source: source.name,
                  sourceKey: source.key
                }));
                allDrafts.push(...draftsWithSource);
              }
            } catch (error) {
              console.error(`Error parsing drafts from ${source.key}:`, error);
            }
          }
        });

        // ---------------------------------------------------------
        // Include in‑progress homepage form draft (cookie based)
        // ---------------------------------------------------------
        try {
          const cookieName = 'mymood-home-form-draft';
          // Read cookie manually (avoid external helpers)
            const match = document.cookie.match(new RegExp('(?:^|; )' + cookieName.replace(/([.$?*|{}()\[\]\\/+^])/g, '\\$1') + '=([^;]*)'));
            const cookieVal = match ? decodeURIComponent(match[1]) : null;
            if (cookieVal) {
              try {
                const parsed = JSON.parse(cookieVal);
                // Basic validation
                if (parsed && parsed.values && typeof parsed === 'object') {
                  const existing = allDrafts.find(d => d.id === 'homepage-draft');
                  if (!existing) {
                    allDrafts.unshift({
                      id: 'homepage-draft',
                      title: parsed.values?.button_name || parsed.values?.project_name || 'Homepage In-Progress',
                      name: parsed.values?.button_name || parsed.values?.project_name || 'Homepage In-Progress',
                      currentStep: typeof parsed.step === 'number' ? parsed.step : (typeof parsed.currentStep === 'number' ? parsed.currentStep : 0),
                      step: typeof parsed.step === 'number' ? parsed.step : undefined,
                      formData: parsed.values,
                      timestamp: new Date(parsed.ts || Date.now()).toISOString(),
                      source: 'Homepage Draft',
                      sourceKey: 'homepage-cookie',
                      // Flag to show it's ephemeral
                      ephemeral: true
                    });
                  }
                }
              } catch (e) {
                console.error('Error parsing homepage draft cookie:', e);
              }
            }
        } catch (e) {
          console.error('Error including homepage draft cookie:', e);
        }
        
        console.log('Loaded drafts from all sources:', allDrafts);
        setDrafts(allDrafts);
      } catch (error) {
        console.error('Error loading drafts:', error);
      }
    };

    loadOrders();
    loadDrafts();
    
    // Track page view
    trackPageView('orders');
  }, [mounted, id, getCurrentId, trackPageView]);

  const handleDeleteOrder = (orderNumber: string) => {
    setOrderToDelete(orderNumber);
    trackModalOpen('delete_order_confirmation');
    setShowDeleteConfirmation(true);
  };

  const confirmDeleteOrder = () => {
    if (orderToDelete) {
      // Get all orders, remove the one we want to delete, and save back
      const allOrders = orderStorage.getCompletedOrders();
      const filteredOrders = allOrders.filter(order => order.orderNumber !== orderToDelete);
      
      // Clear and save updated orders
      orderStorage.clearAllOrders();
      if (filteredOrders.length > 0) {
        // Re-save all remaining orders
        filteredOrders.forEach(order => {
          orderStorage.saveCompletedOrder(order.orderNumber, order.orderData, order.id);
        });
      }
      
      // Refresh the display
      const currentId = (getCurrentId() || 'BT1').toUpperCase();
      const { productType } = parseId(currentId);
      const updatedOrdersForProduct = orderStorage
        .getCompletedOrders()
        .filter(o => o.id?.toUpperCase().startsWith(productType));
      setOrders(updatedOrdersForProduct);
      setSelectedOrder(null);
    }
    
    trackModalClose('delete_order_confirmation', 'confirm_delete');
    setShowDeleteConfirmation(false);
    setOrderToDelete(null);
  };

  const cancelDeleteOrder = () => {
    trackModalClose('delete_order_confirmation', 'cancel');
    setShowDeleteConfirmation(false);
    setOrderToDelete(null);
  };

  const handleDeleteDraft = (draftId: string) => {
    // Find the draft to get its source key
    const draftToDelete = drafts.find(draft => draft.id === draftId);
    if (!draftToDelete) return;

    // Delete from the specific source
    const sourceKey = draftToDelete.sourceKey;
    try {
      if (sourceKey === 'homepage-cookie') {
        // Clear the cookie by expiring it
        document.cookie = 'mymood-home-form-draft=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;';
      } else {
      const savedDrafts = localStorage.getItem(sourceKey);
      if (savedDrafts) {
        const parsedDrafts = JSON.parse(savedDrafts);
        const updatedDrafts = parsedDrafts.filter((draft: any) => draft.id !== draftId);
        localStorage.setItem(sourceKey, JSON.stringify(updatedDrafts));
      }
      }
    } catch (error) {
      console.error(`Error deleting draft from ${sourceKey}:`, error);
    }

    // Update local state
    const updatedDrafts = drafts.filter(draft => draft.id !== draftId);
    setDrafts(updatedDrafts);

    // Signal the homepage to reset when the homepage draft is deleted,
    // and also if no drafts remain as a defensive fallback
    try {
      if (sourceKey === 'homepage-cookie') {
        // Explicit reset if the in-progress homepage draft was removed
        localStorage.setItem('homeFormReset', String(Date.now()));
      } else if (updatedDrafts.length === 0) {
        // Defensive: if user cleared all drafts, ensure homepage resets too
        document.cookie = 'mymood-home-form-draft=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;';
        localStorage.setItem('homeFormReset', String(Date.now()));
      }
    } catch (e) {
      console.error('Error broadcasting home form reset:', e);
    }
  };

  const handleResumeDraft = (draftId: string) => {
    // Find the draft to resume
    const draftToResume = drafts.find(draft => draft.id === draftId);
    if (!draftToResume) return;

    // Track draft loading
    trackDraftLoad(draftToResume);

    // Different draft sources require different resume methods
    if (draftToResume.sourceKey === 'formDrafts') {
      // For form drafts, save to loadDraftData
      localStorage.setItem('loadDraftData', JSON.stringify(draftToResume));
      navigateWithId('/customize');
    } else if (draftToResume.sourceKey === 'mymood-drafts') {
      // Legacy drafts: pass the object directly for robust restore
      localStorage.setItem('loadDraftData', JSON.stringify(draftToResume));
      navigateWithId('/customize');
    } else if (draftToResume.sourceKey === 'homepage-cookie') {
      // Navigate back to homepage; it will auto-restore from cookie
      try {
        sessionStorage.setItem('scrollToSection', 'form-container');
      } catch {}
      navigateWithId('/');
    } else {
      // Default: try to save as loadDraftData and navigate
      localStorage.setItem('loadDraftData', JSON.stringify(draftToResume));
      navigateWithId('/customize');
    }
  };

  const handleDownloadReceipt = async (order: CompletedOrder) => {
    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF({ unit: 'pt', format: 'a4' });
      const left = 48;
      const right = 560; // ~page width - margin
      let y = 64;
      const bottom = 800;

      const ensureSpace = (advance = 18) => {
        if (y + advance > bottom) {
          doc.addPage();
          y = 64;
        }
      };

      const line = (text: string, opts?: { bold?: boolean; size?: number }) => {
        const { bold, size } = opts || {};
        doc.setFontSize(size ?? 12);
        doc.setFont('helvetica', bold ? 'bold' : 'normal');
        const split = doc.splitTextToSize(text, right - left);
        split.forEach((t: string) => {
          ensureSpace();
          doc.text(t, left, y);
          y += 18;
        });
      };

      // Header
      doc.setFontSize(18); doc.setFont('helvetica', 'bold');
      doc.text('Order Confirmation', left, y); y += 28;
      doc.setFontSize(12); doc.setFont('helvetica', 'normal');
      line(`Order #: ${order.orderNumber}`, { bold: true });
      line(`Date: ${new Date(order.timestamp).toLocaleDateString()}  Time: ${new Date(order.timestamp).toLocaleTimeString()}`);
      if (order.id) line(`Product ID: ${order.id}`);
      y += 8;

      // Customer
      line('Customer', { bold: true });
      const customer = order.orderData?.full_name || order.orderData?.customer_name || 'Customer';
      line(String(customer));
      y += 8;

      // Order details
      line('Order Details', { bold: true });
      Object.entries(order.orderData || {})
        .filter(([k, v]) => v && k !== 'experiences')
        .forEach(([k, v]) => {
          const value = typeof v === 'object' ? JSON.stringify(v) : String(v);
          line(`${k.replace(/_/g, ' ').toUpperCase()}: ${value}`);
        });
      y += 8;

      // Experiences
      const exps = (order.orderData as any)?.experiences;
      if (Array.isArray(exps) && exps.length) {
        line('Experiences', { bold: true });
        exps.forEach((exp: any, idx: number) => {
          line(`${idx + 1}. ${exp?.activity_name || 'Unnamed Experience'}`, { bold: true });
          if (exp?.experience_details) line(`Details: ${exp.experience_details}`);
          if (exp?.characters_involved) line(`Characters: ${exp.characters_involved}`);
          y += 6;
        });
      }
      y += 12;
      line('Thank you for your order! Your personalized item will be created and shipped soon.');

      doc.save(`order-${order.orderNumber}-receipt.pdf`);
    } catch (e) {
      console.error('PDF generation failed, falling back to text:', e);
      const receipt = `Order #${order.orderNumber}`;
      const blob = new Blob([receipt], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `order-${order.orderNumber}-receipt.txt`;
      document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
    }
  };

  if (!mounted || isLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 main-content-with-header">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4 sm:py-6">
          <button
            onClick={() => navigateWithId('/')}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm sm:text-base">{t('confirmation.goHome')}</span>
          </button>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{t('orders.title')}</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1 sm:mt-2 text-sm sm:text-base">
                {t('orders.subtitle')}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigateWithId('/customize')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm sm:text-base whitespace-nowrap"
              >
                {t('customize.navigation.confirmOrder') ? t('navigation.startCustomizing') : 'Create New Order'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Drafts Section */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Edit3 className="w-5 sm:w-6 h-5 sm:h-6 text-blue-600" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                {t('orders.savedDrafts')} ({drafts.length})
              </h2>
            </div>
            
            {drafts.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 text-center">
                <Edit3 className="w-10 sm:w-12 h-10 sm:h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{t('orders.noDraftsYet')}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm sm:text-base">
                  {t('orders.noDraftsHint')}
                </p>
                <button
                  onClick={() => navigateWithId('/customize')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm sm:text-base"
                >
                  {t('navigation.startCustomizing')}
                </button>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {drafts.map((draft) => (
                  <div key={draft.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="min-w-0 flex-1 mr-2">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white truncate">
                          {draft.name || draft.title || 'Untitled Draft'}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                          {draft.lastModified 
                            ? new Date(draft.lastModified).toLocaleDateString() 
                            : draft.timestamp 
                            ? new Date(draft.timestamp).toLocaleDateString()
                            : 'No date'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                          Source: {draft.source}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteDraft(draft.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {(() => {
                      // Prefer zero-based currentStep if present; fallback to one-based step
                      const hasCurrent = typeof draft.currentStep === 'number';
                      const hasStep = typeof draft.step === 'number';
                      if (!hasCurrent && !hasStep) return null;
                      const totalSteps = 8; // unify step count here (adjust if dynamic later)
                      const zeroBased = hasCurrent
                        ? draft.currentStep
                        : Math.max(0, draft.step - 1); // convert one-based to zero-based
                      const displayStep = zeroBased + 1;
                      const pct = (displayStep / totalSteps) * 100;
                      return (
                        <div className="mb-4">
                          <div className="flex justify-between text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-1">
                            <span>Progress</span>
                            <span>Step {displayStep}/{totalSteps}</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${pct}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })()}
                    
                    <button
                      onClick={() => handleResumeDraft(draft.id)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                    >
                      <Play className="w-4 h-4" />
                      {t('orders.resume')}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Orders Section */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Package className="w-5 sm:w-6 h-5 sm:h-6 text-green-600" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                {t('orders.completedOrders')} ({orders.length})
              </h2>
            </div>
          
          {orders.length === 0 ? (
            /* No Orders State */
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 sm:p-12 text-center">
              <Package className="w-12 sm:w-16 h-12 sm:h-16 mx-auto text-gray-400 mb-4" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">{t('orders.noOrdersYet')}</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm sm:text-base">
                {t('orders.noOrdersHint')}
              </p>
              <button
                onClick={() => navigateWithId('/customize')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-colors text-sm sm:text-base"
              >
                {t('navigation.startCustomizing')}
              </button>
            </div>
          ) : (
            /* Orders List */
            <div className="grid gap-4 sm:gap-6">
              {orders.map((order) => (
                <div key={order.orderNumber} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                      <div className="bg-green-100 dark:bg-green-900/20 p-2 sm:p-3 rounded-lg flex-shrink-0">
                        <Package className="w-5 sm:w-6 h-5 sm:h-6 text-green-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white whitespace-normal">
                          <span className="whitespace-nowrap">{t('confirmation.orderNumber')}</span>
                          <span className="break-words">{order.orderNumber}</span>
                        </h3>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 sm:w-4 h-3 sm:h-4" />
                            {new Date(order.timestamp).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1 truncate">
                            <User className="w-3 sm:w-4 h-3 sm:h-4" />
                            <span className="truncate">
                              {order.orderData.parent_name || order.orderData.customer_name || 'Customer'}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2">
                      <button
                        onClick={() => setSelectedOrder(selectedOrder?.orderNumber === order.orderNumber ? null : order)}
                        className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-xs sm:text-sm whitespace-nowrap"
                      >
                        <Eye className="w-3 sm:w-4 h-3 sm:h-4" />
                        {selectedOrder?.orderNumber === order.orderNumber ? t('orders.hideDetails') : t('orders.viewDetails')}
                      </button>
                      
                      <button
                        onClick={() => handleDownloadReceipt(order)}
                        className="flex items-center justify-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-xs sm:text-sm whitespace-nowrap"
                      >
                        <Download className="w-3 sm:w-4 h-3 sm:h-4" />
                        {t('orders.receipt')}
                      </button>
                      
                      <button
                        onClick={() => handleDeleteOrder(order.orderNumber)}
                        className="flex items-center justify-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-xs sm:text-sm whitespace-nowrap"
                      >
                        <Trash2 className="w-3 sm:w-4 h-3 sm:h-4" />
                        {t('orders.delete')}
                      </button>
                    </div>
                  </div>

                  {/* Order Details */}
                  {selectedOrder?.orderNumber === order.orderNumber && (
                    <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-600">
                      <h4 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">{t('confirmation.orderDetails')}</h4>
                      
                      <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
                        {Object.entries(order.orderData)
                          .filter(([key, value]) => value && key !== 'experiences')
                          .map(([key, value]) => (
                            <div key={key} className="space-y-1 sm:space-y-2">
                              <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                {key.replace(/_/g, ' ')}
                              </p>
                              <p className="text-sm sm:text-base text-gray-900 dark:text-white break-words">
                                {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                              </p>
                            </div>
                          ))}
                      </div>

                      {/* Experiences Section */}
                      {order.orderData.experiences && order.orderData.experiences.length > 0 && (
                        <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-600">
                          <h5 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
                            {t('orders.experiences')} ({order.orderData.experiences.length})
                          </h5>
                          <div className="space-y-3 sm:space-y-4">
                            {order.orderData.experiences.map((experience: any, index: number) => (
                              <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 sm:p-4">
                                <h6 className="font-medium text-gray-900 dark:text-white mb-2 text-sm sm:text-base">
                                  {index + 1}. {experience.activity_name || t('orders.unnamedExperience')}
                                </h6>
                                {experience.experience_details && (
                                  <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm mb-2 break-words">
                                    {experience.experience_details}
                                  </p>
                                )}
                                {experience.characters_involved && (
                                  <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm break-words">
                                    {`${t('orders.characters')}: ${experience.characters_involved}`}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          </div>

          {/* Summary */}
          {orders.length > 0 && (
            <div className="mt-6 sm:mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
              <div className="text-center">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {t('review.orderSummary')}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                  {`You have completed `}<strong>{orders.length}</strong>{` order${orders.length !== 1 ? 's' : ''}`}
                </p>
                <button
                  onClick={() => navigateWithId('/customize')}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-colors text-sm sm:text-base"
                >
                  {t('navigation.startCustomizing')}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-4 sm:p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 sm:w-12 h-10 sm:h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                <Trash2 className="w-5 sm:w-6 h-5 sm:h-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                  {t('orders.deleteOrder')}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                  {t('orders.cannotBeUndone')}
                </p>
              </div>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm sm:text-base">
              {t('orders.areYouSureDelete').replace('{order}', String(orderToDelete))}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
              <button
                onClick={cancelDeleteOrder}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-sm sm:text-base order-2 sm:order-1"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={confirmDeleteOrder}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2 text-sm sm:text-base order-1 sm:order-2"
              >
                <Trash2 className="w-4 h-4" />
                {t('orders.delete')}
              </button>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
}

// Export with Suspense wrapper for static export compatibility
export default function OrdersPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <OrdersPageContent />
    </Suspense>
  );
}
