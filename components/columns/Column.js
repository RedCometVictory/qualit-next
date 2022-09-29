import React, { useState, useCallback } from 'react';
import { FaPlus } from 'react-icons/fa';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { useDispatch, useSelector } from 'react-redux';
import { Collapse, CardHeader, CardActions, CardMedia, CardContent, IconButton, Typography, styled } from '@mui/material';
import { FaChevronCircleDown, FaRegHeart, FaShare } from 'react-icons/fa';
import { HiDotsVertical } from 'react-icons/hi';
import CardUI from '../UI/CardUI';
import ButtonUI from '../UI/ButtonUI';
import Cards from '../cards/Cards';
// from slice: delete, fetch and update columns

// const Column = ({ showCardDetail, column, index, id, cards }) => {
// const Column = ({ showCardDetail = true, cards }) => {
const Column = ({ isModalOpen }) => {
  const dispatch = useDispatch();
  const [editArea, setEditArea] = useState(false);
  // const cardRequest = useSelector(state => state.cards.isRequested);
  // const [columnName, setColumnName] = useState(column.columnName);
  // const sortedCards = cards.sort(
  //   (cardA, cardB) => cardA.sequence - cardB.sequence
  // );


  // return (
  //   <article className="card__column-container">
  //     <h2>Column Title</h2>
  //     <p>Sub-Title</p>
  //     <hr />
  //     <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat illum eaque, deleniti sequi asperiores similique laudantium, possimus molestiae laborum voluptatibus nam animi vel aliquid nihil et quibusdam vitae a totam.</p>
  //   </article>
  // )

  // TODO: the current cartui element is a placeholder
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
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

  const cardExampleContent = () => {
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
        action={
          <IconButton
            aria-label="settings"
            sx={{ color: `var(--body-text)` }}
            onClick={() => isModalOpen(true)}
          >
            <HiDotsVertical />
          </IconButton>
        }
        title="Shrimp and Chorizo Paella"
        titleTypographyProps={{variant: 'h6'}}
        subheader={<Typography className="card__sub-header" sx={{ fontSize: '0.7rem' }}>September 14, 2016</Typography>}
      />
      <CardMedia
        component="img"
        // height="194"
        image="/static/images/cards/paella.jpg"
        alt="Paella dish"
      />
      <CardContent
        className="card__content"
      >
        <Typography
          variant="body2"
          // color="text.secondary"
        >
          This impressive paella is a perfect party dish and a fun meal to cook
          together with your guests. Add 1 cup of frozen peas along with the mussels,
          if you like.
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
          <Typography paragraph>Method:</Typography>
          <Typography paragraph>
            Heat 1/2 cup of the broth in a pot until simmering, add saffron and set
            aside for 10 minutes.
          </Typography>
          <Typography paragraph>
            Heat oil in a (14- to 16-inch) paella pan or a large, deep skillet over
            medium-high heat. Add chicken, shrimp and chorizo, and cook, stirring
            occasionally until lightly browned, 6 to 8 minutes. Transfer shrimp to a
            large plate and set aside, leaving chicken and chorizo in the pan. Add
            pimentón, bay leaves, garlic, tomatoes, onion, salt and pepper, and cook,
            stirring often until thickened and fragrant, about 10 minutes. Add
            saffron broth and remaining 4 1/2 cups chicken broth; bring to a boil.
          </Typography>
          <Typography paragraph>
            Add rice and stir very gently to distribute. Top with artichokes and
            peppers, and cook without stirring, until most of the liquid is absorbed,
            15 to 18 minutes. Reduce heat to medium-low, add reserved shrimp and
            mussels, tucking them down into the rice, and cook again without
            stirring, until mussels have opened and rice is just tender, 5 to 7
            minutes more. (Discard any mussels that don&apos;t open.)
          </Typography>
          <Typography>
            Set aside off of the heat to let rest for 10 minutes, and then serve.
          </Typography>
        </CardContent>
      </Collapse>
    </>);
  };

  let index = '009';
  return (
    // <Draggable draggableId={column.id} index={index} key={column.id}>
    <Draggable draggableId='123' index={index} key={'123'}>
      {(provided) => (
        <div className="board__lane"
          // bg={column.columnName === 'addName' ? '' : '#F6F6F6'}
        >
          <div className="board__lane-header">
            <h3>Subject Header for lane goes here</h3>
          </div>
          <div
            className="board__lane-content"
            
          >
            <Droppable
              droppableId='123'
              // droppableId={Column.id}
              type="card"
            >
              {(provided) => (
                <div
                  className="board__lane-scroll"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <Cards
                    key={index}
                    className="card"
                    variant=''
                    raised='true'
                    // cards={cards}
                    // showCardDetail={showCardDetail}
                  >
                    {cardExampleContent()}
                  </Cards>
                  {/* <Cards
                    // showCardDetail={showCardDetail}
                    // cards={sortedCards}
                  // /> */}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
            <CardActions>
              <ButtonUI size="small">
                <FaPlus/> Add New Card
              </ButtonUI>
            </CardActions>
          </div>
        </div>
      )}
    </Draggable>
  )
};
export default Column;
{/* <CardUI
  // className="card__column-container"
  raised='true'
>
  <h2>Column Title</h2>
  <p>Sub-Title</p>
  <hr />
  <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat illum eaque, deleniti sequi asperiores similique laudantium, possimus molestiae laborum voluptatibus nam animi vel aliquid nihil et quibusdam vitae a totam.</p>
</CardUI> */}