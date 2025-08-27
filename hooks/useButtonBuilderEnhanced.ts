"use client";

import { useState, useEffect } from "react";
import {
  ButtonConfig,
  buttonSizes,
  materials,
  textures,
  fonts,
  lightingModes,
} from "@/types/button-builder-enhanced";
import { purposes, shapes } from "@/types/button-builder";

const initialConfig: ButtonConfig = {
  // Basic Info
  purpose: purposes[0],
  customPurpose: "",

  // Physical Design
  shape: shapes[0],
  size: buttonSizes[2], // Standard size
  material: materials[0], // Plastic
  texture: textures[0], // Smooth
  thickness: 15, // mm

  // Visual Design
  color: {
    type: "solid",
    primary: "#FF7A00",
  },
  pattern: null,

  // Text & Typography
  label: "",
  font: fonts[0], // Inter
  textSize: 12,
  textPosition: { x: 50, y: 70, rotation: 0, alignment: "center" },
  textColor: "#FFFFFF",
  textEffect: { id: "none", name: "None", description: "No text effect", animated: false, price: 0 },

  // Icon & Graphics
  icon: null,
  iconSize: 20,
  iconPosition: { x: 50, y: 30, rotation: 0, scale: 1 },
  iconColor: "#FFFFFF",
  iconEffect: { id: "none", name: "None", animated: false, price: 0 },
  customGraphics: [],

  // Lighting System
  lightingMode: lightingModes[0],
  lightingPattern: {
    id: "static",
    name: "Static",
    description: "Constant light",
    duration: 0,
    repeating: false,
    customizable: true,
    price: 0,
  },
  brightness: 75,
  colorTransition: { enabled: false, speed: 1, smoothness: 50, colorStops: [] },
  lightingTriggers: [],
  ambientLighting: false,

  // Smart Features
  connectivity: {
    wifi: false,
    bluetooth: true,
    zigbee: false,
    matter: false,
    threadBorder: false,
  },
  smartHome: { platforms: [], automations: [], scenes: [] },
  voiceCommands: [],
  appIntegration: {
    notifications: true,
    remoteControl: true,
    analytics: false,
    sharing: false,
    cloudSync: false,
  },

  // Advanced Features
  multiMode: [],
  scheduledBehaviors: [],
  conditionalActions: [],
  customProgramming: null,

  // Hardware Options
  batteryType: {
    id: "standard",
    name: "Standard Battery",
    capacity: 1000,
    lifespan: 6,
    rechargeable: true,
    price: 0,
  },
  chargingMethod: {
    id: "usb-c",
    name: "USB-C",
    type: "usb-c",
    speed: "Fast",
    price: 0,
  },
  mounting: {
    id: "adhesive",
    name: "Adhesive Mount",
    type: "adhesive",
    removable: true,
    price: 0,
  },
  accessories: [],

  // Order Details
  quantity: 1,
  engraving: null,
  packaging: {
    id: "standard",
    name: "Standard Box",
    description: "Recyclable packaging",
    sustainable: true,
    giftBox: false,
    price: 0,
  },
};

export function useButtonBuilderEnhanced() {
  const [currentStep, setCurrentStep] = useState(1);
  const [config, setConfig] = useState<ButtonConfig>(initialConfig);
  const [isValid, setIsValid] = useState(false);
  const [totalPrice, setTotalPrice] = useState(149);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("mymood-button-enhanced-draft");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setConfig(parsed.config);
        setCurrentStep(parsed.step);
      } catch (error) {
        console.error("Failed to load draft:", error);
      }
    }
  }, []);

  // Save to localStorage on changes
  useEffect(() => {
    const draft = { config, step: currentStep };
    localStorage.setItem("mymood-button-enhanced-draft", JSON.stringify(draft));
  }, [config, currentStep]);

  // Calculate total price
  useEffect(() => {
    let price = 149; // Base price

    // Physical design additions
    price += config.size.price;
    price += config.material.price;
    price += config.texture.price;

    // Visual design additions
    if (config.pattern) price += config.pattern.price;
    if (config.font.premium) price += 15;
    price += config.textEffect.price;
    price += config.iconEffect.price;

    // Lighting additions
    price += config.lightingMode.price;
    price += config.lightingPattern.price;

    // Hardware additions
    price += config.batteryType.price;
    price += config.chargingMethod.price;
    price += config.mounting.price;

    // Accessories
    config.accessories.forEach((acc) => (price += acc.price));

    // Order details
    if (config.engraving?.enabled) price += config.engraving.price;
    price += config.packaging.price;

    // Multiply by quantity
    price *= config.quantity;

    setTotalPrice(price);
  }, [config]);

  // Enhanced validation logic for 8 steps
  useEffect(() => {
    switch (currentStep) {
      case 1: // Purpose & Use Case
        setIsValid(!!config.purpose);
        break;
      case 2: // Physical Design
        setIsValid(
          !!config.shape &&
            !!config.size &&
            !!config.material &&
            !!config.texture,
        );
        break;
      case 3: // Visual Design
        setIsValid(!!config.color.primary);
        break;
      case 4: // Text & Graphics
        const hasContent = Boolean(
          config.label.length > 0 ||
          config.icon ||
          config.customGraphics.length > 0
        );
        setIsValid(hasContent);
        break;
      case 5: // Lighting System
        setIsValid(config.brightness >= 0 && config.brightness <= 100);
        break;
      case 6: // Smart Features
        setIsValid(true); // Optional features
        break;
      case 7: // Advanced Features
        setIsValid(true); // Optional features
        break;
      case 8: // Review & Order
        setIsValid(true);
        break;
      default:
        setIsValid(false);
    }
  }, [config, currentStep]);

  const updateConfig = (updates: Partial<ButtonConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const nextStep = () => {
    if (isValid && currentStep < 8) {
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
    if (step >= 1 && step <= 8) {
      setCurrentStep(step);
      setTimeout(scrollToTop, 100);
    }
  };

  const resetConfig = () => {
    setConfig(initialConfig);
    setCurrentStep(1);
    localStorage.removeItem("mymood-button-enhanced-draft");
  };

  const duplicateMode = (mode: any) => {
    const newMode = {
      ...mode,
      id: Date.now().toString(),
      name: `${mode.name} Copy`,
    };
    updateConfig({
      multiMode: [...config.multiMode, newMode],
    });
  };

  const addScheduledBehavior = (behavior: any) => {
    updateConfig({
      scheduledBehaviors: [
        ...config.scheduledBehaviors,
        { ...behavior, id: Date.now().toString() },
      ],
    });
  };

  const addConditionalAction = (action: any) => {
    updateConfig({
      conditionalActions: [
        ...config.conditionalActions,
        { ...action, id: Date.now().toString() },
      ],
    });
  };

  const addCustomGraphic = (graphic: any) => {
    updateConfig({
      customGraphics: [
        ...config.customGraphics,
        { ...graphic, id: Date.now().toString() },
      ],
    });
  };

  return {
    currentStep,
    config,
    isValid,
    totalPrice,
    updateConfig,
    nextStep,
    prevStep,
    goToStep,
    resetConfig,
    duplicateMode,
    addScheduledBehavior,
    addConditionalAction,
    addCustomGraphic,
  };
}
