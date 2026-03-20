import React, { useContext, useEffect } from "react";
import TypingContext from "../../context/typing/TypingContext";

const TypingFeatures = ({
  pauseButtonRef,
}: {
  pauseButtonRef: React.RefObject<HTMLButtonElement>;
}) => {
  const {
    currentPage,
    metric,
    progress,
    updatePage,
    pause,
    stop,
    reset,
    timePassed,
    runningState,
  } = useContext(TypingContext);
  const handlePageNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val)) updatePage(val, false);
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
          min={1}
          onChange={handlePageNumberChange}
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

        {/* must use a cunstom function to call teh reset, as to change the curror back to start.
        also must take care of the cursor change when the page is changed. */}
        
        {/* resume button  */}
        <button
          onClick={reset}
          ref={pauseButtonRef}
          className="
        px-4 py-2
        text-lg font-semibold
        rounded-md
        bg-green-300 text-white
        disabled:opacity-50 disabled:cursor-not-allowed
        hover:bg-green-600
        transition
      "
        >
          reset
        </button>

        {/* pause Button */}
        <button
          onClick={pause}
          ref={pauseButtonRef}
          disabled={runningState !== "running"}
          className="
        px-4 py-2
        text-lg font-semibold
        rounded-md
        bg-yellow-500 text-white
        disabled:opacity-50 disabled:cursor-not-allowed
        hover:bg-orange-600
        transition
      "
        >
          pause
        </button>

        {/* Stop Button */}
        <button
          onClick={stop}
          disabled={runningState !== "running"}
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
          { label: "Time", value: timePassed.toFixed(0) },
          { label: "WPM", value: progress.at(-1)?.wpm.toFixed(1) },
          { label: "Actual WPM", value: progress.at(-1)?.actualWpm.toFixed(1) },
          { label: "Accuracy", value: progress.at(-1)?.accuracy.toFixed(1) },
          {
            label: "Adjusted WPM",
            value: progress.at(-1)?.adjustedWpm.toFixed(1),
          },
          { label: "Incorrect Chars", value: metric.wrongChar },
          { label: "Extra Chars", value: metric.extraChar },
          { label: "skipped Chars", value: metric.skippedChar },
          { label: "Total Chars", value: metric.totalChar },
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
