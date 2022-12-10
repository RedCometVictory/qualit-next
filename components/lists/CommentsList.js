import Link from 'next/link';
import { Grid, Typography, Demo, Divider, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { FaComment } from 'react-icons/fa';

const CommentsList = ({comments}) => {

  const ListItemDetail = ({comment}) => {
    return (
      <div className='dash__list-details'>
        <Typography
          sx={{ display: 'inline', fontSize: '0.775rem' }}
          variant="h6"
          component="span"
        >
          <Link
            passHref
            href={`/tickets/${comment.user_id}`}
          >
            {comment.f_name}{" "}{comment.l_name}
          </Link>
        </Typography>
        <span className="detail-label">
         [ username ]
        </span>
        <span className="">
          {comment.username}
        </span>
        <span className="">{comment.created_at}</span>
        <span>{comment.updated_at}</span>
      </div>
    )
  };

  return (
    <Grid item xs={12} md={6}>
      <List dense={true} >
        {comments.map((comment, index) => (<>
          <ListItem
            key={index}
            // alignItems='flex-start'
          >
            <ListItemIcon>
              <FaComment />
            </ListItemIcon>
            <ListItemText
              primary={
                <Link
                  passHref
                  // href={`/tickets/${ticket.id}`}
                >
                  {comment.title}
                </Link>
              }
              secondary={<ListItemDetail comment={comment}/>}
            >
            </ListItemText>
          </ListItem>
          <Divider variant='inset' component="li"/>
        </>))}
      </List>
    </Grid>
  )
};
export default CommentsList;