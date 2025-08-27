'use client';

import Link from "next/link";
import { Check, Zap, Star, Crown, ArrowRight } from "lucide-react";

export default function PricingPage() {
  const plans = [
    {
      name: "Essential",
      price: 149,
      description: "Perfect for getting started with your first smart button",
      icon: Zap,
      features: [
        "1 Custom Button",
        "Basic Light Effects",
        "Mobile App Control",
        "5 Preset Purposes",
        "Standard Colors",
        "Basic Support",
        "1 Year Warranty",
      ],
      popular: false,
      cta: "Get Essential",
    },
    {
      name: "Pro",
      price: 249,
      description: "Ideal for power users who want advanced features",
      icon: Star,
      features: [
        "1 Custom Button",
        "Advanced Light Effects",
        "Mobile App Control",
        "Unlimited Purposes",
        "Custom Colors",
        "Wi-Fi Integration",
        "Smart Home Compatible",
        "Scheduling Features",
        "Priority Support",
        "2 Year Warranty",
      ],
      popular: true,
      cta: "Get Pro",
    },
    {
      name: "Premium",
      price: 399,
      description: "The ultimate experience with exclusive features",
      icon: Crown,
      features: [
        "2 Custom Buttons",
        "Premium Light Effects",
        "Mobile App Control",
        "Unlimited Purposes",
        "Custom Colors + Finishes",
        "Wi-Fi Integration",
        "Smart Home Compatible",
        "Advanced Scheduling",
        "Custom Icon Upload",
        "VIP Support",
        "3 Year Warranty",
        "Free Design Consultation",
      ],
      popular: false,
      cta: "Get Premium",
    },
  ];

  const PricingCard = ({ plan }: { plan: (typeof plans)[0] }) => {
    const IconComponent = plan.icon;

    return (
      <div
        className={`relative card card-dark p-8 ${plan.popular ? "ring-2 ring-primary scale-105" : ""}`}
      >
        {plan.popular && (
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <div className="bg-primary text-white px-4 py-1 rounded-full text-sm font-medium">
              Most Popular
            </div>
          </div>
        )}

        <div className="space-y-6">
          <div className="text-center space-y-4">
            <div
              className={`w-12 h-12 mx-auto rounded-xl flex items-center justify-center ${
                plan.popular ? "bg-primary/10" : "bg-gray-100 dark:bg-gray-800"
              }`}
            >
              <IconComponent
                className={`w-6 h-6 ${plan.popular ? "text-primary" : "text-gray-600 dark:text-gray-400"}`}
              />
            </div>

            <div>
              <h3 className="font-cal-sans text-2xl font-bold text-gray-900 dark:text-white">
                {plan.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {plan.description}
              </p>
            </div>

            <div className="space-y-1">
              <div className="text-4xl font-bold text-gray-900 dark:text-white">
                ${plan.price}
              </div>
              <div className="text-gray-600 dark:text-gray-400">per button</div>
            </div>
          </div>

          <div className="space-y-3">
            {plan.features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-300">
                  {feature}
                </span>
              </div>
            ))}
          </div>

          <Link
            href="/customize"
            className={`block w-full text-center py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
              plan.popular
                ? "bg-primary text-white hover:bg-primary/90"
                : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            {plan.cta}
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-secondary-blue/5 to-secondary-purple/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center space-y-8">
            <h1 className="font-cal-sans text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white">
              Simple,{" "}
              <span className="bg-gradient-to-r from-primary to-secondary-blue bg-clip-text text-transparent">
                Transparent
              </span>{" "}
              Pricing
            </h1>
            <p className="max-w-3xl mx-auto text-lg sm:text-xl text-gray-600 dark:text-gray-300">
              Choose the perfect plan for your needs. No hidden fees, no
              subscriptions. One-time purchase, lifetime enjoyment.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <PricingCard key={index} plan={plan} />
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="space-y-12">
            <div className="text-center space-y-4">
              <h2 className="font-cal-sans text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                Frequently Asked Questions
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Everything you need to know about our pricing
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                    Is there a subscription fee?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    No! All our plans are one-time purchases. Buy once, enjoy
                    forever.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                    Can I upgrade later?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Yes, you can upgrade your plan anytime and we'll credit the
                    difference.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                    What's included in the warranty?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Full replacement coverage for manufacturing defects and
                    hardware failures.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                    Do you offer refunds?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Yes, we offer a 30-day money-back guarantee if you're not
                    satisfied.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                    How long does shipping take?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    2-3 weeks for custom buttons. We'll keep you updated
                    throughout the process.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                    Can I order multiple buttons?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Absolutely! Contact us for volume discounts on orders of 5
                    or more.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-8">
          <h2 className="font-cal-sans text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            Ready to Get Started?
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
            Join thousands of satisfied customers who have already transformed
            their space with MyMood Button.
          </p>
          <Link
            href="/customize"
            className="btn-primary inline-flex items-center"
          >
            Start Customizing
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
