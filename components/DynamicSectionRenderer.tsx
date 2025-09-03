"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { LocalContentData } from '@/hooks/useLocalContent';
import { Check, ArrowRight, Sparkles, User, Book, Heart, Rocket, TreePine, Crown, Anchor, Zap, Palette, Music, Gift, Star, Camera, Globe2 } from 'lucide-react';
import { getGalleryImages, getHeroImage, imageExists, imageExistsWithFallback, getCurrentProduct, getCurrentLanguage, getFallbackImagePath, getAllImagesInFolder, getRecommendedImageCounts, getGalleryAudios } from '@/utils/productAssets';
import { getGlobalAudio } from '@/utils/globalAudio';
import { getPlaybackState, setPlaybackState } from '@/utils/globalPlayback';
import comprehensiveTracker from '@/utils/comprehensiveTracker';
import { useLanguage } from '@/contexts/LanguageContext';

// Helper function to get proper icons for features and adventures
function getFeatureIcon(iconName?: string, index: number = 0) {
  // Base colored icon components
  const iconMap: Record<string, React.ReactNode> = {
    person: <User className="w-8 h-8 text-blue-500 dark:text-blue-400" />,
    book: <Book className="w-8 h-8 text-amber-500 dark:text-amber-400" />,
    heart: <Heart className="w-8 h-8 text-rose-500 dark:text-rose-400" />,
    rocket: <Rocket className="w-8 h-8 text-indigo-500 dark:text-indigo-400" />,
    tree: <TreePine className="w-8 h-8 text-green-600 dark:text-green-500" />,
    crown: <Crown className="w-8 h-8 text-yellow-500 dark:text-yellow-400" />,
    anchor: <Anchor className="w-8 h-8 text-slate-500 dark:text-slate-400" />,
    bolt: <Zap className="w-8 h-8 text-orange-500 dark:text-orange-400" />
  };

  // Rotating fallback sequence for items without explicit icon field
  const rotation: string[] = ['rocket','heart','tree','crown','bolt','person','book','anchor'];
  const chosenKey = iconName && iconMap[iconName] ? iconName : rotation[index % rotation.length];
  return iconMap[chosenKey] || <Sparkles className="w-8 h-8 text-violet-500 dark:text-violet-400" />;
}

// Separate icon set for THEMES (examples) to avoid visual duplication with features
function getThemeIcon(index: number) {
  // Distinct themed icons (avoid overlap with feature set where possible)
  const themeIcons: React.ReactNode[] = [
    <Music className="w-8 h-8 text-fuchsia-500 dark:text-fuchsia-400" />,   // sound / mood
    <Palette className="w-8 h-8 text-emerald-600 dark:text-emerald-500" />, // colors / style
    <Gift className="w-8 h-8 text-amber-500 dark:text-amber-400" />,        // occasion
    <Star className="w-8 h-8 text-indigo-500 dark:text-indigo-400" />,      // highlight
    <Camera className="w-8 h-8 text-rose-500 dark:text-rose-400" />,        // imagery / vibe
    <Anchor className="w-8 h-8 text-sky-500 dark:text-sky-400" />,          // connection / grounded
    <Globe2 className="w-8 h-8 text-teal-500 dark:text-teal-400" />,        // global / versatile
    <Sparkles className="w-8 h-8 text-violet-500 dark:text-violet-400" />   // magic / creative
  ];
  return themeIcons[index % themeIcons.length];
}

interface DynamicSectionRendererProps {
  data: LocalContentData;
  onStartCustomizing: () => void;
  debug?: boolean;
  sectionsToRender?: string[];
  renderFormSection?: React.ReactNode;
}

// Generic section renderer that can handle any section type
export function DynamicSectionRenderer({ data, onStartCustomizing, debug = false, sectionsToRender, renderFormSection }: DynamicSectionRendererProps) {
  const { t } = useLanguage();
  
  // Define the order of sections we want to display
  const sectionOrder = [
    'urgency_banner',
    'gallery',
    'hero',
    'demo_video',
  'about',
  'features', 
    'adventure_possibilities',
    'book_examples',
    'examples',
    'how_it_works',
    'why_people_love_it',
    'pricing',
    'book_options',
    'testimonials',
    'faq',
    'cta'
  ];

  // Use custom sections if provided, otherwise use default order
  const sectionsToProcess = sectionsToRender || sectionOrder;

  // Get available sections (check both root level and homepage level)
  const availableSections = sectionsToProcess.filter(sectionKey => {
    const currentProduct = getCurrentProduct();
    
    // Always include gallery and demo_video for Button products
    if ((sectionKey === 'gallery' || sectionKey === 'demo_video') && currentProduct === 'Button') {
      return true;
    }
    
    return data[sectionKey] || (data.homepage && data.homepage[sectionKey]);
  });

  // Get all sections (both available and debugging)
  const allSections = debug ? sectionsToProcess : availableSections;

  // Debug function to analyze data structure
  const getDataStructure = () => {
    const structure: Record<string, string> = {};
    Object.keys(data).forEach(key => {
      if (data[key] && key !== 'homepage' && key !== 'form') {
        structure[key] = Array.isArray(data[key]) ? `Array[${data[key].length}]` : typeof data[key];
      }
    });
    
    // Also check homepage structure
    if (data.homepage) {
      Object.keys(data.homepage).forEach(key => {
        if (data.homepage && data.homepage[key]) {
          structure[`homepage.${key}`] = Array.isArray(data.homepage[key]) ? `Array[${data.homepage[key].length}]` : typeof data.homepage[key];
        }
      });
    }
    
    return structure;
  };  return (
    <main className="relative main-content-with-header">
      {allSections.map((sectionKey, index) => {
        if (sectionKey === 'form' && renderFormSection) {
          return <React.Fragment key="form-section">{renderFormSection}</React.Fragment>;
        }
        // Try to get section data from both root level and homepage level
        const sectionData = data[sectionKey] || (data.homepage && data.homepage[sectionKey]);
        // Some sections (like demo_video) don't require data from content files
        const sectionsWithoutData = ['demo_video'];
        const requiresData = !sectionsWithoutData.includes(sectionKey);
        if (requiresData && !sectionData) return null;
        // Use a stable key for persistent sections like gallery to prevent remounting
        const persistentSections = ['gallery', 'demo_video', 'hero', 'faq', 'about', 'pricing', 'testimonials', 'cta', 'how_it_works', 'why_people_love_it', 'features', 'examples', 'book_examples', 'adventure_possibilities'];
        const stableKey = persistentSections.includes(sectionKey) ? sectionKey : `${sectionKey}-${index}`;
        return (
          <DynamicSection
            key={stableKey}
            sectionKey={sectionKey}
            sectionData={sectionData}
            onStartCustomizing={onStartCustomizing}
            index={index}
            t={t}
          />
        );
      })}
    </main>
  );
}

interface DynamicSectionProps {
  sectionKey: string;
  sectionData: any;
  onStartCustomizing: () => void;
  index: number;
  t: (key: string) => string;
}

