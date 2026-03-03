export type { Flashcard } from "./types";

import type { Flashcard } from "./types";
import { flashcards as rigidBodies } from "./rigid-bodies";

export const FLASHCARD_TOPICS = ["Rigid Bodies"] as const;

export type FlashcardTopic = (typeof FLASHCARD_TOPICS)[number];

export const flashcards: Flashcard[] = [...rigidBodies];
