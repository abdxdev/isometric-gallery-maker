"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import { SidebarPortal } from "@/components/sidebar-portal";
import { EmbedControls } from "@/components/sidebars/embed-controls";
import devicesJson from "@/lib/device-elements.json";
import { DeviceOverlays, collectAssets } from "@/components/device-overlays";
import { generateJSXMeshGradient } from "meshgrad";

function safeUrl(u) {
  if (!u) return "";
  try { return new URL(u).href; } catch { return "https://" + u; }
}

export default function Page() {
  const iframeRef = useRef(null);
  const scrollAreaRef = useRef(null);
  const [available, setAvailable] = useState({ w: 0, h: 0 });

  const defaultDeviceName = devicesJson[0]?.name;
  const defaultDims = devicesJson[0]?.dimensions
    ? { w: devicesJson[0].dimensions.width, h: devicesJson[0].dimensions.height }
    : { w: 1024, h: 768 };

  const [url, setUrl] = useState("https://example.com");
  const [dimentions, setDimentions] = useState(defaultDims);

  const MAX_W = 1920;
  const MAX_H = 1080;
  const viewW = Math.min(dimentions.w, MAX_W);
  const viewH = Math.min(dimentions.h, MAX_H);

  const [device, setDevice] = useState(defaultDeviceName);
  const [selections, setSelections] = useState({});
  const [toggles, setToggles] = useState({});

  const [backgroundColor, setBackgroundColor] = useState("rgba(249, 250, 251, 1)");

  const [frame, setFrame] = useState({
    borderColor: "rgba(3, 7, 18, 0.12)",
    borderThickness: 10,
    borderRadius: 16,
  });

  const [gradient, setGradient] = useState({ opacity: 0.75, key: 0 });
  const [gradientStyle, setGradientStyle] = useState({});
  useEffect(() => {
    setGradientStyle(generateJSXMeshGradient(6));
  }, [gradient.key]);

  const [contentShadowEnabled, setContentShadowEnabled] = useState(false);
  const [pageZoom, setPageZoom] = useState(1);
  const [canInnerZoom, setCanInnerZoom] = useState(false);

  // Compute available space on mount and resize
  useEffect(() => {
    const computeAvailable = () => {
      const viewportW = window.innerWidth;
      const parent = scrollAreaRef.current?.parentElement || scrollAreaRef.current;
      const parentH = parent ? parent.clientHeight : window.innerHeight;

      const leftGap = document.querySelector('[data-slot="sidebar-gap"]');
      const rightSidebar = document.querySelector('[data-slot="control-sidebar"]');
      const layout = document.querySelector('[data-slot="screenshoots-layout"]');

      const hasFixedAncestor = (() => {
        let el = scrollAreaRef.current;
        while (el && el !== document.body) {
          const pos = window.getComputedStyle(el).position;
          if (pos === "fixed") return true;
          el = el.parentElement;
        }
        return false;
      })();

      if (hasFixedAncestor) {
        setAvailable({ w: Math.max(0, Math.floor(viewportW)), h: parentH });
        return;
      }

      const isRow = layout ? window.getComputedStyle(layout).flexDirection.includes("row") : true;

      const leftW = leftGap ? leftGap.getBoundingClientRect().width : 0;
      const rightW = isRow && rightSidebar ? rightSidebar.getBoundingClientRect().width : 0;

      const w = Math.max(0, Math.floor(viewportW - leftW - rightW));
      setAvailable({ w, h: parentH });
    };

    computeAvailable();

    const roLeft = new ResizeObserver(computeAvailable);
    const roRight = new ResizeObserver(computeAvailable);
    const roParent = new ResizeObserver(computeAvailable);

    const leftGap = document.querySelector('[data-slot="sidebar-gap"]');
    const rightSidebar = document.querySelector('[data-slot="control-sidebar"]');
    const parent = scrollAreaRef.current?.parentElement || scrollAreaRef.current;

    if (leftGap) roLeft.observe(leftGap);
    if (rightSidebar) roRight.observe(rightSidebar);
    if (parent) roParent.observe(parent);

    window.addEventListener("resize", computeAvailable);

    const onTransitionEnd = () => computeAvailable();
    leftGap?.addEventListener("transitionend", onTransitionEnd);
    rightSidebar?.addEventListener("transitionend", onTransitionEnd);

    return () => {
      roLeft.disconnect();
      roRight.disconnect();
      roParent.disconnect();
      window.removeEventListener("resize", computeAvailable);
      leftGap?.removeEventListener("transitionend", onTransitionEnd);
      rightSidebar?.removeEventListener("transitionend", onTransitionEnd);
    };
  }, []);

  // Re-apply inner zoom when slider changes (if accessible)
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe || !canInnerZoom) return;
    try {
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (doc?.documentElement) {
        doc.documentElement.style.zoom = String(pageZoom);
      }
    } catch {
      // cross-origin, ignore
    }
  }, [pageZoom, canInnerZoom]);

  // Reset access flag on URL change
  useEffect(() => {
    setCanInnerZoom(false);
  }, [url]);

  const assets = useMemo(() => collectAssets(devicesJson, device || devicesJson[0]?.name, selections, toggles), [device, selections, toggles]);

  const deviceTotalWidth = viewW + frame.borderThickness * 2;
  const overflowX = available.w > 0 && deviceTotalWidth > available.w;
  const deviceTotalHeight = viewH + frame.borderThickness * 2;
  const overflowY = available.h > 0 && deviceTotalHeight > available.h;

  useEffect(() => {
    if (scrollAreaRef.current) {
      if (overflowX) scrollAreaRef.current.scrollLeft = 0;
      if (overflowY) scrollAreaRef.current.scrollTop = 0;
    }
  }, [overflowX, overflowY, available.w, available.h, deviceTotalWidth, deviceTotalHeight]);

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
          frameBorderColor={frame.borderColor}
          setFrameBorderColor={(v) => setFrame((f) => ({ ...f, borderColor: v }))}
          frameBorderThickness={frame.borderThickness}
          setFrameBorderThickness={(v) => setFrame((f) => ({ ...f, borderThickness: v }))}
          frameBorderRadius={frame.borderRadius}
          setFrameBorderRadius={(v) => setFrame((f) => ({ ...f, borderRadius: v }))}
          gradientOpacity={gradient.opacity}
          setGradientOpacity={(v) => setGradient((g) => ({ ...g, opacity: v }))}
          onRandomizeGradient={() => setGradient((g) => ({ ...g, key: g.key + 1 }))}
          contentShadowEnabled={contentShadowEnabled}
          setContentShadowEnabled={setContentShadowEnabled}
          pageZoom={pageZoom}
          setPageZoom={setPageZoom}
        />
      </SidebarPortal>

      <div className="w-full h-full relative gradient-box">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ ...gradientStyle, opacity: gradient.opacity }}
          aria-hidden
          suppressHydrationWarning
        />

        <div
          ref={scrollAreaRef}
          className={`relative z-10 w-full h-full overflow-x-auto overflow-y-auto flex ${overflowY ? "items-start" : "items-center"} ${overflowX ? "justify-start" : "justify-center"}`}
          style={{ maxWidth: available.w ? available.w + "px" : undefined, maxHeight: available.h ? available.h + "px" : undefined }}
        >
          <div
            className="relative flex-none m-15"
            style={{
              width: viewW + "px",
              height: viewH + "px",
              border: `${frame.borderThickness}px solid ${frame.borderColor}`,
              borderRadius: frame.borderRadius + "px",
              overflow: "hidden",
              backgroundClip: "padding-box",
              filter: contentShadowEnabled ? "drop-shadow(0 8px 24px rgba(0,0,0,0.25))" : undefined,
            }}
          >
            <div className="relative flex flex-col w-full h-full" style={{ backgroundColor }}>
              {assets.flowTop.map((a, idx) => (
                <img key={`top-${idx}`} src={a.src} alt={a.alt} className="block w-full h-auto select-none pointer-events-none" />
              ))}

              <div className="relative flex-1 min-h-0 overflow-hidden">
                <div
                  style={
                    canInnerZoom
                      ? { width: "100%", height: "100%" }
                      : { width: `${viewW / pageZoom}px`, height: `${viewH / pageZoom}px`, transform: `scale(${pageZoom})`, transformOrigin: "top left" }
                  }
                >
                  <iframe
                    ref={iframeRef}
                    title="embed-preview"
                    src={safeUrl(url)}
                    sandbox="allow-forms allow-scripts allow-same-origin allow-popups"
                    className="w-full h-full z-0"
                    style={{ border: 0 }}
                    onLoad={() => {
                      try {
                        const doc = iframeRef.current?.contentDocument || iframeRef.current?.contentWindow?.document;
                        if (doc?.documentElement) {
                          doc.documentElement.style.zoom = String(pageZoom);
                          setCanInnerZoom(true);
                        } else {
                          setCanInnerZoom(false);
                        }
                      } catch {
                        setCanInnerZoom(false);
                      }
                    }}
                  />
                </div>
              </div>
              <div className="pointer-events-none absolute inset-0 z-10">
                <DeviceOverlays devices={devicesJson} device={device || devicesJson[0]?.name} selections={selections} toggles={toggles} />
              </div>

              {assets.flowBottom.map((a, idx) => (
                <img key={`bottom-${idx}`} src={a.src} alt={a.alt} className="block w-full h-auto select-none pointer-events-none" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
