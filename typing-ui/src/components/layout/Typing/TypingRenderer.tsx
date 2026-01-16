// TypingRenderer.tsx
// import { useEffect, useRef } from "react";
import Token from "./Token";

import type { TypingState, Cursor } from "../../../utils/textParser";

const TypingRenderer = (props: {
  content: TypingState;
  cursorPoint: Cursor;
}) => {


  return (
    <>
      {props.content?.map((line, i) => (
        <div className="flex flex-wrap " key={i} data-line={i}>
          {line.words.map((word, j) => (
            <div className="m-0.5 p-0.5" key={j} >
              <Token
                token={word}
                cursorPoint={props.cursorPoint}
                line={i}
                word={j}
              ></Token>
            </div>
          ))}
          <div className="m-0.5 p-0.5" key={"enter"}>
            <span className="relative top-1.5">&#8629;</span>
          </div>
        </div>
      ))}
    </>
  );
};

export default TypingRenderer;
