"use client";

import { useState, useEffect } from "react";
import {
  Lightbulb,
  Wifi,
  WifiOff,
  Zap,
  Clock,
  Smartphone,
  Home,
  ChevronDown,
  ChevronUp,
  Info,
} from "lucide-react";
import { useButtonBuilderExpanded } from "@/hooks/useButtonBuilderExpanded";
import { lightModes, wifiIntegration } from "@/types/button-builder-expanded";

export function StepBehaviorExpanded() {
  const { config, updateConfig } = useButtonBuilderExpanded();
  const [showWifiDetails, setShowWifiDetails] = useState(false);
  const [previewAnimation, setPreviewAnimation] = useState("");

  // Apply light mode to preview immediately
  useEffect(() => {
    const mode = config.lightMode;
    if (mode.animated) {
      setPreviewAnimation(mode.id);
    } else {
      setPreviewAnimation("");
    }
  }, [config.lightMode]);

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

  const getLightingAnimation = (modeId: string) => {
    const animations: Record<string, string> = {
      static: "",
      pulse: "animate-pulse",
      fade: "animate-pulse",
      breathe: "animate-bounce",
      rainbow: "animate-spin",
      strobe: "animate-ping",
      sparkle: "animate-pulse",
      wave: "animate-bounce",
      fire: "animate-pulse",
      aurora: "animate-pulse",
      lightning: "animate-ping",
      galaxy: "animate-spin",
    };
    return animations[modeId] || "";
  };

  const getLightingColor = (
    mode: (typeof lightModes)[0],
    brightness: number,
  ) => {
    const opacity = brightness / 100;

    if (mode.id === "rainbow") {
      return {
        background: mode.previewColor,
        opacity: opacity,
      };
    }

    if (mode.id === "aurora") {
      return {
        background: mode.previewColor,
        opacity: opacity,
      };
    }

    if (mode.id === "galaxy") {
      return {
        background: mode.previewColor,
        opacity: opacity,
      };
    }

    return {
      backgroundColor: mode.previewColor,
      opacity: opacity,
    };
  };

  const ButtonPreview = () => {
    const shapeClass = getShapeClass(config.shape.id);
    const animationClass = getLightingAnimation(config.lightMode.id);
    const lightingStyle = getLightingColor(config.lightMode, config.brightness);

    return (
      <div className="relative">
        <div
          className={`w-32 h-32 ${shapeClass} transition-all duration-300 shadow-lg relative overflow-hidden ${animationClass}`}
          style={lightingStyle}
        >
          {/* Glow effect based on brightness */}
          <div
            className={`absolute inset-0 ${shapeClass} blur-xl -z-10`}
            style={{
              backgroundColor: config.lightMode.previewColor,
              opacity: config.brightness / 300,
              transform: "scale(1.5)",
            }}
          ></div>

          {/* Content preview */}
          <div className="relative z-10 h-full flex items-center justify-center">
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
                <div className="w-4 h-4 bg-white/50 rounded"></div>
              </div>
            )}
          </div>

          {/* WiFi indicator */}
          {config.wifiEnabled && (
            <div className="absolute top-2 right-2">
              <Wifi className="w-4 h-4 text-white/70" />
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
  <h2 className="font-cal-sans font-bold text-gray-900 dark:text-white text-[clamp(1.4rem,1rem+1.4vw,2.1rem)] leading-tight">
          Customize Lighting & Smart Features
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Choose from 12 unique lighting modes and optional WiFi integration for
          smart home control.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Configuration Panel */}
        <div className="space-y-8">
          {/* Lighting Modes */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white flex items-center space-x-2">
              <Lightbulb className="w-5 h-5 text-primary" />
              <span>Lighting Mode</span>
            </h3>
            <div className="grid md:grid-cols-2 gap-3">
              {lightModes.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => updateConfig({ lightMode: mode })}
                  className={`p-4 border rounded-lg text-left transition-all duration-200 ${
                    config.lightMode.id === mode.id
                      ? "border-primary bg-primary/5 dark:bg-primary/10 ring-2 ring-primary/20"
                      : "border-gray-200 dark:border-gray-700 hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                        <span>{mode.name}</span>
                        {mode.animated && (
                          <Zap className="w-3 h-3 text-yellow-500" />
                        )}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {mode.description}
                      </div>
                    </div>
                    <div className="ml-2 flex flex-col items-end">
                      {mode.price > 0 && (
                        <div className="text-primary font-semibold text-sm">
                          +${mode.price}
                        </div>
                      )}
                      <div
                        className="w-6 h-6 rounded-full border-2 border-gray-300 mt-1"
                        style={{
                          background: mode.previewColor.includes("gradient")
                            ? mode.previewColor
                            : mode.previewColor,
                          backgroundColor: mode.previewColor.includes(
                            "gradient",
                          )
                            ? undefined
                            : mode.previewColor,
                        }}
                      ></div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Brightness Control */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                Brightness
              </h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {config.brightness}%
              </span>
            </div>
            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max="100"
                value={config.brightness}
                onChange={(e) =>
                  updateConfig({ brightness: parseInt(e.target.value) })
                }
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #FF7A00 0%, #FF7A00 ${config.brightness}%, #e5e7eb ${config.brightness}%, #e5e7eb 100%)`,
                }}
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>Dim</span>
                <span>Medium</span>
                <span>Bright</span>
              </div>
            </div>
          </div>

          {/* WiFi Integration */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <Wifi className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    WiFi Integration
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Smart home control & advanced features
                  </div>
                  <div className="text-sm font-semibold text-primary">
                    +${wifiIntegration.basePrice}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowWifiDetails(!showWifiDetails)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <Info className="w-5 h-5" />
                </button>
                <button
                  onClick={() =>
                    updateConfig({ wifiEnabled: !config.wifiEnabled })
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    config.wifiEnabled
                      ? "bg-primary"
                      : "bg-gray-200 dark:bg-gray-700"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      config.wifiEnabled ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* WiFi Features Details */}
            {showWifiDetails && (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100">
                    WiFi Features Included
                  </h4>
                  <button
                    onClick={() => setShowWifiDetails(false)}
                    className="text-blue-600 dark:text-blue-400"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid md:grid-cols-2 gap-3 text-sm">
                  {Object.entries(wifiIntegration.features).map(
                    ([key, feature]) => (
                      <div key={key} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-blue-800 dark:text-blue-200">
                          {feature.name}
                        </span>
                      </div>
                    ),
                  )}
                </div>
                <div className="mt-3 p-3 bg-blue-100 dark:bg-blue-900/20 rounded border-l-4 border-blue-500">
                  <div className="text-xs text-blue-700 dark:text-blue-300">
                    <strong>Includes:</strong> Remote control, scheduling, smart
                    home integration, voice commands, geofencing, push
                    notifications, usage analytics, automatic updates, cloud
                    sync, and multi-device control.
                  </div>
                </div>
              </div>
            )}

            {/* WiFi Feature Highlights */}
            {config.wifiEnabled && (
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Smartphone className="w-5 h-5 text-primary" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white text-sm">
                      Remote Control
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      Control from anywhere
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Clock className="w-5 h-5 text-primary" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white text-sm">
                      Smart Scheduling
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      Time-based automation
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Home className="w-5 h-5 text-primary" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white text-sm">
                      Smart Home Hub
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      Alexa, Google, Apple
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Zap className="w-5 h-5 text-primary" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white text-sm">
                      Voice Commands
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      Voice activation
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Live Preview */}
        <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6">
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-6 text-center">
            Live Preview
          </h3>
          <div className="flex items-center justify-center">
            <ButtonPreview />
          </div>
          <div className="mt-6 text-center space-y-2">
            <div className="font-semibold text-gray-900 dark:text-white">
              {config.lightMode.name}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {config.brightness}% brightness
              {config.lightMode.animated && " • Animated"}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-500">
              {config.wifiEnabled ? "📶 WiFi enabled" : "📱 Standalone mode"}
            </div>
            {config.lightMode.price > 0 && (
              <div className="text-xs text-primary">
                +${config.lightMode.price} for {config.lightMode.name}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
