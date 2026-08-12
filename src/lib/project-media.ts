import fs from "node:fs";
import path from "node:path";

const coverNames = ["cover.webp", "cover.png", "cover.jpg", "cover.jpeg"] as const;

export function getProjectCover(slug: string): string | null {
  const projectDirectory = path.join(process.cwd(), "public", "project-media", slug);
  const filename = coverNames.find((name) => fs.existsSync(path.join(projectDirectory, name)));
  return filename ? `/project-media/${slug}/${filename}` : null;
}

export function getProjectMedia(slug: string) {
  const cover = getProjectCover(slug);
  return { cover };
}
