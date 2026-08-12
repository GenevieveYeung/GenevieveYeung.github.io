"use client";

import Link from "next/link";
import { BriefcaseBusiness, Linkedin, X } from "lucide-react";
import { useEffect, useState } from "react";
import CopyContactButton from "@/components/CopyContactButton";
import { links } from "@/data/portfolio";

const navItems = [
  ["#work", "Work Experience"],
  ["#projects", "Project Experience"],
  ["#education", "Education"],
  ["#beyond-work-journal", "Beyond Work"],
  ["#contact", "Contact"],
] as const;

function ExternalNavLink({ href, label, children }: { href?: string; label: string; children: React.ReactNode }) {
  if (!href) return null;
  return <a className="external-link" href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>{children}</a>;
}

export default function ResponsiveNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener("hashchange", close);
    window.addEventListener("resize", close);
    return () => {
      window.removeEventListener("hashchange", close);
      window.removeEventListener("resize", close);
    };
  }, []);

  return (
    <nav className="nav-shell" aria-label="Main navigation" data-testid="site-nav">
      <div className="nav-shell-inner">
        <Link href="#top" className="wordmark">Genevieve <span>Yeung</span></Link>
        <div className="nav-links">
          {navItems.map(([href, label]) => <Link key={href} href={href}>{label}</Link>)}
        </div>
        <div className="nav-contact">
          <CopyContactButton icon="phone" value="+852 6080 4041" copiedLabel="Phone copied" ariaLabel="Copy phone number" />
          <CopyContactButton icon="mail" value="genevieveyeung@gmail.com" copiedLabel="Email copied" ariaLabel="Copy email address" />
          <ExternalNavLink href={links.linkedin} label="LinkedIn"><Linkedin size={16} /></ExternalNavLink>
          <ExternalNavLink href={links.jobsdb} label="JobsDB"><BriefcaseBusiness size={16} /></ExternalNavLink>
        </div>
        <button
          className="nav-menu-toggle"
          type="button"
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={open}
          aria-controls="compact-navigation-menu"
          onClick={() => setOpen(value => !value)}
        >
          {open ? <X size={18} aria-hidden="true" /> : <span aria-hidden="true"><i /><i /><i /></span>}
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        </button>
        <div id="compact-navigation-menu" className={`compact-navigation-menu${open ? " is-open" : ""}`}>
          <div className="compact-navigation-links">
            {navItems.map(([href, label]) => <Link key={href} href={href}>{label}</Link>)}
          </div>
          <div className="compact-navigation-contact">
            <CopyContactButton icon="phone" value="+852 6080 4041" copiedLabel="Phone copied" ariaLabel="Copy phone number" />
            <CopyContactButton icon="mail" value="genevieveyeung@gmail.com" copiedLabel="Email copied" ariaLabel="Copy email address" />
            <ExternalNavLink href={links.linkedin} label="LinkedIn"><Linkedin size={16} /></ExternalNavLink>
            <ExternalNavLink href={links.jobsdb} label="JobsDB"><BriefcaseBusiness size={16} /></ExternalNavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}
