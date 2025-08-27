'use client';

import { useState, useEffect, Suspense } from 'react';
import { useUrlId } from '../../hooks/useUrlIdStatic';
import { useStaticContent } from '../../hooks/useStaticContent';

// Loading component
function LoadingSpinner() {
  return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
}

// Main debug sheets content
function DebugSheetsContent() {
  const { id: currentId, mounted } = useUrlId();
  const { getContent, loading } = useStaticContent();
  const [debugInfo, setDebugInfo] = useState<any>(null);

  useEffect(() => {
    if (mounted && !loading) {
      const id = currentId || 'BT1';
      const content = getContent(id);
      setDebugInfo({
        currentId: id,
        contentAvailable: !!content,
        contentKeys: content ? Object.keys(content) : [],
        mounted,
        timestamp: new Date().toISOString()
      });
    }
  }, [mounted, loading, currentId, getContent]);

  if (!mounted || loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Debug Sheets Information</h1>
        
        <div className="bg-white rounded-lg p-6 shadow">
          <h2 className="text-xl font-semibold mb-4">Debug Information</h2>
          <pre className="text-sm bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}

// Export with Suspense wrapper for static export compatibility
export default function DebugSheetsPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <DebugSheetsContent />
    </Suspense>
  );
}
