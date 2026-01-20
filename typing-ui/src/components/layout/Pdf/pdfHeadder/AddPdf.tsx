import { useContext } from "react";
import PdfContext from "../../../../context/Pdf/PdfContext";

const AddPdf = ({ fileInputRef }: { fileInputRef: React.RefObject<HTMLInputElement | null> }) => {
  const { uploadAndGetPdfData } = useContext(PdfContext);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    await uploadAndGetPdfData(file);
    // should make shure the loading, and failure cases
  };
  return (
    <div className="flex items-center gap-2">
      <label className="px-3 py-1 rounded bg-blue-500 text-white cursor-pointer">
        Add PDF
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={handleFileChange}
        />
      </label>
    </div>
  );
};

export default AddPdf;
