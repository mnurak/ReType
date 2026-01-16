import {
  savePDFJson,
  getPDFJson,
  deletePDFJson,
  type singlePdfRecord,
} from "../../utils/idb";
import PdfContext from "./PdfContext";
import { useState, type ReactNode } from "react";
import type { PdfContextValues } from "./PdfInterface";

const PdfState = ({ children }: { children: ReactNode }) => {
  const [pdf, setPdf] = useState<string>("");
  const [pdfUrl, setPdfUrl] = useState("");

  const savePdfData = async (record: singlePdfRecord) => {
    const url = URL.createObjectURL(record.file);

    setPdf(record.file.name);
    setPdfUrl(url);
    savePDFJson(record);
  };

  const deletePdfData = async () => {
    if(pdfUrl)
        URL.revokeObjectURL(pdfUrl)
    setPdf("");
    setPdfUrl("");
    deletePDFJson();
  };
  const init = async () => {
    const result: singlePdfRecord | null = await getPDFJson();
    if (result) {
      const url = URL.createObjectURL(result.file);
      setPdf(result.file.name);
      setPdfUrl(url);
    }
  };
  const value: PdfContextValues = {
    pdf,
    pdfUrl,
    init,
    savePdfData,

    deletePdfData,
  };
  return <PdfContext.Provider value={value}>{children}</PdfContext.Provider>;
};

export default PdfState;
