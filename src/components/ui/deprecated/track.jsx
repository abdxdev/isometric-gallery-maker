import React from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

export const Track = ({
  columns,
  images,
  columnCount,
  columnWidth,
  className,
  containerClassName,
  gridClassName,
}) => {
  let processedColumns = [];
  if (Array.isArray(columns)) {
    processedColumns = columns;
  } else if (Array.isArray(images)) {
    processedColumns = images.map((columnImages, index) => {
      const translateYValues = [826.452, 673.548, 826.452, 1323.55];
      return {
        translateY: translateYValues[index % translateYValues.length],
        images: columnImages.map((img) => ({
          src: img.src,
          alt: img.alt || "",
          width: img.width || columnWidth,
          height: img.height || 1000,
          className: img.className,
        })),
      };
    });
  }

  const actualColumnCount = columnCount || processedColumns.length || 4;
  return (
    <div className={cn("max-xl:line-t relative max-xl:h-84 outline bg-gray-50 outline-gray-950/5", className)}>
      <div className={cn("absolute inset-0", containerClassName)}>
        <div className="[--right:45%] flex size-full items-center justify-center overflow-scroll">
          <div className="size-430 shrink-0 scale-50 sm:scale-75 lg:scale-100">
            <div
              className={cn(
                "relative top-(--top,30%) right-(--right,54%) grid size-full origin-top-left rotate-x-55 rotate-y-0 -rotate-z-45 gap-8 transform-3d",
                gridClassName
              )}
              style={{
                gridTemplateColumns: `repeat(${actualColumnCount}, minmax(0, 1fr))`
              }}
            >
              {processedColumns.map((column, colIndex) => (
                <div
                  key={colIndex}
                  className="flex flex-col gap-8"
                  style={{
                    transform: column.translateY ? `translateY(${column.translateY}px)` : undefined
                  }}
                >                  {column.images.map((image, imgIndex) => (
                    <Image
                      key={imgIndex}
                      src={image.src}
                      alt={image.alt || ""}
                      width={image.width || columnWidth}
                      height={image.height || 500}
                      className={cn(
                        `aspect-auto ring ring-gray-950/5`,
                        image.className
                      )}
                      priority={colIndex === 0 && imgIndex === 0}
                      quality={100}
                      // sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};