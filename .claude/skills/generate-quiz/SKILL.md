---
name: generate-quiz
description: Generate 30 balanced MCQs on a topic and append them to questions.ts
argument-hint: <topic-name>
---

# Generate 30 MCQs for: $ARGUMENTS

## Step 1 — Gather context

1. Read `src/lib/questions.ts` to find:
   - The current **max question ID** (scan all `id: N` values).
   - The **TOPICS** array — check if `$ARGUMENTS` already exists there.
   - The format and style of existing questions (indentation, field order, etc.).
2. New questions start at **max ID + 1**.

## Step 2 — Topic handling

- If `$ARGUMENTS` matches an existing topic in the TOPICS array, use that exact string.
- If it is a **new** topic, add it to the `TOPICS` array in `src/lib/questions.ts` (in alphabetical order among the existing entries).

## Step 3 — Generate 30 questions

Create exactly **30** questions following this TypeScript interface:

```ts
{
  id: number;
  difficulty: "Easy" | "Medium" | "Hard";
  topic: string;
  question: string;
  code?: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
  link?: string;
}
```

### Difficulty distribution
- 10 Easy, 10 Medium, 10 Hard

### Randomize `correctIndex`
- Do NOT always put the correct answer at index 1.
- Spread `correctIndex` roughly evenly across 0, 1, 2, 3.

### CRITICAL — Option length balancing
**All four options for each question MUST be approximately the same length.**

For every question, follow this process:
1. Write the correct answer first.
2. Write three plausible but **wrong** distractors.
3. Measure the character length of all four options.
4. Adjust so that **every option is within ±20% of the average length**.
   - If a distractor is too short, add plausible-sounding technical detail (e.g., reasons, mechanisms, examples).
   - If a distractor is too long, trim it while keeping it plausible.
   - If the correct answer is much longer than the others, expand the distractors — never shorten the correct answer to compensate.
5. **Self-check**: Before writing each question, verify that `max(lengths) / min(lengths) < 1.4`. If not, rewrite the options.

### Content quality rules
- Questions must be **factually accurate** — the correct answer must be unambiguously correct.
- Distractors must be **plausible but definitively wrong** — they should represent common misconceptions or near-misses.
- Include `code` snippets where appropriate (use backtick template literals).
- Include a `link` to a reputable reference (cppreference, learncpp, MDN, Wikipedia, etc.) where possible.
- The `explanation` should teach — explain **why** the correct answer is right and, ideally, why the most tempting distractor is wrong.
- Avoid trick questions. Test understanding, not gotchas.

## Step 4 — Append to questions.ts

1. Add a section comment before the new questions: `// ── $ARGUMENTS (Q{firstId}–Q{lastId}) ──`
2. Append all 30 questions to the `questions` array in `src/lib/questions.ts`.
3. If the topic is new, also update the TOPICS array (Step 2).

## Step 5 — Validate

After writing, run this validation:

```bash
node -e "
const src = require('fs').readFileSync('src/lib/questions.ts', 'utf8');
const ids = [...src.matchAll(/id:\s*(\d+)/g)].map(m=>parseInt(m[1]));
const idRegex = /\{\s*id:\s*(\d+),/g;
let m; const positions = [];
while ((m = idRegex.exec(src)) !== null) positions.push({id:parseInt(m[1]),start:m.index});
let flagged = 0;
for (let i = 0; i < positions.length; i++) {
  const s = positions[i].start;
  const e = i+1<positions.length?positions[i+1].start:src.length;
  const block = src.substring(s,e);
  const ci = block.match(/correctIndex:\s*(\d+)/);
  if (!ci) continue;
  const correctIdx = parseInt(ci[1]);
  const optStart = block.indexOf('options:');
  if (optStart===-1) continue;
  const bs = block.indexOf('[',optStart);
  if (bs===-1) continue;
  let d=0,be=-1;
  for (let j=bs;j<block.length;j++){if(block[j]==='[')d++;if(block[j]===']'){d--;if(d===0){be=j;break;}}}
  if (be===-1) continue;
  const os=block.substring(bs+1,be);
  const opts=[];let cur='',inS=false,qt='',esc=false;
  for(let j=0;j<os.length;j++){const c=os[j];if(esc){cur+=c;esc=false;continue;}if(c==='\\\\'){esc=true;cur+=c;continue;}if(!inS&&(c==='\"'||c===\"'\"||c==='${'`'}')){inS=true;qt=c;cur+=c;}else if(inS&&c===qt){inS=false;cur+=c;}else if(!inS&&c===','){opts.push(cur.trim());cur='';}else cur+=c;}
  if(cur.trim())opts.push(cur.trim());
  const cleaned=opts.map(o=>{o=o.trim();for(const q of['\"',\"'\",'${'`'}'])if(o.startsWith(q)&&o.endsWith(q)&&o.length>=2){o=o.slice(1,-1);break;}return o;});
  if(cleaned.length!==4)continue;
  const lens=cleaned.map(o=>o.length);
  const cLen=lens[correctIdx];
  const wLens=lens.filter((_,idx)=>idx!==correctIdx);
  const avg=wLens.reduce((a,b)=>a+b,0)/wLens.length;
  const maxW=Math.max(...wLens);const minW=Math.min(...wLens);
  const ratio=avg>0?cLen/avg:1;
  if((cLen>maxW&&(cLen-maxW)>=15&&ratio>1.5)||(cLen<minW&&(minW-cLen)>=15&&ratio<0.55))flagged++;
  else if((cLen>maxW&&(cLen-maxW)>=10&&ratio>1.3)||(cLen<minW&&(minW-cLen)>=10&&ratio<0.7))flagged++;
}
console.log('Total questions:',ids.length);
console.log('Duplicate IDs:',ids.length-new Set(ids).size);
console.log('Length-imbalanced:',flagged);
"
```

- **Total questions** should be previous count + 30.
- **Duplicate IDs** must be 0.
- **Length-imbalanced** must be 0.

If any check fails, fix the issues before finishing.

Also run `npx tsc --noEmit src/lib/questions.ts` to confirm no type errors.
