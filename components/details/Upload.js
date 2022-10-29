import { Card } from "@mui/material";
import { FaArrowAltCircleUp } from "react-icons/fa";
import ButtonUI from "../UI/ButtonUI";

const Upload = () => {
  return (<div className="ticket-uploader">
    <Card
      // className='ticket-uploader'
    >
      Upload Photo or Document / PDF
      <div className="image-doc-preview">
        Preview of image or doc icon goes here.
      </div>
      <div className="modal__actions upload-btn">
        <ButtonUI
          variant="outlined"
        >
          <FaArrowAltCircleUp className="btn-icon"/> Upload
        </ButtonUI>
      </div>
    </Card>
  </div>)
};
export default Upload;