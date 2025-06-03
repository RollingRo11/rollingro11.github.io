"use client";

import { useEffect } from 'react';
import { useTheme } from 'next-themes';

export function ThemeMetaUpdater() {
  const { theme, resolvedTheme } = useTheme();

  useEffect(() => {
    const updateThemeColor = () => {
      // Check both next-themes resolved theme and manual class
      const isDarkFromTheme = resolvedTheme === 'dark';
      const isDarkFromClass = document.documentElement.classList.contains('dark');
      const isDark = isDarkFromTheme || isDarkFromClass;
      
      const color = isDark ? '#0a1a12' : '#f5f0e6';
      
      // Update or create theme-color meta tag
      let themeColorMeta = document.querySelector('meta[name="theme-color"]');
      if (!themeColorMeta) {
        themeColorMeta = document.createElement('meta');
        themeColorMeta.setAttribute('name', 'theme-color');
        document.head.appendChild(themeColorMeta);
      }
      themeColorMeta.setAttribute('content', color);

      // Also update the status bar style for iOS
      let statusBarMeta = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
      if (!statusBarMeta) {
        statusBarMeta = document.createElement('meta');
        statusBarMeta.setAttribute('name', 'apple-mobile-web-app-status-bar-style');
        document.head.appendChild(statusBarMeta);
      }
      statusBarMeta.setAttribute('content', isDark ? 'black-translucent' : 'default');
    };

    // Update immediately
    updateThemeColor();

    // Watch for manual class changes on documentElement
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          updateThemeColor();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, [resolvedTheme]);

  return null;
}