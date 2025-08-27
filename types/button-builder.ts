export interface ButtonConfig {
  purpose: Purpose;
  shape: Shape;
  color: string;
  finish: "matte" | "glossy";
  label: string;
  icon: string | null;
  iconAlignment: "left" | "above" | "text-only";
  lightMode: "static" | "pulse" | "fade";
  brightness: number;
  wifiEnabled: boolean;
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
}

export interface ScheduleRule {
  id: string;
  time: string;
  enabled: boolean;
}

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

export const shapes: Shape[] = [
  { id: "round", name: "Round", preview: "rounded-full" },
  { id: "square", name: "Square", preview: "rounded-lg" },
  { id: "hexagon", name: "Hexagon", preview: "clip-path-hexagon" },
];

export const colors = [
  { name: "Orange", value: "#FF7A00" },
  { name: "Blue", value: "#0055FF" },
  { name: "Purple", value: "#9C27B0" },
  { name: "Green", value: "#4CAF50" },
  { name: "Yellow", value: "#FFC107" },
  { name: "Pink", value: "#E91E63" },
];

export const builtInIcons = [
  "Home",
  "Star",
  "Heart",
  "Moon",
  "Sun",
  "Music",
  "Play",
  "Pause",
  "Volume2",
  "Coffee",
  "Book",
  "Camera",
  "Phone",
  "Mail",
  "Settings",
  "Lightbulb",
  "Wifi",
  "Battery",
  "Clock",
  "Calendar",
  "Map",
  "User",
];
