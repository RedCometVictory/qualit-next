import React, { useEffect, useRef, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ImImages } from 'react-icons/im';
import { FiInbox, FiMail } from 'react-icons/fi';
import { Box, Drawer, Divider, Input, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import Unsplash from './Unsplash';
import ButtonUI from './UI/ButtonUI';
import { unsplashTheme } from '../redux/features/theme/themeSlice';

const SideMenu = () => {
  const dispatch = useDispatch();
  const btnRef = useRef();
  const [hasMounted, setHasMounted] = useState(false);
  const expanded = useSelector(state => state.theme);
  const { drawer } = expanded;
  
  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  const toggleDrawer = (event, value) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    dispatch(unsplashTheme(value));
  };

  // <
  //   className="drawer"
  //   sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
  //   role="presentation"
  //   // onKeyDown={(e) => toggleDrawer(e, false)}
  // >
  const drawerList = (anchor) => (
    <>
      {/* <List>
        {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <FiInbox /> : <FiMail />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List> */}
      {/* <Divider /> */}
      <Unsplash toggleDrawer={toggleDrawer} />
    </>
  );

return (
  <Drawer
    anchor='right'
    open={drawer}
    onClose={(e) => toggleDrawer(e, false)}
    variant='temporary'
    // sx={{ height: '100vh' }}
    PaperProps={{ style: {height: "100%", overflowY: "hidden", maxHeight: "100%"}}}
    // className="drawer"
  >
    {/* <ButtonUI
      // ref={btnRef}
    >
      <ImImages />
    </ButtonUI> */}
    <div
      className="drawer"
    >
      {drawerList()}
    </div>
  </Drawer>
  )
};
export default SideMenu;

/*
<Box
      // sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
      role="presentation"
      onKeyDown={(e) => toggleDrawer(e, false)}
    >
      <List>
        {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <FiInbox /> : <FiMail />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />
      <List>
        {['All Mail', 'Trash', 'Spam'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <FiInbox /> : <FiMail />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Unsplash />
    </Box>
  );
*/