export interface AnalysisResult {
  classification: 'Safe' | 'Suspicious' | 'Phishing';
  riskLevel: 'Low' | 'Medium' | 'High';
  score: number; // 0-100, where 100 is definitely phishing
  suspiciousPhrases: string[];
  explanation: string;
  tips: string[];
}

export interface EmailData {
  subject: string;
  body: string;
}

export enum AppState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  RESULT = 'RESULT',
  ERROR = 'ERROR',
}