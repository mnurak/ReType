import { useContext } from "react";
import PdfContext from "../../../../context/Pdf/PdfContext";
import AuthContext from "../../../../context/auth/AuthContext";

const PdfStatus = ({ isUploaded }: { isUploaded: boolean }) => {
  const { pdf } = useContext(PdfContext);
  const { authenticated } = useContext(AuthContext);
  return (
    <div className="flex items-center justify-between px-4 py-2 text-sm bg-white border-t">
      <div className="flex items-center gap-2">
        <span className="font-medium">PDF:</span>
        <span className="truncate max-w-xs">{pdf}</span>
      </div>

      {authenticated ? (
        <div
          className={`px-2 py-0.5 rounded text-xs font-medium ${
            isUploaded
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {isUploaded ? "Uploaded to Cloud" : "Not Uploaded"}
        </div>
      ) : (
        <div className="px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-700">
          do login to save the pdf in the cloud
        </div>
      )}
    </div>
  );
};

export default PdfStatus;
