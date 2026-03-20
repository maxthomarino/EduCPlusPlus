export type { BuggyProgram, BuggyProgramHighlighted, StdlibRef } from "./types";
export { programs } from "./programs";

import { programs } from "./programs";

const topicSet = new Set<string>();
for (const p of programs) {
  topicSet.add(p.topic);
}
export const BUGGY_TOPICS = [...topicSet].sort();
