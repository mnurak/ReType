import { useState, type ReactNode } from "react";
import TypingContext from "./TypingContext";
import type { TypingContextValues } from "./TypingInterface";

interface Props {
  children: ReactNode;
}

const TypingState = ({ children }: Props) => {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  // time spent is taken in milliseconds for more accuracy
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [startTime, setStartTime] = useState<Date>(new Date());

  const [totalChars, setTotalChars] = useState<number>(0);
  const [totalWords, setTotalWords] = useState<number>(0);
  const [incorrectChars, setIncorrectChars] = useState<number>(0);
  const [extraChars, setExtraChars] = useState<number>(0);
  const [incorrectWords, setIncorrectWords] = useState<number>(0);

  const [currentPage, setCurrentPage] = useState<number>(0);

  const start = (): void => {
    setElapsedTime(0);
    setStartTime(new Date());
    setIsRunning(true);
  };
  const stop = (): void => {
    if (isRunning === false) return;

    setIsRunning(false);
    updateElapsedTime();

    // the part of calculating wpm, accuracy will be done later
    // the part where is the user is logined the payload is sent will be taken care later
  };

  const reset = (): void => {
    setElapsedTime(0);
    setIsRunning(false);
  };

  const updateElapsedTime = (): void => {
    const currentTime: Date = new Date();

    const diff = currentTime.getTime() - startTime.getTime();
    setElapsedTime(diff);
  };
  const updatePageNumber = (num: number): void => {
    setCurrentPage(num);
  };

  // making shure all the updates are after the line
  // need to update this such that it  works after the user comes back to the line {important bug}
  const updateMetric = (current: {
    totalChars: number;
    totalWords: number;
    incorrectChars: number;
    extraChars: number;
    incorrectWords: number;
  }) => {
    setTotalChars((prev) => prev + current.totalChars);
    setTotalWords((prev) => prev + current.totalWords);
    setIncorrectChars((prev) => prev + current.incorrectChars);
    setExtraChars((prev) => prev + current.extraChars);
    setIncorrectWords((prev) => prev + current.incorrectWords);
  };

  const getMetric = (): {
    accuracy: number;
    wpm: number;
    actualWpm:number;
    adjustedWpm: number;
    consistency: number;
  } => {
    const accuracy =
      totalChars === 0
        ? 100
        : ((totalChars - incorrectChars - extraChars) / totalChars) * 100;
    const timeMinutes = elapsedTime / 60000;


    const wpm = (totalChars+extraChars-incorrectChars) / 5 / timeMinutes;
    const actualWpm = (totalWords - incorrectWords) / timeMinutes;
    const adjustedWpm =
      (totalChars - incorrectChars - extraChars) / 5 / timeMinutes;
    const consistency = 90;

    return {
      accuracy,
      wpm,
      actualWpm,
      adjustedWpm,
      consistency,
    };
  };

  const value: TypingContextValues = {
    isRunning,
    elapsedTime,
    startTime,

    totalChars,
    incorrectChars,
    extraChars,
    incorrectWords,

    currentPage,
    updatePageNumber,
    updateElapsedTime,

    start,
    stop,
    reset,

    updateMetric,

    markPageStart: () => {},
    markPageEnd: () => {},

    getMetric,
    getPayload: () => ({}),
  };

  return (
    <TypingContext.Provider value={value}>{children}</TypingContext.Provider>
  );
};

export default TypingState;

// should restructure this in this was later
/*
session: {
  isRunning,
  startTime,
  elapsedTime,
}

stats: {
  totalChars,
  incorrectChars,
  extraChars,
  incorrectWords,
}

navigation: {
  currentPage,
}
 */
