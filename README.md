# EduC++

A modern C++ learning platform with structured lessons, interactive quizzes, buggy code challenges, curated learning paths, and editorial articles.

**Live site:** [educplusplus.vercel.app](https://educplusplus.vercel.app)

## What's Inside

- **14 lesson modules** — from fundamentals to advanced C++20 features, built from annotated C++ source files
- **1,355-question quiz** — multiple choice across 25 topics, three difficulty levels
- **545 buggy programs** — C++ code that compiles cleanly but contains exactly one subtle bug, with hints and detailed explanations
- **27 learning paths** — curated sequences of buggy programs organized into 7 thematic categories
- **Editorial articles** — deep dives on topics like special member functions and resource management

## Tech Stack

- [Astro](https://astro.build/) — static site framework
- [Preact](https://preactjs.com/) — interactive components (quiz, buggy code viewer)
- [Tailwind CSS v4](https://tailwindcss.com/) — styling
- [Shiki](https://shiki.style/) — syntax highlighting
- [Vitest](https://vitest.dev/) — testing
- Deployed on [Vercel](https://vercel.com/)

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:4321`.

## Build & Test

```bash
npm run build    # static output to dist/
npm test         # run Vitest suite
```

## Lesson Modules

| Module | Topic |
|--------|-------|
| 01 | Fundamentals |
| 02 | OOP |
| 03 | Memory Management |
| 04 | STL Containers |
| 05 | Algorithms |
| 06 | Templates |
| 07 | Multithreading |
| 08 | Modern C++ (lambdas, move semantics, constexpr) |
| 09 | C++20 (concepts, ranges, coroutines, spaceship) |
| 10 | Error Handling |
| 11 | Type Casting |
| 12 | I/O & Filesystem |
| 13 | Build Systems (CMake) |
| 14 | Variant & Type Traits |

## Quiz Topics

CS Fundamentals, Operating Systems, Fundamentals, OOP, Memory Management, STL Containers, Algorithms, Templates, Multithreading, Modern C++, C++20 Features, Error Handling, Type Casting, I/O & Filesystem, Build Systems, C++ Idioms, Variant & Type Traits, Linux Commands, Lifetime & Storage, Under the Hood, C++ Keywords, Storage Durations, Polymorphism, Value Categories, Code Reading

## Learning Paths

| Category | Paths |
|----------|-------|
| Memory & Ownership | The Ownership Problem, Smart Pointer Mastery, Pointer Discipline, Memory Forensics, Lifetime Puzzles |
| Objects & Classes | Object Lifecycle, Object Anatomy, Construction Zone, Operator Overloading Pitfalls, Inheritance Maze |
| Containers & Algorithms | Iterator Invalidation Rules, Algorithm Contracts, Standard Library Surprises, Container Gotchas, Build It Yourself |
| Resources & Error Handling | Resource Guards, Resource Discipline, Value in Motion, When Things Throw |
| Concurrency | Shared State, Thread Hazards, Concurrency Patterns |
| Templates & Metaprogramming | Template Traps, Template Depths |
| Language, Types & Text | Fundamentals Gauntlet, Language Traps, Silent Conversions, Numeric Hazards, Compilation Traps, C String Archaeology, Text Processing |

## License

MIT
