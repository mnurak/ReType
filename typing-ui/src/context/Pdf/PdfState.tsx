import {
  savePDFJson,
  getPDFJson,
  deletePDFJson,
  type singlePdfRecord,
} from "../../utils/idb";
import PdfContext from "./PdfContext";
import { useState, type ReactNode } from "react";
import type { PdfContextValues } from "./PdfInterface";
import { getPage, type Page, type TypingState } from "../../utils/textParser";

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
    if (pdfUrl) URL.revokeObjectURL(pdfUrl);
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

  const uploadAndGetPdfData = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/pdf/extract", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const json: Page[] = await res.json();

      const data: TypingState[] = [];
      // need to update the getpage such that it can take the entire json
      for (let i = 0; i < json.length; i++) data.push(getPage(json, i));

      const record: singlePdfRecord = {
        id: 1,
        file,
        data,
        name: file.name,
      };
      savePdfData(record);
    } catch (err) {
      console.error(err);
      alert("Upload failed. Try again!");
    }
  };

  const value: PdfContextValues = {
    pdf,
    pdfUrl,
    init,

    savePdfData,
    deletePdfData,

    uploadAndGetPdfData,
  };
  return <PdfContext.Provider value={value}>{children}</PdfContext.Provider>;
};

export default PdfState;
