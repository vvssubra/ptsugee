"use client";
import Image from "next/image";
import { motion } from "motion/react";
import { useRef } from "react";
import type { ProjectGalleryResult } from "@/sanity/lib/fetch-projects";

type Props = { gallery: ProjectGalleryResult; emptyMessage: string; unavailableMessage: string; previousLabel: string; nextLabel: string };
export function ProjectGallery({ gallery, emptyMessage, unavailableMessage, previousLabel, nextLabel }: Props) {
  const track = useRef<HTMLDivElement>(null);
  if (gallery.status !== "ready") return <p className="project-gallery__state">{gallery.status === "empty" ? emptyMessage : unavailableMessage}</p>;
  const scroll = (direction: number) => track.current?.scrollBy({ left: direction * Math.min(track.current.clientWidth * 0.8, 720), behavior: "smooth" });
  return <div className="project-gallery"><div className="project-gallery__controls">
    <motion.button whileTap={{ scale: 0.96 }} type="button" aria-label={previousLabel} onClick={() => scroll(-1)}>←</motion.button><motion.button whileTap={{ scale: 0.96 }} type="button" aria-label={nextLabel} onClick={() => scroll(1)}>→</motion.button>
  </div><div className="project-gallery__track" ref={track}>{gallery.projects.flatMap((project) => project.images.map((item) =>
    <article className="project-card" key={`${project.id}-${item.key}`}><div className="project-card__media" style={{ aspectRatio: item.asset.aspectRatio }}><Image src={item.asset.url} alt={item.alt} fill unoptimized sizes="(min-width: 1024px) 55vw, 85vw" /></div><div className="project-card__content"><h3>{project.title}</h3><p>{project.location}{project.completionYear ? ` · ${project.completionYear}` : ""}</p>{item.caption ? <p className="project-card__caption">{item.caption}</p> : null}</div></article>
  ))}</div></div>;
}
