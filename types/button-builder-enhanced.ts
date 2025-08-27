import { Purpose, Shape } from './button-builder';

// Define types locally for enhanced builder
export interface ButtonSize {
  id: string;
  name: string;
  diameter: number;
  height: number;
  weight: number;
  price: number;
}

export interface Material {
  id: string;
  name: string;
  description: string;
  price: number;
}

export interface Texture {
  id: string;
  name: string;
  description: string;
  price: number;
}

export interface Finish {
  id: string;
  name: string;
  description: string;
  price: number;
}

export interface LightMode {
  id: string;
  name: string;
  description: string;
  price: number;
}

export interface SmartFeature {
  id: string;
  name: string;
  description: string;
  price: number;
}

export interface TextEffect {
  id: string;
  name: string;
  description: string;
  animated: boolean;
  price: number;
}

export interface ButtonConfig {
  // Basic Info
  purpose: Purpose;
  customPurpose?: string;

  // Physical Design
  shape: Shape;
  size: ButtonSize;
  material: Material;
  texture: Texture;
  thickness: number;

  // Visual Design
  color: ColorConfig;
  pattern: Pattern | null;

  // Text & Typography
  label: string;
  font: Font;
  textSize: number;
  textPosition: TextPosition;
  textColor: string;
  textEffect: TextEffect;

  // Icon & Graphics
  icon: string | null;
  iconSize: number;
  iconPosition: IconPosition;
  iconColor: string;
  iconEffect: IconEffect;
  customGraphics: CustomGraphic[];

  // Lighting System
  lightingMode: LightingMode;
  lightingPattern: LightingPattern;
  brightness: number;
  colorTransition: ColorTransition;
  lightingTriggers: LightingTrigger[];
  ambientLighting: boolean;

  // Smart Features
  connectivity: ConnectivityOptions;
  smartHome: SmartHomeConfig;
  voiceCommands: VoiceCommand[];
  appIntegration: AppIntegration;

  // Advanced Features
  multiMode: MultiMode[];
  scheduledBehaviors: ScheduledBehavior[];
  conditionalActions: ConditionalAction[];
  customProgramming: CustomProgram | null;

  // Hardware Options
  batteryType: BatteryType;
  chargingMethod: ChargingMethod;
  mounting: MountingOption;
  accessories: Accessory[];

  // Order Details
  quantity: number;
  engraving: Engraving | null;
  packaging: PackagingOption;
}

// Physical Design Types
export interface ButtonSize {
  id: string;
  name: string;
  diameter: number; // in mm
  height: number; // in mm
  weight: number; // in grams
  price: number;
}

export interface Material {
  id: string;
  name: string;
  description: string;
  durability: number;
  premium: boolean;
  price: number;
  colors: string[];
}

export interface Texture {
  id: string;
  name: string;
  description: string;
  tactileFeedback: string;
  price: number;
}

// Visual Design Types
export interface ColorConfig {
  type: "solid" | "gradient" | "pattern" | "dynamic";
  primary: string;
  secondary?: string;
  tertiary?: string;
  gradientDirection?: number;
  patternId?: string;
}

export interface Pattern {
  id: string;
  name: string;
  description: string;
  preview: string;
  price: number;
}

export interface Font {
  id: string;
  name: string;
  family: string;
  style: "normal" | "bold" | "italic" | "bold-italic";
  premium: boolean;
}

export interface TextPosition {
  x: number; // percentage from left
  y: number; // percentage from top
  rotation: number; // degrees
  alignment: "left" | "center" | "right";
}

export interface TextEffect {
  id: string;
  name: string;
  description: string;
  animated: boolean;
  price: number;
}

export interface IconPosition {
  x: number;
  y: number;
  rotation: number;
  scale: number;
}

export interface IconEffect {
  id: string;
  name: string;
  animated: boolean;
  price: number;
}

export interface CustomGraphic {
  id: string;
  type: "upload" | "drawn" | "text";
  data: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  rotation: number;
  opacity: number;
}

// Lighting System Types
export interface LightingMode {
  id: string;
  name: string;
  description: string;
  energyEfficient: boolean;
  price: number;
}

export interface LightingPattern {
  id: string;
  name: string;
  description: string;
  duration: number;
  repeating: boolean;
  customizable: boolean;
  price: number;
}

export interface ColorTransition {
  enabled: boolean;
  speed: number;
  smoothness: number;
  colorStops: { color: string; position: number }[];
}

export interface LightingTrigger {
  id: string;
  type: "touch" | "proximity" | "time" | "app" | "voice" | "environment";
  condition: string;
  action: LightingAction;
  enabled: boolean;
}

