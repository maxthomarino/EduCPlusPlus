---
name: plan-article
description: Plan and write a long discovery-style article (plans first, then executes /write-article)
argument-hint: <topic>
---

# Plan and write an article about: $ARGUMENTS

This skill has two phases: first plan the article in detail, then hand off to `/write-article` to execute it.

## Phase 1 — Deep Planning

### Step 1.1 — Research

1. Read 1-2 existing articles in `src/content/articles/` to understand the site's voice, depth, and conventions.
2. Check if an article on `$ARGUMENTS` already exists. If it does, tell the user and stop.
3. Research the topic thoroughly. Understand:
   - The core mechanism (what actually happens at the compiler/runtime level)
   - Common misconceptions and where people get confused
   - The historical context (why does this feature exist, what problem did it solve)
   - Edge cases and subtle gotchas that even experienced developers miss
   - How this connects to other C++ features

### Step 1.2 — Design the narrative arc

Plan the Discovery Teaching arc in detail. Write out:

1. **The safe opening** — What familiar, boring code will the reader start with? What do they already know that you can build on? Write the exact opening code snippet.

2. **The rug pull** — What natural extension breaks things? What specific bug, compilation error, or unexpected behavior will sneak up on them? Design the exact scenario. It should feel inevitable, not contrived.

3. **The dangling** — How deep does the rabbit hole go? Plan 2-3 layers of "and it gets worse":
   - The first naive fix that does not work (or only partially works)
   - A second attempt that reveals a deeper issue
   - The moment when the reader realizes the problem is structural, not superficial

4. **The ladder** — Plan the step-by-step resolution. Each rung should be:
   - A single new idea or mechanism
   - Something that feels almost guessable from the previous rung
   - Accompanied by a short code example if it needs to be concrete
   Plan at least 4-5 rungs. More complex topics may need 6-8.

5. **The machine walkthrough** — Design one specific, concrete example to trace through in detail. What values are in memory? What does the compiler generate? What gets called in what order? This should be the "napkin diagram" moment.

6. **The naming** — When do formal terms get introduced? Map out where each piece of terminology lands, always after the concept it describes.

7. **The broader picture** — Plan how to connect back outward after the deep dive. How does this feature interact with other parts of C++? What practical guidelines should the reader walk away with? This should not feel like a summary section but like the natural last few minutes of a whiteboard conversation.

### Step 1.3 — Plan code examples

List every code snippet that will appear in the article. For each one:
- What does it show?
- Where in the arc does it appear?
- How many lines is it? (keep each snippet under 15 lines)
- What is the prose setup before it?

Aim for 8-14 code snippets total. That gives enough concreteness without drowning the prose.

### Step 1.4 — Plan section breaks

Plan 3-5 `##` headings. Each one marks a genuine shift in the arc, not a topic label. Good headings feel like chapter titles in a novel, not section headers in a manual.

### Step 1.5 — Set the target length

Based on the complexity of the topic:
- Standard topic: 250-350 lines
- Deep/complex topic: 350-450 lines
- Very broad topic (covering multiple related concepts): 400-500 lines

### Step 1.6 — Write the plan file

Write the complete plan to `src/content/articles/.plan.md` using this structure:

```markdown
# Article Plan: <topic>

## Metadata
- **Slug**: <kebab-case-slug>
- **Title**: "<working title>"
- **Description**: "<one-sentence summary>"
- **Tags**: <comma-separated>
- **Target length**: <N>-<N> lines

## Narrative Arc

### Safe opening
<describe the opening scene, include the opening code snippet>

### Rug pull
<describe exactly what breaks and how>

### Dangling (layers of "it gets worse")
1. <first naive fix and why it fails>
2. <second attempt and deeper issue>
3. <the structural realization>

### Ladder (step-by-step resolution)
1. <rung 1: idea + code>
2. <rung 2: idea + code>
3. <rung 3: idea + code>
...

### Machine walkthrough
<describe the concrete trace-through example>

### Naming points
- <term 1>: introduced after <which concept>
- <term 2>: introduced after <which concept>

### Broader picture
<how to close out, connections to other features>

## Code Examples (in order of appearance)
1. <description> (~N lines)
2. <description> (~N lines)
...

## Section Breaks
1. ## <heading 1> — after <what happens>
2. ## <heading 2> — after <what happens>
...
```

### Step 1.7 — Show the plan to the user

After writing the plan file, display a concise summary to the user:
- The title
- The narrative arc in 3-4 sentences
- The target length
- Ask: "Ready to write, or want to adjust anything?"

Wait for user confirmation before proceeding.

## Phase 2 — Execute

After user approval, invoke the `/write-article` skill with the same topic:

```
/write-article $ARGUMENTS
```

The write-article skill will find the plan file at `src/content/articles/.plan.md` and use it as the blueprint.
