"use client";
import Image from "next/image";
import { motion } from "motion/react";
import { useMemo, useRef, useState } from "react";
import { serviceSlugs, type ServiceSlug } from "@/content/types";
import type { ProjectGalleryResult } from "@/sanity/lib/fetch-projects";

type Props = {
  gallery: ProjectGalleryResult;
  emptyMessage: string;
  unavailableMessage: string;
  previousLabel: string;
  nextLabel: string;
  filtersLabel: string;
  allServicesLabel: string;
  serviceLabels: Record<ServiceSlug, string>;
};

export function ProjectGallery({ gallery, emptyMessage, unavailableMessage, previousLabel, nextLabel, filtersLabel, allServicesLabel, serviceLabels }: Props) {
  const track = useRef<HTMLDivElement>(null);
  const [activeService, setActiveService] = useState<ServiceSlug | "all">("all");
  const categories = useMemo(() => gallery.status === "ready"
    ? serviceSlugs.filter((slug) => gallery.projects.some((project) => project.serviceCategory === slug))
    : [], [gallery]);

  if (gallery.status !== "ready") return <p className="project-gallery__state">{gallery.status === "empty" ? emptyMessage : unavailableMessage}</p>;

  const visibleProjects = activeService === "all" ? gallery.projects : gallery.projects.filter((project) => project.serviceCategory === activeService);
  const scroll = (direction: number) => track.current?.scrollBy({
    left: direction * Math.min(track.current.clientWidth * 0.8, 720),
    behavior: window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
  });

  return <div className="project-gallery"><div className="project-gallery__toolbar">
    <div className="project-gallery__filters" role="group" aria-label={filtersLabel}>
      <button type="button" aria-pressed={activeService === "all"} onClick={() => setActiveService("all")}>{allServicesLabel}</button>
      {categories.map((category) => <button type="button" aria-pressed={activeService === category} key={category} onClick={() => setActiveService(category)}>{serviceLabels[category]}</button>)}
    </div>
    <div className="project-gallery__controls">
    <motion.button whileTap={{ scale: 0.96 }} type="button" aria-label={previousLabel} onClick={() => scroll(-1)}>←</motion.button><motion.button whileTap={{ scale: 0.96 }} type="button" aria-label={nextLabel} onClick={() => scroll(1)}>→</motion.button>
    </div>
  </div><div className="project-gallery__track" ref={track}>{visibleProjects.flatMap((project) => project.images.map((item) =>
    <article className="project-card" key={`${project.id}-${item.key}`}><div className="project-card__media" style={{ aspectRatio: item.asset.aspectRatio }}><Image src={item.asset.url} alt={item.alt} fill sizes="(min-width: 1024px) 55vw, 85vw" placeholder={item.asset.lqip ? "blur" : "empty"} blurDataURL={item.asset.lqip} /></div><div className="project-card__content"><h3>{project.title}</h3><p>{project.location}{project.completionYear ? ` · ${project.completionYear}` : ""}</p>{item.caption ? <p className="project-card__caption">{item.caption}</p> : null}</div></article>
  ))}</div></div>;
}
