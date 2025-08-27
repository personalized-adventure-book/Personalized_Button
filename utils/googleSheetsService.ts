/**
 * Google Apps Script Integration Service
 * Sends order data to Google Sheets via Google Apps Script webhook
 */

import { ButtonConfig } from "@/types/button-builder-expanded";

export interface OrderData {
  orderId: string;
  orderNumber: string;
  config: ButtonConfig;
  totalPrice: number;
  date: string;
  status: string;
  customerInfo?: {
    email?: string;
    name?: string;
    phone?: string;
    address?: string;
  };
}

const GOOGLE_APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyMjjjEJPOVMg6Isus6Wn07OIFqS_-X66mwZWMEiN0ygV9XUKkOluAaHvYgNl_0g3NC/exec";

/**
 * Sends order data to Google Apps Script
 * @param orderData The complete order information
 * @returns Promise<boolean> Success status
 */
export async function sendOrderToGoogleSheets(
  orderData: OrderData,
): Promise<boolean> {
  try {
    console.log("📊 Sending order data to Google Sheets...", {
      orderId: orderData.orderId,
      totalPrice: orderData.totalPrice,
      timestamp: new Date().toISOString(),
    });

    // Prepare the data payload
    const payload = {
      // Order Information
      orderId: orderData.orderId,
      orderNumber: orderData.orderNumber,
      totalPrice: orderData.totalPrice,
      date: orderData.date,
      status: orderData.status,

      // Button Configuration
      purpose: orderData.config.purpose.name,
      purposeDescription: orderData.config.purpose.name, // Use name instead of description
      customPurpose: orderData.config.customPurpose || "",

      // Shape & Style
      shape: orderData.config.shape.name,
      shapeId: orderData.config.shape.id,
      color: orderData.config.color,
      isCustomColor: orderData.config.customColors.includes(
        orderData.config.color,
      ),
      finish: orderData.config.finish.name,
      finishPrice: orderData.config.finish.price,

      // Label & Content
      label: orderData.config.label || "",
      icon: orderData.config.icon || "",
      iconAlignment: orderData.config.iconAlignment,
      iconPosition: JSON.stringify(orderData.config.iconPosition),
      iconSize: orderData.config.iconSize,
      labelPosition: JSON.stringify(orderData.config.labelPosition),
      labelSize: orderData.config.labelSize,
      hasUploadedImage: !!orderData.config.uploadedImage,
      uploadedImageInfo: orderData.config.uploadedImage
        ? JSON.stringify({
            keepBackground: orderData.config.uploadedImage.keepBackground,
            position: orderData.config.uploadedImage.position,
            size: orderData.config.uploadedImage.size,
          })
        : "",

      // Lighting & Smart Features
      lightMode: orderData.config.lightMode.name,
      lightModePrice: orderData.config.lightMode.price,
      brightness: orderData.config.brightness,
      wifiEnabled: orderData.config.wifiEnabled,
      wifiFeatures: JSON.stringify(orderData.config.wifiFeatures),
      schedule: JSON.stringify(orderData.config.schedule),

      // Quantity & Pricing
      quantity: orderData.config.quantity,
      basePrice: 149,

      // Customer Information (if available)
      customerEmail: orderData.customerInfo?.email || "",
      customerName: orderData.customerInfo?.name || "",
      customerPhone: orderData.customerInfo?.phone || "",
      customerAddress: orderData.customerInfo?.address || "",

      // Metadata
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };

    // Send POST request to Google Apps Script
    const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors", // Required for Google Apps Script
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    console.log("✅ Order data sent to Google Sheets successfully", {
      orderId: orderData.orderId,
      status: "success",
      timestamp: new Date().toISOString(),
    });

    return true;
  } catch (error) {
    console.error("❌ Failed to send order data to Google Sheets:", error);

    // Log detailed error information
    console.error("Error details:", {
      orderId: orderData.orderId,
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    });

    return false;
  }
}

/**
 * Utility function to format order data for logging/debugging
 */
export function formatOrderDataForLogging(orderData: OrderData) {
  return {
    orderId: orderData.orderId,
    orderNumber: orderData.orderNumber,
    totalPrice: orderData.totalPrice,
    date: orderData.date,
    status: orderData.status,

    // Configuration summary
    configSummary: {
      purpose: orderData.config.purpose.name,
      shape: orderData.config.shape.name,
      color: orderData.config.color,
      finish: orderData.config.finish.name,
      label: orderData.config.label || "(no label)",
      icon: orderData.config.icon || "(no icon)",
      lightMode: orderData.config.lightMode.name,
      brightness: orderData.config.brightness,
      wifiEnabled: orderData.config.wifiEnabled,
      quantity: orderData.config.quantity,
    },
  };
}
