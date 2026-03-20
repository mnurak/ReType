import type {
  TypingState,
  Cursor,
  TypingChar,
  TypingLine,
} from "../../../utils/textParser";
import type { UpdateMetricSignal } from "../../../context/typing/TypingInterface";

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

/*there are still bugs that need to be recognized
    1. added skipped data to char and need to address the bugs for the space, and other which do not use this one.
    2. need to update all the key cases into functions, fro better debugging.
    3. need to clean most of this code.
    4. must use map/other methods where only the word ref changes, instead of the entire line, that way we can reduce teh render time of Token.
*/

const updateContent = (
  data: TypingState,
  cursor: Cursor,
  key: string,
): {
  data: TypingState;
  cursor: Cursor;
  pageUpdate: 1 | 0 | -1;
  metricSignal: UpdateMetricSignal;
} => {
  let pageUpdate: 1 | 0 | -1 = 0;
  const metricSignal: UpdateMetricSignal = {
    totalChar: 0,
    wrongChar: 0,
    extraChar: 0,
    skippedChar: 0,
  };

  const newData = [...data];
  const newCursor = { ...cursor };
  var curLine: TypingLine;
  if (data.length > cursor.line) curLine = newData[cursor.line];
  // this is not possible but for the safety mechanism.
  else {
    newCursor.line = newCursor.word = newCursor.char = 0;
    return {
      data,
      cursor: newCursor,
      pageUpdate,
      metricSignal,
    };
  }

  const curWord: TypingChar[] = curLine.words[cursor.word];

  switch (key) {
    case " ":
      {
        // move to next word
        for (let i = cursor.char; i < curWord.length; i++) {
          curWord[i].status = "skipped";
          metricSignal.skippedChar += 1;
        }
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
        const prevLine: TypingLine = newData[Math.max(newCursor.line - 1, 0)];
        const prevWord: TypingChar[] =
          curLine.words[Math.max(cursor.word - 1, 0)];

        if (cursor.line === 0 && cursor.word === 0 && cursor.char === 0) {
          pageUpdate = -1;
          break;
        }
        // user is in middle of the word
        if (cursor.char > 0) {
          const index = newCursor.char - 1;
          const charObj = curWord[index];

          if (charObj.char === "") {
            metricSignal.totalChar = -1;
            metricSignal.extraChar = -1;
            curWord.pop();
          } else if (charObj.status == "skipped") {
            metricSignal.skippedChar = -1;
            charObj.status = "pending";
          } else {
            metricSignal.totalChar = -1;
            if (charObj.status == "incorrect") metricSignal.wrongChar = -1;
            charObj.status = "pending";
          }

          newCursor.char -= 1;
        }
        // for rest of the cases there won't be any update for the metric as the space input is not considered as char.
        // in the future if the metric were to consist of word then these may be considered.
        // for at the start of the word at the start of the line
        else if (cursor.word == 0) {
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

    // not sure how to update the metric in this case as all are set to incorrect should it be taken as total word, and wrong word it will affect the wpm so this is a bug
    case "Enter":
      {
        // these to be taken care as skip tokens and must add an enum in typingChar
        // for (let w = newCursor.word + 1; w < curLine.words.length; w++) {
        //   const word = curLine.words[w];
        //   for (let c = 0; c < word.length; c++) {
        //     word[c].status = "incorrect";
        //   }
        // }

        // for (let ind = newCursor.char; ind < curWord.length; ind++){
        //   curWord[ind].status = "incorrect";
        // }
        if (
          newCursor.word + 1 == newData[newCursor.line].words.length &&
          newCursor.char == newData[newCursor.line].words[newCursor.word].length
        ) {
          newCursor.line += 1;
          newCursor.word = 0;
          newCursor.char = 0;
          if (newCursor.line == data.length) {
            newCursor.line = 0;
            pageUpdate = 1;
          }
        }
      }
      break;

    case "Tab": // this tab is to be taken care before the function call as it is suppose to navigate to a button to pause of stop.
    case "Alt":
    case "Shift":
      {
      }
      break;
    default: {
      // typeable character
      metricSignal.totalChar = 1;
      if (newCursor.char < curWord.length) {
        curWord[newCursor.char].status =
          normalizeChar(key) === normalizeChar(curWord[newCursor.char].char)
            ? "correct"
            : "incorrect";
        if (curWord[newCursor.char].status == "incorrect")
          metricSignal.wrongChar = 1;
        newCursor.char += 1;
      } else {
        // Extra char typed
        metricSignal.extraChar = 1;
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

  return { data: newData, cursor: newCursor, pageUpdate, metricSignal };
};

export default updateContent;
