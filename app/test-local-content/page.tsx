"use client";

import { useLocalContent } from '@/hooks/useLocalContent';
import { useUrlId } from '../../hooks/useUrlIdStatic';
import { useEffect, useState } from 'react';

export default function TestLocalContentPage() {
  const { getCurrentId, updateUrlForLanguage, updateUrlForProduct, getProductTypeFromId, getLanguageFromId } = useUrlId();
  const [currentId, setCurrentId] = useState<string>('BT1');
  
  // Get content using the new local content hook
  const { data, loading, error, productType, language } = useLocalContent(currentId);

  // Update current ID when URL changes
  useEffect(() => {
    const id = getCurrentId();
    if (id) {
      setCurrentId(id);
    }
  }, [getCurrentId]);

  const handleProductChange = (product: 'Button' | 'Book' | 'Branding') => {
    updateUrlForProduct(product);
  };

  const handleLanguageChange = (lang: '🇺🇸' | '🇫🇷' | '🇮🇹' | '🇸🇦') => {
    updateUrlForLanguage(lang);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            🧪 Local Content System Test
          </h1>
          
          {/* Current ID and Controls */}
          <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
            <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">
              📋 Current Configuration
            </h2>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Current ID:</strong> <code className="bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded">{currentId}</code>
                </p>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Product Type:</strong> {productType}
                </p>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Language:</strong> {language}
                </p>
              </div>
              <div>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Status:</strong> {loading ? '🔄 Loading...' : error ? '❌ Error' : '✅ Loaded'}
                </p>
                {error && <p className="text-sm text-red-600">{error}</p>}
              </div>
            </div>
            
            {/* Product Type Selector */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                Product Type:
              </label>
              <div className="flex gap-2">
                {(['Button', 'Book', 'Branding'] as const).map((product) => (
                  <button
                    key={product}
                    onClick={() => handleProductChange(product)}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      productType === product
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-700'
                    }`}
                  >
                    {product}
                  </button>
                ))}
              </div>
            </div>

            {/* Language Selector */}
            <div>
              <label className="block text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                Language:
              </label>
              <div className="flex gap-2">
                {([['🇺🇸', 'English'], ['🇫🇷', 'French'], ['🇮🇹', 'Italian'], ['🇸🇦', 'Arabic']] as const).map(([flag, name]) => (
                  <button
                    key={flag}
                    onClick={() => handleLanguageChange(flag)}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors flex items-center gap-1 ${
                      getLanguageFromId(currentId) === flag
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-700'
                    }`}
                  >
                    {flag} {name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Content Preview */}
          {data && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                📄 Content Preview
              </h2>

              {/* Hero Section */}
              {data.hero && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                  <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">
                    🎯 Hero Section
                  </h3>
                  <div className="space-y-2 text-sm text-green-800 dark:text-green-200">
                    {data.hero.title && <p><strong>Title:</strong> {data.hero.title}</p>}
                    {data.hero.headline && <p><strong>Headline:</strong> {data.hero.headline}</p>}
                    {data.hero.subtitle && <p><strong>Subtitle:</strong> {data.hero.subtitle}</p>}
                    {data.hero.cta_text && <p><strong>CTA:</strong> {data.hero.cta_text}</p>}
                  </div>
                </div>
              )}

              {/* Menu */}
              {data.menu && (
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
                  <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-2">
                    🧭 Menu
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm text-purple-800 dark:text-purple-200">
                    {Object.entries(data.menu).map(([key, value]) => (
                      <p key={key}><strong>{key}:</strong> {value}</p>
                    ))}
                  </div>
                </div>
              )}

              {/* Features */}
              {data.features && data.features.length > 0 && (
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700">
                  <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                    ✨ Features ({data.features.length})
                  </h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {data.features.slice(0, 4).map((feature, index) => (
                      <div key={index} className="text-sm text-yellow-800 dark:text-yellow-200">
                        <p><strong>{feature.icon} {feature.title}</strong></p>
                        <p className="text-xs">{feature.description || feature.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* About */}
              {data.about && (
                <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-700">
                  <h3 className="text-lg font-semibold text-indigo-900 dark:text-indigo-100 mb-2">
                    ℹ️ About
                  </h3>
                  <div className="text-sm text-indigo-800 dark:text-indigo-200">
                    <p><strong>{data.about.title}</strong></p>
                    <p className="text-xs mt-1">{data.about.text}</p>
                  </div>
                </div>
              )}

              {/* JSON Debug */}
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  🔍 Raw JSON Structure
                </h3>
                <pre className="text-xs text-gray-700 dark:text-gray-300 overflow-auto max-h-96 bg-white dark:bg-gray-800 p-3 rounded border">
                  {JSON.stringify(data, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
