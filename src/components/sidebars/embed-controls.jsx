"use client";

import { useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import devicesJson from "@/lib/device-elements.json";
import { buildControlGroups, computeDeviceDimensions } from "@/components/device-overlays";
import { ReactColorPicker } from "@/components/ui/react-color-picker";
import { RefreshCw } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { NumberInput } from "@/components/ui/number-input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";

function safeUrl(u) {
  if (!u) return "";
  try {
    return new URL(u).href;
  } catch {
    return "https://" + u;
  }
}

function ResetButton({ onClick, title, className = "flex-shrink-0" }) {
  return (
    <Button onClick={onClick} variant="outline" size="icon" className={className} title={title}>
      <RefreshCw className="w-4 h-4" />
    </Button>
  );
}

export function EmbedControls({ url, setUrl, dimentions, setDimentions, device, setDevice, selections = {}, setSelections, toggles = {}, setToggles, backgroundColor, setBackgroundColor, frameBorderColor, setFrameBorderColor, frameBorderThickness, setFrameBorderThickness, frameBorderRadius, setFrameBorderRadius, gradientOpacity, setGradientOpacity, onRandomizeGradient, contentShadowEnabled = false, setContentShadowEnabled }) {
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
    <Accordion type="multiple" defaultValue={["url", "deviceOptions", "controls"]} className="w-full space-y-2">
      {/* URL Section */}
      <AccordionItem value="url">
        <AccordionTrigger className="text-md">URL</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4 w-full">
            {/* URL input */}
            <div className="space-y-2">
              <div className="flex w-full items-center gap-2">
                <Input placeholder="https://example.com" value={url} onChange={(e) => setUrl(e.target.value)} className="flex-1" />
                <Button className="shrink-0" variant="outline" onClick={() => setUrl(safeUrl(url))}>
                  Load
                </Button>
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Device + Options together, directly below URL */}
      <AccordionItem value="deviceOptions">
        <AccordionTrigger className="text-md">Device & Options</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4 w-full">
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

            {/* Theme toggle (light/dark) */}
            <div className="w-full">
              <ToggleGroup type="single" className="w-full" value={selections?.__theme__ || "light"} onValueChange={(v) => setSelections?.({ ...(selections || {}), __theme__: v || selections?.__theme__ || "light" })}>
                <ToggleGroupItem value="light" aria-label="light">
                  <span className="px-2 text-xs">light</span>
                </ToggleGroupItem>
                <ToggleGroupItem value="dark" aria-label="dark">
                  <span className="px-2 text-xs">dark</span>
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            {/* Dynamic OR groups */}
            {orGroups.map((g) => {
              const selected = selections?.[g.key];
              const selectedMeta = (g.optionsMeta || []).find((m) => m.label === selected);

              const renderLocalStatus = (val) => {
                if (val === "light") return "light";
                if (val === "dark") return "dark";
                // true, undefined, or anything else -> on (inherit)
                return "theme";
              };

              const cycleSelectedLocal = () => {
                if (!selectedMeta?.localMode) return;
                const key = selectedMeta.key;
                const curr = (toggles || {})[key];
                let nextVal;
                if (curr === true) nextVal = "light";
                else if (curr === "light") nextVal = "dark";
                else if (curr === "dark") nextVal = true;
                else nextVal = true; // from undefined -> on (inherit)
                setToggles?.({ ...(toggles || {}), [key]: nextVal });
              };

              const status = selectedMeta?.localMode ? renderLocalStatus((toggles || {})[selectedMeta.key]) : null;

              return (
                <div key={g.key} className="space-y-1 w-full">
                  <ToggleGroup type="single" className="w-full" value={selected} onValueChange={(v) => setSelections?.({ ...(selections || {}), [g.key]: v })}>
                    {g.options.map((o) => {
                      const meta = (g.optionsMeta || []).find((m) => m.label === o);
                      const st = meta?.localMode ? renderLocalStatus((toggles || {})[meta.key]) : null;
                      const isSelected = selected === o;
                      return (
                        <ToggleGroupItem key={o} value={o} aria-label={o}>
                          <span className="text-xs capitalize">{o}</span>
                          {meta?.localMode && isSelected && (
                            <span
                              className={`text-[0.5rem] border px-1 bg-accent uppercase ${st === "dark" ? "bg-black text-white" : st === "light" ? "bg-white text-black border" : "bg-accent text-accent-foreground"}`}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                cycleSelectedLocal();
                              }}
                            >
                              {st}
                            </span>
                          )}
                        </ToggleGroupItem>
                      );
                    })}
                  </ToggleGroup>
                </div>
              );
            })}

            {/* Dynamic AND groups */}
            {andGroups.map((g) => {
              // Split items into normal and local-mode
              const normalItems = (g.items || []).filter((it) => !it.localMode);
              const localItems = (g.items || []).filter((it) => it.localMode);

              const selectedValues = normalItems.filter((it) => toggles?.[it.key] !== false).map((it) => it.key);

              const onItemsChange = (vals) => {
                const next = { ...(toggles || {}) };
                // Only update normal items here
                normalItems.forEach((it) => {
                  next[it.key] = vals.includes(it.key);
                });
                setToggles?.(next);
              };

              const renderLocalStatus = (val) => {
                if (val === "light") return "light";
                if (val === "dark") return "dark";
                return "theme";
              };

              // Local items: selected if not false
              const localSelected = localItems.filter((it) => toggles?.[it.key] !== false).map((it) => it.key);

              const onLocalItemsChange = (vals) => {
                const next = { ...(toggles || {}) };
                localItems.forEach((it) => {
                  if (vals.includes(it.key)) {
                    // keep prior mode if any, else default to true (inherit)
                    const cur = next[it.key];
                    next[it.key] = cur === "light" || cur === "dark" || cur === true ? cur : true;
                  } else {
                    next[it.key] = false; // parent toggle controls off
                  }
                });
                setToggles?.(next);
              };

              const cycleLocal = (key) => {
                const curr = (toggles || {})[key];
                let nextVal;
                if (curr === true) nextVal = "light";
                else if (curr === "light") nextVal = "dark";
                else if (curr === "dark") nextVal = true;
                else nextVal = true;
                setToggles?.({ ...(toggles || {}), [key]: nextVal });
              };

              return (
                <div key={g.key} className="space-y-1 w-full">
                  {normalItems.length > 0 && (
                    <ToggleGroup type="multiple" value={selectedValues} onValueChange={onItemsChange} className="w-full flex flex-wrap gap-1">
                      {normalItems.map((it) => (
                        <ToggleGroupItem key={it.key} value={it.key} aria-label={it.label}>
                          <span className="px-2 text-xs">{it.label}</span>
                        </ToggleGroupItem>
                      ))}
                    </ToggleGroup>
                  )}

                  {localItems.length > 0 && (
                    <ToggleGroup type="multiple" value={localSelected} onValueChange={onLocalItemsChange} className="w-full flex flex-wrap gap-1">
                      {localItems.map((it) => {
                        const v = (toggles || {})[it.key];
                        const status = renderLocalStatus(v);
                        const isOn = localSelected.includes(it.key);
                        return (
                          <ToggleGroupItem
                            key={it.key}
                            value={it.key}
                            aria-label={it.label}
                          >
                            <span className="text-xs">{it.label}</span>
                            {isOn && (
                              <span
                                className={`text-[0.5rem] border px-1 bg-accent uppercase ${status === "dark" ? "bg-black text-white" : status === "light" ? "bg-white text-black border" : "bg-accent text-accent-foreground"}`}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  cycleLocal(it.key);
                                }}
                              >
                                {status}
                              </span>
                            )}
                          </ToggleGroupItem>
                        );
                      })}
                    </ToggleGroup>
                  )}
                </div>
              );
            })}
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Controls Section (match isometric spacing, labels, inputs) */}
      <AccordionItem value="controls">
        <AccordionTrigger className="text-md">Viewer Controls</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4">
            {/* Shadow toggle */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Shadow</Label>
              <div className="flex items-center gap-2">
                <Checkbox id="shadow-toggle" checked={!!contentShadowEnabled} onCheckedChange={(v) => setContentShadowEnabled?.(!!v)} />
                <Label htmlFor="shadow-toggle" className="text-xs">Enable</Label>
              </div>
            </div>

            {/* Dimensions */}
            <div className="space-y-2 w-full">
              <Label className="text-sm font-medium">Dimensions</Label>
              <div className="grid grid-cols-2 gap-2 items-center w-full">
                <div className="flex items-center gap-2">
                  <span className="text-xs">W</span>
                  <div className="flex-1">
                    <NumberInput value={dimentions.w} onValueChange={(v) => setDimentions({ ...dimentions, w: Number(v) })} min={200} max={2000} stepper={10} className="w-full" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs">H</span>
                  <div className="flex-1">
                    <NumberInput value={dimentions.h} onValueChange={(v) => setDimentions({ ...dimentions, h: Number(v) })} min={200} max={2000} stepper={10} className="w-full" />
                  </div>
                </div>
              </div>
            </div>

            {/* Background Color */}
            <div className="space-y-2">
              <Label htmlFor="backgroundColor">Background Color</Label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <ReactColorPicker value={backgroundColor} onChange={(value) => setBackgroundColor?.(value)} />
                </div>
                <ResetButton onClick={() => setBackgroundColor?.("rgba(249, 250, 251, 1)")} title="Reset Background Color" />
              </div>
              <div className="flex gap-2 mt-1">
                <Button variant="outline" onClick={onRandomizeGradient} className="w-full">
                  Randomize Background
                </Button>
              </div>
            </div>

            {/* Border Color */}
            <div className="space-y-2">
              <Label htmlFor="borderColor">Border Color</Label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <ReactColorPicker value={frameBorderColor} onChange={(value) => setFrameBorderColor?.(value)} />
                </div>
                <ResetButton onClick={() => setFrameBorderColor?.("rgba(3, 7, 18, 0.12)")} title="Reset Border Color" />
              </div>
            </div>

            {/* Background Opacity (Slider + NumberInput like isometric) */}
            <div className="space-y-2">
              <Label htmlFor="gradientOpacity">Background Opacity</Label>
              <div className="flex gap-2 items-center">
                <Slider id="gradientOpacity" value={[gradientOpacity]} onValueChange={(vals) => setGradientOpacity?.(Number(vals[0]))} min={0} max={1} step={0.01} className="flex-1" />
                <div className="w-30">
                  <NumberInput value={gradientOpacity} onValueChange={(v) => setGradientOpacity?.(Math.max(0, Math.min(1, Number(v))))} min={0} max={1} stepper={0.01} decimalScale={2} />
                </div>
                <ResetButton onClick={() => setGradientOpacity?.(1)} title="Reset Opacity" />
              </div>
            </div>

            {/* Border Thickness */}
            <div className="space-y-2">
              <Label htmlFor="borderThickness">Border Thickness</Label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <NumberInput id="borderThickness" value={frameBorderThickness} onValueChange={(v) => setFrameBorderThickness?.(Number(v))} min={0} max={40} stepper={1} className="w-full" />
                </div>
                <ResetButton onClick={() => setFrameBorderThickness?.(4)} title="Reset Border Thickness" />
              </div>
            </div>

            {/* Border Radius */}
            <div className="space-y-2">
              <Label htmlFor="borderRadius">Border Radius</Label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <NumberInput id="borderRadius" value={frameBorderRadius} onValueChange={(v) => setFrameBorderRadius?.(Number(v))} min={0} max={200} stepper={1} className="w-full" />
                </div>
                <ResetButton onClick={() => setFrameBorderRadius?.(16)} title="Reset Border Radius" />
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
