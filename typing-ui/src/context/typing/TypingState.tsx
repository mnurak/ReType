import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import TypingContext from "./TypingContext";
import type {
  Metric,
  Progress,
  UpdateMetricSignal,
  TypingContextValues,
} from "./TypingInterface";

interface Props {
  children: ReactNode;
}
/*
  1. need to add skipped char for the Matrix
  2. also update the progress calculations according to the metric.
  3. this way of adding the skipped char will enhance the way the wpm, is calculated.
*/
const TypingState = ({ children }: Props) => {
  // need to implement everything one by one.

  // things for time, and start, stop, and pause.
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [intermediateTime, setIntermediateTime] = useState<Date | null>(null);
  const [pausedTime, setPausedTime] = useState(0);
  const [timePassed, setTimePassed] = useState<number>(0);
  const [runningState, setRunningState] = useState<
    "idle" | "running" | "paused"
  >("idle");

  // things for the pageNumber, metric, and progress.
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [metric, setMetric] = useState<Metric>({
    totalChar: 0,
    wrongChar: 0,
    extraChar: 0,
    skippedChar: 0,
  });
  const [progress, setProgress] = useState<Progress[]>([]);

  //refs for the variables used in the hooks for proper updates.
  const metricRef = useRef(metric);
  const timeRef = useRef(timePassed);
  const pausedRef = useRef(pausedTime);

  // to keep the ref when they change
  useEffect(() => {
    metricRef.current = metric;
    timeRef.current = timePassed;
    pausedRef.current = pausedTime;
  }, [metric, timePassed, pausedTime]);

  // a continues loop where it updates the progress continuously.
  useEffect(() => {
    if (runningState !== "running") return;

    const interval = setInterval(() => {
      const newDate = new Date();
      let totalTime = 0;
      if (startTime) totalTime = newDate.getTime() - startTime?.getTime();
      if (totalTime == 0) return;
      const paused = pausedRef.current;
      setTimePassed((totalTime - paused) / 1000);
      addProgress();
    }, 2000);

    return () => clearInterval(interval); // cleanup
  }, [runningState]);

  const start = () => {
    if (runningState == "running") return;

    if (runningState == "paused") {
      const newTime = new Date().getTime();
      // this is sure to not have intermediateTime as null
      // if it is paused it is not suppose to add the skip time.
      const skipTime = newTime - (intermediateTime?.getTime() || 0);
      setPausedTime((prv) => prv + skipTime);
      setRunningState("running");
      setIntermediateTime(null);
    } else {
      reset();
      const newDate = new Date();
      setStartTime(newDate);
      setIntermediateTime(null);
      setRunningState("running");
    }
  };

  const pause = () => {
    if (runningState === "idle" || runningState == "paused") return;
    setIntermediateTime(new Date());
    setRunningState("paused");
  };

  const stop = () => {
    if (runningState == "idle") return;

    const curTime = new Date();
    setEndTime(curTime);
    setIntermediateTime(null);
    setRunningState("idle");
  };

  const reset = () => {
    // need to add a condition where if the runningState is running, then need to save the data and then reset.
    if (runningState == "running") stop();
    setStartTime(null);
    setEndTime(null);
    setIntermediateTime(null);
    setTimePassed(0);
    setPausedTime(0);
    setMetric({
      totalChar: 0,
      wrongChar: 0,
      extraChar: 0,
      skippedChar: 0,
    });
    setProgress([]);
  };

  // update page
  const updatePage = (num: number, fromTypingBox: boolean) => {
    if (runningState == "idle" || runningState == "paused") setCurrentPage(num);
    else if (fromTypingBox == true) setCurrentPage(num);
  };

  // update Metric
  const updateMetric = (updates: UpdateMetricSignal) => {
    setMetric((prv) => ({
      totalChar: prv.totalChar + updates.totalChar,
      wrongChar: prv.wrongChar + updates.wrongChar,
      extraChar: prv.extraChar + updates.extraChar,
      skippedChar: prv.skippedChar + updates.skippedChar,
    }));
  };

  const getProgress = (): Progress => {
    if (timeRef.current === 0) {
      return {
        wpm: 0,
        actualWpm: 0,
        adjustedWpm: 0,
        accuracy: 0,
      };
    }

    // all the calculation are currently testable, and will be updated later with proper math.
    // need to adjust the calculation based on the skipped char, as that is also taken into consideration in metric.
    const minutes = timeRef.current / 60;

    const currentMetric = metricRef.current;
    const wpm = currentMetric.totalChar / 5 / minutes;
    const actualWpm =
      (currentMetric.totalChar - currentMetric.wrongChar) / 5 / minutes;
    const adjustedWpm =
      (currentMetric.totalChar -
        currentMetric.wrongChar -
        currentMetric.extraChar) /
      5 /
      minutes;

    const validChars = currentMetric.totalChar - currentMetric.extraChar;

    // will think of better way of accuracy later.
    const accuracy =
      validChars === 0
        ? 0
        : (validChars - currentMetric.wrongChar) / validChars;

    return {
      wpm,
      actualWpm,
      adjustedWpm,
      accuracy,
    };
  };

  // addProgress
  const addProgress = () => {
    const newProgress = getProgress();
    setProgress((prv) => [...prv, newProgress]);
  };

  const value: TypingContextValues = useMemo(
    () => ({
      startTime,
      endTime,
      timePassed,
      runningState,
      start,
      stop,
      pause,
      reset,
      currentPage,
      updatePage,
      metric,
      updateMetric,
      progress,
    }),
    [
      startTime,
      endTime,
      timePassed,
      runningState,
      currentPage,
      metric,
      progress,
    ],
  );

  return (
    <TypingContext.Provider value={value}>{children}</TypingContext.Provider>
  );
};

export default TypingState;
