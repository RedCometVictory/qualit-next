import { useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import parse from 'html-react-parser';
// import { Draggable } from 'react-beautiful-dnd';
import { Draggable } from '@hello-pangea/dnd';
import { Card, CardHeader, CardMedia, CardContent, CardActions, Collapse, Divider, Avatar, Menu, MenuItem, MenuList, ListItemText, IconButton, Typography, styled } from '@mui/material';
import { FaChevronCircleDown, FaRegHeart, FaRegEdit, FaShare } from 'react-icons/fa';
import { AiOutlineDelete } from 'react-icons/ai';
import { HiDotsVertical } from 'react-icons/hi';
import { updateCard, deleteCard, fetchCards } from '@/redux/features/card/cardSlice';
import useDraggableInPortal from '../hooks/useDraggableInPortal';

import 'react-quill/dist/quill.bubble.css'
const ReactQuill = typeof window === 'object' ? require('react-quill') : () => false;
/**
import 'react-quill/dist/quill.bubble.css'
const ReactQuill = typeof window === 'object' ? require('react-quill') : () => false;
    <ReactQuill
      value={card?.description ??"Description goes here."}
      readOnly={true}
      theme={'bubble'}
    />
*/

const CardItem = ({ className, variant, raised, card, cardIndex, showCardDetail, setModalOpen }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { id: boardId } = router.query;
  const { cards: allCardsViaState } = useSelector(state => state.card);
  const [expanded, setExpanded] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showCardMenu, setShowCardMenu] = useState(false);

  const deleteCardHandler = async () => {
    await dispatch(deleteCard({boardId, cardId: card.id}));
    if (allCardsViaState.length > 0) {
      await dispatch(fetchCards({boardId}));
    };
    menuCloseHandler();
  };

  const openCardEditHandler = async (value) => {
    showCardDetail(card.id);
    menuCloseHandler();
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const menuClickHandler = (e) => {
    setShowCardMenu(true)
    setAnchorEl(e.currentTarget);
  };

  const menuCloseHandler = () => {
    setAnchorEl(null);
    setShowCardMenu(false);
  };

  const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
  })(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  }));

  const renderDraggableInPortal = useDraggableInPortal();

  const cardContent = (card) => {
    return (<>
      <CardHeader
        className="card__header"
        // style={{ color: "var(--body-text)" }}
        // avatar={
        //   <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
        //     R
        //   </Avatar>
        // }
        action={<>
          <IconButton
            aria-label="settings"
            sx={{ color: `var(--body-text)` }}
            onClick={(e) => menuClickHandler(e)}
          >
            <HiDotsVertical />
          </IconButton>
          <Menu
          className={'column__options-menu'}
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={menuCloseHandler}
        >
          <MenuList>
            <MenuItem onClick={openCardEditHandler}>
              <FaRegEdit />
              <ListItemText inset>Edit</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem onClick={deleteCardHandler}>
              <AiOutlineDelete />
              <ListItemText inset>Delete</ListItemText>
            </MenuItem>
          </MenuList>
        </Menu>
        </>}
        title={card.title ?? "No title"}
        titleTypographyProps={{variant: 'h4'}}
        subheader={<Typography className="card__sub-header" sx={{ fontSize: '0.7rem' }} component='div'>{card.created_at ?? "No created at date"}</Typography>}
      />
      {/* <CardMedia
        component="img"
        // height="194"
        image="/static/images/cards/paella.jpg"
        alt=""
      /> */}
      <CardContent
        className="card__content"
      >
        <Typography
          variant="body2"
          component='div'
          // color="text.secondary"
        >
          {/* sequence: {card.sequence} */}
          Type: {card.type ?? "No type listed."}
        </Typography>
        <Typography
          variant="body2"
          component='div'
          // color="text.secondary"
        >
          Priority: {card.priority ?? "No priority listed."}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites" sx={{ color: `var(--body-text)` }}>
          <FaRegHeart classname="card__icon"/>
        </IconButton>
        <IconButton aria-label="share" sx={{ color: `var(--body-text)` }}>
          <FaShare/>
        </IconButton>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
          sx={{ color: `var(--body-text)` }}
        >
          <FaChevronCircleDown/>
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          {/* <Typography component='div'>
            Priority: {card.priority}
          </Typography>
          <Typography component='div'>
            Type: {card.type}
          </Typography> */}
          <Typography component='div' className='card__description'>
            {/* {parse(card?.description ?? "Description goes here.")} */}
            <ReactQuill
              value={card.description ??"Description goes here."}
              readOnly={true}
              theme={'bubble'}
            />
          </Typography>
        </CardContent>
      </Collapse>
    </>);
  };

  return (
    <Draggable draggableId={card.id} index={cardIndex} key={card.id}>
    {renderDraggableInPortal((provided) => (
        <Card
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className={'card card__item'}
          raised={raised ? raised : false}
          variant={variant ? variant : 'outlined'}
        >
          {cardContent(card)}
        </Card>
    ))}
    </Draggable>
  );
};
export default CardItem;