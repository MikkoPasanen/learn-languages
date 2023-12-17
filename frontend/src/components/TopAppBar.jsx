/* eslint-disable react/prop-types */
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { Link } from 'react-router-dom';

import HomeIcon from '@mui/icons-material/Home';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

export default function TopAppBar({darkMode, handleThemeChange}) {

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
          <Box>
            <Button
              color="inherit"
              sx={{ mr: 1 }}
            >
              Login
            </Button>
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