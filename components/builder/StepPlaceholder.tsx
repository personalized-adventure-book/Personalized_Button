"use client";

import { Construction } from "lucide-react";

interface StepPlaceholderProps {
  stepName: string;
  description: string;
}

export function StepPlaceholder({
  stepName,
  description,
}: StepPlaceholderProps) {
  return (
    <div className="text-center space-y-6 py-12">
      <div className="w-16 h-16 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center">
        <Construction className="w-8 h-8 text-primary" />
      </div>
      <div>
        <h3 className="font-cal-sans text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {stepName}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          {description}
        </p>
      </div>
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 max-w-md mx-auto">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          This enhanced step is currently in development and will include
          advanced customization options for a truly personalized experience.
        </p>
      </div>
    </div>
  );
}

// Individual step placeholders
export function StepVisualDesign() {
  return (
    <StepPlaceholder
      stepName="Visual Design"
      description="Create stunning visual effects with gradients, patterns, and dynamic color schemes that reflect your personality."
    />
  );
}

export function StepTextGraphics() {
  return (
    <StepPlaceholder
      stepName="Text & Graphics"
      description="Add custom text with premium fonts, upload graphics, and position elements exactly where you want them."
    />
  );
}

export function StepLightingSystem() {
  return (
    <StepPlaceholder
      stepName="Lighting System"
      description="Configure advanced lighting patterns, color transitions, and trigger conditions for the perfect ambiance."
    />
  );
}

export function StepSmartFeatures() {
  return (
    <StepPlaceholder
      stepName="Smart Features"
      description="Connect to your smart home, set up voice commands, and enable advanced app integrations."
    />
  );
}

export function StepAdvancedFeatures() {
  return (
    <StepPlaceholder
      stepName="Advanced Features"
      description="Create multiple modes, schedule behaviors, and set up conditional actions for ultimate automation."
    />
  );
}

export function StepReviewEnhanced() {
  return (
    <StepPlaceholder
      stepName="Review & Order"
      description="Review your complete customization, add accessories, and complete your order with detailed specifications."
    />
  );
}
