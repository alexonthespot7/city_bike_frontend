import { Divider, Drawer, IconButton, List, ListItem, ListItemIcon, ListItemText, Toolbar, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import PublishIcon from '@mui/icons-material/Publish';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import MenuIcon from '@mui/icons-material/Menu';

import MuiAppBar from '@mui/material/AppBar';

import AppRoutes from './Routes/AppRoutes';
import styled from '@emotion/styled';

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    marginLeft: 0,
  }),
);

const drawerWidth = 240;
const pages = ['Import'];
const adminPages = [];

function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  }

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  }

  const setLink = (value) => {
    if (value === 'Import') {
      return '/';
    }
  }
  const navigate = useNavigate();

  return (
    <div>
      <MuiAppBar position="fixed" color='thirdary'>
        <Toolbar style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', left: 25, display: 'flex', alignItems: 'center' }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{ mr: 2, ...(drawerOpen && { display: 'none' }) }}
            >
              <MenuIcon />
            </IconButton>
          </div>
          <Typography onClick={() => navigate("/")} style={{ cursor: 'pointer' }} variant='h5' component="div">
            Home
          </Typography>
        </Toolbar>
      </MuiAppBar>
      <Drawer
        transitionDuration={500}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerClose}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {<ChevronLeftIcon color='fourth' />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {pages.map((value, index) => (
            <ListItem button onClick={handleDrawerClose} component={Link} to={setLink(value)} >
              <ListItemIcon>
                {index === 0 && <PublishIcon color='fourth' />}
              </ListItemIcon>
              <ListItemText color='fourth' primary={value} />
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {adminPages.map((value, index) => (
            <ListItem button onClick={handleDrawerClose} component={Link} to={setLink(value)} >
              <ListItemIcon>
              </ListItemIcon>
              <ListItemText primary={value} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Main style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#D7DEDC' }} >
        <DrawerHeader />
        <AppRoutes />
      </Main>
    </div>
  );
}

export default App;
