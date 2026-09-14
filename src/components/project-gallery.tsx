"use client";
import Image from "next/image";
import { motion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { serviceSlugs, type ServiceSlug } from "@/content/types";
import type { ProjectGalleryResult } from "@/sanity/lib/fetch-projects";

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
  const [interactionPaused, setInteractionPaused] = useState(false);
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
    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    if (gallery.status !== "ready" || slideCount < 2 || manuallyPaused || interactionPaused || reducedMotion) return;
    const timer = window.setInterval(() => scroll(1), 5_000);
    return () => window.clearInterval(timer);
  }, [gallery.status, interactionPaused, manuallyPaused, scroll, slideCount]);

  if (gallery.status !== "ready") return <p className="project-gallery__state">{gallery.status === "empty" ? emptyMessage : unavailableMessage}</p>;

  return <div className="project-gallery" role="region" aria-label={slideshowLabel} onMouseEnter={() => setInteractionPaused(true)} onMouseLeave={() => setInteractionPaused(false)}><div className="project-gallery__toolbar">
    <div className="project-gallery__filters" role="group" aria-label={filtersLabel}>
      <button type="button" aria-pressed={activeService === "all"} onClick={() => setActiveService("all")}>{allServicesLabel}</button>
      {categories.map((category) => <button type="button" aria-pressed={activeService === category} key={category} onClick={() => setActiveService(category)}>{serviceLabels[category]}</button>)}
    </div>
    <div className="project-gallery__controls">
    <motion.button whileTap={{ scale: 0.96 }} type="button" aria-label={manuallyPaused ? playLabel : pauseLabel} aria-pressed={manuallyPaused} onClick={() => setManuallyPaused((paused) => !paused)}>{manuallyPaused ? "▶" : "Ⅱ"}</motion.button>
    <motion.button whileTap={{ scale: 0.96 }} type="button" aria-label={previousLabel} onClick={() => { setManuallyPaused(true); scroll(-1); }}>←</motion.button><motion.button whileTap={{ scale: 0.96 }} type="button" aria-label={nextLabel} onClick={() => { setManuallyPaused(true); scroll(1); }}>→</motion.button>
    </div>
  </div><div className="project-gallery__track" ref={track} tabIndex={0} aria-live="off" onFocus={() => setInteractionPaused(true)} onBlur={() => setInteractionPaused(false)} onPointerDown={() => setManuallyPaused(true)}>{visibleProjects.flatMap((project) => project.images.map((item) =>
    <article className="project-card" key={`${project.id}-${item.key}`}><div className="project-card__media"><Image src={item.asset.url} alt={item.alt} fill sizes="(min-width: 1024px) 55vw, 85vw" placeholder={item.asset.lqip ? "blur" : "empty"} blurDataURL={item.asset.lqip} /></div><div className="project-card__content"><h3>{project.title}</h3><p>{project.location}{project.completionYear ? ` · ${project.completionYear}` : ""}</p>{item.caption ? <p className="project-card__caption">{item.caption}</p> : null}</div></article>
  ))}</div></div>;
}
