"use client";

import { useState, useRef, useCallback } from "react";
import {
  Upload,
  Search,
  X,
  Move,
  ImageIcon,
  Type,
  Sparkles,
} from "lucide-react";
import { useButtonBuilderExpanded } from "@/hooks/useButtonBuilderExpanded";
import { iconCategories } from "@/types/button-builder-expanded";

// Import all icons dynamically for the expanded set
import * as LucideIcons from "lucide-react";

export function StepLabelIconExpanded() {
  const { config, updateConfig, uploadImage, updateElementPosition } =
    useButtonBuilderExpanded();
  const [activeTab, setActiveTab] = useState<"text" | "icons" | "upload">(
    "text",
  );
  const [iconSearch, setIconSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("essential");
  const [dragActive, setDragActive] = useState(false);
  const [isDragging, setIsDragging] = useState<string | null>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const file = e.dataTransfer.files[0];
        if (file.type.startsWith("image/")) {
          uploadImage(file, true);
        }
      }
    },
    [uploadImage],
  );

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      uploadImage(file, true);
    }
  };

  const handleElementDragStart = (element: string) => {
    setIsDragging(element);
  };

  const handleElementDragEnd = () => {
    setIsDragging(null);
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    if (!buttonRef.current || !isDragging) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    updateElementPosition(isDragging as any, {
      x: Math.max(5, Math.min(95, x)),
      y: Math.max(5, Math.min(95, y)),
    });
    setIsDragging(null);
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

  const renderIcon = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName];
    if (IconComponent) {
      return (
        <IconComponent
          className="transition-all"
          style={{
            width: 'clamp(1.25rem, 1.2vw + 0.75rem, 4rem)',
            height: 'clamp(1.25rem, 1.2vw + 0.75rem, 4rem)'
          }}
        />
      );
    }
    return (
      <div
        className="bg-gray-300 rounded transition-all"
        style={{
          width: 'clamp(1.25rem, 1.2vw + 0.75rem, 4rem)',
            height: 'clamp(1.25rem, 1.2vw + 0.75rem, 4rem)'
        }}
      />
    );
  };

  const filteredIcons =
    iconCategories[selectedCategory as keyof typeof iconCategories]?.filter(
      (icon) => icon.toLowerCase().includes(iconSearch.toLowerCase()),
    ) || [];

  const ButtonPreview = () => {
    const shapeClass = getShapeClass(config.shape.id);

    return (
      <div className="relative">
        <div
          ref={buttonRef}
          className={`w-48 h-48 ${shapeClass} transition-all duration-300 shadow-lg relative overflow-hidden cursor-crosshair`}
          style={{ backgroundColor: config.color }}
          onClick={handleButtonClick}
        >
          {/* Text Label */}
          {config.label && (
            <div
              className={`absolute text-white font-medium text-sm select-none pointer-events-none transform -translate-x-1/2 -translate-y-1/2 ${
                isDragging === "label"
                  ? "ring-2 ring-white/50 bg-white/20 px-2 py-1 rounded"
                  : ""
              }`}
              style={{
                left: `${config.labelPosition.x}%`,
                top: `${config.labelPosition.y}%`,
              }}
            >
              {config.label}
            </div>
          )}

          {/* Icon */}
          {config.icon && (
            <div
              className={`absolute text-white transform -translate-x-1/2 -translate-y-1/2 ${
                isDragging === "icon"
                  ? "ring-2 ring-white/50 bg-white/20 p-2 rounded"
                  : ""
              }`}
              style={{
                left: `${config.iconPosition.x}%`,
                top: `${config.iconPosition.y}%`,
              }}
            >
              {renderIcon(config.icon)}
            </div>
          )}

          {/* Uploaded Image */}
          {config.uploadedImage && (
            <div
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${
                isDragging === "image" ? "ring-2 ring-white/50" : ""
              }`}
              style={{
                left: `${config.uploadedImage.position.x}%`,
                top: `${config.uploadedImage.position.y}%`,
                width: `${config.uploadedImage.size.width}px`,
                height: `${config.uploadedImage.size.height}px`,
              }}
            >
              <div className="w-full h-full bg-white/30 rounded flex items-center justify-center">
                <ImageIcon className="w-4 h-4 text-white" />
              </div>
            </div>
          )}

          {/* Drag instruction */}
          {isDragging && (
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <div className="text-white text-center">
                <Move className="w-8 h-8 mx-auto mb-2" />
                <div className="text-sm">Click to position {isDragging}</div>
              </div>
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
          Add Text, Icons & Graphics
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Personalize your button with text, over 200 icons, or your own images.
          Drag elements to position them exactly where you want.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Configuration Panel */}
        <div className="space-y-6">
          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setActiveTab("text")}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md font-medium transition-colors duration-200 ${
                activeTab === "text"
                  ? "bg-white dark:bg-gray-700 text-primary shadow-sm"
                  : "text-gray-600 dark:text-gray-400"
              }`}
            >
              <Type className="w-4 h-4" />
              <span>Text</span>
            </button>
            <button
              onClick={() => setActiveTab("icons")}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md font-medium transition-colors duration-200 ${
                activeTab === "icons"
                  ? "bg-white dark:bg-gray-700 text-primary shadow-sm"
                  : "text-gray-600 dark:text-gray-400"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Icons</span>
            </button>
            <button
              onClick={() => setActiveTab("upload")}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md font-medium transition-colors duration-200 ${
                activeTab === "upload"
                  ? "bg-white dark:bg-gray-700 text-primary shadow-sm"
                  : "text-gray-600 dark:text-gray-400"
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>Upload</span>
            </button>
          </div>

          {/* Text Tab */}
          {activeTab === "text" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="font-semibold text-lg text-gray-900 dark:text-white">
                  Button Text
                </label>
                <span
                  className={`text-sm ${config.label.length > 12 ? "text-red-500" : "text-gray-500 dark:text-gray-400"}`}
                >
                  {config.label.length}/12
                </span>
              </div>
              <input
                type="text"
                value={config.label}
                onChange={(e) =>
                  updateConfig({ label: e.target.value.slice(0, 12) })
                }
                placeholder="e.g. Focus Mode"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />

              {config.label && (
                <div className="mt-4">
                  <button
                    onClick={() => handleElementDragStart("label")}
                    className={`btn-secondary inline-flex items-center ${
                      isDragging === "label" ? "bg-primary text-white" : ""
                    }`}
                    onMouseUp={handleElementDragEnd}
                  >
                    <Move className="w-4 h-4 mr-2" />
                    {isDragging === "label" ? "Click to Position" : "Move Text"}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Icons Tab */}
          {activeTab === "icons" && (
            <div className="space-y-4">
              <div className="space-y-3">
                <label className="font-semibold text-lg text-gray-900 dark:text-white">
                  Choose Icon
                </label>

                {/* Category Selection */}
                <div className="flex flex-wrap gap-2">
                  {Object.keys(iconCategories).map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-3 py-1 text-xs rounded-full transition-colors duration-200 ${
                        selectedCategory === category
                          ? "bg-primary text-white"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {category.charAt(0).toUpperCase() +
                        category.slice(1).replace("_", " ")}
                    </button>
                  ))}
                </div>

                {/* Search Icons */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={iconSearch}
                    onChange={(e) => setIconSearch(e.target.value)}
                    placeholder="Search icons..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  />
                </div>

                {/* Icons Grid */}
                <div className="grid grid-cols-6 gap-2 max-h-64 overflow-y-auto p-2 border border-gray-200 dark:border-gray-700 rounded-lg">
                  {filteredIcons.map((iconName) => (
                    <button
                      key={iconName}
                      onClick={() => updateConfig({ icon: iconName })}
                      className={`rounded-lg border transition-all duration-200 flex items-center justify-center ${
                        config.icon === iconName
                          ? "border-primary bg-primary/10 text-primary shadow-sm"
                          : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-primary/50 hover:text-primary"
                      }`}
                      style={{
                        width: 'clamp(3rem, 2.2vw + 2rem, 5rem)',
                        height: 'clamp(3rem, 2.2vw + 2rem, 5rem)'
                      }}
                      title={iconName}
                    >
                      {renderIcon(iconName)}
                    </button>
                  ))}
                </div>
              </div>

              {config.icon && (
                <button
                  onClick={() => handleElementDragStart("icon")}
                  className={`btn-secondary inline-flex items-center ${
                    isDragging === "icon" ? "bg-primary text-white" : ""
                  }`}
                  onMouseUp={handleElementDragEnd}
                >
                  <Move className="w-4 h-4 mr-2" />
                  {isDragging === "icon" ? "Click to Position" : "Move Icon"}
                </button>
              )}
            </div>
          )}

          {/* Upload Tab */}
          {activeTab === "upload" && (
            <div className="space-y-4">
              <label className="font-semibold text-lg text-gray-900 dark:text-white">
                Upload Your Image
              </label>

              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
                  dragActive
                    ? "border-primary bg-primary/5 dark:bg-primary/10"
                    : "border-gray-300 dark:border-gray-600 hover:border-primary/50"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Drag & drop your image here, or{" "}
                  <label className="text-primary hover:underline cursor-pointer">
                    browse files
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </label>
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Supports JPG, PNG, SVG up to 10MB
                </p>
              </div>

              {config.uploadedImage && (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <ImageIcon className="w-6 h-6 text-primary" />
                    <span className="text-sm text-gray-900 dark:text-white">
                      Image uploaded
                    </span>
                    <button
                      onClick={() => updateConfig({ uploadedImage: null })}
                      className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-1 rounded"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={config.uploadedImage.keepBackground}
                        onChange={(e) => {
                          if (config.uploadedImage) {
                            updateConfig({
                              uploadedImage: {
                                ...config.uploadedImage,
                                id: config.uploadedImage.id || '',
                                file: config.uploadedImage.file || '',
                                keepBackground: e.target.checked,
                              },
                            });
                          }
                        }}
                        className="rounded"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Keep background
                      </span>
                    </label>

                    <button
                      onClick={() => handleElementDragStart("image")}
                      className={`btn-secondary inline-flex items-center ${
                        isDragging === "image" ? "bg-primary text-white" : ""
                      }`}
                      onMouseUp={handleElementDragEnd}
                    >
                      <Move className="w-4 h-4 mr-2" />
                      {isDragging === "image"
                        ? "Click to Position"
                        : "Move Image"}
                    </button>
                  </div>
                </div>
              )}
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
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {config.label || "No text"} •{" "}
              {config.icon ? `Icon: ${config.icon}` : "No icon"}
            </div>
            {config.uploadedImage && (
              <div className="text-xs text-gray-500 dark:text-gray-500">
                + Custom image uploaded
              </div>
            )}
            <div className="text-xs text-gray-500 dark:text-gray-500">
              {isDragging
                ? `Click on button to position ${isDragging}`
                : 'Click "Move" buttons to reposition elements'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
