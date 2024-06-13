import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { Collapse, CardHeader, CardActions, CardMedia, CardContent, Divider, IconButton, Paper, Menu, MenuItem, MenuList, ListItemIcon, ListItemText, TextField, Typography, styled, cardHeaderClasses } from '@mui/material';
import { FaPlus, FaRegEdit } from 'react-icons/fa';
import { AiOutlineDelete } from 'react-icons/ai';
import { FaChevronCircleDown, FaRegHeart, FaShare } from 'react-icons/fa';
import { GrDrag } from 'react-icons/gr';
import { HiDotsVertical } from 'react-icons/hi';
import { fetchColumns, updateColumn, deleteColumn } from '@/redux/features/column/columnSlice';
import { fetchCards, addCard } from '@/redux/features/card/cardSlice';
import CardUI from '../UI/CardUI';
import ButtonUI from '../UI/ButtonUI';
import Cards from '../cards/Cards';
// from slice: delete, fetch and update columns

const Column = ({ showCardDetail, column, index, id, cards }) => {
// const Column = ({ showCardDetail = true, cards }) => {
// const Column = ({ isModalOpen }) => {
  const dispatch = useDispatch();
  const [editArea, setEditArea] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showColMenu, setShowColMenu] = useState(false);
  const [columnName, setColumnName] = useState(column.columnName);
  const [expanded, setExpanded] = useState(false);
  const cardRequest = useSelector(state => state.card.isRequested);
  const sortedCards = cards.sort(
    (cardA, cardB) => cardA.sequence - cardB.sequence
  );

  function debounce(func, wait) {
    let timeout;
    return function(...args) {
      const context = this;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), wait);
    };
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      setEditBoxArea(false);
    }
  };

  const addCardHandler = async () => {
    await dispatch(addCard(column._id));
    await dispatch(fetchCards());
  };

  const updateColumnTitleHandler = (e) => {
    setColumnName(e.target.value);
    updateColumnHandler(e.target.value);
  };

  const deleteColumnHandler = async () => {
    await dispatch(deleteColumn(id)); // id of column
    await dispatch(fetchColumns());
  };

  const updateColumnHandler = useCallback(
    debounce((value) => updateColumnNameHandler(value), 800),
    []
  );

  const updateColumnNameHandler = async (value) => {
    const formData = {
      // columnName: value,
      // columnId: column._id
      // columnId: column._id,
      name: value
    };

    await dispatch(updateColumn(formData));
  };

  // const colMenuHandler = () => {
  //   setShowColMenu(!showColMenu)
  // };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const openColEditHandler = () => {
    // open input to edit col name and close the options menu
    setEditArea(true);
    // setShowColMenu(false);
    menuCloseHandler();
  };

  const menuClickHandler = (e) => {
    if (e.currentTarget.value === 'Cancel') {
      setEditArea(false);
      setShowColMenu(false);
      return;
    }
    setShowColMenu(true); // show options menu
    setAnchorEl(e.currentTarget); // anchor menu below button
  };

  // const menuClickHandler = () => {
  //   if (editArea) {
  //     setEditArea(false);
  //   } else {
  //     setShowColMenu(!showColMenu);
  //   }
  // };

  const menuCloseHandler = () => {
    setAnchorEl(null);
    setShowColMenu(false);
  };

  const closeColMenuHandler = () => {
    setShowColMenu(false);
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

  const loadColumnTitle = (draggableProps) => {
    if (editArea) {
      return (
        <TextField
          className='column__title--form'
          value={columnName}
          onChange={updateColumnTitleHandler}
          // onBlur={() => setEditArea(false)}
          onKeyDown={handleKeyDown}
          sx={{
            alignContent: `center`
          }}
          variant="outlined"
          required
        />
      )
    }

    return (
      <h6 {...draggableProps}>
        <div>
          <GrDrag className="column__drag-icon"/> {columnName}
        </div>
      </h6>
    );
  };

  // <Menu
  //   // menuButton={({open}) => (
  //     <ButtonUI
  //       variant={"contained"}
  //       // onClick={colMenuHandler}
  //       // onClick={colMenuHandler}
  //     >
  //       {showEditBox ? "Open Options" : "Close"}
  //     </ButtonUI>
  //   // )}
  // >

  const columnHeader = (dragHandleProps) => {
    return (<>
      <h2 className="column__title">{loadColumnTitle(dragHandleProps)}</h2>
      <div className="column__menu">
        <ButtonUI
          variant={"contained"}
          // onClick={() => setShowColMenu(!editArea)}
          value={editArea ? `Cancel` : `Option`}
          onClick={menuClickHandler}
        >
          {editArea ? `Cancel` : `Option`}
        </ButtonUI>
        <Menu
          className={'column__options-menu'}
          // anchorEl={showColMenu}
          anchorEl={anchorEl}
          // open={showColMenu}
          open={Boolean(anchorEl)}
          // onClose={closeColMenuHandler}
          onClose={menuCloseHandler}
        >
          <MenuList>
            <MenuItem
              // onClick={() => setEditArea(!editArea)}
              onClick={openColEditHandler}
            >
              <FaRegEdit />
              <ListItemText inset>Edit</ListItemText>
            </MenuItem>
            {/* <MenuItem>
              <ListItemText inset>1.15</ListItemText>
            </MenuItem>
            <MenuItem>
              <ListItemText inset>Double</ListItemText>
            </MenuItem>
            <MenuItem>
              <ListItemIcon>
                <Check />
              </ListItemIcon>
              Custom: 1.2
            </MenuItem> */}
            <Divider />
            <MenuItem onClick={() => deleteColumnHandler()}>
              <AiOutlineDelete />
              <ListItemText inset>Delete</ListItemText>
            </MenuItem>
            {/* edit for more options in the future */}
            {/* <MenuItem>
              <ListItemText>Add space after paragraph</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem>
              <ListItemText>Custom spacing...</ListItemText>
            </MenuItem> */}
          </MenuList>
        </Menu>
      </div>
    </>);
  };

  const cardContent = () => {
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
        subheader={<Typography className="card__sub-header" sx={{ fontSize: '0.7rem' }} component='div'>September 14, 2016</Typography>}
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
          component='div'
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
          <Typography
            // paragraph
            component='div'
          >
            Method:
          </Typography>
          <Typography
            // paragraph
            component='div'
          >
            Heat 1/2 cup of the broth in a pot until simmering, add saffron and set
            aside for 10 minutes.
          </Typography>
          <Typography
            // paragraph
            component='div'
          >
            Heat oil in a (14- to 16-inch) paella pan or a large, deep skillet over
            medium-high heat. Add chicken, shrimp and chorizo, and cook, stirring
            occasionally until lightly browned, 6 to 8 minutes. Transfer shrimp to a
            large plate and set aside, leaving chicken and chorizo in the pan. Add
            pimentón, bay leaves, garlic, tomatoes, onion, salt and pepper, and cook,
            stirring often until thickened and fragrant, about 10 minutes. Add
            saffron broth and remaining 4 1/2 cups chicken broth; bring to a boil.
          </Typography>
          <Typography
            // paragraph
            component='div'
          >
            Add rice and stir very gently to distribute. Top with artichokes and
            peppers, and cook without stirring, until most of the liquid is absorbed,
            15 to 18 minutes. Reduce heat to medium-low, add reserved shrimp and
            mussels, tucking them down into the rice, and cook again without
            stirring, until mussels have opened and rice is just tender, 5 to 7
            minutes more. (Discard any mussels that don&apos;t open.)
          </Typography>
          <Typography component='div'>
            Set aside off of the heat to let rest for 10 minutes, and then serve.
          </Typography>
        </CardContent>
      </Collapse>
    </>);
  };

  return (
    <Draggable draggableId={column.id} index={index} key={column.id}>
      {(provided) => (
        <div className="column__container"
          // bg={column.columnName === 'addName' ? '' : '#F6F6F6'}
        >
          <div
            className="column__header"
            {...provided.draggableProps}
            ref={provided.innerRef}
          >
            {/* <h3>Subject Header for lane goes here</h3> */}
            <div className="column__header-menu">
              {/* {columnHeader(provided.dragHandleProps)} */}
              {columnHeader()}
            </div>
          </div>
          <div
            className="column__lane-content"
          >
            <Droppable
              droppableId={column.id}
              type="card"
            >
              {(providedDroppable) => (
                <div
                  className="column__lane-scroll"
                  ref={providedDroppable.innerRef}
                  {...providedDroppable.droppableProps}
                >
                  <Cards
                    key={index}
                    className="card"
                    variant=''
                    raised='true'
                    cards={sortedCards}
                    showCardDetail={showCardDetail}
                  >
                    {/* {cardContent()} */}
                  </Cards>
                  {providedDroppable.placeholder}
                </div>
              )}
            </Droppable>
            <CardActions>
              <ButtonUI
                size="small"
                my="10px"
                mx="auto"
                width="80%"
                color="black"
                variant="ghost"
                disabled={cardRequest}
                isLoading={cardRequest}
                display="flex"
                loadingText="Adding card"
                onClick={addCardHandler}
              >
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









  // return (
  //   <article className="card__column-container">
  //     <h2>Column Title</h2>
  //     <p>Sub-Title</p>
  //     <hr />
  //     <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat illum eaque, deleniti sequi asperiores similique laudantium, possimus molestiae laborum voluptatibus nam animi vel aliquid nihil et quibusdam vitae a totam.</p>
  //   </article>
  // )

  // TODO: the current cartui element is a placeholder
  // const [expanded, setExpanded] = useState(false);

  // const handleExpandClick = () => {
  //   setExpanded(!expanded);
  // };

  // const ExpandMore = styled((props) => {
  //   const { expand, ...other } = props;
  //   return <IconButton {...other} />;
  // })(({ theme, expand }) => ({
  //   transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  //   marginLeft: 'auto',
  //   transition: theme.transitions.create('transform', {
  //     duration: theme.transitions.duration.shortest,
  //   }),
  // }));


































  // const cardContent = () => {
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
  //       className="card__header"
  //       // style={{ color: "var(--body-text)" }}
  //       // avatar={
  //       //   <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
  //       //     R
  //       //   </Avatar>
  //       // }
  //       action={
  //         <IconButton
  //           aria-label="settings"
  //           sx={{ color: `var(--body-text)` }}
  //           onClick={() => isModalOpen(true)}
  //         >
  //           <HiDotsVertical />
  //         </IconButton>
  //       }
  //       title="Shrimp and Chorizo Paella"
  //       titleTypographyProps={{variant: 'h6'}}
  //       subheader={<Typography className="card__sub-header" sx={{ fontSize: '0.7rem' }} component='div'>September 14, 2016</Typography>}
  //     />
  //     <CardMedia
  //       component="img"
  //       // height="194"
  //       image="/static/images/cards/paella.jpg"
  //       alt="Paella dish"
  //     />
  //     <CardContent
  //       className="card__content"
  //     >
  //       <Typography
  //         variant="body2"
  //         component='div'
  //         // color="text.secondary"
  //       >
  //         This impressive paella is a perfect party dish and a fun meal to cook
  //         together with your guests. Add 1 cup of frozen peas along with the mussels,
  //         if you like.
  //       </Typography>
  //     </CardContent>
  //     <CardActions disableSpacing>
  //       <IconButton aria-label="add to favorites" sx={{ color: `var(--body-text)` }}>
  //         <FaRegHeart classname="card__icon"/>
  //       </IconButton>
  //       <IconButton aria-label="share" sx={{ color: `var(--body-text)` }}>
  //         <FaShare/>
  //       </IconButton>
  //       <ExpandMore
  //         expand={expanded}
  //         onClick={handleExpandClick}
  //         aria-expanded={expanded}
  //         aria-label="show more"
  //         sx={{ color: `var(--body-text)` }}
  //       >
  //         <FaChevronCircleDown/>
  //       </ExpandMore>
  //     </CardActions>
  //     <Collapse in={expanded} timeout="auto" unmountOnExit>
  //       <CardContent>
  //         <Typography
  //           // paragraph
  //           component='div'
  //         >
  //           Method:
  //         </Typography>
  //         <Typography
  //           // paragraph
  //           component='div'
  //         >
  //           Heat 1/2 cup of the broth in a pot until simmering, add saffron and set
  //           aside for 10 minutes.
  //         </Typography>
  //         <Typography
  //           // paragraph
  //           component='div'
  //         >
  //           Heat oil in a (14- to 16-inch) paella pan or a large, deep skillet over
  //           medium-high heat. Add chicken, shrimp and chorizo, and cook, stirring
  //           occasionally until lightly browned, 6 to 8 minutes. Transfer shrimp to a
  //           large plate and set aside, leaving chicken and chorizo in the pan. Add
  //           pimentón, bay leaves, garlic, tomatoes, onion, salt and pepper, and cook,
  //           stirring often until thickened and fragrant, about 10 minutes. Add
  //           saffron broth and remaining 4 1/2 cups chicken broth; bring to a boil.
  //         </Typography>
  //         <Typography
  //           // paragraph
  //           component='div'
  //         >
  //           Add rice and stir very gently to distribute. Top with artichokes and
  //           peppers, and cook without stirring, until most of the liquid is absorbed,
  //           15 to 18 minutes. Reduce heat to medium-low, add reserved shrimp and
  //           mussels, tucking them down into the rice, and cook again without
  //           stirring, until mussels have opened and rice is just tender, 5 to 7
  //           minutes more. (Discard any mussels that don&apos;t open.)
  //         </Typography>
  //         <Typography component='div'>
  //           Set aside off of the heat to let rest for 10 minutes, and then serve.
  //         </Typography>
  //       </CardContent>
  //     </Collapse>
  //   </>);
  // };




































































//   const cardExampleContent = () => {
//     return (<>
//         {/* {card.label && (
//           <Badge bg={card.label.type} color="white">
//             {card.label.type}
//           </Badge>
//         )}
//         <p>{card.title}</p> */}
//         {/* {loadAssignedToUser()} */}
//       {/* {children || label || text} */}
//       <CardHeader
//         className="card__header"
//         // style={{ color: "var(--body-text)" }}
//         // avatar={
//         //   <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
//         //     R
//         //   </Avatar>
//         // }
//         action={
//           <IconButton
//             aria-label="settings"
//             sx={{ color: `var(--body-text)` }}
//             onClick={() => isModalOpen(true)}
//           >
//             <HiDotsVertical />
//           </IconButton>
//         }
//         title="Shrimp and Chorizo Paella"
//         titleTypographyProps={{variant: 'h6'}}
//         subheader={<Typography className="card__sub-header" sx={{ fontSize: '0.7rem' }} component='div'>September 14, 2016</Typography>}
//       />
//       <CardMedia
//         component="img"
//         // height="194"
//         image="/static/images/cards/paella.jpg"
//         alt="Paella dish"
//       />
//       <CardContent
//         className="card__content"
//       >
//         <Typography
//           variant="body2"
//           component='div'
//           // color="text.secondary"
//         >
//           This impressive paella is a perfect party dish and a fun meal to cook
//           together with your guests. Add 1 cup of frozen peas along with the mussels,
//           if you like.
//         </Typography>
//       </CardContent>
//       <CardActions disableSpacing>
//         <IconButton aria-label="add to favorites" sx={{ color: `var(--body-text)` }}>
//           <FaRegHeart classname="card__icon"/>
//         </IconButton>
//         <IconButton aria-label="share" sx={{ color: `var(--body-text)` }}>
//           <FaShare/>
//         </IconButton>
//         <ExpandMore
//           expand={expanded}
//           onClick={handleExpandClick}
//           aria-expanded={expanded}
//           aria-label="show more"
//           sx={{ color: `var(--body-text)` }}
//         >
//           <FaChevronCircleDown/>
//         </ExpandMore>
//       </CardActions>
//       <Collapse in={expanded} timeout="auto" unmountOnExit>
//         <CardContent>
//           <Typography
//             // paragraph
//             component='div'
//           >
//             Method:
//           </Typography>
//           <Typography
//             // paragraph
//             component='div'
//           >
//             Heat 1/2 cup of the broth in a pot until simmering, add saffron and set
//             aside for 10 minutes.
//           </Typography>
//           <Typography
//             // paragraph
//             component='div'
//           >
//             Heat oil in a (14- to 16-inch) paella pan or a large, deep skillet over
//             medium-high heat. Add chicken, shrimp and chorizo, and cook, stirring
//             occasionally until lightly browned, 6 to 8 minutes. Transfer shrimp to a
//             large plate and set aside, leaving chicken and chorizo in the pan. Add
//             pimentón, bay leaves, garlic, tomatoes, onion, salt and pepper, and cook,
//             stirring often until thickened and fragrant, about 10 minutes. Add
//             saffron broth and remaining 4 1/2 cups chicken broth; bring to a boil.
//           </Typography>
//           <Typography
//             // paragraph
//             component='div'
//           >
//             Add rice and stir very gently to distribute. Top with artichokes and
//             peppers, and cook without stirring, until most of the liquid is absorbed,
//             15 to 18 minutes. Reduce heat to medium-low, add reserved shrimp and
//             mussels, tucking them down into the rice, and cook again without
//             stirring, until mussels have opened and rice is just tender, 5 to 7
//             minutes more. (Discard any mussels that don&apos;t open.)
//           </Typography>
//           <Typography component='div'>
//             Set aside off of the heat to let rest for 10 minutes, and then serve.
//           </Typography>
//         </CardContent>
//       </Collapse>
//     </>);
//   };

//   let index = '009';
//   return (
//     // <Draggable draggableId={column.id} index={index} key={column.id}>
//     <Draggable draggableId='123' index={index} key={'123'}>
//       {(provided) => (
//         <div className="board__lane"
//           // bg={column.columnName === 'addName' ? '' : '#F6F6F6'}
//         >
//           <div className="board__lane-header">
//             <h3>Subject Header for lane goes here</h3>
//           </div>
//           <div
//             className="board__lane-content"
            
//           >
//             <Droppable
//               droppableId='123'
//               // droppableId={Column.id}
//               type="card"
//             >
//               {(provided) => (
//                 <div
//                   className="board__lane-scroll"
//                   ref={provided.innerRef}
//                   {...provided.droppableProps}
//                 >
//                   <Cards
//                     key={index}
//                     className="card"
//                     variant=''
//                     raised='true'
//                     // cards={cards}
//                     // showCardDetail={showCardDetail}
//                   >
//                     {cardExampleContent()}
//                   </Cards>
//                   {/* <Cards
//                     // showCardDetail={showCardDetail}
//                     // cards={sortedCards}
//                   // /> */}
//                   {provided.placeholder}
//                 </div>
//               )}
//             </Droppable>
//             <CardActions>
//               <ButtonUI
//                 size="small"
//                 onClick={addCardHandler}
//               >
//                 <FaPlus/> Add New Card
//               </ButtonUI>
//             </CardActions>
//           </div>
//         </div>
//       )}
//     </Draggable>
//   )
// };

{/* <CardUI
  // className="card__column-container"
  raised='true'
>
  <h2>Column Title</h2>
  <p>Sub-Title</p>
  <hr />
  <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat illum eaque, deleniti sequi asperiores similique laudantium, possimus molestiae laborum voluptatibus nam animi vel aliquid nihil et quibusdam vitae a totam.</p>
</CardUI> */}