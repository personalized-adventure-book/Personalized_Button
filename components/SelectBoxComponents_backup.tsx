import React, { useState, useRef } from 'react';
import { 
  Star, User, Globe, Zap, Circle, Square, Hexagon, StopCircle, Diamond, 
  Triangle, Heart, MoreHorizontal, Pentagon, SquareDot, Pill, Cloud, Flower2, 
  Palette, Lightbulb, Book, Popcorn, PartyPopper, 
  Sparkles, Sun, Mountain, CircleDot, Feather,
  Target, Settings, GraduationCap, Coffee, Music,
  Cpu, Waves, Chrome, Layers, Grip, ChevronLeft, ChevronRight,
  Gamepad2, Brain, Dumbbell, Moon, Sunrise, Timer
} from 'lucide-react';

interface SelectBoxOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  color?: string;
  gradient?: string;
}

interface SelectBoxProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  required?: boolean;
  variant?: 'purpose' | 'shape' | 'color' | 'finish' | 'default';
  itemsPerPage?: number; // New prop for pagination
}

// Function to get the appropriate icon for an option
const getIconForOption = (fieldName: string, optionValue: string): React.ReactNode => {
  // Map options to normalized keys for consistent icon lookup
  const normalizeOption = (field: string, option: string): string => {
    const mapping: Record<string, Record<string, string>> = {
      purpose: {
        'Mode concentration': 'focus',
        'Focus Mode': 'focus',
        'Lumière de lecture': 'reading',
        'Reading Light': 'reading', 
        'Soirée film': 'movie',
        'Movie Night': 'movie',
        'Ambiance fête': 'party',
        'Party Scene': 'party',
        'Gaming Session': 'gaming',
        'Meditation': 'meditation',
        'Workout': 'workout',
        'Study Mode': 'study',
        'Relaxation': 'relaxation',
        'Sleep Time': 'sleep',
        'Wake Up': 'wakeup',
        'Mood Lighting': 'mood',
        'Autre usage': 'custom',
        'Custom Purpose': 'custom'
      },
      shape: {
        'Cercle': 'circle', 'Circle': 'circle',
        'Carré': 'square', 'Square': 'square',
        'Hexagone': 'hexagon', 'Hexagon': 'hexagon',
        'Octogone': 'octagon', 'Octagon': 'octagon',
        'Losange': 'diamond', 'Diamond': 'diamond',
        'Étoile': 'star', 'Star': 'star',
        'Triangle': 'triangle',
        'Cœur': 'heart', 'Heart': 'heart',
        'Ovale': 'oval', 'Oval': 'oval',
        'Pentagone': 'pentagon', 'Pentagon': 'pentagon',
        'Carré arrondi': 'rounded-square', 'Rounded Square': 'rounded-square',
        'Pilule': 'pill', 'Pill': 'pill',
        'Nuage': 'cloud', 'Cloud': 'cloud',
        'Fleur': 'flower', 'Flower': 'flower',
        'Éclair': 'lightning', 'Lightning': 'lightning'
      },
      color: {
        'Bleu': 'blue', 'Blue': 'blue',
        'Violet': 'purple', 'Purple': 'purple',
        'Vert': 'green', 'Green': 'green',
        'Jaune': 'yellow', 'Yellow': 'yellow',
        'Rose': 'pink', 'Pink': 'pink',
        'Rouge': 'red', 'Red': 'red',
        'Turquoise': 'teal', 'Teal': 'teal',
        'Indigo': 'indigo',
        'Citron vert': 'lime', 'Lime': 'lime',
        'Cyan': 'cyan',
        'Orange': 'orange',
        '#FF7A00': 'orange',
        'Personnalisée': 'custom', 'Custom': 'custom'
      },
      finish: {
        'Mat': 'matte', 'Matte': 'matte',
        'Brillant': 'glossy', 'Glossy': 'glossy',
        'Satiné': 'satin', 'Satin': 'satin',
        'Métallique': 'metallic', 'Metallic': 'metallic',
        'Nacré': 'pearl', 'Pearl': 'pearl',
        'Texturé': 'textured', 'Textured': 'textured',
        'Carbone': 'carbon', 'Carbon Fiber': 'carbon',
        'Toucher doux': 'soft', 'Soft Touch': 'soft'
      }
    };
    return mapping[field]?.[option] || option.toLowerCase();
  };

  const normalizedKey = normalizeOption(fieldName, optionValue);
  
  // Icon mappings based on normalized keys
  const iconMap: Record<string, Record<string, React.ReactNode>> = {
    purpose: {
      'focus': <Target className="w-6 h-6 text-blue-600" />,
      'reading': <Book className="w-6 h-6 text-amber-600" />,
      'movie': <Popcorn className="w-6 h-6 text-red-500" />,
      'party': <PartyPopper className="w-6 h-6 text-purple-500" />,
      'gaming': <Gamepad2 className="w-6 h-6 text-green-500" />,
      'meditation': <Brain className="w-6 h-6 text-purple-400" />,
      'workout': <Dumbbell className="w-6 h-6 text-orange-500" />,
      'study': <GraduationCap className="w-6 h-6 text-indigo-600" />,
      'relaxation': <Feather className="w-6 h-6 text-teal-400" />,
      'sleep': <Moon className="w-6 h-6 text-indigo-400" />,
      'wakeup': <Sunrise className="w-6 h-6 text-yellow-400" />,
      'mood': <Sparkles className="w-6 h-6 text-pink-500" />,
      'custom': <Lightbulb className="w-6 h-6 text-yellow-500" />
    },
    shape: {
      'circle': <Circle className="w-6 h-6 text-blue-500" />,
      'square': <Square className="w-6 h-6 text-green-500" />,
      'hexagon': <Hexagon className="w-6 h-6 text-purple-500" />,
      'octagon': <StopCircle className="w-6 h-6 text-orange-500" />,
      'diamond': <Diamond className="w-6 h-6 text-pink-500" />,
      'star': <Star className="w-6 h-6 text-yellow-500" />,
      'triangle': <Triangle className="w-6 h-6 text-teal-500" />,
      'heart': <Heart className="w-6 h-6 text-red-500" />,
      'oval': <MoreHorizontal className="w-6 h-6 text-indigo-500" />,
      'pentagon': <Pentagon className="w-6 h-6 text-cyan-500" />,
      'rounded-square': <SquareDot className="w-6 h-6 text-lime-500" />,
      'pill': <Pill className="w-6 h-6 text-rose-500" />,
      'cloud': <Cloud className="w-6 h-6 text-sky-400" />,
      'flower': <Flower2 className="w-6 h-6 text-pink-400" />,
      'lightning': <Zap className="w-6 h-6 text-yellow-400" />,
      'custom': <Settings className="w-6 h-6 text-gray-500" />
    },
    color: {
      'blue': <CircleDot className="w-6 h-6 text-blue-500" />,
      'purple': <CircleDot className="w-6 h-6 text-purple-500" />,
      'green': <CircleDot className="w-6 h-6 text-green-500" />,
      'yellow': <CircleDot className="w-6 h-6 text-yellow-500" />,
      'pink': <CircleDot className="w-6 h-6 text-pink-500" />,
      'red': <CircleDot className="w-6 h-6 text-red-500" />,
      'teal': <CircleDot className="w-6 h-6 text-teal-500" />,
      'indigo': <CircleDot className="w-6 h-6 text-indigo-500" />,
      'lime': <CircleDot className="w-6 h-6 text-lime-500" />,
      'cyan': <CircleDot className="w-6 h-6 text-cyan-400" />,
      'orange': <CircleDot className="w-6 h-6 text-orange-500" />,
      'custom': <Palette className="w-6 h-6 text-purple-500" />
    },
    finish: {
      'matte': <Waves className="w-6 h-6 text-slate-500" />,
      'glossy': <Sparkles className="w-6 h-6 text-yellow-500" />,
      'satin': <Sun className="w-6 h-6 text-amber-500" />,
      'metallic': <Chrome className="w-6 h-6 text-gray-500" />,
      'pearl': <Layers className="w-6 h-6 text-slate-400" />,
      'textured': <Mountain className="w-6 h-6 text-stone-500" />,
      'carbon': <Grip className="w-6 h-6 text-zinc-600" />,
      'soft': <Feather className="w-6 h-6 text-pink-400" />,
      'custom': <Settings className="w-6 h-6 text-gray-500" />
    }
  };

  return iconMap[fieldName]?.[normalizedKey] || <Globe className="w-6 h-6" />;
};

