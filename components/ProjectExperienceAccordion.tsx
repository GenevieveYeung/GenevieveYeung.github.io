"use client";

import Image from "next/image";
import { LayoutGroup, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { projectLibrary } from "@/data/portfolio";
import { projectContent } from "@/data/i18n";
import { useLanguage } from "@/components/LanguageProvider";
import ExperienceIndexShell from "@/components/ExperienceIndexShell";
import PortfolioIcon from "@/components/PortfolioIcon";

const filters = ["ALL", "MACHINE LEARNING", "COMPUTER VISION", "LLM", "BIOSIGNALS", "AI SYSTEMS"] as const;
type ProjectFilter = (typeof filters)[number];
const filterTags: Record<Exclude<ProjectFilter, "ALL">, string> = { "MACHINE LEARNING": "Machine Learning", "COMPUTER VISION": "Computer Vision", LLM: "LLM", BIOSIGNALS: "Biosignals", "AI SYSTEMS": "AI Systems" };
const projectCoverDimensions: Record<string, { width: number; height: number }> = { "vgrf-koa-prediction": { width: 1563, height: 726 }, medisim: { width: 1902, height: 711 }, "fall-detection-system": { width: 1803, height: 441 }, emopet: { width: 1758, height: 906 }, parkincare: { width: 1356, height: 471 }, "colon-gland-segmentation": { width: 1437, height: 423 } };
const projectIconSources: Record<string, string> = { "vgrf-koa-prediction": "/icons/portfolio/project-vgrf-koa.png", medisim: "/icons/portfolio/project-medisim.png", "fall-detection-system": "/icons/portfolio/project-fall-detection.png", emopet: "/icons/portfolio/project-emopet.png", parkincare: "/icons/portfolio/project-parkin-care.png", "colon-gland-segmentation": "/icons/portfolio/project-colon-gland.png", "aiot-edge-cloud-scheduling": "/icons/portfolio/project-aiot-scheduling.png" };

function ProjectIcon({ slug }: { slug: string }) { return <PortfolioIcon src={projectIconSources[slug]} />; }

function ProjectDetails({ project, cover, locale }: { project: (typeof projectLibrary)[number]; cover: string | null; locale: "en" | "zh-CN" | "zh-HK" }) {
  const localized = projectContent[locale][project.slug] ?? projectContent.en[project.slug];
  const labels = locale === "en" ? { contribution: "Contribution", methods: "Methods", highlights: "Project highlights" } : locale === "zh-CN" ? { contribution: "个人贡献", methods: "方法", highlights: "项目亮点" } : { contribution: "個人貢獻", methods: "方法", highlights: "項目亮點" };
  return <div className="project-dossier project-detail-body project-row-body">
    <div className="project-dossier-lead"><div>{localized.subtitle && <p className="project-subtitle">{localized.subtitle}</p>}<p className="project-thesis">{localized.summary}</p></div><div className="project-pull-stat">{localized.results?.slice(0, 2).map(result => <div className="project-pull-stat-item" key={`${result.value}-${result.label}`}><strong>{result.value}</strong><span>{result.label}</span></div>) ?? <div className="project-pull-stat-item"><strong>{project.metric}</strong><span>{localized.detail}</span></div>}</div></div>
    {cover && <div className="project-image-wrap"><Image className="project-cover" src={cover} width={projectCoverDimensions[project.slug]?.width ?? 1600} height={projectCoverDimensions[project.slug]?.height ?? 900} sizes="(max-width: 700px) calc(100vw - 76px), 1060px" priority={project.slug === "vgrf-koa-prediction"} alt={`${localized.title} project figure`} /></div>}
    {localized.process?.length ? <div className="project-process"><span className="project-detail-label">{localized.processHeading}</span><div className="project-process-grid">{localized.process.map(step => <article key={step.kicker}><span>{step.kicker}</span><strong>{step.title}</strong><p>{step.detail}</p></article>)}</div></div> : null}
    <div className="project-dossier-support"><div><span className="project-detail-label">{labels.contribution}</span><p>{localized.contribution.split("\n\n").map((paragraph, index) => <span className="project-copy-paragraph" key={`${project.slug}-contribution-${index}`}>{paragraph}</span>)}</p></div><div><span className="project-detail-label">{labels.methods}</span><p>{localized.methods?.map(method => <span className="project-method" key={method}>{method}</span>) ?? project.tools}</p></div></div>
    <ul className="project-highlights" aria-label={labels.highlights}>{localized.highlights.map(highlight => <li key={highlight}>{highlight}</li>)}</ul>
    {localized.results?.length ? <div className="project-results">{localized.results.map(result => <div key={`${result.value}-${result.label}`}><strong>{result.value}</strong><span>{result.label}</span></div>)}</div> : null}
    {localized.award && <div className="project-award">{localized.award}</div>}
  </div>;
}

export default function ProjectExperienceAccordion({ media }: { media: Record<string, string | null> }) {
  const [activeFilter, setActiveFilter] = useState<ProjectFilter>("ALL");
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const reducedMotion = useReducedMotion() ?? false;
  const { locale, copy } = useLanguage();
  const visibleProjects = activeFilter === "ALL" ? projectLibrary : projectLibrary.filter(project => project.tags.includes(filterTags[activeFilter]));
  const filterLabel = (filter: ProjectFilter) => filter === "ALL" ? copy.projects.filters.all : filter === "MACHINE LEARNING" ? copy.projects.filters.machineLearning : filter === "COMPUTER VISION" ? copy.projects.filters.computerVision : filter === "BIOSIGNALS" ? copy.projects.filters.biosignals : filter === "AI SYSTEMS" ? copy.projects.filters.aiSystems : filter;
  return <div className="project-experience-browser">
    <div className="project-filter-bar" role="tablist" aria-label={copy.projects.filterLabel}>{filters.map(filter => { const isActive = activeFilter === filter; return <motion.button className={`project-filter${isActive ? " is-active" : ""}`} key={filter} type="button" role="tab" aria-selected={isActive} onClick={() => { setActiveFilter(filter); setActiveProjectId(null); }} whileHover={reducedMotion ? undefined : { y: -1 }} whileTap={reducedMotion ? undefined : { scale: 0.985 }} transition={{ duration: 0.14, ease: "easeOut" }}>{filterLabel(filter)}</motion.button>; })}</div>
    <LayoutGroup id="experience-focus"><div className="project-list" aria-live="polite">{visibleProjects.map(project => { const isOpen = activeProjectId === project.slug; const cover = media[project.slug] || null; const isQuiet = activeProjectId !== null && !isOpen; const localized = projectContent[locale][project.slug] ?? projectContent.en[project.slug]; return <ExperienceIndexShell key={project.slug} id={project.slug} kind="project" number={project.number} icon={<ProjectIcon slug={project.slug} />} period={project.tags[0] || "Project study"} title={localized.title} supporting={`${project.metric} · ${localized.detail}`} open={isOpen} quiet={isQuiet} detailId={`project-${project.slug}`} onToggle={() => setActiveProjectId(current => current === project.slug ? null : project.slug)}><ProjectDetails project={project} cover={cover} locale={locale} /></ExperienceIndexShell>; })}</div></LayoutGroup>
  </div>;
}
