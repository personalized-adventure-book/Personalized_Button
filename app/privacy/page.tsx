'use client';

import Link from "next/link";
import {
  Shield,
  Eye,
  Lock,
  Users,
  Globe,
  Mail,
  FileText,
  ArrowRight,
} from "lucide-react";

export default function PrivacyPage() {
  const privacySections = [
    {
      icon: FileText,
      title: "Information We Collect",
      content: [
        "Personal information you provide (name, email, shipping address)",
        "Payment information (processed securely through our payment providers)",
        "Device usage data from your MyMood Button (anonymized)",
        "Website analytics and interaction data",
        "Customer service communications",
      ],
    },
    {
      icon: Eye,
      title: "How We Use Your Information",
      content: [
        "Process and fulfill your orders",
        "Provide customer support and technical assistance",
        "Send important updates about your orders and account",
        "Improve our products and services based on usage patterns",
        "Customize your experience and recommend relevant products",
      ],
    },
    {
      icon: Users,
      title: "Information Sharing",
      content: [
        "We never sell your personal data to third parties",
        "Shipping partners receive only necessary delivery information",
        "Payment processors handle transaction data securely",
        "Anonymous usage statistics may be shared for research",
        "Legal compliance when required by law",
      ],
    },
    {
      icon: Lock,
      title: "Data Security",
      content: [
        "Industry-standard encryption for all data transmission",
        "Secure data centers with 24/7 monitoring",
        "Regular security audits and vulnerability assessments",
        "Strict access controls for our team members",
        "Automatic data backup and recovery systems",
      ],
    },
    {
      icon: Shield,
      title: "Your Privacy Rights",
      content: [
        "Access your personal data at any time",
        "Request corrections to inaccurate information",
        "Delete your account and associated data",
        "Opt-out of marketing communications",
        "Port your data to another service",
      ],
    },
    {
      icon: Globe,
      title: "International Compliance",
      content: [
        "GDPR compliant for European users",
        "CCPA compliant for California residents",
        "SOC 2 Type II certified data handling",
        "Privacy Shield framework adherence",
        "Local data protection law compliance",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-secondary-blue/5 to-secondary-purple/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center space-y-8">
            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h1 className="font-cal-sans text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white">
              Privacy{" "}
              <span className="bg-gradient-to-r from-primary to-secondary-blue bg-clip-text text-transparent">
                Policy
              </span>
            </h1>
            <p className="max-w-3xl mx-auto text-lg sm:text-xl text-gray-600 dark:text-gray-300">
              Your privacy is fundamental to who we are. We're committed to
              being transparent about how we collect, use, and protect your
              personal information.
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <span>Last updated: January 15, 2025</span>
              <span>•</span>
              <span>Effective immediately</span>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Commitment */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="font-cal-sans text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Our Privacy Commitment
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
            At MyMood, we believe privacy is a right, not a privilege. Here's
            how we protect yours.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {privacySections.map((section, index) => {
            const IconComponent = section.icon;
            return (
              <div key={index} className="card card-dark p-6 space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <IconComponent className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                    {section.title}
                  </h3>
                </div>
                <ul className="space-y-3">
                  {section.content.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start space-x-3">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {/* Device Privacy */}
      <section className="bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="font-cal-sans text-3xl font-bold text-gray-900 dark:text-white">
                Your MyMood Button & Privacy
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p>
                  Your MyMood Button is designed with privacy at its core.
                  Here's what data it collects and why:
                </p>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        Usage Patterns
                      </div>
                      <div className="text-sm">
                        Anonymized data on lighting preferences to improve our
                        algorithms
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        Performance Metrics
                      </div>
                      <div className="text-sm">
                        Battery life, connectivity status, and system health
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        Error Reports
                      </div>
                      <div className="text-sm">
                        Crash logs and diagnostic data to fix bugs faster
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-sm bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                  <strong>Important:</strong> No personal conversations, room
                  audio, or camera data is ever collected. Your button only
                  shares the data needed to function better.
                </p>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-700 rounded-2xl p-8 shadow-lg">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    Data Collection
                  </span>
                  <span className="text-xs text-green-600 dark:text-green-400">
                    Minimal & Anonymous
                  </span>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      Audio Recording
                    </span>
                    <span className="text-xs text-red-600 font-medium">
                      Never
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      Camera Access
                    </span>
                    <span className="text-xs text-red-600 font-medium">
                      Never
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      Location Tracking
                    </span>
                    <span className="text-xs text-red-600 font-medium">
                      Never
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      Usage Analytics
                    </span>
                    <span className="text-xs text-green-600 font-medium">
                      Anonymous Only
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      Performance Data
                    </span>
                    <span className="text-xs text-green-600 font-medium">
                      Anonymous Only
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact & Actions */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-6">
            <h2 className="font-cal-sans text-2xl font-bold text-gray-900 dark:text-white">
              Questions About Your Privacy?
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Our privacy team is here to help. We're committed to transparency
              and will respond to your privacy questions within 24 hours.
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary" />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    Email Us
                  </div>
                  <a
                    href="mailto:privacy@mymoodbutton.com"
                    className="text-primary hover:underline"
                  >
                    privacy@mymoodbutton.com
                  </a>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-primary" />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    Data Request Portal
                  </div>
                  <a href="#" className="text-primary hover:underline">
                    Submit a privacy request
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 space-y-6">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
              Manage Your Privacy
            </h3>
            <div className="space-y-4">
              <button className="w-full text-left p-4 bg-white dark:bg-gray-700 rounded-lg hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      Download My Data
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      Get a copy of all your personal data
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </div>
              </button>
              <button className="w-full text-left p-4 bg-white dark:bg-gray-700 rounded-lg hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      Update Preferences
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      Control what data we collect
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </div>
              </button>
              <button className="w-full text-left p-4 bg-white dark:bg-gray-700 rounded-lg hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      Delete Account
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      Permanently remove your data
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Note */}
      <section className="bg-primary/5 dark:bg-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center space-y-4">
            <p className="text-gray-600 dark:text-gray-300">
              This policy applies to all MyMood products and services. For
              questions about specific features or data practices, please don't
              hesitate to reach out.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>
              <span className="hidden sm:block text-gray-400">•</span>
              <Link href="/contact" className="text-primary hover:underline">
                Contact Support
              </Link>
              <span className="hidden sm:block text-gray-400">•</span>
              <Link href="/about" className="text-primary hover:underline">
                About MyMood
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
