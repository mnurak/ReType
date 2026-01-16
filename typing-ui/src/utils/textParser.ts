// textParser.ts

export interface Line {
  type: "line" | "blank";
  indent?: number;
  text?: string;
}

export interface Page {
  page: number;
  content: Line[];
}

export interface TypingChar {
  char: string;
  extraChar: string;
  status: "pending" | "correct" | "incorrect";
}

export interface TypingLine {
  words: TypingChar[][];
}

export interface Cursor {
  line: number;
  word: number;
  char: number;
}

export type TypingState = TypingLine[];

// get lines from page
export function getLinesInPage(data: Page): string[] {
  return data.content
    .map((line) => {
      if (line.type === "line") {
        return `${line.indent === 4 ? "  " : ""}${line.text}`;
      }
      return null; // mark blank lines as null
    })
    .filter((line): line is string => line !== null); // remove nulls
}

// split line into words
export function splitLine(line: string): string[] {
  return line.split(" ");
}

// split word into characters
export function splitWord(word: string): TypingChar[] {
  return word
    .split("")
    .map((char) => ({ char, extraChar: "", status: "pending" }));
}

// need to update such that it can send all the pages with out index
export function getPage(data: Page[], pageNumber: number): TypingState {
  const lines = getLinesInPage(data[pageNumber]);

  const typingState: TypingState = lines.map((line) => {
    const words = splitLine(line).map((word) => splitWord(word));
    return {
      words,
      extraWords: [],
    };
  });

  return typingState;
}
