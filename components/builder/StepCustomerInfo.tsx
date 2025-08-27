"use client";

import { useButtonBuilder } from "@/hooks/useButtonBuilder";
import { useLanguage } from "@/contexts/LanguageContext";
import { User, Mail, Phone } from "lucide-react";

export function StepCustomerInfo() {
  const { t } = useLanguage();
  const { config, updateConfig } = useButtonBuilder();
  const { fullName, email, phone } = config.customerInfo;

  const handleChange = (field: 'fullName' | 'email' | 'phone', value: string) => {
    updateConfig({
      customerInfo: {
        ...config.customerInfo,
        [field]: value,
      },
    });
  };

  const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+(?:\.[^\s@]+)*$/.test(email);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center">
          <User className="w-8 h-8 text-primary" />
        </div>
  <h2 className="font-cal-sans font-bold text-gray-900 dark:text-white text-[clamp(1.4rem,1rem+1.4vw,2.1rem)] leading-tight">
          {t("customize.customerInfo.title")}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          {t("customize.customerInfo.subtitle")}
        </p>
      </div>

      {/* Customer Information Form */}
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Full Name */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t("customize.customerInfo.fullName")} *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              placeholder={t("customize.customerInfo.fullNamePlaceholder")}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                fullName.trim() ? "border-green-300 dark:border-green-600" : "border-gray-300 dark:border-gray-600"
              }`}
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t("customize.customerInfo.email")} *
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="email"
              value={email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder={t("customize.customerInfo.emailPlaceholder")}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                emailIsValid ? "border-green-300 dark:border-green-600" : "border-gray-300 dark:border-gray-600"
              }`}
            />
          </div>
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t("customize.customerInfo.phone")}
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="tel"
              value={phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder={t("customize.customerInfo.phonePlaceholder")}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
        </div>
      </div>
    </div>
  );
}