import React, { useContext, useEffect } from "react";
import TypingContext from "../../../context/typing/TypingContext";

const TypingFeatures = ({
  stopButtonRef,
}: {
  stopButtonRef: React.RefObject<HTMLButtonElement>;
}) => {
  const {
    elapsedTime,
    updateElapsedTime,
    totalChars,
    incorrectChars,
    extraChars,
    incorrectWords,
    isRunning,
    currentPage,
    updatePageNumber,
    stop,
    getMetric,
  } = useContext(TypingContext)!;

  const { wpm, actualWpm, accuracy, adjustedWpm } = getMetric();

  const timeInSeconds = (elapsedTime / 1000).toFixed(1);

  useEffect(() => {
    if (!isRunning) return; // only start interval if running

    const interval = setInterval(() => {
      updateElapsedTime();
    }, 5000);

    // cleanup on unmount or when isRunning changes
    return () => clearInterval(interval);
  }, [isRunning, updateElapsedTime]);

  const updateNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val)) updatePageNumber(val);
  };

  return (
    <div className="relative w-full border rounded-lg p-4 flex flex-col">
      {/* Top controls */}
      <div className="flex items-center justify-between mb-4">
        {/* Page Number Input */}
        <label htmlFor="currentPage">Page Number</label>
        <input
          type="number"
          name="pageNumber"
          id="currentPage"
          value={currentPage}
          min={0}
          onChange={updateNumber}
          className="
        w-24
        px-3 py-2
        border border-gray-300
        rounded-md
        text-center text-lg
        focus:outline-none
        focus:ring-2 focus:ring-blue-500
        focus:border-blue-500
        shadow-sm
        transition duration-150 ease-in-out
      "
        />

        {/* Stop Button */}
        <button
          onClick={stop}
          ref={stopButtonRef}
          disabled={!isRunning}
          className="
        px-4 py-2
        text-lg font-semibold
        rounded-md
        bg-red-500 text-white
        disabled:opacity-50 disabled:cursor-not-allowed
        hover:bg-red-600
        transition
      "
        >
          Stop
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-2 flex-1 overflow-auto">
        {[
          { label: "Time", value: `${timeInSeconds}s` },
          { label: "WPM", value: wpm.toFixed(1) },
          { label: "Actual WPM", value: actualWpm.toFixed(1) },
          { label: "Accuracy", value: `${accuracy.toFixed(1)}%` },
          { label: "Adjusted WPM", value: adjustedWpm.toFixed(1) },
          { label: "Incorrect Chars", value: incorrectChars },
          { label: "Extra Chars", value: extraChars },
          { label: "Incorrect Words", value: incorrectWords },
          { label: "Total Chars", value: totalChars },
        ].map((metric) => (
          <div
            key={metric.label}
            className="flex flex-col p-1 bg-gray-50 rounded shadow-sm"
          >
            <p className="text-gray-500 text-sm">{metric.label}</p>
            <p className="font-semibold text-lg">{metric.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TypingFeatures;
