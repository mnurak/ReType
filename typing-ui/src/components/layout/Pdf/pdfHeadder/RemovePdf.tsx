import { useContext } from "react";
import PdfContext from "../../../../context/Pdf/PdfContext";

const RemovePdf = ({
  setSelectedPdf,
}: {
  setSelectedPdf: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const { deletePdfData } = useContext(PdfContext);
  const handleRemovePdf = () => {
    setSelectedPdf("");
    deletePdfData();
  };
  return (
    <button
      className="h-15 w-35 px-3 py-.5 m-1 rounded bg-red-500 text-white"
      onClick={handleRemovePdf}
    >
      Remove PDF from device
    </button>
  );
};

export default RemovePdf;
