# CLAUDE.md

## Project: EduCPlusPlus

C++ educational quiz app built with TypeScript. Questions live in `src/lib/questions/` (one file per topic, re-exported via `index.ts`).

## Critical Rules

- **Commit after every batch of generated questions.** After appending questions to the relevant topic file in `src/lib/questions/` and passing validation, immediately create a git commit. Never leave generated questions uncommitted. Uncommitted work was previously lost due to an accidental `git checkout --` revert.
- When writing append scripts (.cjs), always include the closing `"` on option strings: `"option text",` not `"option text,`.

## Git Identity per Remote

All commits must use the identity matching the remote they are pushed to:

- **`origin`** (dudujuju828): `user.name="dudujuju828"`, `user.email="dudujuju828@gmail.com"`
- **`alternative`** (maxthomarino): `user.name="maxthomarino"`, `user.email="maxthomarino@gmail.com"`

Use `git -c user.name="..." -c user.email="..." commit ...` to set the author per commit.

## Deploy Workflow (after generating content and committing)

After all content is committed and validated, run this deploy sequence:

1. **Push to `origin`:** `git push origin main`
2. **Create a deploy commit on `alternative` only:**
   - `git -c user.name="maxthomarino" -c user.email="maxthomarino@gmail.com" commit --allow-empty -m "Trigger production deploy"`
   - `git push alternative main --force-with-lease`
3. **Run production deploy:** `vercel --prod`
4. **Restore sync:** Remove the deploy commit locally and force-push `alternative` back to match:
   - `git reset HEAD~1`
   - `git push alternative main --force-with-lease`
