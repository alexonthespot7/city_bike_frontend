import { Button, Divider, Drawer, IconButton, List, ListItem, ListItemIcon, ListItemText, Snackbar, Toolbar, Typography } from '@mui/material';
import MuiAppBar from '@mui/material/AppBar';
import MuiAlert from '@mui/material/Alert';

import styled from '@emotion/styled';

import { forwardRef, useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import PublishIcon from '@mui/icons-material/Publish';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import TourIcon from '@mui/icons-material/Tour';
import MenuIcon from '@mui/icons-material/Menu';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';

import Cookies from 'js-cookie';

import AppRoutes from './Routes/AppRoutes';
import AuthContext from './context/AuthContext';
import Login from './Components/Login';
import MyFooter from './Components/MyFooter';

import useMediaQuery from './Hooks/useMediaQuery';

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

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
const pages = ['Journeys', 'Stations'];
const additionalPages = ['Import Data'];

function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);

  const { isAlert, setIsAlert, alertType, setAlertType, alertMsg, setAlertMsg } = useContext(AuthContext);

  const matchesM0 = useMediaQuery("(min-width: 650px)");
  const matchesM = useMediaQuery("(min-width: 500px)");
  const matchesS = useMediaQuery("(min-width: 400px)");

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  }

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  }

  const setLink = (value) => {
    if (value === 'Import Data') {
      return '/import';
    } else if (value === 'Journeys') {
      return '/';
    } else if (value === 'Stations') {
      return '/stations';
    }
  }

  const navigate = useNavigate();

  const logOff = () => {
    Cookies.remove('role');
    Cookies.remove('jwt');
    Cookies.remove('username');
    if ([Cookies.get('role'), Cookies.get('jwt'), Cookies.get('username')].every(value => value === undefined)) window.location.reload();
  }

  return (
    <div>
      <MuiAppBar position="fixed" color='thirdary'>
        <Toolbar style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', left: matchesS ? 25 : 10, display: 'flex', alignItems: 'center' }}>
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
          <Typography onClick={() => navigate("/")} style={{ cursor: 'pointer' }} variant={matchesM0 ? 'h5' : 'h6'} component="div">
            City Bike
          </Typography>
          <div style={{ position: 'absolute', right: matchesS ? 25 : 10 }}>
            {(Cookies.get('username') === undefined && matchesM) && <Button size='medium' onClick={() => setOpenLogin(true)} startIcon={<LoginIcon />} color="inherit">
              Login
            </Button>}
            {(Cookies.get('username') === undefined && !matchesM) &&
              <IconButton size='small' onClick={() => setOpenLogin(true)}>
                <LoginIcon color='sidish' />
              </IconButton>}
            {(Cookies.get('username') !== undefined) && <div style={{ display: 'flex', gap: 10 }}>
              {matchesM && <Typography variant='h6'>{Cookies.get('username')}</Typography>}
              <IconButton size='small' onClick={logOff}>
                <LogoutIcon color='sidish' />
              </IconButton>
            </div>}
            <Login openLogin={openLogin} setOpenLogin={setOpenLogin} />
          </div>
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
                {index === 0 && <DirectionsBikeIcon color='fourth' />}
                {index === 1 && <TourIcon color='fourth' />}
              </ListItemIcon>
              <ListItemText color='fourth' primary={value} />
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {additionalPages.map((value, index) => (
            <ListItem button onClick={handleDrawerClose} component={Link} to={setLink(value)} >
              <ListItemIcon>
                {index === 0 && <PublishIcon color='fourth' />}
              </ListItemIcon>
              <ListItemText primary={value} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Main style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#D7DEDC' }} >
        <DrawerHeader />
        <AppRoutes />
        <MyFooter />
        <Snackbar open={isAlert} autoHideDuration={3000} onClose={() => setIsAlert(false)}>
          <Alert onClose={() => setIsAlert(false)} severity={alertType} sx={{ width: '100%' }}>
            {alertMsg}
          </Alert>
        </Snackbar>
      </Main>
    </div>
  );
}

export default App;
