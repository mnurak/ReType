import type { singlePdfRecord } from "../../utils/idb";


// export interface PdfData {
//   name: string;
//   data: Page[];
// }

export interface PdfContextValues {
  pdf: string;
  pdfUrl: string;
  init: () => Promise<void>;
  savePdfData: (record:singlePdfRecord) => Promise<void>;
  
  deletePdfData: () => Promise<void>;
}
