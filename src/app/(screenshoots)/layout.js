"use client";

import { useRef, useEffect } from "react";
import { FullscreenToggle } from "@/components/fullscreen-toggle";
import { useFullscreen } from "@/hooks/useFullscreen";
import { ControlSidebar } from "@/components/control-sidebar";

export default function ScreenshootsLayout({ children }) {

  const mainContent = useRef();

  const { isFullscreen, toggleFullscreen } = useFullscreen(mainContent);

  // Listen for header-triggered fullscreen toggle
  useEffect(() => {
    const handler = () => { toggleFullscreen(); };
    window.addEventListener("screenshoots:toggle-fullscreen", handler);
    return () => window.removeEventListener("screenshoots:toggle-fullscreen", handler);
  }, [toggleFullscreen]);

  const content = (
    <div
      className="flex flex-col md:flex-row md:flex-1 min-h-0 min-w-0 w-full overflow-auto md:overflow-hidden"
      data-slot="screenshoots-layout-root"
    >
      <div
        ref={mainContent}
        className="flex-none h-[60vh] md:h-full min-w-0 overflow-scroll md:flex-1 md:min-h-0 md:overflow-auto overscroll-contain"
      >
        <FullscreenToggle isFullscreen={isFullscreen} onToggleFullscreen={toggleFullscreen} />
        {children}
      </div>

      <div className={`${!isFullscreen ? "block" : "hidden"} flex-none md:h-full overflow-visible md:overflow-hidden`}>
        <ControlSidebar>
          <div id="screenshoots-sidebar-slot" />
        </ControlSidebar>
      </div>
    </div>
  );

  return content;
}
