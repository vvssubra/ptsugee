"use client";
import { motion, useReducedMotion } from "motion/react";
export function MotionReveal({ children }: { children: React.ReactNode }) {
  const reducedMotion = useReducedMotion();
  return <motion.div initial={reducedMotion ? false : { opacity: 1, y: 18 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: reducedMotion ? 0 : 0.5, ease: "easeOut" }} viewport={{ once: true, amount: 0.08 }}>{children}</motion.div>;
}
