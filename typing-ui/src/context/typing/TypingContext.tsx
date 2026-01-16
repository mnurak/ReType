import { createContext } from "react";
import type { TypingContextValues } from "./TypingInterface";

const defaultTypingContext: TypingContextValues = {
  isRunning: false,
  elapsedTime: 0,
  totalChars: 0,
  incorrectChars: 0,
  extraChars: 0,
  incorrectWords: 0,

  startTime: new Date(),

  currentPage: 1,
  updatePageNumber: () => {},
  updateElapsedTime: () => {},

  start: () => {},
  stop: () => {},
  reset: () => {},

  updateMetric: () => {},

  markPageStart: () => {},
  markPageEnd: () => {},

  getMetric: () => ({
    accuracy: 100,
    actualWpm: 0,
    wpm: 0,
    adjustedWpm: 0,
    consistency: 100,
  }),

  getPayload: () => ({}),
};

const TypingContext = createContext<TypingContextValues>(defaultTypingContext);

export default TypingContext;
