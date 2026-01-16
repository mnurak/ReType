// @ts-ignore
import data from "/src/assets/data/data.json";
import {
  type TypingState,
  type Cursor,
  getPage,
} from "../../../utils/textParser";
import TypingRenderer from "./TypingRenderer";
import { useTypingInput } from "./useTypingInput";

import { useContext, useEffect, useRef, useState } from "react";
import TypingContext from "../../../context/typing/TypingContext";
import { getPDFJson, type singlePdfRecord } from "../../../utils/idb";
import PdfContext from "../../../context/Pdf/PdfContext";

const TypingBox = ({
  stopButtonRef,
}: {
  stopButtonRef: React.RefObject<HTMLButtonElement>;
}) => {
  const { currentPage, updatePageNumber, updateMetric } =
    useContext(TypingContext);
  const { pdf } = useContext(PdfContext);

  const getPageByIndex = async (pgNumber: number): Promise<TypingState> => {
    const record: singlePdfRecord | null = await getPDFJson();
    if (record == null) {
      // need to return a default typingState or null should be handeled
      return getPage(data, currentPage);
    } else {
      return record.data[pgNumber];
    }
  };

  const [content, setContent] = useState<TypingState>(() => getPage(data, 0));
  const [cursorPoint, setCursorPoint] = useState<Cursor>({
    line: 0,
    word: 0,
    char: 0,
  });

  const { handleKeyDown } = useTypingInput(
    content,
    cursorPoint,
    setContent,
    setCursorPoint,
    stopButtonRef,
    currentPage,
    updatePageNumber
  );

  const containerRef = useRef<HTMLDivElement>(null);

  const updateFeatures = () => {
    // need to use the updateMatric, and also update all teh char, word of the perticular line
    // here only the word will taken account all the total char typed and error char will be calculated in the handle keydown
    const line = content[cursorPoint.line - 1];
    const totalWords = line.words.length;
    let totalChars: number = 0;
    let extraChars: number = 0;
    let incorrectWords: number = 0;
    let incorrectChars: number = 0;

    line.words.forEach((word) => {
      if (word.length !== 0) {
        let correct: boolean = true;
        word.forEach((char) => {
          if (char.status !== "correct") {
            correct = false;
            incorrectChars += 1;
          }
          if (char.char !== "") totalChars += 1;
          else {
            extraChars += 1;
            correct = false;
          }
        });
        if (!correct) incorrectWords += 1;
      }
    });

    const current = {
      totalChars,
      totalWords,
      incorrectChars,
      extraChars,
      incorrectWords,
    };

    updateMetric(current);
  };

  useEffect(() => {
    if (cursorPoint.line > 0) updateFeatures();
    const container = containerRef.current;

    if (!container) return;

    const lineEl = container.querySelector(
      `[data-line="${cursorPoint.line}"]`
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
      setContent(await getPageByIndex(currentPage - 1));
      const container = containerRef.current;
      if (container) container.scrollTo({ top: 0, behavior: "auto" });
    }
    loadPage();
  }, [currentPage]);

  useEffect(() => {
    updatePageNumber(1);
    getPageByIndex(0);
  }, [pdf]);

  return (
    <div
      tabIndex={0}
      onKeyDown={handleKeyDown}
      ref={containerRef}
      className="group overflow-hidden h-full relative text-2xl "
    >
      <div className="m-2 p-0.5 flex flex-col font-mono" id="typingBox">
        <TypingRenderer content={content} cursorPoint={cursorPoint} />
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
