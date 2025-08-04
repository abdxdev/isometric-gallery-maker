"use client";

import { ImageImporter } from "@/components/image-importer";
import { ImageSortable } from "@/components/image-sortable";
import { Button } from "@/components/ui/button";
import { NumberInput } from "@/components/ui/number-input";
import { Label } from "@/components/ui/label";
import { ReactColorPicker } from "@/components/ui/react-color-picker";
import { Maximize2, Minimize2, RotateCcw, Focus, Camera, X, RefreshCw } from "lucide-react";

export function GallerySidebar({ controls, defaultControls, updateControl, resetControls, imageOrder, addImageFromUrl, removeImage, setImageOrder, resetView, onCapture, onHighlightImage, isFullscreen, toggleFullscreen, isFullscreenSupported }) {
  const clearAll = () => {
    setImageOrder([]);
    removeImage();
  };
  return (
    <div className="w-86 flex flex-col space-y-6 p-4 border-l border-border">
      {/* Import Images Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Import Images</h2>
        {/* Image Import Section */}
        <div className="space-y-3">
          <ImageImporter onImageAdd={addImageFromUrl} onImageRemove={removeImage} recentImages={imageOrder} />
        </div>
      </div>
      <hr className="border-t border-border" />
      {/* Controls Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Gallery Controls</h2>
        {/* Columns Control */}
        <div className="space-y-2">
          <Label htmlFor="columns">Columns</Label>
          <NumberInput id="columns" value={controls.columns} onValueChange={(value) => updateControl("columns", value)} min={1} max={8} stepper={1} className="w-full" />
        </div>
        {/* Gap Control */}
        <div className="space-y-2">
          <Label htmlFor="gap">Gap</Label>
          <NumberInput id="gap" value={controls.gap} onValueChange={(value) => updateControl("gap", value)} min={0} max={100} stepper={5} className="w-full" />
        </div>
        {/* Repeat Control */}
        <div className="space-y-2">
          <Label htmlFor="repeat">Repeat</Label>
          <NumberInput id="repeat" value={controls.repeat} onValueChange={(value) => updateControl("repeat", value)} min={1} max={10} stepper={1} className="w-full" />
        </div>
        {/* Background Color Control */}
        <div className="space-y-2">
          <Label htmlFor="backgroundColor">Background Color</Label>
          <div className="flex gap-2">
            <div className="flex-1">
              <ReactColorPicker value={controls.backgroundColor} onChange={(value) => updateControl("backgroundColor", value)} />
            </div>
            <Button onClick={() => updateControl("backgroundColor", defaultControls.backgroundColor)} variant="outline" size="icon" className="h-10 w-10 flex-shrink-0" title="Reset Background Color">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>
        {/* Border Color Control */}
        <div className="space-y-2">
          <Label htmlFor="borderColor">Border Color</Label>
          <div className="flex gap-2">
            <div className="flex-1">
              <ReactColorPicker value={controls.borderColor} onChange={(value) => updateControl("borderColor", value)} />
            </div>
            <Button onClick={() => updateControl("borderColor", defaultControls.borderColor)} variant="outline" size="icon" className="h-10 w-10 flex-shrink-0" title="Reset Border Color">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>
        {/* Border Thickness Control */}
        <div className="space-y-2">
          <Label htmlFor="borderThickness">Border Thickness</Label>
          <NumberInput id="borderThickness" value={controls.borderThickness} onValueChange={(value) => updateControl("borderThickness", value)} min={0} max={20} stepper={1} className="w-full" />
        </div>
        {/* Reset Controls Button */}
        <div className="pt-4">
          <Button onClick={resetControls} variant="outline" className="w-full">
            <RotateCcw className="w-4 h-4" />
            Reset Controls
          </Button>
        </div>
      </div>
      <hr className="border-t border-border" />
      {/* Image Order Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Image Order</h2>
        {/* Description */}
        <p className="text-sm text-muted-foreground">Drag and drop images to reorder them</p>
        {/* Image Sortable Component */}
        <div className="space-y-2">
          <ImageSortable imageList={imageOrder} onImageOrderChange={setImageOrder} onImageRemove={removeImage} onHighlightImage={onHighlightImage} columns={3} />
          <Button onClick={clearAll} variant="outline" className="w-full" disabled={imageOrder.length === 0}>
            <X className="w-4 h-4" />
            Clear All
          </Button>
        </div>
      </div>
      <hr className="border-t border-border" />
      {/* Actions Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Actions</h2>
        {/* Reset View Button */}
        <div className="space-y-2">
          <Button onClick={resetView} variant="outline" className="w-full">
            <Focus className="w-4 h-4" />
            Reset View
          </Button>
          {/* Fullscreen Toggle Button */}
          {isFullscreenSupported && (
            <Button onClick={toggleFullscreen} variant="outline" className="w-full">
              <Minimize2 className="w-4 h-4" />
              {isFullscreen ? <>Exit Fullscreen</> : <>Fullscreen</>}
            </Button>
          )}
          <Button onClick={onCapture} className="w-full">
            <Camera className="w-4 h-4" />
            Capture
          </Button>
        </div>
      </div>
    </div>
  );
}
