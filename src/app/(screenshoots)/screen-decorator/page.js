"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import { SidebarPortal } from "@/components/sidebar-portal";
import { ScreenDecoratorControls } from "@/components/sidebars/screen-decorator-controls";
import devicesJson from "@/lib/device-elements.json";
import { DeviceOverlays, collectAssets } from "@/components/device-overlays";
import { generateJSXMeshGradient } from "meshgrad";
import { generateNoiseDataUrl } from "@/lib/noise-texture";

function safeUrl(u) {
  if (!u) return "";
  try { return new URL(u).href; } catch { return "https://" + u; }
}

export default function Page() {
  const iframeRef = useRef(null);


  const CONTROL_DEFAULTS = {
    backgroundColor: "rgba(249, 250, 251, 1)",
    borderColor: "rgba(3, 7, 18, 0.12)",
    borderThickness: 10,
    borderRadius: 16,
    borderEnabled: true,
    gradientEnabled: true,
    gradientOpacity: 0.75,
    gradientKey: 0,
    noiseEnabled: true,
    noiseTexture: 0.35,
    contentShadowEnabled: true,
    contentShadowOffsetX: 0,
    contentShadowOffsetY: 8,
    contentShadowBlur: 24,
    contentShadowColor: "rgba(0,0,0,0.25)",
    pageZoom: 1,
    backgroundMargin: 60,
  };
  const [controls, setControls] = useState(CONTROL_DEFAULTS);
  const updateControl = (key, value) => setControls((c) => ({ ...c, [key]: value }));
  const resetControl = (key) => setControls((c) => ({ ...c, [key]: CONTROL_DEFAULTS[key] }));
  const randomizeGradient = () => setControls((c) => ({ ...c, gradientKey: c.gradientKey + 1 }));


  const {
    backgroundColor,
    borderColor,
    borderThickness,
    borderRadius,
    borderEnabled,
    gradientEnabled,
    gradientOpacity,
    gradientKey,
    noiseEnabled,
    noiseTexture,
    contentShadowEnabled,
    contentShadowOffsetX,
    contentShadowOffsetY,
    contentShadowBlur,
    contentShadowColor,
    pageZoom,
    backgroundMargin,
  } = controls;


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


  const [gradientStyle, setGradientStyle] = useState({});
  useEffect(() => { setGradientStyle(generateJSXMeshGradient(6)); }, [gradientKey]);


  const noiseDataUrl = useMemo(() => {
    if (!noiseEnabled) return null;
    return generateNoiseDataUrl({ size: 128, opacity: noiseTexture, monochrome: true });
  }, [noiseEnabled, noiseTexture]);


  useEffect(() => {
    setControls((c) => {
      const desired = c.gradientEnabled ? CONTROL_DEFAULTS.backgroundMargin : 0;
      return c.backgroundMargin === desired ? c : { ...c, backgroundMargin: desired };
    });
  }, [gradientEnabled]);


  useEffect(() => {
    setControls((c) => {
      const desired = c.borderEnabled ? CONTROL_DEFAULTS.borderThickness : 0;
      return c.borderThickness === desired ? c : { ...c, borderThickness: desired };
    });
  }, [borderEnabled]);


  const [canInnerZoom, setCanInnerZoom] = useState(false);
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe || !canInnerZoom) return;
    try {
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (doc?.documentElement) doc.documentElement.style.zoom = String(pageZoom);
    } catch { /* ignore */ }
  }, [pageZoom, canInnerZoom]);
  useEffect(() => { setCanInnerZoom(false); }, [url]);

  const assets = useMemo(() => collectAssets(devicesJson, device || devicesJson[0]?.name, selections, toggles), [device, selections, toggles]);

  return (
    <>
      <SidebarPortal>
        <ScreenDecoratorControls
          controls={controls}
          updateControl={updateControl}
          resetControl={resetControl}
          randomizeGradient={randomizeGradient}
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
        />
      </SidebarPortal>

      <div className="w-full h-full relative gradient-box">
        <div className="flex items-center justify-center w-full h-full">
          <div className="max-w-full max-h-full min-w-0 min-h-0">
            <div className="relative inline-block w-fit" style={{ padding: backgroundMargin }}>
              <div
                className="absolute pointer-events-none"
                style={{
                  ...(gradientEnabled
                    ? { ...gradientStyle, opacity: gradientOpacity }
                    : { background: backgroundColor, opacity: 1 }),
                  top: 0,
                  left: 0,
                  width: viewW + (backgroundMargin + borderThickness) * 2 + "px",
                  height: viewH + (backgroundMargin + borderThickness) * 2 + "px",
                  zIndex: 0,
                }}
                aria-hidden
                suppressHydrationWarning
              />
              {noiseDataUrl && (
                <div
                  className="absolute pointer-events-none"
                  style={{
                    top: 0,
                    left: 0,
                    width: viewW + (backgroundMargin + borderThickness) * 2 + "px",
                    height: viewH + (backgroundMargin + borderThickness) * 2 + "px",
                    backgroundImage: `url(${noiseDataUrl})`,
                    backgroundRepeat: "repeat",
                    backgroundSize: "128px 128px",
                    opacity: noiseEnabled ? noiseTexture / 2 : 0,
                    mixBlendMode: "normal",
                    zIndex: 1,
                  }}
                  aria-hidden
                />
              )}

              <div
                className="relative outline outline-white/30"
                style={{
                  boxSizing: "content-box",
                  width: viewW + "px",
                  height: viewH + "px",
                  border: borderEnabled ? `${borderThickness}px solid ${borderColor}` : "none",
                  borderRadius: borderEnabled ? borderRadius + "px" : 0,
                  overflow: "hidden",
                  backgroundClip: "padding-box",
                  filter: contentShadowEnabled
                    ? `drop-shadow(${contentShadowOffsetX}px ${contentShadowOffsetY}px ${contentShadowBlur}px ${contentShadowColor})`
                    : undefined,
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
        </div>
      </div>
    </>
  );
}
