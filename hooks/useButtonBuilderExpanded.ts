"use client";

import { useState, useEffect } from "react";
import {
  sendOrderToGoogleSheets,
  formatOrderDataForLogging,
} from "@/utils/googleSheetsService";
import {
  ButtonConfig,
  purposes,
  shapes,
  finishes,
  lightModes,
  defaultColors,
  wifiIntegration,
} from "@/types/button-builder-expanded";

const initialConfig: ButtonConfig = {
  purpose: purposes[0],
  shape: shapes[0],
  color: defaultColors[0].value,
  customColors: [],
  finish: finishes[0],
  label: "",
  icon: null,
  iconAlignment: "left",
  iconPosition: { x: 50, y: 30 },
  iconSize: 24, // Add missing property
  labelPosition: { x: 50, y: 70 },
  labelSize: 16, // Add missing property
  uploadedImage: null,
  customerInfo: { // Add missing property
    fullName: "",
    email: "",
    phone: "",
    deliveryAddress: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: ""
    }
  },
  lightMode: lightModes[0],
  brightness: 75,
  wifiEnabled: false,
  wifiFeatures: {
    remoteControl: true,
    scheduling: true,
    smartHomeIntegration: true,
    voiceControl: true,
    geofencing: true,
    notifications: true,
    analyticsReporting: true,
    firmwareUpdates: true,
    cloudSync: true,
    multiDeviceControl: true,
  },
  schedule: [],
  quantity: 1,
};

