"use client";
import Image from "next/image";
import { motion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { serviceSlugs, type ServiceSlug } from "@/content/types";
import type { ProjectGalleryResult } from "@/sanity/lib/fetch-projects";

const AUTOPLAY_MS = 5_000;
const RESUME_AFTER_MS = 8_000;

type Props = {
  gallery: ProjectGalleryResult;
  emptyMessage: string;
  unavailableMessage: string;
  previousLabel: string;
  nextLabel: string;
  pauseLabel: string;
  playLabel: string;
  slideshowLabel: string;
  filtersLabel: string;
  allServicesLabel: string;
  serviceLabels: Record<ServiceSlug, string>;
};

export function ProjectGallery({ gallery, emptyMessage, unavailableMessage, previousLabel, nextLabel, pauseLabel, playLabel, slideshowLabel, filtersLabel, allServicesLabel, serviceLabels }: Props) {
  const track = useRef<HTMLDivElement>(null);
  const [activeService, setActiveService] = useState<ServiceSlug | "all">("all");
  const [manuallyPaused, setManuallyPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  // A tap, swipe, key press or arrow click pauses autoplay briefly; only the pause button stops it.
  const resumeAt = useRef(0);
  const touched = useRef(false);
  const holdAutoplay = useCallback(() => { resumeAt.current = Date.now() + RESUME_AFTER_MS; }, []);
  const categories = useMemo(() => gallery.status === "ready"
    ? serviceSlugs.filter((slug) => gallery.projects.some((project) => project.serviceCategory === slug))
    : [], [gallery]);
  const projects = gallery.status === "ready" ? gallery.projects : [];
  const visibleProjects = activeService === "all" ? projects : projects.filter((project) => project.serviceCategory === activeService);
  const slideCount = visibleProjects.reduce((count, project) => count + project.images.length, 0);
  const scroll = useCallback((direction: number) => {
    const element = track.current;
    if (!element) return;
    const behavior = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
    const distance = Math.min(element.clientWidth * 0.8, 720);
    const hasOverflow = element.scrollWidth > element.clientWidth;
    const atEnd = hasOverflow && element.scrollLeft + element.clientWidth >= element.scrollWidth - 8;
    const atStart = hasOverflow && element.scrollLeft <= 8;

    if (direction > 0 && atEnd) element.scrollTo({ left: 0, behavior });
    else if (direction < 0 && atStart) element.scrollTo({ left: element.scrollWidth, behavior });
    else element.scrollBy({ left: direction * distance, behavior });
  }, []);

  useEffect(() => {
    // With reduced motion the slides still advance, but jump instead of gliding (see `scroll`).
    if (gallery.status !== "ready" || slideCount < 2 || manuallyPaused || hovered) return;
    const timer = window.setInterval(() => {
      if (Date.now() < resumeAt.current || document.hidden) return;
      scroll(1);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [gallery.status, hovered, manuallyPaused, scroll, slideCount]);

  if (gallery.status !== "ready") return <p className="project-gallery__state">{gallery.status === "empty" ? emptyMessage : unavailableMessage}</p>;

  return <div className="project-gallery" role="region" aria-label={slideshowLabel} onTouchStart={() => { touched.current = true; }} onMouseEnter={() => { if (!touched.current) setHovered(true); }} onMouseLeave={() => setHovered(false)}><div className="project-gallery__toolbar">
    <div className="project-gallery__filters" role="group" aria-label={filtersLabel}>
      <button type="button" aria-pressed={activeService === "all"} onClick={() => setActiveService("all")}>{allServicesLabel}</button>
      {categories.map((category) => <button type="button" aria-pressed={activeService === category} key={category} onClick={() => setActiveService(category)}>{serviceLabels[category]}</button>)}
    </div>
    <div className="project-gallery__controls">
    <motion.button whileTap={{ scale: 0.96 }} type="button" aria-label={manuallyPaused ? playLabel : pauseLabel} aria-pressed={manuallyPaused} onClick={() => setManuallyPaused((paused) => !paused)}>{manuallyPaused ? "▶" : "Ⅱ"}</motion.button>
    <motion.button whileTap={{ scale: 0.96 }} type="button" aria-label={previousLabel} onClick={() => { holdAutoplay(); scroll(-1); }}>←</motion.button><motion.button whileTap={{ scale: 0.96 }} type="button" aria-label={nextLabel} onClick={() => { holdAutoplay(); scroll(1); }}>→</motion.button>
    </div>
  </div><div className="project-gallery__track" ref={track} tabIndex={0} aria-live="off" onPointerDown={holdAutoplay} onTouchStart={holdAutoplay} onWheel={holdAutoplay} onKeyDown={holdAutoplay}>{visibleProjects.flatMap((project) => project.images.map((item) =>
    <article className="project-card" key={`${project.id}-${item.key}`}><div className="project-card__media"><Image src={item.asset.url} alt={item.alt} fill sizes="(min-width: 1024px) 55vw, 85vw" placeholder={item.asset.lqip ? "blur" : "empty"} blurDataURL={item.asset.lqip} /></div><div className="project-card__content"><h3>{project.title}</h3><p>{project.location}{project.completionYear ? ` · ${project.completionYear}` : ""}</p>{item.caption ? <p className="project-card__caption">{item.caption}</p> : null}</div></article>
  ))}</div></div>;
}
