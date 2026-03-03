export interface Flashcard {
  id: number;
  topic: string;
  category: string;
  front: string;
  back: string;
  note?: string;
}
