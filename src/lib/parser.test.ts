import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parseCppFile } from "./parser.js";

const CONTENT_DIR = resolve(__dirname, "../../EduCPlusPlus");

function loadAndParse(relativePath: string) {
  const fullPath = resolve(CONTENT_DIR, relativePath);
  const source = readFileSync(fullPath, "utf-8");
  return parseCppFile(source, fullPath);
}

describe("parseCppFile", () => {
  describe("hello_modern.cpp (minimal file)", () => {
    const parsed = loadAndParse("01_fundamentals/basics/hello_modern.cpp");

    it("extracts module name and slug", () => {
      expect(parsed.moduleName).toBe("01_fundamentals");
      expect(parsed.moduleTitle).toBe("Fundamentals");
      expect(parsed.subfolder).toBe("basics");
      expect(parsed.fileName).toBe("hello_modern.cpp");
      expect(parsed.slug).toBe("01-fundamentals/basics/hello-modern");
    });

    it("extracts the header", () => {
      expect(parsed.header.title).toContain("hello_modern.cpp");
      expect(parsed.header.shortTitle).toContain("Modern C++ Hello World");
      expect(parsed.header.description).toBeTruthy();
      expect(parsed.header.references.length).toBeGreaterThan(0);
    });

    it("finds numbered sections", () => {
      const numbered = parsed.sections.filter((s) => s.type === "numbered-section");
      expect(numbered.length).toBeGreaterThanOrEqual(3);
      expect(numbered[0].title).toContain("auto");
    });

    it("finds Key Takeaways", () => {
      const kt = parsed.sections.find((s) => s.type === "key-takeaways");
      expect(kt).toBeDefined();
      if (kt?.type === "key-takeaways") {
        expect(kt.items.length).toBeGreaterThanOrEqual(3);
      }
    });

    it("finds code sections", () => {
      const code = parsed.sections.filter((s) => s.type === "code");
      expect(code.length).toBeGreaterThan(0);
    });

    it("keeps include directives in rendered code", () => {
      const codeSections = parsed.sections.filter((s) => s.type === "code");
      const combinedCode = codeSections
        .map((s) => (s.type === "code" ? s.code : ""))
        .join("\n");

      expect(combinedCode).toContain("#include <iostream>");
      expect(combinedCode).toContain("#include <string_view>");
      expect(combinedCode).toContain("#include <format>");
    });
  });

  describe("casting_operators.cpp (FAQ + Decision Guide)", () => {
    const parsed = loadAndParse("11_type_casting/casting_operators/casting_operators.cpp");

    it("extracts the header with prerequisites", () => {
      expect(parsed.header.shortTitle).toContain("Four C++ Cast Operators");
      expect(parsed.header.prerequisites).toBeTruthy();
      expect(parsed.header.references.length).toBeGreaterThanOrEqual(4);
    });

    it("finds FAQ section with Q/A pairs", () => {
      const faq = parsed.sections.find((s) => s.type === "faq");
      expect(faq).toBeDefined();
      if (faq?.type === "faq") {
        expect(faq.questions.length).toBeGreaterThanOrEqual(3);
        expect(faq.questions[0].question).toBeTruthy();
        expect(faq.questions[0].answer).toBeTruthy();
      }
    });

    it("finds HOW THE COMPILER IMPLEMENTS section (as generic or how-it-works)", () => {
      const relevant = parsed.sections.filter(
        (s) => s.type === "how-it-works" || s.type === "generic-section"
      );
      expect(relevant.length).toBeGreaterThanOrEqual(1);
    });

    it("finds numbered sections for each cast type", () => {
      const numbered = parsed.sections.filter((s) => s.type === "numbered-section");
      expect(numbered.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("variant_and_visitors.cpp (complex file)", () => {
    const parsed = loadAndParse("14_variant_and_type_traits/variant/variant_and_visitors.cpp");

    it("extracts the header", () => {
      expect(parsed.header.shortTitle).toContain("variant");
    });

    it("finds FAQ section", () => {
      const faq = parsed.sections.find((s) => s.type === "faq");
      expect(faq).toBeDefined();
      if (faq?.type === "faq") {
        expect(faq.questions.length).toBeGreaterThanOrEqual(5);
      }
    });

    it("finds Key Takeaways", () => {
      const kt = parsed.sections.find((s) => s.type === "key-takeaways");
      expect(kt).toBeDefined();
    });

    it("produces multiple section types", () => {
      const types = new Set(parsed.sections.map((s) => s.type));
      expect(types.size).toBeGreaterThanOrEqual(3);
    });
  });

  describe("lambda_examples.cpp (HOW IT WORKS in header area)", () => {
    const parsed = loadAndParse("08_modern_features/lambdas/lambda_examples.cpp");

    it("extracts the header", () => {
      expect(parsed.header.shortTitle).toContain("Lambda");
    });

    it("finds HOW IT WORKS about compiler transformation", () => {
      const hiw = parsed.sections.filter((s) => s.type === "how-it-works");
      expect(hiw.length).toBeGreaterThanOrEqual(1);
    });

    it("finds numbered sections", () => {
      const numbered = parsed.sections.filter((s) => s.type === "numbered-section");
      expect(numbered.length).toBeGreaterThanOrEqual(5);
    });
  });

  describe("all files parse without errors", () => {
    const { readdirSync, statSync } = require("node:fs");

    function findCppFiles(dir: string): string[] {
      const results: string[] = [];
      for (const entry of readdirSync(dir)) {
        const full = resolve(dir, entry);
        if (statSync(full).isDirectory()) {
          results.push(...findCppFiles(full));
        } else if (entry.endsWith(".cpp") || entry === "CMakeLists.txt") {
          results.push(full);
        }
      }
      return results;
    }

    const allFiles = findCppFiles(CONTENT_DIR);

    it(`found ${allFiles.length} files to parse`, () => {
      expect(allFiles.length).toBeGreaterThanOrEqual(40);
    });

    for (const file of allFiles) {
      const relative = file.replace(CONTENT_DIR + "\\", "").replace(CONTENT_DIR + "/", "");
      it(`parses ${relative} without throwing`, () => {
        const source = readFileSync(file, "utf-8");
        const result = parseCppFile(source, file);
        expect(result.header.title).toBeTruthy();
        expect(result.sections.length).toBeGreaterThan(0);
      });
    }
  });
});
