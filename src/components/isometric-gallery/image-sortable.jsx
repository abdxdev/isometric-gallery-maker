"use client";

import * as Sortable from "@/components/ui/sortable";
import { Button } from "@/components/ui/button";
import { X, ImagePlayIcon } from "lucide-react";
import { useState, useEffect } from "react";

export function ImageSortable({ imageList, onImageOrderChange, onImageRemove, onHighlightImage}) {
  const [images, setImages] = useState(imageList);

  // Update images when imageList prop changes
  useEffect(() => {
    setImages(imageList);
  }, [imageList]);

  const handleValueChange = (newOrder) => {
    setImages(newOrder);
    if (onImageOrderChange) {
      onImageOrderChange(newOrder);
    }
  };

  const handleImageRemove = (imageId) => {
    const updatedImages = images.filter((image) => image.id !== imageId);
    setImages(updatedImages);
    if (onImageRemove) {
      onImageRemove(imageId, updatedImages);
    }
  };
  return (
    <Sortable.Root value={images} onValueChange={handleValueChange} orientation="mixed" getItemValue={(item) => item.id}>
      <Sortable.Content className="grid auto-rows-fr gap-1 grid-cols-4 sm:grid-cols-6 md:grid-cols-6 lg:grid-cols-3">
        {images.map((image) => (
          <Sortable.Item key={image.id} value={image.id} asChild asHandle>
            <div className="relative aspect-square cursor-grab active:cursor-grabbing rounded-lg overflow-hidden border-2 border-border hover:border-primary transition-colors group">
              <img src={image.src} alt={`Image ${image._originalId ?? image.id}`} className="w-full h-full object-cover" draggable={false} />
              {onImageRemove && (
                <Button
                  title="Remove Image"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleImageRemove(image.id);
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onPointerDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  variant="destructive"
                  size="icon"
                  className="absolute top-1 right-1 w-6 h-6 opacity-0 group-hover:opacity-50 hover:opacity-100 transition-opacity duration-200 z-10 rounded-sm"
                  style={{ pointerEvents: "auto" }}
                  type="button"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
              {onHighlightImage && (
                <Button
                  title="Highlight Image"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onHighlightImage(image.id);
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onPointerDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  variant="secondary"
                  size="icon"
                  className="absolute top-7 right-1 w-6 h-6 opacity-0 group-hover:opacity-50 hover:opacity-100 transition-opacity duration-200 z-10 rounded-sm"
                  style={{ pointerEvents: "auto" }}
                  type="button"
                >
                  <ImagePlayIcon className="h-3 w-3" />
                </Button>
              )}
            </div>
          </Sortable.Item>
        ))}
      </Sortable.Content>
      <Sortable.Overlay>
        {(activeItem) => {
          const image = images.find((img) => img.id === activeItem.value);

          if (!image) return null;

          return (
            <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-primary shadow-lg bg-background">
              <img src={image.src} alt={`Image ${image.id}`} className="w-full h-full object-cover" draggable={false} />
              <div className="absolute inset-0 bg-primary/20 pointer-events-none" />
            </div>
          );
        }}
      </Sortable.Overlay>
    </Sortable.Root>
  );
}
