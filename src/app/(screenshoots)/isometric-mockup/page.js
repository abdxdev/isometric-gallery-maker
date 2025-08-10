"use client";

import { InfiniteCanvas } from "@/components/ui/infinite-gallery";
import { SidebarPortal } from "@/components/sidebar-portal";
import { IsometricControls } from "@/components/sidebars/isometric-controls";
import { useMemo, useRef, useState } from "react";

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

export default function Page() {
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

  const updateControl = (key, value) => setControls(prev => ({ ...prev, [key]: value }));
  const resetControl = (key) => setControls(prev => ({ ...prev, [key]: defaultControls[key] }));

  const resetView = () => canvasRef.current?.resetView?.();
  const recalculateBounding = () => canvasRef.current?.calculateBounding?.();

  const addImageFromUrl = (url) => { setImageOrder(prev => [...prev, { id: nextImageId, src: url }]); setNextImageId(prev => prev + 1); };
  const removeImage = (id) => setImageOrder(prev => prev.filter(i => i.id !== id));
  const loadSampleImages = () => { setImageOrder(sampleImages); setNextImageId(sampleImages.length + 1); };
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      if (file.type.startsWith("image/")) {
        const url = URL.createObjectURL(file);
        addImageFromUrl(url);
      }
    });
    if (e?.target) e.target.value = "";
  };
  const onHighlightImage = (id) => canvasRef.current?.highlightImage?.(id);
  const onCapture = () => console.log("Capture clicked");

  const repeatedImages = useMemo(() => {
    const result = [];
    for (let i = 0; i < controls.repeat; i++) result.push(...imageOrder);
    return result;
  }, [imageOrder, controls.repeat]);

  return (
    <>
      <SidebarPortal>
        <IsometricControls
          controls={controls}
          updateControl={updateControl}
          resetControl={resetControl}
          imageOrder={imageOrder}
          loadSampleImages={loadSampleImages}
          handleFileUpload={handleFileUpload}
          addImageFromUrl={addImageFromUrl}
          removeImage={removeImage}
          setImageOrder={setImageOrder}
          resetView={resetView}
          recalculateBounding={recalculateBounding}
          onCapture={onCapture}
          onHighlightImage={onHighlightImage}
        />
      </SidebarPortal>

      <div className="w-full h-full">
        <InfiniteCanvas ref={canvasRef} images={repeatedImages} className="w-full h-full" controls={controls} />
      </div>
    </>
  );
}
