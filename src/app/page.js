"use client";

import { InfiniteCanvas } from "@/components/ui/infinite-gallery";
import { GallerySidebar } from "@/components/sidebar";
import { FullscreenToggle } from "@/components/fullscreen-toggle";
import { Header } from "@/components/header";
import { useState, useRef, useEffect } from "react";
import { useFullscreen } from "@/hooks/useFullscreen";

export default function Home() {
  const defaultControls = {
    repeat: 1,
    columns: 4,
    gap: 30,
    backgroundColor: "rgba(249, 250, 251, 1)",
    borderColor: "rgba(3, 7, 18, 0.1)",
    borderThickness: 4,
    rotateXOuter: 35.264,
    rotateYOuter: -45,
  };

  const [controls, setControls] = useState(defaultControls);

  const [imageOrder, setImageOrder] = useState([]);

  useEffect(() => {
    const timer = setTimeout(resetView, 300);
    return () => clearTimeout(timer);
  }, [imageOrder]);


  const canvasRef = useRef();
  const galleryContainerRef = useRef();

  // Fullscreen functionality for the gallery
  const { isFullscreen, toggleFullscreen, isSupported } = useFullscreen(galleryContainerRef);

  const updateControl = (key, value) => {
    setControls(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const resetControl = (key) => {
    setControls(prev => ({
      ...prev,
      [key]: defaultControls[key]
    }));
  };

  const resetView = () => {
    if (canvasRef.current) {
      canvasRef.current.resetView();
    }
  };

  const recalculatePadding = () => {
    if (canvasRef.current) {
      canvasRef.current.calculatePadding();
    }
  };

  const addImageFromUrl = (url) => {
    const newImage = {
      id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      src: url
    };
    setImageOrder(prev => [...prev, newImage]);
  };

  const removeImage = (id) => {
    setImageOrder(prev => prev.filter(img => img.id !== id));
  };

  const highlightImage = (imageId) => {
    if (canvasRef.current) {
      canvasRef.current.highlightImage(imageId);
    }
  };

  const handleCapture = () => {
    // TODO: Implement capture functionality
    console.log("Capture clicked");
  };

  // Use the current imageOrder for the gallery with unique IDs for repeated items
  const repeatedImages = Array(controls.repeat)
    .fill(null)
    .flatMap((_, repeatIndex) => 
      imageOrder.map((image, imageIndex) => ({
        ...image,
        id: `${image.id}-repeat-${repeatIndex}`
      }))
    );

  return (
    <div className="min-h-screen">
      {/* Header - hide in fullscreen */}
      {!isFullscreen && <Header />}

      <div className="flex flex-col lg:flex-row">
        {/* Main Gallery Area */}
        <div className="flex-1 order-1 lg:order-1">
          {/* Gallery */}
          <div
            ref={galleryContainerRef}
            className={`z-10 overflow-hidden relative ${isFullscreen
              ? "h-screen w-screen fixed top-0 left-0"
              : "sticky top-14 h-[60vh] lg:h-[calc(100vh-3.5rem)]"
              }`}
          >
            <InfiniteCanvas
              ref={canvasRef}
              images={repeatedImages}
              className="w-full h-full"
              controls={controls}
            />

            {/* Floating fullscreen exit button when in fullscreen */}
            <FullscreenToggle
              isFullscreen={isFullscreen}
              onToggleFullscreen={toggleFullscreen}
            />
          </div>
        </div>

        {/* Right Sidebar for Image Management - hide in fullscreen */}
        {!isFullscreen && (
          <div className="order-2 lg:order-2">
            <GallerySidebar
              controls={controls}
              defaultControls={defaultControls}
              updateControl={updateControl}
              resetControl={resetControl}
              imageOrder={imageOrder}
              addImageFromUrl={addImageFromUrl}
              removeImage={removeImage}
              setImageOrder={setImageOrder}
              resetView={resetView}
              recalculatePadding={recalculatePadding}
              onCapture={handleCapture}
              onHighlightImage={highlightImage}
              isFullscreen={isFullscreen}
              toggleFullscreen={toggleFullscreen}
              isFullscreenSupported={isSupported}
            />
          </div>
        )}
      </div>
    </div>
  );
}
