'use client';

import Link from "next/link";
import { Target, Palette, Smartphone, Package, ArrowRight } from "lucide-react";

export default function HowItWorksPage() {
  const steps = [
    {
      icon: Target,
      title: "Choose Your Purpose",
      description:
        "Select from focus mode, reading light, movie night, party scene, or create your own custom purpose.",
      color: "text-primary",
    },
    {
      icon: Palette,
      title: "Design & Style",
      description:
        "Pick your button's shape, color, and finish. Choose from our curated palette or create a custom color.",
      color: "text-secondary-blue",
    },
    {
      icon: Smartphone,
      title: "Add Label & Icon",
      description:
        "Personalize with custom text and icons. Upload your own SVG or choose from our library.",
      color: "text-secondary-purple",
    },
    {
      icon: Package,
      title: "Set Behavior",
      description:
        "Configure lighting effects, brightness, Wi-Fi integration, and scheduling for perfect automation.",
      color: "text-secondary-green",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-secondary-blue/5 to-secondary-purple/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center space-y-8">
            <h1 className="font-cal-sans text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white">
              How It{" "}
              <span className="bg-gradient-to-r from-primary to-secondary-blue bg-clip-text text-transparent">
                Works
              </span>
            </h1>
            <p className="max-w-3xl mx-auto text-lg sm:text-xl text-gray-600 dark:text-gray-300">
              Create your perfect smart button in just 4 simple steps. From
              concept to delivery, we make customization easy and enjoyable.
            </p>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="space-y-20">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            const isEven = index % 2 === 0;

            return (
              <div
                key={index}
                className={`grid lg:grid-cols-2 gap-12 items-center ${isEven ? "" : "lg:grid-flow-col-dense"}`}
              >
                <div className={`space-y-6 ${isEven ? "" : "lg:col-start-2"}`}>
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center`}
                    >
                      <IconComponent className={`w-6 h-6 ${step.color}`} />
                    </div>
                    <div className="text-sm font-medium text-primary">
                      Step {index + 1}
                    </div>
                  </div>
                  <h3 className="font-cal-sans text-3xl font-bold text-gray-900 dark:text-white">
                    {step.title}
                  </h3>
                  <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div
                  className={`${isEven ? "" : "lg:col-start-1 lg:row-start-1"}`}
                >
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 lg:p-12">
                    <div className="w-full h-64 bg-gradient-to-br from-primary/10 to-secondary-blue/10 rounded-xl flex items-center justify-center">
                      <div className="text-gray-500 dark:text-gray-400">
                        Step {index + 1} Preview
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center space-y-8">
            <h2 className="font-cal-sans text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
              Ready to Get Started?
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
              Begin your journey to the perfect smart button. It only takes a
              few minutes to create something amazing.
            </p>
            <Link
              href="/customize"
              className="btn-primary inline-flex items-center"
            >
              Start Customizing
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
