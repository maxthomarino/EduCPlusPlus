import { defineCollection, z } from "astro:content";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { resolve, relative } from "node:path";
import { parseCppFile } from "../lib/parser.js";

const CONTENT_ROOT = resolve(import.meta.dirname, "../../EduCPlusPlus");

function findSourceFiles(dir: string): string[] {
  const results: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = resolve(dir, entry);
    if (statSync(full).isDirectory()) {
      if (entry.startsWith(".")) continue;
      results.push(...findSourceFiles(full));
    } else if (entry.endsWith(".cpp") || entry === "CMakeLists.txt") {
      results.push(full);
    }
  }
  return results;
}

const lessons = defineCollection({
  loader: () => {
    const files = findSourceFiles(CONTENT_ROOT);
    return files.map((filePath) => {
      const source = readFileSync(filePath, "utf-8");
      const parsed = parseCppFile(source, filePath);
      return {
        id: parsed.slug,
        ...parsed,
      };
    });
  },
  schema: z.object({
    moduleName: z.string(),
    moduleTitle: z.string(),
    subfolder: z.string(),
    fileName: z.string(),
    slug: z.string(),
    moduleOrder: z.number(),
    header: z.object({
      title: z.string(),
      shortTitle: z.string(),
      description: z.string(),
      why: z.string().optional(),
      when: z.string().optional(),
      standard: z.string().optional(),
      prerequisites: z.string().optional(),
      references: z.array(z.string()),
    }),
    sections: z.array(z.any()),
    rawSource: z.string(),
  }),
});

export const collections = { lessons };
