/* eslint-disable react/prop-types */

/**
 * @fileoverview Top app bar component. This component is displayed at the top of the page.
 * @component
 * @requires NPM:react-router-dom
 * @requires NPM:@mui/material
 * @requires NPM:@mui/icons-material
 * @requires NPM:react
 */
import { Drawer, List, ListItemButton, ListItemText, ListItem,
         Divider, Accordion, AccordionSummary, AccordionDetails,
         Checkbox, Chip, Badge, Avatar, IconButton, Typography, Box,
         Toolbar, AppBar, Menu, MenuItem} from '@mui/material';

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

/**
 * Top app bar component - displayed at the top of the page
 * @description Contains the navigation links and the filters
 * and displays the user's profile picture.
 * @param {Object} props Component props
 * @param {boolean} props.darkMode Whether the dark mode is enabled
 * @param {function} props.handleThemeChange Function to handle the theme change
 * @param {boolean} props.signedIn Whether the user is signed in
 * @param {function} props.setSignedIn Function to set the signed in state
 * @param {function} props.setOpenAddExercise Function to set the open add exercise dialog state
 * @param {string[]} props.categories Array of categories
 * @param {string[]} props.languages Array of languages
 * @param {string[]} props.madeBy Array of creators of the exercises
 * @param {Object[]} props.exercises Array of exercises
 * @param {function} props.setMobileFilteredExercises Function to set the filtered exercises
 * @returns {JSX.Element} Top app bar component
*/
export default function TopAppBar({darkMode, handleThemeChange,
                                  signedIn, setSignedIn,
                                  setOpenAddExercise, categories, languages,
                                  madeBy, exercises, setMobileFilteredExercises,}) {

  // State for the drawer on mobile
  const [drawerOpen, setDrawerOpen] = useState(false);
  // State for the number of filters
  const [filterCount, setFilterCount] = useState(0);

  // State for the filters
  const [filterCategories, setFilterCategories] = useState([]);
  const [filterLanguages, setFilterLanguages] = useState([]);
  const [filterMadeBy, setFilterMadeBy] = useState([]);
  const [filterStatuses, setFilterStatuses] = useState([]);

  // State for the profile menu
  const [anchorEl, setAnchorEl] = useState(null);

  /**
   * Handle the profile menu
   * @param {Object} e Event object which triggered the function
   */
  const handleProfileClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  /**
   * Handle the profile menu close
   * @param {Object} e Event object which triggered the function
   */
  const handleProfileClose = () => {
    setAnchorEl(null);
  };

  /**
   * Handle the sign out process
   */
  const handleSignOut = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    localStorage.removeItem('username');
    sessionStorage.removeItem('username');
    setSignedIn(false);
    setAnchorEl(null);
  };

  /**
   * Store the number of exercises in each category
   * @type {Object[]}
   * @property {string} category Category name
   * @property {number} count Number of exercises in the category
   */
  const categoryCounts = categories.map((category) => {
    const count = exercises.filter((exercise) => exercise.category === category).length;
    return { category, count };
  });

  /**
   * Store the number of exercises in each language
   * @type {Object[]}
   * @property {string} language Language name
   * @property {number} count Number of exercises in the language
   */
  const languageCounts = languages.map((language) => {
    const count = exercises.filter((exercise) => exercise.language === language).length;
    return { language, count };
  });

  /**
   * Store the number of exercises made by each user
   * @type {Object[]}
   * @property {string} user User name
   * @property {number} count Number of exercises made by the user
   */
  const madeByCounts = madeBy.map((user) => {
    const count = exercises.filter((exercise) => exercise.made_by === user).length;
    return { user, count };
  });

 /**
  * Filter the exercises based on the selected categories
  * @param {Object} e Event object which triggered the function
  * @param {string} e.target.name Category name
  * @param {boolean} e.target.checked Whether the category is checked
  */
  const categoryChange = (e) => {
    if (e.target.checked) {
      setFilterCategories([...filterCategories, e.target.name]);
    } else {
      setFilterCategories(filterCategories.filter((category) => category !== e.target.name));
    }
  };

  /**
   * Filter the exercises based on the selected languages
   * @param {Object} e Event object which triggered the function
   * @param {string} e.target.name Language name
   * @param {boolean} e.target.checked Whether the language is checked
  */
  const languageChange = (e) => {
    if (e.target.checked) {
      setFilterLanguages([...filterLanguages, e.target.name]);
    } else {
      setFilterLanguages(filterLanguages.filter((language) => language !== e.target.name));
    }
  };

  /**
   * Filter the exercises based on the selected statuses
   * @param {Object} e Event object which triggered the function
   * @param {string} e.target.name Status name
   * @param {boolean} e.target.checked Whether the status is checked
   */
  const statusChange = (e) => {
    const { name, checked } = e.target;
    if (checked) {
      setFilterStatuses((prev) => [...prev, name]);
    } else {
      setFilterStatuses((prev) => prev.filter((status) => status !== name));
    }
  };

  /**
   * Filter the exercises based on the selected creators
   * @param {Object} e Event object which triggered the function
   * @param {string} e.target.name Creator name
   * @param {boolean} e.target.checked Whether the creator is checked
   */
  const madeByChange = (e) => {
    if (e.target.checked) {
      setFilterMadeBy([...filterMadeBy, e.target.name]);
    } else {
      setFilterMadeBy(filterMadeBy.filter((madeBy) => madeBy !== e.target.name));
    }
  };

  /**
   * When component mounts, set the exercises based on the selected filters
   */
  useEffect(() => {
    // Filter the exercises based on the selected filters
    const filteredExercises = exercises.filter((exercise) => {
      const score = localStorage.getItem(`${exercise.id}-userScore`);
      const totalScore = localStorage.getItem(`${exercise.id}-totalScore`);
      // Calculate the status of the exercise based on the score
      const status =
        score === null
          ? 'Not started'
          : score === totalScore
            ? 'Completed'
            : 'In progress';

      // Check if there are no filters or if the exercise matches the filters
      return (
        (filterCategories.length === 0 ||
          filterCategories.includes(exercise.category)) &&
        (filterLanguages.length === 0 ||
          filterLanguages.includes(exercise.language)) &&
        (filterStatuses.length === 0 || filterStatuses.includes(status)) &&
        (filterMadeBy.length === 0 || filterMadeBy.includes(exercise.made_by))
      );
    });
    setMobileFilteredExercises(filteredExercises);
  }, [exercises, setMobileFilteredExercises, filterCategories, filterLanguages, filterStatuses, filterMadeBy]);

  /**
   * Render the component
   * Different components are rendered based on the screen size
   * @returns {JSX.Element} Top app bar component
   */
  return (
    <Box>
      <AppBar position="fixed">
        <Toolbar
          sx={{
            zIndex: (theme) => theme.zIndex.drawer + 1,
            display: { xs: 'none', md: 'block' },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
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
              <>
                <IconButton
                  size="small"
                  edge="start"
                  color="inherit"
                  onClick={(e) => {
                    handleProfileClick(e);
                  }}
                >
                  <Avatar>
                    {(localStorage.getItem('username') ||
                      sessionStorage.getItem('username') ||
                      '')[0].toUpperCase()}
                  </Avatar>
                </IconButton>
              </>
            )}
          </Box>
        </Toolbar>
        <Toolbar
          sx={{
            zIndex: (theme) => theme.zIndex.drawer + -1,
            display: { xs: 'block', md: 'none' },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
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
            {signedIn && (
              <>
                <IconButton
                  size="small"
                  edge="start"
                  color="inherit"
                  onClick={(e) => {
                    handleProfileClick(e);
                  }}
                >
                  <Avatar>
                    {(localStorage.getItem('username') ||
                      sessionStorage.getItem('username') ||
                      '')[0].toUpperCase()}
                  </Avatar>
                </IconButton>
              </>
            )}
          </Box>
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
            <ListItem disablePadding>
              <Accordion sx={{ backgroundColor: 'inherit', width: '100%' }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Status</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {['Completed', 'In progress', 'Not started'].map((status) => {
                    const count = exercises.filter((exercise) => {
                      const score = localStorage.getItem(
                        `${exercise.id}-userScore`,
                      );
                      const totalScore = localStorage.getItem(
                        `${exercise.id}-totalScore`,
                      );
                      const exerciseStatus =
                        score === null
                          ? 'Not started'
                          : score === totalScore
                            ? 'Completed'
                            : 'In progress';
                      return exerciseStatus === status;
                    }).length;

                    return (
                      <Box
                        key={status}
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <Box>
                          <Checkbox
                            name={status}
                            onChange={(e) => {
                                setFilterCount(
                                  e.target.checked
                                    ? filterCount + 1
                                    : filterCount - 1,
                                ),
                                  statusChange(e);
                            }}
                          />
                          {status}
                        </Box>
                        <Chip label={count} />
                      </Box>
                    );
                  })}
                </AccordionDetails>
              </Accordion>
            </ListItem>
            <ListItem disablePadding>
              <Accordion sx={{ backgroundColor: 'inherit', width: '100%' }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Made by</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {madeBy.map((madeBy) => (
                    <Box
                      key={madeBy}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Box>
                        <Checkbox
                          name={madeBy}
                          onChange={(e) => {
                            setFilterCount(
                              e.target.checked
                                ? filterCount + 1
                                : filterCount - 1,
                            ),
                              madeByChange(e);
                          }}
                        />
                        {madeBy}
                      </Box>
                      <Chip
                        label={
                          madeByCounts.find((m) => m.user === madeBy).count
                        }
                      />
                    </Box>
                  ))}
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
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileClose}
      >
        <MenuItem>
          <Typography variant="body2">
            Signed in as{' '}
            <strong>
              {localStorage.getItem('username') ||
                sessionStorage.getItem('username')}
            </strong>
          </Typography>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleSignOut}>
          <IconButton sx={{ p: 0 }}>
            <LogoutIcon sx={{ pr: 1, fontSize: '1.9rem', color: '#d7094f' }} />
            <Typography sx={{ color: '#d7094f', fontWeight: 'bold' }}>
              Sign Out
            </Typography>
          </IconButton>
        </MenuItem>
      </Menu>
    </Box>
  );
}