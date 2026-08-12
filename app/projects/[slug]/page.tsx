/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { notFound } from "next/navigation";
import { featuredProjects } from "@/data/portfolio";
import { getProjectCover } from "@/src/lib/project-media";

const publicProjects = featuredProjects.filter(project => project.slug !== "hkmc-portfolio-automation");
export function generateStaticParams() { return publicProjects.map(project => ({ slug: project.slug })); }

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project = publicProjects.find(item => item.slug === params.slug);
  if (!project) notFound();
  const cover = getProjectCover(project.slug);
  return <main className="case-page"><nav className="nav-shell"><Link href="/" className="wordmark">Genevieve <span>Yeung</span></Link><Link href="/#projects" className="back-link"><ArrowLeft size={15} /> Back to project experience</Link></nav><div className="case-wrap"><div className="eyebrow">PROJECT EXPERIENCE / {project.category}</div><h1>{project.title}</h1><p className="case-lede">{project.summary}</p><div className="case-result"><span>{project.resultLabel}</span><strong>{project.result}</strong></div>{cover && <div className="case-media"><img src={cover} alt={`${project.title} project figure`} /></div>}<div className="case-grid"><div><span className="case-label">Problem</span><p>{project.problem}</p></div><div><span className="case-label">Context</span><p>{project.approach}</p></div><div><span className="case-label">My contribution</span><p>{project.contribution}</p></div><div><span className="case-label">Validation / result</span><p>{project.evidence}</p></div></div><div className="case-bottom"><div><span className="case-label">Technologies</span><div className="case-techs">{project.technologies.map(tech => <span key={tech}>{tech}</span>)}</div></div><Link className="button button--ghost" href="/#contact">Say hello <ArrowUpRight size={16} /></Link></div></div></main>;
}
