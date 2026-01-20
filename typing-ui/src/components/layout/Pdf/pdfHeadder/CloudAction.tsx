import { useContext, useEffect } from "react";
import PdfContext from "../../../../context/Pdf/PdfContext";
import AuthContext from "../../../../context/auth/AuthContext";
import PdfListSelector from "../../../ui/PdfListSelector";

const CloudAction = ({
  fileInputRef,
  isUploaded,
  setIsUploaded,
  selectedPdf,
  setSelectedPdf,
}: {
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  isUploaded: boolean;
  setIsUploaded: React.Dispatch<React.SetStateAction<boolean>>;
  selectedPdf: string;
  setSelectedPdf: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const { pdf } = useContext(PdfContext);
  const { authenticated, uploadPdf, deletePdf, getPdfList, pdf_list } =
    useContext(AuthContext);
  // this component is to be rendered only if the user is authenticated / we can also add other if for non authenticated users
  if (!authenticated) return <></>;

  const getPdfFromCloud = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const name: string = e.target.value;
    setSelectedPdf(name);
  };

  const uploadToCloud = async () => {
    const input = fileInputRef.current;
    if (!input || !input.files || input.files.length === 0) {
      // must say the user to add the pdf
      console.log("no input file");
      return null;
    }
    const file: File = input.files[0];
    console.log(file);

    const success: boolean = await uploadPdf(file);
    if (success) {
      console.log("is uploaded");
      setIsUploaded(true);
      getPdfList();
    } else console.log("was unable to upload the pdf");
  };

  const deleteFromCloud = async () => {
    const status: boolean = await deletePdf(pdf);
    if (status) {
      getPdfList();
      console.log("deleted the pdf :" + pdf);
    } else console.log("some error in deleting the pdf in the cloud");
  };

  const handlePdfCloudAction = async () => {
    if (isUploaded) deleteFromCloud();
    else uploadToCloud();
  };

  useEffect(() => {
    if (pdf) {
      setIsUploaded(pdf_list.includes(pdf));
      setSelectedPdf(isUploaded ? pdf : "");
    }
  }, [pdf, pdf_list]);


  return (
    <div className="flex items-center gap-3">
      {pdf && (
        <button
          className={`px-3 py-1 rounded text-white w-40 ${
            isUploaded ? "bg-red-400" : "bg-green-500"
          } `}
          onClick={handlePdfCloudAction}
          disabled={!pdf}
        >
          {isUploaded ? <>delete in cloud</> : <>upload to cloud</>}
        </button>
      )}

      <PdfListSelector
        selectedPdf={selectedPdf}
        onChangeHandler={getPdfFromCloud}
      />
    </div>
  );
};

export default CloudAction;
