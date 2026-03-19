# CLAUDE.md

## Project: EduCPlusPlus

C++ educational quiz app built with TypeScript. Questions live in `src/lib/questions/` (one file per topic, re-exported via `index.ts`).

## Critical Rules

- **Commit after every batch of generated questions.** After appending questions to the relevant topic file in `src/lib/questions/` and passing validation, immediately create a git commit. Never leave generated questions uncommitted. Uncommitted work was previously lost due to an accidental `git checkout --` revert.
- When writing append scripts (.cjs), always include the closing `"` on option strings: `"option text",` not `"option text,`.

## Git Identity per Remote

There are two remotes. **Every commit must be authored with the identity that matches the remote it will be pushed to.** Use `git -c user.name="..." -c user.email="..." commit ...` on every commit.

| Remote | Repo | `user.name` | `user.email` |
|--------|------|-------------|--------------|
| `origin` | `dudujuju828/EduCPlusPlus` | `dudujuju828` | `dudujuju828@gmail.com` |
| `alternative` | `maxthomarino/EduCPlusPlus` | `maxthomarino` | `maxthomarino@gmail.com` |

**All regular work commits use the `origin` identity** (`dudujuju828`). The `alternative` identity (`maxthomarino`) is only used for the temporary deploy-trigger commit in the deploy workflow below.

## Deploy Workflow

Run this **after all content is committed and validated** (build passes, no duplicate IDs, etc.). The goal is to push content to both remotes, trigger a Vercel production deploy via `alternative`, and then bring both remotes back in sync.

### Step 1 — Push to `origin`

```bash
git push origin main
```

This pushes all new content commits (authored as `dudujuju828`) to the primary remote.

### Step 2 — Create a deploy-trigger commit and push to `alternative`

```bash
git -c user.name="maxthomarino" -c user.email="maxthomarino@gmail.com" \
    commit --allow-empty -m "Trigger production deploy"
git push alternative main --force-with-lease
```

This creates a temporary empty commit (authored as `maxthomarino`) that only exists to trigger the Vercel deploy on `alternative`. The `--force-with-lease` is needed because `alternative` may be behind after the previous deploy cycle's reset.

### Step 3 — Run Vercel production deploy

```bash
vercel --prod
```

Wait for the deploy to complete successfully.

### Step 4 — Restore sync

```bash
git reset HEAD~1
git push alternative main --force-with-lease
```

This removes the temporary deploy commit locally (soft reset — working tree untouched) and force-pushes `alternative` back down so both remotes point to the same real content commit. After this step, `origin` and `alternative` are identical.

### Summary of final state

- `origin/main` = latest content commit (authored as `dudujuju828`)
- `alternative/main` = same commit (force-pushed back after deploy)
- Local `main` = same commit
- Vercel = deployed from the now-removed deploy-trigger commit (the build output is identical since it was an empty commit on top of the same content)
