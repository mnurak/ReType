// @ts-ignore
import backupData from "/src/assets/data/data.json";
import { type TypingState, type Cursor, getPage } from "../../utils/textParser";

import TypingRenderer from "./display/TypingRenderer";
import { useContext, useEffect, useRef, useState } from "react";
import TypingContext from "../../context/typing/TypingContext";
import { getPDFJson, type singlePdfRecord } from "../../utils/idb";
import type { UpdateMetricSignal } from "../../context/typing/TypingInterface";
import updateContent from "./engine/updateContent";

const TypingBox = ({
  pauseButtonRef,
}: {
  pauseButtonRef: React.RefObject<HTMLButtonElement>;
}) => {
  const { currentPage, runningState, updatePage, updateMetric, start } =
    useContext(TypingContext);

  const getPageByIndex = async (pgNumber: number): Promise<TypingState> => {
    const record: singlePdfRecord | null = await getPDFJson();
    if (record == null) {
      // need to return a default typingState or null should be handled
      return getPage(backupData, pgNumber);
    } else {
      return record.data[pgNumber];
    }
  };

  const [data, setData] = useState<TypingState>(
    (): TypingState => getPage(backupData, 0),
  );
  const [cursorPoint, setCursorPoint] = useState<Cursor>({
    line: 0,
    word: 0,
    char: 0,
  });

  // handling the keydown by using the updateContext.
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (runningState !== "running") start();
    e.preventDefault();

    const key: string = e.key;
    // we can make this into a pause button later
    if (key == "Tab") pauseButtonRef.current.focus();

    const updates: {
      data: TypingState;
      cursor: Cursor;
      pageUpdate: 1 | 0 | -1;
      metricSignal: UpdateMetricSignal;
    } = updateContent(data, cursorPoint, key);

    setData(updates.data);
    setCursorPoint(updates.cursor);
    updateMetric(updates.metricSignal);

    if (updates.pageUpdate != 0) {
      updatePage(currentPage + updates.pageUpdate, true);
    }
  };

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    const lineEl = container.querySelector(
      `[data-line="${cursorPoint.line}"]`,
    ) as HTMLElement | null;

    if (!lineEl) return;

    const containerRect = container.getBoundingClientRect();
    const lineRect = lineEl.getBoundingClientRect();

    const containerCenter = containerRect.top + containerRect.height / 2;

    const lineCenter = lineRect.top + lineRect.height / 2;

    const delta = lineCenter - containerCenter;
    if (lineRect.bottom > containerRect.bottom * 0.6) {
      container.scrollBy({ top: delta, behavior: "smooth" });
    }
  }, [cursorPoint.line]);

  useEffect(() => {
    async function loadPage() {
      setData(await getPageByIndex(currentPage - 1));
      const container = containerRef.current;
      if (container) container.scrollTo({ top: 0, behavior: "auto" });
    }
    loadPage();
    // would need to add a function that will set the cursor at the last typed
    // that would be future implementation.
  }, [currentPage]);

  return (
    <div
      tabIndex={0}
      onKeyDown={handleKeyDown}
      ref={containerRef}
      className="group overflow-hidden h-full relative text-2xl "
    >
      <div className="m-2 p-0.5 flex flex-col font-mono" id="typingBox">
        <TypingRenderer content={data} cursorPoint={cursorPoint} />
      </div>

      <div
        className="absolute inset-0 flex items-center justify-center
                      bg-white/80 pointer-events-none
                      group-focus-within:opacity-0 transition-opacity 
                      font-semibold text-4xl text-gray-900"
      >
        Please click here to start
      </div>
    </div>
  );
};

export default TypingBox;