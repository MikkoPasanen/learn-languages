/* eslint-disable react/prop-types */
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { Drawer, List, ListItemButton, ListItemText } from '@mui/material';

import { Link } from 'react-router-dom';
import { useState } from 'react';

import HomeIcon from '@mui/icons-material/Home';
import MenuIcon from '@mui/icons-material/Menu';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

export default function TopAppBar({darkMode, handleThemeChange, signedIn, setSignedIn}) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar
          sx={{
            zIndex: (theme) => theme.zIndex.drawer + 1,
            display: { xs: 'none', md: 'block' },
          }}
        >
          <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
            >
              <Link
                to="/"
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <HomeIcon sx={{ pr: 1, fontSize: '2rem' }} />
                <Typography
                  variant="h6"
                  component="div"
                >
                  Home
                </Typography>
              </Link>
            </IconButton>
            <Box sx={{ display: 'flex' }}>
              {!signedIn && (
                <Link
                  to="/signin"
                  style={{
                    textDecoration: 'none',
                    color: 'inherit',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                  >
                    <LoginIcon sx={{ pr: 1, fontSize: '2rem' }} />
                    <Typography
                      variant="h6"
                      component="div"
                    >
                      Sign In
                    </Typography>
                  </IconButton>
                </Link>
              )}
              {signedIn && (
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  onClick={() => {
                    localStorage.removeItem('token');
                    sessionStorage.removeItem('token');
                    setSignedIn(false);
                  }}
                >
                  <LogoutIcon sx={{ pr: 1, fontSize: '2rem' }} />
                  <Typography
                    variant="h6"
                    component="div"
                  >
                    Sign Out
                  </Typography>
                </IconButton>
              )}
              <IconButton
                size="large"
                edge="end"
                color="inherit"
                aria-label="menu"
                onClick={handleThemeChange}
              >
                {darkMode ? (
                  <LightModeIcon sx={{ fontSize: '2rem' }} />
                ) : (
                  <DarkModeIcon sx={{ fontSize: '2rem' }} />
                )}
              </IconButton>
            </Box>
          </Box>
        </Toolbar>
        <Toolbar
          sx={{
            zIndex: (theme) => theme.zIndex.drawer + -1,
            display: { xs: 'block', md: 'none' },
          }}
        >
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => setDrawerOpen(true)}
          >
            <MenuIcon sx={{ fontSize: '2.5rem' }} />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="left"
        variant='temporary'
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          '& .MuiDrawer-paper': { width: '30vw' },
        }}
      >
        <List sx={{display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between'}}>
          <ListItemButton sx={{flexGrow: 0}}>
            <Link
              to="/"
              style={{
                textDecoration: 'none',
                color: 'inherit',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <HomeIcon sx={{ pr: 1, fontSize: '2rem' }} />
              <ListItemText primary="Home" />
            </Link>
          </ListItemButton>
          <Box sx={{}}>
            <ListItemButton onClick={handleThemeChange}>
              {darkMode ? (
                <LightModeIcon sx={{ pr: 1, fontSize: '2rem' }} />
              ) : (
                <DarkModeIcon sx={{ pr: 1, fontSize: '2rem' }} />
              )}
              <ListItemText primary="Toggle Theme" />
            </ListItemButton>
            {!signedIn && (
              <ListItemButton>
                <Link
                  to="/signin"
                  style={{
                    textDecoration: 'none',
                    color: 'inherit',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <LoginIcon sx={{ pr: 1, fontSize: '2rem' }} />
                  <ListItemText primary="Sign In" />
                </Link>
              </ListItemButton>
            )}
            {signedIn && (
              <ListItemButton onClick={() => {
                localStorage.removeItem('token');
                sessionStorage.removeItem('token');
                setSignedIn(false);
              }}>
                <LogoutIcon sx={{ pr: 1, fontSize: '2rem' }} />
                <ListItemText primary="Sign Out" />
              </ListItemButton>
            )}
          </Box>
        </List>
      </Drawer>
    </Box>
  );
}