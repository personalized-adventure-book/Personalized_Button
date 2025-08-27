"use client";

import { useState } from "react";
import { Palette, Plus, Check, Sparkles } from "lucide-react";
import { useButtonBuilderExpanded } from "@/hooks/useButtonBuilderExpanded";
import {
  shapes,
  finishes,
  defaultColors,
} from "@/types/button-builder-expanded";

export function StepShapeStyleExpanded() {
  const { config, updateConfig, addCustomColor } = useButtonBuilderExpanded();
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [customColor, setCustomColor] = useState("#FF7A00");
  const [activeTab, setActiveTab] = useState<"shape" | "color" | "finish">(
    "shape",
  );

  const allColors = [
    ...defaultColors,
    ...config.customColors.map((color) => ({ name: "Custom", value: color })),
  ];

  const handleColorSelect = (color: string) => {
    updateConfig({ color });
    setShowColorPicker(false);
  };

  const handleCustomColorAdd = () => {
    addCustomColor(customColor);
    setShowColorPicker(false);
  };

  const ButtonPreview = () => {
    const shapeClass = getShapeClass(config.shape.id);
    const finishEffect = getFinishEffect(config.finish.id);

    return (
      <div className="relative">
        <div
          className={`w-32 h-32 ${shapeClass} transition-all duration-300 shadow-lg ${finishEffect} relative overflow-hidden`}
          style={{ backgroundColor: config.color }}
        >
          {/* Finish-specific effects */}
          {config.finish.id === "glossy" && (
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent"></div>
          )}
          {config.finish.id === "metallic" && (
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20"></div>
          )}
          {config.finish.id === "pearl" && (
            <div className="absolute inset-0 bg-gradient-to-45 from-white/30 via-purple-200/20 to-blue-200/20"></div>
          )}
          {config.finish.id === "carbon" && (
            <div
              className="absolute inset-0 opacity-30"
              style={{
                background:
                  "repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)",
              }}
            ></div>
          )}

          {/* Content preview */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-white/30 rounded-full animate-pulse-slow"></div>
          </div>
        </div>
      </div>
    );
  };

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

  const getFinishEffect = (finishId: string) => {
    const finishEffects: Record<string, string> = {
      matte: "",
      glossy: "shadow-xl",
      satin: "shadow-lg",
      metallic: "shadow-lg ring-1 ring-white/20",
      pearl: "shadow-lg",
      textured: "shadow-md",
      carbon: "shadow-xl ring-1 ring-gray-600",
      "soft-touch": "shadow-md",
    };
    return finishEffects[finishId] || "";
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
  <h2 className="font-cal-sans font-bold text-gray-900 dark:text-white text-[clamp(1.4rem,1rem+1.4vw,2.1rem)] leading-tight">
          Design Your Button's Appearance
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Choose from 15 unique shapes, unlimited colors, and 8 premium
          finishes.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Configuration Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setActiveTab("shape")}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors duration-200 ${
                activeTab === "shape"
                  ? "bg-white dark:bg-gray-700 text-primary shadow-sm"
                  : "text-gray-600 dark:text-gray-400"
              }`}
            >
              Shape ({shapes.length})
            </button>
            <button
              onClick={() => setActiveTab("color")}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors duration-200 ${
                activeTab === "color"
                  ? "bg-white dark:bg-gray-700 text-primary shadow-sm"
                  : "text-gray-600 dark:text-gray-400"
              }`}
            >
              Color ({allColors.length})
            </button>
            <button
              onClick={() => setActiveTab("finish")}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors duration-200 ${
                activeTab === "finish"
                  ? "bg-white dark:bg-gray-700 text-primary shadow-sm"
                  : "text-gray-600 dark:text-gray-400"
              }`}
            >
              Finish ({finishes.length})
            </button>
          </div>

          {/* Shape Selection */}
          {activeTab === "shape" && (
            <div className="space-y-6">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                Choose Your Shape
              </h3>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                {shapes.map((shape) => (
                  <button
                    key={shape.id}
                    onClick={() => updateConfig({ shape })}
                    className={`p-3 border rounded-lg transition-all duration-200 ${
                      config.shape.id === shape.id
                        ? "border-primary bg-primary/5 dark:bg-primary/10 ring-2 ring-primary/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-primary/50"
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <div
                        className={`w-8 h-8 bg-gradient-to-br from-primary/30 to-secondary-blue/30 ${getShapeClass(shape.id)}`}
                      ></div>
                      <div className="text-xs font-medium text-gray-900 dark:text-white text-center">
                        {shape.name}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color Selection */}
          {activeTab === "color" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                  Choose Your Color
                </h3>
                <button
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  className="btn-secondary inline-flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Custom
                </button>
              </div>

              <div className="grid grid-cols-6 md:grid-cols-8 gap-3">
                {allColors.map((color, index) => (
                  <button
                    key={`${color.value}-${index}`}
                    onClick={() => handleColorSelect(color.value)}
                    className={`w-12 h-12 rounded-lg transition-all duration-200 ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-800 relative ${
                      config.color === color.value
                        ? "ring-primary scale-110"
                        : "ring-transparent hover:scale-105"
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  >
                    {config.color === color.value && (
                      <Check className="w-4 h-4 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                    )}
                  </button>
                ))}
              </div>

              {/* Custom Color Picker */}
              {showColorPicker && (
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Create Custom Color
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        value={customColor}
                        onChange={(e) => setCustomColor(e.target.value)}
                        className="w-12 h-12 rounded border border-gray-300 dark:border-gray-600"
                      />
                      <input
                        type="text"
                        value={customColor}
                        onChange={(e) => setCustomColor(e.target.value)}
                        placeholder="#FF7A00"
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                      <button
                        onClick={handleCustomColorAdd}
                        className="btn-primary px-4 py-2"
                      >
                        Add Color
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Finish Selection */}
          {activeTab === "finish" && (
            <div className="space-y-6">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                Choose Your Finish
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {finishes.map((finish) => (
                  <button
                    key={finish.id}
                    onClick={() => updateConfig({ finish })}
                    className={`p-4 border rounded-lg text-left transition-all duration-200 ${
                      config.finish.id === finish.id
                        ? "border-primary bg-primary/5 dark:bg-primary/10"
                        : "border-gray-200 dark:border-gray-700 hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-8 h-8 rounded-lg ${getFinishEffect(finish.id)}`}
                          style={{ backgroundColor: config.color }}
                        ></div>
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                            <span>{finish.name}</span>
                            {finish.premium && (
                              <Sparkles className="w-4 h-4 text-yellow-500" />
                            )}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {finish.description}
                          </div>
                        </div>
                      </div>
                      {finish.price > 0 && (
                        <div className="text-primary font-semibold">
                          +${finish.price}
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
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
              {config.shape.name}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {config.finish.name} finish
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-500">
              Color: {config.color}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
