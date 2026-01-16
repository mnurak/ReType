import type {
  TypingState,
  Cursor,
  TypingChar,
  TypingLine,
} from "../../../utils/textParser";

const normalizeChar = (char: string) => {
  const map: Record<string, string> = {
    "“": '"',
    "”": '"',
    "‘": "'",
    "’": "'",
    "`": "'",
    // dashes
    "—": "-",
    "–": "-",
  };
  return map[char] || char;
};

const updateContent = (
  content: TypingState,
  cursor: Cursor,
  key: string,
  currentPage: number,
  updatePageNumber: (num: number) => void
): { content: TypingState; cursor: Cursor } => {
  const newContent = [...content];
  const newCursor = { ...cursor };
  var curLine: TypingLine;
  if (content.length > cursor.line) curLine = newContent[cursor.line];
  else {
    // need to update the content and set the line, word, char to 0

    newCursor.line = newCursor.word = newCursor.char = 0;
    return { content, cursor: newCursor };
  }

  const curWord: TypingChar[] = curLine.words[cursor.word];

  switch (key) {
    case " ":
      {
        // move to next word
        for (let i = cursor.char; i < curWord.length; i++)
          curWord[i].status = "incorrect";
        if (newCursor.word + 1 == curLine.words.length) {
          newCursor.char = curWord.length;
          break;
        }
        newCursor.word += 1;
        newCursor.char = 0;
      }
      break;
    case "Backspace":
      {
        //normal back space
        const prevLine: TypingLine =
          newContent[Math.max(newCursor.line - 1, 0)];
        const prevWord: TypingChar[] =
          curLine.words[Math.max(cursor.word - 1, 0)];

        // user is in middle of the word
        if (cursor.char > 0) {
          const index = newCursor.char - 1;
          const charObj = curWord[index];

          if (charObj.char === "") curWord.pop();
          else charObj.status = "pending";

          newCursor.char -= 1;
        } // for at the start of the word at the start of the line
        else if (cursor.word == 0 && cursor.line > 0) {
          newCursor.line -= 1;
          newCursor.word = prevLine.words.length - 1;
          newCursor.char = prevLine.words[newCursor.word].length - 1;
          const endChar = prevLine.words[newCursor.word][newCursor.char];
          if (endChar.char !== "") endChar.status = "pending";
          else newCursor.char += 1;
        } // for the words in middle
        else {
          newCursor.word -= 1;
          if (prevWord.length != 0) {
            newCursor.char = prevWord.length - 1;
            const char = prevWord[newCursor.char];
            if (char.extraChar === "") char.status = "pending";
            else newCursor.char += 1;
          } else newCursor.char = 0;
        }
      }
      break;

    // need to add an edge case when the cursor is at the end of the line.
    case "Enter":
      {
        // move to next line
        for (let w = newCursor.word + 1; w < curLine.words.length; w++) {
          const word = curLine.words[w];
          for (let c = 0; c < word.length; c++) {
            word[c].status = "incorrect";
          }
        }

        for (let ind = newCursor.char; ind < curWord.length; ind++)
          curWord[ind].status = "incorrect";

        newCursor.line += 1;
        newCursor.word = 0;
        newCursor.char = 0;
        if (newCursor.line == content.length) {
          newCursor.line = 0;
          updatePageNumber(currentPage + 1);
        }
      }
      break;

    case "Tab":
    // need to make it such that it goes to the stop button
    case "Alt":
    // make it work normally as the close and others
    case "Shift":
      {
      }
      break;
    default: {
      // typeable character
      if (newCursor.char < curWord.length) {
        curWord[newCursor.char].status =
          normalizeChar(key) === normalizeChar(curWord[newCursor.char].char)
            ? "correct"
            : "incorrect";
        newCursor.char += 1;
      } else {
        // Extra char typed
        const newChar: TypingChar = {
          char: "",
          extraChar: key,
          status: "incorrect",
        };
        curWord.push(newChar);
        newCursor.char += 1;
      }
    }
  }

  return { content: newContent, cursor: newCursor };
};

export default updateContent;
