"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { heroAssets } from "@/content/assets";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";

type HeroProps = { alt: string; eyebrow: string; heading: string; body: string; primaryCta: string; secondaryCta: string; serviceHref: string };

export function Hero({ alt, eyebrow, heading, body, primaryCta, secondaryCta, serviceHref }: HeroProps) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: sceneRef, offset: ["start start", "end end"] });
  // Finish before the sticky scene releases, leaving a brief fully revealed view.
  const imageScale = useTransform(scrollYProgress, [0, 0.8, 1], [1.5, 1, 1]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.8, 1], [1, 0.75, 0.75]);

  return <div className="home-hero-scene" data-testid="home-hero-scene" ref={sceneRef}>
    <div className="home-hero-sticky">
      <section className="home-hero" aria-labelledby="home-hero-heading">
        <motion.div className="home-hero__media" style={{ scale: reduceMotion ? 1 : imageScale }}>
          <Image className="home-hero__image" src={heroAssets.home.src} alt={alt} fill priority sizes="100vw" />
        </motion.div>
        <motion.div className="home-hero__overlay" style={{ opacity: reduceMotion ? 1 : overlayOpacity }} />
        <Container className="home-hero__content"><p className="eyebrow home-hero__eyebrow">{eyebrow}</p><h1 id="home-hero-heading">{heading}</h1><p className="home-hero__body">{body}</p>
          <div className="home-hero__actions"><ButtonLink href="#contact">{primaryCta}</ButtonLink><ButtonLink href={serviceHref} variant="secondary">{secondaryCta}</ButtonLink></div>
        </Container>
      </section>
    </div>
  </div>;
}
