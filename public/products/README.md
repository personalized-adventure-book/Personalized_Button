# Product Assets Structure

This folder contains all product-specific images and assets organized by product type.

## Folder Structure

```
public/products/
├── Button/                 # Custom Buttons product
│   ├── gallery/           # Gallery images
│   │   ├── gallery1.jpg   # Main gallery image 1
│   │   ├── gallery2.jpg   # Main gallery image 2
│   │   └── gallery3.jpg   # Main gallery image 3
│   ├── hero/              # Hero section images
│   │   └── hero-bg.jpg    # Hero background image
│   ├── features/          # Feature section images
│   │   ├── feature1.jpg   # Feature illustration 1
│   │   ├── feature2.jpg   # Feature illustration 2
│   │   └── feature3.jpg   # Feature illustration 3
│   └── examples/          # Example/showcase images
│       ├── example1.jpg   # Product example 1
│       ├── example2.jpg   # Product example 2
│       └── example3.jpg   # Product example 3
├── Book/                  # Personalized Books product (future)
│   ├── gallery/
│   ├── hero/
│   ├── features/
│   └── characters/
└── Custom/                # Other custom products (future)
    ├── gallery/
    ├── hero/
    └── features/
```

## Image Specifications

### Gallery Images
- **Size**: 800x800px (1:1 aspect ratio)
- **Format**: JPG, PNG, or WebP
- **Content**: High-quality product photos showing the product in use

### Hero Images
- **Size**: 1920x1080px (16:9 aspect ratio)
- **Format**: JPG, PNG, or WebP
- **Content**: Background images for hero sections

### Feature Images
- **Size**: 400x400px (1:1 aspect ratio)
- **Format**: JPG, PNG, or WebP
- **Content**: Icons or illustrations explaining features

## How It Works

1. The system automatically detects the current product type
2. Images are loaded from the appropriate product folder
3. If an image doesn't exist, a placeholder is shown with instructions
4. The system works with multiple languages using the same image assets

## Adding New Products

1. Create a new folder in `/public/products/` with your product name
2. Add the required subfolders (gallery, hero, features, etc.)
3. Update the `PRODUCT_CONFIG` in `/utils/productAssets.ts`
4. Add corresponding content files in `/content/YourProduct/`

## Adding Images

Simply drop your images into the appropriate product folder:
- `/public/products/Button/gallery/gallery1.jpg`
- `/public/products/Button/hero/hero-bg.jpg`
- etc.

The system will automatically detect and use them!
