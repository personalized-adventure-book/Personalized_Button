"use client";

import { useState, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Type,
  Sparkles,
  Upload,
  Search,
  X,
  Move,
  ImageIcon,
  Heart,
  Star,
  Home,
  Settings,
  User,
  Phone,
  Mail,
  Camera,
  Music,
  Bell,
  Clock,
  Calendar,
  MapPin,
  Gift,
  Coffee,
  Car,
  Plane,
  Gamepad2,
  Headphones,
  Smartphone,
  Wifi,
  Battery,
  Sun,
  Moon,
  Cloud,
  Zap,
  Shield,
  Lock,
  Key,
  Flag,
  Trophy,
  Target,
  Bookmark,
  Tag,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Send,
  Download,
  Save,
  Edit,
  Trash,
  Plus,
  Minus,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Eye,
  EyeOff,
  Filter,
  MoreHorizontal,
  Menu,
  Grid,
  List,
  Map,
  Navigation,
  Compass,
  Globe,
  Monitor,
  Tv,
  Radio,
  Speaker,
  Bluetooth,
  Database,
  Server,
  HardDrive,
  Cpu,
  Printer,
  Mouse,
  Keyboard,
  Tablet,
  Watch,
  Briefcase,
  ShoppingCart,
  CreditCard,
  DollarSign,
  PieChart,
  BarChart,
  TrendingUp,
  TrendingDown,
  Activity,
  Layers,
  Package,
  Truck,
  Anchor,
  Award,
  Book,
  Calculator,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  HelpCircle,
  Lightbulb,
  Flame,
  Snowflake,
  Droplets,
  Wind,
  Thermometer,
  Umbrella,
  Mountain,
  Flower,
  Leaf,
  Apple,
  Pizza,
  Utensils,
  Shirt,
  Crown,
  Glasses,
  Gem,
  Diamond,
  Coins,
  Wallet,
  Building,
  Factory,
  School,
  Church,
  Store,
  Train,
  Bus,
  Bike,
  Ship,
  Rocket,
  Satellite,
  Film,
  Image,
  Palette,
  Brush,
  Scissors,
  Ruler,
  Paperclip,
  FileText,
  Folder,
  Archive,
  Inbox,
  Share,
  Link,
  Copy,
  Clipboard,
  RotateCcw,
  RotateCw,
  RefreshCw,
  Power,
} from "lucide-react";
import React from "react";
import { useButtonBuilder } from "@/hooks/useButtonBuilder";
import { ShapePreview } from "@/components/shapes/ShapePreview";
import type { ButtonConfig } from "@/types/button-builder-expanded";

interface StepLabelIconProps {
  config?: ButtonConfig;
}

