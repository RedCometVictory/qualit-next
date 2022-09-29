import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { deleteCard, getCards, updateCard } from 'slices';
import { Box, Input, Menu, MenuItem, Modal, TextField, Typography } from '@mui/material';
import { AiOutlineDelete, AiOutlineClose, AiOutlineDown, AiOutlineLaptop } from 'react-icons/ai';
import { MdOutlineTextsms } from 'react-icons/md';
import ButtonUI from '../UI/ButtonUI';
// import CardLabel from '/modals';
import QuillEditor from '../QuillEditor';


// const CardDetailModal = ({ onClose, isOpen, card }) => {
const initialState = {
  cardId: '',
  title: '',
  description: '',
  priority: '',
  type: '',
  // sequence: #,
  boardId: '',
  columnId: '',
  userId: ''
};

const CardDetailModal = ({ setModalOpen }) => {
  const dispatch = useDispatch();
  // const { loading, cardDetails } = useSelector(state => state.cards)
  // const cardRequest = useSelector(state = state.cards.isRequesting);
  // const cardDelete = useSelector(state = state.cards.isDeletting);
  // const users = useSelector(state = state.users.users);
  const [anchorEl, setAnchorEl] = useState(null);
  const [formData, setFormData] = useState(initialState);
  
  // useEffect(() => {
  //   setFormData({
  //     cardId: loading || !cardDetails ? '' : cardDetails.cardId,
  //     title: loading || !cardDetails ? '' : cardDetails.title,
  //     description: loading || !cardDetails ? '' : cardDetails.description,
  //     priority: loading || !cardDetails ? '' : cardDetails.priority,
  //     type: loading || !cardDetails ? '' : cardDetails.type,
  //     boardId: loading || !cardDetails ? '' : cardDetails.boardId,
  //     columnId: loading || !cardDetails ? '' : cardDetails.columnId,
  //     userId: loading || !cardDetails ? '' : cardDetails.userId
  //   })
  // }, [dispatch, loading]);
    
  const { cardId, title, description, priority, type, boardId, columnId, userId } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  // const handleCardDelete = async () => {
  //   await dispatch(deleteCard(card.id));
  //   await dispatch(fetchCards());

  //   onClose();
  // };

  const modalSubmitHandler = async (e) => {
    e.preventDefault();
    // await dispatch(updateCard(formData));
    // await dispatch(getCards());
    setModalOpen(false);
  };

  // const handleClick = async (userId) => {
    // setAssignedUser(userId);
    // const data = {
    //   id: card.id,
    //   title,
    //   description,
    //   columnId: card.columnId,
    //   assignedUser: userId
    // };
    // await dispatchEvent(updateCard(data));
  // };

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
  const styleModal = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    pt: 2,
    px: 4,
    pb: 3,
  };
  // const handleModalOpen = () => setOpenModal(true);
  // const handleModalClose = () => setOpenModal(false);

  // ##################################
  const assignToMenu = () => {
    return (
      <div>
        <ButtonUI
          id="basic-button"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
        >
          <AiOutlineClose />{" "}Assign User
        </ButtonUI>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          {/* list all users assigned to project */}
          {/* {users.map((user, index) => (
            <MenuItem key={index} onClick={() => handleClick(user.id)}>
              {user.firstName}
            </MenuItem>
          ))} */}
          <MenuItem onClick={() => handleClick('')} >Unassign</MenuItem>
          <MenuItem onClick={handleClose}>Profile</MenuItem>
          <MenuItem onClick={handleClose}>My account</MenuItem>
          <MenuItem onClick={handleClose}>Logout</MenuItem>
        </Menu>
      </div>
    );
  };

  return (
    <div>
      {/* <ButtonUI onClick={handleModalOpen}>Open modal</ButtonUI> */}
      <Modal
        // open={isOpen}
        open={setModalOpen}
        onClose={(e) => modalSubmitHandler(e)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={styleModal}>
          <div className="modal__title">
            <AiOutlineLaptop />
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Card Title
            </Typography>
            {/* <TextField id='outlined-basic' label='Outlined' variant='outlined' defaultValue='Title' /> */}
            <Input id='outlined-basic' label='Outlined' variant='outlined' defaultValue='Card Title' />
          </div>
          <div className="modal__description">
            <div className="modal__description-title">
              <MdOutlineTextsms />
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Description
              </Typography>
            </div>
            <div className="modal__text-editor">
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                {/* <QuillEditor value={description} onChange={setDescription} /> */}
                Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
              </Typography>
            </div>
          </div>
          <div className="modal__assignment">
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              Card ID: {"card.id"} Board ID: {"card.boardID"}
            </Typography>
            {assignToMenu()}
          </div>
        </Box>
      </Modal>
    </div>
  )
};
export default CardDetailModal;