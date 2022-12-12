export interface SuggestionsResponse{
  keywords: Array<[string, number]>;
}

export interface DocumentResult{
  id: string;
  title: string;
  description: string;
  score: number;
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
