"use client";

import { useState } from "react";
import { ChevronDown, Plus, X } from "lucide-react";
import { useButtonBuilderEnhanced } from "@/hooks/useButtonBuilderEnhanced";
import { useLanguage } from "@/contexts/LanguageContext";

const purposeCategories = {
  productivity: {
    name: "Productivity & Focus",
    color: "from-blue-500 to-blue-600",
    purposes: [
      {
        id: "focus-mode",
        name: "Deep Focus Mode",
        description: "Eliminate distractions during work sessions",
        icon: "🎯",
      },
      {
        id: "meeting-mode",
        name: "Meeting Mode",
        description: "Quick setup for video calls and meetings",
        icon: "📹",
      },
      {
        id: "break-reminder",
        name: "Break Reminder",
        description: "Healthy break intervals throughout the day",
        icon: "⏰",
      },
      {
        id: "project-switch",
        name: "Project Switching",
        description: "Quickly change between different work projects",
        icon: "🔄",
      },
    ],
  },
  entertainment: {
    name: "Entertainment & Leisure",
    color: "from-purple-500 to-purple-600",
    purposes: [
      {
        id: "movie-night",
        name: "Movie Night",
        description: "Perfect ambiance for watching films",
        icon: "🎬",
      },
      {
        id: "gaming-mode",
        name: "Gaming Mode",
        description: "Immersive lighting for gaming sessions",
        icon: "🎮",
      },
      {
        id: "reading-light",
        name: "Reading Light",
        description: "Comfortable lighting for reading",
        icon: "📚",
      },
      {
        id: "music-sync",
        name: "Music Sync",
        description: "Lights that respond to your music",
        icon: "🎵",
      },
    ],
  },
  lifestyle: {
    name: "Lifestyle & Wellness",
    color: "from-green-500 to-green-600",
    purposes: [
      {
        id: "meditation",
        name: "Meditation",
        description: "Calming atmosphere for mindfulness",
        icon: "🧘",
      },
      {
        id: "wake-up",
        name: "Gentle Wake-up",
        description: "Natural light alarm for better mornings",
        icon: "🌅",
      },
      {
        id: "sleep-mode",
        name: "Sleep Mode",
        description: "Relaxing wind-down routine",
        icon: "😴",
      },
      {
        id: "workout",
        name: "Workout Mode",
        description: "Energizing light for exercise",
        icon: "💪",
      },
    ],
  },
  social: {
    name: "Social & Events",
    color: "from-orange-500 to-orange-600",
    purposes: [
      {
        id: "party-scene",
        name: "Party Scene",
        description: "Dynamic lighting for celebrations",
        icon: "🎉",
      },
      {
        id: "dinner-party",
        name: "Dinner Party",
        description: "Elegant ambiance for dining",
        icon: "🍽️",
      },
      {
        id: "date-night",
        name: "Date Night",
        description: "Romantic lighting setup",
        icon: "💕",
      },
      {
        id: "presentation",
        name: "Presentation Mode",
        description: "Professional lighting for presentations",
        icon: "📊",
      },
    ],
  },
  smart_home: {
    name: "Smart Home & Automation",
    color: "from-indigo-500 to-indigo-600",
    purposes: [
      {
        id: "security-alert",
        name: "Security Alert",
        description: "Visual notifications for security events",
        icon: "🔐",
      },
      {
        id: "doorbell",
        name: "Doorbell Indicator",
        description: "Visual doorbell notification",
        icon: "🔔",
      },
      {
        id: "weather-info",
        name: "Weather Info",
        description: "Color-coded weather updates",
        icon: "🌤️",
      },
      {
        id: "smart-scenes",
        name: "Smart Scenes",
        description: "Control multiple smart home scenes",
        icon: "🏠",
      },
    ],
  },
};

const usagePatterns = [
  { id: "daily", name: "Daily Use", description: "Multiple times per day" },
  { id: "weekly", name: "Weekly Use", description: "Few times per week" },
  {
    id: "occasional",
    name: "Occasional",
    description: "Special occasions only",
  },
  {
    id: "seasonal",
    name: "Seasonal",
    description: "Specific seasons or events",
  },
];

const environments = [
  { id: "home-office", name: "Home Office", icon: "🏠" },
  { id: "bedroom", name: "Bedroom", icon: "🛏️" },
  { id: "living-room", name: "Living Room", icon: "🛋️" },
  { id: "kitchen", name: "Kitchen", icon: "🍳" },
  { id: "workplace", name: "Workplace", icon: "🏢" },
  { id: "studio", name: "Studio/Creative Space", icon: "🎨" },
];

