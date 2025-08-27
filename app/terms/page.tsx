'use client';

import Link from "next/link";
import {
  FileText,
  ShoppingCart,
  Shield,
  Truck,
  RefreshCw,
  Users,
  AlertTriangle,
  Scale,
  ArrowRight,
} from "lucide-react";

export default function TermsPage() {
  const termsSections = [
    {
      icon: FileText,
      title: "Getting Started",
      items: [
        "By using MyMood services, you agree to these terms",
        "You must be 18+ to create an account or have parental consent",
        "One account per person - no sharing accounts",
        "Keep your account information secure and up to date",
      ],
    },
    {
      icon: ShoppingCart,
      title: "Orders & Customization",
      items: [
        "Custom buttons are made-to-order and tailored specifically for you",
        "Order confirmations are binding contracts",
        "We reserve the right to decline orders that violate our policies",
        "Bulk orders (5+) may have different terms and pricing",
      ],
    },
    {
      icon: Shield,
      title: "Payment & Pricing",
      items: [
        "Payment required at time of order via secure checkout",
        "Prices include manufacturing but exclude shipping and taxes",
        "We accept major credit cards, PayPal, and digital wallets",
        "Failed payments may result in order cancellation",
      ],
    },
    {
      icon: Truck,
      title: "Shipping & Delivery",
      items: [
        "Standard delivery: 2-3 weeks from order confirmation",
        "Express shipping available for additional cost",
        "International shipping available with customs duties",
        "Address changes possible within 24 hours of ordering",
      ],
    },
    {
      icon: RefreshCw,
      title: "Returns & Warranties",
      items: [
        "30-day satisfaction guarantee on all purchases",
        "Manufacturing defects covered for 1-3 years (varies by tier)",
        "Custom designs cannot be returned unless defective",
        "Return shipping costs covered for defective products",
      ],
    },
    {
      icon: Users,
      title: "Your Rights & Responsibilities",
      items: [
        "You own the designs you create using our platform",
        "Don't upload copyrighted content you don't own",
        "Respect other users and our community guidelines",
        "Report inappropriate content or behavior",
      ],
    },
  ];

  const importantNotices = [
    {
      icon: AlertTriangle,
      title: "Important Limitations",
      content:
        "MyMood Button is not liable for indirect damages, lost profits, or consequential damages. Our total liability is limited to the purchase price of your product.",
      type: "warning",
    },
    {
      icon: Scale,
      title: "Dispute Resolution",
      content:
        "Any disputes will be resolved through binding arbitration in accordance with the rules of the American Arbitration Association.",
      type: "info",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-secondary-blue/5 to-secondary-purple/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center space-y-8">
            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center">
              <Scale className="w-8 h-8 text-primary" />
            </div>
            <h1 className="font-cal-sans text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white">
              Terms of{" "}
              <span className="bg-gradient-to-r from-primary to-secondary-blue bg-clip-text text-transparent">
                Service
              </span>
            </h1>
            <p className="max-w-3xl mx-auto text-lg sm:text-xl text-gray-600 dark:text-gray-300">
              These terms govern your use of MyMood Button products and
              services. We've written them in plain English to make them as
              clear as possible.
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <span>Last updated: January 15, 2025</span>
              <span>•</span>
              <span>Effective immediately</span>
            </div>
          </div>
        </div>
      </section>

      {/* Key Terms Summary */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="font-cal-sans text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            The Key Points
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
            Here are the most important things you should know about using
            MyMood Button.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {termsSections.map((section, index) => {
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
                  {section.items.map((item, itemIndex) => (
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

      {/* Important Notices */}
      <section className="bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-12">
            <h2 className="font-cal-sans text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Important Legal Information
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Please read these carefully as they affect your rights and
              responsibilities.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {importantNotices.map((notice, index) => {
              const IconComponent = notice.icon;
              return (
                <div
                  key={index}
                  className={`p-6 rounded-2xl border-l-4 ${
                    notice.type === "warning"
                      ? "bg-yellow-50 dark:bg-yellow-900/10 border-yellow-500"
                      : "bg-blue-50 dark:bg-blue-900/10 border-blue-500"
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        notice.type === "warning"
                          ? "bg-yellow-500/10 text-yellow-600"
                          : "bg-blue-500/10 text-blue-600"
                      }`}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                        {notice.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        {notice.content}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Detailed Terms */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <div>
              <h2 className="font-cal-sans text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Detailed Terms & Conditions
              </h2>

              <div className="space-y-8 prose prose-lg dark:prose-invert max-w-none">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Account Creation
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    To create a MyMood Button account, you must provide accurate
                    and complete information. You are responsible for
                    maintaining the security of your account credentials and for
                    all activities that occur under your account.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Product Customization
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Our customization tools allow you to create unique button
                    designs. You warrant that any content you upload or create
                    does not infringe upon third-party intellectual property
                    rights. We reserve the right to refuse orders containing
                    inappropriate content.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Pricing & Payment
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    All prices are listed in USD and are subject to change
                    without notice. Payment is processed securely through our
                    certified payment partners. We do not store your payment
                    information on our servers.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Manufacturing & Quality
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Each MyMood Button is individually manufactured using
                    high-quality materials and processes. We perform quality
                    checks on every product before shipping. If you receive a
                    defective product, contact us within 30 days for a
                    replacement.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Software & Updates
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Your MyMood Button includes software that may receive
                    updates to improve functionality or security. By using the
                    device, you consent to automatic updates. We may discontinue
                    software support for older devices with reasonable notice.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Termination
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    You may close your account at any time. We may suspend or
                    terminate accounts that violate these terms. Upon
                    termination, you retain access to products you've purchased,
                    but lose access to online services.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 space-y-4">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Link
                  href="/privacy"
                  className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg hover:shadow-md transition-shadow duration-200"
                >
                  <span className="text-gray-900 dark:text-white">
                    Privacy Policy
                  </span>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </Link>
                <Link
                  href="/contact"
                  className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg hover:shadow-md transition-shadow duration-200"
                >
                  <span className="text-gray-900 dark:text-white">
                    Contact Legal Team
                  </span>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </Link>
                <Link
                  href="/support"
                  className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg hover:shadow-md transition-shadow duration-200"
                >
                  <span className="text-gray-900 dark:text-white">
                    Get Support
                  </span>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </Link>
              </div>
            </div>

            <div className="bg-primary/5 dark:bg-primary/10 rounded-2xl p-6 space-y-4">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                Questions?
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Our legal team is here to help clarify any questions about these
                terms.
              </p>
              <a
                href="mailto:legal@mymoodbutton.com"
                className="inline-flex items-center text-primary hover:underline font-medium"
              >
                legal@mymoodbutton.com
                <ArrowRight className="w-4 h-4 ml-1" />
              </a>
            </div>

            <div className="text-sm text-gray-500 dark:text-gray-400 space-y-2">
              <p>These terms are governed by the laws of Delaware, USA.</p>
              <p>Any disputes will be resolved through binding arbitration.</p>
              <p>
                If any provision is found unenforceable, the rest remains in
                effect.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <section className="bg-primary/5 dark:bg-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center space-y-4">
            <p className="text-gray-600 dark:text-gray-300">
              By continuing to use MyMood Button, you acknowledge that you have
              read, understood, and agree to these terms.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/customize" className="btn-primary">
                Start Creating Your Button
              </Link>
              <Link href="/privacy" className="text-primary hover:underline">
                Read Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
