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
  };

  const [controls, setControls] = useState(defaultControls);

  const [imageOrder, setImageOrder] = useState([
    // { id: "1", src: "/images/image10.png" },
    // { id: "2", src: "/images/image5.png" },
    // { id: "3", src: "/images/image2.png" },
    // { id: "4", src: "/images/image6.png" },
    // { id: "5", src: "/images/image3.png" },
    // { id: "6", src: "/images/image7.png" },
    // { id: "7", src: "/images/image9.png" },
    // { id: "8", src: "/images/image8.png" },
    // { id: "9", src: "/images/image13.png" },
    // { id: "10", src: "/images/image11.png" },
    // { id: "11", src: "/images/image4.png" },
    // { id: "12", src: "/images/image1.png" },
    // { id: "13", src: "/images/image12.png" },
    // { id: 1, src: "https://tailwindcss.com/plus-assets/img/heroes/ui-blocks-col-1-row-1.png" },
    // { id: 2, src: "https://tailwindcss.com/plus-assets/img/heroes/ui-blocks-col-1-row-2.png" },
    // { id: 3, src: "https://tailwindcss.com/plus-assets/img/heroes/ui-blocks-col-1-row-3.png" },
    // { id: 4, src: "https://tailwindcss.com/plus-assets/img/heroes/ui-blocks-col-1-row-4.png" },
    // { id: 5, src: "https://tailwindcss.com/plus-assets/img/heroes/ui-blocks-col-2-row-1.png" },
    // { id: 6, src: "https://tailwindcss.com/plus-assets/img/heroes/ui-blocks-col-2-row-2.png" },
    // { id: 7, src: "https://tailwindcss.com/plus-assets/img/heroes/ui-blocks-col-2-row-3.png" },
    // { id: 8, src: "https://tailwindcss.com/plus-assets/img/heroes/ui-blocks-col-2-row-4.png" },
    // { id: 9, src: "https://tailwindcss.com/plus-assets/img/heroes/ui-blocks-col-2-row-5.png" },
    // { id: 10, src: "https://tailwindcss.com/plus-assets/img/heroes/ui-blocks-col-2-row-6.png" },
    // { id: 11, src: "https://tailwindcss.com/plus-assets/img/heroes/ui-blocks-col-3-row-1.png" },
    // { id: 12, src: "https://tailwindcss.com/plus-assets/img/heroes/ui-blocks-col-3-row-2.png" },
    // { id: 13, src: "https://tailwindcss.com/plus-assets/img/heroes/ui-blocks-col-3-row-3.png" },
    // { id: 14, src: "https://tailwindcss.com/plus-assets/img/heroes/ui-blocks-col-3-row-4.png" },
    // { id: 15, src: "https://tailwindcss.com/plus-assets/img/heroes/ui-blocks-col-3-row-5.png" },
    // { id: 16, src: "https://tailwindcss.com/plus-assets/img/heroes/ui-blocks-col-3-row-6.png" },
    // { id: 17, src: "https://tailwindcss.com/plus-assets/img/heroes/ui-blocks-col-3-row-7.png" },
    // { id: 18, src: "https://tailwindcss.com/plus-assets/img/heroes/ui-blocks-col-4-row-1.png" },
    // { id: 19, src: "https://tailwindcss.com/plus-assets/img/heroes/ui-blocks-col-4-row-2.png" },
    // { id: 20, src: "https://tailwindcss.com/plus-assets/img/heroes/ui-blocks-col-4-row-3.png" },
  ]);

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

  const resetControls = () => {
    setControls(defaultControls);
  };

  const resetView = () => {
    if (canvasRef.current) {
      canvasRef.current.resetView();
    }
  };

  const addImageFromUrl = (url) => {
    const newImage = {
      id: Date.now().toString(),
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

  // Use the current imageOrder for the gallery
  const repeatedImages = Array(controls.repeat).fill(imageOrder).flat();

  return (
    <div className="min-h-screen">
      {/* Header - hide in fullscreen */}
      {!isFullscreen && <Header />}

      <div className="flex">
        {/* Main Gallery Area */}
        <div className="flex-1">
          {/* Gallery */}
          <div
            ref={galleryContainerRef}
            className={`z-10 overflow-hidden relative ${isFullscreen
              ? "h-screen w-screen fixed top-0 left-0"
              : "sticky top-14 h-[calc(100vh-3.5rem)]"
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
          <GallerySidebar
            controls={controls}
            defaultControls={defaultControls}
            updateControl={updateControl}
            resetControls={resetControls}
            imageOrder={imageOrder}
            addImageFromUrl={addImageFromUrl}
            removeImage={removeImage}
            setImageOrder={setImageOrder}
            resetView={resetView}
            onCapture={handleCapture}
            onHighlightImage={highlightImage}
            isFullscreen={isFullscreen}
            toggleFullscreen={toggleFullscreen}
            isFullscreenSupported={isSupported}
          />
        )}
      </div>
    </div>
  );
}
