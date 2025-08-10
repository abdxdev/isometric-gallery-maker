"use client";

import { useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import devicesJson from "@/lib/device-elements.json";
import { buildControlGroups, computeDeviceDimensions } from "@/components/device-overlays";

function safeUrl(u) {
  if (!u) return "";
  try {
    return new URL(u).href;
  } catch {
    return "https://" + u;
  }
}

export function EmbedControls({ url, setUrl, dimentions, setDimentions, containerRef, device, setDevice, selections = {}, setSelections, toggles = {}, setToggles }) {
  const devices = devicesJson;

  // defaults
  useEffect(() => {
    if (!device) setDevice?.(devices[0]?.name || "device");
  }, []);

  // update dimensions on selection change
  useEffect(() => {
    if (!device) return;
    const dims = computeDeviceDimensions(devices, device, selections);
    setDimentions?.(dims);
  }, [device, selections]);

  const { orGroups, andGroups } = useMemo(() => buildControlGroups(devices, device || devices[0]?.name, selections), [devices, device, selections]);

  return (
    <div className="space-y-4 w-full">
      {/* URL */}
      <div className="space-y-2 w-full">
        <Label className="text-sm font-medium">URL</Label>
        <div className="flex items-center gap-2 w-full">
          <Input className="flex-1" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com" />
          <Button className="shrink-0" variant="outline" onClick={() => setUrl(safeUrl(url))}>
            Load
          </Button>
        </div>
      </div>

      {/* Manual dimensions override */}
      <div className="space-y-2 w-full">
        <Label className="text-sm font-medium">Dimensions</Label>
        <div className="grid grid-cols-2 gap-2 items-center w-full">
          <div className="flex items-center gap-2">
            <span className="text-xs">W</span>
            <input type="number" value={dimentions.w} onChange={(e) => setDimentions({ ...dimentions, w: Number(e.target.value) })} className="w-full input input-sm px-2 py-1 border rounded" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs">H</span>
            <input type="number" value={dimentions.h} onChange={(e) => setDimentions({ ...dimentions, h: Number(e.target.value) })} className="w-full input input-sm px-2 py-1 border rounded" />
          </div>
        </div>
      </div>

      {/* Device */}
      <div className="space-y-2 w-full">
        <Label className="text-sm font-medium">Device</Label>
        <Select value={device} onValueChange={(v) => setDevice?.(v)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Device" />
          </SelectTrigger>
          <SelectContent className="w-full">
            {devices.map((d) => (
              <SelectItem key={d.name} value={d.name}>
                {d.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Dynamic OR groups (toggle group - single). Hide deeper groups until parent chosen */}
      {orGroups.map((g) => (
        <div key={g.key} className="space-y-2 w-full">
          {/* No group label */}
          <ToggleGroup type="single" className="w-full" value={selections?.[g.key]} onValueChange={(v) => setSelections?.({ ...(selections || {}), [g.key]: v })}>
            {g.options.map((o) => (
              <ToggleGroupItem key={o} value={o} aria-label={o}>
                <span className="px-2 text-xs capitalize">{o}</span>
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      ))}

      {/* Dynamic AND groups (toggle group - multiple), no parent label */}
      {andGroups.map((g) => {
        const selectedValues = (g.items || []).filter((it) => toggles?.[it.key] !== false).map((it) => it.key);
        const onItemsChange = (vals) => {
          const next = { ...(toggles || {}) };
          (g.items || []).forEach((it) => {
            next[it.key] = vals.includes(it.key);
          });
          setToggles?.(next);
        };
        return (
          <div key={g.key} className="space-y-2 w-full">
            <ToggleGroup type="multiple" value={selectedValues} onValueChange={onItemsChange} className="w-full flex flex-wrap gap-1">
              {(g.items || []).map((it) => (
                <ToggleGroupItem key={it.key} value={it.key} aria-label={it.label}>
                  <span className="px-2 text-xs">{it.label}</span>
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        );
      })}
    </div>
  );
}
