export interface Metric {
  totalChar: number;
  wrongChar: number;
  extraChar: number;
  skippedChar: number;
  // will decide to add extra, wrong words later if needed. and must make the implementation so that there is room for these kind of enhancement.
}

export interface Progress {
  wpm: number;
  actualWpm: number;
  adjustedWpm: number;
  accuracy: number;
  // can add the timestamp/time elapsed as we can use it in the display of the progress.
}

export type DeltaSignal = -1 | 0 | 1;
export type AbsoluteSignal = number;

export type UpdateMetricSignal = {
  wrongChar: DeltaSignal;
  extraChar: DeltaSignal;
  totalChar: DeltaSignal;
  skippedChar: AbsoluteSignal;
};

export interface TypingContextValues {
  startTime: Date | null;
  endTime: Date | null;
  timePassed: number; // will store the time passed in seconds.
  // later we can add an array where all the pause and resume are been done.
  // for now these three will be sufficient as they will also help in the start, stop, and pause, and also the calculation of the wpm, and other progress.

  runningState: "idle" | "running" | "paused"; // a lock preservative for the source of truth, and having proper state machine.

  start: () => void; // will start/resume the timer accordingly if timer is null, will call reset and then start eh timer, else resume the timer
  pause: () => void; // will pause the timer, and the metric value are preserved.
  stop: () => void; // stop the counter and the final matrix is stored
  reset: () => void; // will reset all the session stored states, resetting the metric

  currentPage: number;
  updatePage: (num: number, fromTypingBox: boolean) => void; // will  update the page accordingly with runningState; acting as a lock, and a proper validation based on wether the update is from the typing box .

  metric: Metric;
  updateMetric: (updates: UpdateMetricSignal) => void; // this here will take input of 0,1,-1 only and then update and not the actual metric. cause we can use it as a signal form the updateContent/onkeydown.

  progress: Progress[]; // stores the progress of the typing as the specific intervals.
}
