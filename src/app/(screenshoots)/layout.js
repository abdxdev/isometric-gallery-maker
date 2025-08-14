"use client";

import { useRef, useEffect } from "react";
import { FullscreenToggle } from "@/components/fullscreen-toggle";
import { useFullscreen } from "@/hooks/useFullscreen";

export default function ScreenshootsLayout({ children }) {

  const mainContent = useRef();

  const { isFullscreen, toggleFullscreen } = useFullscreen(mainContent);

  // Listen for header-triggered fullscreen toggle
  useEffect(() => {
    const handler = () => { toggleFullscreen(); };
    window.addEventListener("toggle-fullscreen", handler);
    return () => window.removeEventListener("toggle-fullscreen", handler);
  }, [toggleFullscreen]);

  const content = (
    <div
      className="flex flex-col md:flex-row flex-1 h-full w-full overflow-auto md:overflow-hidden"
      data-slot="screenshoots-layout-root"
    >
      <div
        ref={mainContent}
        className={`min-w-0 md:flex-1 md:h-full ${isFullscreen ? 'h-full' : 'h-[60dvh]'} shrink-0 overflow-hidden md:overflow-auto`}
      >
        <FullscreenToggle isFullscreen={isFullscreen} onToggleFullscreen={toggleFullscreen} />
        {children}
      </div>

      <div className={`${isFullscreen ? 'hidden' : 'block'} w-full md:w-auto md:h-full md:overflow-hidden`}>
        <div className="w-full md:w-86 flex flex-col p-4 h-auto md:h-full min-h-0 overflow-visible md:overflow-y-auto overscroll-contain border-t md:border-l md:border-t-0">
          <div id="screenshoots-sidebar-slot" />
        </div>
      </div>
    </div>
  );

  return content;
}
