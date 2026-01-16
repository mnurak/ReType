import { useState } from "react";
import Typing from "./Typing";
import Pdf from "./Pdf";
import PdfState from "../../context/Pdf/PdfState";
import TypingState from "../../context/typing/TypingState";

function Home() {
  const [leftWidth, setLeftWidth] = useState(50); // percentage

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    
    const startX = e.clientX;

    document.body.style.cursor = 'col-resize';

    const handleDrag = (de: MouseEvent) => {
      const parentWidth =
        document.getElementById("body")?.offsetWidth || window.innerWidth;

      const newWidth = leftWidth +( ((de.clientX - startX) / parentWidth) * 100);
      if (newWidth > 40 && newWidth < 75) setLeftWidth(newWidth);
    };

    document.addEventListener("mousemove", handleDrag);
    const handleMouseUp = () => {
      document.body.style.cursor = "";
      document.removeEventListener("mousemove", handleDrag);
      document.removeEventListener("mouseup", handleMouseUp);
    };
    document.addEventListener("mouseup", handleMouseUp);

  };


  return (
    <>
    <TypingState>
      <PdfState>

      <div className="flex w-full self-stretch max-h-200 p-2 border-4">
        <div style={{ width: `${leftWidth}%` }} className="m-0.5">
          <Typing />
        </div>

        <div className="p-0.5 w-1 bg-slate-600 hover:cursor-e-resize" onMouseDown={handleMouseDown} 
        />

        <div className="flex-1 m-0.5">
          <Pdf />
        </div>
      </div>
      </PdfState>
    </TypingState>
    </>
  );
}

export default Home;
