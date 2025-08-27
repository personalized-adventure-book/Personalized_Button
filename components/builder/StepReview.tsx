"use client";

import { useState } from "react";
import { Check, Minus, Plus, Package, Star } from "lucide-react";
import { useButtonBuilder } from "@/hooks/useButtonBuilder";
import { useLanguage } from "@/contexts/LanguageContext";
import { wifiIntegration } from "@/types/button-builder-expanded";
import { ShapePreview } from "@/components/shapes/ShapePreview";

export function StepReview() {
  const { t } = useLanguage();
  const { config, updateConfig, totalPrice } = useButtonBuilder();

  const SummaryCard = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h4>
      {children}
    </div>
  );

  const getShapeClass = (shapeId: string) => {
    const shapeClasses: Record<string, string> = {
      round: "rounded-full",
      square: "rounded-lg",
      hexagon: "clip-path-hexagon",
      octagon: "clip-path-octagon",
      diamond: "clip-path-diamond",
      star: "clip-path-star",
      triangle: "clip-path-triangle",
      heart: "clip-path-heart",
      oval: "rounded-full",
      pentagon: "clip-path-pentagon",
      "rounded-square": "rounded-2xl",
      pill: "rounded-full",
      cloud: "clip-path-cloud",
      flower: "clip-path-flower",
      lightning: "clip-path-lightning",
    };
    return shapeClasses[shapeId] || "rounded-lg";
  };

  const ButtonPreview = () => {
    return (
      <div className="relative w-24 h-24">
        <div className="w-full h-full relative">
          <ShapePreview
            shapeId={config.shape.id}
            className="w-full h-full transition-all duration-300 shadow-lg"
            style={{ backgroundColor: config.color }}
          />

          {/* Content preview */}
          {config.label && (
            <div
              className="absolute text-white font-medium text-xs transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${config.labelPosition.x}%`,
                top: `${config.labelPosition.y}%`,
              }}
            >
              {config.label}
            </div>
          )}

          {config.icon && (
            <div
              className="absolute text-white transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${config.iconPosition.x}%`,
                top: `${config.iconPosition.y}%`,
              }}
            >
              <div className="w-3 h-3 bg-white/50 rounded"></div>
            </div>
          )}

          {config.uploadedImage && (
            <div
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${config.uploadedImage.position.x}%`,
                top: `${config.uploadedImage.position.y}%`,
                width: "12px",
                height: "12px",
              }}
            >
              <div className="w-full h-full bg-white/30 rounded"></div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const basePrice = 149;
  const finishPrice = config.finish.price;
  const lightModePrice = config.lightMode.price;
  const wifiPrice = config.wifiEnabled ? wifiIntegration.basePrice : 0;
  const subtotal =
    (basePrice + finishPrice + lightModePrice + wifiPrice) * config.quantity;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto bg-secondary-green/10 rounded-2xl flex items-center justify-center">
          <Check className="w-8 h-8 text-secondary-green" />
        </div>
  <h2 className="font-cal-sans font-bold text-gray-900 dark:text-white text-[clamp(1.4rem,1rem+1.4vw,2.1rem)] leading-tight">
          {t("customize.review.title")}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          {t("customize.review.subtitle")}
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Order Summary */}
        <div className="space-y-6">
          <div className="flex items-center space-x-4 mb-6">
            <ButtonPreview />
            <div>
              <h3 className="font-cal-sans text-2xl font-bold text-gray-900 dark:text-white">
                {t("review.yourDesign")}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {config.purpose.name} • {config.shape.name}
              </p>
            </div>
          </div>

          {/* Configuration Summary */}
          <div className="grid gap-4">
            <SummaryCard title={t("review.purpose")}>
              <p className="text-gray-700 dark:text-gray-300">
                {config.purpose.name}
                {config.customPurpose && `: ${config.customPurpose}`}
              </p>
            </SummaryCard>

            <SummaryCard title={t("review.shapeStyle")}>
              <div className="space-y-1">
                <p className="text-gray-700 dark:text-gray-300">
                  {config.shape.name} • {config.finish.name}
                </p>
                <div className="flex items-center space-x-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: config.color }}
                  ></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {config.customColors.includes(config.color)
                      ? t("review.customColor")
                      : t("review.standardColor")}
                  </span>
                </div>
              </div>
            </SummaryCard>

            <SummaryCard title={t("review.labelContent")}>
              <div className="space-y-1">
                <p className="text-gray-700 dark:text-gray-300">
                  {config.label || t("review.noTextLabel")}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {config.icon && `${t("review.icon")}: ${config.icon}`}
                  {config.uploadedImage && ` • ${t("review.customImage")}`}
                  {!config.icon &&
                    !config.uploadedImage &&
                    t("review.noIconImage")}
                </p>
              </div>
            </SummaryCard>

            <SummaryCard title={t("review.lightingSmart")}>
              <div className="space-y-1">
                <p className="text-gray-700 dark:text-gray-300">
                  {config.lightMode.name} • {config.brightness}%{" "}
                  {t("review.brightness")}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {config.wifiEnabled
                    ? `${t("review.wifiEnabled")} (+$${wifiIntegration.basePrice})`
                    : t("review.standaloneMode")}
                </p>
              </div>
            </SummaryCard>
          </div>
        </div>

        {/* Pricing & Order Details */}
        <div className="space-y-6">
          <h3 className="font-cal-sans text-2xl font-bold text-gray-900 dark:text-white">
            {t("review.orderSummary")}
          </h3>

          {/* Quantity Selection */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-900 dark:text-white">
                {t("review.quantity")}
              </span>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() =>
                    updateConfig({ quantity: Math.max(1, config.quantity - 1) })
                  }
                  className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-medium">
                  {config.quantity}
                </span>
                <button
                  onClick={() =>
                    updateConfig({
                      quantity: Math.min(10, config.quantity + 1),
                    })
                  }
                  className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 space-y-3">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
              {t("review.priceBreakdown")}
            </h4>

            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                {t("review.baseButton")} × {config.quantity}
              </span>
              <span className="text-gray-900 dark:text-white">
                ${basePrice * config.quantity}
              </span>
            </div>

            {finishPrice > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  {config.finish.name} {t("review.finish")} × {config.quantity}
                </span>
                <span className="text-gray-900 dark:text-white">
                  +${finishPrice * config.quantity}
                </span>
              </div>
            )}

            {lightModePrice > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  {config.lightMode.name} {t("review.mode")} × {config.quantity}
                </span>
                <span className="text-gray-900 dark:text-white">
                  +${lightModePrice * config.quantity}
                </span>
              </div>
            )}

            {config.wifiEnabled && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  {t("review.wifiIntegration")} × {config.quantity}
                </span>
                <span className="text-gray-900 dark:text-white">
                  +${wifiPrice * config.quantity}
                </span>
              </div>
            )}

            <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
              <div className="flex justify-between font-bold text-lg">
                <span className="text-gray-900 dark:text-white">
                  {t("review.total")}
                </span>
                <span className="text-primary">${totalPrice}</span>
              </div>
            </div>
          </div>

          {/* Shipping & Delivery Info */}
          <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Package className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                  {t("review.shipping")}
                </h4>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  • {t("review.customManufacturing")}
                  <br />• {t("review.freeShipping")}
                  <br />• {t("review.trackingInfo")}
                  <br />• {t("review.moneyBack")}
                </p>
              </div>
            </div>
          </div>

          {/* Customer Reviews */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="w-4 h-4 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                4.9/5
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                (2,847 {t("review.reviews")})
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              "{t("review.amazingQuality")}"
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              - Sarah K., {t("review.verifiedBuyer")}
            </p>
          </div>

          {/* Final Notes */}
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t("review.noPaymentRequired")}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              {t("review.termsAgreement")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
