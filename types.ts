export interface DictationList {
  id: string;
  date: string;
  title: string;
  words: string[];
}

export type AppState = 'SELECTION' | 'PRACTICE' | 'COMPLETION' | 'EDIT';

export interface VoiceOption {
  name: string;
  lang: string;
}