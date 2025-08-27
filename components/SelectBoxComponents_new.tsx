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
  // Map options to normalized keys for consistent icon lookup (multi-lingual)
  const normalizeOption = (field: string, option: string): string => {
    const mapping: Record<string, Record<string, string>> = {
      // Generic demo fields still present elsewhere
      purpose: {
        'Mode concentration': 'focus', 'Focus Mode': 'focus',
        'Lumière de lecture': 'reading', 'Reading Light': 'reading',
        'Soirée film': 'movie', 'Movie Night': 'movie',
        'Ambiance fête': 'party', 'Party Scene': 'party',
        'Gaming Session': 'gaming', 'Meditation': 'meditation',
        'Workout': 'workout', 'Study Mode': 'study',
        'Relaxation': 'relaxation', 'Sleep Time': 'sleep',
        'Wake Up': 'wakeup', 'Mood Lighting': 'mood',
        'Autre usage': 'custom', 'Custom Purpose': 'custom'
      },
      // Song builder: Occasion (FR + EN + IT + AR)
      occasion: {
        // French
        'Anniversaire': 'birthday', 'Anniversaire de couple': 'anniversary', 'Demande en mariage': 'proposal', 'Motivation': 'motivation', 'Amitié': 'friendship', 'Juste comme ça': 'justbecause', 'Personnalisé...': 'custom',
        // English
        'Birthday': 'birthday', 'Couple Anniversary': 'anniversary', 'Marriage Proposal': 'proposal', 'Just because': 'justbecause', 'Custom...': 'custom',
        // Italian
        'Compleanno': 'birthday', 'Anniversario': 'anniversary', 'Proposta': 'proposal', 'Motivazione': 'motivation', 'Amicizia': 'friendship', 'Perché no': 'justbecause', 'Personalizzata...': 'custom',
        // Arabic
        'عيد ميلاد': 'birthday', 'ذكرى': 'anniversary', 'عرض زواج': 'proposal', 'تحفيز': 'motivation', 'صداقة': 'friendship', 'لمجرد ذلك': 'justbecause', 'مخصص...': 'custom'
      },
      // Primary Style (map to style_* keys)
      primary_style: {
        // English
  'Pop': 'style_pop', 'Acoustic': 'style_acoustic', 'Piano': 'style_piano', 'Cinematic': 'style_cinematic', 'Lofi': 'style_lofi', 'Ambient': 'style_ambient', 'Electronic': 'style_electronic', 'Folk': 'style_folk', 'Epic': 'style_epic', 'Orchestral': 'style_orchestral', 'Jazz': 'style_jazz', 'Chill': 'style_chill', 'Trap': 'style_trap', 'Rock': 'style_rock',
  // French
  'Acoustique': 'style_acoustic', 'Cinematique': 'style_cinematic', 'Cinématique': 'style_cinematic', 'Ambiant': 'style_ambient', 'Électronique': 'style_electronic', 'Épique': 'style_epic', 'Orchestrale': 'style_orchestral', 'Détente': 'style_chill', 'Relax': 'style_chill',
  // Italian
  'Acustico': 'style_acoustic', 'Pianoforte': 'style_piano', 'Cinematico': 'style_cinematic', 'Elettronico': 'style_electronic', 'Rilassato': 'style_chill', 'Epico': 'style_epic',
  // (Removed duplicate Orchestrale mapping for Italian/French consolidation)
  // Arabic
  'بوب': 'style_pop', 'أكوستيك': 'style_acoustic', 'بيانو': 'style_piano', 'سينمائي': 'style_cinematic', 'لوفي': 'style_lofi', 'محیط': 'style_ambient', 'إلكتروني': 'style_electronic', 'فولك': 'style_folk', 'ملحمي': 'style_epic', 'أوركسترالي': 'style_orchestral', 'جاز': 'style_jazz', 'مسترخي': 'style_chill', 'تراب': 'style_trap', 'روك': 'style_rock'
      },
      // Mood (map to mood_* keys)
      mood: {
        // English
        'Happy': 'mood_happy', 'Romantic': 'mood_romantic', 'Melancholic': 'mood_melancholic', 'Empowering': 'mood_empowering', 'Inspiring': 'mood_inspiring', 'Calm': 'mood_calm', 'Energetic': 'mood_energetic', 'Uplifting': 'mood_uplifting', 'Dreamy': 'mood_dreamy',
        // French (anticipated + seen subset)
        'Heureux': 'mood_happy', 'Romantique': 'mood_romantic', 'Mélancolique': 'mood_melancholic', 'Motivant': 'mood_empowering', 'Motivante': 'mood_empowering', 'Inspirant': 'mood_inspiring', 'Inspirante': 'mood_inspiring', 'Calme': 'mood_calm', 'Énergique': 'mood_energetic', 'Élévateur': 'mood_uplifting', 'Rêveur': 'mood_dreamy',
        // Italian
        'Felice': 'mood_happy', 'Romantico': 'mood_romantic', 'Malinconico': 'mood_melancholic', 'Potenziante': 'mood_empowering', 'Ispirante': 'mood_inspiring', 'Calmo': 'mood_calm', 'Energico': 'mood_energetic', 'Esaltante': 'mood_uplifting', 'Sognante': 'mood_dreamy',
        // Arabic
        'سعيد': 'mood_happy', 'رومانسي': 'mood_romantic', 'حزين جميل': 'mood_melancholic', 'تمكيني': 'mood_empowering', 'ملهم': 'mood_inspiring', 'هادئ': 'mood_calm', 'حيوي': 'mood_energetic', 'رافع': 'mood_uplifting', 'حالم': 'mood_dreamy'
      },
      // Lyric focus (map to focus_* keys)
      lyric_focus: {
        // English
  'Names': 'focus_names', 'Storytelling': 'focus_story', 'Message': 'focus_message', 'Minimal Lyrics': 'focus_minimal', 'Instrumental': 'focus_instrumental',
  // French
  'Noms': 'focus_names', 'Récit': 'focus_story', 'Accent sur le message': 'focus_message', 'Paroles minimales': 'focus_minimal',
        // Italian
        'Nomi': 'focus_names', 'Messaggio': 'focus_message', 'Testo minimale': 'focus_minimal', 'Strumentale': 'focus_instrumental',
        // Arabic
        'أسماء': 'focus_names', 'سرد': 'focus_story', 'رسالة': 'focus_message', 'كلمات قليلة': 'focus_minimal', 'موسيقى فقط': 'focus_instrumental'
      },
      // Length (map to len_* keys)
      length: {
        '~60s': 'len_short', '~90s': 'len_medium',
        'Up to 120s': 'len_long', 'Up to 120s (EN)': 'len_long',
        // French
        "Jusqu'à 120s": 'len_long',
        // Italian
        'Fino a 120s': 'len_long',
        // Arabic
        'حتى 120s': 'len_long'
      },
      // Existing demo select types
      shape: {
        'Cercle': 'circle', 'Circle': 'circle', 'Carré': 'square', 'Square': 'square', 'Hexagone': 'hexagon', 'Hexagon': 'hexagon', 'Octogone': 'octagon', 'Octagon': 'octagon', 'Losange': 'diamond', 'Diamond': 'diamond', 'Étoile': 'star', 'Star': 'star', 'Triangle': 'triangle', 'Cœur': 'heart', 'Heart': 'heart', 'Ovale': 'oval', 'Oval': 'oval', 'Pentagone': 'pentagon', 'Pentagon': 'pentagon', 'Carré arrondi': 'rounded-square', 'Rounded Square': 'rounded-square', 'Pilule': 'pill', 'Pill': 'pill', 'Nuage': 'cloud', 'Cloud': 'cloud', 'Fleur': 'flower', 'Flower': 'flower', 'Éclair': 'lightning', 'Lightning': 'lightning'
      },
      color: {
        'Bleu': 'blue', 'Blue': 'blue', 'Violet': 'purple', 'Purple': 'purple', 'Vert': 'green', 'Green': 'green', 'Jaune': 'yellow', 'Yellow': 'yellow', 'Rose': 'pink', 'Pink': 'pink', 'Rouge': 'red', 'Red': 'red', 'Turquoise': 'teal', 'Teal': 'teal', 'Indigo': 'indigo', 'Citron vert': 'lime', 'Lime': 'lime', 'Cyan': 'cyan', 'Orange': 'orange', '#FF7A00': 'orange', 'Personnalisée': 'custom', 'Custom': 'custom'
      },
      finish: {
        'Mat': 'matte', 'Matte': 'matte', 'Brillant': 'glossy', 'Glossy': 'glossy', 'Satiné': 'satin', 'Satin': 'satin', 'Métallique': 'metallic', 'Metallic': 'metallic', 'Nacré': 'pearl', 'Pearl': 'pearl', 'Texturé': 'textured', 'Textured': 'textured', 'Carbone': 'carbon', 'Carbon Fiber': 'carbon', 'Toucher doux': 'soft', 'Soft Touch': 'soft'
      }
    };
    return mapping[field]?.[option] || option.toLowerCase();
  };

  const normalizedKey = normalizeOption(fieldName, optionValue);

  // Icon mapping based on normalized keys
  const iconMap: Record<string, React.ReactNode> = {
    // Purpose icons (colored)
  focus: <Target className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-500" />,
  reading: <Book className="w-6 h-6 sm:w-8 sm:h-8 text-amber-600" />,
  movie: <Popcorn className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" />,
  party: <PartyPopper className="w-6 h-6 sm:w-8 sm:h-8 text-pink-500" />,
  gaming: <Gamepad2 className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />,
  meditation: <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500" />,
  workout: <Dumbbell className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500" />,
  study: <GraduationCap className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600" />,
  relaxation: <Feather className="w-6 h-6 sm:w-8 sm:h-8 text-teal-500" />,
  sleep: <Moon className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-400" />,
  wakeup: <Sunrise className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500" />,
  mood: <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-pink-500" />,
  custom: <Settings className="w-6 h-6 sm:w-8 sm:h-8 text-gray-500" />,

    // Shape icons
  circle: <Circle className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />,
  square: <Square className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />,
  hexagon: <Hexagon className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500" />,
  octagon: <StopCircle className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500" />,
  diamond: <Diamond className="w-6 h-6 sm:w-8 sm:h-8 text-pink-500" />,
  star: <Star className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500" />,
  triangle: <Triangle className="w-6 h-6 sm:w-8 sm:h-8 text-teal-500" />,
  heart: <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-rose-500" />,
  oval: <CircleDot className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-500" />,
  pentagon: <Pentagon className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-500" />,
  'rounded-square': <SquareDot className="w-6 h-6 sm:w-8 sm:h-8 text-lime-500" />,
  pill: <Pill className="w-6 h-6 sm:w-8 sm:h-8 text-pink-500" />,
  cloud: <Cloud className="w-6 h-6 sm:w-8 sm:h-8 text-sky-500" />,
  flower: <Flower2 className="w-6 h-6 sm:w-8 sm:h-8 text-fuchsia-500" />,
  lightning: <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500" />,

    // Color icons (palette symbol colored by color name)
  blue: <Palette className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />,
  purple: <Palette className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500" />,
  green: <Palette className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />,
  yellow: <Palette className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500" />,
  pink: <Palette className="w-6 h-6 sm:w-8 sm:h-8 text-pink-500" />,
  red: <Palette className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" />,
  teal: <Palette className="w-6 h-6 sm:w-8 sm:h-8 text-teal-500" />,
  indigo: <Palette className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-500" />,
  lime: <Palette className="w-6 h-6 sm:w-8 sm:h-8 text-lime-500" />,
  cyan: <Palette className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-500" />,
  orange: <Palette className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500" />,

    // Finish icons
  matte: <Chrome className="w-6 h-6 sm:w-8 sm:h-8 text-slate-500" />,
  glossy: <Sun className="w-6 h-6 sm:w-8 sm:h-8 text-amber-500" />,
  satin: <Layers className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500" />,
  metallic: <Mountain className="w-6 h-6 sm:w-8 sm:h-8 text-gray-500" />,
  pearl: <CircleDot className="w-6 h-6 sm:w-8 sm:h-8 text-pink-400" />,
  textured: <Grip className="w-6 h-6 sm:w-8 sm:h-8 text-stone-500" />,
  carbon: <Cpu className="w-6 h-6 sm:w-8 sm:h-8 text-zinc-600" />,
  soft: <Feather className="w-6 h-6 sm:w-8 sm:h-8 text-rose-400" />,

    // Occasion icons
  birthday: <PartyPopper className="w-6 h-6 sm:w-8 sm:h-8 text-pink-500" />,
  anniversary: <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-rose-500" />,
  proposal: <Diamond className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-500" />,
  motivation: <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-amber-500" />,
  friendship: <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" />,
  justbecause: <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500" />,

    // Style icons
  style_pop: <Music className="w-6 h-6 sm:w-8 sm:h-8 text-fuchsia-500" />,
  style_acoustic: <Feather className="w-6 h-6 sm:w-8 sm:h-8 text-amber-600" />,
  style_piano: <Music className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-500" />,
  style_cinematic: <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500" />,
  style_lofi: <Moon className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-400" />,
  style_ambient: <Cloud className="w-6 h-6 sm:w-8 sm:h-8 text-sky-400" />,
  style_electronic: <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-500" />,
  style_folk: <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-rose-500" />,
  style_epic: <Mountain className="w-6 h-6 sm:w-8 sm:h-8 text-slate-600" />,
  style_orchestral: <Layers className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500" />,
  style_jazz: <Star className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500" />,
  style_chill: <Feather className="w-6 h-6 sm:w-8 sm:h-8 text-teal-500" />,
  style_trap: <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-pink-500" />,
  style_rock: <Diamond className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />,

    // Mood icons
  mood_happy: <Sun className="w-6 h-6 sm:w-8 sm:h-8 text-amber-500" />,
  mood_romantic: <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-rose-500" />,
  mood_melancholic: <Moon className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-500" />,
  mood_empowering: <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500" />,
  mood_inspiring: <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500" />,
  mood_calm: <Feather className="w-6 h-6 sm:w-8 sm:h-8 text-teal-500" />,
  mood_energetic: <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-pink-500" />,
  mood_uplifting: <Sunrise className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500" />,
  mood_dreamy: <Cloud className="w-6 h-6 sm:w-8 sm:h-8 text-sky-400" />,

    // Lyric focus icons
  focus_names: <User className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />,
  focus_story: <Book className="w-6 h-6 sm:w-8 sm:h-8 text-amber-600" />,
  focus_message: <Target className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" />,
  focus_minimal: <CircleDot className="w-6 h-6 sm:w-8 sm:h-8 text-gray-500" />,
  focus_instrumental: <Music className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-500" />,

    // Length icons
  len_short: <Timer className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />,
  len_medium: <Timer className="w-6 h-6 sm:w-8 sm:h-8 text-amber-500" />,
  len_long: <Timer className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" />
  };

  return iconMap[normalizedKey] || <MoreHorizontal className="w-4 h-4" />;
};

