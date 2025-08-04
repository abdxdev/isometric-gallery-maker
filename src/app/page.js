"use client";

import { InfiniteCanvas } from "@/components/ui/infinite-gallery";
import { Sidebar } from "@/components/sidebar";
import { FullscreenToggle } from "@/components/fullscreen-toggle";
import { Header } from "@/components/header";
import { WelcomeDialog } from "@/components/welcome-dialog";
import { useState, useRef, useEffect } from "react";
import { useFullscreen } from "@/hooks/useFullscreen";

const sampleImages = [
  { id: "sample-1", src: "https://tailwindcss.com/plus-assets/img/heroes/ui-blocks-col-1-row-1.png" },
  { id: "sample-2", src: "https://tailwindcss.com/plus-assets/img/heroes/ui-blocks-col-1-row-2.png" },
  { id: "sample-3", src: "https://tailwindcss.com/plus-assets/img/heroes/ui-blocks-col-1-row-3.png" },
  { id: "sample-4", src: "https://tailwindcss.com/plus-assets/img/heroes/ui-blocks-col-1-row-4.png" },
  { id: "sample-5", src: "https://tailwindcss.com/plus-assets/img/heroes/ui-blocks-col-2-row-1.png" },
  { id: "sample-6", src: "https://tailwindcss.com/plus-assets/img/heroes/ui-blocks-col-2-row-2.png" },
  { id: "sample-7", src: "https://tailwindcss.com/plus-assets/img/heroes/ui-blocks-col-2-row-3.png" },
  { id: "sample-8", src: "https://tailwindcss.com/plus-assets/img/heroes/ui-blocks-col-2-row-4.png" },
  { id: "sample-9", src: "https://tailwindcss.com/plus-assets/img/heroes/ui-blocks-col-2-row-5.png" },
  { id: "sample-10", src: "https://tailwindcss.com/plus-assets/img/heroes/ui-blocks-col-2-row-6.png" },
  { id: "sample-11", src: "https://tailwindcss.com/plus-assets/img/heroes/ui-blocks-col-3-row-1.png" },
  { id: "sample-12", src: "https://tailwindcss.com/plus-assets/img/heroes/ui-blocks-col-3-row-2.png" },
  { id: "sample-13", src: "https://tailwindcss.com/plus-assets/img/heroes/ui-blocks-col-3-row-3.png" },
  { id: "sample-14", src: "https://tailwindcss.com/plus-assets/img/heroes/ui-blocks-col-3-row-4.png" },
  { id: "sample-15", src: "https://tailwindcss.com/plus-assets/img/heroes/ui-blocks-col-3-row-5.png" },
  { id: "sample-16", src: "https://tailwindcss.com/plus-assets/img/heroes/ui-blocks-col-3-row-6.png" },
  { id: "sample-17", src: "https://tailwindcss.com/plus-assets/img/heroes/ui-blocks-col-3-row-7.png" },
  { id: "sample-18", src: "https://tailwindcss.com/plus-assets/img/heroes/ui-blocks-col-4-row-1.png" },
  { id: "sample-19", src: "https://tailwindcss.com/plus-assets/img/heroes/ui-blocks-col-4-row-2.png" },
  { id: "sample-20", src: "https://tailwindcss.com/plus-assets/img/heroes/ui-blocks-col-4-row-3.png" },
];

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

  const loadSampleImages = () => {
    setImageOrder(sampleImages);
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
      {/* Welcome Dialog */}
      <WelcomeDialog onLoadSamples={loadSampleImages} />

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
            <Sidebar
              controls={controls}
              defaultControls={defaultControls}
              updateControl={updateControl}
              resetControl={resetControl}
              imageOrder={imageOrder}
              sampleImages={sampleImages}
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
