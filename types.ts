export interface FileData {
  name: string;
  content: string; 
  id: string;
}

export interface AnalysisState {
  isLoading: boolean;
  result: StudySet | null;
  error: string | null;
}

export enum AppStatus {
  IDLE = 'IDLE',
  PROCESSING_FILES = 'PROCESSING_FILES',
  READY_TO_SEARCH = 'READY_TO_SEARCH',
  SEARCHING = 'SEARCHING',
}

// Structured Data Types for the "Super App" UI
export interface StudySet {
  keyword: string;
  totalFound: number;
  items: StudyUnit[];
}

export interface StudyUnit {
  id: number;
  source: string; // e.g., "2023 March High 1 #33"
  relevanceReason: string;
  originalText: string;
  modifiedText: string;
  questions: QuizQuestion[];
  vocabulary: VocabItem[];
}

export interface QuizQuestion {
  id: number;
  type: string; // "Topic", "Title", "Blank"
  questionText: string;
  options: string[];
  correctAnswer: number; // 1-5 index
  explanation: string;
}

export interface VocabItem {
  word: string;
  meaning: string;
}