"use client";

import { useDynamicForm } from '@/hooks/useDynamicForm';
import { useUrlId } from '../../hooks/useUrlIdStatic';
import { useEffect, useState } from 'react';

export default function TestFormPage() {
  const { getCurrentId, updateUrlForLanguage, updateUrlForProduct, getProductTypeFromId, getLanguageFromId } = useUrlId();
  const [currentId, setCurrentId] = useState<string>('BT1');
  
  // Get form data using the updated form hook
  const { formData, loading, error, currentStep, totalSteps } = useDynamicForm(currentId);

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
            📝 Form System Test
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
                  <strong>Product Type:</strong> {getProductTypeFromId(currentId)}
                </p>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Language:</strong> {getLanguageFromId(currentId)}
                </p>
              </div>
              <div>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Form Status:</strong> {loading ? '🔄 Loading...' : error ? '❌ Error' : '✅ Loaded'}
                </p>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Current Step:</strong> {currentStep + 1} / {totalSteps}
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
                      getProductTypeFromId(currentId) === product
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

          {/* Form Data Preview */}
          {formData && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                📝 Form Configuration Preview
              </h2>

              {/* Form Steps Overview */}
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">
                  📋 Form Steps ({formData.steps?.length || 0} total)
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {formData.steps?.map((step, index) => (
                    <div key={step.id || index} className="text-sm text-green-800 dark:text-green-200 p-2 bg-green-100 dark:bg-green-800 rounded">
                      <p><strong>Step {index + 1}:</strong> {step.title || step.id}</p>
                      <p className="text-xs">Fields: {step.fields?.length || 0}</p>
                      {step.fields && step.fields.length > 0 && (
                        <p className="text-xs">Types: {step.fields.map(f => f.type).join(', ')}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* First Step Detail */}
              {formData.steps && formData.steps.length > 0 && (
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
                  <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-2">
                    🔍 First Step Detail: "{formData.steps[0].title || formData.steps[0].id}"
                  </h3>
                  <div className="space-y-2">
                    {formData.steps[0].fields?.map((field, index) => (
                      <div key={field.name || index} className="text-sm text-purple-800 dark:text-purple-200 p-2 bg-purple-100 dark:bg-purple-800 rounded">
                        <p><strong>{field.label || field.name}</strong> ({field.type})</p>
                        {field.required && <span className="text-xs bg-red-200 dark:bg-red-800 px-1 rounded">Required</span>}
                        {field.placeholder && <p className="text-xs">Placeholder: {field.placeholder}</p>}
                        {(field as any).options && <p className="text-xs">Options: {(field as any).options?.slice(0, 3).join(', ')}...</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Form Validation */}
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700">
                <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                  ✅ Form Validation
                </h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-yellow-800 dark:text-yellow-200">
                  <div>
                    <p><strong>✅ Form Structure Valid:</strong> {formData.steps ? 'Yes' : 'No'}</p>
                    <p><strong>📋 Total Steps:</strong> {formData.steps?.length || 0}</p>
                    <p><strong>📝 Total Fields:</strong> {formData.steps?.reduce((acc, step) => acc + (step.fields?.length || 0), 0) || 0}</p>
                  </div>
                  <div>
                    <p><strong>🔧 Field Types Found:</strong></p>
                    <div className="text-xs">
                      {Array.from(new Set(
                        formData.steps?.flatMap(step => 
                          step.fields?.map(field => field.type) || []
                        ) || []
                      )).join(', ')}
                    </div>
                  </div>
                </div>
              </div>

              {/* JSON Debug */}
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  🔍 Raw Form JSON Structure
                </h3>
                <pre className="text-xs text-gray-700 dark:text-gray-300 overflow-auto max-h-96 bg-white dark:bg-gray-800 p-3 rounded border">
                  {JSON.stringify(formData, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
