export interface Philosopher {
  id: string;
  name: string;
  shortName: string;
  life: string;
  era: string;
  birthYear: number;
  x: number;
  y: number;
  color: string;
  quote: string;
  bio: string;
  bioEn?: string | null;
  ideas: string[];
  works: string[];
  wiki?: string | null;
}

export interface Influence {
  fromId: string;
  toId: string;
}

export type ViewMode = "tree" | "mindmap" | "timeline" | "galaxy" | "quiz";

export type Language = "de" | "en" | "ar";

export interface QuizQuestion {
  id: string;
  philosopherId: string;
  question: string;
  options: string[];
  correctIndex: number;
}

export interface AIChatMessage {
  role: "user" | "assistant";
  content: string;
}
