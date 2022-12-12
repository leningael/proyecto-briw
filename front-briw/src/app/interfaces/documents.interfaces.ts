export interface SuggestionsResponse{
  keywords: Array<[string, number]>;
}

export interface SearchResponse{
  docs: DocumentResult[];
  highlighting: Highlighting;
}
export interface DocumentResult{
  id: string;
  title: string;
  description: string;
  score: number;
}

export interface Highlighting{
  [key: string]: any;
  description: [string];
}

export interface UploadResult{
  responseHeader: {status: number, QTime: number};
  contents: any;
  metadata: any;
}

export interface SpellCheckResponse{
  suggestions?: [string, SuggestionsFound];
  correctlySpelled?: boolean;
  word?: string;
  message?: string;
}

export interface SuggestionsFound{
  numFound: number;
  startOffset: number;
  endOffset: number;
  origFreq: number;
  suggestion: SpellSuggestion[];
}

export interface SpellSuggestion{
  word: string;
  freq: number;
}
