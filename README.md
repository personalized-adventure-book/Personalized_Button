# Product Assets Structure

This folder contains all product-specific images organized by product type directly in the `/public` folder.

## Folder Structure

```
public/
├── Button/                 # Custom Buttons product
│   ├── gallery/           # Gallery images for Button product
│   │   ├── gallery1.jpg   # Main gallery image 1
│   │   ├── gallery2.jpg   # Main gallery image 2
│   │   └── gallery3.jpg   # Main gallery image 3
│   ├── hero/              # Hero section images for Button
│   │   └── hero-bg.jpg    # Hero background image
│   └── features/          # Feature section images for Button
│       ├── feature1.jpg   # Feature illustration 1
│       ├── feature2.jpg   # Feature illustration 2
│       └── feature3.jpg   # Feature illustration 3
├── Book/                  # Personalized Books product
│   ├── gallery/           # Gallery images for Book product
│   ├── hero/              # Hero section images for Book
│   └── features/          # Feature section images for Book
├── Branding/              # Branding Solutions product
│   ├── gallery/           # Gallery images for Branding product
│   ├── hero/              # Hero section images for Branding
│   └── features/          # Feature section images for Branding
└── grid.svg              # Global assets
```

## How It Works

1. **Product Detection**: The system automatically detects which product you're viewing
2. **Dynamic Paths**: Images are loaded from `/{ProductName}/{category}/{imageName}`
3. **Fallback**: Shows helpful placeholders when images are missing
4. **Multi-Language**: Same images work for all language versions

## Image Specifications

### Gallery Images
- **Path**: `/Button/gallery/gallery1.jpg`
- **Size**: 800x800px (1:1 aspect ratio)
- **Format**: JPG, PNG, or WebP
- **Content**: High-quality product photos

### Hero Images
- **Path**: `/Button/hero/hero-bg.jpg`
- **Size**: 1920x1080px (16:9 aspect ratio)
- **Format**: JPG, PNG, or WebP
- **Content**: Background images for hero sections

### Feature Images
- **Path**: `/Button/features/feature1.jpg`
- **Size**: 400x400px (1:1 aspect ratio)
- **Format**: JPG, PNG, or WebP
- **Content**: Icons or illustrations

## Adding Images

Simply drop your images into the appropriate product folder:

### For Button Product:
```
/public/Button/gallery/gallery1.jpg
/public/Button/gallery/gallery2.jpg
/public/Button/gallery/gallery3.jpg
/public/Button/hero/hero-bg.jpg
```

### For Book Product (future):
```
/public/Book/gallery/book1.jpg
/public/Book/gallery/book2.jpg
/public/Book/hero/book-hero.jpg
```

### For Branding Product (future):
```
/public/Branding/gallery/branding1.jpg
/public/Branding/hero/branding-hero.jpg
```

## Current Priority

**Button Product Images Needed:**
1. `/public/Button/gallery/gallery1.jpg` - Close-up of glowing button
2. `/public/Button/gallery/gallery2.jpg` - Multiple colored buttons
3. `/public/Button/gallery/gallery3.jpg` - Button being pressed
4. `/public/Button/hero/hero-bg.jpg` - Hero background image

The system will automatically detect and display these images once you add them!
