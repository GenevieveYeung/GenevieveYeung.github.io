"use client";

import ContactCtaButton from "@/components/ContactCtaButton";

export default function CopyEmailButton({ compact = false, dataTestId, label }: { compact?: boolean; dataTestId?: string; label?: string }) {
  return <ContactCtaButton kind="email" label={label ?? (compact ? "Copy email" : "Email me")} compact={compact} dataTestId={dataTestId} />;
}
