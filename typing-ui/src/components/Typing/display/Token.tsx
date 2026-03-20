// Token.tsx

import { type TypingChar } from "../../../utils/textParser";
import React from "react";

interface Cursor {
  line: number;
  word: number;
  char: number;
}
const Token = React.memo(
  ({
    token,
    cursorPoint,
    line,
    word,
  }: {
    token: TypingChar[];
    cursorPoint: Cursor;
    line: number;
    word: number;
  }) => {
    const charStyle = (status: TypingChar["status"]): string => {
      switch (status) {
        case "pending":
          return "text-gray-600";
        case "correct":
          return "text-green-500";
        case "incorrect":
          return "text-red-500";
        default:
          return "text-orange-400";
      }
    };

    const isCursor = (
      cursorPoint: Cursor,
      line: number,
      word: number,
      i: number,
    ) => {
      return cursorPoint.line === line &&
        cursorPoint.word === word &&
        cursorPoint.char === i
        ? "underline" // cursor styling
        : "";
    };

    return (
      <>
        {token.length !== 0 ? (
          token.map(({ char, extraChar, status }, i) => {
            // Normal characters
            return (
              (extraChar === "" && (
                <span
                  key={i}
                  className={`${charStyle(status)} ${isCursor(
                    cursorPoint,
                    line,
                    word,
                    i,
                  )}`}
                >
                  {char}
                </span>
              )) || (
                <span
                  key={i}
                  className={`${charStyle("incorrect")} ${isCursor(
                    cursorPoint,
                    line,
                    word,
                    i + 1,
                  )}`}
                >
                  {extraChar}
                </span>
              )
            );
          })
        ) : (
          <span
            className={`${charStyle("correct")} ${isCursor(
              cursorPoint,
              line,
              word,
              0,
            )}`}
          >
            &nbsp;
          </span>
        )}
        {token.length == 0}
      </>
    );
  },
  (prev, next) => {
    // 1. Token reference check
    if (prev.token !== next.token) return false;

    const wasHere =
      prev.cursorPoint.line === prev.line &&
      prev.cursorPoint.word === prev.word;

    const isHere =
      next.cursorPoint.line === next.line &&
      next.cursorPoint.word === next.word;

    // 2. Cursor entered or left this token
    if (wasHere !== isHere) return false;

    // 3. Cursor moved INSIDE this token
    if (isHere && prev.cursorPoint.char !== next.cursorPoint.char) {
      return false;
    }

    return true; // skip re-render
  },
);

export default Token;
