"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useUrlId } from "../hooks/useUrlIdStatic";

// Language type - updated to match the new system
export type Language = "🇺🇸" | "🇫🇷" | "🇮🇹" | "🇸🇦";

// Language context type
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

// Translation function - keeping for backward compatibility and UI elements
const useTranslations = (language: Language) => {
  const translations = {
    "🇺🇸": {
      // Header
      "nav.features": "Features",
      "nav.howItWorks": "How It Works",
      "nav.gallery": "Gallery", 
      "nav.pricing": "Pricing",
      "nav.customize": "Customize Yours",
      "nav.orders": "Orders",
      "nav.how": "How",
      "nav.order": "Order",
  // Header extra
  "header.language": "Language",

      // Hero Section
      "hero.title": "Light Your",
      "hero.titleHighlight": "Personality",
      "hero.description":
        "Create your perfect smart button with customizable lighting effects, personalized controls, and seamless smart home integration. Express yourself with every touch.",
      "hero.customizeButton": "Customize Yours",
      "hero.viewGallery": "View Gallery",

      // Features Section
      "features.title": "Why Choose MyMood?",
      "features.subtitle":
        "Discover the perfect blend of technology and personalization",
      "features.smartLighting.title": "Smart Lighting",
      "features.smartLighting.description":
        "Dynamic lighting effects that respond to your mood and environment with intelligent automation.",
      "features.appIntegration.title": "App Integration",
      "features.appIntegration.description":
        "Seamlessly control your button through our intuitive mobile app with advanced scheduling features.",
      "features.customization.title": "Endless Customization",
      "features.customization.description":
        "Choose from countless combinations of colors, shapes, icons, and behaviors to match your style.",

      // How It Works Section
      "howItWorks.title": "How It",
      "howItWorks.titleHighlight": "Works",
      "howItWorks.subtitle":
        "Create your perfect smart button in just 4 simple steps. From concept to delivery, we make customization easy and enjoyable.",
      "howItWorks.step": "Step",
      "howItWorks.step1.title": "Choose Your Purpose",
      "howItWorks.step1.description":
        "Select from focus mode, reading light, movie night, party scene, or create your own custom purpose.",
      "howItWorks.step2.title": "Design & Style",
      "howItWorks.step2.description":
        "Pick your button's shape, color, and finish. Choose from our curated palette or create a custom color.",
      "howItWorks.step3.title": "Add Label & Icon",
      "howItWorks.step3.description":
        "Personalize with custom text and icons. Upload your own SVG or choose from our library.",
      "howItWorks.step4.title": "Set Behavior",
      "howItWorks.step4.description":
        "Configure lighting effects, brightness, Wi-Fi integration, and scheduling for perfect automation.",

      // Gallery Section
      "gallery.title": "Gallery of",
      "gallery.titleHighlight": "Inspiration",
      "gallery.subtitle":
        "Discover amazing button designs created by our community. Get inspired and use any design as a starting point for your own creation.",
      "gallery.featuredTitle": "Featured Designs",
      "gallery.featuredSubtitle":
        "Hand-picked designs that showcase the best of what's possible",
      "gallery.viewAll": "View All Designs",

      // Pricing Section
      "pricing.title": "Simple,",
      "pricing.titleHighlight": "Transparent",
      "pricing.titleEnd": "Pricing",
      "pricing.subtitle":
        "Choose the perfect plan for your needs. No hidden fees, no subscriptions. One-time purchase, lifetime enjoyment.",
      "pricing.faq.title": "Frequently Asked Questions",
      "pricing.faq.subtitle": "Everything you need to know about our pricing",
      "pricing.faq.subscription.title": "Is there a subscription fee?",
      "pricing.faq.subscription.answer":
        "No! All our plans are one-time purchases. Buy once, enjoy forever.",
      "pricing.faq.upgrade.title": "Can I upgrade later?",
      "pricing.faq.upgrade.answer":
        "Yes, you can upgrade your plan anytime and we'll credit the difference.",
      "pricing.faq.warranty.title": "What's included in the warranty?",
      "pricing.faq.warranty.answer":
        "Full replacement coverage for manufacturing defects and hardware failures.",
      "pricing.faq.refunds.title": "Do you offer refunds?",
      "pricing.faq.refunds.answer":
        "Yes, we offer a 30-day money-back guarantee if you're not satisfied.",
      "pricing.faq.shipping.title": "How long does shipping take?",
      "pricing.faq.shipping.answer":
        "2-3 weeks for custom buttons. We'll keep you updated throughout the process.",
      "pricing.faq.multiple.title": "Can I order multiple buttons?",
      "pricing.faq.multiple.answer":
        "Absolutely! Contact us for volume discounts on orders of 5 or more.",

      // Footer
      "footer.tagline": "Light Your Personality",
      "footer.product": "Product",
      "footer.support": "Support",
      "footer.company": "Company",
  "footer.quickLinks": "Quick Links",
  "footer.contactLabel": "Contact us:",
      "footer.supportCenter": "Support Center",
      "footer.faq": "FAQ",
      "footer.contactUs": "Contact Us",
      "footer.aboutUs": "About Us",
      "footer.privacy": "Privacy Policy",
      "footer.terms": "Terms of Service",
  "footer.copyright": "© 2025 MyMood Innovations. All rights reserved.",

  // FAQ
  "faq.title": "Frequently Asked Questions",

  // Progress / Pricing Progress bar
  "progress.label": "Progress",
  "progress.step": "Step",
  "progress.base": "Base",
  "progress.addons": "Add‑ons",
  "progress.basePrice": "Base price",
  "progress.details": "Details",
  "progress.hideDetails": "Hide details",
  "progress.stepProgress": "Step {current} / {total}",

      // Common
      // Support Section
      "support.title": "Get",
      "support.titleHighlight": "Support",
      "support.subtitle":
        "We're here to help you every step of the way. Choose the support option that works best for you.",
      "support.liveChat.title": "Live Chat",
      "support.liveChat.description": "Get instant help from our support team",
      "support.liveChat.availability": "24/7 Available",
      "support.liveChat.action": "Start Chat",
      "support.email.title": "Email Support",
      "support.email.description":
        "Send us a detailed message about your issue",
      "support.email.availability": "Response within 24h",
      "support.email.action": "Send Email",
      "support.phone.title": "Phone Support",
      "support.phone.description":
        "Speak directly with our support specialists",
      "support.phone.availability": "Mon-Fri 9AM-6PM EST",
      "support.phone.action": "Call Now",
      "support.knowledge.title": "Knowledge Base",
      "support.knowledge.description": "Browse our comprehensive help articles",
      "support.knowledge.availability": "Always Available",
      "support.knowledge.action": "Browse Articles",

      // Support Stats
      "support.stats.responseTime": "Average response time",
      "support.stats.satisfaction": "Customer satisfaction",
      "support.stats.availability": "Support availability",

      // Final CTA
      "cta.title": "Ready to Create Your Button?",
      "cta.subtitle":
        "Join thousands of users who have already personalized their space with MyMood Button.",
      "cta.action": "Start Customizing",

      // Customize Page
      "customize.title": "Design Your Button",
      "customize.cancelOrder": "Cancel Order",
      "customize.autoSaved": "Auto-saved",
      "customize.steps.customerInfo": "Customer Info",
      "customize.steps.purpose": "Purpose",
      "customize.steps.style": "Style",
      "customize.steps.label": "Label",
      "customize.steps.behavior": "Behavior",
      "customize.steps.delivery": "Delivery",
      "customize.steps.review": "Review",
      "customize.navigation.back": "Back",
      "customize.navigation.continue": "Continue",
      "customize.navigation.confirmOrder": "Confirm Order",

      // Step Content
      "customize.purpose.title": "Choose Your Button's Purpose",
      "customize.purpose.subtitle":
        "Select how you'll primarily use your MyMood Button to get started with the perfect configuration.",

      "customize.style.title": "Design Your Button's Appearance",
      "customize.style.subtitle":
        "Choose from {shapes} unique shapes, unlimited colors, and {finishes} premium finishes.",
      "customize.style.tabs.shape": "Shape",
      "customize.style.tabs.color": "Color",
      "customize.style.tabs.finish": "Finish",
      "customize.style.chooseShape": "Choose Your Shape",
      "customize.style.chooseColor": "Choose Your Color",
      "customize.style.chooseFinish": "Choose Your Finish",
      "customize.style.addCustom": "Add Custom",
      "customize.style.createCustomColor": "Create Custom Color",
      "customize.style.addColor": "Add Color",
      "customize.style.livePreview": "Live Preview",
      "customize.style.finish": "finish",
      "customize.style.color": "Color",

      "customize.label.title": "Add Text, Icons & Graphics",
      "customize.label.subtitle":
        "Personalize your button with text, icons, or your own images. Simply click and drag to position.",
      "customize.label.tabs.text": "Text",
      "customize.label.tabs.icons": "Icons",
      "customize.label.tabs.upload": "Upload",

      "customize.behavior.title": "Customize Lighting & Smart Features",
      "customize.behavior.subtitle":
        "Choose from {lightModes} unique lighting modes and optional WiFi integration for smart home control.",

      // Customer Info Step
      "customize.customerInfo.title": "Tell Us About You",
      "customize.customerInfo.subtitle":
        "We need your contact information to process your order and send you updates.",
      "customize.customerInfo.fullName": "Full Name",
      "customize.customerInfo.fullNamePlaceholder": "Enter your full name",
      "customize.customerInfo.email": "Email Address",
      "customize.customerInfo.emailPlaceholder": "Enter your email address",
      "customize.customerInfo.emailInvalid":
        "Please enter a valid email address",
      "customize.customerInfo.phone": "Phone Number",
      "customize.customerInfo.phonePlaceholder": "Enter your phone number",
      "customize.customerInfo.privacyTitle": "Your Privacy is Protected",
      "customize.customerInfo.privacyText":
        "We use your information only to process your order and provide support. We never share your data with third parties.",
      "customize.customerInfo.privacyLink": "Read our Privacy Policy →",
      "customize.customerInfo.progress": "Step 1 of 7 - Customer Information",

      // Delivery Address Step
      "customize.deliveryAddress.title": "Where Should We Send Your Button?",
      "customize.deliveryAddress.subtitle":
        "Provide your delivery address to complete your order. We ship worldwide with free shipping.",
      "customize.deliveryAddress.street": "Street Address",
      "customize.deliveryAddress.streetPlaceholder":
        "Enter your street address",
      "customize.deliveryAddress.city": "City",
      "customize.deliveryAddress.cityPlaceholder": "Enter your city",
      "customize.deliveryAddress.state": "State/Province",
      "customize.deliveryAddress.statePlaceholder":
        "Enter your state or province",
      "customize.deliveryAddress.zipCode": "ZIP/Postal Code",
      "customize.deliveryAddress.zipCodePlaceholder":
        "Enter your ZIP or postal code",
      "customize.deliveryAddress.country": "Country",
      "customize.deliveryAddress.selectCountry": "Select your country",
      "customize.deliveryAddress.instructions": "Delivery Instructions",
      "customize.deliveryAddress.instructionsPlaceholder":
        "Any special delivery instructions (optional)",
      "customize.deliveryAddress.shippingTitle":
        "Free Worldwide Shipping Included",
      "customize.deliveryAddress.freeShipping":
        "Free shipping to all supported countries",
      "customize.deliveryAddress.deliveryTime":
        "Custom manufacturing: 2-3 weeks",
      "customize.deliveryAddress.trackingIncluded":
        "Tracking information provided",
      "customize.deliveryAddress.insuranceIncluded":
        "Delivery insurance included",
      "customize.deliveryAddress.progress": "Step 6 of 7 - Delivery Address",

      "customize.review.title": "Review Your Custom Button",
      "customize.review.subtitle":
        "Review your customization and confirm your order. No payment information required.",

      // Review Step Content
      "review.yourDesign": "Your Design",
      "review.purpose": "Purpose",
      "review.shapeStyle": "Shape & Style",
      "review.labelContent": "Label & Content",
      "review.lightingSmart": "Lighting & Smart Features",
      "review.orderSummary": "Order Summary",
      "review.quantity": "Quantity",
      "review.priceBreakdown": "Price Breakdown",
      "review.baseButton": "Base Button",
      "review.finish": "Finish",
      "review.mode": "Mode",
      "review.wifiIntegration": "WiFi Integration",
      "review.total": "Total",
      "review.shipping": "Shipping & Delivery",
      "review.customManufacturing": "Custom manufacturing: 2-3 weeks",
      "review.freeShipping": "Free shipping worldwide",
      "review.trackingInfo": "Tracking information provided",
      "review.moneyBack": "30-day money-back guarantee",
      "review.customerReviews": "Customer Reviews",
      "review.reviews": "reviews",
      "review.amazingQuality":
        "Amazing quality and customization options. The button feels premium and works perfectly!",
      "review.verifiedBuyer": "Verified Buyer",
      "review.noPaymentRequired":
        "No payment required now. Order confirmation will be processed separately.",
      "review.termsAgreement":
        "By confirming, you agree to our Terms of Service and Privacy Policy.",
      "review.customColor": "Custom Color",
      "review.standardColor": "Standard Color",
      "review.noTextLabel": "No text label",
      "review.icon": "Icon",
      "review.customImage": "Custom image uploaded",
      "review.noIconImage": "No icon or image",
      "review.brightness": "brightness",
      "review.wifiEnabled": "WiFi enabled with smart features",
      "review.standaloneMode": "Standalone mode",

      // Order Confirmation Modal
      "confirmation.title": "Order Confirmed!",
      "confirmation.orderNumber": "Order #",
      // Product-specific thank you messages
      "confirmation.thankYou.button": "Thank you for your order! Your custom MyMood Button is now being prepared.",
      "confirmation.thankYou.book": "Thank you for your order! Your personalized MyMood Book is now being prepared.",
      "confirmation.thankYou.branding": "Thank you for your order! Your personalized MyMood Branding package is now being prepared.",
      "confirmation.thankYou.song": "Thank you for your order! Your personalized MyMood Song is now being prepared.",
      // Generic fallback
      "confirmation.thankYou":
        "Thank you for your order! Your custom MyMood Button is now being prepared.",
      "confirmation.emailSent": "📧 Confirmation email sent to your inbox",
      "confirmation.whatNext": "What happens next?",
      "confirmation.orderConfirmed": "Order Confirmed",
      "confirmation.justNow": "Just now",
      "confirmation.productionStarted": "Production Started",
      "confirmation.within24Hours": "Within 24 hours",
      "confirmation.qualityCheck": "Quality Check",
      "confirmation.twoThreeWeeks": "2-3 weeks",
      "confirmation.shipped": "Shipped",
      "confirmation.threeFiveDays": "3-5 business days",
      "confirmation.orderDetails": "Order Details",
      "confirmation.orderNumber2": "Order Number:",
      "confirmation.estimatedDelivery": "Estimated Delivery:",
      "confirmation.status": "Status:",
      "confirmation.confirmed": "Confirmed",
      "confirmation.goHome": "🏠 Go to Home Page",
      "confirmation.startNew": "🎨 Start New Order",
      "confirmation.seeOrders": "📦 See Your Orders",
      "confirmation.questionsSupport":
        "Questions? Contact our support team anytime.",
      "confirmation.ratedCustomers": "Rated 4.9/5 by customers",

      "common.loading": "Loading...",
      "common.error": "Error",
      "common.save": "Save",
      "common.cancel": "Cancel",
      "common.continue": "Continue",
      "common.back": "Back",
      "common.optional": "(optional)",

      // UI Messages
      "ui.loadingContent": "Loading content...",
      "ui.unableToLoadContent": "Unable to Load Content",
      "ui.retry": "Retry",
      "ui.stepOf": "Step {current} of {total}",
      "ui.failedToLoadContent": "Failed to load content",

      // Draft Selection Modal
      "draft.continueOrStartNew": "Continue or Start New?",
      "draft.youHaveDrafts": "You have {count} draft{plural} in progress. Choose one to continue or start a new design.",
      "draft.startNewOrder": "Start New Order",
      "draft.orContinueFromDraft": "Or continue from draft",
      "draft.stepOfFive": "Step {step}/5",
      "draft.clickToContinue": "Click on a draft to continue where you left off",

      // Form Labels
      "form.customizeYourBrandingPackage": "Customize Your Branding Package",
      "form.completeFormBelow": "Complete the form below to get your personalized branding solution",

      // Fallback Text
      "fallback.howItWorks": "How It Works",
      "fallback.getStarted": "Get Started",

      // Modal Actions
      "modal.cancelOrder.title": "Cancel Order",
      "modal.cancelOrder.message": "You have unsaved changes to your button design. What would you like to do?",
      "modal.cancelOrder.saveAsDraft": "Save as Draft",
      "modal.cancelOrder.deleteAndExit": "Delete & Exit",
      "modal.cancelOrder.continueEditing": "Continue Editing",
      "modal.cancelOrder.saving": "Saving...",
      "modal.cancelOrder.deleting": "Deleting...",

      // Navigation buttons
      "navigation.previous": "Previous",
      "navigation.next": "Next",
      "navigation.completeOrder": "Complete Order",
      "navigation.startCustomizing": "Start Customizing",
      "navigation.stepComplete": "Step Complete",
      "navigation.pleaseCompleteFields": "Please complete required fields",

      // Purpose selection
      "purpose.chooseYourPrimaryUseCase": "Choose Your Primary Use Case",
      "purpose.addCustom": "Add Custom",
      "purpose.customUseCasePlaceholder": "Describe your custom use case...",
      "purpose.tellUsMorePlaceholder": "Tell us more about your specific needs, preferences, or any special requirements...",

      // Gallery instructions
      "gallery.loveWhatYouSee": "Love what you see? Create your own custom button!",

      // Demo instructions
      "demo.watchTitle": "Watch How to Use Our Form",
      "demo.watchDescription": "This demo shows you exactly how to fill out our customization form step by step.",
      
  // Orders / Confirmation Pages (EN)
  "orders.title": "My Orders & Drafts",
  "orders.subtitle": "View your completed orders and resume saved drafts",
  "orders.savedDrafts": "Saved Drafts",
  "orders.noDraftsYet": "No Drafts Yet",
  "orders.noDraftsHint": "Your saved button designs will appear here",
  "orders.resume": "Resume",
  "orders.completedOrders": "Completed Orders",
  "orders.noOrdersYet": "No Orders Yet",
  "orders.noOrdersHint": "You haven't completed any orders yet. Start by creating your first personalized button!",
  "orders.viewDetails": "View Details",
  "orders.hideDetails": "Hide Details",
  "orders.receipt": "Receipt",
  "orders.delete": "Delete",
  "orders.deleteOrder": "Delete Order",
  "orders.cannotBeUndone": "This action cannot be undone",
  "orders.areYouSureDelete": "Are you sure you want to delete order {order}?\nThis will permanently remove the order from your history.",
  "orders.experiences": "Experiences",
  "orders.orderDate": "Order Date",
  "orders.customer": "Customer",
  "orders.characters": "Characters",
  "orders.unnamedExperience": "Unnamed Experience",

  "confirmation.downloadReceipt": "Download Receipt",
  "confirmation.shareOrder": "Share Order",
  "confirmation.confirmedProcessing": "Confirmed & Processing",
  "confirmation.orderSaved": "✅ Order saved - you can view it anytime in \"My Orders\"",
  "confirmation.orderTracking": "Order Tracking",
  "support.needHelp": "Need Help?",
    },
    "🇫🇷": {
      // Header
      "nav.features": "Caractéristiques",
      "nav.howItWorks": "Comment Ça Marche",
      "nav.gallery": "Galerie",
      "nav.pricing": "Tarification",
      "nav.customize": "Personnalisez le Vôtre",
      "nav.orders": "Commandes",
      "nav.how": "Comment",
      "nav.order": "Commander",
  "header.language": "Langue",

      // Hero Section
      "hero.title": "Illuminez Votre",
      "hero.titleHighlight": "Personnalité",
      "hero.description":
        "Créez votre bouton intelligent parfait avec des effets d'éclairage personnalisables, des contrôles personnalisés et une intégration domotique transparente. Exprimez-vous à chaque contact.",
      "hero.customizeButton": "Personnalisez le Vôtre",
      "hero.viewGallery": "Voir la Galerie",

      // Features Section
      "features.title": "Pourquoi Choisir MyMood?",
      "features.subtitle":
        "Découvrez le mélange parfait de technologie et de personnalisation",
      "features.smartLighting.title": "Éclairage Intelligent",
      "features.smartLighting.description":
        "Effets d'éclairage dynamiques qui répondent à votre humeur et à votre environnement avec une automatisation intelligente.",
      "features.appIntegration.title": "Intégration d'Application",
      "features.appIntegration.description":
        "Contrôlez facilement votre bouton via notre application mobile intuitive avec des fonctions de planification avancées.",
      "features.customization.title": "Personnalisation Infinie",
      "features.customization.description":
        "Choisissez parmi d'innombrables combinaisons de couleurs, formes, icônes et comportements qui correspondent à votre style.",

      // How It Works Section
      "howItWorks.title": "Comment Ça",
      "howItWorks.titleHighlight": "Marche",
      "howItWorks.subtitle":
        "Créez votre bouton intelligent parfait en seulement 4 étapes simples. Du concept à la livraison, nous rendons la personnalisation facile et agréable.",
      "howItWorks.step": "Étape",
      "howItWorks.step1.title": "Choisissez Votre Objectif",
      "howItWorks.step1.description":
        "Sélectionnez parmi le mode concentration, éclairage de lecture, soirée cinéma, scène de fête, ou créez votre propre objectif personnalisé.",
      "howItWorks.step2.title": "Design et Style",
      "howItWorks.step2.description":
        "Choisissez la forme, la couleur et la finition de votre bouton. Choisissez dans notre palette sélectionnée ou créez une couleur personnalisée.",
      "howItWorks.step3.title": "Ajoutez Étiquette et Icône",
      "howItWorks.step3.description":
        "Personnalisez avec du texte et des icônes personnalisés. Téléchargez votre propre SVG ou choisissez dans notre bibliothèque.",
      "howItWorks.step4.title": "Définir le Comportement",
      "howItWorks.step4.description":
        "Configurez les effets d'éclairage, la luminosité, l'intégration Wi-Fi et la planification pour une automatisation parfaite.",

      // Gallery Section
      "gallery.title": "Galerie d'",
      "gallery.titleHighlight": "Inspiration",
      "gallery.subtitle":
        "Découvrez d'incroyables designs de boutons créés par notre communauté. Inspirez-vous et utilisez n'importe quel design comme point de départ pour votre propre création.",
      "gallery.featuredTitle": "Designs en Vedette",
      "gallery.featuredSubtitle":
        "Designs sélectionnés qui montrent le meilleur de ce qui est possible",
      "gallery.viewAll": "Voir Tous les Designs",

      // Pricing Section
      "pricing.title": "Tarification",
      "pricing.titleHighlight": "Simple et",
      "pricing.titleEnd": "Transparente",
      "pricing.subtitle":
        "Choisissez le plan parfait pour vos besoins. Pas de frais cachés, pas d'abonnements. Achat unique, plaisir à vie.",
      "pricing.faq.title": "Questions Fréquemment Posées",
      "pricing.faq.subtitle": "Tout ce que vous devez savoir sur nos tarifs",

      // Footer
      "footer.tagline": "Illuminez Votre Personnalité",
      "footer.product": "Produit",
      "footer.support": "Support",
      "footer.company": "Entreprise",
  "footer.quickLinks": "Liens Rapides",
  "footer.contactLabel": "Contactez-nous :",
      "footer.supportCenter": "Centre de Support",
      "footer.faq": "FAQ",
      "footer.contactUs": "Nous Contacter",
      "footer.aboutUs": "À Propos de Nous",
      "footer.privacy": "Politique de Confidentialit��",
      "footer.terms": "Conditions de Service",
  "footer.copyright": "© 2025 MyMood Innovations. Tous droits réservés.",

  "faq.title": "Questions Fréquemment Posées",
  "progress.label": "Progression",
  "progress.step": "Étape",
  "progress.base": "Base",
  "progress.addons": "Modules",
  "progress.basePrice": "Prix de base",
  "progress.details": "Détails",
  "progress.hideDetails": "Masquer les détails",
  "progress.stepProgress": "Étape {current} / {total}",

      // Common
      // Support Section
      "support.title": "Obtenez de l'",
      "support.titleHighlight": "Aide",
      "support.subtitle":
        "Nous sommes là pour vous aider à chaque étape. Choisissez l'option de support qui vous convient le mieux.",
      "support.liveChat.title": "Chat en Direct",
      "support.liveChat.description":
        "Obtenez une aide instantanée de notre équipe de support",
      "support.liveChat.availability": "Disponible 24h/24 et 7j/7",
      "support.liveChat.action": "Démarrer le Chat",
      "support.email.title": "Support par Email",
      "support.email.description":
        "Envoyez-nous un message détaillé sur votre problème",
      "support.email.availability": "Réponse dans les 24h",
      "support.email.action": "Envoyer un Email",
      "support.phone.title": "Support Téléphonique",
      "support.phone.description":
        "Parlez directement avec nos spécialistes du support",
      "support.phone.availability": "Lun-Ven 9h-18h EST",
      "support.phone.action": "Appeler Maintenant",
      "support.knowledge.title": "Base de Connaissances",
      "support.knowledge.description": "Parcourez nos articles d'aide complets",
      "support.knowledge.availability": "Toujours Disponible",
      "support.knowledge.action": "Parcourir les Articles",

      // Pricing FAQ
      "pricing.faq.subscription.title": "Y a-t-il des frais d'abonnement?",
      "pricing.faq.subscription.answer":
        "Non! Tous nos plans sont des achats uniques. Achetez une fois, profitez pour toujours.",
      "pricing.faq.upgrade.title": "Puis-je mettre à niveau plus tard?",
      "pricing.faq.upgrade.answer":
        "Oui, vous pouvez mettre à niveau votre plan à tout moment et nous créditerons la différence.",
      "pricing.faq.warranty.title":
        "Qu'est-ce qui est inclus dans la garantie?",
      "pricing.faq.warranty.answer":
        "Couverture de remplacement complète pour les défauts de fabrication et les pannes matérielles.",
      "pricing.faq.refunds.title": "Offrez-vous des remboursements?",
      "pricing.faq.refunds.answer":
        "Oui, nous offrons une garantie de remboursement de 30 jours si vous n'êtes pas satisfait.",
      "pricing.faq.shipping.title": "Combien de temps prend l'expédition?",
      "pricing.faq.shipping.answer":
        "2-3 semaines pour les boutons personnalisés. Nous vous tiendrons informé tout au long du processus.",
      "pricing.faq.multiple.title": "Puis-je commander plusieurs boutons?",
      "pricing.faq.multiple.answer":
        "Absolument! Contactez-nous pour des remises sur volume pour les commandes de 5 ou plus.",

      // Support Stats
      "support.stats.responseTime": "Temps de réponse moyen",
      "support.stats.satisfaction": "Satisfaction client",
      "support.stats.availability": "Disponibilité du support",

      // Final CTA
      "cta.title": "Prêt à Créer Votre Bouton?",
      "cta.subtitle":
        "Rejoignez des milliers d'utilisateurs qui ont déjà personnalisé leur espace avec MyMood Button.",
      "cta.action": "Commencer la Personnalisation",

      // Customize Page
      "customize.title": "Concevez Votre Bouton",
      "customize.cancelOrder": "Annuler la Commande",
      "customize.autoSaved": "Sauvegardé automatiquement",
      "customize.steps.customerInfo": "Info Client",
      "customize.steps.purpose": "Objectif",
      "customize.steps.style": "Style",
      "customize.steps.label": "Étiquette",
      "customize.steps.behavior": "Comportement",
      "customize.steps.delivery": "Livraison",
      "customize.steps.review": "Révision",
      "customize.navigation.back": "Retour",
      "customize.navigation.continue": "Continuer",
      "customize.navigation.confirmOrder": "Confirmer la Commande",

      // Step Content
      "customize.purpose.title": "Choisissez l'Objectif de Votre Bouton",
      "customize.purpose.subtitle":
        "Sélectionnez comment vous utiliserez principalement votre bouton MyMood pour commencer avec la configuration parfaite.",

      // Customer Info Step
      "customize.customerInfo.title": "Parlez-nous de Vous",
      "customize.customerInfo.subtitle":
        "Nous avons besoin de vos informations de contact pour traiter votre commande et vous envoyer des mises à jour.",
      "customize.customerInfo.fullName": "Nom Complet",
      "customize.customerInfo.fullNamePlaceholder": "Entrez votre nom complet",
      "customize.customerInfo.email": "Adresse Email",
      "customize.customerInfo.emailPlaceholder": "Entrez votre adresse email",
      "customize.customerInfo.emailInvalid":
        "Veuillez entrer une adresse email valide",
      "customize.customerInfo.phone": "Numéro de Téléphone",
      "customize.customerInfo.phonePlaceholder":
        "Entrez votre numéro de téléphone",
      "customize.customerInfo.privacyTitle":
        "Votre Confidentialité est Protégée",
      "customize.customerInfo.privacyText":
        "Nous utilisons vos informations uniquement pour traiter votre commande et fournir un support. Nous ne partageons jamais vos données avec des tiers.",
      "customize.customerInfo.privacyLink":
        "Lire notre Politique de Confidentialité →",
      "customize.customerInfo.progress": "Étape 1 sur 7 - Informations Client",

      // Delivery Address Step
      "customize.deliveryAddress.title":
        "Où Devons-nous Envoyer Votre Bouton ?",
      "customize.deliveryAddress.subtitle":
        "Fournissez votre adresse de livraison pour finaliser votre commande. Nous expédions dans le monde entier avec livraison gratuite.",
      "customize.deliveryAddress.street": "Adresse de la Rue",
      "customize.deliveryAddress.streetPlaceholder":
        "Entrez votre adresse de rue",
      "customize.deliveryAddress.city": "Ville",
      "customize.deliveryAddress.cityPlaceholder": "Entrez votre ville",
      "customize.deliveryAddress.state": "État/Province",
      "customize.deliveryAddress.statePlaceholder":
        "Entrez votre état ou province",
      "customize.deliveryAddress.zipCode": "Code Postal",
      "customize.deliveryAddress.zipCodePlaceholder":
        "Entrez votre code postal",
      "customize.deliveryAddress.country": "Pays",
      "customize.deliveryAddress.selectCountry": "Sélectionnez votre pays",
      "customize.deliveryAddress.instructions": "Instructions de Livraison",
      "customize.deliveryAddress.instructionsPlaceholder":
        "Instructions spéciales de livraison (optionnel)",
      "customize.deliveryAddress.shippingTitle":
        "Livraison Gratuite Mondiale Incluse",
      "customize.deliveryAddress.freeShipping":
        "Livraison gratuite vers tous les pays supportés",
      "customize.deliveryAddress.deliveryTime":
        "Fabrication personnalisée : 2-3 semaines",
      "customize.deliveryAddress.trackingIncluded":
        "Informations de suivi fournies",
      "customize.deliveryAddress.insuranceIncluded":
        "Assurance de livraison incluse",
      "customize.deliveryAddress.progress":
        "Étape 6 sur 7 - Adresse de Livraison",

      "customize.review.title": "Passez en Revue Votre Bouton Personnalisé",
      "customize.review.subtitle":
        "Passez en revue votre personnalisation et confirmez votre commande. Aucune information de paiement requise.",

      // Review Step Content
      "review.yourDesign": "Votre Design",
      "review.purpose": "Objectif",
      "review.shapeStyle": "Forme et Style",
      "review.labelContent": "Étiquette et Contenu",
      "review.lightingSmart": "Éclairage et Fonctionnalités Intelligentes",
      "review.orderSummary": "Résumé de la Commande",
      "review.quantity": "Quantité",
      "review.priceBreakdown": "Détail des Prix",
      "review.baseButton": "Bouton de Base",
      "review.finish": "Finition",
      "review.mode": "Mode",
      "review.wifiIntegration": "Intégration WiFi",
      "review.total": "Total",
      "review.shipping": "Expédition et Livraison",
      "review.customManufacturing": "Fabrication personnalisée : 2-3 semaines",
      "review.freeShipping": "Livraison gratuite dans le monde entier",
      "review.trackingInfo": "Informations de suivi fournies",
      "review.moneyBack": "Garantie de remboursement de 30 jours",
      "review.customerReviews": "Avis Clients",
      "review.reviews": "avis",
      "review.amazingQuality":
        "Qualité incroyable et options de personnalisation. Le bouton est premium et fonctionne parfaitement !",
      "review.verifiedBuyer": "Acheteur Vérifié",
      "review.noPaymentRequired":
        "Aucun paiement requis maintenant. La confirmation de commande sera traitée séparément.",
      "review.termsAgreement":
        "En confirmant, vous acceptez nos Conditions de Service et notre Politique de Confidentialité.",
      "review.customColor": "Couleur Personnalisée",
      "review.standardColor": "Couleur Standard",
      "review.noTextLabel": "Pas d'étiquette de texte",
      "review.icon": "Icône",
      "review.customImage": "Image personnalisée téléchargée",
      "review.noIconImage": "Pas d'icône ou d'image",
      "review.brightness": "luminosité",
      "review.wifiEnabled": "WiFi activé avec fonctionnalités intelligentes",
      "review.standaloneMode": "Mode autonome",

      // Order Confirmation Modal
  "confirmation.title": "Commande Confirmée !",
  "confirmation.orderNumber": "Commande #",
  // Product-specific thank you messages
  "confirmation.thankYou.button": "Merci pour votre commande ! Votre bouton MyMood personnalisé est maintenant en préparation.",
  "confirmation.thankYou.book": "Merci pour votre commande ! Votre livre MyMood personnalisé est maintenant en préparation.",
  "confirmation.thankYou.branding": "Merci pour votre commande ! Votre pack de branding MyMood personnalisé est maintenant en préparation.",
  "confirmation.thankYou.song": "Merci pour votre commande ! Votre chanson MyMood personnalisée est maintenant en préparation.",
  // Generic fallback
  "confirmation.thankYou": "Merci pour votre commande ! Votre bouton MyMood personnalisé est maintenant en préparation.",

      "confirmation.emailSent":
        "📧 Email de confirmation envoyé dans votre boîte de réception",
      "confirmation.whatNext": "Que se passe-t-il ensuite ?",
      "confirmation.orderConfirmed": "Commande Confirmée",
      "confirmation.justNow": "À l'instant",
      "confirmation.productionStarted": "Production Commencée",
      "confirmation.within24Hours": "Dans les 24 heures",
      "confirmation.qualityCheck": "Contrôle Qualité",
      "confirmation.twoThreeWeeks": "2-3 semaines",
      "confirmation.shipped": "Expédié",
      "confirmation.threeFiveDays": "3-5 jours ouvrables",
      "confirmation.orderDetails": "Détails de la Commande",
      "confirmation.orderNumber2": "Numéro de Commande :",
      "confirmation.estimatedDelivery": "Livraison Estimée :",
      "confirmation.status": "Statut :",
      "confirmation.confirmed": "Confirmé",
      "confirmation.goHome": "🏠 Aller à l'Accueil",
      "confirmation.startNew": "🎨 Nouvelle Commande",
      "confirmation.seeOrders": "📦 Voir Vos Commandes",
      "confirmation.questionsSupport":
        "Questions ? Contactez notre équipe de support à tout moment.",
      "confirmation.ratedCustomers": "Noté 4,9/5 par les clients",

      "common.loading": "Chargement...",
      "common.error": "Erreur",
      "common.save": "Enregistrer",
      "common.cancel": "Annuler",
      "common.continue": "Continuer",
      "common.back": "Retour",
      "common.optional": "(optionnel)",

      // UI Messages
      "ui.loadingContent": "Chargement du contenu...",
      "ui.unableToLoadContent": "Impossible de Charger le Contenu",
      "ui.retry": "Réessayer",
      "ui.stepOf": "Étape {current} sur {total}",
      "ui.failedToLoadContent": "Échec du chargement du contenu",

      // Draft Selection Modal
      "draft.continueOrStartNew": "Continuer ou Commencer Nouveau ?",
      "draft.youHaveDrafts": "Vous avez {count} brouillon{plural} en cours. Choisissez-en un pour continuer ou commencez un nouveau design.",
      "draft.startNewOrder": "Nouvelle Commande",
      "draft.orContinueFromDraft": "Ou continuer depuis un brouillon",
      "draft.stepOfFive": "Étape {step}/5",
      "draft.clickToContinue": "Cliquez sur un brouillon pour continuer où vous vous êtes arrêté",

      // Form Labels
      "form.customizeYourBrandingPackage": "Personnalisez Votre Package de Marque",
      "form.completeFormBelow": "Complétez le formulaire ci-dessous pour obtenir votre solution de marque personnalisée",

      // Fallback Text
      "fallback.howItWorks": "Comment Ça Marche",
      "fallback.getStarted": "Commencer",

      // Modal Actions
      "modal.cancelOrder.title": "Annuler la Commande",
      "modal.cancelOrder.message": "Vous avez des modifications non sauvegardées dans votre conception de bouton. Que souhaitez-vous faire ?",
      "modal.cancelOrder.saveAsDraft": "Enregistrer comme Brouillon",
      "modal.cancelOrder.deleteAndExit": "Supprimer et Quitter",
      "modal.cancelOrder.continueEditing": "Continuer l'Édition",
      "modal.cancelOrder.saving": "Enregistrement...",
      "modal.cancelOrder.deleting": "Suppression...",

      // Navigation buttons
      "navigation.previous": "Précédent",
      "navigation.next": "Suivant",
      "navigation.completeOrder": "Finaliser la Commande",
      "navigation.startCustomizing": "Commencer la Personnalisation",
      "navigation.stepComplete": "Étape Terminée",
      "navigation.pleaseCompleteFields": "Veuillez compléter les champs requis",

      // Purpose selection
      "purpose.chooseYourPrimaryUseCase": "Choisissez Votre Cas d'Usage Principal",
      "purpose.addCustom": "Ajouter Personnalisé",
      "purpose.customUseCasePlaceholder": "Décrivez votre cas d'usage personnalisé...",
      "purpose.tellUsMorePlaceholder": "Parlez-nous de vos besoins spécifiques, préférences, ou toute exigence particulière...",

      // Gallery instructions
      "gallery.loveWhatYouSee": "Vous aimez ce que vous voyez ? Créez votre propre bouton personnalisé !",

      // Demo instructions
      "demo.watchTitle": "Regardez Comment Utiliser Notre Formulaire",
      "demo.watchDescription": "Cette démo vous montre exactement comment remplir notre formulaire de personnalisation étape par étape.",
      
  // Orders / Confirmation Pages (FR)
  "orders.title": "Mes Commandes & Brouillons",
  "orders.subtitle": "Consultez vos commandes terminées et reprenez vos brouillons enregistrés",
  "orders.savedDrafts": "Brouillons enregistrés",
  "orders.noDraftsYet": "Aucun brouillon pour le moment",
  "orders.noDraftsHint": "Vos conceptions de boutons enregistrées apparaîtront ici",
  "orders.resume": "Reprendre",
  "orders.completedOrders": "Commandes terminées",
  "orders.noOrdersYet": "Aucune commande pour le moment",
  "orders.noOrdersHint": "Vous n'avez encore finalisé aucune commande. Commencez par créer votre premier bouton personnalisé !",
  "orders.viewDetails": "Voir les détails",
  "orders.hideDetails": "Masquer les détails",
  "orders.receipt": "Reçu",
  "orders.delete": "Supprimer",
  "orders.deleteOrder": "Supprimer la commande",
  "orders.cannotBeUndone": "Cette action est irréversible",
  "orders.areYouSureDelete": "Voulez-vous vraiment supprimer la commande {order} ?\nCela la supprimera définitivement de votre historique.",
  "orders.experiences": "Expériences",
  "orders.orderDate": "Date de commande",
  "orders.customer": "Client",
  "orders.characters": "Personnages",
  "orders.unnamedExperience": "Expérience sans nom",

  "confirmation.downloadReceipt": "Télécharger le reçu",
  "confirmation.shareOrder": "Partager la commande",
  "confirmation.confirmedProcessing": "Confirmée et en traitement",
  "confirmation.orderSaved": "✅ Commande enregistrée - vous pouvez la voir à tout moment dans \"Mes commandes\"",
  "confirmation.orderTracking": "Suivi de commande",
  "support.needHelp": "Besoin d'aide ?",
    },
    "🇪🇸": {
      // Header
      "nav.howItWorks": "Cómo Funciona",
      "nav.gallery": "Galería",
      "nav.pricing": "Precios",
      "nav.customize": "Personaliza el Tuyo",
      "nav.orders": "Pedidos",
      "nav.how": "Cómo",
      "nav.order": "Pedir",

      // Hero Section
      "hero.title": "Ilumina Tu",
      "hero.titleHighlight": "Personalidad",
      "hero.description":
        "Crea tu botón inteligente perfecto con efectos de iluminación personalizables, controles personalizados e integración perfecta con el hogar inteligente. Exprésate con cada toque.",
      "hero.customizeButton": "Personaliza el Tuyo",
      "hero.viewGallery": "Ver Galería",

      // Features Section
      "features.title": "¿Por Qué Elegir MyMood?",
      "features.subtitle":
        "Descubre la mezcla perfecta de tecnología y personalización",
      "features.smartLighting.title": "Iluminación Inteligente",
      "features.smartLighting.description":
        "Efectos de iluminación dinámicos que responden a tu estado de ánimo y entorno con automatización inteligente.",
      "features.appIntegration.title": "Integración de App",
      "features.appIntegration.description":
        "Controla tu botón sin problemas a través de nuestra aplicación móvil intuitiva con funciones de programación avanzadas.",
      "features.customization.title": "Personalización Infinita",
      "features.customization.description":
        "Elige entre innumerables combinaciones de colores, formas, iconos y comportamientos que coincidan con tu estilo.",

      // How It Works Section
      "howItWorks.title": "Cómo",
      "howItWorks.titleHighlight": "Funciona",
      "howItWorks.subtitle":
        "Crea tu botón inteligente perfecto en solo 4 pasos simples. Desde el concepto hasta la entrega, hacemos que la personalización sea fácil y divertida.",
      "howItWorks.step": "Paso",
      "howItWorks.step1.title": "Elige Tu Propósito",
      "howItWorks.step1.description":
        "Selecciona entre modo de concentración, luz de lectura, noche de películas, escena de fiesta, o crea tu propio propósito personalizado.",
      "howItWorks.step2.title": "Diseño y Estilo",
      "howItWorks.step2.description":
        "Elige la forma, color y acabado de tu botón. Elige de nuestra paleta curada o crea un color personalizado.",
      "howItWorks.step3.title": "Agregar Etiqueta e Icono",
      "howItWorks.step3.description":
        "Personaliza con texto e iconos personalizados. Sube tu propio SVG o elige de nuestra biblioteca.",
      "howItWorks.step4.title": "Configurar Comportamiento",
      "howItWorks.step4.description":
        "Configura efectos de iluminación, brillo, integración Wi-Fi y programación para una automatización perfecta.",

      // Gallery Section
      "gallery.title": "Galería de",
      "gallery.titleHighlight": "Inspiración",
      "gallery.subtitle":
        "Descubre increíbles diseños de botones creados por nuestra comunidad. Inspírate y usa cualquier diseño como punto de partida para tu propia creación.",
      "gallery.featuredTitle": "Diseños Destacados",
      "gallery.featuredSubtitle":
        "Diseños seleccionados que muestran lo mejor de lo que es posible",
      "gallery.viewAll": "Ver Todos los Diseños",

      // Pricing Section
      "pricing.title": "Precios",
      "pricing.titleHighlight": "Simples y",
      "pricing.titleEnd": "Transparentes",
      "pricing.subtitle":
        "Elige el plan perfecto para tus necesidades. Sin tarifas ocultas, sin suscripciones. Compra única, disfrute de por vida.",
      "pricing.faq.title": "Preguntas Frecuentes",
      "pricing.faq.subtitle":
        "Todo lo que necesitas saber sobre nuestros precios",

      // Footer
      "footer.tagline": "Ilumina Tu Personalidad",
      "footer.product": "Producto",
      "footer.support": "Soporte",
      "footer.company": "Empresa",
      "footer.supportCenter": "Centro de Soporte",
      "footer.faq": "FAQ",
      "footer.contactUs": "Contáctanos",
      "footer.aboutUs": "Acerca de Nosotros",
      "footer.privacy": "Política de Privacidad",
      "footer.terms": "Términos de Servicio",
      "footer.copyright":
        "© 2024 MyMood Button. Todos los derechos reservados.",

      // Common
      // Support Section
      "support.title": "Obtener",
      "support.titleHighlight": "Soporte",
      "support.subtitle":
        "Estamos aquí para ayudarte en cada paso del camino. Elige la opción de soporte que mejor funcione para ti.",
      "support.liveChat.title": "Chat en Vivo",
      "support.liveChat.description":
        "Obtén ayuda instantánea de nuestro equipo de soporte",
      "support.liveChat.availability": "Disponible 24/7",
      "support.liveChat.action": "Iniciar Chat",
      "support.email.title": "Soporte por Email",
      "support.email.description":
        "Envíanos un mensaje detallado sobre tu problema",
      "support.email.availability": "Respuesta en 24h",
      "support.email.action": "Enviar Email",
      "support.phone.title": "Soporte Telefónico",
      "support.phone.description":
        "Habla directamente con nuestros especialistas de soporte",
      "support.phone.availability": "Lun-Vie 9AM-6PM EST",
      "support.phone.action": "Llamar Ahora",
      "support.knowledge.title": "Base de Conocimiento",
      "support.knowledge.description":
        "Navega por nuestros artículos de ayuda completos",
      "support.knowledge.availability": "Siempre Disponible",
      "support.knowledge.action": "Ver Artículos",

      // Pricing FAQ
      "pricing.faq.subscription.title": "¿Hay una tarifa de suscripción?",
      "pricing.faq.subscription.answer":
        "¡No! Todos nuestros planes son compras únicas. Compra una vez, disfruta para siempre.",
      "pricing.faq.upgrade.title": "¿Puedo actualizar más tarde?",
      "pricing.faq.upgrade.answer":
        "Sí, puedes actualizar tu plan en cualquier momento y acreditaremos la diferencia.",
      "pricing.faq.warranty.title": "¿Qué está incluido en la garantía?",
      "pricing.faq.warranty.answer":
        "Cobertura de reemplazo completa para defectos de fabricación y fallas de hardware.",
      "pricing.faq.refunds.title": "¿Ofrecen reembolsos?",
      "pricing.faq.refunds.answer":
        "Sí, ofrecemos una garantía de devolución de dinero de 30 días si no estás satisfecho.",
      "pricing.faq.shipping.title": "¿Cuánto tiempo toma el envío?",
      "pricing.faq.shipping.answer":
        "2-3 semanas para botones personalizados. Te mantendremos actualizado durante todo el proceso.",
      "pricing.faq.multiple.title": "¿Puedo pedir múltiples botones?",
      "pricing.faq.multiple.answer":
        "¡Por supuesto! Contáctanos para descuentos por volumen en pedidos de 5 o más.",

      // Support Stats
      "support.stats.responseTime": "Tiempo promedio de respuesta",
      "support.stats.satisfaction": "Satisfacción del cliente",
      "support.stats.availability": "Disponibilidad de soporte",

      // Final CTA
      "cta.title": "¿Listo para Crear tu Botón?",
      "cta.subtitle":
        "Únete a miles de usuarios que ya han personalizado su espacio con MyMood Button.",
      "cta.action": "Comenzar Personalización",

      // Customize Page
      "customize.title": "Diseña tu Botón",
      "customize.cancelOrder": "Cancelar Pedido",
      "customize.autoSaved": "Guardado automáticamente",
      "customize.steps.purpose": "Propósito",
      "customize.steps.style": "Estilo",
      "customize.steps.label": "Etiqueta",
      "customize.steps.behavior": "Comportamiento",
      "customize.steps.review": "Revisión",
      "customize.navigation.back": "Atrás",
      "customize.navigation.continue": "Continuar",
      "customize.navigation.confirmOrder": "Confirmar Pedido",

      // Step Content
      "customize.purpose.title": "Elige el Propósito de tu Botón",
      "customize.purpose.subtitle":
        "Selecciona cómo usarás principalmente tu botón MyMood para comenzar con la configuración perfecta.",

      "customize.review.title": "Revisa tu Botón Personalizado",
      "customize.review.subtitle":
        "Revisa tu personalización y confirma tu pedido. No se requiere información de pago.",

      // Review Step Content
      "review.yourDesign": "Tu Diseño",
      "review.purpose": "Propósito",
      "review.shapeStyle": "Forma y Estilo",
      "review.labelContent": "Etiqueta y Contenido",
      "review.lightingSmart": "Iluminación y Funciones Inteligentes",
      "review.orderSummary": "Resumen del Pedido",
      "review.quantity": "Cantidad",
      "review.priceBreakdown": "Desglose de Precios",
      "review.baseButton": "Botón Base",
      "review.finish": "Acabado",
      "review.mode": "Modo",
      "review.wifiIntegration": "Integración WiFi",
      "review.total": "Total",
      "review.shipping": "Envío y Entrega",
      "review.customManufacturing": "Fabricación personalizada: 2-3 semanas",
      "review.freeShipping": "Envío gratuito en todo el mundo",
      "review.trackingInfo": "Información de seguimiento proporcionada",
      "review.moneyBack": "Garantía de devolución de dinero de 30 días",
      "review.customerReviews": "Reseñas de Clientes",
      "review.reviews": "reseñas",
      "review.amazingQuality":
        "¡Calidad increíble y opciones de personalización. El botón se siente premium y funciona perfectamente!",
      "review.verifiedBuyer": "Comprador Verificado",
      "review.noPaymentRequired":
        "No se requiere pago ahora. La confirmación del pedido se procesará por separado.",
      "review.termsAgreement":
        "Al confirmar, aceptas nuestros Términos de Servicio y Política de Privacidad.",
      "review.customColor": "Color Personalizado",
      "review.standardColor": "Color Estándar",
      "review.noTextLabel": "Sin etiqueta de texto",
      "review.icon": "Icono",
      "review.customImage": "Imagen personalizada subida",
      "review.noIconImage": "Sin icono o imagen",
      "review.brightness": "brillo",
      "review.wifiEnabled": "WiFi habilitado con funciones inteligentes",
      "review.standaloneMode": "Modo independiente",

  // Order Confirmation Modal
  "confirmation.title": "¡Pedido Confirmado!",
      "confirmation.orderNumber": "Pedido #",
      "confirmation.thankYou":
        "¡Gracias por tu pedido! Tu botón MyMood personalizado está ahora en preparación.",
      "confirmation.emailSent":
        "📧 Email de confirmación enviado a tu bandeja de entrada",
      "confirmation.whatNext": "¿Qué sigue?",
      "confirmation.orderConfirmed": "Pedido Confirmado",
      "confirmation.justNow": "Ahora mismo",
      "confirmation.productionStarted": "Producción Iniciada",
      "confirmation.within24Hours": "Dentro de 24 horas",
      "confirmation.qualityCheck": "Control de Calidad",
      "confirmation.twoThreeWeeks": "2-3 semanas",
      "confirmation.shipped": "Enviado",
      "confirmation.threeFiveDays": "3-5 días hábiles",
      "confirmation.orderDetails": "Detalles del Pedido",
      "confirmation.orderNumber2": "Número de Pedido:",
      "confirmation.estimatedDelivery": "Entrega Estimada:",
      "confirmation.status": "Estado:",
      "confirmation.confirmed": "Confirmado",
      "confirmation.goHome": "🏠 Ir al Inicio",
      "confirmation.startNew": "🎨 Nuevo Pedido",
      "confirmation.seeOrders": "📦 Ver tus Pedidos",
      "confirmation.questionsSupport":
        "¿Preguntas? Contacta a nuestro equipo de soporte en cualquier momento.",
      "confirmation.ratedCustomers": "Calificado 4.9/5 por clientes",

      "common.loading": "Cargando...",
      "common.error": "Error",
      "common.save": "Guardar",
      "common.cancel": "Cancelar",
      "common.continue": "Continuar",
      "common.back": "Atrás",
    },
    "🇩🇪": {
      // Header
      "nav.howItWorks": "Wie Es Funktioniert",
      "nav.gallery": "Galerie",
      "nav.pricing": "Preise",
      "nav.customize": "Ihren Anpassen",
      "nav.orders": "Bestellungen",
      "nav.how": "Wie",
      "nav.order": "Bestellen",

      // Hero Section
      "hero.title": "Beleuchten Sie Ihre",
      "hero.titleHighlight": "Persönlichkeit",
      "hero.description":
        "Erstellen Sie Ihren perfekten intelligenten Knopf mit anpassbaren Beleuchtungseffekten, personalisierten Steuerelementen und nahtloser Smart-Home-Integration. Drücken Sie sich mit jeder Berührung aus.",
      "hero.customizeButton": "Ihren Anpassen",
      "hero.viewGallery": "Galerie Ansehen",

      // Features Section
      "features.title": "Warum MyMood Wählen?",
      "features.subtitle":
        "Entdecken Sie die perfekte Mischung aus Technologie und Personalisierung",
      "features.smartLighting.title": "Intelligente Beleuchtung",
      "features.smartLighting.description":
        "Dynamische Beleuchtungseffekte, die auf Ihre Stimmung und Umgebung mit intelligenter Automatisierung reagieren.",
      "features.appIntegration.title": "App-Integration",
      "features.appIntegration.description":
        "Steuern Sie Ihren Knopf nahtlos über unsere intuitive mobile App mit erweiterten Planungsfunktionen.",
      "features.customization.title": "Endlose Anpassung",
      "features.customization.description":
        "Wählen Sie aus unzähligen Kombinationen von Farben, Formen, Symbolen und Verhalten, die zu Ihrem Stil passen.",

      // How It Works Section
      "howItWorks.title": "Wie Es",
      "howItWorks.titleHighlight": "Funktioniert",
      "howItWorks.subtitle":
        "Erstellen Sie Ihren perfekten intelligenten Knopf in nur 4 einfachen Schritten. Vom Konzept bis zur Lieferung machen wir die Anpassung einfach und angenehm.",
      "howItWorks.step": "Schritt",
      "howItWorks.step1.title": "Wählen Sie Ihren Zweck",
      "howItWorks.step1.description":
        "Wählen Sie zwischen Fokusmodus, Leselicht, Filmabend, Partyszene oder erstellen Sie Ihren eigenen benutzerdefinierten Zweck.",
      "howItWorks.step2.title": "Design und Stil",
      "howItWorks.step2.description":
        "Wählen Sie Form, Farbe und Finish Ihres Knopfes. Wählen Sie aus unserer kuratierten Palette oder erstellen Sie eine benutzerdefinierte Farbe.",
      "howItWorks.step3.title": "Beschriftung und Symbol Hinzufügen",
      "howItWorks.step3.description":
        "Personalisieren Sie mit benutzerdefiniertem Text und Symbolen. Laden Sie Ihr eigenes SVG hoch oder wählen Sie aus unserer Bibliothek.",
      "howItWorks.step4.title": "Verhalten Einstellen",
      "howItWorks.step4.description":
        "Konfigurieren Sie Beleuchtungseffekte, Helligkeit, Wi-Fi-Integration und Planung für perfekte Automatisierung.",

      // Gallery Section
      "gallery.title": "Galerie der",
      "gallery.titleHighlight": "Inspiration",
      "gallery.subtitle":
        "Entdecken Sie erstaunliche Knopfdesigns, die von unserer Gemeinschaft erstellt wurden. Lassen Sie sich inspirieren und verwenden Sie jedes Design als Ausgangspunkt für Ihre eigene Kreation.",
      "gallery.featuredTitle": "Ausgewählte Designs",
      "gallery.featuredSubtitle":
        "Handverlesene Designs, die das Beste von dem zeigen, was möglich ist",
      "gallery.viewAll": "Alle Designs Ansehen",

      // Pricing Section
      "pricing.title": "Einfache,",
      "pricing.titleHighlight": "Transparente",
      "pricing.titleEnd": "Preise",
      "pricing.subtitle":
        "Wählen Sie den perfekten Plan für Ihre Bedürfnisse. Keine versteckten Gebühren, keine Abonnements. Einmaliger Kauf, lebenslanger Genuss.",
      "pricing.faq.title": "Häufig Gestellte Fragen",
      "pricing.faq.subtitle": "Alles, was Sie über unsere Preise wissen müssen",

      // Footer
      "footer.tagline": "Beleuchten Sie Ihre Persönlichkeit",
      "footer.product": "Produkt",
      "footer.support": "Support",
      "footer.company": "Unternehmen",
      "footer.supportCenter": "Support-Center",
      "footer.faq": "FAQ",
      "footer.contactUs": "Kontaktieren Sie Uns",
      "footer.aboutUs": "Über Uns",
      "footer.privacy": "Datenschutzrichtlinie",
      "footer.terms": "Nutzungsbedingungen",
      "footer.copyright": "© 2024 MyMood Button. Alle Rechte vorbehalten.",

      // Common
      // Support Section
      "support.title": "Erhalten Sie",
      "support.titleHighlight": "Support",
      "support.subtitle":
        "Wir sind da, um Ihnen bei jedem Schritt zu helfen. Wählen Sie die Support-Option, die am besten für Sie funktioniert.",
      "support.liveChat.title": "Live Chat",
      "support.liveChat.description":
        "Erhalten Sie sofortige Hilfe von unserem Support-Team",
      "support.liveChat.availability": "24/7 Verfügbar",
      "support.liveChat.action": "Chat Starten",
      "support.email.title": "Email Support",
      "support.email.description":
        "Senden Sie uns eine detaillierte Nachricht über Ihr Problem",
      "support.email.availability": "Antwort innerhalb von 24h",
      "support.email.action": "Email Senden",
      "support.phone.title": "Telefon Support",
      "support.phone.description":
        "Sprechen Sie direkt mit unseren Support-Spezialisten",
      "support.phone.availability": "Mo-Fr 9-18 Uhr EST",
      "support.phone.action": "Jetzt Anrufen",
      "support.knowledge.title": "Wissensdatenbank",
      "support.knowledge.description":
        "Durchsuchen Sie unsere umfassenden Hilfe-Artikel",
      "support.knowledge.availability": "Immer Verfügbar",
      "support.knowledge.action": "Artikel Durchsuchen",

      "common.loading": "Wird geladen...",
      "common.error": "Fehler",
      "common.save": "Speichern",
      "common.cancel": "Abbrechen",
      "common.continue": "Fortfahren",
      "common.back": "Zurück",
    },
    "🇮🇹": {
      // Header
      "nav.features": "Funzionalità",
      "nav.howItWorks": "Come Funziona",
      "nav.gallery": "Galleria",
      "nav.pricing": "Prezzi",
      "nav.customize": "Personalizza il Tuo",
      "nav.orders": "Ordini",
      "nav.how": "Come",
      "nav.order": "Ordina",
  "header.language": "Lingua",

      // Hero Section
      "hero.title": "Illumina la Tua",
      "hero.titleHighlight": "Personalità",
      "hero.description":
        "Crea il tuo pulsante intelligente perfetto con effetti di illuminazione personalizzabili, controlli personalizzati e integrazione perfetta per la casa intelligente. Esprimi te stesso con ogni tocco.",
      "hero.customizeButton": "Personalizza il Tuo",
      "hero.viewGallery": "Vedi Galleria",

      // Features Section
      "features.title": "Perché Scegliere MyMood?",
      "features.subtitle":
        "Scopri la perfetta combinazione di tecnologia e personalizzazione",
      "features.smartLighting.title": "Illuminazione Intelligente",
      "features.smartLighting.description":
        "Effetti di illuminazione dinamici che rispondono al tuo umore e ambiente con automazione intelligente.",
      "features.appIntegration.title": "Integrazione App",
      "features.appIntegration.description":
        "Controlla il tuo pulsante senza problemi attraverso la nostra app mobile intuitiva con funzioni di programmazione avanzate.",
      "features.customization.title": "Personalizzazione Infinita",
      "features.customization.description":
        "Scegli tra innumerevoli combinazioni di colori, forme, icone e comportamenti che si adattano al tuo stile.",

      // How It Works Section
      "howItWorks.title": "Come",
      "howItWorks.titleHighlight": "Funziona",
      "howItWorks.subtitle":
        "Crea il tuo pulsante intelligente perfetto in soli 4 semplici passaggi. Dal concetto alla consegna, rendiamo la personalizzazione facile e divertente.",
      "howItWorks.step": "Passo",
      "howItWorks.step1.title": "Scegli il Tuo Scopo",
      "howItWorks.step1.description":
        "Seleziona tra modalità focus, luce di lettura, serata cinema, scena festa, o crea il tuo scopo personalizzato.",
      "howItWorks.step2.title": "Design e Stile",
      "howItWorks.step2.description":
        "Scegli la forma, il colore e la finitura del tuo pulsante. Scegli dalla nostra palette curata o crea un colore personalizzato.",
      "howItWorks.step3.title": "Aggiungi Etichetta e Icona",
      "howItWorks.step3.description":
        "Personalizza con testo e icone personalizzate. Carica il tuo SVG o scegli dalla nostra libreria.",
      "howItWorks.step4.title": "Imposta Comportamento",
      "howItWorks.step4.description":
        "Configura effetti di illuminazione, luminosità, integrazione Wi-Fi e programmazione per un'automazione perfetta.",

      // Gallery Section
      "gallery.title": "Galleria di",
      "gallery.titleHighlight": "Ispirazione",
      "gallery.subtitle":
        "Scopri incredibili design di pulsanti creati dalla nostra comunità. Ispirati e usa qualsiasi design come punto di partenza per la tua creazione.",
      "gallery.featuredTitle": "Design in Evidenza",
      "gallery.featuredSubtitle":
        "Design selezionati che mostrano il meglio di ciò che è possibile",
      "gallery.viewAll": "Vedi Tutti i Design",

      // Pricing Section
      "pricing.title": "Prezzi",
      "pricing.titleHighlight": "Semplici e",
      "pricing.titleEnd": "Trasparenti",
      "pricing.subtitle":
        "Scegli il piano perfetto per le tue esigenze. Nessuna tariffa nascosta, nessun abbonamento. Acquisto unico, divertimento per tutta la vita.",
      "pricing.faq.title": "Domande Frequenti",
      "pricing.faq.subtitle": "Tutto quello che devi sapere sui nostri prezzi",

      // Footer
      "footer.tagline": "Illumina la Tua Personalità",
      "footer.product": "Prodotto",
      "footer.support": "Supporto",
      "footer.company": "Azienda",
  "footer.quickLinks": "Link Rapidi",
  "footer.contactLabel": "Contattaci:",
      "footer.supportCenter": "Centro Supporto",
      "footer.faq": "FAQ",
      "footer.contactUs": "Contattaci",
      "footer.aboutUs": "Chi Siamo",
      "footer.privacy": "Politica sulla Privacy",
      "footer.terms": "Termini di Servizio",
  "footer.copyright": "© 2025 MyMood Innovations. Tutti i diritti riservati.",

  "faq.title": "Domande Frequenti",
  "progress.label": "Avanzamento",
  "progress.step": "Passo",
  "progress.base": "Base",
  "progress.addons": "Componenti aggiuntivi",
  "progress.basePrice": "Prezzo base",
  "progress.details": "Dettagli",
  "progress.hideDetails": "Nascondi dettagli",
  "progress.stepProgress": "Passo {current} / {total}",

      // Common
      // Support Section
      "support.title": "Ottieni",
      "support.titleHighlight": "Supporto",
      "support.subtitle":
        "Siamo qui per aiutarti in ogni passo del percorso. Scegli l'opzione di supporto che funziona meglio per te.",
      "support.liveChat.title": "Chat dal Vivo",
      "support.liveChat.description":
        "Ottieni aiuto istantaneo dal nostro team di supporto",
      "support.liveChat.availability": "Disponibile 24/7",
      "support.liveChat.action": "Inizia Chat",
      "support.email.title": "Supporto Email",
      "support.email.description":
        "Inviaci un messaggio dettagliato sul tuo problema",
      "support.email.availability": "Risposta entro 24h",
      "support.email.action": "Invia Email",
      "support.phone.title": "Supporto Telefonico",
      "support.phone.description":
        "Parla direttamente con i nostri specialisti del supporto",
      "support.phone.availability": "Lun-Ven 9-18 EST",
      "support.phone.action": "Chiama Ora",
      "support.knowledge.title": "Base di Conoscenza",
      "support.knowledge.description":
        "Sfoglia i nostri articoli di aiuto completi",
      "support.knowledge.availability": "Sempre Disponibile",
      "support.knowledge.action": "Sfoglia Articoli",

      "common.loading": "Caricamento...",
      "common.error": "Errore",
      "common.save": "Salva",
      "common.cancel": "Annulla",
      "common.continue": "Continua",
      "common.back": "Indietro",

      // UI Messages
      "ui.loadingContent": "Caricamento contenuto...",
      "ui.unableToLoadContent": "Impossibile Caricare il Contenuto",
      "ui.retry": "Riprova",
      "ui.stepOf": "Passo {current} di {total}",
      "ui.failedToLoadContent": "Impossibile caricare il contenuto",

      // Draft Selection Modal
      "draft.continueOrStartNew": "Continua o Inizia Nuovo?",
      "draft.youHaveDrafts": "Hai {count} bozz{plural} in corso. Scegline una per continuare o inizia un nuovo design.",
      "draft.startNewOrder": "Nuovo Ordine",
      "draft.orContinueFromDraft": "O continua da una bozza",
      "draft.stepOfFive": "Passo {step}/5",
      "draft.clickToContinue": "Clicca su una bozza per continuare da dove hai lasciato",

      // Form Labels
      "form.customizeYourBrandingPackage": "Personalizza il Tuo Pacchetto di Branding",
      "form.completeFormBelow": "Completa il modulo qui sotto per ottenere la tua soluzione di branding personalizzata",

      // Fallback Text
      "fallback.howItWorks": "Come Funziona",
      "fallback.getStarted": "Inizia",

      // Modal Actions
      "modal.cancelOrder.title": "Annulla Ordine",
      "modal.cancelOrder.message": "Hai modifiche non salvate nel design del tuo pulsante. Cosa vorresti fare?",
      "modal.cancelOrder.saveAsDraft": "Salva come Bozza",
      "modal.cancelOrder.deleteAndExit": "Elimina ed Esci",
      "modal.cancelOrder.continueEditing": "Continua Modifica",
      "modal.cancelOrder.saving": "Salvataggio...",
      "modal.cancelOrder.deleting": "Eliminazione...",

      // Navigation buttons
      "navigation.previous": "Precedente",
      "navigation.next": "Avanti",
      "navigation.completeOrder": "Completa Ordine",
      "navigation.startCustomizing": "Inizia Personalizzazione",
      "navigation.stepComplete": "Passaggio Completato",
      "navigation.pleaseCompleteFields": "Si prega di completare i campi richiesti",

      // Purpose selection
      "purpose.chooseYourPrimaryUseCase": "Scegli il Tuo Caso d'Uso Principale",
      "purpose.addCustom": "Aggiungi Personalizzato",
      "purpose.customUseCasePlaceholder": "Descrivi il tuo caso d'uso personalizzato...",
      "purpose.tellUsMorePlaceholder": "Raccontaci di più sui tuoi bisogni specifici, preferenze, o requisiti speciali...",

      // Gallery instructions
      "gallery.loveWhatYouSee": "Ti piace quello che vedi? Crea il tuo pulsante personalizzato!",

      // Demo instructions
      "demo.watchTitle": "Guarda Come Usare Il Nostro Modulo",
      "demo.watchDescription": "Questa demo ti mostra esattamente come compilare il nostro modulo di personalizzazione passo dopo passo.",
      
  // Orders / Confirmation Pages (IT)
  "orders.title": "I miei Ordini e Bozze",
  "orders.subtitle": "Visualizza gli ordini completati e riprendi le bozze salvate",
  "orders.savedDrafts": "Bozze salvate",
  "orders.noDraftsYet": "Nessuna bozza",
  "orders.noDraftsHint": "I tuoi design salvati appariranno qui",
  "orders.resume": "Riprendi",
  "orders.completedOrders": "Ordini completati",
  "orders.noOrdersYet": "Nessun ordine",
  "orders.noOrdersHint": "Non hai ancora completato ordini. Inizia creando il tuo primo pulsante personalizzato!",
  "orders.viewDetails": "Vedi dettagli",
  "orders.hideDetails": "Nascondi dettagli",
  "orders.receipt": "Ricevuta",
  "orders.delete": "Elimina",
  "orders.deleteOrder": "Elimina ordine",
  "orders.cannotBeUndone": "Questa azione è irreversibile",
  "orders.areYouSureDelete": "Sei sicuro di voler eliminare l'ordine {order}?\nQuesto lo rimuoverà definitivamente dalla tua cronologia.",
  "orders.experiences": "Esperienze",
  "orders.orderDate": "Data ordine",
  "orders.customer": "Cliente",
  "orders.characters": "Personaggi",
  "orders.unnamedExperience": "Esperienza senza nome",

  // Product-specific thank you messages (IT)
  "confirmation.thankYou.button": "Grazie per il tuo ordine! Il tuo pulsante MyMood personalizzato è ora in preparazione.",
  "confirmation.thankYou.book": "Grazie per il tuo ordine! Il tuo libro MyMood personalizzato è ora in preparazione.",
  "confirmation.thankYou.branding": "Grazie per il tuo ordine! Il tuo pacchetto di branding MyMood personalizzato è ora in preparazione.",
  "confirmation.thankYou.song": "Grazie per il tuo ordine! La tua canzone MyMood personalizzata è ora in preparazione.",
  // Generic fallback (IT)
  "confirmation.thankYou": "Grazie per il tuo ordine! Il tuo pulsante MyMood personalizzato è ora in preparazione.",

  // Product-specific thank you messages (IT)
  "confirmation.downloadReceipt": "Scarica ricevuta",
  "confirmation.shareOrder": "Condividi ordine",
  "confirmation.confirmedProcessing": "Confermato e in lavorazione",
  "confirmation.orderSaved": "✅ Ordine salvato - puoi vederlo in qualsiasi momento in \"I miei ordini\"",
  "confirmation.orderTracking": "Tracciamento ordine",
  "support.needHelp": "Serve aiuto?",
    },
    "🇳🇱": {
      // Header
      "nav.howItWorks": "Hoe Het Werkt",
      "nav.gallery": "Galerij",
      "nav.pricing": "Prijzen",
      "nav.customize": "Pas de Jouwe Aan",
      "nav.orders": "Bestellingen",
      "nav.how": "Hoe",
      "nav.order": "Bestellen",

      // Hero Section
      "hero.title": "Verlicht Je",
      "hero.titleHighlight": "Persoonlijkheid",
      "hero.description":
        "Creëer je perfecte slimme knop met aanpasbare verlichtingseffecten, gepersonaliseerde bedieningselementen en naadloze smart home integratie. Druk jezelf uit bij elke aanraking.",
      "hero.customizeButton": "Pas de Jouwe Aan",
      "hero.viewGallery": "Bekijk Galerij",

      // Features Section
      "features.title": "Waarom MyMood Kiezen?",
      "features.subtitle":
        "Ontdek de perfecte mix van technologie en personalisatie",
      "features.smartLighting.title": "Slimme Verlichting",
      "features.smartLighting.description":
        "Dynamische verlichtingseffecten die reageren op je stemming en omgeving met intelligente automatisering.",
      "features.appIntegration.title": "App Integratie",
      "features.appIntegration.description":
        "Bedien je knop naadloos via onze intuïtieve mobiele app met geavanceerde planningsfuncties.",
      "features.customization.title": "Eindeloze Aanpassing",
      "features.customization.description":
        "Kies uit talloze combinaties van kleuren, vormen, pictogrammen en gedrag die bij je stijl passen.",

      // How It Works Section
      "howItWorks.title": "Hoe Het",
      "howItWorks.titleHighlight": "Werkt",
      "howItWorks.subtitle":
        "Creëer je perfecte slimme knop in slechts 4 eenvoudige stappen. Van concept tot levering, wij maken aanpassing eenvoudig en plezierig.",
      "howItWorks.step": "Stap",
      "howItWorks.step1.title": "Kies Je Doel",
      "howItWorks.step1.description":
        "Selecteer uit focusmodus, leeslicht, filmavond, feestscène, of creëer je eigen aangepaste doel.",
      "howItWorks.step2.title": "Ontwerp en Stijl",
      "howItWorks.step2.description":
        "Kies de vorm, kleur en afwerking van je knop. Kies uit ons samengestelde palet of creëer een aangepaste kleur.",
      "howItWorks.step3.title": "Voeg Label en Pictogram Toe",
      "howItWorks.step3.description":
        "Personaliseer met aangepaste tekst en pictogrammen. Upload je eigen SVG of kies uit onze bibliotheek.",
      "howItWorks.step4.title": "Stel Gedrag In",
      "howItWorks.step4.description":
        "Configureer verlichtingseffecten, helderheid, Wi-Fi integratie en planning voor perfecte automatisering.",

      // Gallery Section
      "gallery.title": "Galerij van",
      "gallery.titleHighlight": "Inspiratie",
      "gallery.subtitle":
        "Ontdek geweldige knopontwerpen gemaakt door onze gemeenschap. Raak geïnspireerd en gebruik elk ontwerp als startpunt voor je eigen creatie.",
      "gallery.featuredTitle": "Uitgelichte Ontwerpen",
      "gallery.featuredSubtitle":
        "Handgeselecteerde ontwerpen die het beste laten zien van wat mogelijk is",
      "gallery.viewAll": "Bekijk Alle Ontwerpen",

      // Pricing Section
      "pricing.title": "Eenvoudige,",
      "pricing.titleHighlight": "Transparante",
      "pricing.titleEnd": "Prijzen",
      "pricing.subtitle":
        "Kies het perfecte plan voor je behoeften. Geen verborgen kosten, geen abonnementen. Eenmalige aankoop, levenslang plezier.",
      "pricing.faq.title": "Veelgestelde Vragen",
      "pricing.faq.subtitle": "Alles wat je moet weten over onze prijzen",

      // Footer
      "footer.tagline": "Verlicht Je Persoonlijkheid",
      "footer.product": "Product",
      "footer.support": "Ondersteuning",
      "footer.company": "Bedrijf",
      "footer.supportCenter": "Ondersteuningscentrum",
      "footer.faq": "FAQ",
      "footer.contactUs": "Neem Contact Op",
      "footer.aboutUs": "Over Ons",
      "footer.privacy": "Privacybeleid",
      "footer.terms": "Servicevoorwaarden",
      "footer.copyright": "© 2024 MyMood Button. Alle rechten voorbehouden.",

      // Common
      // Support Section
      "support.title": "Krijg",
      "support.titleHighlight": "Ondersteuning",
      "support.subtitle":
        "We zijn er om je bij elke stap te helpen. Kies de ondersteuningsoptie die het beste voor je werkt.",
      "support.liveChat.title": "Live Chat",
      "support.liveChat.description":
        "Krijg directe hulp van ons ondersteuningsteam",
      "support.liveChat.availability": "24/7 Beschikbaar",
      "support.liveChat.action": "Start Chat",
      "support.email.title": "Email Ondersteuning",
      "support.email.description":
        "Stuur ons een gedetailleerd bericht over je probleem",
      "support.email.availability": "Reactie binnen 24u",
      "support.email.action": "Email Versturen",
      "support.phone.title": "Telefoon Ondersteuning",
      "support.phone.description":
        "Spreek direct met onze ondersteuningsspecialisten",
      "support.phone.availability": "Ma-Vr 9-18 EST",
      "support.phone.action": "Nu Bellen",
      "support.knowledge.title": "Kennisbank",
      "support.knowledge.description": "Bekijk onze uitgebreide help-artikelen",
      "support.knowledge.availability": "Altijd Beschikbaar",
      "support.knowledge.action": "Bekijk Artikelen",

      "common.loading": "Laden...",
      "common.error": "Fout",
      "common.save": "Opslaan",
      "common.cancel": "Annuleren",
      "common.continue": "Doorgaan",
      "common.back": "Terug",
    },
    "🇸🇦": {
      // Header
      "nav.features": "الميزات",
      "nav.howItWorks": "كيف يعمل",
      "nav.gallery": "المعرض",
      "nav.pricing": "الأسعار",
      "nav.customize": "خصص زرك",
      "nav.orders": "الطلبات",
      "nav.how": "كيف",
      "nav.order": "اطلب",
  "header.language": "اللغة",

      // Hero Section
      "hero.title": "أضيء",
      "hero.titleHighlight": "شخصيتك",
      "hero.description":
        "إنشئ زرك الذكي المثالي مع تأثيرات إضاءة قابلة للتخصيص وعناصر تحكم ش��صية وتكامل سلس مع المنزل الذكي. عبر عن نفسك مع كل لمسة.",
      "hero.customizeButton": "خصص زرك",
      "hero.viewGallery": "شاهد المعرض",

      // Features Section
      "features.title": "لماذا تختار MyMood؟",
      "features.subtitle": "اكتشف المزيج المثالي من التكنولوجيا والتخصيص",
      "features.smartLighting.title": "الإضاءة الذكية",
      "features.smartLighting.description":
        "تأثيرات إضاءة ديناميكية تستجيب لمزاجك وبيئتك مع أتمتة ذكية.",
      "features.appIntegration.title": "تكامل التطبيق",
      "features.appIntegration.description":
        "تحكم في زرك بسلاسة من خلال تطبيقنا المحمول البديهي مع ميزات جدولة متقدمة.",
      "features.customization.title": "تخصيص لا نهائي",
      "features.customization.description":
        "اختر من بين مجموعات لا تحصى من الألوان والأشكال والرموز والسلوكيات لتناسب أسلوبك.",

      // How It Works Section
      "howItWorks.title": "كيف",
      "howItWorks.titleHighlight": "يعم��",
      "howItWorks.subtitle":
        "أنشئ زرك الذكي المثالي في 4 خطوات بسيطة فقط. من المفهوم إلى التسليم، نجعل التخصيص سهلاً وممتعاً.",
      "howItWorks.step": "الخطوة",
      "howItWorks.step1.title": "اختر هدفك",
      "howItWorks.step1.description":
        "اختر من وضع التركيز أو ضوء القراءة أو ليلة الفيلم أو مشهد الحفلة أو أنشئ هدفك المخصص.",
      "howItWorks.step2.title": "التصميم والأسلوب",
      "howItWorks.step2.description":
        "اختر شكل ولون وتشطيب زرك. اختر من لوحة الألوان المنسقة أو أنشئ لوناً مخصصاً.",
      "howItWorks.step3.title": "أض�� تسمية ورمز",
      "howItWorks.step3.description":
        "خصص بنص ورموز ��خصصة. ارفع ملف SVG الخاص بك أو اختر من مكتبتنا.",
      "howItWorks.step4.title": "تعيين السلوك",
      "howItWorks.step4.description":
        "اضبط تأثيرات الإضاءة والسطوع وتكامل الواي فاي والجدولة للحصول على أتمتة مثالية.",

      // Gallery Section
      "gallery.title": "معرض",
      "gallery.titleHighlight": "الإلهام",
      "gallery.subtitle":
        "اكتشف تصاميم أزرار مذهلة أنشأها مجتمعنا. استلهم واستخدم أي تصميم كنقطة انطلاق لإب��اعك الخاص.",
      "gallery.featuredTitle": "التصاميم المميزة",
      "gallery.featuredSubtitle": "تصاميم منتقاة بعناية تُظهر أفضل ما هو ممكن",
      "gallery.viewAll": "عرض جميع التصاميم",

      // Pricing Section
      "pricing.title": "أسعار",
      "pricing.titleHighlight": "بسيطة",
      "pricing.titleEnd": "وشفافة",
      "pricing.subtitle":
        "اختر الخطة المثالية لاحتياجاتك. لا توجد رسوم ��فية، لا اشتراكات. شراء لمرة واحدة، استمتاع مدى الحياة.",
      "pricing.faq.title": "الأسئلة الشائعة",
      "pricing.faq.subtitle": "كل ما تحتاج لمعرفته عن أسعارنا",

      // Footer
      "footer.tagline": "أضيء شخصيتك",
      "footer.product": "المنتج",
      "footer.support": "الدعم",
      "footer.company": "الشركة",
  "footer.quickLinks": "روابط سريعة",
  "footer.contactLabel": "اتصل بنا:",
      "footer.supportCenter": "مركز الدعم",
      "footer.faq": "الأسئلة الشائعة",
      "footer.contactUs": "تواصل معنا",
      "footer.aboutUs": "من نحن",
      "footer.privacy": "سياسة الخصوصية",
      "footer.terms": "شروط الخدمة",
  "footer.copyright": "© 2025 MyMood Innovations. جميع الحقوق محفوظة.",

  "faq.title": "الأسئلة الشائعة",
  "progress.label": "التقدم",
  "progress.step": "الخطوة",
  "progress.base": "الأساس",
  "progress.addons": "الإضافات",
  "progress.basePrice": "السعر الأساسي",
  "progress.details": "التفاصيل",
  "progress.hideDetails": "إخفاء التفاصيل",
  "progress.stepProgress": "الخطوة {current} / {total}",

      // Common
      // Support Section
      "support.title": "احصل على",
      "support.titleHighlight": "الدعم",
      "support.subtitle":
        "نحن هنا لمساعدتك في كل خطوة على الطريق. اختر خيار الدعم الذي يناسبك أكثر.",
      "support.liveChat.title": "الدردشة المباشرة",
      "support.liveChat.description":
        "احصل على ��ساعدة فورية من فريق الدعم لدينا",
      "support.liveChat.availability": "متاح 24/7",
      "support.liveChat.action": "ابدأ الدردشة",
      "support.email.title": "دعم البريد الإلكتروني",
      "support.email.description": "أرسل لنا رسالة مفصلة حول مشكلتك",
      "support.email.availability": "الرد خلال 24 ساعة",
      "support.email.action": "إرسال بريد إل��تروني",
      "support.phone.title": "الدعم الهاتفي",
      "support.phone.description": "تحدث مباشرة مع متخصصي الدعم لدينا",
      "support.phone.availability": "الإثنين-الجم��ة 9ص-6م EST",
      "support.phone.action": "اتصل الآن",
      "support.knowledge.title": "قاعدة المعرفة",
      "support.knowledge.description": "تصفح مقالات المساعدة الشاملة لدينا",
      "support.knowledge.availability": "متاح دائماً",
      "support.knowledge.action": "تصفح المقالات",

      // Pricing FAQ
      "pricing.faq.subscription.title": "هل هناك رسوم اشتراك؟",
      "pricing.faq.subscription.answer":
        "لا! جميع خططنا هي ��شتريات لمرة واحدة. اشتر مرة واحدة واستمتع إلى الأبد.",
      "pricing.faq.upgrade.title": "هل يمكنني الترقية لاحقاً؟",
      "pricing.faq.upgrade.answer":
        "نعم، يمكنك ترقية خطتك في أي وقت وسنقوم بإضافة الفرق.",
      "pricing.faq.warranty.title": "ما المشمول في الضمان؟",
      "pricing.faq.warranty.answer":
        "تغطية استبدال كاملة لعيوب التصنيع وأعطال الأجهزة.",
      "pricing.faq.refunds.title": "هل تقدمون استرداد؟",
      "pricing.faq.refunds.answer":
        "نعم، نقدم ضمان استرداد الأموال لمدة 30 يوماً إذا لم تكن راضياً.",
      "pricing.faq.shipping.title": "كم يستغرق الشحن؟",
      "pricing.faq.shipping.answer":
        "2-3 أسابيع للأزرار المخصصة. سنبقيك محدثاً طوال العملية.",
      "pricing.faq.multiple.title": "هل يمكنني طلب أزرار متعددة؟",
      "pricing.faq.multiple.answer":
        "بالطبع! تواصل معنا للحصول على خصومات الكمية على الطلبات من 5 أو أكثر.",

      // Support Stats
      "support.stats.responseTime": "متوسط وقت الاستجابة",
      "support.stats.satisfaction": "رضا العملاء",
      "support.stats.availability": "توفر الدعم",

      // Final CTA
      "cta.title": "هل أنت مستعد لإنشاء زرك؟",
      "cta.subtitle":
        "انضم إلى آلاف المستخدمين الذين قاموا بالفعل بتخصيص مساحتهم باستخدام MyMood Button.",
      "cta.action": "ابدأ التخصيص",

      // Customize Page
      "customize.title": "صمم زرك",
      "customize.cancelOrder": "إلغاء الطلب",
      "customize.autoSaved": "محفوظ تلقائياً",
      "customize.steps.purpose": "الهدف",
      "customize.steps.style": "الأسلوب",
      "customize.steps.label": "التسمية",
      "customize.steps.behavior": "السلوك",
      "customize.steps.review": "المراجعة",
      "customize.navigation.back": "السابق",
      "customize.navigation.continue": "متابعة",
      "customize.navigation.confirmOrder": "تأكيد الطلب",

      // Step Content
      "customize.purpose.title": "اختر هدف زرك",
      "customize.purpose.subtitle":
        "حدد كيف ستستخدم زر MyMood بشكل أساسي للبدء بالتكوين المثالي.",

      "customize.style.title": "صمم مظهر زرك",
      "customize.style.subtitle":
        "اختر من {shapes} أشكال فريدة وألوان غير محدودة و {finishes} تشطيبات مميزة.",
      "customize.style.tabs.shape": "الشكل",
      "customize.style.tabs.color": "اللون",
      "customize.style.tabs.finish": "التشطيب",
      "customize.style.chooseShape": "اختر شكلك",
      "customize.style.chooseColor": "اختر لونك",
      "customize.style.chooseFinish": "اختر تشطيبك",
      "customize.style.addCustom": "إضافة مخصص",
      "customize.style.createCustomColor": "إنشاء لون مخصص",
      "customize.style.addColor": "إضافة لون",
      "customize.style.livePreview": "معاينة مباشرة",
      "customize.style.finish": "تشطيب",
      "customize.style.color": "اللون",

      "customize.label.title": "إضافة نص ورموز وصور",
      "customize.label.subtitle":
        "خصص زرك بالنص والرموز أو الصور الخاصة بك. ببساطة انقر واسحب للتموضع.",
      "customize.label.tabs.text": "النص",
      "customize.label.tabs.icons": "الرموز",
      "customize.label.tabs.upload": "تحميل",

      "customize.behavior.title": "تخصيص الإضاءة والمميزات الذكية",
      "customize.behavior.subtitle":
        "اختر من {lightModes} أوضاع إضاءة فريدة وتكامل WiFi اختياري للتحكم في المنزل الذكي.",

      "customize.review.title": "راجع زرك المخصص",
      "customize.review.subtitle":
        "راجع تخصيصك وأكد طلبك. لا توجد معلومات دفع مطلوبة.",

      // Review Step Content
      "review.yourDesign": "تصميمك",
      "review.purpose": "الغرض",
      "review.shapeStyle": "الشكل والنمط",
      "review.labelContent": "التسمية والمحتوى",
      "review.lightingSmart": "الإضاءة والمميزات الذكية",
      "review.orderSummary": "ملخص الطلب",
      "review.quantity": "الكمية",
      "review.priceBreakdown": "تفصيل الأسعار",
      "review.baseButton": "الزر الأساسي",
      "review.finish": "النهاية",
      "review.mode": "الوضع",
      "review.wifiIntegration": "تكامل WiFi",
      "review.total": "المجموع",
      "review.shipping": "الشحن والتسليم",
      "review.customManufacturing": "التصنيع المخصص: 2-3 أسابيع",
      "review.freeShipping": "شحن مجاني في جميع أنحاء العالم",
      "review.trackingInfo": "معلومات التتبع متوفرة",
      "review.moneyBack": "ضمان استرداد الأموال لمدة 30 يوماً",
      "review.customerReviews": "آراء العملاء",
      "review.reviews": "مراجعات",
      "review.amazingQuality":
        "جودة مذهلة وخيارات تخصيص. الزر يبدو مميزاً ويعمل بشكل مثالي!",
      "review.verifiedBuyer": "مشتري موثق",
      "review.noPaymentRequired":
        "لا يوجد دفع مطلوب الآن. سيتم معالجة تأكيد الطلب بشكل منفصل.",
      "review.termsAgreement":
        "بالتأكيد، فإنك توافق على شروط الخدمة وسياسة الخصوصية.",
      "review.customColor": "لون مخصص",
      "review.standardColor": "لون قياسي",
      "review.noTextLabel": "لا توجد تسمية نصية",
      "review.icon": "الأيقونة",
      "review.customImage": "صورة مخص��ة مرفوعة",
      "review.noIconImage": "لا توجد أيقونة أو صورة",
      "review.brightness": "السطوع",
      "review.wifiEnabled": "WiFi مفعل مع مميزات ذكية",
      "review.standaloneMode": "وضع مستقل",

      // Order Confirmation Modal
      "confirmation.title": "تم تأكيد الطلب!",
      "confirmation.orderNumber": "طلب #",
  // Note: Product-specific thank you messages are defined below with a fallback; no duplicate generic above.
      "confirmation.emailSent": "📧 تم إرسال رسالة تأكيد إلى بريدك الإلكتروني",
      "confirmation.whatNext": "ما الذي يحدث بعد ذلك؟",
      "confirmation.orderConfirmed": "تم تأكيد الطلب",
      "confirmation.justNow": "الآن",
      "confirmation.productionStarted": "بدأ الإنتاج",
      "confirmation.within24Hours": "خلال 24 ساعة",
      "confirmation.qualityCheck": "فحص الجودة",
      "confirmation.twoThreeWeeks": "2-3 أسابيع",
      "confirmation.shipped": "تم الشحن",
      "confirmation.threeFiveDays": "3-5 أيام عمل",
      "confirmation.orderDetails": "تفاصيل الطلب",
      "confirmation.orderNumber2": "رقم الطلب:",
      "confirmation.estimatedDelivery": "التسليم المقدر:",
      "confirmation.status": "الحالة:",
      "confirmation.confirmed": "مؤكد",
      "confirmation.goHome": "🏠 الذهاب للصف��ة الرئيسية",
      "confirmation.startNew": "🎨 طلب جديد",
      "confirmation.seeOrders": "📦 رؤية طلباتك",
      "confirmation.questionsSupport": "أسئلة؟ اتصل بفريق الدعم في أي وقت.",
      "confirmation.ratedCustomers": "تقييم 4.9/5 من قبل العملاء",

      "common.loading": "جاري التحميل...",
      "common.error": "خطأ",
      "common.save": "حفظ",
      "common.cancel": "إلغاء",
      "common.continue": "متابعة",
      "common.back": "عودة",

      // UI Messages
      "ui.loadingContent": "جاري تحميل المحتوى...",
      "ui.unableToLoadContent": "تعذر تحميل المحتوى",
      "ui.retry": "إعادة المحاولة",
      "ui.stepOf": "الخطوة {current} من {total}",
      "ui.failedToLoadContent": "فشل في تحميل المحتوى",

      // Draft Selection Modal
      "draft.continueOrStartNew": "متابعة أم بداية جديدة؟",
      "draft.youHaveDrafts": "لديك {count} مسودة{plural} قيد التقدم. اختر واحدة للمتابعة أو ابدأ تصميماً جديداً.",
      "draft.startNewOrder": "طلب جديد",
      "draft.orContinueFromDraft": "أو تابع من مسودة",
      "draft.stepOfFive": "الخطوة {step}/5",
      "draft.clickToContinue": "انقر على مسودة للمتابعة من حيث توقفت",

      // Form Labels
      "form.customizeYourBrandingPackage": "خصص حزمة العلامة التجارية الخاصة بك",
      "form.completeFormBelow": "أكمل النموذج أدناه للحصول على حل العلامة التجارية الشخصي الخاص بك",

      // Fallback Text
      "fallback.howItWorks": "كيف يعمل",
      "fallback.getStarted": "ابدأ",

      // Modal Actions
      "modal.cancelOrder.title": "إلغاء الطلب",
      "modal.cancelOrder.message": "لديك تغييرات غير محفوظة في تصميم الزر الخاص بك. ماذا تريد أن تفعل؟",
      "modal.cancelOrder.saveAsDraft": "حفظ كمسودة",
      "modal.cancelOrder.deleteAndExit": "حذف والخروج",
      "modal.cancelOrder.continueEditing": "متابعة التحرير",
      "modal.cancelOrder.saving": "جاري الحفظ...",
      "modal.cancelOrder.deleting": "جاري الحذف...",

      // Navigation buttons
      "navigation.previous": "السابق",
      "navigation.next": "التالي",
      "navigation.completeOrder": "إكمال الطلب",
      "navigation.startCustomizing": "بدء التخصيص",
      "navigation.stepComplete": "الخطوة مكتملة",
      "navigation.pleaseCompleteFields": "يرجى إكمال الحقول المطلوبة",

      // Purpose selection
      "purpose.chooseYourPrimaryUseCase": "اختر حالة الاستخدام الأساسية",
      "purpose.addCustom": "إضافة مخصص",
      "purpose.customUseCasePlaceholder": "وصف حالة الاستخدام المخصصة الخاصة بك...",
      "purpose.tellUsMorePlaceholder": "أخبرنا المزيد عن احتياجاتك المحددة والتفضيلات أو أي متطلبات خاصة...",

      // Gallery instructions
      "gallery.loveWhatYouSee": "أعجبك ما تراه؟ أنشئ زرك المخصص!",

      // Demo instructions
      "demo.watchTitle": "شاهد كيفية استخدام النموذج",
      "demo.watchDescription": "يوضح لك هذا العرض التوضيحي بالضبط كيفية ملء نموذج التخصيص الخاص بنا خطوة بخطوة.",
      
  // Orders / Confirmation Pages (AR)
  "orders.title": "طلباتي والمسودات",
  "orders.subtitle": "اعرض طلباتك المكتملة واستأنف المسودات المحفوظة",
  "orders.savedDrafts": "المسودات المحفوظة",
  "orders.noDraftsYet": "لا توجد مسودات بعد",
  "orders.noDraftsHint": "ستظهر تصاميم الأزرار المحفوظة هنا",
  "orders.resume": "استئناف",
  "orders.completedOrders": "الطلبات المكتملة",
  "orders.noOrdersYet": "لا توجد طلبات بعد",
  "orders.noOrdersHint": "لم تُكمل أي طلبات بعد. ابدأ بإنشاء زرّك المخصص الأول!",
  "orders.viewDetails": "عرض التفاصيل",
  "orders.hideDetails": "إخفاء التفاصيل",
  "orders.receipt": "الإيصال",
  "orders.delete": "حذف",
  "orders.deleteOrder": "حذف الطلب",
  "orders.cannotBeUndone": "هذا الإجراء لا يمكن التراجع عنه",
  "orders.areYouSureDelete": "هل أنت متأكد أنك تريد حذف الطلب {order}؟\nسيؤدي ذلك إلى إزالته نهائياً من سجلك.",
  "orders.experiences": "التجارب",
  "orders.orderDate": "تاريخ الطلب",
  "orders.customer": "العميل",
  "orders.characters": "الشخصيات",
  "orders.unnamedExperience": "تجربة بدون اسم",

  // Product-specific thank you messages (AR)
  "confirmation.thankYou.button": "شكراً لطلبك! زر MyMood المخصص الآن قيد التحضير.",
  "confirmation.thankYou.book": "شكراً لطلبك! كتاب MyMood المخصص الآن قيد التحضير.",
  "confirmation.thankYou.branding": "شكراً لطلبك! حزمة العلامة التجارية MyMood المخصصة الآن قيد التحضير.",
  "confirmation.thankYou.song": "شكراً لطلبك! أغنيتك MyMood المخصصة الآن قيد التحضير.",
  // Generic fallback (AR)
  "confirmation.thankYou": "شكراً لطلبك! زر MyMood المخصص الآن قيد التحضير.",

  "confirmation.downloadReceipt": "تحميل الإيصال",
  "confirmation.shareOrder": "مشاركة الطلب",
  "confirmation.confirmedProcessing": "مؤكد وتحت المعالجة",
  "confirmation.orderSaved": "✅ تم حفظ الطلب - يمكنك عرضه في أي وقت ضمن \"طلباتي\"",
  "confirmation.orderTracking": "تتبع الطلب",
  "support.needHelp": "تحتاج مساعدة؟",
    },
  };

  return (key: string) => {
    const languageTranslations = translations[language] as Record<string, string>;
    const fallbackTranslations = translations["🇺🇸"] as Record<string, string>;
    return languageTranslations?.[key] || fallbackTranslations?.[key] || key;
  };
};

// Provider component
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("🇺🇸");
  const { getLanguageFromId, updateUrlForLanguage, getCurrentId } = useUrlId();
  const t = useTranslations(language);

  // Initialize language from URL ID on mount
  useEffect(() => {
    const currentId = getCurrentId();
    if (currentId) {
      const detectedLanguage = getLanguageFromId(currentId);
      setLanguage(detectedLanguage as Language);
    } else {
      // Fallback to localStorage if no ID
      const savedLanguage = localStorage.getItem("preferred-language") as Language;
      if (savedLanguage && ["🇺🇸", "🇫🇷", "🇮🇹", "🇸🇦"].includes(savedLanguage)) {
        setLanguage(savedLanguage);
      }
    }
  }, [getCurrentId, getLanguageFromId]);

  // Save language to localStorage and update URL when changed
  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("preferred-language", lang);
    
    // Update URL ID to reflect new language
    updateUrlForLanguage(lang);
  };

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage: handleSetLanguage, t }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

// Custom hook to use language context
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
