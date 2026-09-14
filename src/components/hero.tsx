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
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.2, 1]);

  return <div className="home-hero-scene" data-testid="home-hero-scene" ref={sceneRef}>
    <div className="home-hero-sticky">
      <section className="home-hero" aria-labelledby="home-hero-heading">
        <motion.div className="home-hero__media" style={{ scale: reduceMotion ? 1 : imageScale }}>
          <Image className="home-hero__image" src={heroAssets.home.src} alt={alt} fill priority sizes="100vw" />
        </motion.div>
        <div className="home-hero__overlay" />
        <Container className="home-hero__content"><p className="eyebrow home-hero__eyebrow">{eyebrow}</p><h1 id="home-hero-heading">{heading}</h1><p className="home-hero__body">{body}</p>
          <div className="home-hero__actions"><ButtonLink href="#contact">{primaryCta}</ButtonLink><ButtonLink href={serviceHref} variant="secondary">{secondaryCta}</ButtonLink></div>
        </Container>
      </section>
    </div>
  </div>;
}
