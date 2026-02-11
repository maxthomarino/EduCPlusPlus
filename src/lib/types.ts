/** All TypeScript interfaces for the parsed .cpp data structures */

export interface ParsedFile {
  /** e.g., "01_fundamentals" */
  moduleName: string;
  /** e.g., "Fundamentals" */
  moduleTitle: string;
  /** e.g., "basics" */
  subfolder: string;
  /** e.g., "hello_modern.cpp" */
  fileName: string;
  /** URL slug: "01-fundamentals/basics/hello-modern" */
  slug: string;
  /** e.g., 1 (parsed from module prefix) */
  moduleOrder: number;

  header: FileHeader;
  sections: Section[];
  rawSource: string;
}

export interface FileHeader {
  /** Full title line, e.g. "hello_modern.cpp - Modern C++ Hello World" */
  title: string;
  /** Just the descriptive part: "Modern C++ Hello World" */
  shortTitle: string;
  /** Paragraph(s) describing the file's purpose */
  description: string;
  why?: string;
  when?: string;
  standard?: string;
  prerequisites?: string;
  references: string[];
}

export type Section =
  | FaqSection
  | HowItWorksSection
  | KeyTakeawaysSection
  | NumberedSection
  | DecisionGuideSection
  | GenericNamedSection
  | CodeSection
  | WatchOutSection;

export interface FaqSection {
  type: "faq";
  questions: { question: string; answer: string }[];
}

export interface HowItWorksSection {
  type: "how-it-works";
  title: string;
  content: string;
}

export interface KeyTakeawaysSection {
  type: "key-takeaways";
  items: string[];
}

export interface NumberedSection {
  type: "numbered-section";
  number: number;
  title: string;
  description: string;
  watchOuts: string[];
  code: string;
  inlineHowItWorks: { title: string; content: string }[];
}

export interface DecisionGuideSection {
  type: "decision-guide";
  title: string;
  content: string;
}

export interface GenericNamedSection {
  type: "generic-section";
  title: string;
  content: string;
}

export interface CodeSection {
  type: "code";
  code: string;
  language: string;
}

export interface WatchOutSection {
  type: "watch-out";
  content: string;
}

/** Sidebar tree structure */
export interface SidebarModule {
  name: string;
  title: string;
  order: number;
  subfolders: SidebarSubfolder[];
}

export interface SidebarSubfolder {
  name: string;
  files: SidebarFile[];
}

export interface SidebarFile {
  fileName: string;
  shortTitle: string;
  slug: string;
}
