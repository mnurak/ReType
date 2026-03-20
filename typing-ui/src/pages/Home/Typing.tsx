import { useContext, useEffect, useRef } from "react";
// import TypingBox from "../../components/layout/Typing/TypingBox";
// import TypingFeatures from "../../components/layout/Typing/TypingFeatures";

import PdfContext from "../../context/Pdf/PdfContext";
import TypingBox from "../../components/Typing/TypingBox";
import TypingFeatures from "../../components/Typing/TypingFeatures";

const Typing = () => {
  // for typing box
  const pauseButtonRef = useRef<HTMLButtonElement>(
    null
  ) as React.RefObject<HTMLButtonElement>;

  const { init } = useContext(PdfContext);
  useEffect(() => {
    init();
  },[]);
  return (
    <div className="p-3 h-full flex flex-col  border-2">
      {/* TypingBox */}

      <TypingBox pauseButtonRef={pauseButtonRef} />

      {/* TypingFeatures */}
      <div className="flex-1 m-2 p-0.5">
        <TypingFeatures pauseButtonRef={pauseButtonRef} />
      </div>
    </div>
  );
};

export default Typing;
