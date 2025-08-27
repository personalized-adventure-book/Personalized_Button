export interface CustomerInfo {
  fullName: string;
  email: string;
  phone?: string;
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    instructions?: string;
  };
}

export interface ButtonConfig {
  // Customer Information
  customerInfo: CustomerInfo;
  // Button Configuration
  purpose: Purpose;
  shape: Shape;
  color: string;
  customColors: string[]; // User's custom colors get added here
  finish: Finish;
  label: string;
  icon: string | null;
  iconAlignment: "left" | "above" | "text-only";
  iconPosition: { x: number; y: number }; // For drag & drop positioning
  iconSize: number; // Size in pixels (16-48)
  labelPosition: { x: number; y: number }; // For drag & drop positioning
  labelSize: number; // Size in pixels (10-24)
  uploadedImage: UploadedImage | null;
  lightMode: LightMode;
  brightness: number;
  wifiEnabled: boolean;
  wifiFeatures: WifiFeatures;
  schedule: ScheduleRule[];
  quantity: number;
  customPurpose?: string;
}

export interface Purpose {
  id: string;
  name: string;
  image: string;
}

export interface Shape {
  id: string;
  name: string;
  preview: string;
  description: string;
}

export interface Finish {
  id: string;
  name: string;
  description: string;
  price: number;
  premium: boolean;
}

export interface UploadedImage {
  id: string;
  file: File | string;
  keepBackground: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  // Remote storage metadata (optional)
  driveFileId?: string; // Google Drive file ID after upload
  originalFileName?: string; // Client-provided original name
}

export interface LightMode {
  id: string;
  name: string;
  description: string;
  animated: boolean;
  previewColor: string;
  price: number;
}

export interface WifiFeatures {
  remoteControl: boolean;
  scheduling: boolean;
  smartHomeIntegration: boolean;
  voiceControl: boolean;
  geofencing: boolean;
  notifications: boolean;
  analyticsReporting: boolean;
  firmwareUpdates: boolean;
  cloudSync: boolean;
  multiDeviceControl: boolean;
}

export interface ScheduleRule {
  id: string;
  time: string;
  enabled: boolean;
}

// Expanded shapes - 15 different shapes
export const shapes: Shape[] = [
  {
    id: "round",
    name: "Circle",
    preview: "rounded-full",
    description: "Classic circular button",
  },
  {
    id: "square",
    name: "Square",
    preview: "rounded-lg",
    description: "Modern square shape",
  },
  {
    id: "hexagon",
    name: "Hexagon",
    preview: "clip-path-hexagon",
    description: "Unique hexagonal design",
  },
  {
    id: "octagon",
    name: "Octagon",
    preview: "clip-path-octagon",
    description: "Eight-sided geometric shape",
  },
  {
    id: "diamond",
    name: "Diamond",
    preview: "clip-path-diamond",
    description: "Elegant diamond shape",
  },
  {
    id: "star",
    name: "Star",
    preview: "clip-path-star",
    description: "Five-pointed star",
  },
  {
    id: "triangle",
    name: "Triangle",
    preview: "clip-path-triangle",
    description: "Sharp triangular design",
  },
  {
    id: "heart",
    name: "Heart",
    preview: "clip-path-heart",
    description: "Romantic heart shape",
  },
  {
    id: "oval",
    name: "Oval",
    preview: "rounded-full",
    description: "Elongated oval button",
  },
  {
    id: "pentagon",
    name: "Pentagon",
    preview: "clip-path-pentagon",
    description: "Five-sided polygon",
  },
  {
    id: "rounded-square",
    name: "Rounded Square",
    preview: "rounded-2xl",
    description: "Softly rounded square",
  },
  {
    id: "pill",
    name: "Pill",
    preview: "rounded-full",
    description: "Capsule-shaped button",
  },
  {
    id: "cloud",
    name: "Cloud",
    preview: "clip-path-cloud",
    description: "Fluffy cloud shape",
  },
  {
    id: "flower",
    name: "Flower",
    preview: "clip-path-flower",
    description: "Petal flower design",
  },
  {
    id: "lightning",
    name: "Lightning",
    preview: "clip-path-lightning",
    description: "Electric lightning bolt",
  },
];

