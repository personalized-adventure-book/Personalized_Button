"use client";

import { useState } from "react";
import { useButtonBuilderExpanded } from "@/hooks/useButtonBuilderExpanded";
import { ProgressBar } from "@/components/builder/ProgressBar";
import {
  StepPurposeExpanded,
  StepReviewExpanded,
} from "@/components/builder/ExpandedPlaceholders";
import { StepShapeStyleExpanded } from "@/components/builder/StepShapeStyleExpanded";
import { StepLabelIconExpanded } from "@/components/builder/StepLabelIconExpanded";
import { StepBehaviorExpanded } from "@/components/builder/StepBehaviorExpanded";
import { OrderConfirmationModal } from "@/components/builder/OrderConfirmationModal";
import { ArrowLeft, ArrowRight, DollarSign, Save, X } from "lucide-react";

export default function CustomizeNewPage() {
  const {
    currentStep,
    isValid,
    totalPrice,
    isDraft,
    orderId,
    nextStep,
    prevStep,
    saveAsDraft,
    completeOrder,
  } = useButtonBuilderExpanded();

  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);
  const [showDraftSaved, setShowDraftSaved] = useState(false);

  const steps = [
    { number: 1, title: "Purpose", component: StepPurposeExpanded },
    { number: 2, title: "Style", component: StepShapeStyleExpanded },
    { number: 3, title: "Label", component: StepLabelIconExpanded },
    { number: 4, title: "Behavior", component: StepBehaviorExpanded },
    { number: 5, title: "Review", component: StepReviewExpanded },
  ];

  const currentStepData = steps[currentStep - 1];
  const CurrentStepComponent = currentStepData.component;

  const handleCompleteOrder = () => {
    const orderNumber = completeOrder();
    setShowOrderConfirmation(true);
  };

  const handleSaveDraft = () => {
    saveAsDraft();
    setShowDraftSaved(true);
    setTimeout(() => setShowDraftSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Draft Indicator and Price */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <h1 className="font-cal-sans text-3xl font-bold text-gray-900 dark:text-white">
              Design Your Button
            </h1>
            {isDraft && (
              <div className="flex items-center space-x-2 bg-yellow-100 dark:bg-yellow-900/20 px-3 py-1 rounded-full">
                <Save className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                <span className="text-sm text-yellow-600 dark:text-yellow-400">
                  Auto-saved
                </span>
              </div>
            )}
          </div>

          <div className="inline-flex items-center space-x-2 bg-primary/10 px-4 py-2 rounded-full">
            <DollarSign className="w-5 h-5 text-primary" />
            <span className="font-bold text-xl text-primary">
              ${totalPrice}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <ProgressBar currentStep={currentStep} totalSteps={5} />
        </div>

        {/* Step Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft p-8">
          <CurrentStepComponent />
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`btn-ghost inline-flex items-center ${
                currentStep === 1 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <ArrowLeft className="mr-2 w-4 h-4" />
              Back
            </button>

            <button
              onClick={handleSaveDraft}
              className="btn-secondary inline-flex items-center"
            >
              <Save className="mr-2 w-4 h-4" />
              Save Draft
            </button>
          </div>

          {currentStep < 5 ? (
            <button
              onClick={nextStep}
              disabled={!isValid}
              className={`btn-primary inline-flex items-center ${
                !isValid ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Continue
              <ArrowRight className="ml-2 w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleCompleteOrder}
              className="btn-primary inline-flex items-center"
            >
              <DollarSign className="mr-2 w-4 h-4" />
              Confirm Order - ${totalPrice}
            </button>
          )}
        </div>

        {/* Draft Saved Notification */}
        {showDraftSaved && (
          <div className="fixed top-4 right-4 bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 shadow-lg z-50">
            <div className="flex items-center space-x-2">
              <Save className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span className="text-green-800 dark:text-green-200">
                Draft saved successfully!
              </span>
              <button
                onClick={() => setShowDraftSaved(false)}
                className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Order Confirmation Modal */}
      {showOrderConfirmation && orderId && (
        <OrderConfirmationModal
          orderId={orderId}
          onClose={() => setShowOrderConfirmation(false)}
          onCreateNew={() => {
            setShowOrderConfirmation(false);
            // Reset to first step if possible through the hook
            window.location.reload(); // Simple reset approach
          }}
        />
      )}
    </div>
  );
}
