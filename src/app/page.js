"use client";

import { InfiniteCanvas } from "@/components/ui/infinite-gallery";
import { Sidebar } from "@/components/sidebar";
import { FullscreenToggle } from "@/components/fullscreen-toggle";
import { Header } from "@/components/header";
import { WelcomeDialog } from "@/components/welcome-dialog";
import { useState, useRef, useEffect } from "react";
import { useFullscreen } from "@/hooks/useFullscreen";

const sampleImages = [
  { id: 1, src: "https://tailwindcss.com/plus-assets/img/heroes/ui-blocks-col-1-row-1.png" },
  { id: 2, src: "https://tailwindcss.com/plus-assets/img/heroes/ui-blocks-col-1-row-2.png" },
  { id: 3, src: "https://tailwindcss.com/plus-assets/img/heroes/ui-blocks-col-1-row-3.png" },
  { id: 4, src: "https://tailwindcss.com/plus-assets/img/heroes/ui-blocks-col-1-row-4.png" },
  { id: 5, src: "https://tailwindcss.com/plus-assets/img/heroes/ui-blocks-col-2-row-1.png" },
  { id: 6, src: "https://tailwindcss.com/plus-assets/img/heroes/ui-blocks-col-2-row-2.png" },
  { id: 7, src: "https://tailwindcss.com/plus-assets/img/heroes/ui-blocks-col-2-row-3.png" },
  { id: 8, src: "https://tailwindcss.com/plus-assets/img/heroes/ui-blocks-col-2-row-4.png" },
  { id: 9, src: "https://tailwindcss.com/plus-assets/img/heroes/ui-blocks-col-2-row-5.png" },
  { id: 10, src: "https://tailwindcss.com/plus-assets/img/heroes/ui-blocks-col-2-row-6.png" },
  { id: 11, src: "https://tailwindcss.com/plus-assets/img/heroes/ui-blocks-col-3-row-1.png" },
  { id: 12, src: "https://tailwindcss.com/plus-assets/img/heroes/ui-blocks-col-3-row-2.png" },
  { id: 13, src: "https://tailwindcss.com/plus-assets/img/heroes/ui-blocks-col-3-row-3.png" },
  { id: 14, src: "https://tailwindcss.com/plus-assets/img/heroes/ui-blocks-col-3-row-4.png" },
  { id: 15, src: "https://tailwindcss.com/plus-assets/img/heroes/ui-blocks-col-3-row-5.png" },
  { id: 16, src: "https://tailwindcss.com/plus-assets/img/heroes/ui-blocks-col-3-row-6.png" },
  { id: 17, src: "https://tailwindcss.com/plus-assets/img/heroes/ui-blocks-col-3-row-7.png" },
  { id: 18, src: "https://tailwindcss.com/plus-assets/img/heroes/ui-blocks-col-4-row-1.png" },
  { id: 19, src: "https://tailwindcss.com/plus-assets/img/heroes/ui-blocks-col-4-row-2.png" },
  { id: 20, src: "https://tailwindcss.com/plus-assets/img/heroes/ui-blocks-col-4-row-3.png" },
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
  const [nextImageId, setNextImageId] = useState(sampleImages.length + 1);

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

  const recalculateBounding = () => {
    if (canvasRef.current) {
      canvasRef.current.calculateBounding();
    }
  };

  const addImageFromUrl = (url) => {
    const newImage = {
      id: nextImageId,
      src: url
    };
    setImageOrder(prev => [...prev, newImage]);
    setNextImageId(prev => prev + 1);
  };

  const removeImage = (id) => {
    setImageOrder(prev => prev.filter(img => img.id !== id));
  };

  const loadSampleImages = () => {
    setImageOrder(sampleImages);
    setNextImageId(sampleImages.length + 1);
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    files.forEach((file) => {
      if (file.type.startsWith("image/")) {
        const url = URL.createObjectURL(file);
        const newImage = {
          id: nextImageId,
          src: url
        };
        setImageOrder(prev => [...prev, newImage]);
        setNextImageId(prev => prev + 1);
      }
    });
    event.target.value = "";
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

  // Image Variable
  const images = Array.from({ length: controls.repeat }, (_, repeatIndex) =>
    imageOrder.map((image, imageIndex) => 
      repeatIndex === 0 ? image : { ...image, id: nextImageId + (repeatIndex - 1) * imageOrder.length + imageIndex }
    )
  ).flat();
  useEffect(() => {
    if (controls.repeat > 1 && imageOrder.length > 0) {
      setNextImageId(prev => prev + (controls.repeat - 1) * imageOrder.length);
    }
  }, [controls.repeat, imageOrder.length]);

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
              images={images}
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
              imageOrder={imageOrder} //
              loadSampleImages={loadSampleImages}
              handleFileUpload={handleFileUpload}
              addImageFromUrl={addImageFromUrl}
              removeImage={removeImage}
              setImageOrder={setImageOrder}
              resetView={resetView}
              recalculateBounding={recalculateBounding}
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
