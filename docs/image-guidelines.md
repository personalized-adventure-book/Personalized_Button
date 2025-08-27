# 📸 Image Guidelines for All Sections

## 🖼️ Gallery Section (Physical Folder)
- **Unlimited Images**: Add as many as you want! The gallery uses horizontal scrolling
- **Recommended**: 5-20 images for a good showcase
- **File Format**: .jpg, .jpeg, .png, .webp
- **Size**: 800x600px or higher for best quality
- **Names**: Use descriptive names like `gallery1.jpg`, `showcase-premium.jpg`, `example-design.jpg`

### 📁 Gallery Folder Structure:
```
/public/[Product]/gallery/
├── en/              # English-specific gallery images
├── fr/              # French-specific gallery images  
├── it/              # Italian-specific gallery images
├── ar/              # Arabic-specific gallery images
└── [fallback images] # Default images (no language folder)
```

## 🎯 Hero Section (Physical Folder)
- **Recommended**: 1-3 high-quality background images
- **Minimum**: 1 hero image (required)
- **Maximum**: 3 images (can rotate automatically)
- **File Format**: .jpg, .jpeg for photos
- **Size**: 1920x1080px or higher (landscape orientation)
- **Names**: `hero-bg.jpg`, `hero1.jpg`, `hero2.jpg`, `main-background.jpg`

### Purpose:
- Main background for the hero section
- Should be high-impact, visually appealing
- Can represent your product or brand

## ⭐ Features Section (Physical Folder)
- **Recommended**: 3-6 feature highlight images
- **Minimum**: 3 images
- **Maximum**: 6 images (optimal for layout)
- **File Format**: .jpg, .png (png for icons/graphics)
- **Size**: 400x300px or higher
- **Names**: `feature1.jpg`, `benefit-quality.jpg`, `icon-fast.png`

### Purpose:
- Showcase key features and benefits
- Support feature descriptions
- Can be icons, photos, or graphics

## 📝 Text-Based Sections (No Physical Folders)

### 🌟 Examples Section
- **Type**: Text-based with optional inline images
- **Images**: Can reference gallery images or use custom URLs
- **Purpose**: Show real-world usage examples through descriptions

### 👥 Testimonials Section  
- **Type**: Text-based with optional customer photos
- **Images**: Small profile photos or company logos (inline)
- **Purpose**: Social proof through customer quotes

### 💰 Pricing Section
- **Type**: Text-based with icons
- **Images**: Uses icon fonts or SVG icons (no physical folder needed)
- **Purpose**: Display pricing plans and features

### ❓ FAQ Section
- **Type**: Pure text-based
- **Images**: No images needed
- **Purpose**: Answer common questions

## 🚀 How the System Works

### 1. **Automatic Detection**
The system automatically scans folders and detects all images. You don't need to specify image names in JSON files.

### 2. **Language Priority**
1. First: Language-specific folder (`/en/`, `/fr/`, `/it/`, `/ar/`)
2. Fallback: Main category folder 
3. Placeholder: If no image exists

### 3. **Smart Fallbacks**
- If Italian image doesn't exist → checks fallback folder
- If fallback doesn't exist → shows helpful placeholder
- Never shows broken images

## 📋 Quick Checklist

### ✅ Gallery (Unlimited - Physical Folder)
- [ ] Add 5+ images to `/public/[Product]/gallery/`
- [ ] Use horizontal scrolling for easy browsing
- [ ] Name files descriptively (`gallery1.jpg`, `example-premium.jpg`)

### ✅ Hero (1-3 images - Physical Folder)
- [ ] Add 1 main hero background image
- [ ] Use high resolution (1920x1080px+)
- [ ] Consider mobile responsiveness

### ✅ Features (3-6 images - Physical Folder)  
- [ ] Add 3-6 feature images
- [ ] Use consistent style/branding
- [ ] Support your feature descriptions

### ✅ Other Sections (Text-Based)
- [ ] Examples: Use descriptive text and reference gallery images
- [ ] Testimonials: Add customer quotes (photos optional as inline content)
- [ ] Pricing: Use text and icon fonts
- [ ] FAQ: Pure text-based, no images needed

## 🎨 Image Optimization Tips

1. **File Size**: Keep under 500KB per image for fast loading
2. **Quality**: Use 80-90% JPEG compression for good balance
3. **Consistency**: Use similar style/filter across images
4. **Mobile**: Ensure images look good on small screens
5. **Alt Text**: System auto-generates descriptive alt text

## 🌍 Multi-Language Support

### Adding Language-Specific Images:
1. Create language subfolders: `/en/`, `/fr/`, `/it/`, `/ar/`
2. Add appropriate images for each language
3. System automatically detects user's language
4. Falls back gracefully to default images

### Example Structure:
```
/public/Button/gallery/
├── en/gallery1.jpg      # English version
├── fr/gallery1.jpg      # French version  
├── it/gallery1.jpg      # Italian version
├── ar/gallery1.jpg      # Arabic version
└── gallery1.jpg         # Fallback for all languages
```

This system gives you maximum flexibility while maintaining excellent user experience! 🚀
