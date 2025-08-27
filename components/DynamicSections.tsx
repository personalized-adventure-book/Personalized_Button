import React from 'react';
import { LocalContentData } from '@/hooks/useLocalContent';
import { 
  ArrowRight, 
  Zap, 
  Smartphone, 
  Palette, 
  Target, 
  Package, 
  Heart, 
  Star, 
  Check, 
  Crown, 
  Book, 
  Clock, 
  Shield, 
  Users, 
  Home, 
  Settings, 
  Film, 
  Sparkles, 
  Sun, 
  Moon, 
  Leaf,
  Rocket,
  TreePine,
  Anchor,
  Zap as BoltIcon
} from 'lucide-react';

// Icon mapping for dynamic content
const iconMap: { [key: string]: React.ComponentType<any> } = {
  person: Users,
  book: Book,
  heart: Heart,
  rocket: Rocket,
  tree: TreePine,
  crown: Crown,
  anchor: Anchor,
  bolt: BoltIcon,
  smartphone: Smartphone,
  palette: Palette,
  target: Target,
  package: Package,
  star: Star,
  check: Check,
  clock: Clock,
  shield: Shield,
  home: Home,
  settings: Settings,
  film: Film,
  sparkles: Sparkles,
  sun: Sun,
  moon: Moon,
  leaf: Leaf,
  zap: Zap
};

interface DynamicHeroProps {
  data: LocalContentData;
  onStartCustomizing: () => void;
}

export function DynamicHero({ data, onStartCustomizing }: DynamicHeroProps) {
  const hero = data.hero || {};
  
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary/10 via-white to-primary/5 dark:from-primary/20 dark:via-gray-900 dark:to-primary/10">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {hero.badge && (
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4 mr-2" />
            {hero.badge}
          </div>
        )}
        
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6">
          {hero.headline || hero.title || "Your Story Begins Here"}
        </h1>
        
        {(hero.subheadline || hero.subtitle) && (
          <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            {hero.subheadline || hero.subtitle}
          </p>
        )}
        
        <button
          onClick={onStartCustomizing}
          className="group inline-flex items-center px-8 py-4 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105"
        >
          {hero.start_button || hero.cta_text || "Start Creating"}
          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </section>
  );
}

interface DynamicFeaturesProps {
  data: LocalContentData;
}

