import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Globe, Calendar, MapPin, Flag, User, Star, Zap } from 'lucide-react';

interface StyledSelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  color?: string;
  gradient?: string;
}

interface StyledSelectProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  required?: boolean;
  variant?: 'language' | 'age' | 'country' | 'default';
}

// Icon and styling configurations for different field types
const getSelectConfig = (name: string, variant?: string) => {
  switch (name) {
    // Button Form Fields
    case 'purpose':
      return {
        icon: <User className="w-5 h-5" />,
        gradient: 'from-purple-500 to-indigo-600',
        optionConfigs: {
          'Mode concentration': { icon: '🧘', bgClass: 'bg-indigo-50 dark:bg-indigo-900/20', borderClass: 'border-indigo-400', textClass: 'text-indigo-800 dark:text-indigo-200', hoverClass: 'hover:bg-indigo-100', gradient: 'from-indigo-400 to-indigo-600' },
          'Lumière de lecture': { icon: '📚', bgClass: 'bg-amber-50 dark:bg-amber-900/20', borderClass: 'border-amber-400', textClass: 'text-amber-800 dark:text-amber-200', hoverClass: 'hover:bg-amber-100', gradient: 'from-amber-400 to-amber-600' },
          'Soirée film': { icon: '🍿', bgClass: 'bg-red-50 dark:bg-red-900/20', borderClass: 'border-red-400', textClass: 'text-red-800 dark:text-red-200', hoverClass: 'hover:bg-red-100', gradient: 'from-red-400 to-red-600' },
          'Ambiance fête': { icon: '🎉', bgClass: 'bg-pink-50 dark:bg-pink-900/20', borderClass: 'border-pink-400', textClass: 'text-pink-800 dark:text-pink-200', hoverClass: 'hover:bg-pink-100', gradient: 'from-pink-400 to-pink-600' },
          'Autre usage': { icon: '💡', bgClass: 'bg-gray-50 dark:bg-gray-700', borderClass: 'border-gray-400', textClass: 'text-gray-800 dark:text-gray-200', hoverClass: 'hover:bg-gray-100', gradient: 'from-gray-400 to-gray-600' }
        }
      };

    case 'shape':
      return {
        icon: <Star className="w-5 h-5" />,
        gradient: 'from-cyan-500 to-blue-600',
        optionConfigs: {
          'Cercle': { icon: '⭕', bgClass: 'bg-blue-50 dark:bg-blue-900/20', borderClass: 'border-blue-400', textClass: 'text-blue-800 dark:text-blue-200', hoverClass: 'hover:bg-blue-100', gradient: 'from-blue-400 to-blue-600' },
          'Carré': { icon: '⬜', bgClass: 'bg-green-50 dark:bg-green-900/20', borderClass: 'border-green-400', textClass: 'text-green-800 dark:text-green-200', hoverClass: 'hover:bg-green-100', gradient: 'from-green-400 to-green-600' },
          'Hexagone': { icon: '⬢', bgClass: 'bg-purple-50 dark:bg-purple-900/20', borderClass: 'border-purple-400', textClass: 'text-purple-800 dark:text-purple-200', hoverClass: 'hover:bg-purple-100', gradient: 'from-purple-400 to-purple-600' },
          'Octogone': { icon: '🛑', bgClass: 'bg-red-50 dark:bg-red-900/20', borderClass: 'border-red-400', textClass: 'text-red-800 dark:text-red-200', hoverClass: 'hover:bg-red-100', gradient: 'from-red-400 to-red-600' },
          'Losange': { icon: '💎', bgClass: 'bg-cyan-50 dark:bg-cyan-900/20', borderClass: 'border-cyan-400', textClass: 'text-cyan-800 dark:text-cyan-200', hoverClass: 'hover:bg-cyan-100', gradient: 'from-cyan-400 to-cyan-600' },
          'Étoile': { icon: '⭐', bgClass: 'bg-yellow-50 dark:bg-yellow-900/20', borderClass: 'border-yellow-400', textClass: 'text-yellow-800 dark:text-yellow-200', hoverClass: 'hover:bg-yellow-100', gradient: 'from-yellow-400 to-yellow-600' },
          'Triangle': { icon: '🔺', bgClass: 'bg-orange-50 dark:bg-orange-900/20', borderClass: 'border-orange-400', textClass: 'text-orange-800 dark:text-orange-200', hoverClass: 'hover:bg-orange-100', gradient: 'from-orange-400 to-orange-600' },
          'Cœur': { icon: '❤️', bgClass: 'bg-rose-50 dark:bg-rose-900/20', borderClass: 'border-rose-400', textClass: 'text-rose-800 dark:text-rose-200', hoverClass: 'hover:bg-rose-100', gradient: 'from-rose-400 to-rose-600' },
          'Ovale': { icon: '🥚', bgClass: 'bg-teal-50 dark:bg-teal-900/20', borderClass: 'border-teal-400', textClass: 'text-teal-800 dark:text-teal-200', hoverClass: 'hover:bg-teal-100', gradient: 'from-teal-400 to-teal-600' },
          'Pentagone': { icon: '⬟', bgClass: 'bg-indigo-50 dark:bg-indigo-900/20', borderClass: 'border-indigo-400', textClass: 'text-indigo-800 dark:text-indigo-200', hoverClass: 'hover:bg-indigo-100', gradient: 'from-indigo-400 to-indigo-600' },
          'Carré arrondi': { icon: '▢', bgClass: 'bg-emerald-50 dark:bg-emerald-900/20', borderClass: 'border-emerald-400', textClass: 'text-emerald-800 dark:text-emerald-200', hoverClass: 'hover:bg-emerald-100', gradient: 'from-emerald-400 to-emerald-600' },
          'Pilule': { icon: '💊', bgClass: 'bg-pink-50 dark:bg-pink-900/20', borderClass: 'border-pink-400', textClass: 'text-pink-800 dark:text-pink-200', hoverClass: 'hover:bg-pink-100', gradient: 'from-pink-400 to-pink-600' },
          'Nuage': { icon: '☁️', bgClass: 'bg-sky-50 dark:bg-sky-900/20', borderClass: 'border-sky-400', textClass: 'text-sky-800 dark:text-sky-200', hoverClass: 'hover:bg-sky-100', gradient: 'from-sky-400 to-sky-600' },
          'Fleur': { icon: '🌸', bgClass: 'bg-pink-50 dark:bg-pink-900/20', borderClass: 'border-pink-400', textClass: 'text-pink-800 dark:text-pink-200', hoverClass: 'hover:bg-pink-100', gradient: 'from-pink-400 to-pink-600' },
          'Éclair': { icon: '⚡', bgClass: 'bg-yellow-50 dark:bg-yellow-900/20', borderClass: 'border-yellow-400', textClass: 'text-yellow-800 dark:text-yellow-200', hoverClass: 'hover:bg-yellow-100', gradient: 'from-yellow-400 to-yellow-600' }
        }
      };

    case 'color':
      return {
        icon: <Globe className="w-5 h-5" />,
        gradient: 'from-rainbow-500 to-rainbow-600',
        optionConfigs: {
          'Bleu': { icon: '🔵', bgClass: 'bg-blue-50 dark:bg-blue-900/20', borderClass: 'border-blue-400', textClass: 'text-blue-800 dark:text-blue-200', hoverClass: 'hover:bg-blue-100', gradient: 'from-blue-400 to-blue-600' },
          '#FF7A00': { icon: '🟠', bgClass: 'bg-orange-50 dark:bg-orange-900/20', borderClass: 'border-orange-400', textClass: 'text-orange-800 dark:text-orange-200', hoverClass: 'hover:bg-orange-100', gradient: 'from-orange-400 to-orange-600' },
          'Violet': { icon: '🟣', bgClass: 'bg-purple-50 dark:bg-purple-900/20', borderClass: 'border-purple-400', textClass: 'text-purple-800 dark:text-purple-200', hoverClass: 'hover:bg-purple-100', gradient: 'from-purple-400 to-purple-600' },
          'Vert': { icon: '🟢', bgClass: 'bg-green-50 dark:bg-green-900/20', borderClass: 'border-green-400', textClass: 'text-green-800 dark:text-green-200', hoverClass: 'hover:bg-green-100', gradient: 'from-green-400 to-green-600' },
          'Jaune': { icon: '🟡', bgClass: 'bg-yellow-50 dark:bg-yellow-900/20', borderClass: 'border-yellow-400', textClass: 'text-yellow-800 dark:text-yellow-200', hoverClass: 'hover:bg-yellow-100', gradient: 'from-yellow-400 to-yellow-600' },
          'Rose': { icon: '🩷', bgClass: 'bg-pink-50 dark:bg-pink-900/20', borderClass: 'border-pink-400', textClass: 'text-pink-800 dark:text-pink-200', hoverClass: 'hover:bg-pink-100', gradient: 'from-pink-400 to-pink-600' },
          'Rouge': { icon: '🔴', bgClass: 'bg-red-50 dark:bg-red-900/20', borderClass: 'border-red-400', textClass: 'text-red-800 dark:text-red-200', hoverClass: 'hover:bg-red-100', gradient: 'from-red-400 to-red-600' },
          'Turquoise': { icon: '🟦', bgClass: 'bg-cyan-50 dark:bg-cyan-900/20', borderClass: 'border-cyan-400', textClass: 'text-cyan-800 dark:text-cyan-200', hoverClass: 'hover:bg-cyan-100', gradient: 'from-cyan-400 to-cyan-600' },
          'Indigo': { icon: '🟦', bgClass: 'bg-indigo-50 dark:bg-indigo-900/20', borderClass: 'border-indigo-400', textClass: 'text-indigo-800 dark:text-indigo-200', hoverClass: 'hover:bg-indigo-100', gradient: 'from-indigo-400 to-indigo-600' },
          'Citron vert': { icon: '🟢', bgClass: 'bg-lime-50 dark:bg-lime-900/20', borderClass: 'border-lime-400', textClass: 'text-lime-800 dark:text-lime-200', hoverClass: 'hover:bg-lime-100', gradient: 'from-lime-400 to-lime-600' },
          'Cyan': { icon: '🔷', bgClass: 'bg-cyan-50 dark:bg-cyan-900/20', borderClass: 'border-cyan-400', textClass: 'text-cyan-800 dark:text-cyan-200', hoverClass: 'hover:bg-cyan-100', gradient: 'from-cyan-400 to-cyan-600' },
          'Orange': { icon: '🟠', bgClass: 'bg-orange-50 dark:bg-orange-900/20', borderClass: 'border-orange-400', textClass: 'text-orange-800 dark:text-orange-200', hoverClass: 'hover:bg-orange-100', gradient: 'from-orange-400 to-orange-600' },
          'Personnalisée': { icon: '🎨', bgClass: 'bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20', borderClass: 'border-gradient-to-r from-pink-400 to-purple-400', textClass: 'text-purple-800 dark:text-purple-200', hoverClass: 'hover:from-pink-100 hover:to-purple-100', gradient: 'from-pink-400 to-purple-600' }
        }
      };

    case 'finish':
      return {
        icon: <Zap className="w-5 h-5" />,
        gradient: 'from-slate-500 to-zinc-600',
        optionConfigs: {
          'Mat': { icon: '🌫️', bgClass: 'bg-slate-50 dark:bg-slate-900/20', borderClass: 'border-slate-400', textClass: 'text-slate-800 dark:text-slate-200', hoverClass: 'hover:bg-slate-100', gradient: 'from-slate-400 to-slate-600' },
          'Brillant': { icon: '✨', bgClass: 'bg-yellow-50 dark:bg-yellow-900/20', borderClass: 'border-yellow-400', textClass: 'text-yellow-800 dark:text-yellow-200', hoverClass: 'hover:bg-yellow-100', gradient: 'from-yellow-400 to-yellow-600' },
          'Satiné': { icon: '🌟', bgClass: 'bg-amber-50 dark:bg-amber-900/20', borderClass: 'border-amber-400', textClass: 'text-amber-800 dark:text-amber-200', hoverClass: 'hover:bg-amber-100', gradient: 'from-amber-400 to-amber-600' },
          'Métallique': { icon: '🔩', bgClass: 'bg-gray-50 dark:bg-gray-700', borderClass: 'border-gray-400', textClass: 'text-gray-800 dark:text-gray-200', hoverClass: 'hover:bg-gray-100', gradient: 'from-gray-400 to-gray-600' },
          'Nacré': { icon: '🐚', bgClass: 'bg-pearl-50 dark:bg-slate-900/20', borderClass: 'border-slate-300', textClass: 'text-slate-800 dark:text-slate-200', hoverClass: 'hover:bg-pearl-100', gradient: 'from-slate-300 to-slate-500' },
          'Texturé': { icon: '🏔️', bgClass: 'bg-stone-50 dark:bg-stone-900/20', borderClass: 'border-stone-400', textClass: 'text-stone-800 dark:text-stone-200', hoverClass: 'hover:bg-stone-100', gradient: 'from-stone-400 to-stone-600' },
          'Carbone': { icon: '⚫', bgClass: 'bg-zinc-50 dark:bg-zinc-800', borderClass: 'border-zinc-400', textClass: 'text-zinc-800 dark:text-zinc-200', hoverClass: 'hover:bg-zinc-100', gradient: 'from-zinc-400 to-zinc-600' },
          'Toucher doux': { icon: '🪶', bgClass: 'bg-pink-50 dark:bg-pink-900/20', borderClass: 'border-pink-400', textClass: 'text-pink-800 dark:text-pink-200', hoverClass: 'hover:bg-pink-100', gradient: 'from-pink-400 to-pink-600' }
        }
      };
    
    // Book Form Fields (existing)
    case 'book_language':
      return {
        icon: <Globe className="w-5 h-5" />,
        gradient: 'from-blue-500 to-indigo-600',
        optionConfigs: {
          'English': { 
            icon: '🇺🇸', 
            bgClass: 'bg-blue-50 dark:bg-blue-900/20',
            borderClass: 'border-blue-400',
            textClass: 'text-blue-800 dark:text-blue-200',
            hoverClass: 'hover:bg-blue-100 dark:hover:bg-blue-900/30',
            gradient: 'from-blue-400 to-blue-600' 
          },
          'French': { 
            icon: '🇫🇷', 
            bgClass: 'bg-red-50 dark:bg-red-900/20',
            borderClass: 'border-red-400',
            textClass: 'text-red-800 dark:text-red-200',
            hoverClass: 'hover:bg-red-100 dark:hover:bg-red-900/30',
            gradient: 'from-red-400 to-red-600' 
          },
          'Arabic': { 
            icon: '🇸🇦', 
            bgClass: 'bg-green-50 dark:bg-green-900/20',
            borderClass: 'border-green-400',
            textClass: 'text-green-800 dark:text-green-200',
            hoverClass: 'hover:bg-green-100 dark:hover:bg-green-900/30',
            gradient: 'from-green-400 to-green-600' 
          },
          'Italian': { 
            icon: '🇮🇹', 
            bgClass: 'bg-emerald-50 dark:bg-emerald-900/20',
            borderClass: 'border-emerald-400',
            textClass: 'text-emerald-800 dark:text-emerald-200',
            hoverClass: 'hover:bg-emerald-100 dark:hover:bg-emerald-900/30',
            gradient: 'from-emerald-400 to-emerald-600' 
          }
        }
      };
    
    case 'child_age':
      return {
        icon: <Calendar className="w-5 h-5" />,
        gradient: 'from-purple-500 to-pink-600',
        optionConfigs: {
          '1': { icon: '👶', bgClass: 'bg-pink-50 dark:bg-pink-900/20', borderClass: 'border-pink-400', textClass: 'text-pink-800 dark:text-pink-200', hoverClass: 'hover:bg-pink-100', gradient: 'from-pink-400 to-pink-600' },
          '2': { icon: '👶', bgClass: 'bg-rose-50 dark:bg-rose-900/20', borderClass: 'border-rose-400', textClass: 'text-rose-800 dark:text-rose-200', hoverClass: 'hover:bg-rose-100', gradient: 'from-rose-400 to-rose-600' },
          '3': { icon: '👶', bgClass: 'bg-red-50 dark:bg-red-900/20', borderClass: 'border-red-400', textClass: 'text-red-800 dark:text-red-200', hoverClass: 'hover:bg-red-100', gradient: 'from-red-400 to-red-600' },
          '4': { icon: '🧸', bgClass: 'bg-orange-50 dark:bg-orange-900/20', borderClass: 'border-orange-400', textClass: 'text-orange-800 dark:text-orange-200', hoverClass: 'hover:bg-orange-100', gradient: 'from-orange-400 to-orange-600' },
          '5': { icon: '🧸', bgClass: 'bg-amber-50 dark:bg-amber-900/20', borderClass: 'border-amber-400', textClass: 'text-amber-800 dark:text-amber-200', hoverClass: 'hover:bg-amber-100', gradient: 'from-amber-400 to-amber-600' },
          '6': { icon: '🧸', bgClass: 'bg-yellow-50 dark:bg-yellow-900/20', borderClass: 'border-yellow-400', textClass: 'text-yellow-800 dark:text-yellow-200', hoverClass: 'hover:bg-yellow-100', gradient: 'from-yellow-400 to-yellow-600' },
          '7': { icon: '🎈', bgClass: 'bg-lime-50 dark:bg-lime-900/20', borderClass: 'border-lime-400', textClass: 'text-lime-800 dark:text-lime-200', hoverClass: 'hover:bg-lime-100', gradient: 'from-lime-400 to-lime-600' },
          '8': { icon: '🎈', bgClass: 'bg-green-50 dark:bg-green-900/20', borderClass: 'border-green-400', textClass: 'text-green-800 dark:text-green-200', hoverClass: 'hover:bg-green-100', gradient: 'from-green-400 to-green-600' },
          '9': { icon: '🎈', bgClass: 'bg-emerald-50 dark:bg-emerald-900/20', borderClass: 'border-emerald-400', textClass: 'text-emerald-800 dark:text-emerald-200', hoverClass: 'hover:bg-emerald-100', gradient: 'from-emerald-400 to-emerald-600' },
          '10+': { icon: '🧒', bgClass: 'bg-teal-50 dark:bg-teal-900/20', borderClass: 'border-teal-400', textClass: 'text-teal-800 dark:text-teal-200', hoverClass: 'hover:bg-teal-100', gradient: 'from-teal-400 to-teal-600' }
        }
      };
    
    case 'country':
      return {
        icon: <Flag className="w-5 h-5" />,
        gradient: 'from-indigo-500 to-purple-600',
        optionConfigs: {
          'France': { icon: '🇫🇷', bgClass: 'bg-blue-50 dark:bg-blue-900/20', borderClass: 'border-blue-400', textClass: 'text-blue-800 dark:text-blue-200', hoverClass: 'hover:bg-blue-100', gradient: 'from-blue-400 to-blue-600' },
          'United States': { icon: '🇺🇸', bgClass: 'bg-red-50 dark:bg-red-900/20', borderClass: 'border-red-400', textClass: 'text-red-800 dark:text-red-200', hoverClass: 'hover:bg-red-100', gradient: 'from-red-400 to-red-600' },
          'Italy': { icon: '🇮🇹', bgClass: 'bg-green-50 dark:bg-green-900/20', borderClass: 'border-green-400', textClass: 'text-green-800 dark:text-green-200', hoverClass: 'hover:bg-green-100', gradient: 'from-green-400 to-green-600' },
          'Saudi Arabia': { icon: '🇸🇦', bgClass: 'bg-emerald-50 dark:bg-emerald-900/20', borderClass: 'border-emerald-400', textClass: 'text-emerald-800 dark:text-emerald-200', hoverClass: 'hover:bg-emerald-100', gradient: 'from-emerald-400 to-emerald-600' },
          'United Arab Emirates': { icon: '🇦🇪', bgClass: 'bg-amber-50 dark:bg-amber-900/20', borderClass: 'border-amber-400', textClass: 'text-amber-800 dark:text-amber-200', hoverClass: 'hover:bg-amber-100', gradient: 'from-amber-400 to-amber-600' },
          'Algeria': { icon: '🇩🇿', bgClass: 'bg-teal-50 dark:bg-teal-900/20', borderClass: 'border-teal-400', textClass: 'text-teal-800 dark:text-teal-200', hoverClass: 'hover:bg-teal-100', gradient: 'from-teal-400 to-teal-600' },
          'Germany': { icon: '🇩🇪', bgClass: 'bg-yellow-50 dark:bg-yellow-900/20', borderClass: 'border-yellow-400', textClass: 'text-yellow-800 dark:text-yellow-200', hoverClass: 'hover:bg-yellow-100', gradient: 'from-yellow-400 to-yellow-600' },
          'Canada': { icon: '🇨🇦', bgClass: 'bg-rose-50 dark:bg-rose-900/20', borderClass: 'border-rose-400', textClass: 'text-rose-800 dark:text-rose-200', hoverClass: 'hover:bg-rose-100', gradient: 'from-rose-400 to-rose-600' },
          'Other': { icon: '🌍', bgClass: 'bg-gray-50 dark:bg-gray-700', borderClass: 'border-gray-400', textClass: 'text-gray-800 dark:text-gray-200', hoverClass: 'hover:bg-gray-100', gradient: 'from-gray-400 to-gray-600' }
        }
      };
    
    default:
      return {
        icon: <User className="w-5 h-5" />,
        gradient: 'from-gray-500 to-gray-600',
        optionConfigs: {}
      };
  }
};

