"use client";

import ContactCtaButton from "@/components/ContactCtaButton";

export default function CopyPhoneButton({ compact = false, dataTestId }: { compact?: boolean; dataTestId?: string }) {
  return <ContactCtaButton kind="phone" label="Call me" compact={compact} dataTestId={dataTestId} />;
}
