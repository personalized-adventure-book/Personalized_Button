"use client";

import { Check } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const { t } = useLanguage();

  const stepLabels = [
    t("customize.steps.customerInfo"),
    t("customize.steps.purpose"),
    t("customize.steps.style"),
    t("customize.steps.label"),
    t("customize.steps.behavior"),
    t("customize.steps.delivery"),
    t("customize.steps.review"),
  ];
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        {Array.from({ length: totalSteps }, (_, i) => {
          const stepNumber = i + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const isUpcoming = stepNumber > currentStep;

          return (
            <div key={stepNumber} className="flex items-center">
              {/* Step Circle */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 ${
                  isCompleted
                    ? "bg-primary text-white"
                    : isCurrent
                      ? "bg-primary text-white ring-4 ring-primary/20"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                }`}
              >
                {isCompleted ? <Check className="w-5 h-5" /> : stepNumber}
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

      {/* Step Labels */}
      <div className="flex justify-between text-sm">
        {stepLabels.slice(0, totalSteps).map((label, index) => (
          <span
            key={index}
            className="text-gray-600 dark:text-gray-400 text-center flex-1"
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
