import { useEffect } from 'react';

// Declare gtag function for TypeScript
declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: any) => void;
  }
}

// Track section views when they come into viewport
export const useSectionTracking = (sectionName: string, elementRef: React.RefObject<HTMLElement | null>) => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            // Track section view with Google Analytics
            if (typeof window.gtag === 'function') {
              window.gtag('event', 'section_view', {
                event_category: 'engagement',
                event_label: sectionName,
                value: 1
              });
            }
          }
        });
      },
      {
        threshold: 0.5, // Trigger when 50% of section is visible
        rootMargin: '0px'
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [sectionName, elementRef]);
};

// Track custom events (like Unity game starts, project clicks, etc.)
export const trackEvent = (eventName: string, eventCategory: string = 'engagement', eventLabel?: string) => {
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, {
      event_category: eventCategory,
      event_label: eventLabel,
      value: 1
    });
  }
  
  console.log(`Event tracked: ${eventName}`, { category: eventCategory, label: eventLabel });
};

// Track page views
export const trackPageView = (pageName: string) => {
  if (typeof window.gtag === 'function') {
    window.gtag('config', 'G-DLP6589RB0', {
      page_title: pageName,
      page_location: window.location.href
    });
  }
};