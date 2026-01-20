import PdfBody from "./PdfBody"
import PdfHeader from "./pdfHeadder/PdfHeader"


const pdfPanel = () => {
  return (
    <div className="flex flex-col h-full">
      <PdfHeader />

      <PdfBody />
    </div>
  )
}

export default pdfPanel
