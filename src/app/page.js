"use client";

import { InfiniteCanvas } from "@/components/ui/infinite-gallery";
import { GallerySidebar } from "@/components/gallery-sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import { useState, useRef } from "react";

export default function Home() {
  const [controls, setControls] = useState({
    repeat: 1,
    columns: 3,
    gap: 30,
    backgroundColor: "#f9fafb",
    borderColor: "#030712",
    borderOpacity: 0.5,
    borderThickness: 3,
  });

  const [imageOrder, setImageOrder] = useState([
    { id: "1", src: "/images/image10.png" },
    { id: "2", src: "/images/image5.png" },
    { id: "3", src: "/images/image2.png" },
    { id: "4", src: "/images/image6.png" },
    { id: "5", src: "/images/image3.png" },
    { id: "6", src: "/images/image7.png" },
    { id: "7", src: "/images/image9.png" },
    { id: "8", src: "/images/image8.png" },
    { id: "9", src: "/images/image13.png" },
    { id: "10", src: "/images/image11.png" },
    { id: "11", src: "/images/image4.png" },
    { id: "12", src: "/images/image1.png" },
    { id: "13", src: "/images/image12.png" },
  ]);

  const canvasRef = useRef();

  const updateControl = (key, value) => {
    setControls(prev => ({
      ...prev,
      [key]: value
    }));
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

  const handleCapture = () => {
    // TODO: Implement capture functionality
    console.log("Capture clicked");
  };

  // Use the current imageOrder for the gallery
  const repeatedImages = Array(controls.repeat).fill(imageOrder).flat();

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center justify-between px-6 max-w-none">
          <div className="flex items-center space-x-2">
            <h1 className="text-lg font-semibold">Infinite Gallery</h1>
          </div>
          <ModeToggle />
        </div>
      </header>

      <div className="flex">
        {/* Main Gallery Area */}
        <div className="flex-1">
          {/* Gallery */}
          <div className="sticky top-14 z-10 h-[calc(100vh-3.5rem)] overflow-hidden">
            <InfiniteCanvas
              ref={canvasRef}
              images={repeatedImages}
              className="w-full h-full"
              columns={controls.columns}
              controls={controls}
            />
          </div>
        </div>

        {/* Right Sidebar for Image Management */}
        <GallerySidebar
          controls={controls}
          updateControl={updateControl}
          imageOrder={imageOrder}
          addImageFromUrl={addImageFromUrl}
          removeImage={removeImage}
          setImageOrder={setImageOrder}
          resetView={resetView}
          onCapture={handleCapture}
        />
      </div>
    </div>
  );
}
