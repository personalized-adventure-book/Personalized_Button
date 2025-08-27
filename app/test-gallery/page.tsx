'use client';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { useState, useEffect, Suspense } from 'react';

function TestGalleryContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id') || 'BT1';
  const [imageManifest, setImageManifest] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Extract language from ID (BT1=en, BT2=fr, BT3=it, BT4=ar)
  const getLanguageFromId = (id: string): string => {
    const lastChar = id.slice(-1);
    switch (lastChar) {
      case '1': return 'en';
      case '2': return 'fr';
      case '3': return 'it';
      case '4': return 'ar';
      default: return 'en';
    }
  };

  // Extract product from ID (BT=Button, BR=Branding, BK=Book)
  const getProductFromId = (id: string): string => {
    const prefix = id.slice(0, 2);
    switch (prefix) {
      case 'BT': return 'Button';
      case 'BR': return 'Branding';
      case 'BK': return 'Book';
      default: return 'Button';
    }
  };

  const language = getLanguageFromId(id);
  const product = getProductFromId(id);

  useEffect(() => {
    fetch('/image-manifest.json')
      .then(res => res.json())
      .then(data => {
        setImageManifest(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load image manifest:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-8">Loading image manifest...</div>;
  }

  const galleryImages = imageManifest?.[product]?.gallery?.[language] || [];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Gallery Test System</h1>
      
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-2">Current Configuration</h2>
        <p><strong>ID:</strong> {id}</p>
        <p><strong>Product:</strong> {product}</p>
        <p><strong>Language:</strong> {language}</p>
        <p><strong>Images Found:</strong> {galleryImages.length}</p>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Test Different IDs:</h3>
        <div className="flex gap-2 flex-wrap">
          {['BT1', 'BT2', 'BT3', 'BT4'].map(testId => (
            <a
              key={testId}
              href={`?id=${testId}`}
              className={`px-4 py-2 rounded ${
                id === testId 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {testId} ({getLanguageFromId(testId)})
            </a>
          ))}
        </div>
      </div>

      {galleryImages.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {galleryImages.map((imageName: string, index: number) => {
            const imagePath = `/${product}/gallery/${language}/${imageName}`;
            return (
              <div key={index} className="border rounded-lg overflow-hidden">
                <Image
                  src={imagePath}
                  alt={`Gallery image ${index + 1}`}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    console.error(`Failed to load image: ${imagePath}`);
                  }}
                />
                <div className="p-2 text-sm text-gray-600">
                  {imageName}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No images found for {product} gallery in {language} language.
        </div>
      )}

      <div className="mt-8 bg-yellow-50 p-4 rounded-lg">
        <h4 className="font-semibold mb-2">Debug Information:</h4>
        <pre className="text-sm overflow-x-auto">
          {JSON.stringify({ 
            id, 
            product, 
            language, 
            galleryPath: `/${product}/gallery/${language}/`,
            availableImages: galleryImages,
            manifestStructure: imageManifest ? Object.keys(imageManifest) : 'No manifest'
          }, null, 2)}
        </pre>
      </div>
    </div>
  );
}

export default function TestGalleryPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <TestGalleryContent />
    </Suspense>
  );
}
