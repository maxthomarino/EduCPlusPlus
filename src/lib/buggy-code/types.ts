export interface BuggyProgram {
  id: number;
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  title: string;
  description: string;
  code: string;
  hints: string[];
  explanation: string;
}

export interface BuggyProgramHighlighted extends BuggyProgram {
  highlightedHtml: string;
}
