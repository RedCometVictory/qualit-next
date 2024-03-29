import Link from "next/link";
import { Grid, Typography, Divider, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { AiFillProject } from 'react-icons/ai';

const MyProjectsList = ({projects}) => {

  const ListItemDetail = ({project}) => {
    return (
      <div className='dash__list-details'>
        <Typography
          sx={{ display: 'inline', fontSize: '0.775rem' }}
          variant="h6"
          component="span"
          className="sub-header"
        >
          <Link
            passHref
            href={`/projects/${project.id}`}
          >
            {project.id}
          </Link>
        </Typography>
        <span className="detail-label">
          [ Owner ID: ]
        </span>
        <span className="">
          {project.owner}
        </span>
        <span className="">{project.created_at}</span>
      </div>
    )
  };

  return (<>
    <Grid item xs={12} md={6}>
      <List dense={true} >
        {projects.map((project, index) => (<>
          <ListItem
            className={`dash__list-item`}
            key={index}
            // alignItems='flex-start'
          >
            <ListItemIcon>
              <AiFillProject />
            </ListItemIcon>
            <ListItemText
              primary={
                <span className="header">
                  <Link
                    passHref
                    href={`/projects/${project.id}`}
                  >
                    {project.title}
                  </Link>
                </span>
              }
              secondary={<ListItemDetail project={project}/>}
            >
            </ListItemText>
          </ListItem>
          <Divider variant='inset' component="li"/>
        </>))}
      </List>
    </Grid>
  </>)
};
export default MyProjectsList;