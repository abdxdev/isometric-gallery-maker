"use client";

import { ImageImporter } from "@/components/image-importer";
import { ImageSortable } from "@/components/image-sortable";
import { Button } from "@/components/ui/button";
import { NumberInput } from "@/components/ui/number-input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ReactColorPicker } from "@/components/ui/react-color-picker";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Minimize2, Maximize2, Focus, Camera, X, RefreshCw, ImageIcon } from "lucide-react";

function ResetButton({ onClick, title, className = "flex-shrink-0" }) {
  return (
    <Button onClick={onClick} variant="outline" size="icon" className={className} title={title}>
      <RefreshCw className="w-4 h-4" />
    </Button>
  );
}

export function Sidebar({ controls, updateControl, resetControl, imageOrder, sampleImages, addImageFromUrl, removeImage, setImageOrder, resetView, recalculatePadding, onCapture, onHighlightImage, isFullscreen, toggleFullscreen, isFullscreenSupported }) {
  const clearAll = () => {
    setImageOrder([]);
    removeImage();
  };

  const loadSampleImages = () => {
    setImageOrder(sampleImages);
  };
  return (
    <div className="w-full lg:w-86 flex flex-col p-4 lg:border-l border-border">
      <Accordion type="multiple" defaultValue={["import", "controls", "order", "actions"]} className="w-full space-y-2">
        {/* Import Images Section */}
        <AccordionItem value="import">
          <AccordionTrigger className="text-md">Import Images</AccordionTrigger>
          <AccordionContent>
            <ImageImporter onImageAdd={addImageFromUrl} onImageRemove={removeImage} recentImages={imageOrder} />
          </AccordionContent>
        </AccordionItem>
        {/* Controls Section */}
        <AccordionItem value="controls">
          <AccordionTrigger className="text-md">Gallery Controls</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              {/* Columns Control */}
              <div className="space-y-2">
                <Label htmlFor="columns">Columns</Label>
                <div className="flex gap-2">
                  <NumberInput id="columns" value={controls.columns} onValueChange={(value) => updateControl("columns", value)} min={1} max={8} stepper={1} className="flex-1" />
                  <ResetButton onClick={() => resetControl("columns")} title="Reset Columns" />
                </div>
              </div>
              {/* Gap Control */}
              <div className="space-y-2">
                <Label htmlFor="gap">Gap</Label>
                <div className="flex gap-2">
                  <NumberInput id="gap" value={controls.gap} onValueChange={(value) => updateControl("gap", value)} min={0} max={100} stepper={5} className="flex-1" />
                  <ResetButton onClick={() => resetControl("gap")} title="Reset Gap" />
                </div>
              </div>
              {/* Repeat Control */}
              <div className="space-y-2">
                <Label htmlFor="repeat">Repeat</Label>
                <div className="flex gap-2">
                  <NumberInput id="repeat" value={controls.repeat} onValueChange={(value) => updateControl("repeat", value)} min={1} max={10} stepper={1} className="flex-1" />
                  <ResetButton onClick={() => resetControl("repeat")} title="Reset Repeat" />
                </div>
              </div>
              {/* Background Color Control */}
              <div className="space-y-2">
                <Label htmlFor="backgroundColor">Background Color</Label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <ReactColorPicker value={controls.backgroundColor} onChange={(value) => updateControl("backgroundColor", value)} />
                  </div>
                  <ResetButton onClick={() => resetControl("backgroundColor")} title="Reset Background Color" />
                </div>
              </div>
              {/* Border Color Control */}
              <div className="space-y-2">
                <Label htmlFor="borderColor">Border Color</Label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <ReactColorPicker value={controls.borderColor} onChange={(value) => updateControl("borderColor", value)} />
                  </div>
                  <ResetButton onClick={() => resetControl("borderColor")} title="Reset Border Color" />
                </div>
              </div>
              {/* Border Thickness Control */}
              <div className="space-y-2">
                <Label htmlFor="borderThickness">Border Thickness</Label>
                <div className="flex gap-2">
                  <NumberInput id="borderThickness" value={controls.borderThickness} onValueChange={(value) => updateControl("borderThickness", value)} min={0} max={20} stepper={1} className="flex-1" />
                  <ResetButton onClick={() => resetControl("borderThickness")} title="Reset Border Thickness" />
                </div>
              </div>
              {/* Rotate X Outer Control */}
              <div className="space-y-2">
                <Label htmlFor="rotateXOuter">Rotate X</Label>
                <div className="flex gap-2 items-center">
                  <Slider id="rotateXOuter" value={[controls.rotateXOuter]} onValueChange={(value) => updateControl("rotateXOuter", value[0])} min={-180} max={180} step={0.1} className="flex-1" />
                  <div className="w-30">
                    <NumberInput value={controls.rotateXOuter} onValueChange={(value) => updateControl("rotateXOuter", value)} min={-180} max={180} stepper={0.1} decimalScale={2} />
                  </div>
                  <ResetButton onClick={() => resetControl("rotateXOuter")} title="Reset Rotate X" />
                </div>
              </div>
              {/* Rotate Y Outer Control */}
              <div className="space-y-2">
                <Label htmlFor="rotateYOuter">Rotate Y</Label>
                <div className="flex gap-2 items-center">
                  <Slider id="rotateYOuter" value={[controls.rotateYOuter]} onValueChange={(value) => updateControl("rotateYOuter", value[0])} min={-180} max={180} step={0.1} className="flex-1" />
                  <div className="w-30">
                    <NumberInput value={controls.rotateYOuter} onValueChange={(value) => updateControl("rotateYOuter", value)} min={-180} max={180} stepper={0.1} decimalScale={2} />
                  </div>
                  <ResetButton onClick={() => resetControl("rotateYOuter")} title="Reset Rotate Y" />
                </div>
              </div>
              {/* Recalculate Padding Button */}
              <div className="space-y-2">
                <Button onClick={recalculatePadding} variant="outline" className="w-full">
                  <RefreshCw className="w-4 h-4" />
                  Recalculate Padding
                </Button>
                <p className="text-xs text-muted-foreground text-center">Use if images appear cut off</p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        {/* Image Order Section */}
        <AccordionItem value="order">
          <AccordionTrigger className="text-md">Image Order</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              {imageOrder.length === 0 ? (
                <>
                  {/* Empty state */}
                  <p className="text-sm text-muted-foreground text-center">No images added yet</p>
                  <Button onClick={loadSampleImages} variant="outline" className="w-full">
                    <ImageIcon className="w-4 h-4" />
                    Load Sample Images
                  </Button>
                </>
              ) : (
                <>
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
                </>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
        {/* Actions Section */}
        <AccordionItem value="actions">
          <AccordionTrigger className="text-md">Actions</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {/* Reset View Button */}
              <Button onClick={resetView} variant="outline" className="w-full">
                <Focus className="w-4 h-4" />
                Reset View
              </Button>
              {/* Fullscreen Toggle Button */}
              {isFullscreenSupported && (
                <Button onClick={toggleFullscreen} variant="outline" className="w-full">
                  {isFullscreen ? (
                    <>
                      <Minimize2 className="w-4 h-4" />
                      Exit Fullscreen
                    </>
                  ) : (
                    <>
                      <Maximize2 className="w-4 h-4" />
                      Fullscreen
                    </>
                  )}
                </Button>
              )}
              <Button onClick={onCapture} className="w-full">
                <Camera className="w-4 h-4" />
                Capture
              </Button>
              <p className="text-xs text-muted-foreground text-center">Feature in development. Use manual screenshot</p>

            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
