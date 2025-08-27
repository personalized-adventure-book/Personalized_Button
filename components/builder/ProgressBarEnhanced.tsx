"use client";

import { Check } from "lucide-react";

interface ProgressBarEnhancedProps {
  currentStep: number;
  totalSteps: number;
  steps: Array<{ number: number; title: string; icon: string }>;
}

export function ProgressBarEnhanced({
  currentStep,
  totalSteps,
  steps,
}: ProgressBarEnhancedProps) {
  return (
    <div className="w-full">
      {/* Desktop Progress Bar */}
      <div className="hidden lg:block">
        <div className="flex items-center justify-between mb-6">
          {steps.map((step, index) => {
            const stepNumber = step.number;
            const isCompleted = stepNumber < currentStep;
            const isCurrent = stepNumber === currentStep;
            const isUpcoming = stepNumber > currentStep;

            return (
              <div key={stepNumber} className="flex items-center flex-1">
                {/* Step Circle */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 mb-2 ${
                      isCompleted
                        ? "bg-primary text-white"
                        : isCurrent
                          ? "bg-primary text-white ring-4 ring-primary/20 scale-110"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      <span className="text-lg">{step.icon}</span>
                    )}
                  </div>

                  <div className="text-center">
                    <div
                      className={`text-sm font-medium ${
                        isCurrent
                          ? "text-primary"
                          : "text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      {step.title}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-500">
                      Step {stepNumber}
                    </div>
                  </div>
                </div>

                {/* Connection Line */}
                {stepNumber < totalSteps && (
                  <div
                    className={`flex-1 h-1 mx-4 transition-all duration-300 ${
                      stepNumber < currentStep
                        ? "bg-primary"
                        : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Progress Bar */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm bg-primary text-white">
              <span className="text-lg">{steps[currentStep - 1].icon}</span>
            </div>
            <div>
              <div className="font-medium text-gray-900 dark:text-white">
                {steps[currentStep - 1].title}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Step {currentStep} of {totalSteps}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Progress Line */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
