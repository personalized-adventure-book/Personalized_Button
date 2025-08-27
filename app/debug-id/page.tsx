'use client';

import { useUrlId } from '../../hooks/useUrlIdStatic';
import { useStaticContent } from '../../hooks/useStaticContent';
import { useEffect, useState, Suspense } from 'react';

// Loading component
function LoadingSpinner() {
  return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
}

// Main debug content
function DebugPageContent() {
  const { id: urlIdHook, mounted } = useUrlId();
  const { getContent, loading, error } = useStaticContent();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (mounted && !loading && urlIdHook) {
      const contentData = getContent(urlIdHook);
      setData(contentData);
    }
  }, [mounted, loading, urlIdHook, getContent]);

  if (!mounted || loading) {
    return <LoadingSpinner />;
  }

  const windowSearchId = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('id') : null;
  const sessionStorageId = typeof window !== 'undefined' ? sessionStorage.getItem('current-id') : null;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">ID Debug Information</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ID Sources */}
          <div className="bg-white rounded-lg p-6 shadow">
            <h2 className="text-xl font-semibold mb-4">ID Sources</h2>
            <div className="space-y-3">
              <div>
                <span className="font-medium">Window Location Search:</span>
                <span className={`ml-2 px-2 py-1 rounded text-sm ${windowSearchId ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}>
                  {windowSearchId || 'null'}
                </span>
              </div>
              <div>
                <span className="font-medium">useUrlId Hook Result:</span>
                <span className={`ml-2 px-2 py-1 rounded text-sm ${urlIdHook ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}>
                  {urlIdHook || 'null'}
                </span>
              </div>
              <div>
                <span className="font-medium">Session Storage:</span>
                <span className={`ml-2 px-2 py-1 rounded text-sm ${sessionStorageId ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-500'}`}>
                  {sessionStorageId || 'null'}
                </span>
              </div>
            </div>
          </div>

          {/* Dynamic Content Status */}
          <div className="bg-white rounded-lg p-6 shadow">
            <h2 className="text-xl font-semibold mb-4">Dynamic Content Status</h2>
            <div className="space-y-3">
              <div>
                <span className="font-medium">Loading:</span>
                <span className={`ml-2 px-2 py-1 rounded text-sm ${loading ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-500'}`}>
                  {loading.toString()}
                </span>
              </div>
              <div>
                <span className="font-medium">Error:</span>
                <span className={`ml-2 px-2 py-1 rounded text-sm ${error ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-500'}`}>
                  {error || 'null'}
                </span>
              </div>
              <div>
                <span className="font-medium">Data Available:</span>
                <span className={`ml-2 px-2 py-1 rounded text-sm ${data ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}>
                  {data ? 'Yes' : 'No'}
                </span>
              </div>
              {data && (
                <div>
                  <span className="font-medium">Content Language/Type:</span>
                  <span className="ml-2 px-2 py-1 rounded text-sm bg-blue-100 text-blue-800">
                    {data.hero?.headline || 'Unknown'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Cache Information */}
          <div className="bg-white rounded-lg p-6 shadow">
            <h2 className="text-xl font-semibold mb-4">Cache Information</h2>
            <div className="space-y-3">
              <div>
                <span className="font-medium">Current Window Cache Keys:</span>
                <div className="mt-2 space-y-1 text-sm">
                  {typeof window !== 'undefined' && Object.keys(window as any)
                    .filter(key => key.includes('homepageRowCache'))
                    .map(key => (
                      <div key={key} className="px-2 py-1 bg-gray-100 rounded">
                        {key}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>

          {/* Test Buttons */}
          <div className="bg-white rounded-lg p-6 shadow">
            <h2 className="text-xl font-semibold mb-4">Test Navigation</h2>
            <div className="space-y-3">
              <button 
                onClick={() => window.location.href = '?id=1'}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Load ID=1
              </button>
              <button 
                onClick={() => window.location.href = '?id=3'}
                className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Load ID=3
              </button>
              <button 
                onClick={() => {
                  sessionStorage.clear();
                  Object.keys(window as any)
                    .filter(key => key.includes('homepageRowCache'))
                    .forEach(key => delete (window as any)[key]);
                  window.location.reload();
                }}
                className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Clear All Cache & Reload
              </button>
            </div>
          </div>
        </div>

        {/* Raw Data */}
        {data && (
          <div className="mt-6 bg-white rounded-lg p-6 shadow">
            <h2 className="text-xl font-semibold mb-4">Raw Data Sample</h2>
            <pre className="text-xs bg-gray-100 p-4 rounded overflow-auto max-h-60">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

// Export with Suspense wrapper for static export compatibility
export default function DebugPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <DebugPageContent />
    </Suspense>
  );
}