// Function to get color value for color options
const getColorValue = (colorName: string): string => {
  const colorMap: Record<string, string> = {
    // French color names
    'Bleu': '#3B82F6',
    'Violet': '#8B5CF6', 
    'Vert': '#10B981',
    'Jaune': '#F59E0B',
    'Rose': '#EC4899',
    'Rouge': '#EF4444',
    'Turquoise': '#14B8A6',
    'Indigo': '#6366F1',
    'Citron vert': '#84CC16',
    'Cyan': '#06B6D4',
    'Orange': '#F97316',
    // English color names
    'Blue': '#3B82F6',
    'Purple': '#8B5CF6',
    'Green': '#10B981',
    'Yellow': '#F59E0B',
    'Pink': '#EC4899',
    'Red': '#EF4444',
    'Teal': '#14B8A6',
    'Lime': '#84CC16',
    'Indigo (EN)': '#6366F1',
    'Cyan (EN)': '#06B6D4',
    'Orange (EN)': '#F97316',
    // Custom options
    'Personnalisée': '#6B7280',
    'Custom': '#6B7280'
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
          'Fleur': { bgClass: 'bg-purple-50 dark:bg-purple-900/20', borderClass: 'border-purple-400', textClass: 'text-purple-800 dark:text-purple-200', hoverClass: 'hover:bg-purple-100', gradient: 'from-purple-400 to-purple-600' },
          'Éclair': { bgClass: 'bg-yellow-50 dark:bg-yellow-900/20', borderClass: 'border-yellow-400', textClass: 'text-yellow-800 dark:text-yellow-200', hoverClass: 'hover:bg-yellow-100', gradient: 'from-yellow-400 to-yellow-600' },
          // English translations
          'Circle': { bgClass: 'bg-blue-50 dark:bg-blue-900/20', borderClass: 'border-blue-400', textClass: 'text-blue-800 dark:text-blue-200', hoverClass: 'hover:bg-blue-100', gradient: 'from-blue-400 to-blue-600' },
          'Square': { bgClass: 'bg-green-50 dark:bg-green-900/20', borderClass: 'border-green-400', textClass: 'text-green-800 dark:text-green-200', hoverClass: 'hover:bg-green-100', gradient: 'from-green-400 to-green-600' },
          'Hexagon': { bgClass: 'bg-purple-50 dark:bg-purple-900/20', borderClass: 'border-purple-400', textClass: 'text-purple-800 dark:text-purple-200', hoverClass: 'hover:bg-purple-100', gradient: 'from-purple-400 to-purple-600' },
          'Octagon': { bgClass: 'bg-red-50 dark:bg-red-900/20', borderClass: 'border-red-400', textClass: 'text-red-800 dark:text-red-200', hoverClass: 'hover:bg-red-100', gradient: 'from-red-400 to-red-600' },
          'Diamond': { bgClass: 'bg-cyan-50 dark:bg-cyan-900/20', borderClass: 'border-cyan-400', textClass: 'text-cyan-800 dark:text-cyan-200', hoverClass: 'hover:bg-cyan-100', gradient: 'from-cyan-400 to-cyan-600' },
          'Star': { bgClass: 'bg-yellow-50 dark:bg-yellow-900/20', borderClass: 'border-yellow-400', textClass: 'text-yellow-800 dark:text-yellow-200', hoverClass: 'hover:bg-yellow-100', gradient: 'from-yellow-400 to-yellow-600' },
          'Triangle (EN)': { bgClass: 'bg-orange-50 dark:bg-orange-900/20', borderClass: 'border-orange-400', textClass: 'text-orange-800 dark:text-orange-200', hoverClass: 'hover:bg-orange-100', gradient: 'from-orange-400 to-orange-600' },
          'Heart': { bgClass: 'bg-rose-50 dark:bg-rose-900/20', borderClass: 'border-rose-400', textClass: 'text-rose-800 dark:text-rose-200', hoverClass: 'hover:bg-rose-100', gradient: 'from-rose-400 to-rose-600' },
          'Oval': { bgClass: 'bg-teal-50 dark:bg-teal-900/20', borderClass: 'border-teal-400', textClass: 'text-teal-800 dark:text-teal-200', hoverClass: 'hover:bg-teal-100', gradient: 'from-teal-400 to-teal-600' },
          'Pentagon': { bgClass: 'bg-indigo-50 dark:bg-indigo-900/20', borderClass: 'border-indigo-400', textClass: 'text-indigo-800 dark:text-indigo-200', hoverClass: 'hover:bg-indigo-100', gradient: 'from-indigo-400 to-indigo-600' },
          'Rounded Square': { bgClass: 'bg-emerald-50 dark:bg-emerald-900/20', borderClass: 'border-emerald-400', textClass: 'text-emerald-800 dark:text-emerald-200', hoverClass: 'hover:bg-emerald-100', gradient: 'from-emerald-400 to-emerald-600' },
          'Pill': { bgClass: 'bg-pink-50 dark:bg-pink-900/20', borderClass: 'border-pink-400', textClass: 'text-pink-800 dark:text-pink-200', hoverClass: 'hover:bg-pink-100', gradient: 'from-pink-400 to-pink-600' },
          'Cloud': { bgClass: 'bg-sky-50 dark:bg-sky-900/20', borderClass: 'border-sky-400', textClass: 'text-sky-800 dark:text-sky-200', hoverClass: 'hover:bg-sky-100', gradient: 'from-sky-400 to-sky-600' },
          'Flower': { bgClass: 'bg-purple-50 dark:bg-purple-900/20', borderClass: 'border-purple-400', textClass: 'text-purple-800 dark:text-purple-200', hoverClass: 'hover:bg-purple-100', gradient: 'from-purple-400 to-purple-600' },
          'Lightning': { bgClass: 'bg-yellow-50 dark:bg-yellow-900/20', borderClass: 'border-yellow-400', textClass: 'text-yellow-800 dark:text-yellow-200', hoverClass: 'hover:bg-yellow-100', gradient: 'from-yellow-400 to-yellow-600' },
          'Forme personnalisée': { bgClass: 'bg-gray-50 dark:bg-gray-700', borderClass: 'border-gray-400', textClass: 'text-gray-800 dark:text-gray-200', hoverClass: 'hover:bg-gray-100', gradient: 'from-gray-400 to-gray-600' },
          'Custom Shape': { bgClass: 'bg-gray-50 dark:bg-gray-700', borderClass: 'border-gray-400', textClass: 'text-gray-800 dark:text-gray-200', hoverClass: 'hover:bg-gray-100', gradient: 'from-gray-400 to-gray-600' }
        }
      };

    case 'color':
      return {
        columns: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8',
        optionConfigs: {}
      };

    case 'finish':
      return {
        columns: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8',
        optionConfigs: {
          'Mat': { bgClass: 'bg-slate-50 dark:bg-slate-900/20', borderClass: 'border-slate-400', textClass: 'text-slate-800 dark:text-slate-200', hoverClass: 'hover:bg-slate-100', gradient: 'from-slate-400 to-slate-600' },
          'Brillant': { bgClass: 'bg-amber-50 dark:bg-amber-900/20', borderClass: 'border-amber-400', textClass: 'text-amber-800 dark:text-amber-200', hoverClass: 'hover:bg-amber-100', gradient: 'from-amber-400 to-amber-600' },
          'Satiné': { bgClass: 'bg-purple-50 dark:bg-purple-900/20', borderClass: 'border-purple-400', textClass: 'text-purple-800 dark:text-purple-200', hoverClass: 'hover:bg-purple-100', gradient: 'from-purple-400 to-purple-600' },
          'Métallique': { bgClass: 'bg-gray-50 dark:bg-gray-900/20', borderClass: 'border-gray-400', textClass: 'text-gray-800 dark:text-gray-200', hoverClass: 'hover:bg-gray-100', gradient: 'from-gray-400 to-gray-600' },
          'Nacré': { bgClass: 'bg-pink-50 dark:bg-pink-900/20', borderClass: 'border-pink-400', textClass: 'text-pink-800 dark:text-pink-200', hoverClass: 'hover:bg-pink-100', gradient: 'from-pink-400 to-pink-600' },
          'Texturé': { bgClass: 'bg-orange-50 dark:bg-orange-900/20', borderClass: 'border-orange-400', textClass: 'text-orange-800 dark:text-orange-200', hoverClass: 'hover:bg-orange-100', gradient: 'from-orange-400 to-orange-600' },
          'Carbone': { bgClass: 'bg-zinc-50 dark:bg-zinc-900/20', borderClass: 'border-zinc-400', textClass: 'text-zinc-800 dark:text-zinc-200', hoverClass: 'hover:bg-zinc-100', gradient: 'from-zinc-400 to-zinc-600' },
          'Toucher doux': { bgClass: 'bg-teal-50 dark:bg-teal-900/20', borderClass: 'border-teal-400', textClass: 'text-teal-800 dark:text-teal-200', hoverClass: 'hover:bg-teal-100', gradient: 'from-teal-400 to-teal-600' },
          // English translations
          'Matte': { bgClass: 'bg-slate-50 dark:bg-slate-900/20', borderClass: 'border-slate-400', textClass: 'text-slate-800 dark:text-slate-200', hoverClass: 'hover:bg-slate-100', gradient: 'from-slate-400 to-slate-600' },
          'Glossy': { bgClass: 'bg-amber-50 dark:bg-amber-900/20', borderClass: 'border-amber-400', textClass: 'text-amber-800 dark:text-amber-200', hoverClass: 'hover:bg-amber-100', gradient: 'from-amber-400 to-amber-600' },
          'Satin': { bgClass: 'bg-purple-50 dark:bg-purple-900/20', borderClass: 'border-purple-400', textClass: 'text-purple-800 dark:text-purple-200', hoverClass: 'hover:bg-purple-100', gradient: 'from-purple-400 to-purple-600' },
          'Metallic': { bgClass: 'bg-gray-50 dark:bg-gray-900/20', borderClass: 'border-gray-400', textClass: 'text-gray-800 dark:text-gray-200', hoverClass: 'hover:bg-gray-100', gradient: 'from-gray-400 to-gray-600' },
          'Pearl': { bgClass: 'bg-pink-50 dark:bg-pink-900/20', borderClass: 'border-pink-400', textClass: 'text-pink-800 dark:text-pink-200', hoverClass: 'hover:bg-pink-100', gradient: 'from-pink-400 to-pink-600' },
          'Textured': { bgClass: 'bg-orange-50 dark:bg-orange-900/20', borderClass: 'border-orange-400', textClass: 'text-orange-800 dark:text-orange-200', hoverClass: 'hover:bg-orange-100', gradient: 'from-orange-400 to-orange-600' },
          'Carbon Fiber': { bgClass: 'bg-zinc-50 dark:bg-zinc-900/20', borderClass: 'border-zinc-400', textClass: 'text-zinc-800 dark:text-zinc-200', hoverClass: 'hover:bg-zinc-100', gradient: 'from-zinc-400 to-zinc-600' },
          'Soft Touch': { bgClass: 'bg-teal-50 dark:bg-teal-900/20', borderClass: 'border-teal-400', textClass: 'text-teal-800 dark:text-teal-200', hoverClass: 'hover:bg-teal-100', gradient: 'from-teal-400 to-teal-600' },
          'Finition personnalisée': { bgClass: 'bg-gray-50 dark:bg-gray-700', borderClass: 'border-gray-400', textClass: 'text-gray-800 dark:text-gray-200', hoverClass: 'hover:bg-gray-100', gradient: 'from-gray-400 to-gray-600' },
          'Custom Finish': { bgClass: 'bg-gray-50 dark:bg-gray-700', borderClass: 'border-gray-400', textClass: 'text-gray-800 dark:text-gray-200', hoverClass: 'hover:bg-gray-100', gradient: 'from-gray-400 to-gray-600' }
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
  itemsPerPage = 12 // kept for backward compatibility but overridden by dynamic sizing
}) => {
  const [visibleCount, setVisibleCount] = useState(0); // will be set dynamically based on viewport
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [columnsInView, setColumnsInView] = useState(0);

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

  // Calculate items for 2 rows in view (falls back to heuristic if measurement not ready)
  const itemsPerTwoRows = (columnsInView || columnsPerRow) * 2;
  const INITIAL_COUNT = 6;
  const INCREMENT = 4;

  // Initialize / adjust visible count when columns change (e.g., resize) or options change.
  React.useEffect(() => {
    setVisibleCount(prev => {
      if (prev === 0) return Math.min(INITIAL_COUNT, options.length);
      // If options shrink below current visible count, clamp down
      return Math.min(prev, options.length);
    });
  }, [options.length]);

  // Measure container width and ensure we show enough items to fill width (2 rows)
  React.useLayoutEffect(() => {
    const measure = () => {
      const container = scrollContainerRef.current;
      const grid = gridRef.current;
      if (!container) return;
      const containerWidth = container.clientWidth;
  const SMALL_MAX = 425;
      // determine current gap from computed styles if possible; default 16px
      let gapPx = 16;
      if (grid) {
        try {
          const cs = getComputedStyle(grid);
          const parsed = parseFloat(cs.columnGap || '16');
          if (!Number.isNaN(parsed)) gapPx = parsed;
        } catch {}
      }
      const TILE = 120; // matches gridTemplateRows/Columns size
      const colsFit = Math.max(1, Math.floor((containerWidth + gapPx) / (TILE + gapPx)));
      setColumnsInView(colsFit);

      // Small widths: don't auto-expand; ensure at least INITIAL_COUNT
      if (containerWidth <= SMALL_MAX) {
        setVisibleCount(prev => {
          const base = prev || Math.min(INITIAL_COUNT, options.length);
          return Math.min(base, options.length);
        });
        return;
      }

      // Large widths: auto-expand to fill 2 rows
      const minNeeded = Math.min(options.length, colsFit * 2);
      setVisibleCount(prev => {
        if (!prev) return minNeeded;
        return Math.max(prev, minNeeded);
      });
    };

    measure();
  const RO = (window as any).ResizeObserver;
  const ro = RO ? new RO(() => measure()) : null;
  if (ro && scrollContainerRef.current) ro.observe(scrollContainerRef.current);
    const onResize = () => measure();
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      if (ro && scrollContainerRef.current) ro.unobserve(scrollContainerRef.current);
    };
  }, [options.length]);

  const displayedOptions = options.slice(0, Math.min(visibleCount, options.length));

  // Show load more only if there are more items than currently displayed
  const showLoadMore = displayedOptions.length < options.length;
  const needsLoadMore = options.length > itemsPerTwoRows;

  const handleLoadMore = () => {
    const container = scrollContainerRef.current;
    const width = container?.clientWidth || 0;
    const SMALL_MAX = 425;
    let newCount = visibleCount + INCREMENT;
    // On large widths, prefer expanding by a full new column pair (2 rows)
    if (width > SMALL_MAX && columnsInView > 0) {
      const perPage = columnsInView * 2;
      const currentPages = Math.ceil(visibleCount / perPage);
      newCount = Math.max(newCount, Math.min(options.length, (currentPages + 1) * perPage));
    }
    newCount = Math.min(newCount, options.length);
    setVisibleCount(newCount);
    // Smooth scroll to end to reveal newly loaded items
    requestAnimationFrame(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({ left: scrollContainerRef.current.scrollWidth, behavior: 'smooth' });
      }
    });
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
          ref={gridRef}
          className="grid gap-4 sm:gap-5 pb-2"
          style={{
            // Fixed-size cells for consistent initial appearance
            gridTemplateColumns: `repeat(${Math.ceil(displayedOptions.length / 2)}, 120px)`, // number of columns is half the number of visible boxes (2 rows)
            gridTemplateRows: 'repeat(2, 120px)',
            gridAutoFlow: 'column'
          }}
        >
        {displayedOptions.map((option, index) => {
          const optionConfig = config.optionConfigs[option as keyof typeof config.optionConfigs];
          const isSelected = option === value;
          // Determine if we should split label into two lines (two words + cramped layout)
          const words = option.trim().split(/\s+/);
          const isTwoWords = words.length === 2;
          const smallViewport = typeof window !== 'undefined' ? window.innerWidth < 640 : false; // < sm breakpoint
          const crampedColumns = columnsPerRow <= 3; // heuristic: fewer columns => narrower squares
          const shouldSplit = isTwoWords && (smallViewport || crampedColumns);
          const displayLabel = shouldSplit ? `${words[0]}\n${words[1]}` : option;
          
          return (
      <div
              key={`${option}-${index}`}
              onClick={() => onChange(isSelected ? '' : option)}
              className={`
        aspect-square p-2 sm:p-3 border-2 rounded-xl cursor-pointer transition-all duration-200
        flex flex-col items-center justify-center text-center gap-1 h-full w-full
                ${name === 'color' ? (
                  isSelected 
                    ? 'border-gray-800 dark:border-gray-200 shadow-lg' 
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 bg-white dark:bg-gray-800'
                ) : (
                  isSelected 
                    ? `${optionConfig?.borderClass || 'border-blue-500'} ${optionConfig?.bgClass || 'bg-blue-50 dark:bg-blue-900/20'} shadow-sm`
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
                w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center
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
                  <div className="scale-110 sm:scale-125 flex items-center justify-center">{getIconForOption(name, option)}</div>
                )}
              </div>
              
              {/* Label */}
              <span className={`
                font-medium whitespace-pre-line text-[10px] sm:text-xs leading-tight text-center max-w-full px-1 line-clamp-2
                ${name === 'color' ? (
                  isSelected 
                    ? 'text-gray-900 dark:text-white font-semibold'
                    : 'text-gray-700 dark:text-gray-300'
                ) : (
                  isSelected 
                    ? optionConfig?.textClass || 'text-blue-800 dark:text-blue-200'
                    : 'text-gray-900 dark:text-white'
                )}
              `}
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                minHeight: '2.4em' // reserve space for 2 lines to align tiles visually
              }}
              >
                {displayLabel}
              </span>
            </div>
          );
        })}
        </div>
      </div>

      {/* Load More Button */}
  {showLoadMore && (
        <div className="flex justify-center pt-2">
          <button
            type="button"
            onClick={handleLoadMore}
            aria-label={`Load more (${options.length - displayedOptions.length} remaining)`}
            title={`${options.length - displayedOptions.length} more`}
            className="px-3 py-1.5 inline-flex items-center gap-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:ring-offset-1 focus:ring-offset-white dark:focus:ring-offset-gray-900 transition-colors"
          >
            <span className="sr-only">Load more</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default SelectBox;
