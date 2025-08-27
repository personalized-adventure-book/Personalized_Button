// Dynamic pricing utility.
// Reads pricing config injected from localized JSON (pricing_config) with fallback to legacy hardcoded values.

export interface PricingConfigFile {
  base_price: number;
  fields: Record<string, Record<string, number>>;
}

// Legacy fallback (English) used if no runtime config supplied
const fallbackConfig: PricingConfigFile = {
  base_price: 30,
  fields: {
    purpose: {
      'Focus Mode': 0,
      'Reading Light': 5,
      'Movie Night': 7,
      'Party Scene': 12,
      'Gaming Session': 10,
      'Meditation': 4,
      'Workout': 6,
      'Study Mode': 3,
      'Relaxation': 4,
      'Sleep Time': 5,
      'Wake Up': 5,
      'Mood Lighting': 8,
  'Custom Purpose': 15,
    },
    shape: {
      Circle: 0,
      Square: 0,
      Hexagon: 6,
      Octagon: 8,
      Diamond: 5,
      Star: 10,
      Triangle: 4,
      Heart: 9,
      Oval: 3,
      Pentagon: 6,
      'Rounded Square': 2,
      Pill: 3,
      Cloud: 7,
      Flower: 11,
      Lightning: 12,
      'Custom Shape': 15,
    },
    color: {
      Blue: 0,
      Purple: 0,
      Green: 0,
      Yellow: 2,
      Pink: 2,
      Red: 2,
      Teal: 3,
      Indigo: 3,
      Lime: 2,
      Cyan: 2,
      Orange: 3,
      Custom: 10,
    },
    finish: {
      Matte: 0,
      Glossy: 4,
      Satin: 5,
      Metallic: 12,
      Pearl: 9,
      Textured: 6,
      'Carbon Fiber': 18,
      'Soft Touch': 7,
  'Custom Finish': 25,
    },
    text_size: {
      'Small (10px)': 0,
      'Medium (14px)': 2,
      'Large (18px)': 4,
      'Extra Large (24px)': 6,
    },
  },
};

let activeConfig: PricingConfigFile = fallbackConfig;

export function setActivePricingConfig(cfg: PricingConfigFile | null | undefined) {
  if (cfg && cfg.base_price != null && cfg.fields) {
    activeConfig = cfg;
  } else {
    activeConfig = fallbackConfig;
  }
}

export function getActivePricingConfig(): PricingConfigFile {
  return activeConfig;
}

export function getOptionPrice(field: string, value: string | undefined | null): number {
  if (!value) return 0;
  return activeConfig.fields[field]?.[value] || 0;
}

export interface PricingBreakdownItem {
  field: string;
  value: string;
  price: number;
}

export function computePricing(formValues: Record<string, any>): { total: number; additions: number; breakdown: PricingBreakdownItem[]; base: number } {
  const breakdown: PricingBreakdownItem[] = [];
  const config = activeConfig.fields;
  Object.entries(config).forEach(([field, options]) => {
    const val = formValues[field];
    if (!val) return;
    if (Array.isArray(val)) {
      val.forEach(v => {
        const price = options[v] || 0;
        if (price) breakdown.push({ field, value: v, price });
      });
    } else {
      const price = options[val] || 0;
      if (price) breakdown.push({ field, value: val, price });
    }
  });
  const additions = breakdown.reduce((s, i) => s + i.price, 0);
  const base = activeConfig.base_price;
  return { total: base + additions, additions, breakdown, base };
}

// Convenience to initialize from raw content JSON object if present
export function initPricingFromContent(content: any) {
  const cfg = content?.pricing_config;
  if (cfg && typeof cfg === 'object') {
    setActivePricingConfig(cfg as PricingConfigFile);
  }
}

export const BASE_PRICE = () => activeConfig.base_price; // backward compatibility if referenced elsewhere
