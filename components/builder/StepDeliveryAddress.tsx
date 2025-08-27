"use client";

import { useButtonBuilder } from "@/hooks/useButtonBuilder";
import { useLanguage } from "@/contexts/LanguageContext";
import { MapPin, Home, Globe, FileText } from "lucide-react";

export function StepDeliveryAddress() {
  const { t } = useLanguage();
  const { config, updateConfig, isValid } = useButtonBuilder();

  // Ensure customerInfo and deliveryAddress exist with default values
  const customerInfo = config?.customerInfo || {
    fullName: "",
    email: "",
    phone: "",
    deliveryAddress: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      instructions: "",
    },
  };

  const deliveryAddress = customerInfo.deliveryAddress || {
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    instructions: "",
  };

  const updateDeliveryAddress = (field: string, value: string) => {
    updateConfig({
      customerInfo: {
        ...customerInfo,
        deliveryAddress: {
          ...deliveryAddress,
          [field]: value,
        },
      },
    });
  };

  // Helper to check if required fields are filled
  const getFieldCompletionCount = () => {
    const requiredFields = [
      deliveryAddress.street?.trim(),
      deliveryAddress.city?.trim(),
      deliveryAddress.state?.trim(),
      deliveryAddress.zipCode?.trim(),
      deliveryAddress.country?.trim(),
    ];
    const completed = requiredFields.filter(Boolean).length;
    return { completed, total: requiredFields.length };
  };

  const { completed, total } = getFieldCompletionCount();

  const countries = [
    "United States",
    "Canada",
    "United Kingdom",
    "Germany",
    "France",
    "Italy",
    "Spain",
    "Netherlands",
    "Belgium",
    "Switzerland",
    "Austria",
    "Australia",
    "New Zealand",
    "Japan",
    "South Korea",
    "Singapore",
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center">
          <MapPin className="w-8 h-8 text-primary" />
        </div>
  <h2 className="font-cal-sans font-bold text-gray-900 dark:text-white text-[clamp(1.4rem,1rem+1.4vw,2.1rem)] leading-tight">
          {t("customize.deliveryAddress.title")}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          {t("customize.deliveryAddress.subtitle")}
        </p>
      </div>

      {/* Delivery Address Form */}
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Form Requirements */}
        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium">Required fields:</span> Street
            address, city, state/province, ZIP code, and country are required to
            continue.
          </p>
        </div>
        {/* Street Address */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t("customize.deliveryAddress.street")} *
          </label>
          <div className="relative">
            <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={deliveryAddress.street || ""}
              onChange={(e) => updateDeliveryAddress("street", e.target.value)}
              placeholder={t("customize.deliveryAddress.streetPlaceholder")}
              className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                deliveryAddress.street?.trim()
                  ? "border-green-300 dark:border-green-600"
                  : "border-gray-300 dark:border-gray-600"
              }`}
              required
            />
            {deliveryAddress.street?.trim() && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* City and State/Province */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t("customize.deliveryAddress.city")} *
            </label>
            <div className="relative">
              <input
                type="text"
                value={deliveryAddress.city || ""}
                onChange={(e) => updateDeliveryAddress("city", e.target.value)}
                placeholder={t("customize.deliveryAddress.cityPlaceholder")}
                className={`w-full px-4 py-3 pr-10 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                  deliveryAddress.city?.trim()
                    ? "border-green-300 dark:border-green-600"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                required
              />
              {deliveryAddress.city?.trim() && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t("customize.deliveryAddress.state")} *
            </label>
            <div className="relative">
              <input
                type="text"
                value={deliveryAddress.state || ""}
                onChange={(e) => updateDeliveryAddress("state", e.target.value)}
                placeholder={t("customize.deliveryAddress.statePlaceholder")}
                className={`w-full px-4 py-3 pr-10 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                  deliveryAddress.state?.trim()
                    ? "border-green-300 dark:border-green-600"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                required
              />
              {deliveryAddress.state?.trim() && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ZIP Code and Country */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t("customize.deliveryAddress.zipCode")} *
            </label>
            <div className="relative">
              <input
                type="text"
                value={deliveryAddress.zipCode || ""}
                onChange={(e) =>
                  updateDeliveryAddress("zipCode", e.target.value)
                }
                placeholder={t("customize.deliveryAddress.zipCodePlaceholder")}
                className={`w-full px-4 py-3 pr-10 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                  deliveryAddress.zipCode?.trim()
                    ? "border-green-300 dark:border-green-600"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                required
              />
              {deliveryAddress.zipCode?.trim() && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t("customize.deliveryAddress.country")} *
            </label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={deliveryAddress.country || ""}
                onChange={(e) =>
                  updateDeliveryAddress("country", e.target.value)
                }
                className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                  deliveryAddress.country?.trim()
                    ? "border-green-300 dark:border-green-600"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                required
              >
                <option value="">
                  {t("customize.deliveryAddress.selectCountry")}
                </option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
              {deliveryAddress.country?.trim() && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Delivery Instructions (Optional) */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t("customize.deliveryAddress.instructions")} {t("common.optional")}
          </label>
          <div className="relative">
            <FileText className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <textarea
              value={deliveryAddress.instructions || ""}
              onChange={(e) =>
                updateDeliveryAddress("instructions", e.target.value)
              }
              placeholder={t(
                "customize.deliveryAddress.instructionsPlaceholder",
              )}
              rows={3}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
            />
          </div>
        </div>

        {/* Shipping Info */}
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <MapPin className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
            <div className="space-y-2">
              <h4 className="font-medium text-green-900 dark:text-green-100">
                {t("customize.deliveryAddress.shippingTitle")}
              </h4>
              <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
                <li>• {t("customize.deliveryAddress.freeShipping")}</li>
                <li>• {t("customize.deliveryAddress.deliveryTime")}</li>
                <li>• {t("customize.deliveryAddress.trackingIncluded")}</li>
                <li>• {t("customize.deliveryAddress.insuranceIncluded")}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Progress Message */}
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t("customize.deliveryAddress.progress")}
          </p>
        </div>
      </div>
    </div>
  );
}
