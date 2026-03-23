export interface StdlibRef {
  name: string;
  args?: string;
  brief: string;
  note?: string;
  link: string;
}

export interface BuggyProgram {
  id: number;
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  title: string;
  description: string;
  code: string;
  hints: string[];
  explanation: string;
  manifestation: string;
  stdlibRefs?: StdlibRef[];
}

export interface BuggyProgramHighlighted extends BuggyProgram {
  highlightedHtml: string;
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  programIds: number[];
}

export interface PathGroup {
  label: string;
  pathIds: string[];
}
