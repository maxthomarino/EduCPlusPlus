export type { Question } from "./types";
import type { Question } from "./types";

export const TOPICS = [
  "CS Fundamentals",
  "Operating Systems",
  "Fundamentals",
  "OOP",
  "Memory Management",
  "STL Containers",
  "Algorithms",
  "Templates",
  "Multithreading",
  "Modern C++",
  "C++20 Features",
  "Error Handling",
  "Type Casting",
  "I/O & Filesystem",
  "Build Systems",
  "C++ Idioms",
  "Variant & Type Traits",
  "Linux Commands",
  "Lifetime & Storage",
  "Under the Hood",
  "Physics for Software Engineering",
  "C++ Keywords",
  "Storage Durations",
  "Polymorphism",
  "Value Categories",
  "Code Reading",
] as const;

export type Topic = (typeof TOPICS)[number];

import { questions as csFundamentals } from "./cs-fundamentals";
import { questions as operatingSystems } from "./operating-systems";
import { questions as fundamentals } from "./fundamentals";
import { questions as oop } from "./oop";
import { questions as memoryManagement } from "./memory-management";
import { questions as stlContainers } from "./stl-containers";
import { questions as algorithms } from "./algorithms";
import { questions as templates } from "./templates";
import { questions as multithreading } from "./multithreading";
import { questions as modernCpp } from "./modern-cpp";
import { questions as cpp20Features } from "./cpp20-features";
import { questions as errorHandling } from "./error-handling";
import { questions as typeCasting } from "./type-casting";
import { questions as ioFilesystem } from "./io-filesystem";
import { questions as buildSystems } from "./build-systems";
import { questions as cppIdioms } from "./cpp-idioms";
import { questions as variantTypeTraits } from "./variant-type-traits";
import { questions as linuxCommands } from "./linux-commands";
import { questions as lifetimeStorage } from "./lifetime-storage";
import { questions as underTheHood } from "./under-the-hood";
import { questions as physics } from "./physics";
import { questions as cppKeywords } from "./cpp-keywords";
import { questions as storageDurations } from "./storage-durations";
import { questions as polymorphism } from "./polymorphism";
import { questions as valueCategories } from "./value-categories";
import { questions as codeReading } from "./code-reading";

export const questions: Question[] = [
  ...csFundamentals,
  ...operatingSystems,
  ...fundamentals,
  ...oop,
  ...memoryManagement,
  ...stlContainers,
  ...algorithms,
  ...templates,
  ...multithreading,
  ...modernCpp,
  ...cpp20Features,
  ...errorHandling,
  ...typeCasting,
  ...ioFilesystem,
  ...buildSystems,
  ...cppIdioms,
  ...variantTypeTraits,
  ...linuxCommands,
  ...lifetimeStorage,
  ...underTheHood,
  ...physics,
  ...cppKeywords,
  ...storageDurations,
  ...polymorphism,
  ...valueCategories,
  ...codeReading,
];