export interface LightingAction {
  pattern: string;
  color: string;
  brightness: number;
  duration: number;
}

// Smart Features Types
export interface ConnectivityOptions {
  wifi: boolean;
  bluetooth: boolean;
  zigbee: boolean;
  matter: boolean;
  threadBorder: boolean;
}

export interface SmartHomeConfig {
  platforms: SmartHomePlatform[];
  automations: Automation[];
  scenes: Scene[];
}

export interface SmartHomePlatform {
  id: string;
  name: string;
  enabled: boolean;
  deviceName: string;
}

export interface Automation {
  id: string;
  name: string;
  trigger: AutomationTrigger;
  action: AutomationAction;
  conditions: AutomationCondition[];
  enabled: boolean;
}

export interface VoiceCommand {
  id: string;
  phrase: string;
  action: string;
  response: string;
  enabled: boolean;
}

export interface AppIntegration {
  notifications: boolean;
  remoteControl: boolean;
  analytics: boolean;
  sharing: boolean;
  cloudSync: boolean;
}

// Advanced Features Types
export interface MultiMode {
  id: string;
  name: string;
  description: string;
  settings: Partial<ButtonConfig>;
  switchCondition: string;
}

export interface ScheduledBehavior {
  id: string;
  name: string;
  schedule: ScheduleRule;
  action: ScheduledAction;
  enabled: boolean;
}

export interface ScheduleRule {
  type: "daily" | "weekly" | "monthly" | "custom";
  time: string;
  days?: number[];
  dates?: string[];
  timezone: string;
}

export interface ScheduledAction {
  type: "lighting" | "mode" | "notification" | "automation";
  parameters: Record<string, any>;
}

export interface ConditionalAction {
  id: string;
  name: string;
  condition: ActionCondition;
  action: ActionResponse;
  enabled: boolean;
}

export interface ActionCondition {
  type: "environment" | "time" | "app" | "device" | "user";
  parameter: string;
  operator: "equals" | "greater" | "less" | "contains" | "between";
  value: any;
}

export interface ActionResponse {
  type: "lighting" | "notification" | "app" | "automation";
  parameters: Record<string, any>;
}

export interface CustomProgram {
  id: string;
  name: string;
  language: "visual" | "javascript" | "yaml";
  code: string;
  inputs: ProgramInput[];
  outputs: ProgramOutput[];
}

export interface ProgramInput {
  id: string;
  name: string;
  type: string;
  description: string;
}

export interface ProgramOutput {
  id: string;
  name: string;
  type: string;
  description: string;
}

// Hardware Types
export interface BatteryType {
  id: string;
  name: string;
  capacity: number; // mAh
  lifespan: number; // months
  rechargeable: boolean;
  price: number;
}

export interface ChargingMethod {
  id: string;
  name: string;
  type: "usb-c" | "wireless" | "magnetic" | "solar";
  speed: string;
  price: number;
}

export interface MountingOption {
  id: string;
  name: string;
  type: "adhesive" | "screw" | "magnetic" | "clip" | "stand";
  removable: boolean;
  price: number;
}

export interface Accessory {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  compatible: boolean;
}

// Order Details Types
export interface Engraving {
  enabled: boolean;
  text: string;
  font: string;
  position: "back" | "side" | "hidden";
  price: number;
}

export interface PackagingOption {
  id: string;
  name: string;
  description: string;
  sustainable: boolean;
  giftBox: boolean;
  price: number;
}

// Additional utility types
export interface AutomationTrigger {
  type: string;
  parameters: Record<string, any>;
}

export interface AutomationAction {
  type: string;
  parameters: Record<string, any>;
}

export interface AutomationCondition {
  type: string;
  parameters: Record<string, any>;
}

export interface Scene {
  id: string;
  name: string;
  settings: Partial<ButtonConfig>;
}

// Data for dropdowns and selections
export const buttonSizes: ButtonSize[] = [
  { id: "mini", name: "Mini", diameter: 25, height: 8, weight: 15, price: 0 },
  {
    id: "compact",
    name: "Compact",
    diameter: 35,
    height: 12,
    weight: 25,
    price: 10,
  },
  {
    id: "standard",
    name: "Standard",
    diameter: 45,
    height: 15,
    weight: 40,
    price: 0,
  },
  {
    id: "large",
    name: "Large",
    diameter: 60,
    height: 20,
    weight: 65,
    price: 15,
  },
  {
    id: "xl",
    name: "Extra Large",
    diameter: 80,
    height: 25,
    weight: 95,
    price: 25,
  },
];

