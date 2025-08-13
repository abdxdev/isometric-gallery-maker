"use client";

import { useRef, useState, useEffect, useCallback, forwardRef, useImperativeHandle } from "react";
import { ReactInfiniteCanvas } from "react-infinite-canvas";
import { cn } from "@/lib/utils";
import { calculateIsometricBoundingBox } from "@/lib/isometric-bounding-box";
import Image from "next/image";

export const InfiniteCanvas = forwardRef(function InfiniteCanvas({ images, className, controls }, ref) {
  const contentRef = useRef();
  const internalCanvasRef = useRef();
  const isStabilizingRef = useRef(false);
  const debounceTimerRef = useRef(null);

  const [dimensions, setDimensions] = useState({ width: "100%", height: "100%" });
  const [highlightedImageId, setHighlightedImageId] = useState(null);

  const resetView = () => {
    if (internalCanvasRef.current) {
      internalCanvasRef.current.fitContentToView({});
      internalCanvasRef.current.scrollNodeToCenter({});
    }
  };

  const highlightImage = (imageId) => {
    setHighlightedImageId(imageId);
    setTimeout(() => setHighlightedImageId(null), 3000);
  };

  const calculateBounding = useCallback(() => {
    if (!contentRef.current || isStabilizingRef.current) return;

    isStabilizingRef.current = true;
    let previousDimensions = null;
    let iterations = 0;
    const maxIterations = 20;

    const stabilize = () => {
      if (!contentRef.current || iterations >= maxIterations) {
        isStabilizingRef.current = false;
        if (iterations >= maxIterations) {
          console.log("Max iterations reached, stopping stabilization");
        }
        if (internalCanvasRef.current) {
          setTimeout(() => {
            resetView();
          }, 100);
        }
        return;
      }

      const current = {
        width: contentRef.current.offsetWidth,
        height: contentRef.current.offsetHeight,
      };

      if (previousDimensions && Math.abs(current.width - previousDimensions.width) < 0.5 && Math.abs(current.height - previousDimensions.height) < 0.5) {
        isStabilizingRef.current = false;
        if (internalCanvasRef.current) {
          setTimeout(() => {
            resetView();
          }, 100);
        }
        return;
      }

      previousDimensions = { ...current };
      iterations++;

      const result = calculateIsometricBoundingBox(current.width, current.height, controls.rotateXOuter, controls.rotateYOuter);

      setDimensions({
        width: result.width,
        height: result.height,
      });

      // Use requestAnimationFrame to allow the DOM to update before next calculation
      requestAnimationFrame(() => {
        setTimeout(stabilize, 10);
      });
    };

    stabilize();
  }, [controls.rotateXOuter, controls.rotateYOuter]);

  useEffect(() => {
    if (contentRef.current) {
      calculateBounding();
      console.log("useEffect: Calculating bounding box with stabilization");
    }
  }, [controls.rotateXOuter, controls.rotateYOuter, calculateBounding]);

  useEffect(() => {
    if (!contentRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      for (const entry of entries) {
        if (entry.contentRect.width > 0 && entry.contentRect.height > 0 && !isStabilizingRef.current) {
          console.log("Content resized, triggering stabilization");
          calculateBounding();
        }
      }
    });

    resizeObserver.observe(contentRef.current);

    return () => {
      resizeObserver.disconnect();
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [calculateBounding]);
  useImperativeHandle(
    ref,
    () => ({
      resetView,
      calculateBounding,
      highlightImage,
    }),
    [resetView, calculateBounding, highlightImage]
  );

  return (
    <div className={cn("overflow-visible", className)} style={{ backgroundColor: controls.backgroundColor }}>
      <ReactInfiniteCanvas ref={internalCanvasRef}>
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
              transform: `rotateX(${controls.rotateXOuter}deg) rotateY(${controls.rotateYOuter}deg)`,
              transformStyle: "preserve-3d",
              position: "relative",
            }}
          >
            <div
              ref={contentRef}
              className="gap-10 space-y-4"
              style={{
                columns: controls.columns,
                columnGap: `${controls.gap}px`,
                transform: `rotateX(-90deg)`,
                transformOrigin: "center center",
                position: "relative",
                transition: "opacity 0.3s ease-in-out",
              }}
            >
              {Array.from({ length: controls.repeat }).map((_, repIdx) => (
                images.map((image) => (
                  <div key={`${repIdx}-${image.id}`} className="break-inside-avoid" style={{ marginBottom: `${controls.gap}px` }}>
                    <div className="relative">
                      <Image
                        height={1080}
                        width={1920}
                        className="object-cover object-center min-w-[1280px] min-h-[720px]"
                        src={image.src}
                        alt={`gallery-photo-${image.id}`}
                        style={{
                          border: `${controls.borderThickness}px solid ${controls.borderColor}`,
                          borderRadius: controls.imageRadius ? `${controls.imageRadius}px` : undefined,
                        }}
                      />
                      <div className={cn("absolute inset-0 pointer-events-none border-2 transition-all duration-300 ease-in-out", highlightedImageId === image.id ? "border-blue-500 bg-blue-500/30 opacity-100" : "border-transparent bg-transparent opacity-0")} />
                    </div>
                  </div>
                ))
              ))}
            </div>
          </div>
        </div>
      </ReactInfiniteCanvas>
    </div>
  );
});
