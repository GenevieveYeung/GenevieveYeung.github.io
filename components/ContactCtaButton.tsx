"use client";

import { Check, Mail, Phone } from "lucide-react";
import { useState } from "react";

type ContactCtaButtonProps = {
  kind: "phone" | "email";
  label: string;
  compact?: boolean;
  dataTestId?: string;
};

const contactDetails = {
  phone: {
    value: "+852 6080 4041",
    copiedLabel: "Phone copied",
    ariaLabel: "Copy Hong Kong phone number",
  },
  email: {
    value: "genevieveyeung@gmail.com",
    copiedLabel: "Email copied",
    ariaLabel: "Copy email address",
  },
} as const;

export default function ContactCtaButton({ kind, label, compact = false, dataTestId }: ContactCtaButtonProps) {
  const [copied, setCopied] = useState(false);
  const detail = contactDetails[kind];
  const Icon = kind === "phone" ? Phone : Mail;

  async function copyContact() {
    try {
      await navigator.clipboard.writeText(detail.value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      className={`button button--ghost contact-cta${compact ? " contact-cta--compact" : ""}`}
      type="button"
      onClick={copyContact}
      aria-label={detail.ariaLabel}
      data-testid={dataTestId}
    >
      {copied ? <Check size={15} aria-hidden="true" /> : <Icon size={15} aria-hidden="true" />}
      <span>{copied ? detail.copiedLabel : label}</span>
    </button>
  );
}
