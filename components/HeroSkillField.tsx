"use client";

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";

type Skill = { label: string; position: string; strength: number; phase: string };

const skills: Skill[] = [
  { label: "Machine Learning", position: "skill-chip--machine-learning", strength: 0.9, phase: "skill-chip-inner--one" },
  { label: "Applied AI", position: "skill-chip--applied-ai", strength: 0.85, phase: "skill-chip-inner--two" },
  { label: "Data Automation", position: "skill-chip--data-automation", strength: 1, phase: "skill-chip-inner--three" },
];

function SkillChip({ skill, pointerX, pointerY, reducedMotion, isVisible }: { skill: Skill; pointerX: ReturnType<typeof useSpring>; pointerY: ReturnType<typeof useSpring>; reducedMotion: boolean; isVisible: boolean }) {
  const x = useTransform(pointerX, value => value * skill.strength);
  const y = useTransform(pointerY, value => value * skill.strength);

  return (
    <motion.span
      className={`skill-chip ${skill.position}`}
      style={{ x, y }}
      whileHover={reducedMotion ? undefined : { scale: 1.04, y: -2 }}
      transition={{ duration: 0.16, ease: "easeOut" }}
    >
      <span className={`skill-chip-inner ${skill.phase}${isVisible ? "" : " is-offscreen"}`}>{skill.label}</span>
    </motion.span>
  );
}

export default function HeroSkillField() {
  const fieldRef = useRef<HTMLDivElement | null>(null);
  const reducedMotionPreference = useReducedMotion();
  const reducedMotion = reducedMotionPreference ?? false;
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const pointerX = useSpring(rawX, { stiffness: 180, damping: 24, mass: 0.45 });
  const pointerY = useSpring(rawY, { stiffness: 180, damping: 24, mass: 0.45 });
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const node = fieldRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { threshold: 0.08 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (reducedMotion || !fieldRef.current) return;
    const rect = fieldRef.current.getBoundingClientRect();
    rawX.set(Math.max(-5, Math.min(5, ((event.clientX - (rect.left + rect.width / 2)) / rect.width) * 10)));
    rawY.set(Math.max(-4, Math.min(4, ((event.clientY - (rect.top + rect.height / 2)) / rect.height) * 8)));
  }

  function handlePointerLeave() {
    rawX.set(0);
    rawY.set(0);
  }

  return (
    <div ref={fieldRef} className={`skill-field${isVisible ? "" : " is-offscreen"}`} onPointerMove={handlePointerMove} onPointerLeave={handlePointerLeave} aria-label="Selected technical skills">
      {skills.map(skill => <SkillChip key={skill.label} skill={skill} pointerX={pointerX} pointerY={pointerY} reducedMotion={reducedMotion} isVisible={isVisible} />)}
    </div>
  );
}
