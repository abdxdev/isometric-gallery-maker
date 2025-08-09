"use client";

import React, { useRef, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Page() {
  const iframeRef = useRef(null);
  const containerRef = useRef(null);

  const [url, setUrl] = useState("https://example.com");
  const [width, setWidth] = useState(1024);
  const [height, setHeight] = useState(768);
  const [isResizing, setIsResizing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [startSize, setStartSize] = useState({ w: 1024, h: 768 });
  const [devicePreset, setDevicePreset] = useState("desktop");
  const [showControls, setShowControls] = useState(true);

  useEffect(() => {
    function onMouseMove(e) {
      if (!isResizing) return;
      const dx = e.clientX - startPos.x;
      const dy = e.clientY - startPos.y;
      setWidth(Math.max(200, Math.round(startSize.w + dx)));
      setHeight(Math.max(200, Math.round(startSize.h + dy)));
    }
    function onMouseUp() {
      setIsResizing(false);
    }
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [isResizing, startPos, startSize]);

  useEffect(() => {
    // update preset selection if width/height matches a preset
    if (width === 375 && height === 812) setDevicePreset("iphone-12");
    else if (width === 768 && height === 1024) setDevicePreset("tablet");
    else if (width === 1024 && height === 768) setDevicePreset("desktop");
    else setDevicePreset("custom");
  }, [width, height]);

  function startResize(e) {
    setIsResizing(true);
    setStartPos({ x: e.clientX, y: e.clientY });
    setStartSize({ w: width, h: height });
  }

  function applyPreset(preset) {
    if (preset === "iphone-12") {
      setWidth(375);
      setHeight(812);
    } else if (preset === "tablet") {
      setWidth(768);
      setHeight(1024);
    } else if (preset === "desktop") {
      setWidth(1024);
      setHeight(768);
    } else if (preset === "full") {
      // full will try to take available width of parent container
      const p = containerRef.current?.parentElement?.clientWidth ?? 1200;
      setWidth(Math.min(p - 40, 1280));
      setHeight(Math.round(((p - 40) * 9) / 16));
    }
  }

  function safeUrl(u) {
    if (!u) return "";
    try {
      const parsed = new URL(u);
      return parsed.href;
    } catch (e) {
      return "https://" + u;
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-3 items-center">
        <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Enter a URL to preview (e.g. https://example.com)" />
        <Button onClick={() => setUrl(safeUrl(url))}>Load</Button>
        <Button variant="ghost" onClick={() => setShowControls(!showControls)}>
          {showControls ? "Hide" : "Show"} Controls
        </Button>
      </div>

      {showControls && (
        <div className="mt-4 flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm">Width</span>
            <input type="number" value={width} onChange={(e) => setWidth(Number(e.target.value))} className="w-24 input input-sm px-2 py-1 border rounded" />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm">Height</span>
            <input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} className="w-24 input input-sm px-2 py-1 border rounded" />
          </div>

          <Select onValueChange={(v) => applyPreset(v)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Presets (Desktop/Tablet/Mobile)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desktop">Desktop 1024×768</SelectItem>
              <SelectItem value="tablet">Tablet 768×1024</SelectItem>
              <SelectItem value="iphone-12">iPhone 12/13/14 — 375×812</SelectItem>
              <SelectItem value="full">Fill parent (max 1280)</SelectItem>
            </SelectContent>
          </Select>

          <div className="ml-auto flex gap-2">
            <Button
              onClick={() => {
                setWidth(400);
                setHeight(700);
              }}
            >
              Reset
            </Button>
            <Button
              onClick={() => {
                navigator.clipboard?.writeText(safeUrl(url));
              }}
            >
              Copy URL
            </Button>
          </div>
        </div>
      )}

      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <div className="text-xs mb-2">Preview container</div>
          <div ref={containerRef} className="relative bg-slate-100 border border-slate-200 shadow-sm overflow-hidden" style={{ width: width + "px", height: height + "px" }}>
            <iframe ref={iframeRef} title="embed-preview" src={safeUrl(url)} style={{ width: "100%", height: "100%", border: "0" }} sandbox="allow-forms allow-scripts allow-same-origin allow-popups" />

            {/* resizer handle bottom-right */}
            <div onMouseDown={startResize} className="absolute right-0 bottom-0 w-4 h-4 cursor-se-resize" style={{ background: "transparent" }} aria-hidden />

            {/* overlay for showing dimensions */}
            <div className="absolute left-2 top-2 bg-white/80 px-2 py-1 rounded text-xs border">
              {width} × {height}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
