import { useId } from 'react';
import Link from 'next/link';
import { Grid, Typography, Demo, Divider, List, ListItem, ListItemIcon, ListItemText, ListItemAvatar, Card } from "@mui/material";
import { FaComment } from 'react-icons/fa';

const CommentsList = ({comments}) => {
  const id = useId();
  const ListItemDetail = ({comment}) => {
    return (<>
      <Typography
        className='dash__list-details'
        sx={{ display: 'inline', fontSize: '0.775rem' }}
        variant="h6"
        component="span"
      >
        Fullname Lastname
        {/* <Link
          passHref
          href={`/tickets/${comment.user_id}`}
        >
          {comment.f_name}{" "}{comment.l_name}
        </Link> */}
      </Typography>
        {/* <span className="detail-label">
         [ username ]
        </span>
        <span className="">
          {comment.username}
        </span> */}
        {/* <span className="">{comment.created_at}</span> */}
        {/* <span>{comment.updated_at}</span> */}
        {/* <Link
          passHref
          href={`/tickets/${comment.ticket_id}`}
        >
          {comment.description}
        </Link> */}
    </>)
  };

  return (
    <Grid item xs={12} md={6}>
      <List
        dense={true}
        // sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
      >
        {comments.map((comment, index) => (
          <Card key={comment.id}>
          <Link
            passHref
            href={`/tickets/${comment.ticket_id}`}
          >
            <div>{comment.ticket_id}</div>
          </Link>
          <ListItem
            // alignItems='flex-start'
            >
            <ListItemIcon>
              <FaComment />
            </ListItemIcon>
            <ListItemText
              primary={comment.id}
              secondary={<ListItemDetail comment={comment}/>}
            />
          </ListItem>
          <div>
            {comment.description}
          </div>
          <Divider variant='inset' component="li"/>
        </Card>))}
      </List>
    </Grid>
  )
};
export default CommentsList;