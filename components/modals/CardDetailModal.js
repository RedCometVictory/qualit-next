import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCards, updateCard, deleteCard } from '@/redux/features/card/cardSlice';
import { Box, Input, Menu, MenuItem, Modal, Divider, TextareaAutosize, TextField, Typography, FormControl, FormLabel, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { AiOutlineDelete, AiOutlineClose, AiOutlineDown, AiOutlineLaptop } from 'react-icons/ai';
import { HiPencilAlt } from 'react-icons/hi';
// import { LuPencil } from "react-icons/lu";
import { MdOutlineTextsms } from 'react-icons/md';
import { GrTextAlignFull } from 'react-icons/gr';
import ButtonUI from '../UI/ButtonUI';
import PaperUI from '../UI/PaperUI';
// import CardLabel from '/modals';
import QuillEditor from '../QuillEditor';


// this modal allows us to update a cards content
// const CardDetailModal = ({ onClose, isOpen, card }) => {
const initialState = {
  id: '',
  title: '',
  description: '',
  priority: '',
  type: '',
  // sequence: #,
  // boardId: '',
  // columnId: '',
  // userId: '' // uncomment if saving data w/o using backend
};

// userId is the assigned user
const CardDetailModal = ({ setModalOpen, card }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { id: boardId } = router.query;
  // isrequest can track card deletion
  // TODO: need to confirm a method of setting card details to card.card in getState. Perhaps this can be done via Card component menu. When clicking the edit option on the menu, fetch the details of the card via its card id. Likely cardDetails will not be set, i need to set via a method derived from Card component and the proper fetchCard data in cardSlice
  // ! Another thing to consider and to confirm is that showCardDetail has already sorted out cards by their id. Try not to use showCardDetail
  const { card: cardDetails, loading, isRequesting: cardRequest } = useSelector(state => state.card);
  // const users = useSelector(state => state.users.users);
  const [anchorEl, setAnchorEl] = useState(null);
  const [hasMounted, setHasMounted] = useState(false);
  const [formData, setFormData] = useState(initialState);
  
  useEffect(() => {
    setFormData({
      id: card ? card.id : '',
      title: card ? card.title : '',
      description: card ? card.description : '',
      priority: card ? card.priority : '',
      type: card ? card.type : '',
      // boardId: loading || !card ? '' : card.boardId,
      // columnId: loading || !card ? '' : card.columnId,
      // userId: loading || !card ? '' : card.userId
    })
  }, [dispatch, loading]);

  useEffect(() => {
    setHasMounted(true)
  }, []);

  if (!hasMounted) {
    return null;
  }

  console.log("card edit modal")
  console.log("card")
  console.log(card)
  console.log("-=-=-=-=-=-=-=-=-=-=-")
  console.log("formData")
  console.log(formData)
  console.log("card edit modal end")
  // const { cardId, title, description, priority, type, boardId, columnId, userId } = formData;
  const { title, description, priority, type } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const changeRadioHandler = (e) => {
    setFormData(formData = {...formData, [e.target.name]: e.target.value});
  };

  // TODO - move this function to the card componenet since it has an options menu for editing or deleting a card item, this modal will open from the menu
  // const handleCardDelete = async () => {
  //   // use this AiOutlineDelete on the menu
  //   // await dispatch(deleteCard(card.id));
  //   await dispatch(deleteCard(cardDetails.id));
  //   await dispatch(fetchCards({boardId}));

  //   setModalOpen(false);
  // };

  const modalSubmitHandler = async (e) => {
    e.preventDefault();
    console.log("-=-=-=-=-=-=-=-=-=-=-=-=-")
    console.log("-=-=-=-=-=-=-=-=-=-=-=-=-")
    console.log(card)
    console.log("-=-=-=-=-=-=-=-=-=-=-=-=-")
    console.log("-=-=-=-=-=-=-=-=-=-=-=-=-")
    await dispatch(updateCard({boardId, cardId: card.id, formData}));
    await dispatch(fetchCards({boardId}));
    setModalOpen(false);
  };

  const closeModalHandler = () => {
    setModalOpen(false);
  };

  // ##################################
  // for the menu & menu items
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  // ##################################
  // ##################################
  // for the modal
  // const styleModal = {
  //   position: 'absolute',
  //   top: '50%',
  //   left: '50%',
  //   transform: 'translate(-50%, -50%)',
  //   width: 400,
  //   bgcolor: 'background.paper',
  //   border: '2px solid #000',
  //   boxShadow: 24,
  //   p: 4,
  //   pt: 2,
  //   px: 4,
  //   pb: 3,
  // };

  // ##################################
  // const assignToMenu = () => {
  //   return (
  //     <div>
  //       <ButtonUI
  //         id="basic-button"
  //         aria-controls={open ? 'basic-menu' : undefined}
  //         aria-haspopup="true"
  //         aria-expanded={open ? 'true' : undefined}
  //         onClick={handleClick}
  //       >
  //         <AiOutlineClose />{" "}Assign User
  //       </ButtonUI>
  //       <Menu
  //         id="basic-menu"
  //         anchorEl={anchorEl}
  //         open={open}
  //         onClose={handleClose}
  //         MenuListProps={{
  //           'aria-labelledby': 'basic-button',
  //         }}
  //       >
  //         {/* list all users assigned to project */}
  //         {/* {users.map((user, index) => (
  //           <MenuItem key={index} onClick={() => handleClick(user.id)}>
  //             {user.firstName}
  //           </MenuItem>
  //         ))} */}
  //         <MenuItem onClick={() => handleClick('')} >Unassign</MenuItem>
  //         <MenuItem onClick={handleClose}>Profile</MenuItem>
  //         <MenuItem onClick={handleClose}>My account</MenuItem>
  //         <MenuItem onClick={handleClose}>Logout</MenuItem>
  //       </Menu>
  //     </div>
  //   );
  // };
  console.log("card --- modL DETAIL")
  console.log(card)

  return (
    <PaperUI className="modal paper card">
      <div className="modal__header">
        <h3 className="title">
          Update Card
        </h3>
      </div>
      <div className="modal__content">
        <form onSubmit={e => modalSubmitHandler(e)}>
          <FormControl style={{width: `100%`}}>
            <div className="modal__card">
              <div>
                <div className="modal__card input-line">
                  <HiPencilAlt className="card-icon" />
                  <TextField
                    className=""
                    variant='outlined'
                    label="Card Title"
                    name='title'
                    value={title}
                    onChange={onChange}
                    required
                  />
                </div>
              </div>
              <div className="modal__card quill-editor-section">
                {/* <GrTextAlignFull /> */}
                <div className="quill-header">Card Description</div>
                <div className="quill-editor-box">
                  <QuillEditor
                    name="description"
                    // name={'description'} 
                    value={description} 
                    onChange={onChange}
                  />
                </div>
              </div>
            </div>
            <div className="modal__radio-group priority">
              <FormLabel
                aria-label="status-radio-buttons-group"
                defaultValue="new"
                name="status-radio-buttons-group"
              >
                Priority
              </FormLabel>
              <RadioGroup
                row
                defaultValue="High"
                name="priority"
                onChange={changeRadioHandler}
                value={priority}
              >
                <FormControlLabel value="Urgent" control={<Radio />} label="Urgent"/>
                <FormControlLabel value="High" control={<Radio />} label="High"/>
                <FormControlLabel value="Medium" control={<Radio />} label="Medium"/>
                <FormControlLabel value="Low" control={<Radio />} label="Low"/>
                <FormControlLabel value="None" control={<Radio />} label="None"/>
              </RadioGroup>
            </div>
            <Divider />
            <div className="modal__radio-group type">
              <FormLabel
                aria-label="status-radio-buttons-group"
                defaultValue="new"
                name="status-radio-buttons-group"
              >
                Type
              </FormLabel>
              <RadioGroup
                row
                defaultValue="Bug"
                name="type"
                onChange={changeRadioHandler}
                value={type}
              >
                <FormControlLabel value="Bug" control={<Radio />} label="Bug"/>
                <FormControlLabel value="Breaking Change" control={<Radio />} label="Breaking Change"/>
                <FormControlLabel value="Discussion" control={<Radio />} label="Discussion"/>
                <FormControlLabel value="Error" control={<Radio />} label="Error"/>
                <FormControlLabel value="Enhancement" control={<Radio />} label="Enhancement"/>
                <FormControlLabel value="Feature Request" control={<Radio />} label="Feature Request"/>
                <FormControlLabel value="Needs Investigation" control={<Radio />} label="Needs Investigation"/>
                <FormControlLabel value="Question" control={<Radio />} label="Question"/>
                <FormControlLabel value="Release" control={<Radio />} label="Release"/>
                <FormControlLabel value="Regression" control={<Radio />} label="Regression"/>
                <FormControlLabel value="Security" control={<Radio />} label="Security"/>
                <FormControlLabel value="Misc" control={<Radio />} label="Misc"/>
              </RadioGroup>
            </div>
            <div className="modal__actions">
              <ButtonUI
                variant="contained"
                type="submit"
                disabled={cardRequest}
                onClick={e => modalSubmitHandler(e)}
                sx={{ color: 'primary.text' }}
              >
                Submit
              </ButtonUI>

              <ButtonUI
                variant="outlined"
                // sx={{ color: 'primary.contrastText' }}
                sx={{ color: 'primary.main' }}
                onClick={() => closeModalHandler()}
              >
                Cancel
              </ButtonUI>
            </div>
          </FormControl>
        </form>
      </div>
    </PaperUI>
  )
};
export default CardDetailModal;


{/* <div> */}
    //   {/* <ButtonUI onClick={handleModalOpen}>Open modal</ButtonUI> */}
    //   <Modal
    //     // open={isOpen}
    //     open={setModalOpen}
    //     onClose={(e) => modalSubmitHandler(e)}
    //     aria-labelledby="modal-modal-title"
    //     aria-describedby="modal-modal-description"
    //   >
    //     <Box sx={styleModal}>
    //       <div className="modal__title">
    //         <AiOutlineLaptop />
    //         <Typography id="modal-modal-title" variant="h6" component="h2">
    //           Card Title
    //         </Typography>
    //         {/* <TextField id='outlined-basic' label='Outlined' variant='outlined' defaultValue='Title' /> */}
    //         <Input id='outlined-basic' label='Outlined' variant='outlined' defaultValue='Card Title' />
    //       </div>
    //       <div className="modal__description">
    //         <div className="modal__description-title">
    //           <MdOutlineTextsms />
    //           <Typography id="modal-modal-title" variant="h6" component="h2">
    //             Description
    //           </Typography>
    //         </div>
    //         <div className="modal__text-editor">
    //           <Typography
    //             id="modal-modal-description"
    //             sx={{ mt: 2 }}
    //             component='div'
    //           >
    //             {/* <QuillEditor value={description} onChange={setDescription} /> */}
    //             Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
    //           </Typography>
    //         </div>
    //       </div>
    //       <div className="modal__assignment">
    //         <Typography sx={{ fontSize: 14 }} color="text.secondary" component='div' gutterBottom>
    //           Card ID: {"card.id"} Board ID: {"card.boardID"}
    //         </Typography>
    //         {assignToMenu()}
    //       </div>
    //     </Box>
    //   </Modal>
    // </div>