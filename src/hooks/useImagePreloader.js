import { useState, useEffect } from 'react';

export function useImagePreloader(imageSources = []) {
  const [loadedImages, setLoadedImages] = useState(new Set());
  const [allImagesLoaded, setAllImagesLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    if (imageSources.length === 0) {
      setAllImagesLoaded(true);
      setLoadingProgress(100);
      return;
    }

    setLoadedImages(new Set());
    setAllImagesLoaded(false);
    setLoadingProgress(0);

    const imagePromises = imageSources.map((src) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          setLoadedImages(prev => {
            const newSet = new Set(prev);
            newSet.add(src);
            const progress = (newSet.size / imageSources.length) * 100;
            setLoadingProgress(progress);
            
            if (newSet.size === imageSources.length) {
              setAllImagesLoaded(true);
            }
            
            return newSet;
          });
          resolve(img);
        };
        img.onerror = reject;
        img.src = src;
      });
    });

    Promise.allSettled(imagePromises).then(() => {
      setAllImagesLoaded(true);
    });

  }, [imageSources]);

  return {
    loadedImages,
    allImagesLoaded,
    loadingProgress,
  };
}

export function preloadImages(imageSources) {
  return Promise.allSettled(
    imageSources.map(src => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        
        // Set up timeout for individual images
        const timeout = setTimeout(() => {
          reject(new Error(`Image load timeout: ${src}`));
        }, 8000); // 8 second timeout per image
        
        img.onload = () => {
          clearTimeout(timeout);
          resolve(img);
        };
        
        img.onerror = () => {
          clearTimeout(timeout);
          reject(new Error(`Failed to load image: ${src}`));
        };
        
        // Set crossOrigin to handle CORS if needed
        img.crossOrigin = "anonymous";
        img.src = src;
      });
    })
  );
}
