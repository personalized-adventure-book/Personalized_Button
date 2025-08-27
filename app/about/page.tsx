'use client';

import Link from "next/link";
import { Heart, Users, Lightbulb, Award, ArrowRight } from "lucide-react";

export default function AboutPage() {
  const values = [
    {
      icon: Heart,
      title: "Passion for Design",
      description:
        "We believe beautiful design should be accessible to everyone, not just designers.",
      color: "text-red-500",
    },
    {
      icon: Users,
      title: "Community First",
      description:
        "Our users inspire everything we do. Their creativity drives our innovation.",
      color: "text-blue-500",
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description:
        "We're constantly pushing the boundaries of what's possible with smart lighting.",
      color: "text-yellow-500",
    },
    {
      icon: Award,
      title: "Quality Commitment",
      description:
        "Every button is crafted with attention to detail and built to last.",
      color: "text-green-500",
    },
  ];

  const team = [
    {
      name: "Sarah Chen",
      role: "CEO & Co-Founder",
      bio: "Former Apple designer with 10+ years experience in consumer electronics.",
      avatar: "#FF7A00",
    },
    {
      name: "Marcus Rodriguez",
      role: "CTO & Co-Founder",
      bio: "IoT expert and former Google engineer passionate about smart home technology.",
      avatar: "#0055FF",
    },
    {
      name: "Emma Thompson",
      role: "Head of Design",
      bio: "Award-winning industrial designer focused on human-centered product experiences.",
      avatar: "#9C27B0",
    },
    {
      name: "David Kim",
      role: "Lead Engineer",
      bio: "Hardware specialist with expertise in low-power embedded systems and wireless tech.",
      avatar: "#4CAF50",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-secondary-blue/5 to-secondary-purple/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center space-y-8">
            <h1 className="font-cal-sans text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white">
              About{" "}
              <span className="bg-gradient-to-r from-primary to-secondary-blue bg-clip-text text-transparent">
                MyMood
              </span>
            </h1>
            <p className="max-w-3xl mx-auto text-lg sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              We're on a mission to help people express their personality
              through personalized smart lighting. Founded in 2023, MyMood has
              grown from a simple idea to a movement of creative expression.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="font-cal-sans text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
              Our Story
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-300 leading-relaxed">
              <p>
                It all started with a simple frustration: why were smart lights
                so complicated? Our founders, Sarah and Marcus, were working
                late one evening when they realized that despite having dozens
                of smart devices, they still couldn't easily create the perfect
                lighting for their mood.
              </p>
              <p>
                That night, they sketched the first concept for MyMood Button -
                a simple, beautiful device that anyone could customize to match
                their personality and lifestyle. No complex apps, no confusing
                settings, just pure creative expression.
              </p>
              <p>
                Today, we're proud to have helped over 50,000 people light their
                personality and transform their spaces into something uniquely
                theirs.
              </p>
            </div>
          </div>

          <div className="relative bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 overflow-hidden">
            <div className="aspect-square bg-gradient-to-br from-primary/20 to-secondary-blue/20 rounded-xl relative overflow-hidden">
              {/* Inspirational workspace image simulation */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/80 to-purple-600/80"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-4 z-10">
                  <div className="w-16 h-16 mx-auto bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Lightbulb className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-white space-y-2">
                    <div className="text-2xl font-bold">Innovation</div>
                    <div className="text-sm opacity-90">
                      Born from late-night brainstorming
                    </div>
                  </div>
                </div>
              </div>
              {/* Decorative elements to simulate a creative workspace */}
              <div className="absolute top-4 right-4 w-8 h-8 bg-white/10 rounded-full"></div>
              <div className="absolute bottom-4 left-4 w-6 h-6 bg-white/10 rounded-full"></div>
              <div className="absolute top-1/3 left-6 w-4 h-4 bg-white/10 rounded-full"></div>
              <div className="absolute bottom-1/3 right-6 w-3 h-3 bg-white/10 rounded-full"></div>

              {/* Timeline overlay */}
              <div className="absolute bottom-4 right-4 bg-white/90 dark:bg-gray-800/90 px-3 py-2 rounded-lg">
                <div className="text-xs text-gray-800 dark:text-gray-200 font-semibold">
                  Est. 2023
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="space-y-12">
            <div className="text-center space-y-4">
              <h2 className="font-cal-sans text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                Our Values
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                The principles that guide everything we do
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => {
                const IconComponent = value.icon;
                return (
                  <div key={index} className="text-center space-y-4">
                    <div className="w-16 h-16 mx-auto bg-white dark:bg-gray-700 rounded-2xl flex items-center justify-center shadow-soft">
                      <IconComponent className={`w-8 h-8 ${value.color}`} />
                    </div>
                    <h3 className="font-semibold text-xl text-gray-900 dark:text-white">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="font-cal-sans text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
              Meet Our Team
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              The passionate people behind MyMood Button
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="card card-dark p-6 text-center space-y-4"
              >
                <div
                  className="w-20 h-20 mx-auto rounded-full flex items-center justify-center text-white font-bold text-xl"
                  style={{ backgroundColor: member.avatar }}
                >
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                    {member.name}
                  </h3>
                  <p className="text-primary font-medium">{member.role}</p>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-gray-900 dark:text-white">
                50k+
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                Happy Customers
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-gray-900 dark:text-white">
                100k+
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                Buttons Created
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-gray-900 dark:text-white">
                25
              </div>
              <div className="text-gray-600 dark:text-gray-400">Countries</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-gray-900 dark:text-white">
                99.8%
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                Satisfaction Rate
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-8">
          <h2 className="font-cal-sans text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            Join Our Journey
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
            Be part of the movement that's redefining how we express ourselves
            through smart lighting.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/customize"
              className="btn-primary inline-flex items-center"
            >
              Create Your Button
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
            <Link
              href="/careers"
              className="btn-secondary inline-flex items-center"
            >
              Join Our Team
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