export function StepLabelIcon({ config: propConfig }: StepLabelIconProps) {
  const { t } = useLanguage();
  const { config, updateConfig, uploadImage, updateElementPosition } = useButtonBuilder();

  const [activeTab, setActiveTab] = useState<"text" | "icons" | "upload">("text");
  const [iconSearch, setIconSearch] = useState("");
  const [dragActive, setDragActive] = useState(false);

  // Simple drag state
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const previewRef = useRef<HTMLDivElement>(null);
  const [showCustomInput, setShowCustomInput] = React.useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        uploadImage(file, true);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      uploadImage(file, true);
    }
  };

  // Simple and smooth drag functions
  const startDrag = (element: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!previewRef.current) return;

    setDragging(element);

    const preview = previewRef.current;
    let currentPosition = { x: 0, y: 0 };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = preview.getBoundingClientRect();
      const newX = e.clientX - rect.left;
      const newY = e.clientY - rect.top;

      // Convert to percentage
      const percentX = Math.max(5, Math.min(95, (newX / rect.width) * 100));
      const percentY = Math.max(5, Math.min(95, (newY / rect.height) * 100));

      // Store current position in local variable
      currentPosition = { x: percentX, y: percentY };

      // Store as offset for immediate visual feedback
      setDragOffset({ x: percentX, y: percentY });
    };

    const handleMouseUp = () => {
      // Always save the final position
      updateElementPosition(element as any, currentPosition);

      setDragging(null);
      setDragOffset({ x: 0, y: 0 });

      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // Get current position for display
  const getCurrentPosition = (element: string) => {
    if (dragging === element && dragOffset.x !== 0) {
      return { x: dragOffset.x, y: dragOffset.y };
    }

    switch (element) {
      case "label":
        return config.labelPosition;
      case "icon":
        return config.iconPosition;
      case "image":
        return config.uploadedImage?.position || { x: 50, y: 50 };
      default:
        return { x: 50, y: 50 };
    }
  };

  const renderIcon = (iconName: string, size?: number) => {
    // If a specific size (user-controlled) is provided we honor that.
    // Otherwise we let the icon scale with viewport so on very wide screens it isn't tiny.
    const iconSize = size || 0; // 0 => use responsive clamp sizing

    const iconMap: Record<string, any> = {
      // Basic
      Heart,
      Star,
      Home,
      Settings,
      User,
      Phone,
      Mail,
      Camera,
      Music,
      Bell,
      Clock,
      Calendar,
      MapPin,
      Gift,
      Coffee,
      // Transport
      Car,
      Plane,
      Truck,
      Train,
      Bus,
      Bike,
      Ship,
      Rocket,
      Satellite,
      // Technology
      Gamepad2,
      Headphones,
      Smartphone,
      Wifi,
      Battery,
      Monitor,
      Tv,
      Radio,
      Speaker,
      Bluetooth,
      Database,
      Server,
      HardDrive,
      Cpu,
      Printer,
      Mouse,
      Keyboard,
      Tablet,
      Watch,
      // Weather & Nature
      Sun,
      Moon,
      Cloud,
      Zap,
      Thermometer,
      Umbrella,
      Mountain,
      Flower,
      Leaf,
      Wind,
      Droplets,
      Snowflake,
      Flame,
      // Security
      Shield,
      Lock,
      Key,
      Eye,
      EyeOff,
      // Actions
      Play,
      Pause,
      Volume2,
      VolumeX,
      Mic,
      MicOff,
      Download,
      Save,
      Edit,
      Trash,
      Plus,
      Minus,
      // Social
      ThumbsUp,
      ThumbsDown,
      MessageCircle,
      Send,
      Share,
      Link,
      Copy,
      // Business
      Briefcase,
      ShoppingCart,
      CreditCard,
      DollarSign,
      PieChart,
      BarChart,
      TrendingUp,
      TrendingDown,
      Activity,
      // Navigation
      Search,
      Filter,
      Menu,
      Grid,
      List,
      Map,
      Navigation,
      Compass,
      Globe,
      // Status
      CheckCircle,
      XCircle,
      AlertCircle,
      Info,
      HelpCircle,
      Flag,
      Trophy,
      Target,
      Bookmark,
      Tag,
      // Food
      Apple,
      Pizza,
      Utensils,
      // Fashion
      Shirt,
      Crown,
      Glasses,
      Gem,
      Diamond,
      // Finance
      Coins,
      Wallet,
      // Buildings
      Building,
      Factory,
      School,
      Church,
      Store,
      // Media
      Film,
      Image,
      Palette,
      Brush,
      // Tools
      Scissors,
      Ruler,
      Paperclip,
      // Files
      FileText,
      Folder,
      Archive,
      Inbox,
      // System
      Power,
      RefreshCw,
      RotateCw,
      RotateCcw,
      Clipboard,
      // Learning
      Book,
      Calculator,
      Lightbulb,
      // Misc
      Anchor,
      Award,
      Layers,
      Package,
    };

    const IconComponent = iconMap[iconName];
    if (IconComponent) {
      if (iconSize > 0) {
        return <IconComponent style={{ width: iconSize, height: iconSize }} />;
      }
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
        style={iconSize > 0 ? { width: iconSize, height: iconSize } : { width: 'clamp(1.25rem, 1.2vw + 0.75rem, 4rem)', height: 'clamp(1.25rem, 1.2vw + 0.75rem, 4rem)' }}
        className="bg-gray-300 rounded flex items-center justify-center text-xs text-gray-600 transition-all"
      >
        {iconName?.charAt(0)?.toUpperCase() || "?"}
      </div>
    );
  };

  const getFinishClasses = (finishId: string) => {
    const finishClasses: Record<string, string> = {
      matte: "",
      glossy: "bg-gradient-to-br from-white/20 to-transparent",
      satin: "bg-gradient-to-br from-white/10 to-black/10",
      metallic: "bg-gradient-to-br from-white/30 via-transparent to-black/20",
      pearl: "bg-gradient-to-br from-white/40 via-pink-100/20 to-purple-100/20",
      textured: "bg-gradient-to-br from-white/10 to-black/10",
      "carbon-fiber": "bg-gradient-to-br from-gray-600/50 to-black/30",
      "soft-touch": "bg-gradient-to-br from-white/5 to-black/5",
    };
    return finishClasses[finishId] || "";
  };

  const getFinishStyles = (finishId: string) => {
    const finishStyles: Record<string, React.CSSProperties> = {
      matte: {},
      glossy: { filter: "brightness(1.1)" },
      satin: { filter: "brightness(1.05)" },
      metallic: { filter: "brightness(1.2) contrast(1.1)" },
      pearl: { filter: "brightness(1.15) hue-rotate(10deg)" },
      textured: { filter: "contrast(1.05)" },
      "carbon-fiber": { filter: "contrast(1.1) brightness(0.95)" },
      "soft-touch": { filter: "brightness(0.98)" },
    };
    return finishStyles[finishId] || {};
  };

  const iconCategories = {
    basic: [
      "Heart",
      "Star",
      "Home",
      "Settings",
      "User",
      "Phone",
      "Mail",
      "Bell",
      "Clock",
      "Calendar",
      "MapPin",
    ],
    technology: [
      "Smartphone",
      "Wifi",
      "Battery",
      "Monitor",
      "Headphones",
      "Camera",
      "Gamepad2",
      "Bluetooth",
      "Database",
    ],
    transport: [
      "Car",
      "Plane",
      "Truck",
      "Train",
      "Bus",
      "Bike",
      "Ship",
      "Rocket",
    ],
    nature: ["Sun", "Moon", "Cloud", "Flower", "Leaf", "Mountain"],
    social: ["ThumbsUp", "MessageCircle", "Send", "Share", "Gift"],
    business: [
      "Briefcase",
      "ShoppingCart",
      "CreditCard",
      "DollarSign",
      "PieChart",
      "Trophy",
    ],
    media: ["Music", "Play", "Film", "Image", "Volume2"], // Removed duplicate Camera
    tools: ["Edit", "Save", "Download", "Scissors", "Ruler", "Calculator"],
    food: ["Apple", "Pizza", "Coffee", "Utensils"], // Coffee only in food category
    security: ["Shield", "Lock", "Key", "Eye", "Flag"],
  };

  const allIcons = Array.from(new Set(Object.values(iconCategories).flat())); // Remove duplicates
  const filteredIcons = allIcons.filter((icon) =>
    icon.toLowerCase().includes(iconSearch.toLowerCase()),
  );

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
  <h2 className="font-cal-sans font-bold text-gray-900 dark:text-white text-[clamp(1.4rem,1rem+1.4vw,2.1rem)] leading-tight">
          {t("customize.label.title")}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          {t("customize.label.subtitle")}
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
              <label className="font-semibold text-lg text-gray-900 dark:text-white">
                Button Text
              </label>
              <div className="grid grid-cols-2 gap-2">
                {["I Love You", "Focus Mode", "Do Not Disturb", "Good Luck", "Stay Strong", "Smile!", "Custom..."].map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={`px-3 py-2 rounded-lg border transition-colors duration-150 font-medium text-sm ${config.label === option ? "bg-primary text-white border-primary" : "bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 hover:border-primary/50"}`}
                    onClick={() => {
                      if (option === "Custom...") {
                        updateConfig({ label: "" });
                        setShowCustomInput(true);
                      } else {
                        updateConfig({ label: option });
                        setShowCustomInput(false);
                      }
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
              {showCustomInput && (
                <input
                  type="text"
                  value={config.label}
                  onChange={(e) =>
                    updateConfig({ label: e.target.value.slice(0, 12) })
                  }
                  placeholder="Enter custom label (max 12 chars)"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 mt-2"
                />
              )}

              {/* Text Size Control */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Text Size: {config.labelSize}px
                </label>
                <input
                  type="range"
                  min="10"
                  max="24"
                  value={config.labelSize}
                  onChange={(e) =>
                    updateConfig({ labelSize: parseInt(e.target.value) })
                  }
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>Small</span>
                  <span>Large</span>
                </div>
              </div>

              {config.label && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center space-x-2 text-blue-700 dark:text-blue-300 mb-2">
                    <Move className="w-4 h-4" />
                    <span className="font-medium">Text Positioning</span>
                  </div>
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    Click and drag the text on the preview to position it
                    exactly where you want.
                  </p>
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

                <div className="text-sm text-gray-600 dark:text-gray-400">
                  200+ icons available across categories: Basic, Technology,
                  Transport, Nature, Social, Business, Media, Tools, Food &
                  Security
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

                {/* Icon Size Control */}
                {config.icon && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Icon Size: {config.iconSize}px
                    </label>
                    <input
                      type="range"
                      min="16"
                      max="48"
                      value={config.iconSize}
                      onChange={(e) =>
                        updateConfig({ iconSize: parseInt(e.target.value) })
                      }
                      className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>Small</span>
                      <span>Large</span>
                    </div>
                  </div>
                )}
              </div>

              {config.icon && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center space-x-2 text-blue-700 dark:text-blue-300 mb-2">
                    <Move className="w-4 h-4" />
                    <span className="font-medium">Icon Positioning</span>
                  </div>
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    Click and drag the icon on the preview to position it
                    exactly where you want.
                  </p>
                </div>
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

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={config.uploadedImage.keepBackground}
                      onChange={(e) =>
                        updateConfig({
                          uploadedImage: {
                            ...config.uploadedImage,
                            keepBackground: e.target.checked,
                          },
                        })
                      }
                      className="rounded"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Keep background
                    </span>
                  </label>

                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center space-x-2 text-blue-700 dark:text-blue-300 mb-2">
                      <Move className="w-4 h-4" />
                      <span className="font-medium">Image Positioning</span>
                    </div>
                    <p className="text-sm text-blue-600 dark:text-blue-400">
                      Click and drag the image on the preview to position it
                      exactly where you want.
                    </p>
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
            <div className="relative w-48 h-48">
              <div
                ref={previewRef}
                className="w-full h-full relative select-none"
              >
                <ShapePreview
                  shapeId={config.shape.id}
                  className={`w-full h-full transition-all duration-300 shadow-lg ${getFinishClasses(config.finish.id)}`}
                  style={{
                    backgroundColor: config.color,
                    ...getFinishStyles(config.finish.id),
                  }}
                />

                {/* Text Label */}
                {config.label && (
                  <div
                    className={`absolute text-white font-medium select-none transform -translate-x-1/2 -translate-y-1/2 cursor-move transition-all duration-100 px-2 py-1 rounded text-center leading-tight ${
                      dragging === "label"
                        ? "ring-2 ring-blue-400 bg-blue-500/30 shadow-lg scale-110"
                        : "hover:ring-2 hover:ring-white/30 hover:bg-white/10"
                    }`}
                    style={{
                      left: `${getCurrentPosition("label").x}%`,
                      top: `${getCurrentPosition("label").y}%`,
                      fontSize: `${config.labelSize}px`,
                      maxWidth: "96%",
                      wordWrap: "break-word",
                      overflowWrap: "break-word",
                      lineHeight: "1.2",
                      whiteSpace: "pre-wrap",
                    }}
                    onMouseDown={(e) => startDrag("label", e)}
                  >
                    {config.label}
                  </div>
                )}

                {/* Icon */}
                {config.icon && (
                  <div
                    className={`absolute text-white transform -translate-x-1/2 -translate-y-1/2 cursor-move transition-all duration-100 p-2 rounded ${
                      dragging === "icon"
                        ? "ring-2 ring-blue-400 bg-blue-500/30 shadow-lg scale-110"
                        : "hover:ring-2 hover:ring-white/30 hover:bg-white/10"
                    }`}
                    style={{
                      left: `${getCurrentPosition("icon").x}%`,
                      top: `${getCurrentPosition("icon").y}%`,
                    }}
                    onMouseDown={(e) => startDrag("icon", e)}
                  >
                    {renderIcon(config.icon, config.iconSize)}
                  </div>
                )}

                {/* Uploaded Image */}
                {config.uploadedImage && (
                  <div
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-move transition-all duration-100 rounded ${
                      dragging === "image"
                        ? "ring-2 ring-blue-400 bg-blue-500/30 shadow-lg scale-110"
                        : "hover:ring-2 hover:ring-white/30"
                    }`}
                    style={{
                      left: `${getCurrentPosition("image").x}%`,
                      top: `${getCurrentPosition("image").y}%`,
                      width: `${config.uploadedImage.size.width}px`,
                      height: `${config.uploadedImage.size.height}px`,
                    }}
                    onMouseDown={(e) => startDrag("image", e)}
                  >
                    <div className="w-full h-full bg-white/30 rounded flex items-center justify-center">
                      <ImageIcon className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Active drag feedback */}
          {dragging && (
            <div className="mt-4 text-center bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
              <div className="flex items-center justify-center space-x-2 text-green-700 dark:text-green-300">
                <Move className="w-4 h-4 animate-pulse" />
                <span className="font-medium">Dragging {dragging}...</span>
              </div>
              <div className="text-xs mt-1 text-green-600 dark:text-green-400">
                Move your mouse to position, release to place
              </div>
            </div>
          )}

          <div className="mt-6 text-center space-y-2">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Shape: {config.shape.name} • Color: {config.color} • Finish:{" "}
              {config.finish.name}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {config.label || "No text"} •{" "}
              {config.icon ? `Icon: ${config.icon}` : "No icon"}
            </div>
            {config.uploadedImage && (
              <div className="text-xs text-gray-500 dark:text-gray-500">
                + Custom image uploaded
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
