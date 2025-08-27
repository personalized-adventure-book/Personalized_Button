"use client";

import { Search, Plus, Minus } from "lucide-react";
import { useState } from "react";

const faqData = [
  {
    category: "Getting Started",
    questions: [
      {
        question: "How do I set up my MyMood Button?",
        answer:
          "Setting up your button is simple! Download the MyMood app from the App Store or Google Play, create an account, and follow the in-app setup wizard. You'll need to connect your button to Wi-Fi and customize your settings. The whole process takes about 5-10 minutes.",
      },
      {
        question: "What comes in the box?",
        answer:
          "Your MyMood Button package includes the custom button, USB-C charging cable, quick start guide, and warranty card. Pro and Premium versions may include additional accessories.",
      },
      {
        question: "Do I need a smartphone to use my button?",
        answer:
          "While a smartphone enhances the experience with advanced features and customization, basic button functionality works without one. However, initial setup requires the mobile app.",
      },
    ],
  },
  {
    category: "Customization",
    questions: [
      {
        question: "Can I change my button's design after ordering?",
        answer:
          "Orders can be modified within 24 hours of placement. After production begins, design changes are not possible. However, you can always order additional buttons with new designs.",
      },
      {
        question: "How many colors can I choose from?",
        answer:
          "You can choose from 6 preset colors (Orange, Blue, Purple, Green, Yellow, Pink) or create a custom color using our color picker tool. Pro and Premium tiers offer additional finish options.",
      },
      {
        question: "Can I upload my own icons?",
        answer:
          "Yes! Pro and Premium users can upload custom SVG icons. We also provide a library of 20+ built-in icons to choose from.",
      },
    ],
  },
  {
    category: "Technical",
    questions: [
      {
        question: "How long does the battery last?",
        answer:
          "Battery life varies based on usage patterns and light settings, but typically lasts 3-6 months. You'll receive low battery notifications through the app, and recharging takes about 2 hours.",
      },
      {
        question: "Is my button compatible with smart home systems?",
        answer:
          "Pro and Premium buttons support Wi-Fi and are compatible with Alexa, Google Home, Apple HomeKit, and other major smart home platforms.",
      },
      {
        question: "What if my button stops responding?",
        answer:
          "Try restarting your button by holding the power button for 10 seconds. If issues persist, check your Wi-Fi connection and ensure the app is up to date. Contact support if problems continue.",
      },
    ],
  },
  {
    category: "Orders & Shipping",
    questions: [
      {
        question: "How long does shipping take?",
        answer:
          "Custom buttons are handcrafted and typically ship within 2-3 weeks of order confirmation. Shipping time varies by location: 3-5 days within the US, 7-14 days internationally.",
      },
      {
        question: "Do you ship internationally?",
        answer:
          "Yes! We ship to most countries worldwide. International orders may be subject to customs duties and taxes, which are the responsibility of the customer.",
      },
      {
        question: "Can I track my order?",
        answer:
          "Absolutely! You'll receive tracking information via email once your order ships. You can also check your order status anytime in the MyMood app or on our website.",
      },
    ],
  },
  {
    category: "Support & Warranty",
    questions: [
      {
        question: "What's covered under warranty?",
        answer:
          "Our warranty covers manufacturing defects and hardware failures. Warranty periods are 1 year (Essential), 2 years (Pro), or 3 years (Premium). Physical damage from misuse is not covered.",
      },
      {
        question: "How do I return my button?",
        answer:
          "We offer a 30-day return policy for unused items in original packaging. Custom designs may have different return terms. Contact support to initiate a return.",
      },
      {
        question: "How can I contact customer support?",
        answer:
          "You can reach our support team through live chat (24/7), email (support@mymoodbutton.com), or phone (1-555-MYMOOD) during business hours (Mon-Fri 9AM-6PM EST).",
      },
    ],
  },
];

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [openQuestions, setOpenQuestions] = useState<string[]>([]);

  const toggleQuestion = (questionId: string) => {
    setOpenQuestions((prev) =>
      prev.includes(questionId)
        ? prev.filter((id) => id !== questionId)
        : [...prev, questionId],
    );
  };

  const filteredFAQ = faqData
    .map((category) => ({
      ...category,
      questions: category.questions.filter(
        (q) =>
          q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q.answer.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    }))
    .filter((category) => category.questions.length > 0);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-secondary-blue/5 to-secondary-purple/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center space-y-8">
            <h1 className="font-cal-sans text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white">
              Frequently Asked{" "}
              <span className="bg-gradient-to-r from-primary to-secondary-blue bg-clip-text text-transparent">
                Questions
              </span>
            </h1>
            <p className="max-w-3xl mx-auto text-lg sm:text-xl text-gray-600 dark:text-gray-300">
              Find answers to common questions about MyMood Button. Can't find
              what you're looking for? Contact our support team.
            </p>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search frequently asked questions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg"
          />
        </div>
      </section>

      {/* FAQ Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {filteredFAQ.length > 0 ? (
          <div className="space-y-12">
            {filteredFAQ.map((category, categoryIndex) => (
              <div key={categoryIndex} className="space-y-6">
                <h2 className="font-cal-sans text-2xl font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-4">
                  {category.category}
                </h2>

                <div className="space-y-4">
                  {category.questions.map((faq, questionIndex) => {
                    const questionId = `${categoryIndex}-${questionIndex}`;
                    const isOpen = openQuestions.includes(questionId);

                    return (
                      <div
                        key={questionIndex}
                        className="border border-gray-200 dark:border-gray-700 rounded-lg"
                      >
                        <button
                          onClick={() => toggleQuestion(questionId)}
                          className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                        >
                          <span className="font-semibold text-gray-900 dark:text-white pr-4">
                            {faq.question}
                          </span>
                          {isOpen ? (
                            <Minus className="w-5 h-5 text-gray-500 flex-shrink-0" />
                          ) : (
                            <Plus className="w-5 h-5 text-gray-500 flex-shrink-0" />
                          )}
                        </button>

                        {isOpen && (
                          <div className="px-6 pb-4">
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                              {faq.answer}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No results found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try searching with different keywords or contact our support team.
            </p>
          </div>
        )}
      </section>

      {/* Contact CTA */}
      <section className="bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center space-y-6">
            <h2 className="font-cal-sans text-3xl font-bold text-gray-900 dark:text-white">
              Still have questions?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Our support team is here to help. Get in touch and we'll answer
              any questions you might have.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/support" className="btn-primary">
                Contact Support
              </a>
              <a href="/contact" className="btn-secondary">
                Send Message
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
