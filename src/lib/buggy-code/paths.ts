import type { LearningPath } from "./types";

export const learningPaths: LearningPath[] = [
  {
    id: "ownership-problem",
    title: "The Ownership Problem",
    description: "Raw pointer bugs that motivate RAII and modern ownership patterns.",
    programIds: [13, 54, 14, 17, 64, 16, 19, 21],
  },
  {
    id: "smart-pointer-mastery",
    title: "Smart Pointer Mastery",
    description: "Progress from unique_ptr basics through shared_ptr pitfalls to weak_ptr patterns.",
    programIds: [23, 25, 27, 29, 31, 24, 26, 28, 30, 32],
  },
  {
    id: "iterator-invalidation",
    title: "Iterator Invalidation Rules",
    description: "Learn when iterators break — from simple erase mistakes to complex multi-container traps.",
    programIds: [1, 74, 77, 76, 75, 78, 79, 80, 83],
  },
  {
    id: "c-string-archaeology",
    title: "C String Archaeology",
    description: "Explore the traps hiding in strlen, strncpy, sprintf, and memcpy.",
    programIds: [18, 55, 70, 60, 73, 67, 72],
  },
  {
    id: "object-lifecycle",
    title: "Object Lifecycle",
    description: "Follow an object from construction through copying to destruction — and find the bugs at every stage.",
    programIds: [44, 46, 49, 47, 11, 66, 5, 15],
  },
  {
    id: "operator-overloading",
    title: "Operator Overloading Pitfalls",
    description: "Return types, ordering, implicit conversions — the subtle mistakes in custom operators.",
    programIds: [34, 36, 38, 35, 39, 43, 41, 42],
  },
];
