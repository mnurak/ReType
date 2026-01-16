import { createContext } from "react";
import type { PdfContextValues } from "./PdfInterface";
import type { singlePdfRecord } from "../../utils/idb";

const defaultPdfContextValues: PdfContextValues = {
  pdf:"",
  pdfUrl:"",
  init: async () => {
    return;
  },
  savePdfData: async (record:singlePdfRecord) => {
    return;
  },
  
  deletePdfData: async () => {
    return;
  },
};

const PdfContext = createContext<PdfContextValues>(defaultPdfContextValues);

export default PdfContext;
