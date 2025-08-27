# Language-Aware Image System Documentation

## Overview
The website now supports language-specific images for each product. Images are automatically loaded based on the current language (detected from language flags) with automatic fallback to default images.

## Folder Structure
```
public/
├── Button/
│   ├── gallery/
│   │   ├── en/          # English-specific gallery images
│   │   ├── fr/          # French-specific gallery images
│   │   ├── it/          # Italian-specific gallery images
│   │   ├── ar/          # Arabic-specific gallery images
│   │   └── *.jpg        # Default/fallback gallery images
│   ├── hero/
│   │   ├── en/          # English-specific hero images
│   │   ├── fr/          # French-specific hero images
│   │   ├── it/          # Italian-specific hero images
│   │   ├── ar/          # Arabic-specific hero images
│   │   └── *.jpg        # Default/fallback hero images
│   └── features/
│       ├── en/          # English-specific feature images
│       ├── fr/          # French-specific feature images
│       ├── it/          # Italian-specific feature images
│       ├── ar/          # Arabic-specific feature images
│       └── *.jpg        # Default/fallback feature images
├── Book/
│   └── (same structure as Button)
└── Branding/
    └── (same structure as Button)
```

## Language Detection
The system automatically detects the current language from flag emojis:
- 🇺🇸 → English (en)
- 🇫🇷 → French (fr)
- �🇹 → Italian (it)
- �🇸🇦 → Arabic (ar)

## How It Works

### 1. Automatic Language Detection
The system reads the current language from the page content and maps flag emojis to language codes.

### 2. Smart Image Loading
When loading images, the system follows this priority:
1. **Language-specific path**: `/public/[Product]/[category]/[language]/[imageName]`
2. **Fallback path**: `/public/[Product]/[category]/[imageName]`
3. **Placeholder**: If no image exists, shows a helpful placeholder with upload instructions

### 3. Product Detection
The system automatically detects the current product (Button, Book, Branding) from the URL or page context.

## Adding Images

### For Language-Specific Images
1. Navigate to `/public/[Product]/[category]/[language]/`
2. Add your image files (e.g., `hero-bg.jpg`, `button-example-1.jpg`)

### For Default/Fallback Images
1. Navigate to `/public/[Product]/[category]/`
2. Add your image files directly in the category folder

## Examples

### Gallery Images
- **English**: `/public/Button/gallery/en/button-example-1.jpg`
- **French**: `/public/Button/gallery/fr/button-example-1.jpg`
- **Italian**: `/public/Button/gallery/it/button-example-1.jpg`
- **Fallback**: `/public/Button/gallery/button-example-1.jpg`

### Hero Images
- **English**: `/public/Button/hero/en/hero-bg.jpg`
- **Italian**: `/public/Button/hero/it/hero-bg.jpg`
- **Arabic**: `/public/Button/hero/ar/hero-bg.jpg`
- **Fallback**: `/public/Button/hero/hero-bg.jpg`

## JSON Configuration
In your content JSON files, simply reference the image name:

```json
{
  "hero": {
    "background_image": "hero-bg.jpg"
  },
  "gallery": {
    "images": [
      "button-example-1.jpg",
      "button-example-2.jpg"
    ]
  }
}
```

The system will automatically:
1. Try to load the language-specific version first
2. Fall back to the default version if language-specific doesn't exist
3. Show a helpful placeholder if no image exists

## Benefits
- **Seamless Multi-language Support**: Images adapt automatically to user's language
- **Graceful Fallback**: Never shows broken images
- **Easy Management**: Simple folder structure for organizing images
- **Developer Friendly**: Clear placeholder messages show exactly where to add missing images
