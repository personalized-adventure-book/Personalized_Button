'use client';

import Link from "next/link";
import { ArrowRight, Heart, Star } from "lucide-react";

export default function GalleryPage() {
  const galleryItems = [
    {
      id: 1,
      name: "Midnight Focus",
      purpose: "Focus Mode",
      color: "#1F2937",
      shape: "round",
      likes: 124,
      featured: true,
    },
    {
      id: 2,
      name: "Sunset Vibes",
      purpose: "Movie Night",
      color: "#FF7A00",
      shape: "square",
      likes: 98,
      featured: false,
    },
    {
      id: 3,
      name: "Ocean Calm",
      purpose: "Reading Light",
      color: "#0055FF",
      shape: "round",
      likes: 156,
      featured: true,
    },
    {
      id: 4,
      name: "Forest Green",
      purpose: "Custom Purpose",
      color: "#4CAF50",
      shape: "hexagon",
      likes: 87,
      featured: false,
    },
    {
      id: 5,
      name: "Purple Rain",
      purpose: "Party Scene",
      color: "#9C27B0",
      shape: "round",
      likes: 203,
      featured: true,
    },
    {
      id: 6,
      name: "Golden Hour",
      purpose: "Focus Mode",
      color: "#FFC107",
      shape: "square",
      likes: 145,
      featured: false,
    },
    {
      id: 7,
      name: "Rose Quartz",
      purpose: "Reading Light",
      color: "#E91E63",
      shape: "round",
      likes: 167,
      featured: true,
    },
    {
      id: 8,
      name: "Arctic Blue",
      purpose: "Movie Night",
      color: "#00BCD4",
      shape: "hexagon",
      likes: 92,
      featured: false,
    },
  ];

  const featuredItems = galleryItems.filter((item) => item.featured);
  const allItems = galleryItems;

  const ButtonPreview = ({ item }: { item: (typeof galleryItems)[0] }) => {
    const shapeClass =
      item.shape === "round"
        ? "rounded-full"
        : item.shape === "square"
          ? "rounded-lg"
          : "clip-path-hexagon";

    return (
      <div className="group cursor-pointer">
        <div className="card card-dark p-6 space-y-4 group-hover:shadow-xl group-hover:-translate-y-2 transition-all duration-300">
          <div className="flex items-center justify-center h-32">
            <div
              className={`w-20 h-20 ${shapeClass} shadow-lg relative`}
              style={{ backgroundColor: item.color }}
            >
              <div className="absolute inset-0 bg-white/20 rounded-full w-8 h-8 m-auto animate-pulse-slow"></div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {item.name}
              </h3>
              {item.featured && (
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
              )}
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400">
              {item.purpose}
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                <Heart className="w-4 h-4" />
                <span>{item.likes}</span>
              </div>

              <button className="text-primary hover:text-primary/80 text-sm font-medium">
                Use as Template
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 main-content-with-header">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-secondary-blue/5 to-secondary-purple/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center space-y-8">
            <h1 className="font-cal-sans text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white">
              Gallery of{" "}
              <span className="bg-gradient-to-r from-primary to-secondary-blue bg-clip-text text-transparent">
                Inspiration
              </span>
            </h1>
            <p className="max-w-3xl mx-auto text-lg sm:text-xl text-gray-600 dark:text-gray-300">
              Discover amazing button designs created by our community. Get
              inspired and use any design as a starting point for your own
              creation.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="font-cal-sans text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
              Featured Designs
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Hand-picked designs that showcase the best of what's possible
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredItems.map((item) => (
              <ButtonPreview key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* All Designs Section */}
      <section className="bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="space-y-12">
            <div className="text-center space-y-4">
              <h2 className="font-cal-sans text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                Community Creations
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Browse all designs from our creative community
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {allItems.map((item) => (
                <ButtonPreview key={item.id} item={item} />
              ))}
            </div>

            <div className="text-center">
              <button className="btn-secondary">Load More Designs</button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-8">
          <h2 className="font-cal-sans text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            Ready to Create Your Own?
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
            Start with a template or design from scratch. Your creativity is the
            only limit.
          </p>
          <Link
            href="/customize"
            className="btn-primary inline-flex items-center"
          >
            Start Creating
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
