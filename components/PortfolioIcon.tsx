import Image from "next/image";

export default function PortfolioIcon({ src, className = "" }: { src: string; className?: string }) {
  return <Image className={`portfolio-icon${className ? ` ${className}` : ""}`} src={src} alt="" aria-hidden="true" width={96} height={96} sizes="64px" />;
}
