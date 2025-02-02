"use client";
// src/hooks/usePageViewTracker.ts
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function usePageViewTracker() {
  const pathname = usePathname();
    
  useEffect(() => {
    const sendPageView = async () => {
      const metaDescription =
        document.querySelector('meta[name="description"]')?.getAttribute('content') || '';

      const data = {
        documentCharacterSet: document.characterSet,
        description: metaDescription,
        navigatorLanguage: navigator.language,
        screenColorDepth: screen.colorDepth,
        screenWidth: screen.width,
        screenHeight: screen.height,
        windowInnerWidth: window.innerWidth,
        windowInnerHeight: window.innerHeight,
        documentTitle: document.title,
        documentURL: window.location.href,
        navigatorUserAgent: navigator.userAgent,
        navigatorPlatform: navigator.platform,
        locationHost: window.location.host,
        locationPathname: window.location.pathname,
        documentReferrer: document.referrer,
      };

      try {
        await fetch('/api/log', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
      } catch (error) {
        console.error('Error sending page view:', error);
      }
    };

    sendPageView();
  }, [pathname]);
}
