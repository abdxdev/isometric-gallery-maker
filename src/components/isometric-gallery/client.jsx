"use client";

import { InfiniteCanvas } from "@/components/ui/infinite-gallery";
import { SidebarPortal } from "@/components/sidebar";
import { SidebarControls } from "@/components/isometric-gallery/sidebar-controls";
import { useRef, useState } from "react";
import { WelcomeDialog } from "@/components/welcome-dialog";
import { ImageIcon } from "lucide-react";

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

export default function Client() {
	const defaultControls = {
		repeat: 1,
		columns: 4,
		gap: 30,
		backgroundColor: "rgba(249, 250, 251, 1)",
		borderColor: "rgba(3, 7, 18, 0.1)",
		borderThickness: 4,
		imageRadius: 0, // new roundness control in px
		rotateXOuter: 35.264,
		rotateYOuter: -45,
	};
	const [controls, setControls] = useState(defaultControls);
	const [images, setImages] = useState([]);
	const [nextImageId, setNextImageId] = useState(sampleImages.length + 1);
	const canvasRef = useRef();
	const updateControl = (key, value) => setControls((prev) => ({ ...prev, [key]: value }));
	const resetControl = (key) => setControls((prev) => ({ ...prev, [key]: defaultControls[key] }));
	const resetView = () => canvasRef.current?.resetView?.();
	const recalculateBounding = () => canvasRef.current?.calculateBounding?.();
	const addImageFromUrl = (url) => {
		setImages((prev) => {
			let newId;
			setNextImageId((prevId) => {
				newId = prevId;
				return prevId + 1;
			});
			return [...prev, { id: newId, src: url }];
		});
	};
	const removeImage = (id) => setImages((prev) => prev.filter((i) => i.id !== id));
	const loadSampleImages = () => { setImages(sampleImages); setNextImageId(sampleImages.length + 1); };
	const handleFileUpload = (e) => {
		const files = Array.from(e.target.files || []).filter((f) => f.type.startsWith("image/"));
		if (!files.length) {
			if (e?.target) e.target.value = "";
			return;
		}
		setImages((prev) => {
			let startId;
			setNextImageId((prevId) => {
				startId = prevId;
				return prevId + files.length;
			});
			const newImages = files.map((file, i) => ({ id: startId + i, src: URL.createObjectURL(file) }));
			return [...prev, ...newImages];
		});
		if (e?.target) e.target.value = "";
	};
	const onHighlightImage = (id) => { canvasRef.current?.highlightImage?.(id); };

	return (
		<>
			<WelcomeDialog
				storageKey="isometric-gallery-welcome"
				title="Welcome to Isometric Gallery"
				description={(
					<>
						<p>Create stunning isometric mockups from your screenshots.</p>
						<p>Load sample images to explore the features quickly.</p>
					</>
				)}
				primaryAction={{ label: "Load Samples", onClick: loadSampleImages, icon: <ImageIcon className="w-4 h-4 mr-1" /> }}
				secondaryAction={{ label: "Start Empty" }}
			/>
			<SidebarPortal>
				<SidebarControls
					controls={controls}
					updateControl={updateControl}
					resetControl={resetControl}
					images={images}
					loadSampleImages={loadSampleImages}
					handleFileUpload={handleFileUpload}
					addImageFromUrl={addImageFromUrl}
					removeImage={removeImage}
					setImages={setImages}
					resetView={resetView}
					recalculateBounding={recalculateBounding}
					onHighlightImage={onHighlightImage}
				/>
			</SidebarPortal>
			<InfiniteCanvas ref={canvasRef} images={images} className="w-full h-full" controls={controls} />
		</>
	);
}
