"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Slide } from "@/lib/types";

export default function HeroSlider({
  slides,
  eyebrow,
  fallbackTitle,
  fallbackSubtitle,
}: {
  slides: Slide[];
  eyebrow: string;
  fallbackTitle: string;
  fallbackSubtitle: string;
}) {
  const [index, setIndex] = useState(0);
  const items = slides.length
    ? slides
    : [
        {
          id: "fallback",
          imageUrl: "",
          title: fallbackTitle,
          subtitle: fallbackSubtitle,
          buttonText: "Apply for Admission",
          buttonUrl: "/admissions/apply",
          order_num: 0,
          isActive: 1,
        },
      ];

  useEffect(() => {
    if (items.length < 2) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % items.length), 6000);
    return () => clearInterval(t);
  }, [items.length]);

  const current = items[index];

  return (
    <section className="relative overflow-hidden bg-primary-dark text-white">
      <div
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-700"
        style={{
          backgroundImage: current.imageUrl
            ? `linear-gradient(120deg, rgba(7,63,48,0.92), rgba(11,93,70,0.75)), url(${current.imageUrl})`
            : "linear-gradient(120deg, #073F30, #0B5D46 60%, #116A55)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "26px 26px",
        }}
      />

      <div className="container-site relative py-24 md:py-32 flex flex-col items-start">
        <span className="inline-block text-xs md:text-sm font-semibold tracking-widest uppercase text-accent mb-4 bg-white/10 px-3 py-1 rounded-full">
          {eyebrow}
        </span>
        <h1 className="font-heading font-extrabold max-w-3xl drop-shadow-sm">
          {current.title}
        </h1>
        {current.subtitle && (
          <p className="mt-5 max-w-2xl text-white/85 text-base md:text-lg leading-relaxed">
            {current.subtitle}
          </p>
        )}
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={current.buttonUrl || "/admissions/apply"} className="btn btn-accent">
            {current.buttonText || "Apply for Admission"}
          </Link>
          <Link href="/programs" className="btn bg-white/10 text-white hover:bg-white/20 backdrop-blur border border-white/20">
            Explore Programs
          </Link>
        </div>
      </div>

      {items.length > 1 && (
        <>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {items.map((s, i) => (
              <button
                key={s.id}
                aria-label={`Slide ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all ${i === index ? "w-8 bg-accent" : "w-3 bg-white/40"}`}
              />
            ))}
          </div>
          <button
            aria-label="Previous slide"
            onClick={() => setIndex((i) => (i - 1 + items.length) % items.length)}
            className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 items-center justify-center backdrop-blur"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            aria-label="Next slide"
            onClick={() => setIndex((i) => (i + 1) % items.length)}
            className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 items-center justify-center backdrop-blur"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}
    </section>
  );
}
