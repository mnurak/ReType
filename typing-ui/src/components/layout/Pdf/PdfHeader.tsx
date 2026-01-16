import { useContext, useEffect, useState } from "react";
import { type singlePdfRecord } from "../../../utils/idb";
import {
  getPage,
  type Page,
  type TypingState,
} from "../../../utils/textParser";
import PdfContext from "../../../context/Pdf/PdfContext";

const PdfHeader = () => {
  const { savePdfData, deletePdfData, pdf } = useContext(PdfContext);
  const [fileName, setFileName] = useState("Select File");
  const uploadPdfData = async (file: File) => {
    const UPLOAD_URL = import.meta.env.VITE_BACKEND_URL + "/pdf/extract";
    console.log("The url is :" + UPLOAD_URL);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch(UPLOAD_URL, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const json: Page[] = await res.json();

      const data: TypingState[] = [];
      // need to update the getpage such that it can take the entire json
      for (let i = 0; i < json.length; i++) data.push(getPage(json, i));

      // TODO: store data in IndexedDB
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
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // upload immediately
    await uploadPdfData(file);
  };
  useEffect(() => {
    if (pdf) setFileName(pdf);
    else setFileName("Select File");
  }, [pdf]);

  const handleRemovePdf = () => {
    deletePdfData();
  };
  return (
    <div className="h-18 flex items-center justify-between p-3 border-b bg-gray-50">
      <div className="flex items-center gap-2">
        <label className="px-3 py-1 rounded bg-blue-500 text-white cursor-pointer">
          {fileName}
          <input
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      </div>

      <div className="flex gap-2">
        <button className="px-2 py-1 border rounded">−</button>
        <button className="px-2 py-1 border rounded">+</button>
      </div>
      {pdf !== "" && (
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1 rounded bg-blue-500 text-white cursor-pointer"
            onClick={handleRemovePdf}
          >
            Remove Pdf
          </button>
        </div>
      )}
    </div>
  );
};

export default PdfHeader;
