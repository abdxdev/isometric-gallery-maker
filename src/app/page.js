import Image from "next/image";
import { Tract } from "@/components/ui/track";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Tract
          images={[
            [
              { src: "https://tailwindcss.com/plus-assets/img/heroes/ui-blocks-col-1-row-1.png", alt: "UI Block" },
              { src: "https://tailwindcss.com/plus-assets/img/heroes/ui-blocks-col-1-row-2.png", alt: "UI Block" },
              { src: "https://tailwindcss.com/plus-assets/img/heroes/ui-blocks-col-1-row-3.png", alt: "UI Block" },
              { src: "https://tailwindcss.com/plus-assets/img/heroes/ui-blocks-col-1-row-4.png", alt: "UI Block" }
            ],
            [
              { src: "https://tailwindcss.com/plus-assets/img/heroes/ui-blocks-col-2-row-1.png", alt: "UI Block" },
              { src: "https://tailwindcss.com/plus-assets/img/heroes/ui-blocks-col-2-row-2.png", alt: "UI Block" },
              { src: "https://tailwindcss.com/plus-assets/img/heroes/ui-blocks-col-2-row-3.png", alt: "UI Block" },
              { src: "https://tailwindcss.com/plus-assets/img/heroes/ui-blocks-col-2-row-4.png", alt: "UI Block" },
              { src: "https://tailwindcss.com/plus-assets/img/heroes/ui-blocks-col-2-row-5.png", alt: "UI Block" },
              { src: "https://tailwindcss.com/plus-assets/img/heroes/ui-blocks-col-2-row-6.png", alt: "UI Block" }
            ],
            [
              { src: "https://tailwindcss.com/plus-assets/img/heroes/ui-blocks-col-3-row-1.png", alt: "UI Block" },
              { src: "https://tailwindcss.com/plus-assets/img/heroes/ui-blocks-col-3-row-2.png", alt: "UI Block" },
              { src: "https://tailwindcss.com/plus-assets/img/heroes/ui-blocks-col-3-row-3.png", alt: "UI Block" },
              { src: "https://tailwindcss.com/plus-assets/img/heroes/ui-blocks-col-3-row-4.png", alt: "UI Block" },
              { src: "https://tailwindcss.com/plus-assets/img/heroes/ui-blocks-col-3-row-5.png", alt: "UI Block" },
              { src: "https://tailwindcss.com/plus-assets/img/heroes/ui-blocks-col-3-row-6.png", alt: "UI Block" },
              { src: "https://tailwindcss.com/plus-assets/img/heroes/ui-blocks-col-3-row-7.png", alt: "UI Block" }
            ],
            [
              { src: "https://tailwindcss.com/plus-assets/img/heroes/ui-blocks-col-4-row-1.png", alt: "UI Block" },
              { src: "https://tailwindcss.com/plus-assets/img/heroes/ui-blocks-col-4-row-2.png", alt: "UI Block" },
              { src: "https://tailwindcss.com/plus-assets/img/heroes/ui-blocks-col-4-row-3.png", alt: "UI Block" }
            ]
          ]}
          columnWidth={1200}
          className="relative h-[700px] aspect-video"
        />

      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
      </footer>
    </div>
  );
}
