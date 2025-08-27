"use client";

import { Construction } from "lucide-react";

// Placeholder for Purpose step - using existing purpose step for now
export { StepPurpose as StepPurposeExpanded } from "./StepPurpose";

// Placeholder for Review step
export function StepReviewExpanded() {
  return (
    <div className="text-center space-y-6 py-12">
      <div className="w-16 h-16 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center">
        <Construction className="w-8 h-8 text-primary" />
      </div>
      <div>
        <h3 className="font-cal-sans text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Review & Order
        </h3>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Review your complete customization and finalize your order with
          detailed specifications.
        </p>
      </div>
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 max-w-md mx-auto">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          This comprehensive review step will show all your customizations,
          pricing breakdown, and order options without requiring payment
          information.
        </p>
      </div>
    </div>
  );
}