// Expanded finishes - 8 different finishes
export const finishes: Finish[] = [
  {
    id: "matte",
    name: "Matte",
    description: "Smooth, non-reflective surface",
    price: 0,
    premium: false,
  },
  {
    id: "glossy",
    name: "Glossy",
    description: "High-shine reflective finish",
    price: 5,
    premium: false,
  },
  {
    id: "satin",
    name: "Satin",
    description: "Semi-gloss with silk-like feel",
    price: 8,
    premium: true,
  },
  {
    id: "metallic",
    name: "Metallic",
    description: "Brushed metal appearance",
    price: 15,
    premium: true,
  },
  {
    id: "pearl",
    name: "Pearl",
    description: "Iridescent pearl finish",
    price: 12,
    premium: true,
  },
  {
    id: "textured",
    name: "Textured",
    description: "Grip-friendly raised texture",
    price: 10,
    premium: true,
  },
  {
    id: "carbon",
    name: "Carbon Fiber",
    description: "High-tech carbon weave",
    price: 20,
    premium: true,
  },
  {
    id: "soft-touch",
    name: "Soft Touch",
    description: "Velvety soft coating",
    price: 18,
    premium: true,
  },
];

// Expanded light modes - 12 different modes
export const lightModes: LightMode[] = [
  {
    id: "static",
    name: "Static",
    description: "Constant steady light",
    animated: false,
    previewColor: "#FF7A00",
    price: 0,
  },
  {
    id: "pulse",
    name: "Pulse",
    description: "Gentle rhythmic pulsing",
    animated: true,
    previewColor: "#FF7A00",
    price: 0,
  },
  {
    id: "fade",
    name: "Fade In/Out",
    description: "Smooth fade transitions",
    animated: true,
    previewColor: "#FF7A00",
    price: 0,
  },
  {
    id: "breathe",
    name: "Breathe",
    description: "Slow natural breathing effect",
    animated: true,
    previewColor: "#0055FF",
    price: 5,
  },
  {
    id: "rainbow",
    name: "Rainbow Cycle",
    description: "Smooth color transitions",
    animated: true,
    previewColor:
      "linear-gradient(90deg, #FF0000, #FF7F00, #FFFF00, #00FF00, #0000FF, #4B0082, #9400D3)",
    price: 10,
  },
  {
    id: "strobe",
    name: "Strobe",
    description: "Fast flashing light",
    animated: true,
    previewColor: "#FFFFFF",
    price: 8,
  },
  {
    id: "sparkle",
    name: "Sparkle",
    description: "Twinkling star effect",
    animated: true,
    previewColor: "#FFD700",
    price: 12,
  },
  {
    id: "wave",
    name: "Wave",
    description: "Rolling wave motion",
    animated: true,
    previewColor: "#00BFFF",
    price: 15,
  },
  {
    id: "fire",
    name: "Fire",
    description: "Flickering flame effect",
    animated: true,
    previewColor: "#FF4500",
    price: 18,
  },
  {
    id: "aurora",
    name: "Aurora",
    description: "Northern lights effect",
    animated: true,
    previewColor: "linear-gradient(45deg, #00FF7F, #9370DB, #FF69B4)",
    price: 25,
  },
  {
    id: "lightning",
    name: "Lightning",
    description: "Electric bolt flashes",
    animated: true,
    previewColor: "#FFFF00",
    price: 20,
  },
  {
    id: "galaxy",
    name: "Galaxy",
    description: "Swirling cosmic colors",
    animated: true,
    previewColor: "radial-gradient(circle, #4B0082, #000080, #000000)",
    price: 30,
  },
];

