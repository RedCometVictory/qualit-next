import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { FaFileUpload } from "react-icons/fa";
import { TextareaAutosize } from "@mui/material";
import { createTicketComment } from '@/redux/features/project/projectSlice';
import PaperUI from '../UI/PaperUI';
import ButtonUI from "../UI/ButtonUI";

const NewCommentModal = ({setCommentModal}) => {
  let router = useRouter();
  let ticketID = router.query.ticketId;
  const dispatch = useDispatch();
  const [fileTypeError, setFileTypeError] = useState(false);
  const [fileSizeError, setFileSizeError] = useState(false);
  const [isSubmitted, setSubmitted] = useState(false);
  const [imageData, setImageData] = useState(null);
  const [showImageData, isShowImageData] = useState(false);
  const [formData, setFormData] = useState({
    message: "",
    upload: ""
  });

  const { message, upload } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUploadChange = (e) => {
    let fileToUpload = e.target.files[0];
    checkFileType(fileToUpload);
    checkFileSize(fileToUpload);

    setFormData({
      ...formData,
      [e.target.name]: e.target.files[0],
    });

    if (fileToUpload) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImageData(reader.result)
        isShowImageData(true);
      });
      reader.readAsDataURL(fileToUpload);
    }
  };

  const checkFileType = (img) => {
    const types = ["image/png", "image/jpg", "image/jpeg", "image/gif", "application/pdf"];
    if (types.every((type) => img.type !== type)) {
      return setFileTypeError(true);
    }
    return setFileTypeError(false);
  };

  const checkFileSize = (img) => {
    let size = 3 * 1024 * 1024; // size limit 3mb
    if (img.size > size) {
      return setFileSizeError(true);
    }
    return setFileSizeError(false);
  };

  const closeModalHandler = () => {
    setCommentModal(false);
  };

  const submitCommentHandler = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    await dispatch(createTicketComment({ticket_id: ticketID, formData}));
    setSubmitted(false);
    setCommentModal(false);
  };

  return (
    <PaperUI className="modal comment">
      <div className="modal__header">
        <h3 className="title">
          New Comment
        </h3>
      </div>
      <div className="modal__content comment">
        <form onSubmit={submitCommentHandler}>
          <PaperUI className="text-area-paper">
            <TextareaAutosize
              className='text-area'
              maxRows={6}
              minRows={3}
              placeholder="Add new comment."
              name="message"
              value={message}
              onChange={onChange}
              required
            />
          </PaperUI>
          <div className="modal__actions comment">
            <div className="file-uploader comment">
              <div className='label-title'><FaFileUpload /> Upload File</div>
              <label htmlFor="upload" className="file-upload-label">
                <input
                  type="file"
                  accept=".jpeg, .jpg, .png, .gif, .pdf"
                  placeholder=".jpeg, .jpg, .png, .gif, .pdf formats only"
                  name="upload"
                  onChange={handleUploadChange}
                />
              </label>
            </div>
            <div className="action-btns comment">
              {fileTypeError || fileSizeError ? (
                <div className="form__error">
                  File type or size limit exceeded: jpg, jpeg, png, gif only and size must be less than 3mb.
                </div>
              ) : (
                <ButtonUI
                  variant="contained"
                  type="submit"
                >
                  {isSubmitted ? "Submitted" : "Submit"}
                </ButtonUI>
              )}
              <ButtonUI
                variant="outlined"
                // sx={{ color: 'primary.contrastText' }}
                sx={{ color: 'primary.main' }}
                onClick={() => closeModalHandler()}
              >
                Cancel
              </ButtonUI>
            </div>
          </div>
        </form>
      </div>
      <div className="modal__footer"></div>
    </PaperUI>
  )
};
export default NewCommentModal;