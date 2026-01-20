import { useContext, useEffect, useRef, useState } from "react";
import AddPdf from "./AddPdf";
import CloudAction from "./CloudAction";
import RemovePdf from "./RemovePdf";
import PdfStatus from "./PdfStatus";
import AuthContext from "../../../../context/auth/AuthContext";
import PdfContext from "../../../../context/Pdf/PdfContext";


const PdfHeader = () => {
  const [isUploaded, setIsUploaded] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { getPdf } = useContext(AuthContext);
  const { uploadAndGetPdfData } = useContext(PdfContext);

  useEffect(() => {
    const handleChange = async () => {
      if (selectedPdf) {
        const file: File | null = await getPdf(selectedPdf);
        if (file) {
          const input = fileInputRef.current;
          if (input) {
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            input.files = dataTransfer.files;
          }
          uploadAndGetPdfData(file);
        } else {
          console.log("was unable to get the pdf for some reason");
        }
      }
    };

    handleChange();
  }, [selectedPdf]);

  return (
    <div className="border-b bg-gray-50">
      {/* Top Toolbar */}
      <div className="h-18 flex items-center justify-between p-3">
        {/* Add PDF */}
        <AddPdf fileInputRef={fileInputRef} />

        {/* Cloud Actions */}
        <CloudAction
          fileInputRef={fileInputRef}
          isUploaded={isUploaded}
          setIsUploaded={setIsUploaded}
          selectedPdf={selectedPdf}
          setSelectedPdf={setSelectedPdf}
        />

        {/* Remove from Session */}
        <RemovePdf setSelectedPdf={setSelectedPdf} />
      </div>

      {/* 🔽 PDF Status Bar */}
      <PdfStatus isUploaded={isUploaded} />
    </div>
  );
};

export default PdfHeader;
