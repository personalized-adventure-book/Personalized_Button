"use client";
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface PricingData {
  total: number;
  additions: number;
  base?: number;
  breakdown?: { field: string; value: string; price: number }[];
}

interface PricingProgressProps {
  currentStep: number;
  totalSteps: number;
  pricing: PricingData;
  compact?: boolean;
  bare?: boolean; // when true, render without card styling so it blends with surrounding section
}

// Simple Euro formatter (can be extended later for multi‑currency)
const format = (n: number) => `€${n.toFixed(2).replace(/\.00$/, "")}`;

export const PricingProgress: React.FC<PricingProgressProps> = ({
  currentStep,
  totalSteps,
  pricing,
  compact = false,
  bare = false,
}) => {
  const { t } = useLanguage();
  const pct = totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 0;
  const [showDetails, setShowDetails] = useState(false);
  const additions = pricing.additions;
  const base = pricing.base ?? (pricing.total - additions);

  const containerClasses = bare
    ? `p-0 bg-transparent border-0 shadow-none rounded-none ${compact ? '' : ''}`
    : `rounded-xl shadow-lg border border-gray-200/60 dark:border-gray-700/60 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm p-5 ${compact ? 'py-4 px-4' : ''}`;

  return (
    <div className={`${containerClasses} transition-colors`}>
      {/* Top row: label left, price right */}
      <div className="flex items-start justify-between gap-4">
        <div className="font-medium tracking-wide text-gray-500 dark:text-gray-400 uppercase" style={{fontSize:'clamp(0.65rem,0.5rem + 0.6vw,0.9rem)'}}>{t("progress.label")}</div>
        <div className="text-right">
          <div className="font-bold text-emerald-600 dark:text-emerald-400 leading-none" style={{fontSize:'clamp(1.15rem,0.9rem + 1.6vw,2.3rem)'}}>{format(pricing.total)}</div>
        </div>
      </div>
      {/* Second row: step info left, percentage right (under price) */}
      <div className="flex items-center justify-between mt-1 mb-4">
  <div className="font-semibold text-gray-900 dark:text-white" style={{fontSize:'clamp(0.95rem,0.75rem + 1.0vw,1.65rem)'}}>
          {t("progress.step")} {Math.min(currentStep + 1, totalSteps)} <span className="text-gray-400 dark:text-gray-500">/ {totalSteps}</span>
        </div>
  <div className="font-medium text-blue-600 dark:text-blue-400" style={{fontSize:'clamp(0.6rem,0.45rem + 0.45vw,0.9rem)'}}>{Math.round(pct)}%</div>
      </div>
      <div className={`relative h-3 w-full rounded-full overflow-hidden ${bare ? 'bg-gray-200/70 dark:bg-gray-700/70' : 'bg-gray-200 dark:bg-gray-700/60'}`} aria-label="Progress" role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100}>
  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-blue-500 to-indigo-600 dark:from-indigo-400 dark:via-blue-400 dark:to-indigo-500" style={{ width: pct + '%'}} />
        <div className="absolute inset-0 bg-white/10 dark:bg-black/10" />
      </div>
  <div className="mt-3 flex items-center justify-between text-gray-600 dark:text-gray-400 flex-wrap gap-2" style={{fontSize:'clamp(0.62rem,0.5rem + 0.4vw,0.85rem)'}}>
        <div>
          {additions > 0 ? (
            <span>
              {t("progress.base")} {format(base)} + {t("progress.addons")} {format(additions)} = <span className="font-semibold text-emerald-600 dark:text-emerald-400">{format(pricing.total)}</span>
            </span>
          ) : (
            <span>{t("progress.basePrice")} {format(base)}</span>
          )}
        </div>
        {pricing.breakdown && pricing.breakdown.length > 0 && (
          <button
            type="button"
            onClick={() => setShowDetails(v => !v)}
            className="text-blue-600 dark:text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
          >
            {showDetails ? t("progress.hideDetails") : t("progress.details")}
          </button>
        )}
      </div>
      {showDetails && pricing.breakdown && pricing.breakdown.length > 0 && (
        <ul className={`mt-3 divide-y divide-gray-200 dark:divide-gray-700 overflow-hidden ${bare ? 'rounded-md bg-transparent border border-gray-200 dark:border-gray-700/60' : 'rounded-lg border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-900/60'}`}>          
          {pricing.breakdown.map(item => (
            <li key={item.field + item.value} className="px-3 py-2 text-xs flex justify-between gap-4">
              <span className="text-gray-600 dark:text-gray-400 truncate">
                {item.field}: <span className="font-medium text-gray-800 dark:text-gray-200">{item.value}</span>
              </span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">+{format(item.price)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