// Get color value for color options
const getColorValue = (colorName: string): string => {
  const colorMap: { [key: string]: string } = {
    'Bleu': '#3B82F6',
    'blue': '#3B82F6',
    'Blue': '#3B82F6',
    'Violet': '#8B5CF6',
    'purple': '#8B5CF6',
    'Purple': '#8B5CF6',
    'Vert': '#10B981',
    'green': '#10B981',
    'Green': '#10B981',
    'Jaune': '#F59E0B',
    'yellow': '#F59E0B',
    'Yellow': '#F59E0B',
    'Rose': '#EC4899',
    'pink': '#EC4899',
    'Pink': '#EC4899',
    'Rouge': '#EF4444',
    'red': '#EF4444',
    'Red': '#EF4444',
    'Turquoise': '#06B6D4',
    'teal': '#06B6D4',
    'Teal': '#06B6D4',
    'Indigo': '#6366F1',
    'indigo': '#6366F1',
    'Citron vert': '#84CC16',
    'lime': '#84CC16',
    'Lime': '#84CC16',
    'Cyan': '#06B6D4',
    'cyan': '#06B6D4',
    'Orange': '#F97316',
    'orange': '#F97316',
    'custom': '#8B5CF6',
    'Custom': '#8B5CF6',
    'Personnalisée': '#8B5CF6',
    'Personalizzato': '#8B5CF6',
    'مخصص': '#8B5CF6'
  };
  
  // Check if it's already a hex color
  if (colorName.startsWith('#')) {
    return colorName;
  }
  
  return colorMap[colorName] || '#6B7280'; // Default gray
};

