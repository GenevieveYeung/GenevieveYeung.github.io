"use client";

import Link from "next/link";
import { BriefcaseBusiness, Linkedin, X } from "lucide-react";
import { useEffect, useState } from "react";
import CopyContactButton from "@/components/CopyContactButton";
import { links } from "@/data/portfolio";
import { localeLabels, localeNames, type Locale } from "@/data/i18n";
import { useLanguage } from "@/components/LanguageProvider";

function ExternalNavLink({ href, label, children }: { href?: string; label: string; children: React.ReactNode }) {
  if (!href) return null;
  return <a className="external-link" href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>{children}</a>;
}

export default function ResponsiveNav() {
  const [open, setOpen] = useState(false);
  const { copy, locale, setLocale } = useLanguage();
  const navItems = [
    ["#work", copy.nav.work], ["#projects", copy.nav.projects], ["#education", copy.nav.education], ["#beyond-work-journal", copy.nav.beyond], ["#contact", copy.nav.contact],
  ] as const;

  const languageControls = <div className="language-switcher" aria-label={copy.labels.languageSelector}>
    {(Object.keys(localeLabels) as Locale[]).map((nextLocale, index) => <span key={nextLocale} className="language-switcher__item">
      {index > 0 && <span className="language-switcher__separator" aria-hidden="true">·</span>}
      <button type="button" className={locale === nextLocale ? "is-active" : ""} aria-pressed={locale === nextLocale} aria-label={`${copy.labels.switchTo} ${localeNames[nextLocale]}`} onClick={() => setLocale(nextLocale)}>{localeLabels[nextLocale]}</button>
    </span>)}
  </div>;

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
          <CopyContactButton icon="phone" value="+852 6080 4041" copiedLabel={copy.nav.phoneCopied} ariaLabel={copy.nav.phone} />
          <CopyContactButton icon="mail" value="genevieveyeung@gmail.com" copiedLabel={copy.nav.emailCopied} ariaLabel={copy.nav.email} />
          <span className="nav-professional-links">
            <ExternalNavLink href={links.linkedin} label={copy.nav.linkedin}><Linkedin size={16} /></ExternalNavLink>
            <ExternalNavLink href={links.jobsdb} label={copy.nav.jobsdb}><BriefcaseBusiness size={16} /></ExternalNavLink>
          </span>
          {languageControls}
        </div>
        <button
          className="nav-menu-toggle"
          type="button"
          aria-label={open ? copy.nav.close : copy.nav.open}
          aria-expanded={open}
          aria-controls="compact-navigation-menu"
          onClick={() => setOpen(value => !value)}
        >
          {open ? <X size={18} aria-hidden="true" /> : <span aria-hidden="true"><i /><i /><i /></span>}
          <span className="sr-only">{open ? copy.nav.close : copy.nav.open}</span>
        </button>
        <div id="compact-navigation-menu" className={`compact-navigation-menu${open ? " is-open" : ""}`}>
          <div className="compact-navigation-links">
            {navItems.map(([href, label]) => <Link key={href} href={href}>{label}</Link>)}
          </div>
          <div className="compact-navigation-contact">
            <CopyContactButton icon="phone" value="+852 6080 4041" copiedLabel={copy.nav.phoneCopied} ariaLabel={copy.nav.phone} />
            <CopyContactButton icon="mail" value="genevieveyeung@gmail.com" copiedLabel={copy.nav.emailCopied} ariaLabel={copy.nav.email} />
            <ExternalNavLink href={links.linkedin} label={copy.nav.linkedin}><Linkedin size={16} /></ExternalNavLink>
            <ExternalNavLink href={links.jobsdb} label={copy.nav.jobsdb}><BriefcaseBusiness size={16} /></ExternalNavLink>
          </div>
          <div className="compact-navigation-language">{languageControls}</div>
        </div>
      </div>
    </nav>
  );
}
