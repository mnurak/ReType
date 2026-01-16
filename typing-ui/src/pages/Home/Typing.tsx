import { useContext, useEffect, useRef } from "react";
import TypingBox from "../../components/layout/Typing/TypingBox";
import TypingFeatures from "../../components/layout/Typing/TypingFeatures";
import PdfContext from "../../context/Pdf/PdfContext";

const Typing = () => {
  // for typing box
  const stopButtonRef = useRef<HTMLButtonElement>(
    null
  ) as React.RefObject<HTMLButtonElement>;

  const { init } = useContext(PdfContext);
  useEffect(() => {
    init();
  },[]);
  return (
    <div className="p-3 h-full flex flex-col  border-2">
      {/* TypingBox */}

      <TypingBox stopButtonRef={stopButtonRef} />

      {/* TypingFeatures */}
      <div className="flex-1 m-2 p-0.5">
        <TypingFeatures stopButtonRef={stopButtonRef} />
      </div>
    </div>
  );
};

export default Typing;
