"use client";

import { useState } from "react";
import { Info, Zap, Leaf, Shield, DollarSign } from "lucide-react";
import { useButtonBuilderEnhanced } from "@/hooks/useButtonBuilderEnhanced";
import {
  buttonSizes,
  materials,
  textures,
} from "@/types/button-builder-enhanced";
import { shapes } from "@/types/button-builder";

export function StepPhysicalDesign() {
  const { config, updateConfig } = useButtonBuilderEnhanced();
  const [activeTab, setActiveTab] = useState<
    "shape" | "size" | "material" | "texture"
  >("shape");

  const tabs = [
    { id: "shape", name: "Shape", icon: "🔵" },
    { id: "size", name: "Size", icon: "📏" },
    { id: "material", name: "Material", icon: "🏗️" },
    { id: "texture", name: "Texture", icon: "✋" },
  ];

  const getDurabilityIcon = (level: number) => {
    if (level >= 5) return <Shield className="w-4 h-4 text-green-500" />;
    if (level >= 4) return <Shield className="w-4 h-4 text-blue-500" />;
    if (level >= 3) return <Shield className="w-4 h-4 text-yellow-500" />;
    return <Shield className="w-4 h-4 text-gray-400" />;
  };

  const ButtonPreview = () => {
    const shapeClass =
      config.shape.id === "round"
        ? "rounded-full"
        : config.shape.id === "square"
          ? "rounded-lg"
          : "clip-path-hexagon";

    const sizeMultiplier = config.size.diameter / 45; // Standard is 45mm
    const baseSize = 120 * sizeMultiplier;

    return (
      <div className="flex items-center justify-center p-8">
        <div className="relative">
          <div
            className={`${shapeClass} transition-all duration-300 shadow-lg border-2 border-gray-200 dark:border-gray-700`}
            style={{
              width: `${baseSize}px`,
              height: `${baseSize}px`,
              backgroundColor: config.material.colors[0] || "#FF7A00",
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-1/3 h-1/3 bg-white/30 rounded-full animate-pulse-slow"></div>
            </div>
          </div>

          {/* Size indicator */}
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-center">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {config.size.diameter}mm × {config.size.height}mm
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {config.size.weight}g
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto text-lg">
          Design the physical characteristics of your button. Each choice
          affects both aesthetics and functionality.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Configuration Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md font-medium transition-colors duration-200 ${
                  activeTab === tab.id
                    ? "bg-white dark:bg-gray-700 text-primary shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </div>

          {/* Shape Selection */}
          {activeTab === "shape" && (
            <div className="space-y-6">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                Choose Your Button Shape
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                {shapes.map((shape) => (
                  <button
                    key={shape.id}
                    onClick={() => updateConfig({ shape })}
                    className={`p-6 border rounded-lg transition-all duration-200 ${
                      config.shape.id === shape.id
                        ? "border-primary bg-primary/5 dark:bg-primary/10 ring-2 ring-primary/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-primary/50"
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-3">
                      <div
                        className={`w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary-blue/20 ${
                          shape.id === "round"
                            ? "rounded-full"
                            : shape.id === "square"
                              ? "rounded-lg"
                              : "clip-path-hexagon"
                        }`}
                      ></div>
                      <div className="text-center">
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {shape.name}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {shape.id === "round" && "Classic and timeless"}
                          {shape.id === "square" && "Modern and minimalist"}
                          {shape.id === "hexagon" && "Unique and eye-catching"}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selection */}
          {activeTab === "size" && (
            <div className="space-y-6">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                Choose Your Button Size
              </h3>
              <div className="space-y-4">
                {buttonSizes.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => updateConfig({ size })}
                    className={`w-full p-4 border rounded-lg text-left transition-all duration-200 ${
                      config.size.id === size.id
                        ? "border-primary bg-primary/5 dark:bg-primary/10"
                        : "border-gray-200 dark:border-gray-700 hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div
                          className="bg-primary/20 rounded-full flex items-center justify-center"
                          style={{
                            width: `${Math.max(32, size.diameter * 0.5)}px`,
                            height: `${Math.max(32, size.diameter * 0.5)}px`,
                          }}
                        >
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {size.name}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {size.diameter}mm × {size.height}mm • {size.weight}g
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        {size.price > 0 && (
                          <div className="text-primary font-semibold">
                            +${size.price}
                          </div>
                        )}
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {size.id === "mini" && "Discreet"}
                          {size.id === "compact" && "Portable"}
                          {size.id === "standard" && "Balanced"}
                          {size.id === "large" && "Prominent"}
                          {size.id === "xl" && "Statement"}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Material Selection */}
          {activeTab === "material" && (
            <div className="space-y-6">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                Choose Your Material
              </h3>
              <div className="space-y-4">
                {materials.map((material) => (
                  <button
                    key={material.id}
                    onClick={() => updateConfig({ material })}
                    className={`w-full p-4 border rounded-lg text-left transition-all duration-200 ${
                      config.material.id === material.id
                        ? "border-primary bg-primary/5 dark:bg-primary/10"
                        : "border-gray-200 dark:border-gray-700 hover:border-primary/50"
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="flex space-x-1">
                            {material.colors.slice(0, 3).map((color, index) => (
                              <div
                                key={index}
                                className="w-4 h-4 rounded-full border border-gray-300"
                                style={{ backgroundColor: color }}
                              ></div>
                            ))}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                              <span>{material.name}</span>
                              {material.premium && (
                                <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                                  Premium
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {material.description}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          {material.price > 0 && (
                            <div className="text-primary font-semibold">
                              +${material.price}
                            </div>
                          )}
                          <div className="flex items-center space-x-1">
                            {getDurabilityIcon(material.durability)}
                            <span className="text-xs text-gray-500">
                              Durability
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Texture Selection */}
          {activeTab === "texture" && (
            <div className="space-y-6">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                Choose Surface Texture
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {textures.map((texture) => (
                  <button
                    key={texture.id}
                    onClick={() => updateConfig({ texture })}
                    className={`p-4 border rounded-lg text-left transition-all duration-200 ${
                      config.texture.id === texture.id
                        ? "border-primary bg-primary/5 dark:bg-primary/10"
                        : "border-gray-200 dark:border-gray-700 hover:border-primary/50"
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {texture.name}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {texture.description}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-500 dark:text-gray-500">
                          {texture.tactileFeedback} feedback
                        </div>
                        {texture.price > 0 && (
                          <div className="text-primary font-semibold text-sm">
                            +${texture.price}
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Preview Panel */}
        <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6">
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-6 text-center">
            Live Preview
          </h3>

          <ButtonPreview />

          <div className="mt-6 space-y-4">
            <div className="text-center">
              <div className="font-semibold text-gray-900 dark:text-white">
                {config.shape.name} {config.size.name}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {config.material.name} • {config.texture.name}
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Dimensions:
                </span>
                <span className="text-gray-900 dark:text-white">
                  {config.size.diameter} × {config.size.height}mm
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Weight:
                </span>
                <span className="text-gray-900 dark:text-white">
                  {config.size.weight}g
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Durability:
                </span>
                <div className="flex items-center space-x-1">
                  {getDurabilityIcon(config.material.durability)}
                  <span className="text-gray-900 dark:text-white">
                    {config.material.durability}/5
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
