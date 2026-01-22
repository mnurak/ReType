import { pdfjs } from "react-pdf";
// import workerSrc from "pdfjs-dist/build/pdf.worker.mjs?url";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.js";

import { useContext, useRef, useState, useEffect } from "react";
import { Document, Page } from "react-pdf";
import PdfContext from "../../../context/Pdf/PdfContext";
import TypingContext from "../../../context/typing/TypingContext";

const PdfBody = () => {
  const { pdfUrl } = useContext(PdfContext);
  const { currentPage, updatePageNumber } = useContext(TypingContext);

  const [numPages, setNumPages] = useState(0);
  const pageRefs = useRef<HTMLDivElement[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const onLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const isProgrammaticScroll = useRef(false);

  const isPageVisible = (page: HTMLDivElement, container: HTMLDivElement) => {
    const pageRect = page.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    const pageTopRelative = pageRect.top - containerRect.top;
    const pageBottomRelative = pageRect.bottom - containerRect.top;

    // Check if at least 50% of the page is visible
    const visibleHeight =
      Math.min(pageBottomRelative, container.clientHeight) -
      Math.max(pageTopRelative, 0);
    const visibilityRatio = visibleHeight / pageRect.height;

    return visibilityRatio > 0.35;
  };

  useEffect(() => {
    const el = pageRefs.current[currentPage - 1];
    const container = containerRef.current;
    if (!el || !container) return;

    if (isPageVisible(el, container)) return;

    const top =
      el.getBoundingClientRect().top -
      container.getBoundingClientRect().top +
      container.scrollTop;

    // Turn on programmatic scroll
    isProgrammaticScroll.current = true;

    container.scrollTo({ top, behavior: "smooth" });

    // After a short delay, allow normal scroll events again
    const timer = setTimeout(() => {
      isProgrammaticScroll.current = false;
    }, 4000); // adjust delay to match smooth scroll timing

    return () => clearTimeout(timer);
  }, [currentPage]);

  const handleScroll = () => {
    if (!containerRef.current || isProgrammaticScroll.current) return;

    const container = containerRef.current;
    const containerTop = container.getBoundingClientRect().top;

    let visiblePage = currentPage;

    for (let i = 0; i < pageRefs.current.length; i++) {
      const page = pageRefs.current[i];
      if (!page) continue;

      const pageTop = page.getBoundingClientRect().top;
      if (pageTop - containerTop < container.clientHeight * 0.4) {
        visiblePage = i + 1;
      }
    }

    if (visiblePage !== currentPage) {
      updatePageNumber(visiblePage);
    }
  };

  // need to fix the double rendering of the pdf pages as 1 page
  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="flex-1 h-full overflow-auto bg-gray-100 p-2"
    >
      {pdfUrl && (
        <Document file={pdfUrl} onLoadSuccess={onLoadSuccess}>
          {Array.from({ length: numPages }, (_, i) => (
            <div
              key={i}
              ref={(el) => {
                if (el) pageRefs.current[i] = el;
              }}
              className="w-150 border-2"
            >
              <Page
                pageNumber={i + 1}
                renderMode="canvas"
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            </div>
          ))}
        </Document>
      )}
    </div>
  );
};

export default PdfBody;
