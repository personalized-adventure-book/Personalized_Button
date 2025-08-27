'use client';

import { usePathname } from 'next/navigation';
import { Footer } from './Footer';

export function ConditionalFooter() {
  const pathname = usePathname();
  
  // Hide footer on customize pages
  const hideFooter = pathname?.startsWith('/customize');
  
  if (hideFooter) {
    return null;
  }
  
  return <Footer />;
}
