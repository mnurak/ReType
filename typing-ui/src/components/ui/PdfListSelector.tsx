import { useContext } from "react";
import AuthContext from "../../context/auth/AuthContext";

const PdfListSelector = ({
  selectedPdf,
  onChangeHandler,
}: {
  selectedPdf: string;
  onChangeHandler: (e: React.ChangeEvent<HTMLSelectElement>) => Promise<void>;
}) => {
  const { pdf_list } = useContext(AuthContext);
  if (pdf_list.length == 0) return <></>;
  return (
    <select
      className="w-67 border px-3 py-1 rounded"
      value={selectedPdf}
      onChange={onChangeHandler}
    >
      <option value=""> select the pdf from the cloud</option>
      {pdf_list.map((pdfName, index) => (
        <option key={index} value={pdfName}>
          {pdfName}
        </option>
      ))}
    </select>
  );
};

export default PdfListSelector;