export function DynamicFeatures({ data }: DynamicFeaturesProps) {
  const features = data.features || [];
  
  if (features.length === 0) return null;
  
  return (
    <section id="features" className="py-24 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = iconMap[feature.icon] || Book;
            
            return (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 mx-auto bg-primary/10 dark:bg-primary/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <IconComponent className="w-8 h-8 text-primary dark:text-primary-light" />
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

interface DynamicAdventuresProps {
  data: LocalContentData;
}

export function DynamicAdventures({ data }: DynamicAdventuresProps) {
  const adventures = data.adventure_possibilities;
  
  if (!adventures || !adventures.cards || adventures.cards.length === 0) return null;
  
  return (
    <section id="adventures" className="py-24 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            {adventures.title}
          </h2>
          {adventures.subtitle && (
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {adventures.subtitle}
            </p>
          )}
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {adventures.cards.map((adventure, index) => {
            const IconComponent = iconMap[adventure.icon] || Sparkles;
            
            return (
              <div key={index} className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-xl flex items-center justify-center mb-6">
                  <IconComponent className="w-6 h-6 text-primary dark:text-primary-light" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  {adventure.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {adventure.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

interface DynamicExamplesProps {
  data: LocalContentData;
}

export function DynamicExamples({ data }: DynamicExamplesProps) {
  const examples = data.examples || data.book_examples;
  
  if (!examples) return null;

  // Handle the new simple examples structure with items array
  if (examples.items && Array.isArray(examples.items)) {
    return (
      <section id="examples" className="py-24 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {examples.title}
            </h2>
            {examples.subtitle && (
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                {examples.subtitle}
              </p>
            )}
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {examples.items.map((item: any, index: number) => (
              <div key={index} className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">✨</span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 font-medium">
                    {item.text || item}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Handle the old detailed examples structure
  if (!examples.examples || examples.examples.length === 0) return null;
  
  return (
    <section id="examples" className="py-24 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            {examples.title}
          </h2>
          {examples.subtitle && (
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {examples.subtitle}
            </p>
          )}
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {examples.examples.map((example, index) => (
            <div key={index} className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {example.title}
              </h3>
              <p className="text-primary dark:text-primary-light font-medium mb-4">
                {example.child}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {example.adventure}
              </p>
              <blockquote className="text-gray-700 dark:text-gray-300 italic border-l-4 border-primary pl-4">
                "{example.preview}"
              </blockquote>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

interface DynamicHowItWorksProps {
  data: LocalContentData;
}

export function DynamicHowItWorks({ data }: DynamicHowItWorksProps) {
  const howItWorks = data.how_it_works;
  
  if (!howItWorks || !howItWorks.steps || howItWorks.steps.length === 0) return null;
  
  return (
    <section id="how-it-works" className="py-24 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            {howItWorks.title}
          </h2>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {howItWorks.steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 mx-auto bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mb-6">
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
      </div>
    </section>
  );
}

interface DynamicPricingProps {
  data: LocalContentData;
  onStartCustomizing: () => void;
}

export function DynamicPricing({ data, onStartCustomizing }: DynamicPricingProps) {
  const pricing = data.pricing || data.book_options;
  
  if (!pricing) return null;

  // Handle the new pricing structure with plans array
  if ('plans' in pricing) {
    return (
      <section id="pricing" className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {pricing.title}
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricing.plans.map((plan, index) => (
              <div key={index} className={`p-8 rounded-2xl ${index === 1 ? 'bg-primary/5 dark:bg-primary/10 border-2 border-primary' : 'bg-gray-50 dark:bg-gray-800'}`}>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {plan.name}
                </h3>
                <div className="text-3xl font-bold text-primary dark:text-primary-light mb-6">
                  {plan.price}
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
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
  return (
    <section id="pricing" className="py-24 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            {pricing.title}
          </h2>
          {pricing.description && (
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {pricing.description}
            </p>
          )}
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {pricing.digital.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {pricing.digital.subtitle}
            </p>
            <div className="text-3xl font-bold text-primary dark:text-primary-light mb-6">
              {pricing.digital.price}
            </div>
            <ul className="space-y-3 mb-8">
              {pricing.digital.features.map((feature, index) => (
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
            {pricing.printed.popular_badge && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-primary text-white px-4 py-2 rounded-full text-sm font-medium">
                  {pricing.printed.popular_badge}
                </span>
              </div>
            )}
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {pricing.printed.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {pricing.printed.subtitle}
            </p>
            <div className="text-3xl font-bold text-primary dark:text-primary-light mb-6">
              {pricing.printed.price}
            </div>
            <ul className="space-y-3 mb-8">
              {pricing.printed.features.map((feature, index) => (
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

interface DynamicCtaProps {
  data: LocalContentData;
  onStartCustomizing: () => void;
}

export function DynamicCta({ data, onStartCustomizing }: DynamicCtaProps) {
  const cta = data.cta;
  
  if (!cta) return null;
  
  return (
    <section className="py-24 bg-primary text-white">
      <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
          {cta.title}
        </h2>
        {cta.description && (
          <p className="text-xl mb-12 text-primary-light">
            {cta.description}
          </p>
        )}
        <button
          onClick={onStartCustomizing}
          className="inline-flex items-center px-8 py-4 bg-white text-primary font-semibold rounded-xl hover:bg-gray-100 transition-colors"
        >
          {cta.button}
          <ArrowRight className="ml-2 w-5 h-5" />
        </button>
      </div>
    </section>
  );
}

interface DynamicAboutProps {
  data: LocalContentData;
}

export function DynamicAbout({ data }: DynamicAboutProps) {
  const about = data.about;
  
  if (!about) return null;
  
  return (
    <section id="about" className="py-24 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            {about.title}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
            {about.text}
          </p>
        </div>
      </div>
    </section>
  );
}

interface DynamicFaqProps {
  data: LocalContentData;
}

export function DynamicFaq({ data }: DynamicFaqProps) {
  const faq = data.faq;
  
  if (!faq || faq.length === 0) return null;
  
  return (
    <section id="faq" className="py-24 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Everything you need to know about our personalized buttons
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto space-y-8">
          {faq.map((item: any, index: number) => (
            <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8">
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
