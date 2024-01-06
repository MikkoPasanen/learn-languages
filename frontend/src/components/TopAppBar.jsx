/* eslint-disable react/prop-types */
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { Drawer, List, ListItemButton, ListItemText, ListItem,
         Divider, Accordion, AccordionSummary, AccordionDetails,
        Checkbox, Chip, Badge } from '@mui/material';

import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

import AddIcon from '@mui/icons-material/Add';
import HomeIcon from '@mui/icons-material/Home';
import MenuIcon from '@mui/icons-material/Menu';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TuneIcon from '@mui/icons-material/Tune';

export default function TopAppBar({darkMode, handleThemeChange,
                                  signedIn, setSignedIn,
                                  setOpenAddExercise, categories, languages,
                                  exercises, setMobileFilteredExercises,}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filterCount, setFilterCount] = useState(0);
  const [filterCategories, setFilterCategories] = useState([]);
  const [filterLanguages, setFilterLanguages] = useState([]);

  // Store the number of exercises in each category
  const categoryCounts = categories.map((category) => {
    const count = exercises.filter((exercise) => exercise.category === category).length;
    return { category, count };
  });

  // Store the number of exercises in each language
  const languageCounts = languages.map((language) => {
    const count = exercises.filter((exercise) => exercise.language === language).length;
    return { language, count };
  });

  // Filter the exercises based on the selected categories
    const categoryChange = (e) => {
      if (e.target.checked) {
        setFilterCategories([...filterCategories, e.target.name]);
      } else {
        setFilterCategories(filterCategories.filter((category) => category !== e.target.name));
      }
    };

    // Filter the exercises based on the selected languages
    const languageChange = (e) => {
      if (e.target.checked) {
        setFilterLanguages([...filterLanguages, e.target.name]);
      } else {
        setFilterLanguages(filterLanguages.filter((language) => language !== e.target.name));
      }
    };

    useEffect(() => {
      // Filter the exercises based on the selected categories and languages
      const filteredExercises = exercises.filter(
        (exercise) =>
          (filterCategories.length === 0 ||
            filterCategories.includes(exercise.category)) &&
          (filterLanguages.length === 0 ||
            filterLanguages.includes(exercise.language)),
      );

      setMobileFilteredExercises(filteredExercises);
    }, [exercises, setMobileFilteredExercises, filterCategories, filterLanguages]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar
          sx={{
            zIndex: (theme) => theme.zIndex.drawer + 1,
            display: { xs: 'none', md: 'block' },
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
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
        variant="temporary"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          '& .MuiDrawer-paper': { width: '50vw' },
          display: { xs: 'block', md: 'none' },
        }}
      >
        <List
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            justifyContent: 'space-between',
          }}
        >
          <Box>
            <ListItemButton onClick={() => setDrawerOpen(false)}>
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
            <Divider />
            {signedIn && (
              <ListItemButton
                onClick={() => {
                  setOpenAddExercise(true), setDrawerOpen(false);
                }}
              >
                <AddIcon sx={{ pr: 1, fontSize: '2rem' }} />
                <ListItemText primary="Add exercise" />
              </ListItemButton>
            )}
            <Divider />
            <ListItem sx={{ mt: 2 }}>
              <Badge
                badgeContent={filterCount}
                color="primary"
              >
                <TuneIcon sx={{ fontSize: '2rem' }} />
              </Badge>
              <ListItemText
                primary="Filters"
                sx={{ pl: 1 }}
              />
            </ListItem>
            <ListItem
              disablePadding
              sx={{ mt: 1 }}
            >
              <Accordion sx={{ backgroundColor: 'inherit', width: '100%' }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Categories</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    {categories.map((category) => (
                      <Box
                        key={category}
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <Box>
                          <Checkbox
                            name={category}
                            onChange={(e) => {
                              setFilterCount(
                                e.target.checked
                                  ? filterCount + 1
                                  : filterCount - 1,
                              ),
                              categoryChange(e);
                            }}
                          />
                          {category}
                        </Box>
                        <Chip
                          label={
                            categoryCounts.find((c) => c.category === category)
                              .count
                          }
                        />
                      </Box>
                    ))}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </ListItem>
            <ListItem disablePadding>
              <Accordion sx={{ backgroundColor: 'inherit', width: '100%' }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Languages</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    {languages.map((language) => (
                      <Box
                        key={language}
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <Box>
                          <Checkbox
                            name={language}
                            onChange={(e) => {
                              setFilterCount(
                                e.target.checked
                                  ? filterCount + 1
                                  : filterCount - 1,
                              ),
                              languageChange(e);
                            }}
                          />
                          {language}
                        </Box>
                        <Chip
                          label={
                            languageCounts.find((l) => l.language === language)
                              .count
                          }
                        />
                      </Box>
                    ))}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </ListItem>
          </Box>

          <Box sx={{ mb: 2 }}>
            <ListItemButton onClick={handleThemeChange}>
              {darkMode ? (
                <LightModeIcon sx={{ pr: 1, fontSize: '2rem' }} />
              ) : (
                <DarkModeIcon sx={{ pr: 1, fontSize: '2rem' }} />
              )}
              <ListItemText primary="Toggle Theme" />
            </ListItemButton>
            <Divider />
            {!signedIn && (
              <ListItemButton onClick={() => setDrawerOpen(false)}>
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
              <ListItemButton
                onClick={() => {
                  localStorage.removeItem('token');
                  sessionStorage.removeItem('token');
                  setDrawerOpen(false);
                  setSignedIn(false);
                }}
              >
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