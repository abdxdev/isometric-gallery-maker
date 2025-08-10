"use client";

import { useRef } from "react";
import { FullscreenToggle } from "@/components/fullscreen-toggle";
import { useFullscreen } from "@/hooks/useFullscreen";
import { ControlSidebar } from "@/components/control-sidebar";

export default function ScreenshootsLayout({ children }) {

  const galleryContainerRef = useRef();

  const { isFullscreen, toggleFullscreen } = useFullscreen(galleryContainerRef);


  const content = (
    <div className="flex flex-col lg:flex-row">
      {/* Main Area for children */}
      <div className="flex-1 order-1 lg:order-1">
        <div
          ref={galleryContainerRef}
          className={`z-10 overflow-hidden relative ${isFullscreen
            ? "h-screen w-screen fixed top-0 left-0"
            : "sticky top-14 h-[60vh] lg:h-[calc(100vh-3.5rem)]"}
            `}
        >
          <div className="w-full h-full">
            {children}
          </div>

          <FullscreenToggle isFullscreen={isFullscreen} onToggleFullscreen={toggleFullscreen} />
        </div>
      </div>

      {/* Common Sidebar Shell with a slot for per-page controls */}
      {!isFullscreen && (
        <div className="order-2 lg:order-2">
          <ControlSidebar>
            <div id="screenshoots-sidebar-slot" />
          </ControlSidebar>
        </div>
      )}
    </div>
  );

  return content;
}
