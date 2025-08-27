"use client";

import { useState, useEffect } from "react";
import { sendOrderNotificationEmail } from "@/utils/emailService";
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
  // Customer Information
  customerInfo: {
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
  },
  // Button Configuration
  purpose: purposes[0],
  shape: shapes[0],
  color: defaultColors[0].value,
  customColors: [],
  finish: finishes[0],
  label: "",
  icon: null,
  iconAlignment: "left",
  iconPosition: { x: 50, y: 30 },
  iconSize: 20, // Default icon size
  labelPosition: { x: 50, y: 70 },
  labelSize: 14, // Default text size
  uploadedImage: null,
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

export function useButtonBuilder() {
  // Prevent re-initialization by checking if we already have data in sessionStorage
  const [currentStep, setCurrentStep] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem("mymood-current-step");
      return saved ? parseInt(saved) : 1;
    }
    return 1;
  });
  
  const [config, setConfig] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem("mymood-current-config");
      return saved ? JSON.parse(saved) : initialConfig;
    }
    return initialConfig;
  });
  const [isValid, setIsValid] = useState(false);
  const [totalPrice, setTotalPrice] = useState(149);
  const [isDraft, setIsDraft] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Persist current step to sessionStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem("mymood-current-step", currentStep.toString());
    }
  }, [currentStep]);

  // Persist config to sessionStorage  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem("mymood-current-config", JSON.stringify(config));
    }
  }, [config]);

  // Cookie helper functions
  const setCookie = (name: string, value: string, days: number = 7) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
  };

  const getCookie = (name: string): string | null => {
    const nameEQ = name + "=";
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  };

  const deleteCookie = (name: string) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  };

  // Simple initialization - state is already loaded from sessionStorage in useState initializers
  useEffect(() => {
    setIsLoaded(true);
    setIsDraft(true);
  }, []); // This runs EXACTLY ONCE and never again

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
    let valid = false;

    switch (currentStep) {
      case 1:
        // Customer Info - require name and email
        valid =
          !!config.customerInfo?.fullName?.trim() &&
          !!config.customerInfo?.email?.trim() &&
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.customerInfo?.email || "");
        break;
      case 2:
        // Purpose
        valid = !!config.purpose;
        break;
      case 3:
        // Shape & Style
        valid = !!config.shape && !!config.color && !!config.finish;
        break;
      case 4:
        // Label & Icon - always valid (user can proceed without text/icon)
        valid = true;
        break;
      case 5:
        // Behavior
        valid = config.brightness >= 0 && config.brightness <= 100;
        break;
      case 6:
        // Delivery Address - require all fields
        valid =
          !!config.customerInfo?.deliveryAddress?.street?.trim() &&
          !!config.customerInfo?.deliveryAddress?.city?.trim() &&
          !!config.customerInfo?.deliveryAddress?.state?.trim() &&
          !!config.customerInfo?.deliveryAddress?.zipCode?.trim() &&
          !!config.customerInfo?.deliveryAddress?.country?.trim();
        break;
      case 7:
        // Review - always valid
        valid = true;
        break;
      default:
        valid = false;
    }

    setIsValid(valid);
  }, [config, currentStep]);

  const updateConfig = (updates: Partial<ButtonConfig>) => {
    // ALWAYS merge into existing config, never replace
    setConfig((prev: ButtonConfig) => ({ ...prev, ...updates }));
  };

  const addCustomColor = (color: string) => {
    if (!config.customColors.includes(color)) {
      updateConfig({
        customColors: [...config.customColors, color],
        color: color,
      });
    }
  };

  const uploadImage = async (file: File, keepBackground: boolean = true) => {
    const tempId = Date.now().toString();
    // Optimistic local state
    updateConfig({
      uploadedImage: {
        id: tempId,
        file: file,
        keepBackground,
        position: { x: 50, y: 50 },
        size: { width: 40, height: 40 },
        originalFileName: file.name,
      },
    });

    try {
      const formData = new FormData();
      formData.append("file", file);
      // Use existing or pending orderId (generate lightweight session id if none)
      const activeOrderId = orderId || getCookie("mymood-active-order-id") || `SESSION-${Date.now()}`;
      if (!orderId) setCookie("mymood-active-order-id", activeOrderId, 7);
      formData.append("orderId", activeOrderId);

      const res = await fetch("/api/upload-media", { method: "POST", body: formData });
      if (!res.ok) throw new Error(`Upload failed (${res.status})`);
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Unknown upload error");
      // Patch in drive metadata
      updateConfig({
        uploadedImage: {
          id: tempId,
            file: file,
            keepBackground,
            position: { x: 50, y: 50 },
            size: { width: 40, height: 40 },
            originalFileName: file.name,
            driveFileId: data.fileId,
        },
      });
    } catch (e) {
      console.error("Image upload to Drive failed", e);
      // Leave optimistic state without driveFileId. Optionally revert if desired.
    }
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
    if (isValid && currentStep < 7) {
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
    if (step >= 1 && step <= 7) {
      setCurrentStep(step);
      setTimeout(scrollToTop, 100);
    }
  };

  const resetConfig = () => {
    setConfig(initialConfig);
    setCurrentStep(1);
    setIsDraft(false);
    localStorage.removeItem("mymood-config");
  };

  const startNewOrder = () => {
    // Clear existing localStorage data
    localStorage.removeItem("mymood-config");
    sessionStorage.setItem("mymood-force-reset", "true");

    // Reset to initial state immediately
    setConfig(initialConfig);
    setCurrentStep(1);
    setIsDraft(true);

    // Force page reload to ensure clean state
    window.location.reload();
  };

  const getDrafts = () => {
    try {
      const draftsData = localStorage.getItem("mymood-drafts");
      return draftsData ? JSON.parse(draftsData) : [];
    } catch (error) {
      console.error("Failed to load drafts:", error);
      return [];
    }
  };

  const saveDraft = (name?: string) => {
    try {
      const drafts = getDrafts();
      const draftId = `draft-${Date.now()}`;
      const newDraft = {
        id: draftId,
        name: name || `Draft ${drafts.length + 1}`,
        step: currentStep,
        lastModified: new Date().toISOString(),
        timestamp: Date.now(),
        thumbnail: config.color,
        config: config,
      };

      drafts.push(newDraft);
      localStorage.setItem("mymood-drafts", JSON.stringify(drafts));

      // Also save as current config
      const currentData = { config, step: currentStep, timestamp: Date.now() };
      localStorage.setItem("mymood-config", JSON.stringify(currentData));

      return draftId;
    } catch (error) {
      console.error("Failed to save draft:", error);
      return null;
    }
  };

  const loadDraft = (draft: any) => {
    setConfig(draft.config);
    setCurrentStep(draft.step);
    setIsDraft(true);
  };

  const deleteDraft = (draftId: string) => {
    try {
      const drafts = getDrafts();
      const updatedDrafts = drafts.filter((draft: any) => draft.id !== draftId);
      localStorage.setItem("mymood-drafts", JSON.stringify(updatedDrafts));
      // If no drafts remain, clear form-related persisted state so form is empty
      if (updatedDrafts.length === 0) {
        try {
          localStorage.removeItem("mymood-config");
          sessionStorage.removeItem("mymood-current-step");
          sessionStorage.removeItem("mymood-current-config");
        } catch (e) {
          console.warn("Failed clearing persisted form state after last draft deletion", e);
        }
        // Reset in-memory state
        setConfig(initialConfig);
        setCurrentStep(1);
        setIsDraft(false);
      }
    } catch (error) {
      console.error("Failed to delete draft:", error);
    }
  };

  const completeOrder = async () => {
    const newOrderId = `MB-${Date.now()}`;
    const ordersData = getCookie("mymood-button-orders");
    const orders = ordersData ? JSON.parse(decodeURIComponent(ordersData)) : [];

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
    setCookie(
      "mymood-button-orders",
      encodeURIComponent(JSON.stringify(orders)),
      365,
    ); // 1 year for orders

    // Prepare order data for Google Sheets
    const orderDataForSheets = {
      orderId: newOrderId,
      orderNumber: newOrderId,
      config: config,
      totalPrice: totalPrice,
      date: newOrder.date,
      status: "confirmed",
      // Customer info from form
      customerInfo: {
        email: config.customerInfo.email,
        name: config.customerInfo.fullName,
        phone: config.customerInfo.phone || "",
        address: `${config.customerInfo.deliveryAddress.street}, ${config.customerInfo.deliveryAddress.city}, ${config.customerInfo.deliveryAddress.state} ${config.customerInfo.deliveryAddress.zipCode}, ${config.customerInfo.deliveryAddress.country}`,
      },
    };

    // Log order details for debugging
    console.log(
      "🛍️ Processing new order:",
      formatOrderDataForLogging(orderDataForSheets),
    );

    // Send order data to Google Sheets (parallel with email)
    const [emailResult, sheetsResult] = await Promise.allSettled([
      // Send order notification email
      sendOrderNotificationEmail({
        orderId: newOrderId,
        config: config,
        totalPrice: totalPrice,
        date: newOrder.date,
      }),
      // Send order data to Google Sheets
      sendOrderToGoogleSheets(orderDataForSheets),
    ]);

    // Handle email result
    if (emailResult.status === "fulfilled") {
      console.log("✅ Order notification email sent successfully");
    } else {
      console.error(
        "❌ Failed to send order notification email:",
        emailResult.reason,
      );
    }

    // Handle Google Sheets result
    if (sheetsResult.status === "fulfilled" && sheetsResult.value) {
      console.log("✅ Order data sent to Google Sheets successfully");
    } else {
      console.error(
        "❌ Failed to send order data to Google Sheets:",
        sheetsResult.status === "rejected"
          ? sheetsResult.reason
          : "Request failed",
      );
    }

    // Clear both draft and active order after successful completion
    deleteCookie("mymood-button-draft");
    deleteCookie("mymood-active-order");
    localStorage.removeItem("mymood-config");

    // Force a reset on next page load
    sessionStorage.setItem("mymood-force-reset", "true");

    setIsDraft(false);
    setOrderId(newOrderId);

    return newOrderId;
  };

  const setLabel = (label: string) => {
    updateConfig({ label });
  };

  return {
    currentStep,
    config,
    isValid,
    totalPrice,
    isDraft,
    orderId,
    isLoaded,
    updateConfig,
    addCustomColor,
    uploadImage,
    updateElementPosition,
    nextStep,
    prevStep,
    goToStep,
    resetConfig,
    startNewOrder,
    completeOrder,
    setLabel,
    getDrafts,
    saveDraft,
    loadDraft,
    deleteDraft,
  };
}
