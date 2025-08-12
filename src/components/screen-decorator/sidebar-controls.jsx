"use client";

import { useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import devicesJson from "@/lib/device-elements.json";
import { buildControlGroups, computeDeviceDimensions } from "@/components/screen-decorator/device-overlays";
import { ReactColorPicker } from "@/components/ui/react-color-picker";
import { Camera, Shuffle, Focus } from "lucide-react";
import { NumberInput } from "@/components/ui/number-input";
import { Slider } from "@/components/ui/slider";
import { GroupedSidebarControls } from "../sidebar";

function safeUrl(u) {
  if (!u) return "";
  try {
    return new URL(u).href;
  } catch {
    return "https://" + u;
  }
}

export function SidebarControls({ controls, updateControl, resetControl, randomizeGradient, url, setUrl, dimentions, setDimentions, device, setDevice, selections, setSelections, toggles, setToggles, onResetView }) {
  const devices = devicesJson;

  // defaults
  useEffect(() => {
    if (!device) setDevice?.(devices[0]?.name || "device");
  }, []);

  const isCustom = device === "Custom";

  useEffect(() => {
    if (!device || isCustom) return;
    const dims = computeDeviceDimensions(devices, device, selections);
    setDimentions?.(dims);
  }, [device, selections]);

  const deviceDims = useMemo(() => {
    if (!device || isCustom) return null;
    try {
      return computeDeviceDimensions(devices, device, selections);
    } catch {
      return null;
    }
  }, [devices, device, selections, isCustom]);

  const { orGroups, andGroups } = useMemo(() => buildControlGroups(devices, device || devices[0]?.name, selections), [devices, device, selections]);

  useEffect(() => {
    const theme = selections?.__theme__ || "light";
    const desired = theme === "dark" ? "rgba(0, 0, 0, 1)" : "rgba(255, 255, 255, 1)";
    if (controls.backgroundColor !== desired) updateControl?.("backgroundColor", desired);
  }, [selections?.__theme__, controls.backgroundColor]);

  const groups = [
    {
      id: "url",
      title: "URL",
      items: [
        {
          key: "url-input",
          label: "Website URL",
          control: (
            <div className="flex w-full items-center gap-2">
              <Input placeholder="https://example.com" value={url} onChange={(e) => setUrl(e.target.value)} className="flex-1" />
              <Button className="shrink-0" variant="outline" onClick={() => setUrl((e) => safeUrl(e))}>
                Load
              </Button>
            </div>
          ),
        },
      ],
    },
    {
      id: "deviceOptions",
      title: "Device Options",
      items: [
        {
          key: "device-select",
          label: "Device",
          control: (
            <Select
              value={device}
              onValueChange={(v) => {
                setDevice?.(v);
                if (v === "Custom") {
                  setSelections?.({});
                  setToggles?.({});
                } else {
                  setSelections?.({});
                  setToggles?.({});
                  const nextDims = computeDeviceDimensions(devices, v, {});
                  setDimentions?.(nextDims);
                }
              }}
            >
              <SelectTrigger className="w-full">
                <div className="flex items-center gap-2 min-w-0">
                  <SelectValue placeholder="Device" />
                  {!isCustom && deviceDims && <span className="text-xs text-muted-foreground whitespace-nowrap">{`${deviceDims.w} × ${deviceDims.h}`}</span>}
                </div>
              </SelectTrigger>
              <SelectContent className="w-full">
                {devices.map((d) => (
                  <SelectItem key={d.name} value={d.name}>
                    {d.name}
                  </SelectItem>
                ))}
                <SelectItem value="Custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          ),
        },
        {
          key: "dimensions",
          label: "Dimensions",
          when: isCustom,
          control: (
            <div className="grid grid-cols-2 gap-2 items-center w-full">
              <div className="flex items-center gap-2">
                <span className="text-xs">W</span>
                <div className="flex-1">
                  <NumberInput
                    value={dimentions.w}
                    onValueChange={(v) => {
                      const newW = Number(v);
                      setDimentions({ ...dimentions, w: newW });
                    }}
                    min={200}
                    max={2000}
                    stepper={10}
                    className="w-full"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs">H</span>
                <div className="flex-1">
                  <NumberInput
                    value={dimentions.h}
                    onValueChange={(v) => {
                      const newH = Number(v);
                      setDimentions({ ...dimentions, h: newH });
                    }}
                    min={200}
                    max={2000}
                    stepper={10}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          ),
        },
        {
          key: "theme-toggle",
          label: "Theme",
          when: !isCustom,
          control: (
            <ToggleGroup type="single" className="w-full" value={selections?.__theme__ || "light"} onValueChange={(v) => setSelections?.({ ...(selections || {}), __theme__: v || selections?.__theme__ || "light" })}>
              <ToggleGroupItem value="light" aria-label="light">
                <span className="px-2 text-xs">Light</span>
              </ToggleGroupItem>
              <ToggleGroupItem value="dark" aria-label="dark">
                <span className="px-2 text-xs">Dark</span>
              </ToggleGroupItem>
            </ToggleGroup>
          ),
        },
        // dynamic OR groups
        ...orGroups.map((g) => ({
          key: `or-${g.key}`,
          when: !isCustom,
          control: (
            <ToggleGroup type="single" className="w-full" value={selections?.[g.key]} onValueChange={(v) => setSelections?.({ ...(selections || {}), [g.key]: v })}>
              {g.options.map((o) => {
                const meta = (g.optionsMeta || []).find((m) => m.label === o);
                const selected = selections?.[g.key];
                const isSelected = selected === o;
                const renderLocalStatus = (val) => (val === "light" ? "light" : val === "dark" ? "dark" : "theme");
                const st = meta?.localMode ? renderLocalStatus((toggles || {})[meta.key]) : null;
                const stLabel = st ? st.charAt(0).toUpperCase() + st.slice(1) : "";
                const cycleSelectedLocal = () => {
                  if (!meta?.localMode || !isSelected) return;
                  const key = meta.key;
                  const curr = (toggles || {})[key];
                  let nextVal;
                  if (curr === true) nextVal = "light";
                  else if (curr === "light") nextVal = "dark";
                  else if (curr === "dark") nextVal = true;
                  else nextVal = true; // from undefined -> on (inherit)
                  setToggles?.({ ...(toggles || {}), [key]: nextVal });
                };

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
                        {stLabel}
                      </span>
                    )}
                  </ToggleGroupItem>
                );
              })}
            </ToggleGroup>
          ),
        })),
        // dynamic AND groups
        ...andGroups.map((g) => ({
          key: `and-${g.key}`,
          when: !isCustom,
          control: (() => {
            const normalItems = (g.items || []).filter((it) => !it.localMode);
            const localItems = (g.items || []).filter((it) => it.localMode);
            const selectedValues = normalItems.filter((it) => toggles?.[it.key] !== false).map((it) => it.key);
            const onItemsChange = (vals) => {
              const next = { ...(toggles || {}) };
              normalItems.forEach((it) => {
                next[it.key] = vals.includes(it.key);
              });
              setToggles?.(next);
            };
            const renderLocalStatus = (val) => (val === "light" ? "light" : val === "dark" ? "dark" : "theme");
            const localSelected = localItems.filter((it) => toggles?.[it.key] !== false).map((it) => it.key);
            const onLocalItemsChange = (vals) => {
              const next = { ...(toggles || {}) };
              localItems.forEach((it) => {
                if (vals.includes(it.key)) {
                  const cur = next[it.key];
                  next[it.key] = cur === "light" || cur === "dark" || cur === true ? cur : true;
                } else {
                  next[it.key] = false;
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
              <div className="space-y-1 w-full">
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
                      const statusLabel = status ? status.charAt(0).toUpperCase() + status.slice(1) : "";
                      const isOn = localSelected.includes(it.key);
                      return (
                        <ToggleGroupItem key={it.key} value={it.key} aria-label={it.label}>
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
                              {statusLabel}
                            </span>
                          )}
                        </ToggleGroupItem>
                      );
                    })}
                  </ToggleGroup>
                )}
              </div>
            );
          })(),
        })),
      ],
    },
    {
      id: "viewer",
      title: "Viewer Controls",
      onItemReset: (k) => resetControl?.(k),
      items: [
        {
          key: "pageZoom",
          label: "Page Zoom",
          showReset: true,
          resetKey: "pageZoom",
          control: (
            <div className="flex gap-2 items-center">
              <Slider id="pageZoom" value={[controls.pageZoom]} onValueChange={(vals) => updateControl?.("pageZoom", Number(vals[0]))} min={0.25} max={3} step={0.05} className="flex-1" />
              <div className="w-30">
                <NumberInput value={controls.pageZoom} onValueChange={(v) => updateControl?.("pageZoom", Math.max(0.25, Math.min(3, Number(v))))} min={0.25} max={3} stepper={0.05} decimalScale={2} />
              </div>
            </div>
          ),
        },
        {
          key: "borderEnabled",
          label: "Frame Border",
          control: (
            <Button type="button" variant={controls.borderEnabled ? "default" : "outline"} onClick={() => updateControl?.("borderEnabled", !controls.borderEnabled)} className="w-full">
              {controls.borderEnabled ? "Border: On" : "Border: Off"}
            </Button>
          ),
        },
        {
          key: "borderColor",
          label: "Border Color",
          when: controls.borderEnabled,
          showReset: true,
          resetKey: "borderColor",
          control: <ReactColorPicker value={controls.borderColor} onChange={(value) => updateControl?.("borderColor", value)} />,
        },
        {
          key: "borderThickness",
          label: "Border Thickness",
          when: controls.borderEnabled,
          showReset: true,
          resetKey: "borderThickness",
          control: <NumberInput value={controls.borderThickness} onValueChange={(v) => updateControl?.("borderThickness", Number(v))} min={0} max={40} stepper={1} className="w-full" />,
        },
        {
          key: "borderRadius",
          label: "Border Radius",
          when: controls.borderEnabled,
          showReset: true,
          resetKey: "borderRadius",
          control: <NumberInput value={controls.borderRadius} onValueChange={(v) => updateControl?.("borderRadius", Number(v))} min={0} max={200} stepper={1} className="w-full" />,
        },
        {
          key: "contentShadowEnabled",
          label: "Shadow",
          control: (
            <Button type="button" aria-pressed={!!controls.contentShadowEnabled} variant={controls.contentShadowEnabled ? "default" : "outline"} onClick={() => updateControl?.("contentShadowEnabled", !controls.contentShadowEnabled)} className="w-full">
              {controls.contentShadowEnabled ? "Shadow: On" : "Shadow: Off"}
            </Button>
          ),
        },
        {
          key: "contentShadowOffsetX",
          label: "Shadow Offset X",
          when: controls.contentShadowEnabled,
          showReset: true,
          resetKey: "contentShadowOffsetX",
          control: <NumberInput value={controls.contentShadowOffsetX} onValueChange={(v) => updateControl?.("contentShadowOffsetX", Number(v))} min={-200} max={200} stepper={1} className="w-full" />,
        },
        {
          key: "contentShadowOffsetY",
          label: "Shadow Offset Y",
          when: controls.contentShadowEnabled,
          showReset: true,
          resetKey: "contentShadowOffsetY",
          control: <NumberInput value={controls.contentShadowOffsetY} onValueChange={(v) => updateControl?.("contentShadowOffsetY", Number(v))} min={-200} max={200} stepper={1} className="w-full" />,
        },
        {
          key: "contentShadowBlur",
          label: "Shadow Blur",
          when: controls.contentShadowEnabled,
          showReset: true,
          resetKey: "contentShadowBlur",
          control: <NumberInput value={controls.contentShadowBlur} onValueChange={(v) => updateControl?.("contentShadowBlur", Number(v))} min={0} max={400} stepper={1} className="w-full" />,
        },
        {
          key: "contentShadowColor",
          label: "Shadow Color",
          when: controls.contentShadowEnabled,
          showReset: true,
          resetKey: "contentShadowColor",
          control: <ReactColorPicker value={controls.contentShadowColor} onChange={(value) => updateControl?.("contentShadowColor", value)} />,
        },
        {
          key: "gradientEnabled",
          label: "Background Gradient",
          control: (
            <Button type="button" variant={controls.gradientEnabled ? "default" : "outline"} onClick={() => updateControl?.("gradientEnabled", !controls.gradientEnabled)} className="w-full">
              {controls.gradientEnabled ? "Gradient: On" : "Gradient: Off"}
            </Button>
          ),
        },
        {
          key: "randomizeGradient",
          label: "Randomize Gradient",
          when: controls.gradientEnabled,
          showReset: false,
          control: (
            <Button onClick={randomizeGradient} variant="outline" className="w-full">
              <Shuffle className="w-4 h-4" />
              Randomize Gradient
            </Button>
          ),
        },
        {
          key: "gradientOpacity",
          label: "Gradient Opacity",
          when: controls.gradientEnabled,
          showReset: true,
          resetKey: "gradientOpacity",
          control: (
            <div className="flex gap-2 items-center">
              <Slider id="gradientOpacity" value={[controls.gradientOpacity]} onValueChange={(vals) => updateControl?.("gradientOpacity", Number(vals[0]))} min={0} max={1} step={0.01} className="flex-1" />
              <div className="w-30">
                <NumberInput value={controls.gradientOpacity} onValueChange={(v) => updateControl?.("gradientOpacity", Math.max(0, Math.min(1, Number(v))))} min={0} max={1} stepper={0.01} decimalScale={2} />
              </div>
            </div>
          ),
        },
        {
          key: "backgroundMargin",
          label: "Background Margin",
          when: controls.gradientEnabled,
          showReset: true,
          resetKey: "backgroundMargin",
          control: (
            <div className="flex gap-2 items-center">
              <Slider id="backgroundMargin" value={[controls.backgroundMargin || 0]} onValueChange={(vals) => updateControl?.("backgroundMargin", Number(vals[0]))} min={0} max={200} step={1} className="flex-1" />
              <div className="w-30">
                <NumberInput value={controls.backgroundMargin || 0} onValueChange={(v) => updateControl?.("backgroundMargin", Math.max(0, Math.min(200, Number(v))))} min={0} max={200} stepper={1} />
              </div>
            </div>
          ),
        },
        {
          key: "noiseEnabled",
          label: "Noise Texture",
          control: (
            <Button type="button" variant={controls.noiseEnabled ? "default" : "outline"} onClick={() => updateControl?.("noiseEnabled", !controls.noiseEnabled)} className="w-full">
              {controls.noiseEnabled ? "Noise: On" : "Noise: Off"}
            </Button>
          ),
        },
        {
          key: "noiseTexture",
          label: "Noise Texture Strength",
          when: controls.noiseEnabled,
          showReset: true,
          resetKey: "noiseTexture",
          control: (
            <div className="flex gap-2 items-center">
              <Slider id="noiseTexture" value={[controls.noiseTexture]} onValueChange={(vals) => updateControl?.("noiseTexture", Number(vals[0]))} min={0} max={1} step={0.01} className="flex-1" />
              <div className="w-30">
                <NumberInput value={controls.noiseTexture} onValueChange={(v) => updateControl?.("noiseTexture", Math.max(0, Math.min(1, Number(v))))} min={0} max={1} stepper={0.01} decimalScale={2} />
              </div>
            </div>
          ),
        },
      ],
    },
    {
      id: "actionss",
      title: "Actions",
      items: [
        {
          key: "reset-view",
          node: (
            <Button onClick={onResetView} variant="outline" className="w-full">
              <Focus className="w-4 h-4" />
              Reset View
            </Button>
          ),
        },
        {
          key: "capture",
          node: (
            <Button className="w-full">
              <Camera className="w-4 h-4" />
              Capture
            </Button>
          ),
          note: "Feature in development. Use manual screenshot",
        },
      ],
    },
  ];

  return <GroupedSidebarControls groups={groups.map((g) => ({ ...g, onItemReset: g.onItemReset || ((key) => resetControl?.(key)) }))} />;
}
