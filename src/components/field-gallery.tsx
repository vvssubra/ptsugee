"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { FieldImage } from "@/content/field-images";

export type GalleryCopy = { all: string; photos: string; filters: string; view: string; close: string; previous: string; next: string };

export function FieldGallery({ images, categories, copy }: { images: FieldImage[]; categories: Record<string, string>; copy: GalleryCopy }) {
  const [category, setCategory] = useState("all");
  const [active, setActive] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const visible = category === "all" ? images : images.filter((image) => image.category === category);
  const selected = visible[active];

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    const onKey = (event: KeyboardEvent) => {
      if (!element.open) return;
      if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        event.preventDefault();
        setActive((value) => (value + (event.key === "ArrowRight" ? 1 : -1) + visible.length) % visible.length);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [visible.length]);

  return <div className="field-gallery">
    <div className="field-gallery__toolbar">
      <div className="field-gallery__filters" role="group" aria-label={copy.filters}>
        <button type="button" aria-pressed={category === "all"} onClick={() => { setCategory("all"); setActive(0); }}>{copy.all}</button>
        {Object.entries(categories).filter(([key]) => images.some((image) => image.category === key)).map(([key, label]) => <button type="button" key={key} aria-pressed={category === key} onClick={() => { setCategory(key); setActive(0); }}>{label}</button>)}
      </div>
      <p className="field-gallery__count" role="status">{visible.length} {copy.photos}</p>
    </div>
    <div className="field-gallery__grid">
      {visible.map((image, index) => <figure className="field-gallery__card" key={image.id}>
        <button type="button" className="field-gallery__photo" aria-label={`${copy.view}: ${image.title}`} onClick={() => { setActive(index); dialog.current?.showModal(); }}>
          <Image src={image.src} alt={image.alt} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />
          <span className="field-gallery__expand" aria-hidden="true">↗</span>
        </button>
        <figcaption><p className="field-gallery__category">{categories[image.category]}</p><h2>{image.title}</h2>{image.location && <p className="field-gallery__location">{image.location}</p>}</figcaption>
      </figure>)}
    </div>
    <dialog className="field-gallery__dialog" ref={dialog} aria-labelledby="field-photo-title" onClick={(event) => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
      {selected && <div className="field-gallery__viewer">
        <div className="field-gallery__viewer-top"><span aria-live="polite">{active + 1} / {visible.length}</span><button autoFocus type="button" aria-label={copy.close} onClick={() => dialog.current?.close()}>✕</button></div>
        <div className="field-gallery__full-photo"><Image src={selected.src} alt={selected.alt} fill sizes="95vw" /></div>
        <div className="field-gallery__viewer-bottom"><div><p className="field-gallery__category">{categories[selected.category]}</p><h2 id="field-photo-title">{selected.title}</h2>{selected.location && <p>{selected.location}</p>}</div><div className="field-gallery__arrows"><button type="button" aria-label={copy.previous} onClick={() => setActive((active + visible.length - 1) % visible.length)}>←</button><button type="button" aria-label={copy.next} onClick={() => setActive((active + 1) % visible.length)}>→</button></div></div>
      </div>}
    </dialog>
  </div>;
}