export function StepPurposeEnhanced() {
  const { config, updateConfig } = useButtonBuilderEnhanced();
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customPurposes, setCustomPurposes] = useState<string[]>([]);
  const [newCustomPurpose, setNewCustomPurpose] = useState("");

  const handlePurposeSelect = (categoryId: string, purposeId: string) => {
    const category =
      purposeCategories[categoryId as keyof typeof purposeCategories];
    const purpose = category.purposes.find((p) => p.id === purposeId);
    if (purpose) {
      updateConfig({
        purpose: { id: purpose.id, name: purpose.name, image: "" },
        customPurpose: purpose.description,
      });
    }
  };

  const addCustomPurpose = () => {
    if (newCustomPurpose.trim()) {
      setCustomPurposes([...customPurposes, newCustomPurpose.trim()]);
      setNewCustomPurpose("");
    }
  };

  const removeCustomPurpose = (index: number) => {
    setCustomPurposes(customPurposes.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto text-lg">
          Tell us how you plan to use your MyMood Button. This helps us
          recommend the best features and settings for your specific needs.
        </p>
      </div>

      {/* Purpose Categories */}
      <div className="space-y-6">
        <h3 className="font-semibold text-xl text-gray-900 dark:text-white">
          {t("purpose.chooseYourPrimaryUseCase")}
        </h3>

        <div className="grid gap-4">
          {Object.entries(purposeCategories).map(([categoryId, category]) => (
            <div
              key={categoryId}
              className="border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              <button
                onClick={() =>
                  setSelectedCategory(
                    selectedCategory === categoryId ? null : categoryId,
                  )
                }
                className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`w-4 h-4 rounded-full bg-gradient-to-r ${category.color}`}
                  ></div>
                  <h4 className="font-semibold text-lg text-gray-900 dark:text-white">
                    {category.name}
                  </h4>
                </div>
                <ChevronDown
                  className={`w-5 h-5 transition-transform duration-200 ${
                    selectedCategory === categoryId
                      ? "transform rotate-180"
                      : ""
                  }`}
                />
              </button>

              {selectedCategory === categoryId && (
                <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    {category.purposes.map((purpose) => (
                      <button
                        key={purpose.id}
                        onClick={() =>
                          handlePurposeSelect(categoryId, purpose.id)
                        }
                        className={`p-4 text-left rounded-lg border transition-all duration-200 ${
                          config.purpose.id === purpose.id
                            ? "border-primary bg-primary/5 dark:bg-primary/10"
                            : "border-gray-200 dark:border-gray-700 hover:border-primary/50"
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <span className="text-2xl">{purpose.icon}</span>
                          <div>
                            <h5 className="font-semibold text-gray-900 dark:text-white">
                              {purpose.name}
                            </h5>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {purpose.description}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Custom Purpose Section */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-xl text-gray-900 dark:text-white">
            Custom Use Cases
          </h3>
          <button
            onClick={() => setShowCustomForm(!showCustomForm)}
            className="btn-secondary inline-flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            {t("purpose.addCustom")}
          </button>
        </div>

        {showCustomForm && (
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex gap-2">
              <input
                type="text"
                value={newCustomPurpose}
                onChange={(e) => setNewCustomPurpose(e.target.value)}
                placeholder={t("purpose.customUseCasePlaceholder")}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                onKeyPress={(e) => e.key === "Enter" && addCustomPurpose()}
              />
              <button
                onClick={addCustomPurpose}
                className="btn-primary px-4 py-2"
              >
                Add
              </button>
            </div>
          </div>
        )}

        {customPurposes.length > 0 && (
          <div className="space-y-2">
            {customPurposes.map((purpose, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <span className="text-gray-900 dark:text-white">{purpose}</span>
                <button
                  onClick={() => removeCustomPurpose(index)}
                  className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-1 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Usage Pattern */}
      <div className="space-y-4">
        <h3 className="font-semibold text-xl text-gray-900 dark:text-white">
          How Often Will You Use It?
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {usagePatterns.map((pattern) => (
            <button
              key={pattern.id}
              className="p-4 text-center border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary/50 transition-colors duration-200"
            >
              <h4 className="font-semibold text-gray-900 dark:text-white">
                {pattern.name}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {pattern.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Environment */}
      <div className="space-y-4">
        <h3 className="font-semibold text-xl text-gray-900 dark:text-white">
          Where Will You Use It?
        </h3>
        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
          {environments.map((env) => (
            <button
              key={env.id}
              className="p-4 text-center border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary/50 transition-colors duration-200"
            >
              <div className="text-2xl mb-2">{env.icon}</div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {env.name}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Additional Context */}
      <div className="space-y-4">
        <h3 className="font-semibold text-xl text-gray-900 dark:text-white">
          Additional Context (Optional)
        </h3>
        <textarea
          value={config.customPurpose || ""}
          onChange={(e) => updateConfig({ customPurpose: e.target.value })}
          placeholder={t("purpose.tellUsMorePlaceholder")}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          rows={4}
        />
      </div>
    </div>
  );
}
