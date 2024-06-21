import { useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { Draggable } from 'react-beautiful-dnd';
import { Card, CardHeader, CardMedia, CardContent, CardActions, Collapse, Divider, Avatar, Menu, MenuItem, MenuList, ListItemText, IconButton, Typography, styled } from '@mui/material';
import { FaChevronCircleDown, FaRegHeart, FaShare } from 'react-icons/fa';
import { AiOutlineDelete } from 'react-icons/ai';
import { FaRegEdit } from 'react-icons/fa';
import { updateCard, deleteCard, fetchCards } from '@/redux/features/card/cardSlice';
import { HiDotsVertical } from 'react-icons/hi';
// import { red } from '@mui/material/colors';
import CardDetailModal from '../modals/CardDetailModal';

const CardItem = ({ className, variant, raised, card, cardIndex, showCardDetail, setModalOpen }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { id: boardId } = router.query;
  const [expanded, setExpanded] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showCardMenu, setShowCardMenu] = useState(false);
  // const [isModalOpen, setModalOpen] = useState(false);
  // const users = useSelector(state => state.users.users);
  const loadAssignedToUser = () => {
    // do nothing if not owner of card
    // if (!card.assignedTo) return;
  
    // const user = users.filter(user => user.id === card.assignedTo);
  };

  const deleteCardHandler = async () => {
    await dispatch(deleteCard(card.id));
    await dispatch(fetchCards({boardId}));
    setModalOpen(false);
  };

  const openCardEditHandler = async (value) => {
    showCardDetail(card.id);
    // need to pass or set in state the idd value of the card that is going to be edited
    // setModalOpen(true);
    menuCloseHandler();
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const menuClickHandler = (e) => {
    // setShowCardMenu(!showCardMenu);
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

  const cardContent = (card) => {
    return (<>
        {/* {card.label && (
          <Badge bg={card.label.type} color="white">
            {card.label.type}
          </Badge>
        )}
        <p>{card.title}</p> */}
        {/* {loadAssignedToUser()} */}
      {/* {children || label || text} */}
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
        // title="Shrimp and Chorizo Paella"
        title={card.title ?? "No title"}
        title={card.id ?? "No title"}
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
          <Typography component='div'>
            {card.description ?? "Description goes here."}
          </Typography>
        </CardContent>
      </Collapse>
    </>);
  };

  return (
    <Draggable
      draggableId={card.id}
      index={cardIndex}
      key={card.id}
    >
    {(provided) => (
      <Card
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        ref={provided.innerRef}
        className={'card card__item'}
        raised={raised ? raised : false}
        variant={variant ? variant : 'outlined'}
        // key={key ? key : null}
        // onClick={() => showDetail(card._id)}>
      >
        {cardContent(card)}
      </Card>
    )}
    </Draggable>
  );
};
export default CardItem;