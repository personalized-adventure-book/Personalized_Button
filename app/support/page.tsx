'use client';

import Link from "next/link";
import {
  MessageCircle,
  Mail,
  Phone,
  Book,
  Search,
  ArrowRight,
  Clock,
  Shield,
  Users,
} from "lucide-react";

export default function SupportPage() {
  const supportOptions = [
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Get instant help from our support team",
      availability: "24/7 Available",
      action: "Start Chat",
      href: "#",
      color: "text-primary",
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us a detailed message about your issue",
      availability: "Response within 24h",
      action: "Send Email",
      href: "mailto:support@mymoodbutton.com",
      color: "text-secondary-blue",
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Speak directly with our support specialists",
      availability: "Mon-Fri 9AM-6PM EST",
      action: "Call Now",
      href: "tel:+1-555-MYMOOD",
      color: "text-secondary-green",
    },
    {
      icon: Book,
      title: "Knowledge Base",
      description: "Browse our comprehensive help articles",
      availability: "Always Available",
      action: "Browse Articles",
      href: "#knowledge-base",
      color: "text-secondary-purple",
    },
  ];

  const faqItems = [
    {
      question: "How do I set up my MyMood Button?",
      answer:
        "Setting up your button is easy! Download the MyMood app, create an account, and follow the in-app setup wizard. The process typically takes 5-10 minutes.",
    },
    {
      question: "Can I change my button's settings later?",
      answer:
        "Yes! You can modify colors, lighting effects, schedules, and other settings anytime through the MyMood mobile app.",
    },
    {
      question: "What if my button stops working?",
      answer:
        "First, try restarting the button by holding the power button for 10 seconds. If issues persist, contact our support team for troubleshooting assistance.",
    },
    {
      question: "Is my button compatible with smart home systems?",
      answer:
        "Pro and Premium buttons support Wi-Fi integration and are compatible with Alexa, Google Home, Apple HomeKit, and other major smart home platforms.",
    },
    {
      question: "How long does the battery last?",
      answer:
        "Battery life varies based on usage, but typically lasts 3-6 months. You'll receive low battery notifications through the app, and replacement is simple.",
    },
    {
      question: "Can I order replacement parts?",
      answer:
        "Yes! We offer replacement batteries, charging cables, and other components. Contact support or visit our parts section for ordering.",
    },
  ];

  const SupportCard = ({ option }: { option: (typeof supportOptions)[0] }) => {
    const IconComponent = option.icon;

    return (
      <div className="card card-dark p-6 space-y-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center">
            <IconComponent className={`w-6 h-6 ${option.color}`} />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
              {option.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {option.availability}
            </p>
          </div>
        </div>

        <p className="text-gray-600 dark:text-gray-300">{option.description}</p>

        <Link href={option.href} className="btn-primary w-full text-center">
          {option.action}
        </Link>
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
              We're Here to{" "}
              <span className="bg-gradient-to-r from-primary to-secondary-blue bg-clip-text text-transparent">
                Help
              </span>
            </h1>
            <p className="max-w-3xl mx-auto text-lg sm:text-xl text-gray-600 dark:text-gray-300">
              Get the support you need, when you need it. Our team is dedicated
              to ensuring you have the best possible experience with your MyMood
              Button.
            </p>
          </div>
        </div>
      </section>

      {/* Support Options */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="font-cal-sans text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
              Choose Your Support Channel
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Multiple ways to get help, tailored to your preferences
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {supportOptions.map((option, index) => (
              <SupportCard key={index} option={option} />
            ))}
          </div>
        </div>
      </section>

      {/* Quick Search */}
      <section className="bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center space-y-8">
            <h2 className="font-cal-sans text-3xl font-bold text-gray-900 dark:text-white">
              Quick Help Search
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Search our knowledge base for instant answers
            </p>

            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for help articles, tutorials, troubleshooting..."
                className="w-full pl-12 pr-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 btn-primary px-6 py-2">
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section
        id="knowledge-base"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
      >
        <div className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="font-cal-sans text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Quick answers to common questions
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {faqItems.map((item, index) => (
              <div key={index} className="card card-dark p-6 space-y-4">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                  {item.question}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link href="#" className="btn-secondary inline-flex items-center">
              View All Articles
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Support Stats */}
      <section className="bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center">
                <Clock className="w-8 h-8 text-primary" />
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  &lt; 2 min
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  Average response time
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-secondary-green/10 rounded-2xl flex items-center justify-center">
                <Shield className="w-8 h-8 text-secondary-green" />
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  99.8%
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  Customer satisfaction
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-secondary-blue/10 rounded-2xl flex items-center justify-center">
                <Users className="w-8 h-8 text-secondary-blue" />
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  50k+
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  Happy customers helped
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-8">
          <h2 className="font-cal-sans text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            Still Need Help?
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
            Our support team is standing by to assist you with any questions or
            issues.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="#" className="btn-primary inline-flex items-center">
              Start Live Chat
              <MessageCircle className="ml-2 w-4 h-4" />
            </Link>
            <Link
              href="mailto:support@mymoodbutton.com"
              className="btn-secondary inline-flex items-center"
            >
              Email Support
              <Mail className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
