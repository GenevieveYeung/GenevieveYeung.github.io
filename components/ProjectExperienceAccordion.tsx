"use client";

import Image from "next/image";
import { LayoutGroup, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { projectLibrary } from "@/data/portfolio";
import ExperienceIndexShell from "@/components/ExperienceIndexShell";
import PortfolioIcon from "@/components/PortfolioIcon";

const filters = ["ALL", "MACHINE LEARNING", "COMPUTER VISION", "LLM", "BIOSIGNALS", "AI SYSTEMS"] as const;
type ProjectFilter = (typeof filters)[number];

const filterTags: Record<Exclude<ProjectFilter, "ALL">, string> = {
  "MACHINE LEARNING": "Machine Learning",
  "COMPUTER VISION": "Computer Vision",
  LLM: "LLM",
  BIOSIGNALS: "Biosignals",
  "AI SYSTEMS": "AI Systems",
};

const projectCoverDimensions: Record<string, { width: number; height: number }> = {
  "vgrf-koa-prediction": { width: 1563, height: 726 },
  medisim: { width: 1902, height: 711 },
  "fall-detection-system": { width: 1803, height: 441 },
  emopet: { width: 1758, height: 906 },
  parkincare: { width: 1356, height: 471 },
  "colon-gland-segmentation": { width: 1437, height: 423 },
};

const projectIconSources: Record<string, string> = {
  "vgrf-koa-prediction": "/icons/portfolio/project-vgrf-koa.png",
  medisim: "/icons/portfolio/project-medisim.png",
  "fall-detection-system": "/icons/portfolio/project-fall-detection.png",
  emopet: "/icons/portfolio/project-emopet.png",
  parkincare: "/icons/portfolio/project-parkin-care.png",
  "colon-gland-segmentation": "/icons/portfolio/project-colon-gland.png",
  "aiot-edge-cloud-scheduling": "/icons/portfolio/project-aiot-scheduling.png",
};

function ProjectIcon({ slug }: { slug: string }) {
  return <PortfolioIcon src={projectIconSources[slug]} />;
}

function ProjectDetails({ project, cover }: { project: (typeof projectLibrary)[number]; cover: string | null }) {
  return (
    <div className="project-dossier project-detail-body project-row-body">
      <div className="project-dossier-lead">
        <p className="project-thesis">{project.summary}</p>
        <div className="project-pull-stat">
          <strong>{project.metric}</strong>
          <span>{project.detail}</span>
        </div>
      </div>
      {cover && <div className="project-image-wrap"><Image className="project-cover" src={cover} width={projectCoverDimensions[project.slug]?.width ?? 1600} height={projectCoverDimensions[project.slug]?.height ?? 900} sizes="(max-width: 700px) calc(100vw - 76px), 1060px" priority={project.slug === "vgrf-koa-prediction"} alt={`${project.title} project figure`} /></div>}
      <div className="project-dossier-support">
        <div><span className="project-detail-label">Contribution</span><p>{project.contribution}</p></div>
        <div><span className="project-detail-label">Methods</span><p>{project.tools}</p></div>
      </div>
      <ul className="project-highlights" aria-label="Project highlights">
        {project.highlights.map(highlight => <li key={highlight}>{highlight}</li>)}
      </ul>
      {project.award && <div className="project-award">{project.award}</div>}
    </div>
  );
}

export default function ProjectExperienceAccordion({ media }: { media: Record<string, string | null> }) {
  const [activeFilter, setActiveFilter] = useState<ProjectFilter>("ALL");
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const reducedMotion = useReducedMotion() ?? false;

  const visibleProjects = activeFilter === "ALL"
    ? projectLibrary
    : projectLibrary.filter(project => project.tags.includes(filterTags[activeFilter]));

  function selectFilter(filter: ProjectFilter) {
    setActiveFilter(filter);
    setActiveProjectId(null);
  }

  function toggleProject(slug: string) {
    setActiveProjectId(current => current === slug ? null : slug);
  }

  return (
    <div className="project-experience-browser">
      <div className="project-filter-bar" role="tablist" aria-label="Filter project experience">
        {filters.map(filter => {
          const isActive = activeFilter === filter;
          return (
            <motion.button
              className={`project-filter${isActive ? " is-active" : ""}`}
              key={filter}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => selectFilter(filter)}
              whileHover={reducedMotion ? undefined : { y: -1 }}
              whileTap={reducedMotion ? undefined : { scale: 0.985 }}
              transition={{ duration: 0.14, ease: "easeOut" }}
            >
              {filter}
            </motion.button>
          );
        })}
      </div>

      <LayoutGroup id="experience-focus">
      <div className="project-list" aria-live="polite">
        {visibleProjects.map((project) => {
          const isOpen = activeProjectId === project.slug;
          const cover = media[project.slug] || null;
          const isQuiet = activeProjectId !== null && !isOpen;
          return (
            <ExperienceIndexShell key={project.slug} id={project.slug} kind="project" number={project.number} icon={<ProjectIcon slug={project.slug} />} period={project.tags[0] || "Project study"} title={project.title} supporting={`${project.metric} · ${project.detail}`} open={isOpen} quiet={isQuiet} detailId={`project-${project.slug}`} onToggle={() => toggleProject(project.slug)}><ProjectDetails project={project} cover={cover} /></ExperienceIndexShell>
          );
        })}
      </div>
      </LayoutGroup>
    </div>
  );
}
