"use client";

import { useRef, useState, useEffect, useCallback, forwardRef, useImperativeHandle } from "react";
import { ReactInfiniteCanvas, ReactInfiniteCanvasHandle } from "react-infinite-canvas";
import { cn } from "@/lib/utils";
import { calculateIsometricBoundingBox } from "@/lib/isometric-bounding-box";

// Helper function to convert hex color to RGBA with opacity
const hexToRgba = (hex, opacity) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (result) {
    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  return hex; // fallback to original color if parsing fails
};

export const InfiniteCanvas = forwardRef(function InfiniteCanvas({ images, className, columns = 4, controls, style }, ref) {
  const canvasRef = useRef();
  const contentRef = useRef();  const [dimensions, setDimensions] = useState({ width: "100%", height: "100%" });
  const [height, setHeight] = useState(0);
  const [highlightedImageId, setHighlightedImageId] = useState(null);
  const [isHighlightVisible, setIsHighlightVisible] = useState(false);
  
  const resetView = useCallback(() => {
    if (canvasRef.current) {
      canvasRef.current.fitContentToView({
        // offset: {
        //   x: 0,
        //   y: -400,
        // },
        // duration: 0,
      });
      canvasRef.current.scrollNodeToCenter({});
      // canvasRef.current.scrollNodeHandler({ nodeElement, offset, scale: 1, shouldUpdateMaxScale, maxScale, transitionDuration, position });
    }
  }, []);

  const highlightImage = useCallback((imageId) => {
    setHighlightedImageId(imageId);
    setIsHighlightVisible(true);
    
    // Start fade out after 2.7 seconds
    setTimeout(() => {
      setIsHighlightVisible(false);
    }, 2700);
    
    // Remove highlight completely after 3 seconds (including fade transition)
    setTimeout(() => {
      setHighlightedImageId(null);
    }, 3000);
  }, []);
  // Expose resetView function to parent component
  useImperativeHandle(
    ref,
    () => ({
      resetView,
      highlightImage,
    }),
    [resetView, highlightImage]
  );
  useEffect(() => {
    if (contentRef.current && images.length > 0) {
      // Small delay to let images start loading
      const timer = setTimeout(calculatePadding, 300);
      return () => clearTimeout(timer);
    }
  }, [images, controls]);

  const calculatePadding = () => {
    if (!contentRef.current) return;
    const original = {
      width: contentRef.current.offsetWidth,
      height: contentRef.current.offsetHeight,
    };
    setHeight(original.height);
    // Calculate isometric bounding box
    const result = calculateIsometricBoundingBox(original.width, original.height);
    setDimensions({
      width: result.width,
      height: result.height,
    });
    console.log("Original dimensions:", original);
    console.log("Calculated dimensions:", result);
  };
  return (
    <div
      className={cn("overflow-visible", className)}
      style={{
        backgroundColor: controls?.backgroundColor || "#f9fafb",
        ...style,
      }}
    >
      <ReactInfiniteCanvas ref={canvasRef} onCanvasMount={resetView}>
        <div
          className="flex items-center justify-center outline-gray-950"
          style={{
            width: dimensions.width,
            height: dimensions.height,
            transformOrigin: "center center",
          }}
        >
          <div
            style={{
              transform: "rotateX(35.264deg) rotateY(-45deg)",
              transformStyle: "preserve-3d",
              position: "relative",
            }}
          >
            <div
              ref={contentRef}
              className="gap-10 space-y-4"
              style={{
                columns: controls?.columns || columns,
                columnGap: `${controls?.gap || 10}px`,
                transform: `translate(-50%, -50%) rotateX(-90deg) translateZ(${height / 2}px)`,
                transformOrigin: "center center",
                position: "relative",
                left: "50%",
                top: "50%",
              }}
            >
              {images.map((image, index) => (
                <div key={index} className="break-inside-avoid" style={{ marginBottom: `${controls?.gap || 10}px` }}>
                  <div className="relative">
                    <img
                      className="w-full object-cover object-center"
                      src={image.src}
                      alt={`gallery-photo-${index}`}
                      style={{
                        border: `${controls?.borderThickness || 1}px solid ${hexToRgba(controls?.borderColor || "#000000", controls?.borderOpacity || 1)}`,
                      }}
                    />
                    {highlightedImageId === image.id && (
                      <div 
                        className={`absolute inset-0 border-10 border-blue-500 shadow-lg shadow-blue-500/30 transition-all duration-300 ease-in-out ${
                          isHighlightVisible ? 'opacity-100' : 'opacity-0'
                        }`} 
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ReactInfiniteCanvas>
    </div>
  );
});
