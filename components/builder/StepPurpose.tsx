"use client";

import { useState } from "react";
import { Target } from "lucide-react";
import { useButtonBuilder } from "@/hooks/useButtonBuilder";
import { useLanguage } from "@/contexts/LanguageContext";
import { purposes } from "@/types/button-builder";

export function StepPurpose() {
  const { t } = useLanguage();
  const { config, updateConfig } = useButtonBuilder();
  const [showCustom, setShowCustom] = useState(config.purpose.id === "custom");

  const handlePurposeSelect = (purpose: (typeof purposes)[0]) => {
    updateConfig({ purpose });
    setShowCustom(purpose.id === "custom");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center">
          <Target className="w-8 h-8 text-primary" />
        </div>
  <h2 className="font-cal-sans font-bold text-gray-900 dark:text-white text-[clamp(1.4rem,1rem+1.4vw,2.1rem)] leading-tight">
          {t("customize.purpose.title")}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          {t("customize.purpose.subtitle")}
        </p>
      </div>

      {/* Purpose Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {purposes.slice(0, 4).map((purpose) => (
          <button
            key={purpose.id}
            onClick={() => handlePurposeSelect(purpose)}
            className={`card card-dark p-6 text-center space-y-4 transition-all duration-200 ${
              config.purpose.id === purpose.id
                ? "ring-2 ring-primary bg-primary/5 dark:bg-primary/10"
                : "hover:shadow-lg hover:-translate-y-1"
            }`}
          >
            <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center">
              <div className="w-8 h-8 bg-primary/20 rounded-lg"></div>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {purpose.name}
            </h3>
          </button>
        ))}
      </div>

      {/* Custom Purpose Option */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
        <button
          onClick={() => handlePurposeSelect(purposes[4])}
          className={`w-full card card-dark p-6 text-center space-y-4 transition-all duration-200 ${
            config.purpose.id === "custom"
              ? "ring-2 ring-primary bg-primary/5 dark:bg-primary/10"
              : "hover:shadow-lg hover:-translate-y-1"
          }`}
        >
          <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center">
            <div className="w-8 h-8 bg-secondary-purple/20 rounded-lg"></div>
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Custom Purpose
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Define your own unique use case
          </p>
        </button>

        {/* Custom Purpose Textarea */}
        {showCustom && (
          <div className="mt-6 space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Describe your custom purpose
            </label>
            <textarea
              value={config.customPurpose || ""}
              onChange={(e) => updateConfig({ customPurpose: e.target.value })}
              placeholder="e.g., Meditation sessions, workout motivation, study breaks..."
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              rows={3}
            />
          </div>
        )}
      </div>
    </div>
  );
}
