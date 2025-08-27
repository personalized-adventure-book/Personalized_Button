"use client";
// Added client directive to ensure hooks work properly in Next.js App Router environment
// ...existing code...
import React from 'react';
import { DynamicFormData } from '@/hooks/useDynamicForm';
import { useTracking } from './TrackingProvider';
import { StyledSelect } from './StyledSelectComponents';
import { SelectBox } from './SelectBoxComponents';
import {
  User,
  Baby,
  MapPin,
  Heart,
  Star,
  Map,
  Rocket,
  TreePine,
  Crown,
  Anchor,
  Zap,
  Upload,
  Mic
} from 'lucide-react';

// Icon mapping for form steps
// Colored step icon components
const stepIconMap: { [key: string]: React.ComponentType<any> } = {
  user: (props) => <User {...props} className={(props?.className||'') + ' text-blue-500'} />,
  baby: (props) => <Baby {...props} className={(props?.className||'') + ' text-pink-500'} />,
  location: (props) => <MapPin {...props} className={(props?.className||'') + ' text-rose-500'} />,
  heart: (props) => <Heart {...props} className={(props?.className||'') + ' text-red-500'} />,
  star: (props) => <Star {...props} className={(props?.className||'') + ' text-yellow-500'} />,
  map: (props) => <Map {...props} className={(props?.className||'') + ' text-emerald-500'} />,
  rocket: (props) => <Rocket {...props} className={(props?.className||'') + ' text-indigo-500'} />,
  tree: (props) => <TreePine {...props} className={(props?.className||'') + ' text-green-600'} />,
  crown: (props) => <Crown {...props} className={(props?.className||'') + ' text-amber-500'} />,
  anchor: (props) => <Anchor {...props} className={(props?.className||'') + ' text-slate-500'} />,
  bolt: (props) => <Zap {...props} className={(props?.className||'') + ' text-orange-500'} />,
  mic: (props) => <Mic {...props} className={(props?.className||'') + ' text-purple-500'} />
};

// Icon mapping for adventure options
const adventureIconMap: { [key: string]: React.ComponentType<any> } = {
  rocket: Rocket,
  tree: TreePine,
  crown: Crown,
  anchor: Anchor,
  bolt: Zap,
  heart: Heart
};

// Simplified SuggestionTextarea per user request (minimal chips + toggle + counter + textarea)
const SuggestionTextarea: React.FC<{
  field: any;
  value: string;
  onChange: (val: string) => void;
  error?: string;
}> = ({ field, value, onChange, error }) => {
  const suggestions: string[] = field.suggestions || [];
  const maxLength: number | undefined = field.maxLength;
  const [showAll, setShowAll] = React.useState(false);

  const visible = showAll ? suggestions : suggestions.slice(0, 6);
  const toggleable = suggestions.length > 6;

  const handleAdd = (s: string) => {
    const base = value || '';
    const next = base.trim().length === 0 ? s : base.endsWith('\n') ? base + s : base + '\n' + s;
    if (maxLength && next.length > maxLength) return;
    onChange(next);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-800 dark:text-gray-200">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {maxLength && (
          <span className="text-xs text-gray-500 dark:text-gray-400 tabular-nums">{value.length}/{maxLength}</span>
        )}
      </div>

      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {visible.map(s => (
            <button
              key={s}
              type="button"
              onClick={() => handleAdd(s)}
              className="px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 text-[11px] font-medium transition-colors"
            >
              {s.length > 80 ? s.slice(0, 77) + '…' : s}
            </button>
          ))}
          {toggleable && (
            <button
              type="button"
              onClick={() => setShowAll(s => !s)}
              className="px-3 py-1.5 rounded-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 text-[11px] font-medium"
            >
              {showAll ? 'Moins' : 'Plus'}
            </button>
          )}
        </div>
      )}

      <textarea
        name={field.name}
        placeholder={field.placeholder || 'Quelques lignes sur le contexte, émotions, noms, phrases...'}
        value={value || ''}
        onChange={(e) => {
          if (maxLength && e.target.value.length > maxLength) return;
          onChange(e.target.value);
        }}
        rows={field.rows || 5}
        className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary transition-colors font-medium resize-y leading-relaxed text-[clamp(0.85rem,0.55rem+0.8vw,1.05rem)] border-gray-300 dark:border-gray-600 ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
        required={field.required}
      />
      {field.helper && (
        <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-snug">{field.helper}</p>
      )}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

