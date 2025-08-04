import { useState, useEffect, useCallback } from 'react';

export const useFullscreen = (targetElementRef = null) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  // Check if fullscreen API is available
  const isSupported = useCallback(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return false;
    }
    return !!(
      document.fullscreenEnabled ||
      document.webkitFullscreenEnabled ||
      document.mozFullScreenEnabled ||
      document.msFullscreenEnabled
    );
  }, []);
  // Enter fullscreen
  const enterFullscreen = useCallback(async () => {
    if (typeof window === 'undefined' || !isSupported()) {
      console.warn('Fullscreen API is not supported');
      return false;
    }

    // Safely access the target element
    const element = targetElementRef?.current || document.documentElement;    try {
      if (element.requestFullscreen) {
        await element.requestFullscreen();
      } else if (element.webkitRequestFullscreen) {
        await element.webkitRequestFullscreen();
      } else if (element.mozRequestFullScreen) {
        await element.mozRequestFullScreen();
      } else if (element.msRequestFullscreen) {
        await element.msRequestFullscreen();
      }
      return true;
    } catch (error) {
      console.error('Error entering fullscreen:', error);
      return false;
    }
  }, [targetElementRef, isSupported]);
  // Exit fullscreen
  const exitFullscreen = useCallback(async () => {
    if (typeof window === 'undefined' || !isSupported()) {
      console.warn('Fullscreen API is not supported');
      return false;
    }

    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        await document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        await document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        await document.msExitFullscreen();
      }
      return true;
    } catch (error) {
      console.error('Error exiting fullscreen:', error);
      return false;
    }
  }, [isSupported]);

  // Toggle fullscreen
  const toggleFullscreen = useCallback(async () => {
    if (isFullscreen) {
      return await exitFullscreen();
    } else {
      return await enterFullscreen();
    }
  }, [isFullscreen, enterFullscreen, exitFullscreen]);
  // Check current fullscreen state
  const checkFullscreenState = useCallback(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }
    
    const fullscreenElement = 
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement;
    
    setIsFullscreen(!!fullscreenElement);
  }, []);
  // Listen for fullscreen changes
  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    const events = [
      'fullscreenchange',
      'webkitfullscreenchange',
      'mozfullscreenchange',
      'msfullscreenchange'
    ];

    events.forEach(event => {
      document.addEventListener(event, checkFullscreenState);
    });

    // Initial check
    checkFullscreenState();

    // Cleanup
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, checkFullscreenState);
      });
    };
  }, [checkFullscreenState]);  // Handle Escape key to exit fullscreen
  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    const handleKeyDown = (event) => {
      // Handle Escape key to exit fullscreen
      if (event.key === 'Escape' && isFullscreen) {
        event.preventDefault();
        event.stopPropagation();
        exitFullscreen();
        return;
      }
    };

    // Use capture phase to handle events before other listeners
    document.addEventListener('keydown', handleKeyDown, true);

    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [isFullscreen, exitFullscreen]);

  return {
    isFullscreen,
    enterFullscreen,
    exitFullscreen,
    toggleFullscreen,
    isSupported: isSupported()
  };
};
