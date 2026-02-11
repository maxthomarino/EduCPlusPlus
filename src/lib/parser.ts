/**
 * Core .cpp parser — converts documented C++ files into structured sections.
 *
 * This is a line-by-line state machine that identifies documentation patterns
 * (FAQ, HOW IT WORKS, Key Takeaways, numbered sections, etc.) and separates
 * them from actual code.
 */

import type {
  ParsedFile,
  FileHeader,
  Section,
  FaqSection,
  HowItWorksSection,
  KeyTakeawaysSection,
  NumberedSection,
  DecisionGuideSection,
  GenericNamedSection,
  CodeSection,
  WatchOutSection,
} from "./types.js";

// ---------------------------------------------------------------------------
// Module name mapping
// ---------------------------------------------------------------------------
const MODULE_TITLES: Record<string, string> = {
  "01_fundamentals": "Fundamentals",
  "02_oop": "Object-Oriented Programming",
  "03_memory_management": "Memory Management",
  "04_stl_containers": "STL Containers",
  "05_algorithms": "Algorithms",
  "06_templates": "Templates",
  "07_multithreading": "Multithreading",
  "08_modern_features": "Modern C++ Features",
  "09_cpp20_features": "C++20 Features",
  "10_error_handling": "Error Handling",
  "11_type_casting": "Type Casting",
  "12_io_and_filesystem": "I/O & Filesystem",
  "13_build_systems": "Build Systems",
  "14_variant_and_type_traits": "Variant & Type Traits",
};