function DynamicSection({ sectionKey, sectionData, onStartCustomizing, index, t }: DynamicSectionProps) {
  const isEven = index % 2 === 0;
  const bgClass = isEven ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800';

  // Special handling for hero section (no wrapper needed)
  if (sectionKey === 'hero') {
    return <HeroSection data={sectionData} onStartCustomizing={onStartCustomizing} t={t} />;
  }

  // Special handling for urgency banner (fixed at top)
  if (sectionKey === 'urgency_banner') {
    return <UrgencyBannerSection data={sectionData} />;
  }

  // Wrap all other sections without animation
  const SectionContent = () => {
    // Special handling for features (array or object)
    if (sectionKey === 'features' && sectionData) {
      return <FeaturesSection data={sectionData} />;
    }

    // Special handling for examples/book_examples
    if ((sectionKey === 'examples' || sectionKey === 'book_examples') && sectionData) {
      return <ExamplesSection data={sectionData} />;
    }

    // Special handling for adventure_possibilities
    if (sectionKey === 'adventure_possibilities' && sectionData) {
      return <AdventurePossibilitiesSection data={sectionData} />;
    }

    // Special handling for how_it_works
    if (sectionKey === 'how_it_works' && sectionData) {
      return <HowItWorksSection data={sectionData} t={t} />;
    }

    // Special handling for pricing/book_options
    if ((sectionKey === 'pricing' || sectionKey === 'book_options') && sectionData) {
      return <PricingSection data={sectionData} onStartCustomizing={onStartCustomizing} />;
    }

    // Special handling for gallery - ALWAYS show for Button products
    if (sectionKey === 'gallery') {
      const currentProduct = getCurrentProduct();
      if (currentProduct === 'Button') {
        // Always show the gallery section for Button products, even if no data
        const defaultGalleryData = sectionData || { 
          title: 'Button Gallery', 
          subtitle: 'Explore our collection of beautiful custom buttons - scroll horizontally to see more!' 
        };
        return <GallerySection data={defaultGalleryData} t={t} />;
      } else if (sectionData) {
        return <GallerySection data={sectionData} t={t} />;
      }
      return null;
    }

    // Special handling for demo_video - ALWAYS show for Button products
    if (sectionKey === 'demo_video') {
      const currentProduct = getCurrentProduct();
      if (currentProduct === 'Button') {
        return <DemoVideoSection t={t} />;
      }
      return null;
    }

    // Special handling for why_people_love_it
    if (sectionKey === 'why_people_love_it' && sectionData) {
      return <WhyPeopleLoveItSection data={sectionData} />;
    }

    // Special handling for testimonials
    if (sectionKey === 'testimonials' && sectionData) {
      return <TestimonialsSection data={sectionData} />;
    }

    // Special handling for FAQ
    if (sectionKey === 'faq' && Array.isArray(sectionData)) {
      return <FaqSection data={sectionData} />;
    }

    // Special handling for CTA
    if (sectionKey === 'cta' && sectionData) {
      return <CtaSection data={sectionData} onStartCustomizing={onStartCustomizing} t={t} />;
    }

    // Special handling for About section
    if (sectionKey === 'about' && sectionData) {
      return <AboutSection data={sectionData} bgClass={bgClass} />;
    }

    // Generic section handler for any other section type
    return <GenericSection sectionKey={sectionKey} data={sectionData} bgClass={bgClass} />;
  };

  // Return the section without animation wrapper
  return <SectionContent />;
}

