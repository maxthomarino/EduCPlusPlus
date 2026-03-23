---
name: deploy
description: Push to both remotes and run the Vercel production deploy pipeline
---

# Deploy Pipeline

Run the full deploy workflow. Before starting, verify there are no uncommitted changes and the build passes.

## Pre-flight checks

1. Run `git status` to confirm no uncommitted changes exist. If there are uncommitted content changes, commit them first using the `origin` identity (`dudujuju828` / `dudujuju828@gmail.com`).
2. Run `npm run build` and confirm it passes with no errors.

## Step 1 — Push to `origin`

```bash
git push origin main
```

## Step 2 — Create deploy-trigger commit and push to `alternative`

```bash
git -c user.name="maxthomarino" -c user.email="maxthomarino@gmail.com" \
    commit --allow-empty -m "Trigger production deploy"
git push alternative main --force-with-lease
```

## Step 3 — Run Vercel production deploy

```bash
vercel --prod
```

Wait for the deploy to complete successfully. If it fails, investigate and report the error — do NOT proceed to Step 4.

## Step 4 — Restore sync

```bash
git reset HEAD~1
git push alternative main --force-with-lease
```

## Final verification

Run `git log --oneline -1` and confirm both remotes point to the same commit. Report the deployed commit hash to the user.
