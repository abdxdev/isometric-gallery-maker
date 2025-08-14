"use client";

import { ImageSortable } from "@/components/isometric-gallery/image-sortable";
import { Button } from "@/components/ui/button";
import { NumberInput } from "@/components/ui/number-input";
import { Slider } from "@/components/ui/slider";
import { ReactColorPicker } from "@/components/ui/react-color-picker";
import { Input } from "@/components/ui/input";
import { GroupedSidebarControls } from "../sidebar";
import { Focus, Camera, X, RefreshCw, ImageIcon, Plus, Upload } from "lucide-react";
import { useState, useRef } from "react";

export function SidebarControls({ controls, updateControl, resetControl, images, loadSampleImages, handleFileUpload, addImageFromUrl, removeImage, setImages, resetView, recalculateBounding, onHighlightImage }) {
  const [urlInput, setUrlInput] = useState("");
  const fileInputRef = useRef();

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      addImageFromUrl(urlInput.trim());
      setUrlInput("");
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const clearAll = () => {
    setImages([]);
  };

  const groups = [
    {
      id: "import",
      title: "Import Images",
      items: [
        {
          key: "add-url",
          label: "Add from URL",
          node: (
            <div className="flex w-full items-center gap-2">
              <Input placeholder="https://example.com/image.jpg" value={urlInput} onChange={(e) => setUrlInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleUrlSubmit()} className="flex-1" />
              <Button type="submit" variant="outline" onClick={handleUrlSubmit}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          ),
        },
        {
          key: "upload-files",
          label: "Upload Files",
          node: (
            <>
              <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFileUpload} className="hidden" />
              <Button onClick={triggerFileUpload} variant="outline" className="w-full">
                <Upload size={16} className="w-4 h-4" />
                Choose Images
              </Button>
            </>
          ),
        },
      ],
    },
    {
      id: "order",
      title: "Image Order",
      items: [
        images.length === 0
          ? {
              key: "empty-order",
              node: (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground text-center">No images added yet</p>
                  <Button onClick={loadSampleImages} variant="outline" className="w-full">
                    <ImageIcon className="w-4 h-4" />
                    Load Sample Images
                  </Button>
                </div>
              ),
            }
          : {
              key: "order-list",
              node: (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">Drag and drop images to reorder them</p>
                  <div className="space-y-2">
                    <ImageSortable imageList={images} onImageOrderChange={setImages} onImageRemove={removeImage} onHighlightImage={onHighlightImage} />
                    <Button onClick={clearAll} variant="outline" className="w-full" disabled={images.length === 0}>
                      <X className="w-4 h-4" />
                      Clear All
                    </Button>
                  </div>
                </div>
              ),
            },
      ],
    },
    {
      id: "controls",
      title: "Gallery Controls",
      items: [
        {
          key: "columns",
          label: "Columns",
          showReset: true,
          resetKey: "columns",
          control: <NumberInput id="columns" value={controls.columns} onValueChange={(value) => updateControl("columns", value)} min={1} max={7} stepper={1} className="w-full" />,
        },
        {
          key: "gap",
          label: "Gap",
          showReset: true,
          resetKey: "gap",
          control: <NumberInput id="gap" value={controls.gap} onValueChange={(value) => updateControl("gap", value)} min={0} max={100} stepper={5} className="w-full" />,
        },
        {
          key: "repeat",
          label: "Repeat",
          showReset: true,
          resetKey: "repeat",
          control: <NumberInput id="repeat" value={controls.repeat} onValueChange={(value) => updateControl("repeat", value)} min={1} max={10} stepper={1} className="w-full" />,
        },
        {
          key: "backgroundColor",
          label: "Background Color",
          showReset: true,
          resetKey: "backgroundColor",
          control: <ReactColorPicker className="w-full" value={controls.backgroundColor} onChange={(value) => updateControl("backgroundColor", value)} />,
        },
        {
          key: "borderColor",
          label: "Border Color",
          showReset: true,
          resetKey: "borderColor",
          control: <ReactColorPicker className="w-full" value={controls.borderColor} onChange={(value) => updateControl("borderColor", value)} />,
        },
        {
          key: "borderThickness",
          label: "Border Thickness",
          showReset: true,
          resetKey: "borderThickness",
          control: <NumberInput id="borderThickness" value={controls.borderThickness} onValueChange={(value) => updateControl("borderThickness", value)} min={0} max={100} stepper={5} className="w-full" />,
        },
        {
          key: "imageRadius",
          label: "Image Radius",
          showReset: true,
          resetKey: "imageRadius",
          control: (
            <div className="flex gap-2 items-center">
              <Slider id="imageRadius" value={[controls.imageRadius]} onValueChange={(v) => updateControl("imageRadius", v[0])} min={0} max={100} step={1} className="flex-1" />
              <div className="w-30">
                <NumberInput id="imageRadius" value={controls.imageRadius} onValueChange={(value) => updateControl("imageRadius", value)} min={0} max={200} stepper={1} />
              </div>
            </div>
          ),
        },
        {
          key: "rotateXOuter",
          label: "Rotate X",
          showReset: true,
          resetKey: "rotateXOuter",
          control: (
            <div className="flex gap-2 items-center">
              <Slider id="rotateXOuter" value={[controls.rotateXOuter]} onValueChange={(value) => updateControl("rotateXOuter", value[0])} min={-180} max={180} step={0.1} className="flex-1" />
              <div className="w-30">
                <NumberInput value={controls.rotateXOuter} onValueChange={(value) => updateControl("rotateXOuter", value)} min={-180} max={180} stepper={0.1} decimalScale={2} />
              </div>
            </div>
          ),
        },
        {
          key: "rotateYOuter",
          label: "Rotate Y",
          showReset: true,
          resetKey: "rotateYOuter",
          control: (
            <div className="flex gap-2 items-center">
              <Slider id="rotateYOuter" value={[controls.rotateYOuter]} onValueChange={(value) => updateControl("rotateYOuter", value[0])} min={-180} max={180} step={0.1} className="flex-1" />
              <div className="w-30">
                <NumberInput value={controls.rotateYOuter} onValueChange={(value) => updateControl("rotateYOuter", value)} min={-180} max={180} stepper={0.1} decimalScale={2} />
              </div>
            </div>
          ),
        },
      ],
    },
    {
      id: "actions",
      title: "Actions",
      items: [
        {
          key: "reset-view",
          node: (
            <Button onClick={resetView} variant="outline" className="w-full">
              <Focus className="w-4 h-4" />
              Reset View
            </Button>
          ),
        },
        {
          key: "recalc",
          node: (
            <Button onClick={recalculateBounding} variant="outline" className="w-full">
              <RefreshCw className="w-4 h-4" />
              Recalculate Bounding
            </Button>
          ),
          note: "Use if images appear cut off",
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

  return <GroupedSidebarControls groups={groups.map((g) => (g.id === "controls" ? { ...g, onItemReset: (k) => resetControl(k) } : g))} />;
}
