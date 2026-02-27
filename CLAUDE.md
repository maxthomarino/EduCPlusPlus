# CLAUDE.md

## Project: EduCPlusPlus

C++ educational quiz app built with TypeScript. Questions live in `src/lib/questions.ts`.

## Critical Rules

- **Commit after every batch of generated questions.** After appending questions to `src/lib/questions.ts` and passing validation, immediately create a git commit. Never leave generated questions uncommitted. Uncommitted work was previously lost due to an accidental `git checkout --` revert.
- When writing append scripts (.cjs), always include the closing `"` on option strings: `"option text",` not `"option text,`.