export function useButtonBuilderExpanded() {
  const [currentStep, setCurrentStep] = useState(1);
  const [config, setConfig] = useState<ButtonConfig>(initialConfig);
  const [isValid, setIsValid] = useState(false);
  const [totalPrice, setTotalPrice] = useState(149);
  const [isDraft, setIsDraft] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("mymood-button-expanded-draft");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setConfig(parsed.config);
        setCurrentStep(parsed.step);
        setIsDraft(true);
      } catch (error) {
        console.error("Failed to load draft:", error);
      }
    }
  }, []);

  // Save to localStorage on changes (auto-save draft)
  useEffect(() => {
    const draft = { config, step: currentStep, timestamp: Date.now() };
    localStorage.setItem("mymood-button-expanded-draft", JSON.stringify(draft));
    setIsDraft(true);
  }, [config, currentStep]);

  // Calculate total price including WiFi
  useEffect(() => {
    let price = 149; // Base price

    // Add finish price
    price += config.finish.price;

    // Add light mode price
    price += config.lightMode.price;

    // Add WiFi integration price
    if (config.wifiEnabled) {
      price += wifiIntegration.basePrice;
    }

    // Multiply by quantity
    price *= config.quantity;

    setTotalPrice(price);
  }, [config]);

  // Enhanced validation logic
  useEffect(() => {
    switch (currentStep) {
      case 1:
        setIsValid(!!config.purpose);
        break;
      case 2:
        setIsValid(!!config.shape && !!config.color && !!config.finish);
        break;
      case 3:
        // Valid if user has either a label OR an icon OR uploaded image
        const hasValidLabel =
          config.label.length > 0 && config.label.length <= 12;
        const hasIcon =
          config.icon !== null &&
          config.icon !== undefined &&
          config.icon !== "";
        const hasUploadedImage = !!config.uploadedImage;
        setIsValid(hasValidLabel || hasIcon || hasUploadedImage);
        break;
      case 4:
        setIsValid(config.brightness >= 0 && config.brightness <= 100);
        break;
      case 5:
        setIsValid(true); // Always valid on review step
        break;
      default:
        setIsValid(false);
    }
  }, [config, currentStep]);

  const updateConfig = (updates: Partial<ButtonConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  const addCustomColor = (color: string) => {
    if (!config.customColors.includes(color)) {
      updateConfig({
        customColors: [...config.customColors, color],
        color: color,
      });
    }
  };

  const uploadImage = (file: File, keepBackground: boolean = true) => {
    const uploadedImage = {
      id: Date.now().toString(),
      file: file,
      keepBackground: keepBackground,
      position: { x: 50, y: 50 },
      size: { width: 40, height: 40 },
    };
    updateConfig({ uploadedImage });
  };

  const updateElementPosition = (
    element: "icon" | "label" | "image",
    position: { x: number; y: number },
  ) => {
    if (element === "icon") {
      updateConfig({ iconPosition: position });
    } else if (element === "label") {
      updateConfig({ labelPosition: position });
    } else if (element === "image" && config.uploadedImage) {
      updateConfig({
        uploadedImage: {
          ...config.uploadedImage,
          position: position,
        },
      });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const nextStep = () => {
    if (isValid && currentStep < 5) {
      setCurrentStep((prev) => prev + 1);
      setTimeout(scrollToTop, 100);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      setTimeout(scrollToTop, 100);
    }
  };

  const goToStep = (step: number) => {
    if (step >= 1 && step <= 5) {
      setCurrentStep(step);
      setTimeout(scrollToTop, 100);
    }
  };

  const resetConfig = () => {
    setConfig(initialConfig);
    setCurrentStep(1);
    setIsDraft(false);
    localStorage.removeItem("mymood-button-expanded-draft");
  };

  const saveAsDraft = () => {
    const drafts = JSON.parse(
      localStorage.getItem("mymood-button-drafts") || "[]",
    );
    const newDraft = {
      id: Date.now().toString(),
      config: config,
      step: currentStep,
      name: config.label || `${config.purpose.name} Button`,
      lastModified: new Date().toISOString(),
      thumbnail: config.color,
    };
    drafts.push(newDraft);
    localStorage.setItem("mymood-button-drafts", JSON.stringify(drafts));
    setIsDraft(false);
  };

  const completeOrder = async () => {
    const newOrderId = `MB-${Date.now()}`;
    const orders = JSON.parse(
      localStorage.getItem("mymood-button-orders") || "[]",
    );

    const newOrder = {
      id: newOrderId,
      orderNumber: newOrderId,
      config: config,
      totalPrice: totalPrice,
      date: new Date().toISOString(),
      status: "confirmed",
      thumbnail: config.color,
    };

    orders.push(newOrder);
    localStorage.setItem("mymood-button-orders", JSON.stringify(orders));

    // Prepare order data for Google Sheets
    const orderDataForSheets = {
      orderId: newOrderId,
      orderNumber: newOrderId,
      config: config,
      totalPrice: totalPrice,
      date: newOrder.date,
      status: "confirmed",
      customerInfo: {
        email: "",
        name: "",
        phone: "",
        address: "",
      },
    };

    // Log order details for debugging
    console.log(
      "🛍️ Processing new order (Expanded):",
      formatOrderDataForLogging(orderDataForSheets),
    );

    // Send order data to Google Sheets
    try {
      const sheetsResult = await sendOrderToGoogleSheets(orderDataForSheets);
      if (sheetsResult) {
        console.log(
          "✅ Order data sent to Google Sheets successfully (Expanded)",
        );
      } else {
        console.error(
          "❌ Failed to send order data to Google Sheets (Expanded)",
        );
      }
    } catch (error) {
      console.error(
        "❌ Error sending order data to Google Sheets (Expanded):",
        error,
      );
    }

    // Clear draft after successful order
    localStorage.removeItem("mymood-button-expanded-draft");
    setIsDraft(false);
    setOrderId(newOrderId);

    return newOrderId;
  };

  const loadDraft = (draftId: string) => {
    const drafts = JSON.parse(
      localStorage.getItem("mymood-button-drafts") || "[]",
    );
    const draft = drafts.find((d: any) => d.id === draftId);
    if (draft) {
      setConfig(draft.config);
      setCurrentStep(draft.step);
      setIsDraft(true);
    }
  };

  return {
    currentStep,
    config,
    isValid,
    totalPrice,
    isDraft,
    orderId,
    updateConfig,
    addCustomColor,
    uploadImage,
    updateElementPosition,
    nextStep,
    prevStep,
    goToStep,
    resetConfig,
    saveAsDraft,
    completeOrder,
    loadDraft,
  };
}
