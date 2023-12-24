/* eslint-disable react/prop-types */
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { Link } from 'react-router-dom';

import HomeIcon from '@mui/icons-material/Home';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

export default function TopAppBar({darkMode, handleThemeChange, signedIn, setSignedIn}) {

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
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
        </Toolbar>
      </AppBar>
    </Box>
  );
}