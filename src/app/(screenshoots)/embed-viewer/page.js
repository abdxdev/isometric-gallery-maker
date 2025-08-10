"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import { SidebarPortal } from "@/components/sidebar-portal";
import { EmbedControls } from "@/components/sidebars/embed-controls";
import { MoveDiagonal2 } from "lucide-react";
import devicesJson from "@/lib/device-elements.json";
import { DeviceOverlays, collectAssets } from "@/components/device-overlays";

function safeUrl(u) {
  if (!u) return "";
  try { return new URL(u).href; } catch { return "https://" + u; }
}

export default function Page() {
  const iframeRef = useRef(null);

  const [url, setUrl] = useState("https://example.com");
  const [dimentions, setDimentions] = useState({ w: 1024, h: 768 });

  const [device, setDevice] = useState();
  const [selections, setSelections] = useState({});
  const [toggles, setToggles] = useState({});

  // New: background color for the device container
  const [backgroundColor, setBackgroundColor] = useState("rgba(249, 250, 251, 1)");

  const [isResizing, setIsResizing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [startSize, setStartSize] = useState({ w: 1024, h: 768 });

  useEffect(() => {
    function onMouseMove(e) {
      if (!isResizing) return;
      const dx = e.clientX - startPos.x;
      const dy = e.clientY - startPos.y;
      setDimentions({
        w: Math.max(200, Math.round(startSize.w + dx)),
        h: Math.max(200, Math.round(startSize.h + dy))
      });
    }
    function onMouseUp() { setIsResizing(false); }
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [isResizing, startPos, startSize]);

  function startResize(e) {
    setIsResizing(true);
    setStartPos({ x: e.clientX, y: e.clientY });
    setStartSize(dimentions);
  }

  const MAX_SIZE = 1500;
  const viewW = Math.min(dimentions.w, MAX_SIZE);
  const viewH = Math.min(dimentions.h, MAX_SIZE);

  const assets = useMemo(() => collectAssets(devicesJson, device || devicesJson[0]?.name, selections, toggles), [device, selections, toggles]);

  return (
    <>
      <SidebarPortal>
        <EmbedControls
          url={url}
          setUrl={setUrl}
          dimentions={dimentions}
          setDimentions={setDimentions}
          device={device}
          setDevice={setDevice}
          selections={selections}
          setSelections={setSelections}
          toggles={toggles}
          setToggles={setToggles}
          backgroundColor={backgroundColor}
          setBackgroundColor={setBackgroundColor}
        />
      </SidebarPortal>

      <div className="w-full h-full relative">
        <div className="w-full h-full overflow-x-auto overflow-y-auto flex items-center justify-center">
          {/* Fixed-size device box */}
          <div className="relative" style={{ width: viewW + "px", height: viewH + "px" }}>
            <div className="relative flex flex-col w-full h-full" style={{ backgroundColor }}>
              {/* Top stacked bars */}
              {assets.flowTop.map((a, idx) => (
                <img key={`top-${idx}`} src={a.src} alt={a.alt} className="block w-full h-auto select-none pointer-events-none" />
              ))}

              {/* Iframe fills remaining space */}
              <div className="relative flex-1 min-h-0">
                <iframe
                  ref={iframeRef}
                  title="embed-preview"
                  src={safeUrl(url)}
                  sandbox="allow-forms allow-scripts allow-same-origin allow-popups"
                  className="absolute inset-0 w-full h-full z-0"
                />
                {/* Absolute overlays */}
              </div>
                <div className="pointer-events-none absolute inset-0 z-10">
                  <DeviceOverlays devices={devicesJson} device={device || devicesJson[0]?.name} selections={selections} toggles={toggles} />
                </div>

              {/* Bottom stacked bars */}
              {assets.flowBottom.map((a, idx) => (
                <img key={`bottom-${idx}`} src={a.src} alt={a.alt} className="block w-full h-auto select-none pointer-events-none" />
              ))}
            </div>

            {/* Resize handle */}
            <div onMouseDown={startResize} className="absolute right-0 bottom-0 w-4 h-4 cursor-se-resize" style={{ background: "transparent" }} aria-hidden>
              <MoveDiagonal2 className="w-4 h-4 text-gray-500" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