export function StyledSelect({ name, value, onChange, options, placeholder, required, variant }: StyledSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const selectRef = useRef<HTMLDivElement>(null);
  const config = getSelectConfig(name, variant);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter options based on search term
  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOption = value ? options.find(opt => opt === value) : null;
  const selectedConfig = selectedOption ? config.optionConfigs[selectedOption as keyof typeof config.optionConfigs] : null;

  return (
    <div className="relative" ref={selectRef}>
      {/* Selected Value Display */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full px-4 py-3 border-2 rounded-xl cursor-pointer transition-all duration-200
          flex items-center justify-between gap-3
          ${isOpen 
            ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800' 
            : selectedConfig
              ? `${selectedConfig.borderClass} ${selectedConfig.bgClass}`
              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 bg-white dark:bg-gray-800'
          }
          shadow-sm hover:shadow-md
        `}
      >
        <div className="flex items-center gap-3 flex-1">
          {/* Icon */}
          <div className={`
            w-8 h-8 rounded-lg flex items-center justify-center text-white flex-shrink-0
            ${selectedConfig 
              ? `bg-gradient-to-r ${selectedConfig.gradient}` 
              : `bg-gradient-to-r ${config.gradient}`
            }
          `}>
            {selectedConfig?.icon || config.icon}
          </div>
          {/* Text */}
          <span className={`
            font-medium truncate
            ${value 
              ? selectedConfig?.textClass || 'text-gray-900 dark:text-white'
              : 'text-gray-500 dark:text-gray-400'
            }
          `}>
            {value || placeholder || 'Select an option'}
          </span>
        </div>
        {/* Chevron */}
        <ChevronDown 
          className={`
            w-5 h-5 transition-transform duration-200 flex-shrink-0
            ${isOpen ? 'rotate-180' : ''}
            ${selectedConfig?.textClass || 'text-gray-400'}
          `} 
        />
      </div>
      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-2">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl max-h-64 overflow-hidden">
            {/* Options List */}
            <div className="max-h-48 overflow-y-auto">
              {filteredOptions.length === 0 ? (
                <div className="px-4 py-3 text-gray-500 dark:text-gray-400 text-center">
                  No options found
                </div>
              ) : (
                filteredOptions.map((option, index) => {
                  const optionConfig = config.optionConfigs[option as keyof typeof config.optionConfigs];
                  const isSelected = option === value;
                  return (
                    <div
                      key={index}
                      onClick={() => {
                        onChange(option);
                        setIsOpen(false);
                        setSearchTerm('');
                      }}
                      className={`
                        px-4 py-3 cursor-pointer transition-all duration-150
                        flex items-center gap-3
                        ${isSelected 
                          ? `${optionConfig?.bgClass || 'bg-blue-50 dark:bg-blue-900/20'} ${optionConfig?.textClass || 'text-blue-800 dark:text-blue-200'}`
                          : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white'
                        }
                        border-l-4 ${isSelected 
                          ? optionConfig?.borderClass || 'border-blue-500'
                          : 'border-transparent'
                        }
                      `}
                    >
                      {/* Option Icon */}
                      <div className={`
                        w-8 h-8 rounded-lg flex items-center justify-center text-white flex-shrink-0
                        ${optionConfig 
                          ? `bg-gradient-to-r ${optionConfig.gradient}` 
                          : `bg-gradient-to-r ${config.gradient}`
                        }
                      `}>
                        {optionConfig?.icon || config.icon}
                      </div>
                      {/* Option Text */}
                      <span className="font-medium flex-1">{option}</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Export for backward compatibility
export default StyledSelect;
