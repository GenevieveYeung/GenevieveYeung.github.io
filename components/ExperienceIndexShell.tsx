"use client";

import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type ExperienceIndexShellProps = {
  id: string;
  kind: "work" | "project";
  number: string;
  icon: ReactNode;
  period: string;
  title: string;
  supporting: string;
  open: boolean;
  quiet: boolean;
  detailId: string;
  onToggle: () => void;
  children: ReactNode;
};

const focusTransition = { type: "tween" as const, duration: 0.38, ease: [0.22, 1, 0.36, 1] as const };
const entranceEase = [0, 0, 0.3, 1] as const;

function stagedEntrance(reducedMotion: boolean, delay: number) {
  return reducedMotion
    ? { initial: false as const }
    : {
        initial: { opacity: 0, y: 8 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.28 },
        transition: { duration: 0.28, delay, ease: entranceEase },
      };
}

export default function ExperienceIndexShell({
  id,
  kind,
  number,
  icon,
  period,
  title,
  supporting,
  open,
  quiet,
  detailId,
  onToggle,
  children,
}: ExperienceIndexShellProps) {
  const reducedMotion = useReducedMotion() ?? false;
  const useWorkEntrance = kind === "work";
  const transition = reducedMotion ? { duration: 0 } : focusTransition;

  return (
    <motion.article
      layout
      className={`experience-index-row experience-index-row--${kind}${open ? " is-open" : ""}${quiet ? " is-quiet" : ""}`}
      initial={reducedMotion || !useWorkEntrance ? false : { opacity: 0, y: 22 }}
      whileInView={reducedMotion || !useWorkEntrance ? undefined : { opacity: 1, y: 0 }}
      viewport={useWorkEntrance ? { once: true, amount: 0.28 } : undefined}
      animate={{ opacity: quiet ? 0.78 : 1 }}
      transition={reducedMotion ? { duration: 0 } : { ...transition, ease: entranceEase }}
      data-experience-id={id}
      data-testid={`${kind}-row`}
    >
      <motion.button
        layout="position"
        className="experience-index-trigger"
        type="button"
        aria-expanded={open}
        aria-controls={detailId}
        onClick={onToggle}
        whileHover={reducedMotion ? undefined : { x: 4 }}
        whileTap={reducedMotion ? undefined : { scale: 0.995 }}
        transition={{ duration: 0.16, ease: "easeOut" }}
      >
        <motion.span className="experience-index-number" {...stagedEntrance(reducedMotion || !useWorkEntrance, 0)}>{number}</motion.span>
        <motion.span className="experience-index-icon" {...stagedEntrance(reducedMotion || !useWorkEntrance, 0)}>{icon}</motion.span>
        <span className="experience-index-summary">
          <motion.small {...stagedEntrance(reducedMotion || !useWorkEntrance, 0.05)}>{period}</motion.small>
          <motion.strong {...stagedEntrance(reducedMotion || !useWorkEntrance, 0.1)}>{title}</motion.strong>
          <motion.em {...stagedEntrance(reducedMotion || !useWorkEntrance, 0.15)}>{supporting}</motion.em>
        </span>
        <span className="experience-index-control" aria-hidden="true"><ChevronDown size={18} /></span>
      </motion.button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={detailId}
            key="experience-dossier"
            layout
            className="experience-index-detail"
            data-testid={`${kind}-panel`}
            initial={reducedMotion ? false : { opacity: 0, clipPath: "inset(0 0 14% 0)" }}
            animate={reducedMotion ? { opacity: 1 } : { opacity: 1, clipPath: "inset(0 0 0% 0)" }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, clipPath: "inset(0 0 10% 0)" }}
            transition={transition}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}