// Hero Section Component
function HeroSection({ data, onStartCustomizing, t }: { data: any; onStartCustomizing?: () => void; t: (key: string) => string }) {
  const [heroImageStatus, setHeroImageStatus] = useState<{ exists: boolean; path: string } | null>(null);
  const currentProduct = getCurrentProduct();
  const currentLanguage = getCurrentLanguage();
  
  // Check if hero image exists with language fallback
  useEffect(() => {
    if (data.background_image) {
      const checkHeroImage = async () => {
        // Try language-specific path first
        const languageSpecificPath = getHeroImage(data.background_image, currentProduct, currentLanguage);
        // Fallback to non-language path
        const fallbackPath = getFallbackImagePath(data.background_image, 'hero', currentProduct);
        
        const result = await imageExistsWithFallback(languageSpecificPath, fallbackPath);
        setHeroImageStatus(result);
      };
      
      checkHeroImage();
    }
  }, [data.background_image, currentProduct, currentLanguage]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with language support */}
      {heroImageStatus?.exists && (
        <div className="absolute inset-0 z-0">
          <Image
            src={heroImageStatus.path}
            alt="Hero Background"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          {/* Dark overlay for better text readability - responsive to theme */}
          <div className="absolute inset-0 bg-black/40 dark:bg-black/60"></div>
        </div>
      )}
      
      {/* Fallback gradient background when no image - theme responsive */}
      {!heroImageStatus?.exists && (
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-gray-50 via-white to-primary/5 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700"></div>
      )}
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 dark:text-white mb-8 leading-tight">
            {data.title}
          </h1>
          <p className="text-xl sm:text-2xl lg:text-3xl text-gray-700 dark:text-gray-200 mb-12 leading-relaxed">
            {data.subtitle}
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            {onStartCustomizing ? (
              <button 
                onClick={onStartCustomizing}
                className="group relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary to-primary-dark dark:from-gray-100 dark:to-gray-200 text-white dark:text-primary font-bold text-lg rounded-full hover:from-primary-dark hover:to-primary dark:hover:from-gray-200 dark:hover:to-gray-100 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl animate-pulse hover:animate-none overflow-hidden"
              >
                {/* Animated background shimmer */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-gray-200/20 to-transparent transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                
                {/* Button content */}
                <span className="relative z-10 flex items-center gap-2">
                  {data.primary_cta?.text || t('navigation.startCustomizing')} 
                  <span className="transform group-hover:rotate-12 transition-transform duration-300">✨</span>
                </span>
              </button>
            ) : (
              <Link 
                href={data.primary_cta?.link || '/customize'} 
                className="group relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary to-primary-dark dark:from-gray-100 dark:to-gray-200 text-white dark:text-primary font-bold text-lg rounded-full hover:from-primary-dark hover:to-primary dark:hover:from-gray-200 dark:hover:to-gray-100 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl animate-pulse hover:animate-none overflow-hidden"
              >
                {/* Animated background shimmer */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-gray-200/20 to-transparent transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              
                {/* Button content */}
                <span className="relative z-10 flex items-center gap-2">
                  {data.primary_cta?.text || t('navigation.startCustomizing')} 
                  <span className="transform group-hover:rotate-12 transition-transform duration-300">✨</span>
                </span>
              </Link>
            )}
            
            {data.secondary_cta && (
              <Link 
                href={data.secondary_cta.link} 
                className="inline-flex items-center px-8 py-4 border-2 border-gray-300 dark:border-gray-200 text-gray-700 dark:text-gray-200 font-bold text-lg rounded-full hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-200 dark:hover:text-primary transform hover:scale-105 transition-all duration-300"
              >
                {data.secondary_cta.text} 🎯
              </Link>
            )}
          </div>
          
          {/* Optional stats or badges */}
          {data.stats && (
                        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
              {data.stats.map((stat: any, index: number) => (
                <div key={index} className="text-center">
                  <div className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                  <div className="text-gray-600 dark:text-gray-300 text-sm lg:text-base">{stat.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="w-6 h-10 border-2 border-gray-400 dark:border-gray-300/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gray-500 dark:bg-gray-300/70 rounded-full mt-2 animate-bounce"></div>
        </div>
      </div>
    </section>
  );
}

// Features Section Component
function FeaturesSection({ data }: { data: any }) {
  // Handle both array format (legacy) and object format (new)
  const isArrayFormat = Array.isArray(data);
  const featuresItems = isArrayFormat ? data : data.items || [];
  const title = isArrayFormat ? "Features" : (data.title || "Features");
  const subtitle = isArrayFormat ? undefined : data.subtitle;

  return (
    <section id="features" className="py-12 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuresItems.map((feature: any, index: number) => {
            const cardVariants = [
              'bg-gray-50 dark:bg-gray-800',
              'bg-white dark:bg-gray-900',
              'bg-gradient-to-br from-indigo-50 via-white to-indigo-100 dark:from-indigo-950 dark:via-gray-900 dark:to-indigo-900/40',
              'bg-gradient-to-br from-rose-50 via-white to-rose-100 dark:from-rose-950 dark:via-gray-900 dark:to-rose-900/40',
              'bg-gradient-to-br from-amber-50 via-white to-amber-100 dark:from-amber-950 dark:via-gray-900 dark:to-amber-900/40',
              'bg-gradient-to-br from-green-50 via-white to-green-100 dark:from-green-950 dark:via-gray-900 dark:to-green-900/40',
              'bg-gradient-to-br from-violet-50 via-white to-violet-100 dark:from-violet-950 dark:via-gray-900 dark:to-violet-900/40',
              'bg-slate-50 dark:bg-slate-800'
            ];
            const motion = [
              'hover:-translate-y-1',
              'hover:translate-y-1',
              'hover:rotate-1',
              'hover:-rotate-1',
              'hover:scale-[1.03]',
              'hover:translate-x-1',
              'hover:-translate-x-1',
              'hover:skew-y-1'
            ];
            const borders = [
              'border border-transparent',
              'border border-indigo-200 dark:border-indigo-700/50',
              'border border-rose-200 dark:border-rose-700/50',
              'border border-amber-200 dark:border-amber-700/50',
              'border border-green-200 dark:border-green-700/50',
              'border border-violet-200 dark:border-violet-700/50',
              'border border-blue-200 dark:border-blue-700/50',
              'border border-slate-200 dark:border-slate-600/60'
            ];
            const alignments = [
              'text-center',
              'text-left',
              'text-center',
              'text-left',
              'text-center',
              'text-left',
              'text-center',
              'text-left'
            ];
            const wrapperVariants = [
              'rounded-full',
              'rounded-xl rotate-1',
              'rounded-lg -rotate-1 ring-2 ring-offset-2 ring-indigo-300 dark:ring-indigo-700/60',
              'rounded-full ring-2 ring-rose-300 dark:ring-rose-600/60',
              'rounded-2xl border border-amber-300 dark:border-amber-600',
              'rounded-xl ring-2 ring-green-300 dark:ring-green-700/60',
              'rounded-full border border-violet-300 dark:border-violet-600',
              'rounded-lg ring-1 ring-slate-300 dark:ring-slate-600'
            ];
            const bgGradients = [
              'bg-indigo-50 dark:bg-indigo-900/40',
              'bg-rose-50 dark:bg-rose-900/40',
              'bg-green-50 dark:bg-green-900/40',
              'bg-amber-50 dark:bg-amber-900/40',
              'bg-blue-50 dark:bg-blue-900/40',
              'bg-orange-50 dark:bg-orange-900/40',
              'bg-violet-50 dark:bg-violet-900/40',
              'bg-slate-50 dark:bg-slate-800/60'
            ];
            const iconSizes = ['w-8 h-8','w-9 h-9','w-10 h-10','w-9 h-9','w-8 h-8','w-9 h-9','w-10 h-10','w-8 h-8'];
            const variant = index % wrapperVariants.length;
            // Eliminate rotation for the third card (index 2) per request
            let motionClass = motion[index % motion.length];
            if (index === 2 && motionClass.includes('rotate')) {
              motionClass = 'hover:scale-[1.03]';
            }
            let wrapperClass = wrapperVariants[variant];
            if (index === 2 && /rotate/.test(wrapperClass)) {
              wrapperClass = wrapperClass.replace(/ ?-?rotate-?\d+/g, '').trim();
            }
            return (
              <div
                key={index}
                className={`relative ${alignments[index % alignments.length]} p-8 rounded-2xl transition-all duration-500 ease-out shadow-sm hover:shadow-xl ${cardVariants[index % cardVariants.length]} ${motionClass} ${borders[index % borders.length]}`}
              >
                <span
                  className={`absolute -top-3 -left-3 text-xs font-semibold text-white px-2 py-1 rounded-full shadow ${[
                    'bg-indigo-500/90',
                    'bg-rose-500/90',
                    'bg-green-600/90',
                    'bg-amber-500/90',
                    'bg-blue-600/90',
                    'bg-orange-500/90',
                    'bg-violet-600/90',
                    'bg-slate-600/90'
                  ][index % 8]}`}
                >
                  {index + 1}
                </span>
                <div
                  className={`w-16 h-16 mx-auto mb-6 flex items-center justify-center shadow-sm backdrop-blur-sm ${wrapperClass} ${bgGradients[variant]}`}
                >
                  <div className={`text-2xl ${iconSizes[variant]}`}>{getFeatureIcon(feature.icon, index)}</div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description || feature.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// Examples Section Component
function ExamplesSection({ data }: { data: any }) {
  if (data.items && Array.isArray(data.items)) {
    return (
      <section id="examples" className="py-12 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {data.title}
            </h2>
            {data.subtitle && (
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                {data.subtitle}
              </p>
            )}
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {data.items.map((item: any, index: number) => {
              const shellStyles = [
                'bg-gradient-to-br from-fuchsia-50 to-fuchsia-100 dark:from-fuchsia-950 dark:to-fuchsia-900/30',
                'bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900/30',
                'bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900/30',
                'bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950 dark:to-indigo-900/30',
                'bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-950 dark:to-rose-900/30',
                'bg-gradient-to-br from-sky-50 to-sky-100 dark:from-sky-950 dark:to-sky-900/30',
                'bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-950 dark:to-teal-900/30',
                'bg-gradient-to-br from-violet-50 to-violet-100 dark:from-violet-950 dark:to-violet-900/30'
              ];
              const ringStyles = [
                'ring-fuchsia-300/50 dark:ring-fuchsia-600/40',
                'ring-emerald-300/50 dark:ring-emerald-600/40',
                'ring-amber-300/50 dark:ring-amber-600/40',
                'ring-indigo-300/50 dark:ring-indigo-600/40',
                'ring-rose-300/50 dark:ring-rose-600/40',
                'ring-sky-300/50 dark:ring-sky-600/40',
                'ring-teal-300/50 dark:ring-teal-600/40',
                'ring-violet-300/50 dark:ring-violet-600/40'
              ];
              const shape = [
                'rounded-full rotate-0',
                'rounded-xl rotate-1',
                'rounded-2xl -rotate-1',
                'rounded-lg rotate-2',
                'rounded-full -rotate-2',
                'rounded-xl rotate-3',
                'rounded-2xl -rotate-3',
                'rounded-lg rotate-1'
              ][index % 8];
              return (
                <div key={index} className="relative group p-8 rounded-2xl bg-white dark:bg-gray-900 shadow-sm hover:shadow-xl transition-all duration-500">
                  <span className="absolute -top-3 -right-3 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-black/10 dark:bg-white/10 text-gray-700 dark:text-gray-200 tracking-wider">
                    THEME {index + 1}
                  </span>
                  <div className={`w-16 h-16 mx-auto mb-5 flex items-center justify-center shadow-inner backdrop-blur-sm ring-2 ${shellStyles[index % 8]} ${ringStyles[index % 8]} ${shape}`}>
                    {getThemeIcon(index)}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 font-medium text-center leading-relaxed">
                    {item.text || item}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  if (data.examples && Array.isArray(data.examples)) {
    return (
      <section id="examples" className="py-12 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {data.title}
            </h2>
            {data.subtitle && (
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                {data.subtitle}
              </p>
            )}
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.examples.map((example: any, index: number) => {
              return (
                <div key={index} className="relative bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all">
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-14 h-14 flex items-center justify-center rounded-xl ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-900 ${[
                      'bg-fuchsia-50 dark:bg-fuchsia-900/30 ring-fuchsia-400/40 dark:ring-fuchsia-500/40',
                      'bg-emerald-50 dark:bg-emerald-900/30 ring-emerald-400/40 dark:ring-emerald-500/40',
                      'bg-amber-50 dark:bg-amber-900/30 ring-amber-400/40 dark:ring-amber-500/40',
                      'bg-indigo-50 dark:bg-indigo-900/30 ring-indigo-400/40 dark:ring-indigo-500/40',
                      'bg-rose-50 dark:bg-rose-900/30 ring-rose-400/40 dark:ring-rose-500/40',
                      'bg-sky-50 dark:bg-sky-900/30 ring-sky-400/40 dark:ring-sky-500/40',
                      'bg-teal-50 dark:bg-teal-900/30 ring-teal-400/40 dark:ring-teal-500/40',
                      'bg-violet-50 dark:bg-violet-900/30 ring-violet-400/40 dark:ring-violet-500/40'
                    ][index % 8]}`}>
                      {getThemeIcon(index)}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 tracking-tight">
                        {example.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 font-medium uppercase tracking-wide">
                        {example.child}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 leading-snug">
                        {example.adventure}
                      </p>
                    </div>
                  </div>
                  <blockquote className="text-gray-700 dark:text-gray-300 italic border-l-4 border-transparent pl-4 relative">
                    <span className="absolute -left-1 top-0 w-1 h-full rounded bg-gradient-to-b from-transparent via-current to-transparent opacity-30"></span>
                    “{example.preview}”
                  </blockquote>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  return null;
}

// Adventure Possibilities Section Component
function AdventurePossibilitiesSection({ data }: { data: any }) {
  if (!data.cards || !Array.isArray(data.cards)) return null;

  return (
    <section id="adventures" className="py-12 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            {data.title}
          </h2>
          {data.subtitle && (
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {data.subtitle}
            </p>
          )}
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.cards.map((card: any, index: number) => (
            <div 
              key={index} 
              className="group bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 p-8 rounded-2xl hover:shadow-xl hover:scale-105 border border-primary/20 transition-all duration-500 ease-out transform"
            >
              <div className="w-16 h-16 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:shadow-md transition-all">
                {getFeatureIcon(card.icon)}
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 text-center">
                {card.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-center leading-relaxed">
                {card.description}
              </p>
              <div className="mt-6 text-center">
                <div className="inline-flex items-center text-primary dark:text-primary-light text-sm font-medium group-hover:translate-x-1 transition-transform">
                  Explore this adventure <ArrowRight className="ml-1 w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            ✨ <span className="font-semibold">Can't find the perfect adventure?</span> We can create a completely custom story just for your child!
          </p>
        </div>
      </div>
    </section>
  );
}

// Demo Video Section Component
function DemoVideoSection({ t }: { t: (key: string) => string }) {
  return (
    <section id="demo-video" className="py-12 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {t('demo.watchTitle')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              {t('demo.watchDescription')}
            </p>
            {/* 9:16 aspect ratio container */}
            <div className="relative mx-auto bg-gray-200 dark:bg-gray-700 rounded-2xl overflow-hidden shadow-2xl" style={{ width: '300px', height: '533px' }}>
              <video 
                className="w-full h-full object-cover bg-black"
                controls
                preload="metadata"
                onLoadStart={() => console.log('Video loading started')}
                onCanPlay={() => console.log('Video can play')}
                onError={(e) => console.error('Video error:', e)}
              >
                <source 
                  src="/Personalized_Button/demo.mp4" 
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// How It Works Section Component
function HowItWorksSection({ data, t }: { data: any; t: (key: string) => string }) {
  return (
    <section id="how-it-works" className="py-12 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            {data?.title || t("fallback.howItWorks")}
          </h2>
        </div>
        
        {/* Steps Section - Only show if data exists and has steps */}
        {data?.steps && Array.isArray(data.steps) && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {data.steps.map((step: any, index: number) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  {index + 1}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        )}
        
        {/* Fallback content if no steps provided */}
        {(!data?.steps || !Array.isArray(data.steps)) && (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400">
              Ready to get started? Use our simple customization process!
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

// Pricing Section Component
function PricingSection({ data, onStartCustomizing }: { data: any; onStartCustomizing: () => void }) {
  // Handle the new pricing structure with plans array
  if (data.plans && Array.isArray(data.plans)) {
    return (
      <section id="pricing" className="py-12 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {data.title}
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {data.plans.map((plan: any, index: number) => (
              <div key={index} className={`p-8 rounded-2xl ${index === 1 ? 'bg-primary/5 dark:bg-primary/10 border-2 border-primary' : 'bg-gray-50 dark:bg-gray-800'}`}>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {plan.name}
                </h3>
                <div className="text-3xl font-bold text-primary dark:text-primary-light mb-6">
                  {plan.price}
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature: string, featureIndex: number) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={onStartCustomizing}
                  className={`w-full py-3 rounded-xl transition-colors ${
                    index === 1 
                      ? 'bg-primary text-white hover:bg-primary-dark' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  Choose {plan.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Handle the old book_options structure
  if (data.digital && data.printed) {
    return (
      <section id="pricing" className="py-12 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {data.title}
            </h2>
            {data.description && (
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                {data.description}
              </p>
            )}
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {data.digital.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {data.digital.subtitle}
              </p>
              <div className="text-3xl font-bold text-primary dark:text-primary-light mb-6">
                {data.digital.price}
              </div>
              <ul className="space-y-3 mb-8">
                {data.digital.features.map((feature: string, index: number) => (
                  <li key={index} className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={onStartCustomizing}
                className="w-full py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Choose Digital
              </button>
            </div>
            
            <div className="bg-primary/5 dark:bg-primary/10 p-8 rounded-2xl border-2 border-primary relative">
              {data.printed.popular_badge && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-white px-4 py-2 rounded-full text-sm font-medium">
                    {data.printed.popular_badge}
                  </span>
                </div>
              )}
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {data.printed.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {data.printed.subtitle}
              </p>
              <div className="text-3xl font-bold text-primary dark:text-primary-light mb-6">
                {data.printed.price}
              </div>
              <ul className="space-y-3 mb-8">
                {data.printed.features.map((feature: string, index: number) => (
                  <li key={index} className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={onStartCustomizing}
                className="w-full py-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors"
              >
                Choose Printed
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return null;
}

// FAQ Section Component
function FaqSection({ data }: { data: any[] }) {
  const { t } = useLanguage();
  return (
    <section id="faq" className="py-12 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            {t("faq.title")}
          </h2>
        </div>
        
        <div className="max-w-3xl mx-auto space-y-8">
          {data.map((item: any, index: number) => (
            <div key={index} className="bg-white dark:bg-gray-900 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {item.q}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// CTA Section Component
function CtaSection({ data, onStartCustomizing, t }: { data: any; onStartCustomizing: () => void; t: (key: string) => string }) {
  return (
    <section className="py-12 bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
          {data.title}
        </h2>
        {data.description && (
          <p className="text-xl mb-12 max-w-3xl mx-auto opacity-90">
            {data.description}
          </p>
        )}
        <button
          onClick={onStartCustomizing}
          className="group inline-flex items-center px-8 py-4 bg-white text-primary font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105"
        >
          {data.button || t("fallback.getStarted")}
          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </section>
  );
}

// About Section Component
function AboutSection({ data, bgClass }: { data: any; bgClass: string }) {
  return (
    <section id="about" className={`py-24 ${bgClass}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-8">
            {data.title || "About"}
          </h2>
          
          {data.text && (
            <div className="prose prose-lg dark:prose-invert mx-auto max-w-none">
              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                {data.text}
              </p>
            </div>
          )}
          
          {data.subtitle && !data.text && (
            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              {data.subtitle}
            </p>
          )}
          
          {data.description && !data.text && (
            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              {data.description}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

// Generic Section Component for any unknown section type
function GenericSection({ sectionKey, data, bgClass }: { sectionKey: string; data: any; bgClass: string }) {
  // Create a readable title from the section key
  const title = sectionKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <section id={sectionKey} className={`py-24 ${bgClass}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            {data.title || title}
          </h2>
          {data.subtitle && (
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {data.subtitle}
            </p>
          )}
        </div>
        
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-8">
          <pre className="text-sm text-gray-600 dark:text-gray-400 overflow-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      </div>
    </section>
  );
}

// Urgency Banner Component
function UrgencyBannerSection({ data }: { data: any }) {
  if (!data.text) return null;

  const isHighlight = data.style === 'highlight';

  return (
    <div className={`
      ${isHighlight 
        ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500 text-white' 
        : 'bg-gradient-to-r from-slate-700 to-slate-800 text-white'
      } py-3 px-4 text-center text-sm font-medium relative overflow-hidden
    `}>
      {/* Animated background for highlight style */}
      {isHighlight && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
      )}
      
      <div className="max-w-7xl mx-auto relative z-10 flex items-center justify-center space-x-2">
        <span>{data.text}</span>
        {isHighlight && <span className="animate-bounce">⚡</span>}
      </div>
    </div>
  );
}

// Gallery Section Component (Images for most products, Audio grid for Song)
const GallerySection = React.memo(function GallerySection({ data, t }: { data: any; t: (key: string) => string }) {
  const [discoveredImages, setDiscoveredImages] = useState<string[]>([]);
  const [imageStatuses, setImageStatuses] = useState<{ [key: string]: { exists: boolean; path: string } }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [audioSources, setAudioSources] = useState<string[]>([]);
  const initialPlayback = typeof window !== 'undefined' ? getPlaybackState() : { index: null } as any;
  const [playingIndex, setPlayingIndex] = useState<number | null>(initialPlayback.index);
  const [durations, setDurations] = useState<number[]>([]);
  const [positions, setPositions] = useState<number[]>([]);
  const [failedAudio, setFailedAudio] = useState<Set<number>>(() => new Set());
  // force re-render on timeUpdate without coupling to playingIndex
  const [, setTick] = useState<number>(0);
  const rafRef = React.useRef<number | null>(null);
  // Single global audio element (not recreated on re-renders)
  const globalAudioRef = React.useRef<HTMLAudioElement | null>(null);
  // Track the last paused index so we can resume without resetting src
  const lastPausedRef = React.useRef<number | null>(null);
  useEffect(() => {
    if (typeof window !== 'undefined' && !globalAudioRef.current) {
      globalAudioRef.current = getGlobalAudio();
      const el = globalAudioRef.current;
      if (el) {
        const handleEnded = () => {
          if (playingIndex != null) {
            const idx = playingIndex;
            setPlayingIndex(null);
            try {
              const baseName = extractBaseName(audioSources[idx]);
              comprehensiveTracker.trackAudioEnd(idx, baseName, el.duration || durations[idx] || 0);
            } catch {}
          }
        };
        const handleLoaded = () => {
          if (playingIndex != null) {
            const d = el.duration;
            setDurations(ds => {
              if (ds[playingIndex] === d) return ds;
              const next = [...ds];
              next[playingIndex] = d;
              return next;
            });
            setTick(t => t + 1);
          }
        };
        const handleTime = () => {
          if (playingIndex != null) {
            setTick(t => t + 1);
            try { setPlaybackState({ time: el.currentTime, index: playingIndex, baseName: extractBaseName(audioSources[playingIndex]) }); } catch {}
            setPositions(prev => {
              const length = audioSources.length;
              if (!length) return prev;
              const next = prev.length === length ? [...prev] : Array(length).fill(0);
              next[playingIndex] = el.currentTime || 0;
              return next;
            });
          }
        };
        // Extra: requestAnimationFrame loop for smoother progress (timeupdate can be sparse)
        const startRaf = () => {
          if (rafRef.current != null) return;
          const loop = () => {
            if (el && !el.paused && playingIndex != null) {
              setTick(t => t + 1);
              try { setPlaybackState({ time: el.currentTime, index: playingIndex, baseName: extractBaseName(audioSources[playingIndex]) }); } catch {}
              setPositions(prev => {
                if (playingIndex == null) return prev;
                const length = audioSources.length;
                const next = prev.length === length ? [...prev] : Array(length).fill(0);
                next[playingIndex] = el.currentTime || 0;
                return next;
              });
              rafRef.current = requestAnimationFrame(loop);
            } else {
              rafRef.current = null;
            }
          };
          rafRef.current = requestAnimationFrame(loop);
        };
        const handlePlay = () => { startRaf(); };
        el.addEventListener('play', handlePlay);
        el.addEventListener('pause', () => { if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; } });
        // If already playing when mounted
        if (!el.paused) startRaf();
        el.addEventListener('ended', handleEnded);
        el.addEventListener('loadedmetadata', handleLoaded);
        el.addEventListener('timeupdate', handleTime);
        return () => {
          el.removeEventListener('ended', handleEnded);
          el.removeEventListener('loadedmetadata', handleLoaded);
          el.removeEventListener('timeupdate', handleTime);
          el.removeEventListener('play', handlePlay);
          if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
        };
      }
    }
  }, [playingIndex, audioSources, durations]);

  // (interval updater moved below after isSong is defined)
  const currentProduct = React.useMemo(() => getCurrentProduct(), []);
  const currentLanguage = React.useMemo(() => getCurrentLanguage(), []);
  const isSong = currentProduct === 'Song';
  // Fallback interval updater (ensures UI ticks even if timeupdate sparse or RAF throttled)
  useEffect(() => {
    if (!isSong) return;
    const el = globalAudioRef.current;
    if (!el) return;
    let interval: number | null = null;
    if (playingIndex != null) {
      interval = window.setInterval(() => {
        if (!el.paused) {
          setTick(t => t + 1);
          setPositions(prev => {
            const len = audioSources.length;
            if (!len) return prev;
            const next = prev.length === len ? [...prev] : Array(len).fill(0);
            next[playingIndex] = el.currentTime || 0;
            return next;
          });
          try { setPlaybackState({ time: el.currentTime, index: playingIndex, baseName: extractBaseName(audioSources[playingIndex]) }); } catch {}
        }
      }, 300);
    }
    return () => { if (interval) window.clearInterval(interval); };
  }, [playingIndex, isSong, audioSources]);
  const horizontalRef = React.useRef<HTMLDivElement | null>(null);
  const lastScrollPercentRef = React.useRef<number>(-1);
  const lastScrollTrackTs = React.useRef<number>(0);

  // Discover images (non Song)
  useEffect(() => {
    if (isSong) return;
    const discoverImages = async () => {
      setIsLoading(true);
      try {
        const allImages = await getAllImagesInFolder('gallery', currentProduct, currentLanguage);
        setDiscoveredImages(allImages);
        const statuses: { [key: string]: { exists: boolean; path: string } } = {};
        for (const imageName of allImages) {
          const result = await imageExistsWithFallback(imageName, 'gallery', currentProduct, currentLanguage);
          statuses[imageName] = result;
        }
        setImageStatuses(statuses);
      } catch (e) {
        console.error('Error discovering gallery images', e);
      } finally {
        setIsLoading(false);
      }
    };
    discoverImages();
  }, [currentProduct, currentLanguage, isSong]);

  // Discover audios (Song)
  useEffect(() => {
    if (!isSong) return;
    const loadAudios = async () => {
      setIsLoading(true);
      try {
  const audios = await getGalleryAudios(24, currentProduct, currentLanguage);
  setAudioSources(audios);
  setDurations(prev => audios.length !== prev.length ? Array(audios.length).fill(0) : prev);
  setPositions(prev => audios.length !== prev.length ? Array(audios.length).fill(0) : prev);
      } catch (e) {
        console.error('Error loading gallery audios', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadAudios();
  }, [currentProduct, currentLanguage, isSong]);

  // Debug: fetch first bytes of each audio to verify correct RIFF header when ?audioDebug=1
  useEffect(() => {
    if (!isSong) return;
    if (!audioSources.length) return;
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    if (!params.has('audioDebug')) return;
    (async () => {
      console.log('[AudioDebug] Inspecting first 32 bytes of each audio file');
      for (let i = 0; i < audioSources.length; i++) {
        const src = audioSources[i];
        try {
          const res = await fetch(src, { headers: { 'Range': 'bytes=0-31' } });
          if (!res.ok && res.status !== 206) {
            console.warn('[AudioDebug] Non-OK status', res.status, 'for', src);
            continue;
          }
          const buf = new Uint8Array(await res.arrayBuffer());
          const hex = Array.from(buf).map(b=>b.toString(16).padStart(2,'0')).join(' ');
          const ascii = Array.from(buf).map(b => (b>=32 && b<=126)? String.fromCharCode(b) : '.').join('');
          console.log(`[AudioDebug] #${i+1} ${src} bytes=`, hex, ' ascii=', ascii);
          if (!(ascii.startsWith('RIFF') && ascii.includes('WAVE'))) {
            console.warn('[AudioDebug] Missing RIFF/WAVE header (possibly HTML?) for', src);
          }
        } catch (e) {
          console.warn('[AudioDebug] Failed to fetch bytes for', src, e);
        }
      }
    })();
  }, [audioSources, isSong]);

  // Prefetch metadata with a small concurrency limit to avoid many parallel network requests (faster first paint)
  useEffect(() => {
    if (!isSong) return;
    if (!audioSources.length) return;
    // Limit initial batch (e.g., first 6) then expand after user interaction/visibility
    const INITIAL_BATCH = 6;
    const CONCURRENCY = 3;
    let active = 0;
    let index = 0;
    let cancelled = false;
    const queue: HTMLAudioElement[] = [];
    let expanded = false;

    const targetCountRef = { current: Math.min(INITIAL_BATCH, audioSources.length) } as { current: number };

    const launchNext = () => {
      if (cancelled) return;
      while (active < CONCURRENCY && index < targetCountRef.current) {
        const i = index++;
        if (durations[i]) continue;
        try {
          const el = document.createElement('audio');
          el.preload = 'metadata';
          el.src = audioSources[i];
          queue.push(el);
          active++;
          const done = () => {
            if (!cancelled) {
              if (!isNaN(el.duration) && el.duration > 0) {
                setDurations(prev => {
                  if (prev[i]) return prev;
                  const next = [...prev];
                  next[i] = el.duration;
                  return next;
                });
              }
            }
            el.removeEventListener('loadedmetadata', done);
            el.removeEventListener('error', done);
            active--;
            launchNext();
          };
          el.addEventListener('loadedmetadata', done);
          el.addEventListener('error', done);
        } catch {
          active--;
        }
      }
    };

    const expand = () => {
      if (expanded) return;
      expanded = true;
      targetCountRef.current = audioSources.length; // fetch rest
      launchNext();
    };

    // Expand on first horizontal scroll or after 4s idle whichever comes first
    const scrollEl = horizontalRef.current;
    const onScrollOnce = () => { expand(); scrollEl && scrollEl.removeEventListener('scroll', onScrollOnce); };
    scrollEl && scrollEl.addEventListener('scroll', onScrollOnce, { passive: true });
    const timeoutId = window.setTimeout(expand, 4000);

    // Also expand when gallery section enters viewport (IntersectionObserver)
    const sectionEl = scrollEl; // same container is fine
    let observer: IntersectionObserver | null = null;
    if (sectionEl && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            expand();
            observer && observer.disconnect();
          }
        });
      }, { threshold: 0.15 });
      observer.observe(sectionEl);
    }

    launchNext();
    return () => {
      cancelled = true;
      queue.forEach(a => { try { a.src = ''; } catch {} });
      scrollEl && scrollEl.removeEventListener('scroll', onScrollOnce);
      window.clearTimeout(timeoutId);
      observer && observer.disconnect();
    };
  }, [isSong, audioSources, durations]);

  // ===================== PERSIST / RESTORE PLAYBACK =====================
  const RESTORE_KEY = 'gallery_audio_state_v1';
  const restoreAttemptedRef = React.useRef(false);

  // On unmount store current playing audio (if any)
  useEffect(() => {
    return () => {
      try {
        if (playingIndex != null) {
          const el = globalAudioRef.current;
          if (el) {
            const baseName = extractBaseName(audioSources[playingIndex]);
            sessionStorage.setItem(RESTORE_KEY, JSON.stringify({ baseName, time: el.currentTime || 0, ts: Date.now() }));
          }
        } else {
          sessionStorage.removeItem(RESTORE_KEY);
        }
      } catch {}
    };
  }, [playingIndex, audioSources]);

  // After audios load, attempt restore once
  useEffect(() => {
    if (!isSong) return;
    if (!audioSources.length) return;
    if (restoreAttemptedRef.current) return;
    restoreAttemptedRef.current = true;
    try {
      const raw = sessionStorage.getItem(RESTORE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw) as { baseName: string; time: number; ts: number };
      // Ignore very old sessions (> 30 min)
      if (Date.now() - data.ts > 30 * 60 * 1000) { sessionStorage.removeItem(RESTORE_KEY); return; }
      const idx = audioSources.findIndex(src => extractBaseName(src) === data.baseName);
      if (idx === -1) return;
  const el = globalAudioRef.current;
      if (el) {
        const applyAndPlay = () => {
          try { el.currentTime = Math.min(data.time, el.duration || data.time); } catch {}
          const playAttempt = el.play();
          if (playAttempt && typeof playAttempt.then === 'function') {
            playAttempt.then(() => {
              setPlayingIndex(idx);
              try { comprehensiveTracker.trackAudioPlay(idx, data.baseName, el.duration || durations[idx] || 0); } catch {}
            }).catch(() => {});
          } else {
            setPlayingIndex(idx);
          }
        };
        if (el.readyState >= 1) {
          applyAndPlay();
        } else {
          el.addEventListener('loadedmetadata', applyAndPlay, { once: true });
        }
      }
    } catch {}
  }, [audioSources, isSong, durations]);

  const recommendations = getRecommendedImageCounts('gallery');

  function extractBaseName(url: string): string {
    try {
      const u = new URL(url, typeof window !== 'undefined' ? window.location.origin : 'http://localhost');
      const qp = u.searchParams.get('file');
      if (qp) return qp.toString();
      const segs = u.pathname.split('/').filter(Boolean);
      const last = segs[segs.length - 1] || '';
      return last.replace(/\.[a-zA-Z0-9]+$/, '');
    } catch { return ''; }
  }

  const togglePlay = (index: number) => {
    const el = globalAudioRef.current;
    if (!el) return;
    const targetSrc = audioSources[index];
    const baseNameForResume = extractBaseName(targetSrc);

    // CASE 1: Resume previously paused same track (playingIndex null, lastPausedRef matches)
    if (playingIndex == null && lastPausedRef.current === index) {
      // Ensure we don't accidentally overwrite the source if same track
      if (el.src.includes(targetSrc)) {
        const resumeAttempt = el.play();
        if (resumeAttempt && typeof resumeAttempt.then === 'function') {
          resumeAttempt.then(() => {
            if (!el.paused) {
              setPlayingIndex(index);
              setPlaybackState({ index, baseName: baseNameForResume, time: el.currentTime || 0 });
              try { comprehensiveTracker.trackAudioPlay(index, baseNameForResume, el.duration || durations[index] || 0); } catch {}
            }
          }).catch(() => {});
        } else if (!el.paused) {
          setPlayingIndex(index);
          setPlaybackState({ index, baseName: baseNameForResume, time: el.currentTime || 0 });
        }
        return;
      }
    }
    // If clicking the currently active track, toggle pause/play without resetting src
  if (playingIndex === index) {
      if (el.paused) {
        // Resume
        const resumeAttempt = el.play();
        if (resumeAttempt && typeof resumeAttempt.then === 'function') {
          resumeAttempt.then(() => {
            if (!el.paused) {
              setPlaybackState({ index, baseName: extractBaseName(targetSrc), time: el.currentTime || 0 });
            }
          }).catch(() => {});
        }
      } else {
        // Pause
        try { el.pause(); } catch {}
    lastPausedRef.current = index;
    setPlaybackState({ index: null, baseName: extractBaseName(targetSrc), time: el.currentTime || 0 });
    setPlayingIndex(null);
      }
      return;
    }

    // Switching to a different track
    if (playingIndex != null && playingIndex !== index) {
      try { el.pause(); } catch {}
    }

    // Always reset src when switching tracks (cache-bust with index to avoid Safari stale buffer)
    try { el.src = `${targetSrc}?v=${index}`; } catch {}
    ;(el as any)._altTried = false;
    ;(el as any)._blobFallbackTried = false;
  const baseName = extractBaseName(targetSrc);
    const playAttempt = el.play();
    if (playAttempt && typeof playAttempt.then === 'function') {
      playAttempt.then(() => {
        if (!el.paused) {
          setPlayingIndex(index);
      lastPausedRef.current = null;
          setPlaybackState({ index, baseName, time: el.currentTime || 0 });
          try { comprehensiveTracker.trackAudioPlay(index, baseName, el.duration || durations[index] || 0); } catch {}
          try { sessionStorage.setItem(RESTORE_KEY, JSON.stringify({ baseName, time: el.currentTime || 0, ts: Date.now() })); } catch {}
        }
      }).catch(() => {});
    } else if (!el.paused) {
      setPlayingIndex(index);
    lastPausedRef.current = null;
      setPlaybackState({ index, baseName, time: el.currentTime || 0 });
    }
    // One-time robust error handler (determine failing index by matching currentSrc)
    if (!(el as any)._errorBound) {
      (el as any)._errorBound = true;
      el.addEventListener('error', () => {
        try {
          const failing = el.currentSrc;
          const mediaErr = (el as any).error;
          const failingIdx = audioSources.findIndex(s => failing.endsWith(s) || failing.includes(s + '?v='));
          console.warn('[GalleryAudio] Playback error', mediaErr?.code, 'for', failing, 'resolvedIndex=', failingIdx);
          if (failingIdx >= 0) {
            // Do NOT permanently mark failed unless repeated
            setFailedAudio(prev => {
              const next = new Set(prev);
              const key = failingIdx;
              if (next.has(key)) {
                // repeated failure – keep it
              } else {
                next.add(key);
                // Schedule a retry clearing after short delay (transient errors)
                setTimeout(() => setFailedAudio(p => { const n = new Set(p); n.delete(key); return n; }), 3000);
              }
              return next;
            });
          }
        } catch {}
      });
    }
  };

  // (extractBaseName hoisted earlier)

  const handleHorizontalScroll = () => {
    const el = horizontalRef.current;
    if (!el) return;
    const now = Date.now();
    const totalScrollable = el.scrollWidth - el.clientWidth;
    if (totalScrollable <= 0) return;
    const percent = Math.round((el.scrollLeft / totalScrollable) * 100);
    // Only track meaningful changes (>=5%) and throttle to 1 event / 750ms
    if (Math.abs(percent - lastScrollPercentRef.current) >= 5 && now - lastScrollTrackTs.current > 750) {
      lastScrollPercentRef.current = percent;
      lastScrollTrackTs.current = now;
      try {
  comprehensiveTracker.trackAudioGalleryScroll(percent);
      } catch {}
    }
  };

  return (
    <section id="gallery" className="py-12 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            {data.title || (isSong ? 'Audio Samples' : 'Gallery')}
          </h2>
          {data.subtitle && (
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">{data.subtitle}</p>
          )}
        </div>
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">{isSong ? 'Loading audio samples...' : 'Discovering gallery images...'}</p>
          </div>
        ) : isSong ? (
          audioSources.length > 0 ? (
            <div className="relative">
              <div ref={horizontalRef} onScroll={handleHorizontalScroll} className="overflow-x-auto flex gap-6 pb-4 pt-2 scrollbar-hide snap-x snap-mandatory px-1" style={{ WebkitOverflowScrolling: 'touch' }}>
                {audioSources.map((src, i) => {
                  const ga = globalAudioRef.current;
                  const isActive = playingIndex === i;
                  const savedState = getPlaybackState();
                  const duration = durations[i] || ((isActive || savedState.index === i) && ga ? ga.duration : 0) || 0;
                  const current = isActive
                    ? (positions[i] ?? (ga ? ga.currentTime : 0) ?? 0)
                    : (savedState.index === i ? savedState.time : (positions[i] ?? 0));
                  const progress = duration ? (current / duration) : 0;
                  const gradientPalette = [
                    'from-fuchsia-500 via-pink-500 to-rose-500',
                    'from-indigo-500 via-violet-500 to-purple-500',
                    'from-teal-500 via-emerald-500 to-lime-500',
                    'from-amber-500 via-orange-500 to-red-500',
                    'from-sky-500 via-cyan-500 to-blue-600',
                    'from-stone-500 via-gray-600 to-zinc-700'
                  ];
                  const gradient = gradientPalette[i % gradientPalette.length];
                  const format = (sec:number) => {
                    const m = Math.floor(sec/60); const s = Math.floor(sec%60); return `${m}:${String(s).padStart(2,'0')}`;
                  };
                  // isActive already computed above
                  return (
                    <div
                      key={src}
                      className="snap-start flex-shrink-0 w-48 h-48 sm:w-56 sm:h-56 relative group rounded-2xl overflow-visible"
                    >
                      <div className={`absolute inset-0 rounded-2xl overflow-hidden shadow-lg ring-1 ring-black/10 dark:ring-white/10 bg-gradient-to-br text-white`}> 
                        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-90 group-hover:opacity-100 transition-opacity`} />
                        <div
                          className="absolute inset-0 rounded-2xl pointer-events-none"
                          style={{
                            background: `conic-gradient(rgba(255,255,255,0.35) ${progress * 360}deg, rgba(255,255,255,0.1) 0deg)`
                          }}
                        />
                        <div className={`absolute inset-0 transition-transform duration-300 ease-out will-change-transform ${isActive ? 'scale-105' : 'group-hover:scale-105 group-active:scale-105'}`}>
                          <button
                            onClick={() => { 
                              try { 
                                const baseName = extractBaseName(audioSources[i]); 
                                comprehensiveTracker.trackAudioCardClick(i, baseName); 
                              } catch {}
                              togglePlay(i); 
                            }}
                            className={`absolute inset-0 flex flex-col items-center justify-center transition ${isActive ? 'backdrop-blur-sm' : 'backdrop-blur-[2px]'} focus:outline-none`}
                            aria-label={isActive ? 'Pause sample' : 'Play sample'}
                          >
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center bg-white/20 backdrop-blur-md shadow-inner transition transform ${isActive ? 'scale-90' : 'group-hover:scale-105'} border border-white/30`}> 
                              {isActive ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 9v6m4-6v6" />
                                </svg>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M5 3v18l15-9L5 3z" />
                                </svg>
                              )}
                            </div>
                            <div className="flex mt-4 gap-1 h-6">
                              {[0,1,2].map(bar => (
                                <span
                                  key={bar}
                                  className={`w-1.5 rounded-full bg-white/80 origin-bottom ${isActive ? 'animate-[eqBounce_0.9s_ease-in-out_infinite]' : 'opacity-40'} `}
                                  style={{ animationDelay: `${bar * 0.15}s` }}
                                />
                              ))}
                            </div>
                          </button>
                          {/* Timing tape */}
                          <div className="absolute left-0 right-0 bottom-0 px-2 py-1.5 bg-black/45 backdrop-blur-md text-[11px] font-medium tabular-nums select-none">
                            <div className="flex items-center justify-between">
                              <span className="opacity-85 min-w-[32px] text-center">{format(current)}</span>
                              <div
                                className="flex-1 mx-2 h-1.5 bg-white/25 hover:bg-white/30 active:bg-white/40 rounded cursor-pointer relative group"
                                                onPointerDown={(e) => {
                                                  const trackEl = e.currentTarget as HTMLDivElement;
                                                  const audio = globalAudioRef.current;
                                                  // Allow scrubbing if this track is playing OR was the last paused one
                                                  const canScrub = playingIndex === i || (playingIndex == null && lastPausedRef.current === i);
                                                  if (!audio || !canScrub || !audio.duration) return;
                                                  const wasPlaying = !audio.paused;
                                                  if (wasPlaying) { try { audio.pause(); } catch {} }
                                                  const rect = trackEl.getBoundingClientRect();
                                                  const updateFromEvent = (clientX: number, final: boolean = false) => {
                                                    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
                                                    const prev = audio.currentTime;
                                                    const newTime = ratio * (audio.duration || 0);
                                                    try { audio.currentTime = newTime; } catch {}
                                                    setPositions(prevPos => {
                                                      const length = audioSources.length;
                                                      const next = prevPos.length === length ? [...prevPos] : Array(length).fill(0);
                                                      next[i] = newTime;
                                                      return next;
                                                    });
                                                    setTick(t => t + 1);
                                                    if (final && Math.abs(newTime - prev) > 0.5) {
                                                      try {
                                                        const baseName = extractBaseName(audioSources[i]);
                                                        comprehensiveTracker.trackAudioSeek(i, baseName, prev, newTime, audio.duration || 0);
                                                      } catch {}
                                                    }
                                                  };
                                                  updateFromEvent(e.clientX);
                                                  const move = (ev: PointerEvent) => { updateFromEvent(ev.clientX); };
                                                  const up = (ev: PointerEvent) => {
                                                    updateFromEvent(ev.clientX, true);
                                                    window.removeEventListener('pointermove', move);
                                                    window.removeEventListener('pointerup', up);
                                                    // Resume only if it was playing before
                                                    if (wasPlaying) {
                                                      const playAttempt = audio.play();
                                                      if (playAttempt && typeof playAttempt.then === 'function') {
                                                        playAttempt.then(()=>{ setPlaybackState({ index: i, baseName: extractBaseName(audioSources[i]), time: audio.currentTime||0 }); }).catch(()=>{});
                                                      }
                                                    }
                                                  };
                                                  window.addEventListener('pointermove', move);
                                                  window.addEventListener('pointerup', up, { once: true });
                                                }}
                                aria-label="Seek audio position"
                                role="slider"
                                aria-valuemin={0}
                                aria-valuemax={duration || 0}
                                aria-valuenow={current || 0}
                              >
                                <div className="absolute inset-0">
                                  <div className="h-full bg-white/90 transition-all" style={{ width: `${progress*100}%` }} />
                                </div>
                                <div
                                  className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow opacity-0 group-hover:opacity-100 transition-opacity"
                                  style={{ left: `calc(${progress*100}% - 6px)` }}
                                />
                              </div>
                              <span className="opacity-70 min-w-[32px] text-center">{duration ? format(duration) : '--:--'}</span>
                            </div>
                          </div>
                        </div>
      {/* Per-card audio element removed; using single global hidden audio tag */}
                      </div>
                    </div>
                  );
                })}
    {/* Hidden global audio element (exists once) */}
    <audio data-global-audio-hidden className="hidden" />
              </div>
              <style jsx global>{`
                @keyframes eqBounce { 0%,100%{transform:scaleY(0.3)} 50%{transform:scaleY(1)} }
              `}</style>
            </div>
          ) : (
            <div className="text-center py-16 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl">
              <div className="text-6xl mb-4">🎵</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Audio Samples Found</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Add MP3 or WAV files to your Song audio gallery.</p>
              <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                <p>💡 Place source files in the repository content folder (copied automatically at build):</p>
                <p className="font-mono bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded">content/Song/Audios/gallery/ENGLISH/</p>
                <p className="font-mono bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded">content/Song/Audios/gallery/FRENCH/ (etc.)</p>
                <p>🔁 They are served statically from:</p>
                <p className="font-mono bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded">/Personalized_Button/content/Song/Audios/gallery/ENGLISH/</p>
                <p className="text-xs pt-2">Filename pattern: song_gallery_01.wav (or .mp3 / .wov) with 2-digit index up to 30</p>
              </div>
            </div>
          )
        ) : discoveredImages.length > 0 ? (
          <>
            <div className="relative">
              <div className="overflow-x-auto scrollbar-hide">
                <div className="flex gap-6 pb-4" style={{ width: 'max-content' }}>
                  {discoveredImages.map((imageName: string, index: number) => {
                    const imageStatus = imageStatuses[imageName];
                    return (
                      <div key={`${currentLanguage}-${imageName}-${index}`} className="group relative bg-gray-200 dark:bg-gray-700 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105 flex-shrink-0" style={{ width: '200px', height: '200px' }}>
                        {imageStatus?.exists ? (
                          <Image src={`${imageStatus.path}?lang=${currentLanguage}&t=${Date.now()}`} alt={`Gallery image ${index + 1}`} fill className="object-cover" sizes="200px" />
                        ) : (
                          <>
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary-blue/20"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="text-center text-gray-500 dark:text-gray-400 p-4">
                                <div className="text-3xl mb-2">✨</div>
                                <p className="text-sm font-medium">{imageName}</p>
                                <p className="text-xs mt-1 opacity-70">{data.gallery_placeholder?.add_to || 'Add to'}:</p>
                                <p className="text-xs opacity-50">/public/{currentProduct}/gallery/{currentLanguage}/</p>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="flex justify-center mt-6 space-x-2">
                {Array.from({ length: Math.ceil(discoveredImages.length / 4) }, (_, i) => (
                  <div key={i} className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                ))}
              </div>
            </div>
            <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400" />
          </>
        ) : (
          <div className="text-center py-16 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl">
            <div className="text-6xl mb-4">📸</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{data.no_images?.title || 'No Gallery Images Found'}</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{data.no_images?.subtitle || 'Add images to start building your gallery'}</p>
            <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
              <p>💡 {data.no_images?.instructions || 'Add images to these folders'}:</p>
              <p className="font-mono bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded">/public/{currentProduct}/gallery/{currentLanguage}/</p>
              <p className="font-mono bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded">/public/{currentProduct}/gallery/ (fallback)</p>
              <p className="mt-2 text-xs">{recommendations.description}</p>
            </div>
          </div>
        )}
        <div className="text-center mt-12">
          <p className="text-gray-600 dark:text-gray-400">{t('gallery.loveWhatYouSee')}</p>
        </div>
      </div>
    </section>
  );
});

// Why People Love It Section Component
function WhyPeopleLoveItSection({ data }: { data: any }) {
  if (!data.points || !Array.isArray(data.points)) return null;

  // Icon + color logic (keyword based, else rotational variety)
  const rotations = [
    { icon: <Heart className="w-8 h-8" />, bg: 'from-rose-500/20 to-pink-500/20', fg: 'text-rose-600 dark:text-rose-400' },
    { icon: <Gift className="w-8 h-8" />, bg: 'from-amber-500/20 to-orange-500/20', fg: 'text-amber-600 dark:text-amber-400' },
    { icon: <Star className="w-8 h-8" />, bg: 'from-indigo-500/20 to-violet-500/20', fg: 'text-indigo-600 dark:text-indigo-400' },
    { icon: <Music className="w-8 h-8" />, bg: 'from-fuchsia-500/20 to-purple-500/20', fg: 'text-fuchsia-600 dark:text-fuchsia-400' },
    { icon: <Camera className="w-8 h-8" />, bg: 'from-sky-500/20 to-cyan-500/20', fg: 'text-sky-600 dark:text-sky-400' },
    { icon: <Book className="w-8 h-8" />, bg: 'from-emerald-500/20 to-teal-500/20', fg: 'text-emerald-600 dark:text-emerald-400' },
    { icon: <Rocket className="w-8 h-8" />, bg: 'from-orange-500/20 to-red-500/20', fg: 'text-orange-600 dark:text-orange-400' },
    { icon: <Sparkles className="w-8 h-8" />, bg: 'from-yellow-400/20 to-lime-400/20', fg: 'text-yellow-600 dark:text-yellow-400' }
  ];

  function pickIcon(point: string, index: number) {
    const lower = point.toLowerCase();
    if (/(cadeau|gift|regalo|هدية)/.test(lower)) return rotations[1];
    if (/(émotion|emotion|emozione|عاطف|émotionnel|emotional)/.test(lower)) return rotations[0];
    if (/(unique|unik|unique|فريد|unico|special)/.test(lower)) return rotations[2];
    if (/(musique|music|musica|موسيقى)/.test(lower)) return rotations[3];
    if (/(souvenir|memory|ricordo|ذكرى|montage|slideshow|événement|event)/.test(lower)) return rotations[4];
    if (/(histoire|story|storia|قصة)/.test(lower)) return rotations[5];
    return rotations[index % rotations.length];
  }

  return (
    <section id="why-love-it" className="py-24 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            {data.title}
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {data.points.map((point: string, index: number) => {
            const { icon, bg, fg } = pickIcon(point, index);
            return (
              <div key={index} className="group relative text-center p-6 rounded-2xl bg-gray-50 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className={`relative w-20 h-20 mx-auto mb-5 rounded-2xl bg-gradient-to-br ${bg} flex items-center justify-center shadow-inner shadow-black/5 dark:shadow-black/30 backdrop-blur-sm`}> 
                  <div className={`transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 ${fg}`}>{icon}</div>
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-white/0 to-white/10 dark:from-white/0 dark:to-white/5" />
                </div>
                <p className="text-gray-700 dark:text-gray-300 font-medium leading-relaxed">
                  {point}
                </p>
                <div className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-primary/0 via-primary/5 to-primary/10 dark:from-primary/0 dark:via-primary/10 dark:to-primary/20" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// Testimonials Section Component
function TestimonialsSection({ data }: { data: any }) {
  if (!data.items || !Array.isArray(data.items)) return null;

  return (
    <section id="testimonials" className="py-24 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            {data.title}
          </h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {data.items.map((testimonial: any, index: number) => (
            <div key={index} className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mr-4">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {testimonial.name}
                  </h4>
                  {testimonial.rating && (
                    <div className="flex text-yellow-400">
                      {[...Array(Math.floor(testimonial.rating))].map((_, i) => (
                        <span key={i}>⭐</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <blockquote className="text-gray-600 dark:text-gray-400 italic">
                "{testimonial.comment}"
              </blockquote>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
