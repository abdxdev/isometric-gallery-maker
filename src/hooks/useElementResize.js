import { useEffect, useRef, useCallback } from 'react';

export function useElementResize(callback, dependencies = []) {
  const elementRef = useRef();

  const stableCallback = useCallback(callback, dependencies);

  useEffect(() => {
    if (!elementRef.current) return;

    let timeoutId;
    
    const resizeObserver = new ResizeObserver(() => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(stableCallback, 100);
    });

    resizeObserver.observe(elementRef.current);
    
    // Initial call
    timeoutId = setTimeout(stableCallback, 100);

    return () => {
      clearTimeout(timeoutId);
      resizeObserver.disconnect();
    };
  }, [stableCallback]);

  return elementRef;
}

export function useImageLoad(callback, images = []) {
  const containerRef = useRef();

  useEffect(() => {
    if (!containerRef.current || images.length === 0) return;

    const imageElements = containerRef.current.querySelectorAll('img');
    if (imageElements.length === 0) return;

    let loadedCount = 0;
    const totalImages = imageElements.length;

    const handleLoad = () => {
      loadedCount++;
      if (loadedCount === totalImages) {
        setTimeout(callback, 50);
      }
    };

    imageElements.forEach(img => {
      if (img.complete) {
        handleLoad();
      } else {
        img.addEventListener('load', handleLoad);
      }
    });

    return () => {
      imageElements.forEach(img => {
        img.removeEventListener('load', handleLoad);
      });
    };
  }, [callback, images.length]);

  return containerRef;
}
