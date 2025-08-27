# ✅ CORRECTED: Actual Folder Structure & Image Guidelines

## 🏗️ **Physical Folders** (Only 3 exist!)

Your project has exactly **3 physical image folders** for each product:

```
/public/[Product]/
├── 📸 gallery/     ← Unlimited images, horizontal scrolling
├── 🎯 hero/        ← 1-3 background images
└── ⭐ features/    ← 3-6 feature images
```

## 📊 **Image Recommendations - CORRECTED**

| Section | Physical Folder? | Min | Max | Purpose |
|---------|-----------------|-----|-----|---------|
| 📸 **Gallery** | ✅ YES | 3 | ♾️ Unlimited | Product showcase with horizontal scroll |
| 🎯 **Hero** | ✅ YES | 1 | 3 | Background images for hero section |
| ⭐ **Features** | ✅ YES | 3 | 6 | Feature highlight images/icons |
| 📝 **Examples** | ❌ NO | - | - | Text-based, can reference gallery images |
| 👥 **Testimonials** | ❌ NO | - | - | Text quotes with optional inline photos |
| 💰 **Pricing** | ❌ NO | - | - | Text-based with icon fonts |
| ❓ **FAQ** | ❌ NO | - | - | Pure text content |

## 🎯 **What You Can Do**

### ✅ **With Physical Folders**
1. **Gallery**: Add unlimited images with automatic horizontal scrolling
2. **Hero**: Add 1-3 background images for hero section
3. **Features**: Add 3-6 images to support your feature descriptions

### ✅ **Text-Based Sections** 
- **Examples**: Write descriptions in JSON, reference gallery images if needed
- **Testimonials**: Add customer quotes in JSON with optional small inline images
- **Pricing**: Use text and emoji/icon fonts
- **FAQ**: Write questions and answers in JSON

## 🔧 **How the System Works**

### **Image Folders (Auto-Discovery)**
```bash
# Gallery - Add as many as you want!
/public/Button/gallery/en/gallery1.jpg
/public/Button/gallery/en/gallery2.jpg
/public/Button/gallery/en/gallery3.jpg
# ... unlimited!

# Hero - 1-3 background images
/public/Button/hero/en/hero-bg.jpg
/public/Button/hero/en/hero2.jpg

# Features - 3-6 supporting images  
/public/Button/features/en/feature1.jpg
/public/Button/features/en/feature2.jpg
/public/Button/features/en/feature3.jpg
```

### **JSON Configuration**
```json
{
  "gallery": {
    "title": "Our Gallery",
    "subtitle": "Scroll horizontally to explore!"
    // No images array needed - auto-discovered!
  },
  "hero": {
    "title": "Welcome",
    "background_image": "hero-bg.jpg"
    // System finds this in /hero/ folder automatically
  },
  "features": {
    "title": "Features",
    "items": [
      {
        "title": "Quality",
        "description": "High quality materials",
        "icon": "✨"
        // Can optionally reference images in /features/ folder
      }
    ]
  },
  "examples": {
    "title": "Use Cases",
    "items": [
      {
        "title": "Business Cards",
        "description": "Perfect for professional networking"
        // Text-based, no image folder needed
      }
    ]
  },
  "testimonials": [
    {
      "name": "John Doe",
      "text": "Amazing quality!",
      "image": "https://example.com/photo.jpg" // Optional inline
    }
  ]
}
```

## 🎨 **Best Practices**

### **Gallery (Unlimited)**
- Add 5-20+ images for best showcase
- Use horizontal scrolling - perfect for mobile
- Name files clearly: `gallery1.jpg`, `product-showcase.jpg`

### **Hero (1-3 images)**
- Use high-resolution backgrounds (1920x1080+)
- Choose impactful, brand-representative images
- Can rotate between multiple hero images

### **Features (3-6 images)**
- Use consistent style across all feature images
- Can be icons, photos, or graphics
- Support your feature descriptions

### **Text Sections**
- Focus on clear, compelling copy
- Use emojis for visual appeal
- Reference gallery images when relevant

## ✨ **Key Benefits**
- **No Manual Lists**: System auto-discovers all images in folders
- **Unlimited Gallery**: Add as many images as you want
- **Multi-Language**: Each language gets its own subfolder
- **Smart Fallbacks**: Never shows broken images
- **Clean JSON**: No need to list every single image file

This structure gives you maximum flexibility while keeping things simple and organized! 🚀
