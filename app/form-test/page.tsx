'use client';

import { useDynamicForm } from '@/hooks/useDynamicForm';
import { useUrlId } from '../../hooks/useUrlIdStatic';
import { DynamicFormField } from '@/components/DynamicFormComponents';

export default function TestFormPage() {
  const { id } = useUrlId();
  const { formData, loading, error, currentStep, setCurrentStep, formValues, updateFormValue, isStepValid, totalSteps } = useDynamicForm(id);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dynamic form configuration...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">Error: {error}</div>
          <p className="text-gray-600">Failed to load form configuration</p>
        </div>
      </div>
    );
  }

  if (!formData || !formData.steps || formData.steps.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-yellow-600 text-xl mb-4">No form configuration found</div>
          <p className="text-gray-600">Using sample form data</p>
        </div>
      </div>
    );
  }

  const currentStepData = formData.steps[currentStep];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Dynamic Form Test
            </h1>
            <p className="text-gray-600">
              Testing dynamic form loading for ID: {id || 'default'}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Step {currentStep + 1} of {totalSteps}</span>
              <span className="text-sm text-gray-600">{Math.round(((currentStep + 1) / totalSteps) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          {/* Current Step */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {currentStepData.title}
              </h2>
              {currentStepData.description && (
                <p className="text-gray-600">{currentStepData.description}</p>
              )}
            </div>

            {/* Form Fields */}
            <div className="space-y-6">
              {currentStepData.fields.map((field: any) => (
                <DynamicFormField
                  key={field.name}
                  field={field}
                  value={formValues[field.name]}
                  onChange={(value: any) => updateFormValue(field.name, value)}
                />
              ))}

              {/* Repeatable Group */}
              {currentStepData.repeatable_group && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">
                    {currentStepData.repeatable_group.label}
                  </h3>
                  <DynamicFormField
                    field={{
                      ...currentStepData.repeatable_group,
                      type: 'repeatable_group'
                    } as any}
                    value={formValues[currentStepData.repeatable_group.name] || []}
                    onChange={(value: any) => updateFormValue(currentStepData.repeatable_group!.name, value)}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
            >
              Previous
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Step {currentStep + 1} valid: {isStepValid(currentStep) ? '✅' : '❌'}
              </p>
            </div>

            {currentStep < totalSteps - 1 ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={!isStepValid(currentStep)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                disabled={!isStepValid(currentStep)}
                className="px-6 py-2 bg-green-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-700 transition-colors"
                onClick={() => {
                  alert('Form completed! Check console for data.');
                  console.log('Form data:', formValues);
                }}
              >
                Complete
              </button>
            )}
          </div>

          {/* Debug Info */}
          <div className="mt-8 p-4 bg-gray-100 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Debug Information</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Total Steps:</strong> {totalSteps}</p>
              <p><strong>Current Step:</strong> {currentStep + 1}</p>
              <p><strong>Form Values:</strong> {Object.keys(formValues).length} fields filled</p>
              <p><strong>Step Valid:</strong> {isStepValid(currentStep) ? 'Yes' : 'No'}</p>
            </div>
            <details className="mt-4">
              <summary className="cursor-pointer font-medium">Form Configuration (JSON)</summary>
              <pre className="mt-2 text-xs bg-white p-2 rounded border overflow-auto max-h-40">
                {JSON.stringify(formData, null, 2)}
              </pre>
            </details>
            <details className="mt-4">
              <summary className="cursor-pointer font-medium">Current Form Values</summary>
              <pre className="mt-2 text-xs bg-white p-2 rounded border overflow-auto max-h-40">
                {JSON.stringify(formValues, null, 2)}
              </pre>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}
