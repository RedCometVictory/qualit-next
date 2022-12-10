import Link from 'next/link';
import { Grid, Typography, Demo, Divider, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { ImTicket } from 'react-icons/im';

const MyTicketsList = ({tickets}) => {

  const ListItemDetail = ({ticket}) => {
    return (
      <div className='dash__list-details'>
        <Typography
          sx={{ display: 'inline', fontSize: '0.775rem' }}
          variant="h6"
          component="span"
        >
          <Link
            passHref
            href={`/tickets/${ticket.id}`}
          >
            {ticket.id}
          </Link>
        </Typography>
        <span className="detail-label">
         [ status | priority | type ]
        </span>
        <span className="">
          {ticket.status} | {ticket.priority} | {ticket.type}
        </span>
        <span className="">{ticket.created_at}</span>
      </div>
    )
  };

  return (
    <Grid item xs={12} md={6}>
      <List dense={true} >
        {tickets.map((ticket, index) => (<>
          <ListItem
            key={index}
            // alignItems='flex-start'
          >
            <ListItemIcon>
              <ImTicket />
            </ListItemIcon>
            <ListItemText
              primary={
                <Link
                  passHref
                  href={`/tickets/${ticket.id}`}
                >
                  {ticket.title}
                </Link>
              }
              secondary={<ListItemDetail ticket={ticket}/>}
            >
            </ListItemText>
          </ListItem>
          <Divider variant='inset' component="li"/>
        </>))}
      </List>
    </Grid>
  );
};
export default MyTicketsList;