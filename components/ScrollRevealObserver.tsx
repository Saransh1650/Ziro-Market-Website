'use client';

import { useEffect } from 'react';

/**
 * Global observer that adds the 'revealed' class to elements with [data-reveal]
 * when they enter the viewport.
 */
export default function ScrollRevealObserver() {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    };

    const revealCallback: IntersectionObserverCallback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          // Once revealed, we can stop observing this specific element
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(revealCallback, observerOptions);

    // Initial scan and setup
    const updateObserver = () => {
      const revealElements = document.querySelectorAll('[data-reveal]:not(.revealed)');
      revealElements.forEach((el) => observer.observe(el));
    };

    updateObserver();

    // Since Next.js uses client-side navigation, we should re-scan on DOM mutations
    // if components are added dynamically.
    const mutationObserver = new MutationObserver(() => {
      updateObserver();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return null; // This component doesn't render anything
}
