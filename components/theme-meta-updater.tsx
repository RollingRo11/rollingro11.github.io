"use client";

import { useEffect } from 'react';

export function ThemeMetaUpdater() {
  useEffect(() => {
    // Watch for manual class changes on documentElement
    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains('dark');
      const color = isDark ? '#0a1a12' : '#f5f0e6';
      
      // Update theme-color meta tag
      let themeColorMeta = document.querySelector('meta[name="theme-color"]');
      if (themeColorMeta) {
        themeColorMeta.setAttribute('content', color);
      }

      // Update status bar style for iOS
      let statusBarMeta = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
      if (statusBarMeta) {
        statusBarMeta.setAttribute('content', isDark ? 'black-translucent' : 'default');
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  return null;
}