import { createContext } from "react";
import type {
  TypingContextValues,
  UpdateMetricSignal,
} from "./TypingInterface";

const defaultTypingContext: TypingContextValues = {
  startTime: null,
  endTime: null,
  timePassed: 0,

  runningState: "idle",

  start: () => {
    return;
  },
  pause: () => {
    return;
  },
  stop: () => {
    return;
  },
  reset: () => {
    return;
  },

  currentPage: 1,
  updatePage: (num: number, fromTypingBox: boolean) => {
    return;
  },

  metric: {
    totalChar: 0,
    wrongChar: 0,
    extraChar: 0,
    skippedChar: 0,
  },
  updateMetric: (updates: UpdateMetricSignal) => {
    return;
  },

  progress: [],
};

const TypingContext = createContext<TypingContextValues>(defaultTypingContext);

export default TypingContext;
