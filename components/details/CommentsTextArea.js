import ButtonUI from "../UI/ButtonUI";
import { TextareaAutosize } from "@mui/material";

const CommentsTextArea = () => {
  return (<>
    <TextareaAutosize
      className='text-area'
      maxRows={6}
      minRows={6}
      placeholder="Add new comment."
    />
    <div className="detail__actions">
      <ButtonUI
        variant="contained"
      >
        Submit
      </ButtonUI>
    </div>
  </>)
}

export default CommentsTextArea;