// Configuration for different select box types
const getBoxConfig = (name: string) => {
  switch (name) {
    case 'purpose':
      return {
        columns: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8',
        optionConfigs: {
          'Mode concentration': { bgClass: 'bg-indigo-50 dark:bg-indigo-900/20', borderClass: 'border-indigo-400', textClass: 'text-indigo-800 dark:text-indigo-200', hoverClass: 'hover:bg-indigo-100', gradient: 'from-indigo-400 to-indigo-600' },
          'Focus Mode': { bgClass: 'bg-indigo-50 dark:bg-indigo-900/20', borderClass: 'border-indigo-400', textClass: 'text-indigo-800 dark:text-indigo-200', hoverClass: 'hover:bg-indigo-100', gradient: 'from-indigo-400 to-indigo-600' },
          'Lumière de lecture': { bgClass: 'bg-amber-50 dark:bg-amber-900/20', borderClass: 'border-amber-400', textClass: 'text-amber-800 dark:text-amber-200', hoverClass: 'hover:bg-amber-100', gradient: 'from-amber-400 to-amber-600' },
          'Reading Light': { bgClass: 'bg-amber-50 dark:bg-amber-900/20', borderClass: 'border-amber-400', textClass: 'text-amber-800 dark:text-amber-200', hoverClass: 'hover:bg-amber-100', gradient: 'from-amber-400 to-amber-600' },
          'Soirée film': { bgClass: 'bg-red-50 dark:bg-red-900/20', borderClass: 'border-red-400', textClass: 'text-red-800 dark:text-red-200', hoverClass: 'hover:bg-red-100', gradient: 'from-red-400 to-red-600' },
          'Movie Night': { bgClass: 'bg-red-50 dark:bg-red-900/20', borderClass: 'border-red-400', textClass: 'text-red-800 dark:text-red-200', hoverClass: 'hover:bg-red-100', gradient: 'from-red-400 to-red-600' },
          'Ambiance fête': { bgClass: 'bg-pink-50 dark:bg-pink-900/20', borderClass: 'border-pink-400', textClass: 'text-pink-800 dark:text-pink-200', hoverClass: 'hover:bg-pink-100', gradient: 'from-pink-400 to-pink-600' },
          'Party Scene': { bgClass: 'bg-pink-50 dark:bg-pink-900/20', borderClass: 'border-pink-400', textClass: 'text-pink-800 dark:text-pink-200', hoverClass: 'hover:bg-pink-100', gradient: 'from-pink-400 to-pink-600' },
          'Gaming Session': { bgClass: 'bg-green-50 dark:bg-green-900/20', borderClass: 'border-green-400', textClass: 'text-green-800 dark:text-green-200', hoverClass: 'hover:bg-green-100', gradient: 'from-green-400 to-green-600' },
          'Meditation': { bgClass: 'bg-purple-50 dark:bg-purple-900/20', borderClass: 'border-purple-400', textClass: 'text-purple-800 dark:text-purple-200', hoverClass: 'hover:bg-purple-100', gradient: 'from-purple-400 to-purple-600' },
          'Workout': { bgClass: 'bg-orange-50 dark:bg-orange-900/20', borderClass: 'border-orange-400', textClass: 'text-orange-800 dark:text-orange-200', hoverClass: 'hover:bg-orange-100', gradient: 'from-orange-400 to-orange-600' },
          'Study Mode': { bgClass: 'bg-indigo-50 dark:bg-indigo-900/20', borderClass: 'border-indigo-400', textClass: 'text-indigo-800 dark:text-indigo-200', hoverClass: 'hover:bg-indigo-100', gradient: 'from-indigo-400 to-indigo-600' },
          'Relaxation': { bgClass: 'bg-teal-50 dark:bg-teal-900/20', borderClass: 'border-teal-400', textClass: 'text-teal-800 dark:text-teal-200', hoverClass: 'hover:bg-teal-100', gradient: 'from-teal-400 to-teal-600' },
          'Sleep Time': { bgClass: 'bg-indigo-50 dark:bg-indigo-900/20', borderClass: 'border-indigo-400', textClass: 'text-indigo-800 dark:text-indigo-200', hoverClass: 'hover:bg-indigo-100', gradient: 'from-indigo-400 to-indigo-600' },
          'Wake Up': { bgClass: 'bg-yellow-50 dark:bg-yellow-900/20', borderClass: 'border-yellow-400', textClass: 'text-yellow-800 dark:text-yellow-200', hoverClass: 'hover:bg-yellow-100', gradient: 'from-yellow-400 to-yellow-600' },
          'Mood Lighting': { bgClass: 'bg-pink-50 dark:bg-pink-900/20', borderClass: 'border-pink-400', textClass: 'text-pink-800 dark:text-pink-200', hoverClass: 'hover:bg-pink-100', gradient: 'from-pink-400 to-pink-600' },
          'Autre usage': { bgClass: 'bg-gray-50 dark:bg-gray-700', borderClass: 'border-gray-400', textClass: 'text-gray-800 dark:text-gray-200', hoverClass: 'hover:bg-gray-100', gradient: 'from-gray-400 to-gray-600' },
          'Custom Purpose': { bgClass: 'bg-gray-50 dark:bg-gray-700', borderClass: 'border-gray-400', textClass: 'text-gray-800 dark:text-gray-200', hoverClass: 'hover:bg-gray-100', gradient: 'from-gray-400 to-gray-600' }
        }
      };

    case 'shape':
      return {
        columns: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8',
        optionConfigs: {
          'Cercle': { bgClass: 'bg-blue-50 dark:bg-blue-900/20', borderClass: 'border-blue-400', textClass: 'text-blue-800 dark:text-blue-200', hoverClass: 'hover:bg-blue-100', gradient: 'from-blue-400 to-blue-600' },
          'Carré': { bgClass: 'bg-green-50 dark:bg-green-900/20', borderClass: 'border-green-400', textClass: 'text-green-800 dark:text-green-200', hoverClass: 'hover:bg-green-100', gradient: 'from-green-400 to-green-600' },
          'Hexagone': { bgClass: 'bg-purple-50 dark:bg-purple-900/20', borderClass: 'border-purple-400', textClass: 'text-purple-800 dark:text-purple-200', hoverClass: 'hover:bg-purple-100', gradient: 'from-purple-400 to-purple-600' },
          'Octogone': { bgClass: 'bg-red-50 dark:bg-red-900/20', borderClass: 'border-red-400', textClass: 'text-red-800 dark:text-red-200', hoverClass: 'hover:bg-red-100', gradient: 'from-red-400 to-red-600' },
          'Losange': { bgClass: 'bg-cyan-50 dark:bg-cyan-900/20', borderClass: 'border-cyan-400', textClass: 'text-cyan-800 dark:text-cyan-200', hoverClass: 'hover:bg-cyan-100', gradient: 'from-cyan-400 to-cyan-600' },
          'Étoile': { bgClass: 'bg-yellow-50 dark:bg-yellow-900/20', borderClass: 'border-yellow-400', textClass: 'text-yellow-800 dark:text-yellow-200', hoverClass: 'hover:bg-yellow-100', gradient: 'from-yellow-400 to-yellow-600' },
          'Triangle': { bgClass: 'bg-orange-50 dark:bg-orange-900/20', borderClass: 'border-orange-400', textClass: 'text-orange-800 dark:text-orange-200', hoverClass: 'hover:bg-orange-100', gradient: 'from-orange-400 to-orange-600' },
          'Cœur': { bgClass: 'bg-rose-50 dark:bg-rose-900/20', borderClass: 'border-rose-400', textClass: 'text-rose-800 dark:text-rose-200', hoverClass: 'hover:bg-rose-100', gradient: 'from-rose-400 to-rose-600' },
          'Ovale': { bgClass: 'bg-teal-50 dark:bg-teal-900/20', borderClass: 'border-teal-400', textClass: 'text-teal-800 dark:text-teal-200', hoverClass: 'hover:bg-teal-100', gradient: 'from-teal-400 to-teal-600' },
          'Pentagone': { bgClass: 'bg-indigo-50 dark:bg-indigo-900/20', borderClass: 'border-indigo-400', textClass: 'text-indigo-800 dark:text-indigo-200', hoverClass: 'hover:bg-indigo-100', gradient: 'from-indigo-400 to-indigo-600' },
          'Carré arrondi': { bgClass: 'bg-emerald-50 dark:bg-emerald-900/20', borderClass: 'border-emerald-400', textClass: 'text-emerald-800 dark:text-emerald-200', hoverClass: 'hover:bg-emerald-100', gradient: 'from-emerald-400 to-emerald-600' },
          'Pilule': { bgClass: 'bg-pink-50 dark:bg-pink-900/20', borderClass: 'border-pink-400', textClass: 'text-pink-800 dark:text-pink-200', hoverClass: 'hover:bg-pink-100', gradient: 'from-pink-400 to-pink-600' },
          'Nuage': { bgClass: 'bg-sky-50 dark:bg-sky-900/20', borderClass: 'border-sky-400', textClass: 'text-sky-800 dark:text-sky-200', hoverClass: 'hover:bg-sky-100', gradient: 'from-sky-400 to-sky-600' },
          'Fleur': { bgClass: 'bg-pink-50 dark:bg-pink-900/20', borderClass: 'border-pink-400', textClass: 'text-pink-800 dark:text-pink-200', hoverClass: 'hover:bg-pink-100', gradient: 'from-pink-400 to-pink-600' },
          'Éclair': { bgClass: 'bg-yellow-50 dark:bg-yellow-900/20', borderClass: 'border-yellow-400', textClass: 'text-yellow-800 dark:text-yellow-200', hoverClass: 'hover:bg-yellow-100', gradient: 'from-yellow-400 to-yellow-600' }
        }
      };

    case 'color':
      return {
        columns: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8',
        optionConfigs: {
          'Bleu': { bgClass: 'bg-blue-50 dark:bg-blue-900/20', borderClass: 'border-blue-400', textClass: 'text-blue-800 dark:text-blue-200', hoverClass: 'hover:bg-blue-100', gradient: 'from-blue-400 to-blue-600' },
          '#FF7A00': { bgClass: 'bg-orange-50 dark:bg-orange-900/20', borderClass: 'border-orange-400', textClass: 'text-orange-800 dark:text-orange-200', hoverClass: 'hover:bg-orange-100', gradient: 'from-orange-400 to-orange-600' },
          'Violet': { bgClass: 'bg-purple-50 dark:bg-purple-900/20', borderClass: 'border-purple-400', textClass: 'text-purple-800 dark:text-purple-200', hoverClass: 'hover:bg-purple-100', gradient: 'from-purple-400 to-purple-600' },
          'Vert': { bgClass: 'bg-green-50 dark:bg-green-900/20', borderClass: 'border-green-400', textClass: 'text-green-800 dark:text-green-200', hoverClass: 'hover:bg-green-100', gradient: 'from-green-400 to-green-600' },
          'Jaune': { bgClass: 'bg-yellow-50 dark:bg-yellow-900/20', borderClass: 'border-yellow-400', textClass: 'text-yellow-800 dark:text-yellow-200', hoverClass: 'hover:bg-yellow-100', gradient: 'from-yellow-400 to-yellow-600' },
          'Rose': { bgClass: 'bg-pink-50 dark:bg-pink-900/20', borderClass: 'border-pink-400', textClass: 'text-pink-800 dark:text-pink-200', hoverClass: 'hover:bg-pink-100', gradient: 'from-pink-400 to-pink-600' },
          'Rouge': { bgClass: 'bg-red-50 dark:bg-red-900/20', borderClass: 'border-red-400', textClass: 'text-red-800 dark:text-red-200', hoverClass: 'hover:bg-red-100', gradient: 'from-red-400 to-red-600' },
          'Turquoise': { bgClass: 'bg-cyan-50 dark:bg-cyan-900/20', borderClass: 'border-cyan-400', textClass: 'text-cyan-800 dark:text-cyan-200', hoverClass: 'hover:bg-cyan-100', gradient: 'from-cyan-400 to-cyan-600' },
          'Indigo': { bgClass: 'bg-indigo-50 dark:bg-indigo-900/20', borderClass: 'border-indigo-400', textClass: 'text-indigo-800 dark:text-indigo-200', hoverClass: 'hover:bg-indigo-100', gradient: 'from-indigo-400 to-indigo-600' },
          'Citron vert': { bgClass: 'bg-lime-50 dark:bg-lime-900/20', borderClass: 'border-lime-400', textClass: 'text-lime-800 dark:text-lime-200', hoverClass: 'hover:bg-lime-100', gradient: 'from-lime-400 to-lime-600' },
          'Cyan': { bgClass: 'bg-cyan-50 dark:bg-cyan-900/20', borderClass: 'border-cyan-400', textClass: 'text-cyan-800 dark:text-cyan-200', hoverClass: 'hover:bg-cyan-100', gradient: 'from-cyan-400 to-cyan-600' },
          'Orange': { bgClass: 'bg-orange-50 dark:bg-orange-900/20', borderClass: 'border-orange-400', textClass: 'text-orange-800 dark:text-orange-200', hoverClass: 'hover:bg-orange-100', gradient: 'from-orange-400 to-orange-600' },
          'Personnalisée': { bgClass: 'bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20', borderClass: 'border-gradient-to-r from-pink-400 to-purple-400', textClass: 'text-purple-800 dark:text-purple-200', hoverClass: 'hover:from-pink-100 hover:to-purple-100', gradient: 'from-pink-400 to-purple-600' }
        }
      };

    case 'finish':
      return {
        columns: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8',
        optionConfigs: {
          'Mat': { bgClass: 'bg-slate-50 dark:bg-slate-900/20', borderClass: 'border-slate-400', textClass: 'text-slate-800 dark:text-slate-200', hoverClass: 'hover:bg-slate-100', gradient: 'from-slate-400 to-slate-600' },
          'Brillant': { bgClass: 'bg-yellow-50 dark:bg-yellow-900/20', borderClass: 'border-yellow-400', textClass: 'text-yellow-800 dark:text-yellow-200', hoverClass: 'hover:bg-yellow-100', gradient: 'from-yellow-400 to-yellow-600' },
          'Satiné': { bgClass: 'bg-amber-50 dark:bg-amber-900/20', borderClass: 'border-amber-400', textClass: 'text-amber-800 dark:text-amber-200', hoverClass: 'hover:bg-amber-100', gradient: 'from-amber-400 to-amber-600' },
          'Métallique': { bgClass: 'bg-gray-50 dark:bg-gray-700', borderClass: 'border-gray-400', textClass: 'text-gray-800 dark:text-gray-200', hoverClass: 'hover:bg-gray-100', gradient: 'from-gray-400 to-gray-600' },
          'Nacré': { bgClass: 'bg-pearl-50 dark:bg-slate-900/20', borderClass: 'border-slate-300', textClass: 'text-slate-800 dark:text-slate-200', hoverClass: 'hover:bg-pearl-100', gradient: 'from-slate-300 to-slate-500' },
          'Texturé': { bgClass: 'bg-stone-50 dark:bg-stone-900/20', borderClass: 'border-stone-400', textClass: 'text-stone-800 dark:text-stone-200', hoverClass: 'hover:bg-stone-100', gradient: 'from-stone-400 to-stone-600' },
          'Carbone': { bgClass: 'bg-zinc-50 dark:bg-zinc-800', borderClass: 'border-zinc-400', textClass: 'text-zinc-800 dark:text-zinc-200', hoverClass: 'hover:bg-zinc-100', gradient: 'from-zinc-400 to-zinc-600' },
          'Toucher doux': { bgClass: 'bg-pink-50 dark:bg-pink-900/20', borderClass: 'border-pink-400', textClass: 'text-pink-800 dark:text-pink-200', hoverClass: 'hover:bg-pink-100', gradient: 'from-pink-400 to-pink-600' }
        }
      };

    default:
      return {
        columns: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8',
        optionConfigs: {}
      };
  }
};

