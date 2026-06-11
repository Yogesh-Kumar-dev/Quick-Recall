// ==============================|| SPEAK UP - TYPES ||============================== //

// A saved question/answer the user is preparing. It may either be an answer to one
// of the static predefined questions (then `sourceId` points at that question's id)
// or a brand-new question the user added themselves (`sourceId` undefined).
export interface SpeakUpQA {
  id: string;
  sourceId?: string; // links to a PredefinedQuestion.id; undefined for user-added
  question: string;
  answer: string;
  tag?: string; // optional user-defined label, used for the filter chips
  jobId?: string; // optional link to a JobApplication.id (which company asked it)
  createdAt: number;
  updatedAt: number;
}

export type SpeakUpQAInput = Omit<SpeakUpQA, 'id' | 'createdAt' | 'updatedAt'>;

// A static, read-only question shown in both the rehearsal tool and the Q&A bank.
export interface PredefinedQuestion {
  id: string;
  question: string;
  category?: string;
}