// ---------------------------------------------------------------------------
// Regex patterns
// ---------------------------------------------------------------------------
const RE = {
  headerStart: /^\s*\/\*\*/,
  headerEnd: /^\s*\*\/\s*$/,
  headerLine: /^\s*\*\s?(.*)/,

  majorDelim: /^\s*\/\/\s*={5,}\s*$/,
  minorDelim: /^\s*\/\/\s*-{5,}\s*$/,
  commentLine: /^\s*\/\/\s?(.*)/,
  blankComment: /^\s*\/\/\s*$/,

  // For cmake files
  cmajorDelim: /^\s*#\s*={5,}\s*$/,
  cminorDelim: /^\s*#\s*-{5,}\s*$/,
  ccommentLine: /^\s*#\s?(.*)/,

  // Section type detection
  faqHeader: /FREQUENTLY ASKED QUESTIONS/i,
  howItWorks: /HOW\s+.*WORKS|HOW IT WORKS/i,
  keyTakeaways: /Key Takeaways/i,
  decisionGuide: /DECISION GUIDE/i,

  // Content patterns
  questionLine: /^Q:\s*(.*)/,
  answerLine: /^A:\s*(.*)/,
  numberedItem: /^(\d+)\.\s+(.*)/,
  watchOut: /Watch out:\s*(.*)/i,

  // Header field patterns
  prereqs: /^(?:Prerequisites?|Prereqs?)\s*:\s*(.*)/i,
  reference: /^(?:Reference)\s*:\s*(.*)/i,
  standard: /^(?:Standard|STANDARD)\s*:\s*(.*)/i,
  why: /^(?:WHY(?:\s+IT\s+(?:EXISTS|MATTERS))?|Why(?:\s+it\s+(?:exists|matters))?)\s*:\s*(.*)/i,
  when: /^(?:WHEN(?:\s+TO\s+USE)?|When(?:\s+to\s+use)?)\s*:\s*(.*)/i,

  blank: /^\s*$/,
  includeDirective: /^#include\s/,
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function slugify(moduleName: string, subfolder: string, fileName: string): string {
  const modSlug = moduleName.replace(/_/g, "-");
  const fileSlug = fileName.replace(/\.cpp$|\.txt$/i, "").replace(/_/g, "-");
  return `${modSlug}/${subfolder}/${fileSlug}`;
}

function stripCommentPrefix(line: string, prefix: "//" | "#"): string {
  if (prefix === "//") {
    const m = line.match(/^\s*\/\/\s?(.*)/);
    return m ? m[1] : line;
  }
  const m = line.match(/^\s*#\s?(.*)/);
  return m ? m[1] : line;
}

function isCommentLine(line: string, prefix: "//" | "#"): boolean {
  return prefix === "//" ? /^\s*\/\//.test(line) : /^\s*#/.test(line);
}

function isMajorDelim(line: string, prefix: "//" | "#"): boolean {
  return prefix === "//" ? RE.majorDelim.test(line) : RE.cmajorDelim.test(line);
}

function isMinorDelim(line: string, prefix: "//" | "#"): boolean {
  return prefix === "//" ? RE.minorDelim.test(line) : RE.cminorDelim.test(line);
}

// ---------------------------------------------------------------------------
// Header parser
// ---------------------------------------------------------------------------

interface HeaderParseResult {
  header: FileHeader;
  endLine: number;
}

function parseHeader(lines: string[]): HeaderParseResult {
  const header: FileHeader = {
    title: "",
    shortTitle: "",
    description: "",
    references: [],
  };

  let i = 0;

  // Find /** start
  while (i < lines.length && !RE.headerStart.test(lines[i])) i++;
  if (i >= lines.length) {
    return { header, endLine: 0 };
  }

  // Check if title is on the same line as /**
  const startMatch = lines[i].match(/\/\*\*\s*(.*)/);
  if (startMatch && startMatch[1].trim()) {
    header.title = startMatch[1].trim();
  }
  i++;

  const descLines: string[] = [];
  let currentField: string | null = null;
  let currentFieldLines: string[] = [];

  function flushField() {
    if (!currentField) return;
    const value = currentFieldLines.join(" ").trim();
    switch (currentField) {
      case "why": header.why = value; break;
      case "when": header.when = value; break;
      case "standard": header.standard = value; break;
      case "prerequisites": header.prerequisites = value; break;
      case "reference":
        // References may be split across lines
        for (const ref of currentFieldLines) {
          const trimmed = ref.trim();
          if (trimmed) header.references.push(trimmed);
        }
        break;
    }
    currentField = null;
    currentFieldLines = [];
  }

  while (i < lines.length) {
    if (RE.headerEnd.test(lines[i])) {
      i++;
      break;
    }

    const m = lines[i].match(RE.headerLine);
    const lineText = m ? m[1] : lines[i].trim();

    // Extract title from first non-empty header line
    if (!header.title && lineText.trim()) {
      header.title = lineText.trim();
      i++;
      continue;
    }

    // Check for field markers
    let fieldMatch: RegExpMatchArray | null;
    if ((fieldMatch = lineText.match(RE.why))) {
      flushField();
      currentField = "why";
      currentFieldLines = [fieldMatch[1]];
    } else if ((fieldMatch = lineText.match(RE.when))) {
      flushField();
      currentField = "when";
      currentFieldLines = [fieldMatch[1]];
    } else if ((fieldMatch = lineText.match(RE.standard))) {
      flushField();
      currentField = "standard";
      currentFieldLines = [fieldMatch[1]];
    } else if ((fieldMatch = lineText.match(RE.prereqs))) {
      flushField();
      currentField = "prerequisites";
      currentFieldLines = [fieldMatch[1]];
    } else if ((fieldMatch = lineText.match(RE.reference))) {
      flushField();
      currentField = "reference";
      currentFieldLines = [fieldMatch[1]];
    } else if (currentField) {
      // Continuation of current field
      currentFieldLines.push(lineText);
    } else {
      // Description text
      descLines.push(lineText);
    }

    i++;
  }

  flushField();
  header.description = descLines.join("\n").trim();

  // Split title on " - " to extract shortTitle
  const dashIdx = header.title.indexOf(" - ");
  if (dashIdx !== -1) {
    header.shortTitle = header.title.substring(dashIdx + 3).trim();
  } else {
    header.shortTitle = header.title;
  }

  return { header, endLine: i };
}

// ---------------------------------------------------------------------------
// Body parser (state machine)
// ---------------------------------------------------------------------------

type ParserState =
  | "IDLE"
  | "IN_FAQ"
  | "IN_HOW_IT_WORKS"
  | "IN_KEY_TAKEAWAYS"
  | "IN_NUMBERED_SECTION"
  | "IN_DECISION_GUIDE"
  | "IN_GENERIC_SECTION"
  | "IN_CODE";

export function parseCppFile(
  source: string,
  filePath: string,
): ParsedFile {
  const parts = filePath.replace(/\\/g, "/").split("/");
  // Find the module directory in the path
  const moduleIdx = parts.findIndex((p) => /^\d{2}_/.test(p));
  const moduleName = moduleIdx >= 0 ? parts[moduleIdx] : "unknown";
  const subfolder = moduleIdx >= 0 && parts.length > moduleIdx + 2
    ? parts[moduleIdx + 1]
    : parts[parts.length - 2] || "root";
  const fileName = parts[parts.length - 1];

  const isCmake = fileName.toLowerCase().endsWith(".txt");
  const commentPrefix: "//" | "#" = isCmake ? "#" : "//";
  const language = isCmake ? "cmake" : "cpp";

  const lines = source.split("\n");

  // Parse the header block first
  const { header, endLine } = isCmake
    ? parseCmakeHeader(lines)
    : parseHeader(lines);

  // Parse the body
  const sections = parseBody(lines, endLine, commentPrefix, language);

  const moduleOrder = parseInt(moduleName.substring(0, 2), 10) || 99;

  return {
    moduleName,
    moduleTitle: MODULE_TITLES[moduleName] || moduleName,
    subfolder,
    fileName,
    slug: slugify(moduleName, subfolder, fileName),
    moduleOrder,
    header,
    sections,
    rawSource: source,
  };
}

/** Parse a cmake header — uses # comments, similar logic */
function parseCmakeHeader(lines: string[]): HeaderParseResult {
  const header: FileHeader = {
    title: "",
    shortTitle: "",
    description: "",
    references: [],
  };

  let i = 0;
  // CMakeLists.txt: header is the first block of # comments at the top
  // First line of content after delimiters becomes the title
  while (i < lines.length && RE.blank.test(lines[i])) i++;

  // Check for a # ==== delimited block
  if (i < lines.length && RE.cmajorDelim.test(lines[i])) {
    i++;
    const descLines: string[] = [];
    while (i < lines.length && !RE.cmajorDelim.test(lines[i])) {
      const m = lines[i].match(/^#\s?(.*)/);
      const text = m ? m[1] : lines[i];
      if (!header.title && text.trim()) {
        header.title = text.trim();
      } else {
        descLines.push(text);
      }
      i++;
    }
    if (RE.cmajorDelim.test(lines[i])) i++;
    header.description = descLines.join("\n").trim();
  }

  const dashIdx = header.title.indexOf(" - ");
  if (dashIdx !== -1) {
    header.shortTitle = header.title.substring(dashIdx + 3).trim();
  } else {
    header.shortTitle = header.title || "CMakeLists.txt";
  }

  return { header, endLine: i };
}

// ---------------------------------------------------------------------------
// Body section parser
// ---------------------------------------------------------------------------

function parseBody(
  lines: string[],
  startLine: number,
  prefix: "//" | "#",
  language: string,
): Section[] {
  const sections: Section[] = [];
  let i = startLine;

  while (i < lines.length) {
    const line = lines[i];

    // Skip blank lines
    if (RE.blank.test(line)) {
      i++;
      continue;
    }

    // Skip #include lines — we don't render them as sections
    if (RE.includeDirective.test(line)) {
      i++;
      continue;
    }

    // Major delimiter: === blocks
    if (isMajorDelim(line, prefix)) {
      const result = parseMajorBlock(lines, i, prefix, language);
      if (result.section) {
        sections.push(result.section);
      }
      i = result.endLine;
      continue;
    }

    // Minor delimiter: --- blocks
    if (isMinorDelim(line, prefix)) {
      const result = parseMinorBlock(lines, i, prefix, language);
      if (result.section) {
        sections.push(result.section);
      }
      i = result.endLine;
      continue;
    }

    // Standalone HOW IT WORKS in comments (without delimiters)
    if (isCommentLine(line, prefix)) {
      const text = stripCommentPrefix(line, prefix);
      if (RE.howItWorks.test(text)) {
        const result = parseInlineHowItWorks(lines, i, prefix);
        sections.push(result.section);
        i = result.endLine;
        continue;
      }

      // Standalone Watch out outside any section
      if (RE.watchOut.test(text)) {
        const result = parseWatchOut(lines, i, prefix);
        sections.push(result.section);
        i = result.endLine;
        continue;
      }

      // Other standalone comment blocks — skip or collect
      i++;
      continue;
    }

    // Code lines
    if (!isCommentLine(line, prefix) && !RE.blank.test(line)) {
      const result = parseCodeBlock(lines, i, prefix, language);
      if (result.section.code.trim()) {
        sections.push(result.section);
      }
      i = result.endLine;
      continue;
    }

    i++;
  }

  return sections;
}

// ---------------------------------------------------------------------------
// Major block parser (=== delimited)
// ---------------------------------------------------------------------------

interface ParseResult {
  section: Section | null;
  endLine: number;
}

function parseMajorBlock(
  lines: string[],
  start: number,
  prefix: "//" | "#",
  language: string = "cpp",
): ParseResult {
  let i = start + 1; // skip the opening ===

  // Collect all comment lines until the closing === or non-comment
  const titleLines: string[] = [];
  while (i < lines.length && !isMajorDelim(lines[i], prefix)) {
    if (isCommentLine(lines[i], prefix) || RE.blank.test(lines[i])) {
      titleLines.push(stripCommentPrefix(lines[i], prefix));
      i++;
    } else {
      break;
    }
  }

  // Skip closing ===
  if (i < lines.length && isMajorDelim(lines[i], prefix)) {
    i++;
  }

  if (titleLines.length === 0) {
    return { section: null, endLine: i };
  }

  const firstLine = titleLines[0].trim();

  // Detect the === TITLE === CONTENT === pattern:
  // If the block between the first two === is short (just a title line or two),
  // and the next lines after the second === are comments (not code), then the
  // content is between the second and third === delimiters.
  const nonBlankTitleLines = titleLines.filter((l) => l.trim().length > 0);
  const nextLineIsComment = i < lines.length && (
    isCommentLine(lines[i], prefix) || RE.blank.test(lines[i])
  );
  const isTitleOnly = nonBlankTitleLines.length <= 2 && nextLineIsComment;

  // If the title block is short and there is content AFTER the second ===, collect it
  let contentLines: string[] = [];
  if (isTitleOnly) {
    // Collect content until the next === or non-comment
    while (i < lines.length && !isMajorDelim(lines[i], prefix)) {
      if (isCommentLine(lines[i], prefix) || RE.blank.test(lines[i])) {
        contentLines.push(stripCommentPrefix(lines[i], prefix));
        i++;
      } else {
        break;
      }
    }
    // Skip closing ===
    if (i < lines.length && isMajorDelim(lines[i], prefix)) {
      i++;
    }
  } else {
    // The content was between the first two === lines (all-in-one block)
    contentLines = titleLines.slice(1);
  }

  // Determine block type from first line
  if (RE.faqHeader.test(firstLine)) {
    return { section: parseFaqContent(contentLines), endLine: i };
  }

  if (RE.howItWorks.test(firstLine)) {
    const title = firstLine.replace(/^HOW IT WORKS:?\s*/i, "").trim() || "How It Works";
    return {
      section: {
        type: "how-it-works",
        title,
        content: contentLines.join("\n").trim(),
      } satisfies HowItWorksSection,
      endLine: i,
    };
  }

  if (RE.keyTakeaways.test(firstLine)) {
    return { section: parseKeyTakeawaysContent(contentLines), endLine: i };
  }

  if (RE.decisionGuide.test(firstLine)) {
    return {
      section: {
        type: "decision-guide",
        title: firstLine.trim(),
        content: contentLines.join("\n").trim(),
      } satisfies DecisionGuideSection,
      endLine: i,
    };
  }

  // Check if this is a numbered section (=== 1. Title ===)
  const numMatch = firstLine.match(RE.numberedItem);
  if (numMatch) {
    return parseNumberedSectionContent(
      numMatch, contentLines, lines, i, prefix, language,
    );
  }

  // Generic named section
  const allContent = isTitleOnly ? contentLines : titleLines.slice(1);
  return {
    section: {
      type: "generic-section",
      title: firstLine.trim(),
      content: allContent.join("\n").trim(),
    } satisfies GenericNamedSection,
    endLine: i,
  };
}

// ---------------------------------------------------------------------------
// Minor block parser (--- delimited)
// ---------------------------------------------------------------------------

function parseMinorBlock(
  lines: string[],
  start: number,
  prefix: "//" | "#",
  language: string,
): ParseResult {
  let i = start + 1; // skip the opening ---

  // Collect comment lines until next delimiter or code
  const commentLines: string[] = [];
  while (
    i < lines.length &&
    !isMinorDelim(lines[i], prefix) &&
    !isMajorDelim(lines[i], prefix)
  ) {
    if (isCommentLine(lines[i], prefix) || RE.blank.test(lines[i])) {
      commentLines.push(stripCommentPrefix(lines[i], prefix));
      i++;
    } else {
      break; // Hit code — we'll collect it below
    }
  }

  // If the comment ends with another --- delimiter, consume it
  if (i < lines.length && isMinorDelim(lines[i], prefix)) {
    i++;
  }

  if (commentLines.length === 0) {
    return { section: null, endLine: i };
  }

  const firstLine = commentLines[0].trim();

  // Check if this is a numbered section
  const numMatch = firstLine.match(RE.numberedItem);
  if (numMatch) {
    return parseNumberedSectionContent(
      numMatch, commentLines.slice(1), lines, i, prefix, language,
    );
  }

  // HOW IT WORKS inside --- delimiters
  if (RE.howItWorks.test(firstLine)) {
    const title = firstLine.replace(/^HOW IT WORKS:?\s*/i, "").trim() || "How It Works";
    return {
      section: {
        type: "how-it-works",
        title,
        content: commentLines.slice(1).join("\n").trim(),
      } satisfies HowItWorksSection,
      endLine: i,
    };
  }

  // Key Takeaways inside --- delimiters
  if (RE.keyTakeaways.test(firstLine)) {
    return { section: parseKeyTakeawaysContent(commentLines.slice(1)), endLine: i };
  }

  // Generic minor section (e.g., "Class hierarchy for dynamic_cast demonstrations")
  return {
    section: {
      type: "generic-section",
      title: firstLine.trim(),
      content: commentLines.slice(1).join("\n").trim(),
    } satisfies GenericNamedSection,
    endLine: i,
  };
}

// ---------------------------------------------------------------------------
// Numbered section content parser
// ---------------------------------------------------------------------------

function parseNumberedSectionContent(
  numMatch: RegExpMatchArray,
  descCommentLines: string[],
  lines: string[],
  codeStart: number,
  prefix: "//" | "#",
  language: string,
): ParseResult {
  const number = parseInt(numMatch[1], 10);
  const title = numMatch[2].trim();

  // Extract description and watch-outs from comment lines
  const descParts: string[] = [];
  const watchOuts: string[] = [];
  const inlineHIW: { title: string; content: string }[] = [];

  let inHIW = false;
  let hiwTitle = "";
  let hiwLines: string[] = [];

  for (const line of descCommentLines) {
    const trimmed = line.trim();

    if (RE.howItWorks.test(trimmed)) {
      if (inHIW && hiwLines.length > 0) {
        inlineHIW.push({ title: hiwTitle, content: hiwLines.join("\n").trim() });
      }
      inHIW = true;
      hiwTitle = trimmed.replace(/^HOW IT WORKS:?\s*/i, "").trim() || "How It Works";
      hiwLines = [];
      continue;
    }

    if (inHIW) {
      hiwLines.push(line);
      continue;
    }

    const woMatch = trimmed.match(RE.watchOut);
    if (woMatch) {
      watchOuts.push(woMatch[1]);
      continue;
    }

    descParts.push(line);
  }

  if (inHIW && hiwLines.length > 0) {
    inlineHIW.push({ title: hiwTitle, content: hiwLines.join("\n").trim() });
  }

  // Now collect any code following the section comments
  let i = codeStart;
  const codeLines: string[] = [];
  while (
    i < lines.length &&
    !isMinorDelim(lines[i], prefix) &&
    !isMajorDelim(lines[i], prefix)
  ) {
    // If we hit a comment block that looks like a new section, stop
    if (isCommentLine(lines[i], prefix)) {
      const peek = stripCommentPrefix(lines[i], prefix).trim();
      // Check if this comment line is a Watch out within the code
      const woMatch = peek.match(RE.watchOut);
      if (woMatch) {
        watchOuts.push(woMatch[1]);
        // Collect continuation lines of the watch out
        i++;
        while (
          i < lines.length &&
          isCommentLine(lines[i], prefix) &&
          !isMinorDelim(lines[i], prefix) &&
          !isMajorDelim(lines[i], prefix)
        ) {
          const contText = stripCommentPrefix(lines[i], prefix).trim();
          if (contText && !RE.watchOut.test(contText) && !RE.numberedItem.test(contText)) {
            watchOuts[watchOuts.length - 1] += " " + contText;
            i++;
          } else {
            break;
          }
        }
        continue;
      }
      // Regular inline comment — add to code
      codeLines.push(lines[i]);
      i++;
    } else if (RE.blank.test(lines[i])) {
      codeLines.push(lines[i]);
      i++;
    } else {
      codeLines.push(lines[i]);
      i++;
    }
  }

  const section: NumberedSection = {
    type: "numbered-section",
    number,
    title,
    description: descParts.join("\n").trim(),
    watchOuts,
    code: codeLines.join("\n").trimEnd(),
    inlineHowItWorks: inlineHIW,
  };

  return { section, endLine: i };
}

// ---------------------------------------------------------------------------
// FAQ content parser
// ---------------------------------------------------------------------------

function parseFaqContent(lines: string[]): FaqSection {
  const questions: { question: string; answer: string }[] = [];
  let currentQ = "";
  let currentA = "";
  let inAnswer = false;

  for (const line of lines) {
    const trimmed = line.trim();
    const qMatch = trimmed.match(RE.questionLine);
    const aMatch = trimmed.match(RE.answerLine);

    if (qMatch) {
      // Save previous Q/A pair
      if (currentQ) {
        questions.push({ question: currentQ.trim(), answer: currentA.trim() });
      }
      currentQ = qMatch[1];
      currentA = "";
      inAnswer = false;
    } else if (aMatch) {
      currentA = aMatch[1];
      inAnswer = true;
    } else if (inAnswer && trimmed) {
      currentA += " " + trimmed;
    } else if (!inAnswer && currentQ && trimmed) {
      currentQ += " " + trimmed;
    }
  }

  // Don't forget the last pair
  if (currentQ) {
    questions.push({ question: currentQ.trim(), answer: currentA.trim() });
  }

  return { type: "faq", questions };
}

// ---------------------------------------------------------------------------
// Key Takeaways parser
// ---------------------------------------------------------------------------

function parseKeyTakeawaysContent(lines: string[]): KeyTakeawaysSection {
  const items: string[] = [];
  let current = "";

  for (const line of lines) {
    const trimmed = line.trim();
    const numMatch = trimmed.match(RE.numberedItem);

    if (numMatch) {
      if (current) items.push(current.trim());
      current = numMatch[2];
    } else if (trimmed && current) {
      current += " " + trimmed;
    }
  }

  if (current) items.push(current.trim());

  return { type: "key-takeaways", items };
}

// ---------------------------------------------------------------------------
// Inline HOW IT WORKS (standalone comment, no delimiter)
// ---------------------------------------------------------------------------

function parseInlineHowItWorks(
  lines: string[],
  start: number,
  prefix: "//" | "#",
): { section: HowItWorksSection; endLine: number } {
  const firstText = stripCommentPrefix(lines[start], prefix).trim();
  const title = firstText.replace(/^HOW IT WORKS:?\s*/i, "").trim() || "How It Works";

  let i = start + 1;
  const contentLines: string[] = [];

  while (i < lines.length) {
    if (isCommentLine(lines[i], prefix) && !isMinorDelim(lines[i], prefix) && !isMajorDelim(lines[i], prefix)) {
      contentLines.push(stripCommentPrefix(lines[i], prefix));
      i++;
    } else if (RE.blank.test(lines[i])) {
      // A blank line might end the block, unless followed by more comments
      if (i + 1 < lines.length && isCommentLine(lines[i + 1], prefix)) {
        contentLines.push("");
        i++;
      } else {
        break;
      }
    } else {
      break;
    }
  }

  return {
    section: { type: "how-it-works", title, content: contentLines.join("\n").trim() },
    endLine: i,
  };
}

// ---------------------------------------------------------------------------
// Watch out parser (standalone)
// ---------------------------------------------------------------------------

function parseWatchOut(
  lines: string[],
  start: number,
  prefix: "//" | "#",
): { section: WatchOutSection; endLine: number } {
  const firstText = stripCommentPrefix(lines[start], prefix).trim();
  const woMatch = firstText.match(RE.watchOut)!;
  let content = woMatch[1];

  let i = start + 1;
  while (i < lines.length && isCommentLine(lines[i], prefix)) {
    const text = stripCommentPrefix(lines[i], prefix).trim();
    if (text && !RE.watchOut.test(text) && !RE.numberedItem.test(text)) {
      content += " " + text;
      i++;
    } else {
      break;
    }
  }

  return {
    section: { type: "watch-out", content: content.trim() },
    endLine: i,
  };
}

// ---------------------------------------------------------------------------
// Code block collector
// ---------------------------------------------------------------------------

function parseCodeBlock(
  lines: string[],
  start: number,
  prefix: "//" | "#",
  language: string,
): { section: CodeSection; endLine: number } {
  let i = start;
  const codeLines: string[] = [];

  while (i < lines.length) {
    // Stop at major or minor delimiters
    if (isMajorDelim(lines[i], prefix) || isMinorDelim(lines[i], prefix)) {
      break;
    }

    // Stop if we hit a standalone HOW IT WORKS or FAQ comment block
    if (isCommentLine(lines[i], prefix)) {
      const text = stripCommentPrefix(lines[i], prefix).trim();
      if (RE.howItWorks.test(text) || RE.faqHeader.test(text) || RE.keyTakeaways.test(text)) {
        break;
      }
    }

    codeLines.push(lines[i]);
    i++;
  }

  return {
    section: { type: "code", code: codeLines.join("\n").trimEnd(), language },
    endLine: i,
  };
}
