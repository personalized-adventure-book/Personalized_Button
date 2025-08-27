"use client";

import { useState } from "react";
import {
  Check,
  X,
  Package,
  Clock,
  Truck,
  Star,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

interface OrderConfirmationModalProps {
  orderId: string;
  onClose: () => void;
  onCreateNew: () => void;
}

export function OrderConfirmationModal({
  orderId,
  onClose,
  onCreateNew,
}: OrderConfirmationModalProps) {
  const [showDetails, setShowDetails] = useState(false);
  const { t } = useLanguage();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <Check className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h2 className="font-cal-sans text-xl font-bold text-gray-900 dark:text-white">
                  {t("confirmation.title")}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t("confirmation.orderNumber")}
                  {orderId}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Success Message */}
          <div className="text-center space-y-3">
            <p className="text-gray-600 dark:text-gray-300">
              {t("confirmation.thankYou")}
            </p>
            <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-lg p-3">
              <p className="text-sm text-green-800 dark:text-green-200">
                {t("confirmation.emailSent")}
              </p>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {t("confirmation.whatNext")}
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white text-sm">
                    {t("confirmation.orderConfirmed")}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {t("confirmation.justNow")}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <Package className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white text-sm">
                    {t("confirmation.productionStarted")}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {t("confirmation.within24Hours")}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                  <Clock className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white text-sm">
                    {t("confirmation.qualityCheck")}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {t("confirmation.twoThreeWeeks")}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                  <Truck className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white text-sm">
                    {t("confirmation.shipped")}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {t("confirmation.threeFiveDays")}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Details Toggle */}
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full text-left p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-900 dark:text-white">
                {t("confirmation.orderDetails")}
              </span>
              <ArrowRight
                className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                  showDetails ? "rotate-90" : ""
                }`}
              />
            </div>
          </button>

          {showDetails && (
            <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    {t("confirmation.orderNumber2")}
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {orderId}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    {t("confirmation.estimatedDelivery")}
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {new Date(
                      Date.now() + 21 * 24 * 60 * 60 * 1000,
                    ).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    {t("confirmation.status")}
                  </span>
                  <span className="font-medium text-green-600 dark:text-green-400">
                    {t("confirmation.confirmed")}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col space-y-3">
            <Link
              href="/"
              className="btn-primary text-center"
              onClick={onClose}
            >
              {t("confirmation.goHome")}
            </Link>
            <button
              onClick={() => {
                // Force complete reset for new order
                localStorage.removeItem("mymood-config");
                sessionStorage.setItem("mymood-force-reset", "true");
                onCreateNew();
                onClose();
                // Navigate to fresh customize page
                setTimeout(() => (window.location.href = "/customize"), 100);
              }}
              className="btn-secondary text-center"
            >
              {t("confirmation.startNew")}
            </button>
            <Link
              href="/orders"
              className="btn-ghost text-center"
              onClick={onClose}
            >
              {t("confirmation.seeOrders")}
            </Link>
          </div>

          {/* Footer */}
          <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {t("confirmation.questionsSupport")}
            </p>
            <div className="flex items-center justify-center space-x-1 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className="w-3 h-3 text-yellow-400 fill-current"
                />
              ))}
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                {t("confirmation.ratedCustomers")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
