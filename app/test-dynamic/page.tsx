"use client";

import { useEffect, useState } from "react";
import { useUrlId } from "../../hooks/useUrlIdStatic";
import { useStaticContent } from "../../hooks/useStaticContent";
import { DynamicSectionRenderer } from "@/components/DynamicSectionRenderer";

function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Loading content...</p>
      </div>
    </div>
  );
}

function DynamicTestContent() {
  const { id, navigateWithId, mounted } = useUrlId();
  const { getContent, loading: contentLoading, error: contentError } = useStaticContent();
  
  const data = getContent(id || 'BT1');

  const handleStartCustomizing = () => {
    navigateWithId('/customize');
  };

  if (contentLoading || !mounted) {
    return <LoadingSpinner />;
  }

  if (contentError || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Error Loading Content
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {contentError || "No data available"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-blue-100 dark:bg-blue-900 p-6">
        <h1 className="text-2xl font-bold mb-4">🧪 Dynamic Content Test Page</h1>
        <p className="mb-2"><strong>Content ID:</strong> {id || 'BT1'}</p>
        <p className="mb-2"><strong>Total Data Keys:</strong> {Object.keys(data).length}</p>
        <p className="mb-4">
          <strong>Available Keys:</strong> {Object.keys(data).join(', ')}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h3 className="font-bold mb-2">Raw JSON Structure:</h3>
            <pre className="bg-white dark:bg-gray-800 p-3 rounded overflow-auto max-h-40">
              {JSON.stringify(Object.keys(data).reduce((acc: any, key) => {
                if (key === 'homepage' && data[key] && typeof data[key] === 'object') {
                  acc[key] = `[Object with ${Object.keys(data[key] as object).length} keys]`;
                } else {
                  acc[key] = typeof data[key] === 'object' ? '[Object]' : data[key];
                }
                return acc;
              }, {}), null, 2)}
            </pre>
          </div>
          <div>
            <h3 className="font-bold mb-2">Section Details:</h3>
            <div className="bg-white dark:bg-gray-800 p-3 rounded overflow-auto max-h-40">
              {Object.keys(data).map(key => (
                <div key={key} className="mb-1">
                  <strong>{key}:</strong> {Array.isArray(data[key]) ? `Array[${data[key].length}]` : typeof data[key]}
                  {key === 'homepage' && data[key] && typeof data[key] === 'object' && (
                    <div className="ml-4 text-xs text-gray-600">
                      Contains: {Object.keys(data[key] as object).join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <DynamicSectionRenderer 
        data={data} 
        onStartCustomizing={handleStartCustomizing} 
        debug={true}
      />
    </div>
  );
}

export default function DynamicTestPage() {
  return <DynamicTestContent />;
}