export const SelectBox: React.FC<SelectBoxProps> = ({
  name,
  value,
  onChange,
  options,
  required = false,
  variant = 'default',
  itemsPerPage = 12
}) => {
  const [visibleCount, setVisibleCount] = useState(itemsPerPage);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const config = getBoxConfig(name);
  
  // Calculate how many columns per row based on screen size
  const getColumnsPerRow = () => {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      if (width >= 1536) return 8; // 2xl
      if (width >= 1280) return 6; // xl
      if (width >= 1024) return 5; // lg
      if (width >= 768) return 4;  // md
      if (width >= 640) return 3;  // sm
      return 2; // default
    }
    return 4; // fallback
  };

  const [columnsPerRow, setColumnsPerRow] = useState(getColumnsPerRow());

  // Update columns per row on window resize
  React.useEffect(() => {
    const handleResize = () => {
      setColumnsPerRow(getColumnsPerRow());
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate items for 2 rows
  const itemsPerTwoRows = columnsPerRow * 2;
  const displayedOptions = options.slice(0, Math.min(visibleCount, options.length));

  // Show load more only if there are more items than currently displayed
  const showLoadMore = displayedOptions.length < options.length;
  const needsLoadMore = options.length > itemsPerTwoRows;

  const handleLoadMore = () => {
    const newCount = Math.min(visibleCount + itemsPerTwoRows, options.length);
    setVisibleCount(newCount);
    
    // Scroll to show newly added items after a brief delay
    setTimeout(() => {
      if (scrollContainerRef.current) {
        const containerWidth = scrollContainerRef.current.offsetWidth;
        const boxWidth = containerWidth / columnsPerRow;
        const newItemsStartIndex = visibleCount - itemsPerTwoRows;
        const newItemColumn = Math.floor(newItemsStartIndex / 2) * columnsPerRow;
        const scrollPosition = Math.max(0, newItemColumn * boxWidth);
        
        scrollContainerRef.current.scrollTo({
          left: scrollPosition,
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  return (
    <div className="space-y-4">
      {/* Horizontal scroll container with 2 rows max */}
      <div 
        ref={scrollContainerRef}
        className="overflow-x-auto overflow-y-hidden"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#CBD5E0 #F7FAFC'
        }}
      >
        <div 
          className="grid gap-3 pb-2"
          style={{
            gridTemplateColumns: `repeat(${Math.ceil(displayedOptions.length / 2)}, minmax(0, 1fr))`,
            gridTemplateRows: 'repeat(2, minmax(0, 1fr))',
            gridAutoFlow: 'column',
            minWidth: `${Math.ceil(displayedOptions.length / 2) * 120}px`
          }}
        >
  {displayedOptions.map((option, index) => {
          const optionConfig = config.optionConfigs[option as keyof typeof config.optionConfigs];
          const isSelected = option === value;
          
          return (
            <div
              key={`${option}-${index}`}
              onClick={() => onChange(option)}
              className={`
                aspect-square p-2 sm:p-3 border-2 rounded-xl cursor-pointer transition-all duration-200
                flex flex-col items-center justify-center text-center gap-1
                ${name === 'color' ? (
                  isSelected 
                    ? 'border-gray-800 dark:border-gray-200 ring-2 ring-gray-400 shadow-lg' 
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 bg-white dark:bg-gray-800'
                ) : (
                  isSelected 
                    ? `${optionConfig?.borderClass || 'border-blue-500'} ${optionConfig?.bgClass || 'bg-blue-50 dark:bg-blue-900/20'} ring-2 ring-blue-200 dark:ring-blue-800`
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800'
                )}
                ${!isSelected ? 'hover:shadow-md' : 'shadow-lg'}
                ${optionConfig?.hoverClass && !isSelected && name !== 'color' ? optionConfig.hoverClass : ''}
              `}
              style={name === 'color' && isSelected ? {
                backgroundColor: `${getColorValue(option)}10`, // Very light tint
                borderColor: getColorValue(option)
              } : {}}
            >
              {/* Icon */}
              <div className={`
                w-6 h-6 sm:w-8 sm:h-8 rounded-md flex items-center justify-center
                ${name === 'color' ? '' : isSelected 
                  ? `bg-gradient-to-r ${optionConfig?.gradient || 'from-blue-400 to-blue-600'} text-white`
                  : 'bg-gray-100 dark:bg-gray-700'
                }
              `}
              style={name === 'color' ? { 
                backgroundColor: getColorValue(option),
                border: isSelected ? `3px solid ${getColorValue(option)}` : `2px solid ${getColorValue(option)}`,
                opacity: isSelected ? 1 : 0.8
              } : {}}
              >
                {name === 'color' ? (
                  <div className="w-full h-full rounded-md" style={{ 
                    backgroundColor: getColorValue(option),
                    opacity: isSelected ? 1 : 0.9
                  }} />
                ) : (
                  getIconForOption(name, option)
                )}
              </div>
              
              {/* Label */}
              <span className={`
                font-medium text-xs sm:text-sm leading-tight text-center max-w-full truncate px-1
                ${name === 'color' ? (
                  isSelected 
                    ? 'text-gray-900 dark:text-white font-semibold'
                    : 'text-gray-700 dark:text-gray-300'
                ) : (
                  isSelected 
                    ? optionConfig?.textClass || 'text-blue-800 dark:text-blue-200'
                    : 'text-gray-900 dark:text-white'
                )}
              `}>
                {option}
              </span>
            </div>
          );
        })}
      </div>
      {/* Close scroll container */}
      </div>
      {/* Load More Button */}
      {showLoadMore && (
        <div className="flex justify-center pt-2">
          <button
            onClick={handleLoadMore}
            className="group flex items-center justify-center w-8 h-8 rounded-full border border-dashed border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200"
            title="Load more options"
          >
            <ChevronRight className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 group-hover:translate-x-0.5 transition-all" />
          </button>
        </div>
      )}
      
      {/* Count indicator */}
      {needsLoadMore && (
        <div className="flex justify-center">
          <span className="text-xs text-gray-400 dark:text-gray-500">
            Showing {displayedOptions.length} of {options.length} options
          </span>
        </div>
      )}
    </div>
  );
}

// Export for backward compatibility
export default SelectBox;
