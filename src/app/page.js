"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check, ArrowLeft, ArrowRight, LayoutDashboard, Smartphone, Palette } from "lucide-react";

export default function Home() {
  const slides = [
    {
      title: "Isometric Gallery",
      desc: "Turn screenshots into polished isometric mockups with ease",
      color: "rgb(79, 70, 229)",
      img: "/images/image1.png",
      href: "/isometric-gallery",
    },
    {
      title: "Isometric Gallery",
      desc: "Turn screenshots into polished isometric mockups with ease",
      color: "rgb(14, 165, 233)",
      img: "/images/image2.png",
      href: "/isometric-gallery",
    },
    {
      title: "Screen Decorator",
      desc: "Easily create and customize device frames for your designs",
      color: "rgb(245, 158, 11)",
      img: "/images/image3.png",
      href: "/screen-decorator",
    },
    {
      title: "Screen Decorator",
      desc: "Easily create and customize device frames for your designs",
      color: "rgb(236, 72, 153)",
      img: "/images/image4.png",
      href: "/screen-decorator",
    }
  ];
  const [index, setIndex] = useState(0);
  const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length);
  const next = () => setIndex((i) => (i + 1) % slides.length);

  // auto-slide every 4s
  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 4000);
    return () => clearInterval(id);
  }, [slides.length]);

  return (
    <div className="relative bg-gradient-to-b from-background to-muted/30 h-full pt-24 pb-20 md:pt-32 md:pb-24">
      <div className="container mx-auto px-4 md:px-6 2xl:max-w-[1400px]">
        <div className="grid gap-12 md:grid-cols-2 md:gap-16 items-center">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium uppercase tracking-widest text-primary">
                Introducing
              </p>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
                Generate polished mockups fast.
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Turn screenshots into clean isometric sets or single framed showcases with fine control over angle, depth and export.
              </p>
            </div>
            <ul className="space-y-2 pt-4">
              {[
                "Isometric multi‑screen layouts",
                "Single screen framing & device masks",
                "Adjust angle, depth, glow & shadows",
                "Export transparent PNG / SVG",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Link href="/isometric-gallery">
                <Button size="lg">
                  Isometric Gallery
                </Button>
              </Link>
              <Link href="/isometric-gallery">
                <Button size="lg" variant="outline">
                  Screen Decorator
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="relative aspect-video overflow-hidden rounded-xl border shadow-xl">
              {slides.map((s, i) => (
                <div
                  key={`${s.title}-${i}`}
                  className="absolute inset-0 transition-opacity duration-500"
                  style={{
                    opacity: i === index ? 1 : 0,
                    zIndex: i === index ? 10 : 0,
                  }}
                  aria-hidden={i === index ? undefined : true}
                >
                  <Image
                    alt={s.title}
                    src={s.img}
                    fill
                    priority={i === index}
                    sizes="(max-width:768px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-xl font-bold text-white mb-1">
                      <Link href={s.href} className="inline-flex items-center gap-2 group">
                        <span>{s.title}</span>
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </h3>
                    <p className="text-white/80 text-sm">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="absolute -bottom-10 right-0 flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={prev}
                aria-label="Previous slide"
                className="rounded-full"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={next}
                aria-label="Next slide"
                className="rounded-full"
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="absolute -bottom-7 left-0 flex items-center gap-2">
              {slides.map((s, i) => (
                <button
                  key={`${s.title}-${i}`}
                  onClick={() => setIndex(i)}
                  className={`h-2.5 rounded-full transition-all ${i === index ? "w-8" : "w-2.5 opacity-50"
                    }`}
                  style={{ backgroundColor: slides[i].color }}
                  aria-label={`View ${s.title}`}
                  aria-current={i === index ? "true" : undefined}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
