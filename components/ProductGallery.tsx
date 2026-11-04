"use client";

import Image from "next/image";
import { useState } from "react";

export default function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);

  return (
    <div className="flex flex-col gap-3 sm:flex-row-reverse">
      <div className="relative aspect-[4/5] flex-1 overflow-hidden rounded-sm bg-sand">
        <Image
          key={images[active]}
          src={images[active]}
          alt={alt}
          fill
          priority
          sizes="(min-width: 1024px) 55vw, 100vw"
          className="object-cover"
        />
      </div>
      {images.length > 1 && (
        <ul className="flex gap-3 sm:w-20 sm:flex-col">
          {images.map((src, i) => (
            <li key={src}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Afficher la photo ${i + 1}`}
                aria-pressed={i === active}
                className={`relative block aspect-square w-20 overflow-hidden rounded-sm border-2 ${
                  i === active ? "border-ink" : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <Image src={src} alt="" fill sizes="80px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
