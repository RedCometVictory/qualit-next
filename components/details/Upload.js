import { Card } from "@mui/material";
import { FaArrowAltCircleUp } from "react-icons/fa";
import ButtonUI from "../UI/ButtonUI";
import PaperUI from "../UI/PaperUI";

const Upload = () => {
  return (
    <div className="ticket-uploader">
      {/* <PaperUI
        className='uploader-paper'
      > */}
        Upload Photo or Document / PDF
        <div className="image-doc-preview">
          Preview of image or doc icon goes here.
        </div>
        <div className="modal__actions upload-btn">
          <ButtonUI
            variant="outlined"
            sx={{ color: 'primary.main' }}
          >
            <FaArrowAltCircleUp className="btn-icon"/> Upload
          </ButtonUI>
        </div>
      {/* </PaperUI> */}
    </div>
  )
};
export default Upload;