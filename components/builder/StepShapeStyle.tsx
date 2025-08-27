"use client";

import { useState } from "react";
import { Palette, Plus, Check, Sparkles } from "lucide-react";
import { useButtonBuilder } from "@/hooks/useButtonBuilder";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  shapes,
  finishes,
  defaultColors,
} from "@/types/button-builder-expanded";
import { ShapePreview } from "@/components/shapes/ShapePreview";

export function StepShapeStyle() {
  const { t } = useLanguage();
  const { config, updateConfig, addCustomColor } = useButtonBuilder();
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [customColor, setCustomColor] = useState("#FF7A00");
  const [activeTab, setActiveTab] = useState<"shape" | "color" | "finish">(
    "shape",
  );

  const allColors = [
    ...defaultColors,
    ...config.customColors.map((color: string) => ({ name: "Custom", value: color })),
  ];

  const handleColorSelect = (color: string) => {
    updateConfig({ color });
    setShowColorPicker(false);
  };

  const handleCustomColorAdd = () => {
    addCustomColor(customColor);
    setShowColorPicker(false);
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

  const ButtonPreview = () => {
    const finishEffect = getFinishEffect(config.finish.id);

    return (
      <div className="relative w-32 h-32">
        <ShapePreview
          shapeId={config.shape.id}
          className={`w-full h-full transition-all duration-300 shadow-lg ${finishEffect} relative overflow-hidden`}
          style={{ backgroundColor: config.color }}
        />

        {/* Finish-specific effects */}
        {config.finish.id === "glossy" && (
          <div
            className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent pointer-events-none"
            style={{
              clipPath:
                config.shape.id === "round"
                  ? "circle(50%)"
                  : config.shape.id === "square"
                    ? "none"
                    : config.shape.id === "hexagon"
                      ? "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)"
                      : config.shape.id === "star"
                        ? "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)"
                        : config.shape.id === "heart"
                          ? "polygon(50% 90%, 20% 40%, 20% 20%, 35% 5%, 50% 20%, 65% 5%, 80% 20%, 80% 40%)"
                          : config.shape.id === "triangle"
                            ? "polygon(50% 0%, 0% 100%, 100% 100%)"
                            : config.shape.id === "diamond"
                              ? "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)"
                              : "none",
            }}
          ></div>
        )}

        {config.finish.id === "metallic" && (
          <div
            className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20 pointer-events-none"
            style={{
              clipPath:
                config.shape.id === "round"
                  ? "circle(50%)"
                  : config.shape.id === "square"
                    ? "none"
                    : config.shape.id === "hexagon"
                      ? "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)"
                      : config.shape.id === "star"
                        ? "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)"
                        : config.shape.id === "heart"
                          ? "polygon(50% 90%, 20% 40%, 20% 20%, 35% 5%, 50% 20%, 65% 5%, 80% 20%, 80% 40%)"
                          : config.shape.id === "triangle"
                            ? "polygon(50% 0%, 0% 100%, 100% 100%)"
                            : config.shape.id === "diamond"
                              ? "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)"
                              : "none",
            }}
          ></div>
        )}

        {/* Content preview */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-8 h-8 bg-white/30 rounded-full animate-pulse-slow"></div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
  <h2 className="font-cal-sans font-bold text-gray-900 dark:text-white text-[clamp(1.4rem,1rem+1.4vw,2.1rem)] leading-tight">
          {t("customize.style.title")}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          {t("customize.style.subtitle")
            .replace("{shapes}", shapes.length.toString())
            .replace("{finishes}", finishes.length.toString())}
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
              {t("customize.style.tabs.shape")} ({shapes.length})
            </button>
            <button
              onClick={() => setActiveTab("color")}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors duration-200 ${
                activeTab === "color"
                  ? "bg-white dark:bg-gray-700 text-primary shadow-sm"
                  : "text-gray-600 dark:text-gray-400"
              }`}
            >
              {t("customize.style.tabs.color")} ({allColors.length})
            </button>
            <button
              onClick={() => setActiveTab("finish")}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors duration-200 ${
                activeTab === "finish"
                  ? "bg-white dark:bg-gray-700 text-primary shadow-sm"
                  : "text-gray-600 dark:text-gray-400"
              }`}
            >
              {t("customize.style.tabs.finish")} ({finishes.length})
            </button>
          </div>

          {/* Shape Selection */}
          {activeTab === "shape" && (
            <div className="space-y-6">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                {t("customize.style.chooseShape")}
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
                      <ShapePreview
                        shapeId={shape.id}
                        className="w-8 h-8 bg-gradient-to-br from-primary/30 to-secondary-blue/30"
                      />
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
                  {t("customize.style.chooseColor")}
                </h3>
                <button
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  className="btn-secondary inline-flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {t("customize.style.addCustom")}
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
                      {t("customize.style.createCustomColor")}
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
                        {t("customize.style.addColor")}
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
                {t("customize.style.chooseFinish")}
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
            {t("customize.style.livePreview")}
          </h3>
          <div className="flex items-center justify-center">
            <ButtonPreview />
          </div>
          <div className="mt-6 text-center space-y-2">
            <div className="font-semibold text-gray-900 dark:text-white">
              {config.shape.name}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {config.finish.name} {t("customize.style.finish")}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-500">
              {t("customize.style.color")}: {config.color}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
