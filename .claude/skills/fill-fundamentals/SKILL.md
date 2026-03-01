---
name: fill-fundamentals
description: Check if a topic covers basic "what is" questions and add missing fundamentals
argument-hint: <topic-name>
---

# Fill fundamental gaps for: $ARGUMENTS

## Goal

Ensure the topic has basic introductory questions like "What is X?", "What does X do?", "When should you use X?" before edge-cases and advanced scenarios. If these basics are missing, generate them.

## Step 1 — Audit existing questions

1. Read `src/lib/questions/index.ts` to find the TOPICS array and locate the topic file for `$ARGUMENTS`.
2. Read the topic file and extract **every question text**.
3. Classify each question into one of these categories:
   - **Definition**: "What is...", "What does... do", "What is the purpose of..."
   - **When/Why**: "When should you use...", "Why is... preferred", "What is the difference between..."
   - **How**: "How does... work", "Which... should you use to..."
   - **Code output**: "What is the output...", "What is the result..."
   - **Edge-case/Advanced**: everything else (UB scenarios, cross-casts, subtle interactions)
4. Print a coverage report:
   ```
   Topic: <name>
   Total questions: N
   Definition questions: N (list them briefly)
   When/Why questions: N (list them briefly)
   How questions: N
   Code output questions: N
   Edge-case/Advanced: N
   ```

## Step 2 — Identify missing fundamentals

For the topic, brainstorm the **core concepts** a beginner must know. For example, for "Type Casting":
- What is static_cast? What is dynamic_cast? What is const_cast? What is reinterpret_cast?
- When should you use each one? What is the difference between them?
- What is a C-style cast? What is an implicit conversion? What is a narrowing conversion?

Check which of these core concepts already have a basic question. List the **gaps**: concepts that have no basic introductory question.

If there are **0 gaps**, report "All fundamentals covered!" and stop.

## Step 3 — Generate questions to fill gaps

For each gap, generate **one** question. Follow the same rules as the generate-quiz skill:

- Use the `Question` interface from `src/lib/questions/types.ts`
- Find the current max ID by running:
  ```bash
  node -e "const fs=require('fs'),path=require('path'),dir='src/lib/questions';const ids=fs.readdirSync(dir).filter(f=>f.endsWith('.ts')&&f!=='index.ts'&&f!=='types.ts').flatMap(f=>[...fs.readFileSync(path.join(dir,f),'utf8').matchAll(/id:\s*(\d+)/g)].map(m=>+m[1]));console.log('Max ID:',Math.max(...ids),'Total:',ids.length)"
  ```
- New questions start at **max ID + 1**
- All gap-filling questions should be difficulty **"Easy"** or **"Medium"**
- Follow ALL the option-length, no-visual-tells, and correctIndex distribution rules from the generate-quiz skill

### correctIndex distribution
- Spread correctIndex roughly evenly across 0, 1, 2, 3 for the batch
- No index should have more than 40% of the batch

### Option rules (same as generate-quiz)
- All four options within ±20% average length, max/min ratio < 1.4
- No em-dashes, no visual tells, correct answer not the longest
- Match punctuation patterns across all 4 options

## Step 4 — Append to the topic file

1. Add a section comment: `// ── $ARGUMENTS fundamentals (Q{firstId}–Q{lastId}) ──`
2. Append all new questions to the topic file's `questions` array.

## Step 5 — Validate

Run the same validation as generate-quiz:

```bash
node -e "
const fs=require('fs'),path=require('path'),dir='src/lib/questions';
const src=fs.readdirSync(dir).filter(f=>f.endsWith('.ts')&&f!=='index.ts'&&f!=='types.ts').map(f=>fs.readFileSync(path.join(dir,f),'utf8')).join('\n');
const ids = [...src.matchAll(/id:\s*(\d+)/g)].map(m=>parseInt(m[1]));
console.log('Total questions:',ids.length);
console.log('Duplicate IDs:',ids.length-new Set(ids).size);
"
```

```bash
npx tsc --noEmit src/lib/questions/index.ts
```

- **Duplicate IDs** must be 0.
- TypeScript must compile with no errors.

If any check fails, fix the issues before finishing.

## Step 6 — Commit

After validation passes, commit with message:
`Add N <topic> fundamentals questions (Q{first}-Q{last}), total now {total}`