// Expanded icon library - 50+ icons
export const iconCategories = {
  essential: [
    "Home",
    "Star",
    "Heart",
    "Moon",
    "Sun",
    "Play",
    "Pause",
    "Settings",
    "Power",
    "Check",
  ],
  communication: [
    "Phone",
    "Mail",
    "MessageCircle",
    "Bell",
    "Mic",
    "MicOff",
    "Volume2",
    "VolumeX",
    "Wifi",
    "WifiOff",
  ],
  media: [
    "Music",
    "Video",
    "Camera",
    "Film",
    "Headphones",
    "Radio",
    "Tv",
    "Monitor",
    "Smartphone",
    "Tablet",
  ],
  productivity: [
    "Coffee",
    "Book",
    "Calendar",
    "Clock",
    "Timer",
    "Alarm",
    "Target",
    "TrendingUp",
    "BarChart",
    "PieChart",
  ],
  lifestyle: [
    "Car",
    "Bike",
    "Plane",
    "Train",
    "Ship",
    "Umbrella",
    "Sun",
    "Cloud",
    "Snowflake",
    "Thermometer",
  ],
  entertainment: [
    "Gamepad2",
    "Dice1",
    "Popcorn",
    "Gift",
    "PartyPopper",
    "Cake",
    "Wine",
    "Beer",
    "Pizza",
    "IceCream",
  ],
  technology: [
    "Cpu",
    "HardDrive",
    "Battery",
    "Zap",
    "Bluetooth",
    "CloudSync",
    "Download",
    "Upload",
    "Refresh",
    "Power",
  ],
  nature: [
    "Tree",
    "Flower",
    "Leaf",
    "Sun",
    "Moon",
    "Star",
    "Mountain",
    "Waves",
    "Fire",
    "Snowflake",
  ],
};

// Default colors (can be expanded by user)
export const defaultColors = [
  { name: "Orange", value: "#FF7A00" },
  { name: "Blue", value: "#0055FF" },
  { name: "Purple", value: "#9C27B0" },
  { name: "Green", value: "#4CAF50" },
  { name: "Yellow", value: "#FFC107" },
  { name: "Pink", value: "#E91E63" },
  { name: "Red", value: "#F44336" },
  { name: "Teal", value: "#009688" },
  { name: "Indigo", value: "#3F51B5" },
  { name: "Lime", value: "#CDDC39" },
  { name: "Cyan", value: "#00BCD4" },
  { name: "Deep Orange", value: "#FF5722" },
];

// WiFi integration pricing and features
export const wifiIntegration = {
  basePrice: 45,
  features: {
    remoteControl: {
      name: "Remote Control",
      description: "Control from anywhere via app",
      included: true,
    },
    scheduling: {
      name: "Smart Scheduling",
      description: "Time-based automation",
      included: true,
    },
    smartHomeIntegration: {
      name: "Smart Home Hub",
      description: "Works with Alexa, Google, Apple",
      included: true,
    },
    voiceControl: {
      name: "Voice Commands",
      description: "Voice activation support",
      included: true,
    },
    geofencing: {
      name: "Location Triggers",
      description: "Activate based on your location",
      included: true,
    },
    notifications: {
      name: "Push Notifications",
      description: "Get status updates on your phone",
      included: true,
    },
    analyticsReporting: {
      name: "Usage Analytics",
      description: "Track usage patterns and statistics",
      included: true,
    },
    firmwareUpdates: {
      name: "OTA Updates",
      description: "Automatic firmware updates",
      included: true,
    },
    cloudSync: {
      name: "Cloud Sync",
      description: "Sync settings across devices",
      included: true,
    },
    multiDeviceControl: {
      name: "Multi-Device Control",
      description: "Control multiple buttons at once",
      included: true,
    },
  },
};

export const purposes: Purpose[] = [
  { id: "focus", name: "Focus Mode", image: "/images/purpose-focus.svg" },
  {
    id: "reading",
    name: "Reading Light",
    image: "/images/purpose-reading.svg",
  },
  { id: "movie", name: "Movie Night", image: "/images/purpose-movie.svg" },
  { id: "party", name: "Party Scene", image: "/images/purpose-party.svg" },
  { id: "custom", name: "Custom Purpose", image: "/images/purpose-custom.svg" },
];
