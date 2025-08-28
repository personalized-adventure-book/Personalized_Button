'use client';

import { useEffect, useState, Suspense } from 'react';
import { useUrlId } from '../../hooks/useUrlIdStatic';
import { useStaticContent } from '../../hooks/useStaticContent';
import { orderStorage } from '@/utils/orderStorage';
import { CheckCircle, Download, Share2, ArrowLeft, Package, Calendar, CreditCard, User, Home } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

// Loading component
function LoadingSpinner() {
  return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
}

// Main order confirmation content
function OrderConfirmationContent() {
  const { navigateWithId, id, mounted, getCurrentId } = useUrlId();
  const { getContent, loading } = useStaticContent();
  const { t } = useLanguage();
  const [orderData, setOrderData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [orderNumber] = useState(() => `ORD-${Date.now().toString().slice(-6)}`);
  const [orderSavedToCookies, setOrderSavedToCookies] = useState(false);
  const [showDetails, setShowDetails] = useState(true);

  // Function to clear form data from localStorage and sessionStorage
  const clearFormData = () => {
    // Clear any form-related data from localStorage (but NOT completedOrderData on this page)
    const localStorageKeysToRemove = [
      'formData',
      'formValues',
      'currentStep',
      'mymood-config',
      'mymood-drafts',
      'mymood-button-enhanced-draft',
      'mymood-button-expanded-draft',
      'mymood-button-drafts',
      'dynamic-form-values',
      'mymood-active-order',
      'mymood-button-draft'
    ];
    
    // Clear any form-related data from sessionStorage
    const sessionStorageKeysToRemove = [
      'mymood-current-step',
      'mymood-current-config',
      'mymood-force-reset',
      'dynamic-form-values',
      'dynamic-form-current-step'
    ];
    
    localStorageKeysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });
    
    sessionStorageKeysToRemove.forEach(key => {
      sessionStorage.removeItem(key);
    });
    
    // Set force reset flag to ensure clean state
    sessionStorage.setItem("mymood-force-reset", "true");
    
    // Clear completedOrderData when navigating away
    localStorage.removeItem('completedOrderData');
  };

  useEffect(() => {
    if (!mounted) return;
    // Get order data from localStorage (stored when form was completed)
    const savedOrderData = localStorage.getItem('completedOrderData');
    
    if (savedOrderData) {
      try {
        const parsedData = JSON.parse(savedOrderData);
        setOrderData(parsedData);
        
        // Save order to cookies for the orders page using stable ID
  const currentIdStable = getCurrentId() || 'BT1';
  // Normalize saved id to product-type scope, so orders persist across language switches
  const productScopedId = currentIdStable.substring(0, 2); // e.g., BT, BK, BR
        // Avoid duplicate save if already present
        const alreadySaved = orderStorage
          .getCompletedOrders()
          .some((o) => o.orderNumber === orderNumber);
        let success = true;
        if (!alreadySaved) {
          success = orderStorage.saveCompletedOrder(orderNumber, parsedData, productScopedId);
        }
        setOrderSavedToCookies(success);
        
        // Clear all form data immediately after saving to cookies
        const localStorageKeysToRemove = [
          'formData',
          'formValues',
          'currentStep',
          'mymood-config',
          'mymood-drafts',
          'mymood-button-enhanced-draft',
          'mymood-button-expanded-draft',
          'mymood-button-drafts',
          'dynamic-form-values',
          'mymood-active-order',
          'mymood-button-draft'
        ];
        
        const sessionStorageKeysToRemove = [
          'mymood-current-step',
          'mymood-current-config',
          'mymood-force-reset',
          'dynamic-form-values',
          'dynamic-form-current-step'
        ];
        
        localStorageKeysToRemove.forEach(key => {
          localStorage.removeItem(key);
        });
        
        sessionStorageKeysToRemove.forEach(key => {
          sessionStorage.removeItem(key);
        });
        
        // Set force reset flag
        sessionStorage.setItem("mymood-force-reset", "true");
        // Do NOT auto-remove completedOrderData; keep until user navigates away
        setIsLoading(false);
      } catch (error) {
        console.error('Error parsing order data:', error);
        // Stay on page and allow user to navigate manually
        setIsLoading(false);
      }
    } else {
      // If no order data found, show message and let user decide
      setIsLoading(false);
    }
  }, [mounted]);

  const handleBackToHome = () => {
    // Clear the form data when going back to home
    clearFormData();
    navigateWithId('/');
  };

  const handleCreateAnother = () => {
    // Clear the form data when creating another order
    clearFormData();
    navigateWithId('/customize');
  };

  const handleGoToOrders = () => {
    navigateWithId('/orders');
  };

  const handleDownloadReceipt = async () => {
    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF({ unit: 'pt', format: 'a4' });
      const left = 48;
      let y = 64;
      const line = (text: string, opts?: { bold?: boolean; size?: number }) => {
        const { bold, size } = opts || {};
        if (size) doc.setFontSize(size); else doc.setFontSize(12);
        doc.setFont('helvetica', bold ? 'bold' : 'normal');
        const split = doc.splitTextToSize(text, 520);
        split.forEach((t: string) => { doc.text(t, left, y); y += 18; });
      };
      // Header
      doc.setFontSize(18); doc.setFont('helvetica', 'bold');
      doc.text('Order Confirmation', left, y); y += 28;
      doc.setFontSize(12); doc.setFont('helvetica', 'normal');
      line(`Order #: ${orderNumber}`, { bold: true });
      line(`Date: ${new Date().toLocaleDateString()}  Time: ${new Date().toLocaleTimeString()}`);
      y += 8;
      // Customer
      line('Customer', { bold: true });
      line(String(orderData?.full_name || orderData?.customer_name || 'Customer'));
      y += 8;
      // Order details
      line('Order Details', { bold: true });
      Object.entries(orderData || {})
        .filter(([k, v]) => v && k !== 'experiences')
        .forEach(([k, v]) => line(`${k.replace(/_/g, ' ').toUpperCase()}: ${typeof v === 'object' ? JSON.stringify(v) : String(v)}`));
      y += 8;
      // Experiences
      if (orderData?.experiences?.length) {
        line('Experiences', { bold: true });
        orderData.experiences.forEach((exp: any, idx: number) => {
          line(`${idx + 1}. ${exp.activity_name || 'Unnamed Experience'}`, { bold: true });
          if (exp.experience_details) line(`Details: ${exp.experience_details}`);
          if (exp.characters_involved) line(`Characters: ${exp.characters_involved}`);
          y += 6;
        });
      }
      y += 12;
      line('Thank you for your order! Your personalized item will be created and shipped soon.');
      doc.save(`order-${orderNumber}-receipt.pdf`);
  } catch (e) {
      console.error('PDF generation failed, falling back to text:', e);
      // Fallback to original text receipt if PDF fails
      const receipt = `Order #${orderNumber}`;
      const blob = new Blob([receipt], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
      a.href = url; a.download = `order-${orderNumber}-receipt.txt`;
      document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
    }
  };

  const handleShare = async () => {
    const shareText = `I just ordered my personalized button! Order #${orderNumber}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Personalized Button Order',
          text: shareText,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(shareText);
      alert('Order details copied to clipboard!');
    }
  };

  // Loading state
  if (!mounted || isLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  // No order data found
  if (!orderData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-red-500 mb-4">
            <Package className="w-16 h-16 mx-auto" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t('ui.unableToLoadContent')}</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {t('ui.failedToLoadContent')}
          </p>
          <button
            onClick={handleBackToHome}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            {t('confirmation.goHome')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 pt-20">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <button
            onClick={handleBackToHome}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            {t('confirmation.goHome')}
          </button>
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="relative">
                <CheckCircle className="w-16 h-16 text-green-500 animate-pulse" />
                <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-green-500 opacity-20 animate-ping"></div>
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 animate-fade-in">
              {t('confirmation.title')}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 animate-fade-in">
              {t('confirmation.thankYou')}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Order Summary Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Package className="w-6 h-6 text-blue-600" />
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('review.orderSummary')}</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <CreditCard className="w-5 h-5 text-gray-500" />
                  <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{t('confirmation.orderNumber2')}</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{orderNumber}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{t('orders.orderDate')}</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <User className="w-5 h-5 text-gray-500" />
                  <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{t('orders.customer')}</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {orderData?.full_name || orderData?.customer_name || 'Customer'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
        <p className="text-sm text-green-600 dark:text-green-400">{t('confirmation.status')}</p>
        <p className="font-semibold text-green-700 dark:text-green-300">{t('confirmation.confirmedProcessing')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Details (toggleable) */}
          {orderData && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t('confirmation.orderDetails')}</h3>
                <button
                  onClick={() => setShowDetails((v) => !v)}
                  className="text-sm px-3 py-1 rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  {showDetails ? t('orders.hideDetails') : t('orders.viewDetails')}
                </button>
              </div>
              {showDetails ? (
              <div>
              <div className="grid md:grid-cols-2 gap-6">
                {Object.entries(orderData)
                  .filter(([key, value]) => value && key !== 'experiences')
                  .map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        {key.replace(/_/g, ' ')}
                      </p>
                      <p className="text-gray-900 dark:text-white">
                        {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                      </p>
                    </div>
                  ))}
              </div>
              
              {/* Experiences Section */}
              {orderData.experiences && orderData.experiences.length > 0 && (
                <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-600">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    {t('orders.experiences')} ({orderData.experiences.length})
                  </h4>
                  <div className="space-y-4">
                    {orderData.experiences.map((experience: any, index: number) => (
                      <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <h5 className="font-medium text-gray-900 dark:text-white mb-2">
                          {index + 1}. {experience.activity_name || t('orders.unnamedExperience')}
                        </h5>
                        {experience.experience_details && (
                          <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                            {experience.experience_details}
                          </p>
                        )}
                        {experience.characters_involved && (
                          <p className="text-gray-500 dark:text-gray-400 text-sm">{`${t('orders.characters')}: ${experience.characters_involved}`}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              </div>
              ) : null}
            </div>
          )}

          {/* Action Buttons */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">{t('confirmation.whatNext')}</h3>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={handleDownloadReceipt}
                className="flex items-center gap-3 p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Download className="w-5 h-5" />
        {t('confirmation.downloadReceipt')}
              </button>
              
              <button
                onClick={handleShare}
                className="flex items-center gap-3 p-4 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                <Share2 className="w-5 h-5" />
        {t('confirmation.shareOrder')}
              </button>
              
              <button
                onClick={handleCreateAnother}
                className="flex items-center gap-3 p-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                <Package className="w-5 h-5" />
        {t('navigation.startCustomizing')}
              </button>

              <button
                onClick={handleGoToOrders}
                className="flex items-center gap-3 p-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
              >
                <Package className="w-5 h-5" />
        {t('orders.completedOrders')}
              </button>
            </div>

            {/* Primary Navigation */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
              <button
                onClick={handleBackToHome}
                className="w-full flex items-center justify-center gap-3 p-4 bg-gray-800 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 text-white rounded-lg transition-colors font-medium"
              >
                <Home className="w-5 h-5" />
                {t('confirmation.goHome')}
              </button>
              {orderSavedToCookies && (
                <p className="text-center text-sm text-green-600 dark:text-green-400 mt-2">
                  {t('confirmation.orderSaved')}
                </p>
              )}
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-blue-800 dark:text-blue-200 text-sm">
                📧 {t('confirmation.emailSent')}
              </p>
              <p className="text-blue-800 dark:text-blue-200 text-sm mt-1">
                🚚 {t('confirmation.estimatedDelivery')}
              </p>
              <p className="text-blue-800 dark:text-blue-200 text-sm mt-1">
                📱 {t('confirmation.orderTracking')}: <span className="font-mono font-bold">{orderNumber}</span>
              </p>
            </div>
            
            {/* Customer Support Section */}
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{t('support.needHelp')}</h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                {t('support.subtitle')}
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => navigateWithId('/support')}
                  className="text-sm bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200 px-3 py-1 rounded border border-gray-300 dark:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors"
                >
                  {t('footer.contactUs')}
                </button>
                <button
                  onClick={() => navigateWithId('/faq')}
                  className="text-sm bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200 px-3 py-1 rounded border border-gray-300 dark:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors"
                >
                  {t('footer.faq')}
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// Export with Suspense wrapper for static export compatibility
export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <OrderConfirmationContent />
    </Suspense>
  );
}
