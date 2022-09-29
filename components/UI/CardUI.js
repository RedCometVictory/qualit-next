import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Draggable } from 'react-beautiful-dnd';
import { FaChevronCircleDown, FaRegHeart, FaShare } from 'react-icons/fa';
import { HiDotsVertical } from 'react-icons/hi';
import { Card, CardHeader, CardMedia, CardContent, CardActions, Collapse, Avatar, IconButton, Typography, styled } from '@mui/material';
import { red } from '@mui/material/colors';


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


const CardUI = ({
  className, raised, variant,
  children, label, text,
  header, key,
  color, underline = 'none',
  disabled, ...restProps
}) => {
  // const users = useSelector(state => state.users.users);
  const loadAssignedToUser = () => {
    // do nothing if not owner of card
    // if (!card.assignedTo) return;
  
    // const user = users.filter(user => user.id === card.assignedTo);
  };
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  // const cardExampleContent = () => {
  //   return (<>
  //       {/* {card.label && (
  //         <Badge bg={card.label.type} color="white">
  //           {card.label.type}
  //         </Badge>
  //       )}
  //       <p>{card.title}</p> */}
  //       {/* {loadAssignedToUser()} */}
  //     {/* {children || label || text} */}
  //     <CardHeader
  //       // avatar={
  //       //   <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
  //       //     R
  //       //   </Avatar>
  //       // }
  //       action={
  //         <IconButton aria-label="settings">
  //           <HiDotsVertical />
  //         </IconButton>
  //       }
  //       title="Shrimp and Chorizo Paella"
  //       titleTypographyProps={{variant: 'h6'}}
  //       subheader="September 14, 2016"
  //     />
  //     <CardMedia
  //       component="img"
  //       // height="194"
  //       image="/static/images/cards/paella.jpg"
  //       alt="Paella dish"
  //     />
  //     <CardContent>
  //       <Typography variant="body2" color="text.secondary">
  //         This impressive paella is a perfect party dish and a fun meal to cook
  //         together with your guests. Add 1 cup of frozen peas along with the mussels,
  //         if you like.
  //       </Typography>
  //     </CardContent>
  //     <CardActions disableSpacing>
  //       <IconButton aria-label="add to favorites">
  //         <FaRegHeart />
  //       </IconButton>
  //       <IconButton aria-label="share">
  //         <FaShare />
  //       </IconButton>
  //       <ExpandMore
  //         expand={expanded}
  //         onClick={handleExpandClick}
  //         aria-expanded={expanded}
  //         aria-label="show more"
  //       >
  //         <FaChevronCircleDown className="card__toggle-chevron"/>
  //       </ExpandMore>
  //     </CardActions>
  //     <Collapse in={expanded} timeout="auto" unmountOnExit>
  //       <CardContent>
  //         <Typography paragraph>Method:</Typography>
  //         <Typography paragraph>
  //           Heat 1/2 cup of the broth in a pot until simmering, add saffron and set
  //           aside for 10 minutes.
  //         </Typography>
  //         <Typography paragraph>
  //           Heat oil in a (14- to 16-inch) paella pan or a large, deep skillet over
  //           medium-high heat. Add chicken, shrimp and chorizo, and cook, stirring
  //           occasionally until lightly browned, 6 to 8 minutes. Transfer shrimp to a
  //           large plate and set aside, leaving chicken and chorizo in the pan. Add
  //           pimentón, bay leaves, garlic, tomatoes, onion, salt and pepper, and cook,
  //           stirring often until thickened and fragrant, about 10 minutes. Add
  //           saffron broth and remaining 4 1/2 cups chicken broth; bring to a boil.
  //         </Typography>
  //         <Typography paragraph>
  //           Add rice and stir very gently to distribute. Top with artichokes and
  //           peppers, and cook without stirring, until most of the liquid is absorbed,
  //           15 to 18 minutes. Reduce heat to medium-low, add reserved shrimp and
  //           mussels, tucking them down into the rice, and cook again without
  //           stirring, until mussels have opened and rice is just tender, 5 to 7
  //           minutes more. (Discard any mussels that don&apos;t open.)
  //         </Typography>
  //         <Typography>
  //           Set aside off of the heat to let rest for 10 minutes, and then serve.
  //         </Typography>
  //       </CardContent>
  //     </Collapse>
  //   </>);
  // };

  return (
    <Draggable
      draggableId='123'
      // draggableId={card.id}
      // index={cardIndex}
      // key={card.id}
    >
    {(provided) => (
      <Card
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        ref={provided.innerRef}
        sx={{ maxWidth: 345 }}
        className={className ? className : 'card__item'}
        raised={raised ? raised : false}
        variant={variant ? variant : 'outlined'}
        {...{...restProps, underline}}
        key={key ? key : null}
        // onClick={() => showDetail(card._id)}>
      >
        {children || label || text}
        {/* {cardExampleContent()} */}
      </Card>
    )}
    </Draggable>
  )
};
export default CardUI;
      // <div className="card__text">
      //   <p>This is a card.</p>
      //   <hr />
      //   <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates necessitatibus eaque dolor ad blanditiis similique vitae aliquid, deserunt perferendis at amet fugit, quos, obcaecati cum? Repellat sed hic necessitatibus reiciendis!</p>
      // </div>