export const materials: Material[] = [
  {
    id: "plastic",
    name: "Durable Plastic",
    description: "Lightweight and affordable",
    durability: 3,
    premium: false,
    price: 0,
    colors: ["#FFFFFF", "#000000", "#FF7A00", "#0055FF", "#9C27B0", "#4CAF50"],
  },
  {
    id: "aluminum",
    name: "Brushed Aluminum",
    description: "Premium metal finish",
    durability: 4,
    premium: true,
    price: 25,
    colors: ["#C0C0C0", "#2C2C2C", "#B8860B"],
  },
  {
    id: "wood",
    name: "Natural Wood",
    description: "Sustainable bamboo or oak",
    durability: 3,
    premium: true,
    price: 35,
    colors: ["#DEB887", "#8B4513", "#654321"],
  },
  {
    id: "carbon",
    name: "Carbon Fiber",
    description: "Ultra-lightweight and strong",
    durability: 5,
    premium: true,
    price: 50,
    colors: ["#1C1C1C", "#2F2F2F"],
  },
];

export const textures: Texture[] = [
  {
    id: "smooth",
    name: "Smooth",
    description: "Classic smooth finish",
    tactileFeedback: "Minimal",
    price: 0,
  },
  {
    id: "matte",
    name: "Matte",
    description: "Non-reflective surface",
    tactileFeedback: "Soft",
    price: 5,
  },
  {
    id: "textured",
    name: "Textured",
    description: "Grip-friendly surface",
    tactileFeedback: "Enhanced",
    price: 10,
  },
  {
    id: "soft-touch",
    name: "Soft Touch",
    description: "Silky smooth coating",
    tactileFeedback: "Premium",
    price: 15,
  },
];

export const fonts: Font[] = [
  {
    id: "inter",
    name: "Inter",
    family: "Inter",
    style: "normal",
    premium: false,
  },
  {
    id: "inter-bold",
    name: "Inter Bold",
    family: "Inter",
    style: "bold",
    premium: false,
  },
  {
    id: "cal-sans",
    name: "Cal Sans",
    family: "Cal Sans",
    style: "normal",
    premium: true,
  },
  {
    id: "helvetica",
    name: "Helvetica",
    family: "Helvetica",
    style: "normal",
    premium: true,
  },
  {
    id: "futura",
    name: "Futura",
    family: "Futura",
    style: "normal",
    premium: true,
  },
  {
    id: "script",
    name: "Script",
    family: "Dancing Script",
    style: "normal",
    premium: true,
  },
];

export const patterns: Pattern[] = [
  {
    id: "dots",
    name: "Polka Dots",
    description: "Classic dot pattern",
    preview: "dots.svg",
    price: 10,
  },
  {
    id: "stripes",
    name: "Stripes",
    description: "Diagonal stripes",
    preview: "stripes.svg",
    price: 10,
  },
  {
    id: "geometric",
    name: "Geometric",
    description: "Modern geometric shapes",
    preview: "geo.svg",
    price: 15,
  },
  {
    id: "organic",
    name: "Organic",
    description: "Natural flowing patterns",
    preview: "organic.svg",
    price: 15,
  },
];

export const lightingModes: LightingMode[] = [
  {
    id: "led",
    name: "Standard LED",
    description: "Energy efficient LED lighting",
    energyEfficient: true,
    price: 0,
  },
  {
    id: "rgb",
    name: "RGB Color",
    description: "Full color spectrum",
    energyEfficient: true,
    price: 20,
  },
  {
    id: "rgbw",
    name: "RGB + White",
    description: "Color plus pure white",
    energyEfficient: true,
    price: 30,
  },
  {
    id: "oled",
    name: "OLED Display",
    description: "Programmable display",
    energyEfficient: false,
    price: 75,
  },
];

export const lightingPatterns: LightingPattern[] = [
  {
    id: "static",
    name: "Static",
    description: "Constant light",
    duration: 0,
    repeating: false,
    customizable: true,
    price: 0,
  },
  {
    id: "pulse",
    name: "Pulse",
    description: "Gentle pulsing",
    duration: 2000,
    repeating: true,
    customizable: true,
    price: 0,
  },
  {
    id: "breathe",
    name: "Breathe",
    description: "Slow fade in/out",
    duration: 4000,
    repeating: true,
    customizable: true,
    price: 0,
  },
  {
    id: "rainbow",
    name: "Rainbow",
    description: "Color cycling",
    duration: 10000,
    repeating: true,
    customizable: true,
    price: 10,
  },
  {
    id: "strobe",
    name: "Strobe",
    description: "Fast flashing",
    duration: 500,
    repeating: true,
    customizable: true,
    price: 5,
  },
  {
    id: "wave",
    name: "Wave",
    description: "Wave motion effect",
    duration: 3000,
    repeating: true,
    customizable: true,
    price: 15,
  },
];
