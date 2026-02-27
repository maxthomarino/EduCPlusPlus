---
name: generate-quiz-general
description: Generate 30 balanced MCQs on a topic chosen by the AI based on coverage gaps
---

# Generate 30 MCQs — AI-chosen topic

## Step 1 — Gather context and choose a topic

1. Read `src/lib/questions.ts` to find:
   - The current **max question ID** (scan all `id: N` values).
   - The **TOPICS** array and the **count of questions per topic**.
   - The format and style of existing questions (indentation, field order, etc.).
2. New questions start at **max ID + 1**.
3. **Choose the topic** using this priority order:
   - **First priority**: Pick an existing topic that has the fewest questions (least coverage).
   - **Second priority**: If all existing topics have roughly equal coverage (within 10 of each other), introduce a **new** C++ topic that is not yet in the TOPICS array. Good candidates include: Concurrency, Exceptions, Namespaces, Preprocessor, Enumerations, Lambdas, Iterators, Move Semantics, RAII, Operator Overloading, Function Overloading, Inheritance, Unions, Bitwise Operations, Constexpr, Concepts, Ranges, Coroutines, Modules, or any other core C++ topic missing from the list.
   - **Never** pick the topic that already has the most questions.
4. Print which topic was chosen and why (e.g., "Chose 'Exceptions' — only 30 questions vs average of 55").

## Step 2 — Topic handling

- If the chosen topic matches an existing topic in the TOPICS array, use that exact string.
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
- Do NOT always put the correct answer at index 1. This is a known bias -- avoid it.
- Spread `correctIndex` **exactly**: aim for 7-8 each of 0, 1, 2, 3 across the 30 questions.
- **Self-check**: After generating all 30, count the distribution. If any index has fewer than 5 or more than 10, reshuffle.

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

### CRITICAL -- No visual tells in options
**The correct answer must NOT be visually distinguishable from the distractors.**

1. **NO em-dashes (—)** anywhere. Do NOT use `--` (double hyphen) as explanatory dashes either. Write simple, direct sentences instead.
   - BAD: `"Returns an iterator -- the position where insertion maintains order"`
   - GOOD: `"Returns an iterator to the first position where insertion maintains sorted order"`
2. **NO explanatory parentheticals** that only the correct answer has.
   - BAD (correct): `"Uses O(n log n) time (via introsort hybrid)"` while distractors have no parens.
   - GOOD: Either ALL options use parentheticals or NONE do.
3. **Correct answer must NOT be the longest option.** Aim for the correct answer to be average-length among the 4 options.
4. **Match sentence complexity across all 4 options.** If the correct answer uses colons or multiple commas, distractors must too.
5. **Self-check**: For each question, verify:
   - No option uniquely contains `--`, `()`, colons, or extra commas
   - The correct answer is not the longest or shortest option
   - All 4 options have similar punctuation patterns

### Content quality rules
- Questions must be **factually accurate** -- the correct answer must be unambiguously correct.
- Distractors must be **plausible but definitively wrong** -- they should represent common misconceptions or near-misses.
- Include `code` snippets where appropriate (use backtick template literals).
- Include a `link` to a reputable reference (cppreference, learncpp, MDN, Wikipedia, etc.) where possible.
- The `explanation` should teach -- explain **why** the correct answer is right and, ideally, why the most tempting distractor is wrong.
- Avoid trick questions. Test understanding, not gotchas.

## Step 4 — Append to questions.ts

1. Add a section comment before the new questions: `// ── {CHOSEN_TOPIC} (Q{firstId}–Q{lastId}) ──`
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

Then run these additional checks:

```bash
npx tsc --noEmit src/lib/questions.ts
```

```bash
node -e "
const src = require('fs').readFileSync('src/lib/questions.ts', 'utf8');
// Check em-dashes
const emDashes = (src.match(/\u2014/g) || []).length;
console.log('Em-dashes found:', emDashes);
// Check correctIndex distribution
const ciAll = [...src.matchAll(/correctIndex:\s*(\d+)/g)];
const dist = {0:0,1:0,2:0,3:0};
ciAll.forEach(m => dist[parseInt(m[1])]++);
const total = ciAll.length;
console.log('correctIndex distribution:', dist);
console.log('Index 1 percentage:', (dist[1]/total*100).toFixed(1)+'%');
if (dist[1]/total > 0.35) console.log('WARNING: index 1 is overrepresented!');
"
```

- **Em-dashes found** must be 0.
- **Index 1 percentage** must be below 35%.
- TypeScript must compile with no errors.

If any check fails, fix the issues before finishing.
