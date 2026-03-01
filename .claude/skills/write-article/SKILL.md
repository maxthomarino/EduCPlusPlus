---
name: write-article
description: Write a discovery-style article on a C++ topic for the site
argument-hint: <topic>
---

# Write an article about: $ARGUMENTS

## Step 0 — Check for a plan

Look for a plan file at `src/content/articles/.plan.md`. If it exists:
- Read it carefully. It contains the full outline, narrative arc, code examples, and target length for the article.
- Use the plan as your blueprint. Follow its structure, examples, and beats precisely.
- Delete the plan file after reading it (it is a temporary working document).

If no plan file exists, proceed with your own research in Step 1.

## Step 1 — Research the topic

**Skip this step if a plan was loaded in Step 0.**

1. Read 1-2 existing articles in `src/content/articles/` to absorb the site's voice and markdown conventions.
2. Check if an article on `$ARGUMENTS` already exists. If it does, tell the user and stop.
3. Gather the key concepts, mechanisms, and mental models needed to explain `$ARGUMENTS` deeply.

## Step 2 — Create the article file

Create `src/content/articles/<kebab-case-slug>.md` with this frontmatter:

```yaml
---
title: "<descriptive title>"
description: "<one-sentence summary for listings and SEO>"
publishDate: <today's date YYYY-MM-DD>
tags:
  - cpp
  - <relevant-tag>
  - <relevant-tag>
author: "EduC++ Team"
draft: false
---
```

Filename should be a short kebab-case slug derived from the topic (e.g. `virtual-dispatch-under-the-hood.md`).

## Step 3 — Write the article using the Discovery Teaching method

This is the **most important step**. The article must follow the Discovery Teaching approach described below. Do NOT write a textbook chapter, a tutorial, or a Medium post. Write as if you are a brilliant friend explaining something at a whiteboard.

### The Discovery Teaching Prompt

You are explaining a technical concept. Your job is to make the reader feel like they discovered it themselves. The explanation should read like a conversation with a brilliant friend at a whiteboard. No step labels. No "let's pause and think about this." The scaffolding must be completely invisible. If the reader can see the teaching technique, it's already failed.

**How to build the explanation:**

1. **Plant their feet on solid ground.** Open with something they already know. Something small, concrete, and boring in the best way. A few lines of code they could write in their sleep. Don't name the concept you're heading toward. Don't hint. Just let them feel safe.

2. **Then pull the rug.** Extend the scenario one natural step until the ground gives way. Something breaks. Something doesn't make sense. Something that should work just... doesn't. Don't announce it. Don't say "here's where it gets interesting." Just let the narrative walk them off the edge of a cliff mid-sentence. The moment of confusion should sneak up on them.

3. **Let them dangle.** This is the part most explanations skip, and it's the most important. Don't rescue them immediately. Let the problem get worse. Show why the naive fix doesn't work. Show why it's deeper than it looks. The reader should be slightly uncomfortable, genuinely wanting the answer. That discomfort is the glue that makes the solution stick.

4. **Build the ladder one rung at a time.** Now start solving it, but slowly, as if you're inventing the solution together in real time. "Well, we'd need some kind of... but wait, that means... so maybe the compiler could..." Each step should feel inevitable in hindsight but not obvious in advance. The reader should feel like they're half a beat ahead of you, almost guessing the next move.

5. **Walk through the machine.** Once the mechanism exists, trace through one specific example like you're both watching the CPU execute it in slow motion. What's in memory. What pointer goes where. What gets called. Make the abstraction physical and concrete, something they could draw on a napkin.

6. **Name it last.** Only after they fully understand the thing do you tell them what it's called. The terminology should feel like a footnote, not a headline. "Oh, that thing we just built? It's called a vtable." The concept arrived first. The name is just a sticker you slap on at the end.

### The soul of the approach

- **No one remembers what they were told. Everyone remembers what they figured out.** Every sentence should be sequenced so the reader is asking the right question in their head just before you answer it.
- **Prose is the vehicle. Code is the passenger.** Write in flowing, thinking-out-loud sentences. Code appears only at the moments the reader needs to see something concrete. Never lead with a code dump.
- **Talk with them, not at them.** There's a difference between "the compiler inserts a hidden pointer into each object" and "the compiler secretly tucks a hidden pointer inside every object, you never wrote it, you never asked for it, but it's there, sitting at the beginning of the object in memory." The first is a fact. The second is a discovery.
- **Never break the fourth wall.** The moment you write "Step 3" or "This is the key insight" or "Let's think about why this matters," you've pulled back the curtain and shown them the lesson plan. The magic is gone. Let the structure do its work silently.
- **Let it breathe like a conversation.** Real thinking is a little messy. One thought tumbles into the next. A good explanation feels like someone pacing in front of a whiteboard, occasionally turning around with a grin because they know what's coming next. Not a numbered list. Not a slide deck. A voice.
- **The approach should be felt, not seen.**

### Formatting rules

- Use `##` headings sparingly (2-4 max) only when there's a genuine shift in the article's arc. Headings should feel like natural chapter breaks, not outline labels.
- Code blocks use triple backticks with `cpp` language tag.
- Keep code snippets short and purposeful. Every code block should exist because the reader *needs* to see something concrete at that moment.
- No bullet-point summaries, no "key takeaways" boxes, no "TL;DR" sections.
- Target length: If a plan was loaded, follow the plan's target length. Otherwise, aim for 200-350 lines of markdown. Long enough to build the full discovery arc, short enough to hold attention.
- Do NOT use em-dashes. Write simple, direct sentences instead.

## Step 4 — Self-review

Before finishing, re-read the article and check:

1. **Fourth-wall check**: Does any sentence sound like a teacher announcing what they're about to teach? ("In this section we'll...", "The key insight is...", "Let's explore..."). Remove or rewrite these.
2. **Discovery arc check**: Does the article start safe, create genuine confusion, let it build, then resolve it step by step? If the answer is given too early, restructure.
3. **Code balance check**: Is prose driving the narrative with code appearing only when needed? If there are back-to-back code blocks without prose between them, fix it.
4. **Naming check**: Is the formal terminology introduced only after the concept is already understood? If a term appears in its own heading before being explained, move it.
5. **Voice check**: Read the opening paragraph. Does it sound like a textbook or like a person thinking out loud? Rewrite if needed.

## Step 5 — Validate

Verify the article renders correctly:

```bash
npx astro check 2>&1 | head -20
```

If there are schema or frontmatter errors, fix them.

## Step 6 — Commit

After validation passes, commit with message:
`Add article: <article title>`