// Props for DynamicFormField (restored after accidental removal)
interface DynamicFormFieldProps {
  field: any;
  value: any;
  onChange: (value: any) => void;
  onBlur?: (fieldName: string, value: any) => void;
  error?: string;
  formValues?: Record<string, any>;
}

export function DynamicFormField({ field, value, onChange, onBlur, error, formValues }: DynamicFormFieldProps) {
  // Basic field debug to trace rendering issues
  try {
    if (process.env.NODE_ENV !== 'production') {
      console.debug('🧩 Rendering field type:', field?.type, 'name:', field?.name);
    }
  } catch {}
  // Check conditional logic
  if (field.conditional && formValues) {
    const { field: conditionalField, value: conditionalValue } = field.conditional;
    const currentValue = formValues[conditionalField];
    
    console.log('🔍 Conditional check for field:', field.name, {
      conditionalField,
      conditionalValue,
      currentValue,
      shouldShow: currentValue === conditionalValue
    });
    
    // Only show this field if the conditional value matches
    if (currentValue !== conditionalValue) {
      return null;
    }
  }
  
  const baseClasses = "w-full px-4 py-3 lg:px-5 lg:py-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary transition-colors";
  const errorClasses = error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "";

  switch (field.type) {
    case 'choice_text':
      return (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))' }}>
            {field.options.map((option: string) => {
              const isSize = field.name === 'text_size';
              const isSelected = value === option;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => onChange(isSelected ? '' : option)}
                  className={`transition-all duration-150 font-bold rounded-2xl min-h-[40px] px-3 py-2 flex flex-col items-center justify-center select-none border-2 outline-none focus:ring-2 focus:ring-primary focus:border-primary shadow-sm text-center
                    ${!isSize ? 'text-[0.70rem] xs:text-[0.75rem] sm:text-[0.85rem] md:text-[0.95rem]' : ''}
                    ${isSelected
                      ? 'bg-primary text-white border-primary ring-2 ring-primary scale-105 shadow-lg'
                      : 'bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700 hover:border-primary/60 hover:bg-primary/10 active:scale-97'}
                  `}
                  style={isSize ? { fontSize: `${option}px` } : undefined}
                  aria-pressed={isSelected}
                >
                  <span
                    className="w-full text-center break-words whitespace-normal leading-snug"
                    style={{
                      wordBreak: 'break-word',
                      overflowWrap: 'anywhere',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {option}
                  </span>
                </button>
              );
            })}
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
      );
    case 'text':
    case 'email':
    case 'tel':
      return (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <input
            type={field.type}
            name={field.name}
            placeholder={field.placeholder}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            onBlur={(e) => onBlur?.(field.name, e.target.value)}
            className={`${baseClasses} ${errorClasses}`}
            required={field.required}
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
      );

    case 'textarea':
      return (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <textarea
            name={field.name}
            placeholder={field.placeholder}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            onBlur={(e) => onBlur?.(field.name, e.target.value)}
            rows={4}
            className={`${baseClasses} ${errorClasses}`}
            required={field.required}
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
      );

    case 'suggestion_textarea':
      return (
        <SuggestionTextarea
          field={field}
          value={value || ''}
          onChange={(v) => onChange(v)}
          error={error}
        />
      );

    case 'choice':
      return (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <StyledSelect
            name={field.name}
            value={value || ''}
            onChange={onChange}
            options={field.options}
            placeholder={field.placeholder}
            required={field.required}
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
      );

    case 'radio':
      return (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <div className="space-y-2">
            {field.options.map((option: string, index: number) => (
              <label key={index} className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name={field.name}
                  value={option}
                  checked={value === option}
                  onChange={(e) => onChange(e.target.value)}
                  className="w-4 h-4 text-primary focus:ring-primary border-gray-300"
                  required={field.required}
                />
                <span className="text-gray-900 dark:text-white leading-snug break-words whitespace-normal" style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>{option}</span>
              </label>
            ))}
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
      );

    case 'segmented':
      return (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <div role="radiogroup" aria-label={field.label} className="inline-flex rounded-xl overflow-hidden border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800">
            {field.options.map((option: string, idx: number) => {
              const isActive = value === option;
              return (
                <button
                  key={option}
                  type="button"
                  role="radio"
                  aria-checked={isActive}
                  onClick={() => onChange(isActive ? '' : option)}
                  className={`px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60
                    ${isActive ? 'bg-primary text-white shadow-inner' : 'text-gray-700 dark:text-gray-300 hover:bg-white/60 dark:hover:bg-gray-700'}
                    ${idx > 0 ? 'border-l border-gray-300 dark:border-gray-600' : ''}`}
                >
                  {option}
                </button>
              );
            })}
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
      );

    case 'binary_cards':
      // Expect options: [{ label, value?, description?, icon? }]
      return (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <div className="grid gap-4 min-[426px]:gap-5 min-[426px]:grid-cols-[repeat(auto-fit,minmax(220px,220px))] min-[426px]:justify-start min-[426px]:items-stretch">
            {field.options.map((opt: any, optIdx: number) => {
              if (typeof opt === 'string') {
                opt = { label: opt, value: opt };
              }
              const optValue = opt.value || opt.label || '';
              const isActive = value === optValue;
              const IconComp = opt.icon === 'mic' ? Mic : opt.icon === 'crown' ? Crown : opt.icon === 'star' ? Star : opt.icon === 'anchor' ? Anchor : opt.icon === 'zap' ? Zap : User;
              const SafeIcon: React.FC<{ className?: string }> = ({ className }) => {
                try {
                  if (!IconComp) {
                    if (process.env.NODE_ENV !== 'production') console.debug('⚠️ No IconComp resolved', { opt });
                    return <span className={className}>?</span>;
                  }
                  return <IconComp className={className || ''} />;
                } catch {
                  return <span className={className}>!</span>;
                }
              };
              // Map icon to color theme classes (explicit so Tailwind keeps them)
              const activeColorClasses: Record<string, { wrapper: string; icon: string; text: string }> = {
                mic: { wrapper: 'border-purple-400 bg-purple-50 dark:bg-purple-900/20', icon: 'bg-purple-500', text: 'text-purple-600 dark:text-purple-300' },
                crown: { wrapper: 'border-amber-400 bg-amber-50 dark:bg-amber-900/20', icon: 'bg-amber-500', text: 'text-amber-600 dark:text-amber-300' },
                star: { wrapper: 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20', icon: 'bg-yellow-500', text: 'text-yellow-600 dark:text-yellow-300' },
                anchor: { wrapper: 'border-slate-400 bg-slate-50 dark:bg-slate-900/20', icon: 'bg-slate-600', text: 'text-slate-600 dark:text-slate-300' },
                zap: { wrapper: 'border-orange-400 bg-orange-50 dark:bg-orange-900/20', icon: 'bg-orange-500', text: 'text-orange-600 dark:text-orange-300' },
                user: { wrapper: 'border-blue-400 bg-blue-50 dark:bg-blue-900/20', icon: 'bg-blue-500', text: 'text-blue-600 dark:text-blue-300' }
              };
              const colorKey = (opt.icon || 'user') as string;
              const themed = activeColorClasses[colorKey] || activeColorClasses['user'];
              return (
                <button
                  key={optValue || optIdx}
                  type="button"
                  onClick={() => onChange(isActive ? '' : optValue)}
                  className={`relative text-left rounded-2xl p-4 border-2 transition-all group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 h-full flex flex-col
                    ${isActive ? `${themed.wrapper} shadow-sm` : 'border-gray-200 dark:border-gray-700 hover:border-primary/50 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                  aria-pressed={isActive}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${isActive ? `${themed.icon} text-white` : 'bg-gray-100 dark:bg-gray-900 text-gray-500 dark:text-gray-400'}`}> 
                      <SafeIcon className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <p className={`text-sm font-semibold leading-tight ${isActive ? themed.text : 'text-gray-800 dark:text-gray-100'}`}
                        style={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >{opt.label}</p>
                      {opt.description && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 leading-snug"
                          style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}
                        >{opt.description}</p>
                      )}
                      {opt.badge && (
                        <span className="inline-block mt-1 text-[10px] uppercase tracking-wide font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">{opt.badge}</span>
                      )}
                    </div>
                  </div>
                  {/* Active indicator removed per request */}
                </button>
              );
            })}
          </div>
          {field.helper && (
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-snug">{field.helper}</p>
          )}
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
      );

    case 'checkbox':
      return (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <div className="grid grid-cols-2 gap-2">
            {field.options.map((option: string, index: number) => (
              <label key={index} className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  name={field.name}
                  value={option}
                  checked={(value || []).includes(option)}
                  onChange={(e) => {
                    const currentValues = value || [];
                    if (e.target.checked) {
                      onChange([...currentValues, option]);
                    } else {
                      onChange(currentValues.filter((v: string) => v !== option));
                    }
                  }}
                  className="w-4 h-4 text-primary focus:ring-primary border-gray-300"
                />
                <span className="text-sm text-gray-900 dark:text-white leading-snug break-words whitespace-normal" style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>{option}</span>
              </label>
            ))}
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
      );

    case 'adventure_selector':
      return (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <div className="grid gap-4 min-[426px]:gap-5 min-[426px]:grid-cols-[repeat(auto-fit,minmax(220px,220px))] min-[426px]:justify-start min-[426px]:items-stretch">
            {field.options.map((option: any, index: number) => {
              const IconComponent = adventureIconMap[option.icon] || Heart;
              const isSelected = value === option.title;
              
              return (
                <div
                  key={index}
                  onClick={() => onChange(isSelected ? '' : option.title)}
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all hover:shadow-lg h-full flex flex-col ${
                    isSelected
                      ? 'border-primary bg-primary/5 dark:bg-primary/10'
                      : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
                  }`}
                >
                  <div className="text-center space-y-3">
                    <div className={`w-12 h-12 mx-auto rounded-xl flex items-center justify-center ${
                      isSelected ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                    }`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white"
                      style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >{option.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400"
                      style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >{option.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
      );

    case 'select':
      return (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <StyledSelect
            name={field.name}
            value={value || ''}
            onChange={onChange}
            options={field.options?.map((option: any) => option.label || option) || []}
            placeholder={field.placeholder || 'Select an option'}
            required={field.required}
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
      );

    case 'select_box':
      // Detect related custom text field (pattern: custom_<field.name> or custom_* in same step)
  const customFieldNameCandidates = [
        `custom_${field.name}`,
        field.name === 'primary_style' ? 'custom_style' : null,
        field.name === 'mood' ? 'custom_mood' : null,
        field.name === 'lyric_focus' ? 'custom_focus' : null,
        field.name === 'occasion' ? 'custom_occasion' : null
      ].filter(Boolean) as string[];

      let relatedCustomField: any = null;
      if ((field as any).parentStepFields) {
        relatedCustomField = (field as any).parentStepFields.find((f: any) => customFieldNameCandidates.includes(f.name));
      }

      const showRelatedCustom = relatedCustomField && relatedCustomField.conditional && formValues && formValues[relatedCustomField.conditional.field] === relatedCustomField.conditional.value;

      return (
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <SelectBox
            name={field.name}
            value={value || ''}
            onChange={onChange}
            options={field.options || []}
            required={field.required}
            belowContent={showRelatedCustom && relatedCustomField ? (
              <div className="mt-2">
                <input
                  type="text"
                  name={relatedCustomField.name}
                  placeholder={relatedCustomField.placeholder || 'Describe custom choice'}
                  value={formValues?.[relatedCustomField.name] || ''}
                  onChange={(e) => field._updateFormValue && field._updateFormValue(relatedCustomField.name, e.target.value)}
                  required aria-required="true"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                />
              </div>
            ) : null}
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
      );

    case 'range':
      const currentValue = value || field.default || field.min || 0;
      
      return (
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          
          {/* Visual preview of the text size */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
            <p 
              className="text-gray-900 dark:text-white transition-all duration-200"
              style={{ fontSize: `${currentValue}px` }}
            >
              Sample Text
            </p>
          </div>
          
          {/* Range slider */}
          <div className="relative">
            <input
              type="range"
              name={field.name}
              min={field.min || 10}
              max={field.max || 24}
              value={currentValue}
              onChange={(e) => onChange(parseInt(e.target.value))}
              onBlur={(e) => onBlur?.(field.name, parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              required={field.required}
            />
            
            {/* Value display */}
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
              <span>{field.min || 10}px</span>
              <span className="font-medium text-primary dark:text-primary-light">
                {currentValue}px
              </span>
              <span>{field.max || 24}px</span>
            </div>
          </div>
          
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
      );

    case 'file':
      const [isDragOver, setIsDragOver] = React.useState(false);
  const [audioMeta, setAudioMeta] = React.useState<{ name: string; duration: number }[] | null>(null);
      
      const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
      };
      
      const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
      };
      
      const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        
        let files = Array.from(e.dataTransfer.files);
        if (field.multiple === false && files.length > 1) {
          files = [files[0]]; // enforce single file
        }
        if (files.length > 0) {
          onChange(files);
          console.log('Files dropped:', files.map(f => f.name));
          // If audio, extract duration metadata
          if (files[0] && files[0].type.startsWith('audio/')) {
            Promise.all(files.map(f =>
              new Promise<{ name: string; duration: number }>((resolve) => {
                const el = document.createElement('audio');
                el.preload = 'metadata';
                el.onloadedmetadata = () => {
                  resolve({ name: f.name, duration: el.duration });
                };
                el.src = URL.createObjectURL(f);
              })
            )).then(setAudioMeta).catch(() => setAudioMeta(null));
          } else {
            setAudioMeta(null);
          }
        }
      };
      
      return (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <div 
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              isDragOver 
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                : 'border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {isDragOver ? 'Drop files here' : 'Click to upload or drag and drop'}
            </p>
            <input
              type="file"
              name={field.name}
              onChange={(e) => {
                const files = e.target.files;
                if (files && files.length > 0) {
                  let fileArray = Array.from(files);
                  if (field.multiple === false) {
                    fileArray = [fileArray[0]];
                  }
                  onChange(fileArray);
                  console.log('Files selected:', fileArray.map(f => f.name));
                  if (fileArray[0] && fileArray[0].type.startsWith('audio/')) {
                    Promise.all(fileArray.map(f =>
                      new Promise<{ name: string; duration: number }>((resolve) => {
                        const el = document.createElement('audio');
                        el.preload = 'metadata';
                        el.onloadedmetadata = () => resolve({ name: f.name, duration: el.duration });
                        el.src = URL.createObjectURL(f);
                      })
                    )).then(setAudioMeta).catch(() => setAudioMeta(null));
                  } else {
                    setAudioMeta(null);
                  }
                } else {
                  onChange(null);
                  setAudioMeta(null);
                }
              }}
              className="hidden"
              id={field.name}
              multiple={field.multiple !== false}
              accept={field.accept || 'image/*,audio/*'}
            />
            <label
              htmlFor={field.name}
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors cursor-pointer"
            >
              Choose Files
            </label>
            {value && value.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Selected files ({value.length}):
                </p>
                <div className="space-y-1">
                  {value.map((file: File, index: number) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded p-2">
                      <span className="text-sm text-gray-600 dark:text-gray-300 truncate">
                        {file.name}
                      </span>
                      <span className="text-xs text-gray-400">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </div>
                  ))}
                  {audioMeta && audioMeta.length > 0 && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 pt-1">
                      {audioMeta.map(m => (
                        <div key={m.name}>
                          {m.name}: {(m.duration || 0).toFixed(1)}s
                        </div>
                      ))}
                      <div className="italic">Consigliato: 60–120s</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
      );

    default:
      console.warn('Unsupported form field type encountered', { field });
      return (
        <div className="p-4 bg-amber-50 dark:bg-gray-800 border border-amber-200 dark:border-gray-700 rounded-lg">
          <p className="text-xs text-amber-700 dark:text-amber-300 font-medium">Unsupported field type: {String(field?.type || 'undefined')}</p>
        </div>
      );
  }
}

interface DynamicFormStepProps {
  step: any;
  formValues: Record<string, any>;
  updateFormValue: (name: string, value: any) => void;
  errors?: Record<string, string>;
}

export function DynamicFormStep({ step, formValues, updateFormValue, errors = {} }: DynamicFormStepProps) {
  const RawIconComponent = stepIconMap[step.icon] || Heart;
  const StepIcon: React.FC<{ className?: string }> = ({ className }) => {
    try {
      if (process.env.NODE_ENV !== 'production') {
        console.debug('🎨 StepIcon render attempt', { iconKey: step.icon, resolved: !!stepIconMap[step.icon], component: RawIconComponent?.name });
      }
      if (!RawIconComponent) {
        return <span className={className}>?</span>;
      }
      return <RawIconComponent className={className} />;
    } catch (e) {
      console.warn('Step icon render failed, falling back to Heart', { icon: step.icon, error: e });
      return <Heart className={className} />;
    }
  };
  const { trackFormInputBlur } = useTracking();

  const handleBlur = (fieldName: string, value: any) => {
    trackFormInputBlur(fieldName, value);
  };

  // Debug step information
  console.log('📋 STEP RENDER DEBUG:', {
    stepId: step.id,
    stepTitle: step.title,
    fieldsCount: step.fields.length,
    fieldNames: step.fields.map((f: any) => f.name),
    hasCustomPurpose: step.fields.some((f: any) => f.name === 'custom_purpose'),
    currentFormValues: formValues
  });

  return (
    <div className="space-y-8">
      {/* Step Header */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto bg-primary/10 dark:bg-primary/20 rounded-2xl flex items-center justify-center">
          <StepIcon className="w-8 h-8 text-primary dark:text-primary-light" />
        </div>
        <div>
          <h2 className="font-bold text-gray-900 dark:text-white mb-2 text-[clamp(1.4rem,1.05rem+1.2vw,2.15rem)] leading-tight">
            {step.title}
          </h2>
          {step.subtitle && (
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
              {step.subtitle}
            </p>
          )}
          {step.description && (
            <p className="text-gray-600 dark:text-gray-400">
              {step.description}
            </p>
          )}
        </div>
      </div>

  {/* Step Fields */}
  <div className="space-y-6 min-[426px]:space-y-0 min-[426px]:grid min-[426px]:gap-6 min-[426px]:grid-cols-[repeat(auto-fit,minmax(300px,300px))] min-[426px]:justify-start min-[426px]:w-full mx-auto">
        {step.fields.map((field: any, index: number) => {
          // Enrich field with parentStepFields and updater for nested custom handling
          field.parentStepFields = step.fields;
          field._updateFormValue = updateFormValue;
          // Special handling for custom_purpose field to debug the issue
          if (field.name === 'custom_purpose') {
            console.log('🔍 CUSTOM PURPOSE FIELD DEBUG:', {
              fieldName: field.name,
              hasConditional: !!field.conditional,
              conditional: field.conditional,
              currentPurposeValue: formValues['purpose'],
              allFormValues: formValues,
              shouldShow: formValues['purpose'] === field.conditional?.value
            });
          }
          
          // Check if field has conditional logic
          if (field.conditional) {
            const conditionField = field.conditional.field;
            const conditionValue = field.conditional.value;
            const currentValue = formValues[conditionField];
            
            // Debug logging for conditional fields
            if (field.name === 'custom_purpose') {
              console.log('🎯 CONDITIONAL LOGIC:', {
                conditionField,
                conditionValue,
                currentValue,
                isMatch: currentValue === conditionValue,
                willShow: currentValue === conditionValue
              });
            }
            
            // Only show field if condition is met
            if (currentValue !== conditionValue) {
              if (field.name === 'custom_purpose') {
                console.log('❌ HIDING custom_purpose - condition not met');
              }
              return null;
            }
            
            if (field.name === 'custom_purpose') {
              console.log('✅ SHOWING custom_purpose - condition met');
            }
          }
          
          return (
            <div key={`${field.name}-${index}`} className="w-full">
              <DynamicFormField
                field={field}
                value={formValues[field.name]}
                onChange={(value) => {
                  updateFormValue(field.name, value);
                  const clearingRules: Record<string, { sentinels: string[]; customField: string }> = {
                    purpose: { sentinels: ['Custom Purpose', 'Autre usage', 'Finalità personalizzata', 'غرض مخصص'], customField: 'custom_purpose' },
                    primary_style: { sentinels: ['Custom Style'], customField: 'custom_style' },
                    mood: { sentinels: ['Custom Mood'], customField: 'custom_mood' },
                    lyric_focus: { sentinels: ['Custom Focus'], customField: 'custom_focus' },
                    occasion: { sentinels: ['Custom...'], customField: 'custom_occasion' }
                  };
                  if (clearingRules[field.name]) {
                    const { sentinels, customField } = clearingRules[field.name];
                    if (!sentinels.includes(value)) {
                      updateFormValue(customField, '');
                    }
                  }
                }}
                onBlur={handleBlur}
                error={errors[field.name]}
              />
            </div>
          );
        })}
      </div>

      {/* Repeatable Group */}
      {step.repeatable_group && (
        <div className="space-y-6">
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {step.repeatable_group.label}
            </h3>
            
            {/* Render existing group instances */}
            {(formValues[step.repeatable_group.name] || []).map((groupInstance: any, groupIndex: number) => (
              <div key={groupIndex} className="p-6 border border-gray-200 dark:border-gray-700 rounded-xl space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {step.repeatable_group.label} {groupIndex + 1}
                  </h4>
                  {groupIndex >= step.repeatable_group.min && (
                    <button
                      onClick={() => {
                        const currentGroups = formValues[step.repeatable_group.name] || [];
                        const updatedGroups = currentGroups.filter((_: any, i: number) => i !== groupIndex);
                        updateFormValue(step.repeatable_group.name, updatedGroups);
                      }}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>
                
                {step.repeatable_group.fields.map((field: any, fieldIndex: number) => (
                  <DynamicFormField
                    key={fieldIndex}
                    field={field}
                    value={groupInstance[field.name]}
                    onChange={(value) => {
                      const currentGroups = formValues[step.repeatable_group.name] || [];
                      const updatedGroups = [...currentGroups];
                      updatedGroups[groupIndex] = {
                        ...updatedGroups[groupIndex],
                        [field.name]: value
                      };
                      updateFormValue(step.repeatable_group.name, updatedGroups);
                    }}
                    onBlur={(fieldName, value) => handleBlur(`${step.repeatable_group.name}.${groupIndex}.${fieldName}`, value)}
                    error={errors[`${step.repeatable_group.name}.${groupIndex}.${field.name}`]}
                  />
                ))}
              </div>
            ))}
            
            {/* Add new group button */}
            <button
              onClick={() => {
                const currentGroups = formValues[step.repeatable_group.name] || [];
                const newGroup = {};
                updateFormValue(step.repeatable_group.name, [...currentGroups, newGroup]);
              }}
              className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-gray-600 dark:text-gray-400 hover:border-primary hover:text-primary transition-colors"
            >
              + Add {step.repeatable_group.label}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
