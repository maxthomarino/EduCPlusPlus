import type { Section } from "./types.js";

export interface TocEntry {
  id: string;
  title: string;
}

/** Build a table of contents from parsed sections. */
export function buildToc(sections: Section[]): TocEntry[] {
  const entries: TocEntry[] = [];

  for (const section of sections) {
    switch (section.type) {
      case "faq":
        entries.push({ id: "faq", title: "Frequently Asked Questions" });
        break;
      case "how-it-works":
        entries.push({
          id: slugifyId(section.title),
          title: section.title,
        });
        break;
      case "key-takeaways":
        entries.push({ id: "key-takeaways", title: "Key Takeaways" });
        break;
      case "numbered-section":
        entries.push({
          id: slugifyId(`${section.number}-${section.title}`),
          title: `${section.number}. ${section.title}`,
        });
        break;
      case "decision-guide":
        entries.push({ id: "decision-guide", title: section.title });
        break;
      case "generic-section":
        entries.push({
          id: slugifyId(section.title),
          title: section.title,
        });
        break;
      // code and watch-out sections don't get TOC entries
    }
  }

  return entries;
}

function slugifyId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .substring(0, 60);
}
