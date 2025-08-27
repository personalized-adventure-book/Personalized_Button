"use client";

import { useButtonBuilderEnhanced } from "@/hooks/useButtonBuilderEnhanced";
import { ProgressBarEnhanced } from "@/components/builder/ProgressBarEnhanced";
import { StepPurposeEnhanced } from "@/components/builder/StepPurposeEnhanced";
import { StepPhysicalDesign } from "@/components/builder/StepPhysicalDesign";
import { StepVisualDesign } from "@/components/builder/StepVisualDesign";
import { StepTextGraphics } from "@/components/builder/StepTextGraphics";
import { StepLightingSystem } from "@/components/builder/StepLightingSystem";
import { StepSmartFeatures } from "@/components/builder/StepSmartFeatures";
import { StepAdvancedFeatures } from "@/components/builder/StepAdvancedFeatures";
import { StepReview } from "@/components/builder/StepReview";
import { ArrowLeft, ArrowRight, DollarSign } from "lucide-react";

export default function CustomizeEnhancedPage() {
  const { currentStep, isValid, totalPrice, nextStep, prevStep } =
    useButtonBuilderEnhanced();

  const steps = [
    {
      number: 1,
      title: "Purpose & Use Case",
      component: StepPurposeEnhanced,
      icon: "🎯",
    },
    {
      number: 2,
      title: "Physical Design",
      component: StepPhysicalDesign,
      icon: "🔨",
    },
    {
      number: 3,
      title: "Visual Design",
      component: StepVisualDesign,
      icon: "🎨",
    },
    {
      number: 4,
      title: "Text & Graphics",
      component: StepTextGraphics,
      icon: "✏️",
    },
    {
      number: 5,
      title: "Lighting System",
      component: StepLightingSystem,
      icon: "💡",
    },
    {
      number: 6,
      title: "Smart Features",
      component: StepSmartFeatures,
      icon: "🔗",
    },
    {
      number: 7,
      title: "Advanced Features",
      component: StepAdvancedFeatures,
      icon: "⚙️",
    },
    {
      number: 8,
      title: "Review & Order",
      component: StepReview,
      icon: "✅",
    },
  ];

  const currentStepData = steps[currentStep - 1];
  const CurrentStepComponent = currentStepData.component;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Price */}
        <div className="mb-8 text-center">
          <h1 className="font-cal-sans text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Design Your Perfect Button
          </h1>
          <div className="inline-flex items-center space-x-2 bg-primary/10 px-4 py-2 rounded-full">
            <DollarSign className="w-5 h-5 text-primary" />
            <span className="font-semibold text-lg text-primary">
              ${totalPrice}
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Total Price
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <ProgressBarEnhanced
            currentStep={currentStep}
            totalSteps={8}
            steps={steps}
          />
        </div>

        {/* Step Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft p-8">
          <div className="text-center mb-8">
            <div className="text-4xl mb-2">{currentStepData.icon}</div>
            <h2 className="font-cal-sans text-2xl font-bold text-gray-900 dark:text-white">
              Step {currentStep}: {currentStepData.title}
            </h2>
          </div>

          <CurrentStepComponent />
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
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

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Step {currentStep} of 8
            </span>

            {currentStep < 8 ? (
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
              <button className="btn-primary inline-flex items-center">
                <DollarSign className="mr-2 w-4 h-4" />
                Complete Order - ${totalPrice}
              </button>
            )}
          </div>
        </div>

        {/* Step Descriptions */}
        <div className="mt-12 bg-gray-100 dark:bg-gray-800 rounded-lg p-6">
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-4">
            What's Next?
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            {steps
              .slice(currentStep)
              .slice(0, 4)
              .map((step, index) => (
                <div key={step.number} className="flex items-start space-x-2">
                  <span className="text-lg">{step.icon}</span>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {step.title}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400 text-xs">
                      Step {step.number}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
