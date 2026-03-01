# CLAUDE.md

## Project: EduCPlusPlus

C++ educational quiz app built with TypeScript. Questions live in `src/lib/questions/` (one file per topic, re-exported via `index.ts`).

## Critical Rules

- **Commit after every batch of generated questions.** After appending questions to the relevant topic file in `src/lib/questions/` and passing validation, immediately create a git commit. Never leave generated questions uncommitted. Uncommitted work was previously lost due to an accidental `git checkout --` revert.
- When writing append scripts (.cjs), always include the closing `"` on option strings: `"option text",` not `"option text,`.
