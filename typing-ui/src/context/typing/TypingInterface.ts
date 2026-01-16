export interface TypingContextValues {
  isRunning: boolean;
  elapsedTime: number;
  startTime: Date | null;

  totalChars: number;
  incorrectChars: number;
  extraChars: number;
  incorrectWords: number;

  currentPage:number;
  updatePageNumber: (num:number) => void;
  updateElapsedTime: () => void;

  start: () => void;
  stop: () => void;
  reset: () => void;

  updateMetric: (current: {
    totalChars: number;
    totalWords: number;
    incorrectChars: number;
    extraChars: number;
    incorrectWords: number;
  }) => void;

  markPageStart: (page: number, line: number) => void;
  markPageEnd: (page: number, line: number) => void;

  getPayload: () => any;
  getMetric: () => {
    accuracy: number;
    actualWpm: number;
    wpm: number;
    adjustedWpm: number;
    consistency: number;
  };
}