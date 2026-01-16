import { useCallback, useContext } from "react";
import type { TypingState } from "../../../utils/textParser";
import updateContent from "./updateContent";
import TypingContext from "../../../context/typing/TypingContext";

interface Cursor {
  line: number;
  word: number;
  char: number;
}

export function useTypingInput(
  content: TypingState,
  cursor: Cursor,
  setContent: React.Dispatch<React.SetStateAction<TypingState>>,
  setCursor: React.Dispatch<React.SetStateAction<Cursor>>,
  stopButtonRef: React.RefObject<HTMLButtonElement>,
  currentPage:number,
  updatePageNumber: (num:number) => void
) {
  const { isRunning, start } = useContext(TypingContext)!;
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      e.preventDefault();
      !isRunning && start();

      const key: string = e.key;
      if(key == "Tab")
        stopButtonRef.current.focus()

      const update = updateContent(content, cursor, key, currentPage, updatePageNumber);

      setContent(update.content);
      setCursor(update.cursor);
    },
    [content, cursor, setContent, setCursor]
  );

  return { handleKeyDown };
}
