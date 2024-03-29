/* eslint-disable react/prop-types */
/**
 * @fileoverview Home page component - renders the home page
 * @component
 * @description This component renders the home page which contains the exercises and the filters
 * @requires npm:@mui/material
 * @requires npm:@mui/icons-material
 * @requires npm:@react-router-dom
 * @requires npm:react
 */
import { Box, Drawer, List, ListItemButton,
        ListItemText, ListItem, Divider,
        Accordion, AccordionSummary, AccordionDetails,
        Checkbox, Chip, Badge, Typography, Grid} from '@mui/material';

import ExerciseCard from '../components/ExerciseCard';
import AddExercise from '../components/AddExercise';

import { useState } from 'react';

import AddIcon from '@mui/icons-material/Add';
import TuneIcon from '@mui/icons-material/Tune';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

/**
 * Home component - renders the home page
 * @param {Object} props - Props object
 * @param {boolean} props.signedIn - Signed in status
 * @param {Function} props.openAddExercise - Function to open the add exercise dialog
 * @param {Function} props.setOpenAddExercise - Function to set the add exercise dialog state
 * @param {boolean} props.loading - Loading exercises status
 * @param {Array} props.exercises - Array of exercises
 * @param {Function} props.handleReload - Function to reload the exercises
 * @param {Array} props.categories - Array of unique categories
 * @param {Array} props.languages - Array of unique languages
 * @param {Array} props.madeBy - Array of unique creators
 * @param {Array} props.mobileFilteredExercises - Array of exercises filtered by mobile
 * @param {Function} props.handleThemeChange - Function to change the theme
 * @param {boolean} props.darkMode - Dark mode status
 * @returns {JSX.Element} Home component
 */
export default function Home({ signedIn, openAddExercise, setOpenAddExercise,
                                loading, exercises, handleReload, categories,
                                languages, madeBy, mobileFilteredExercises,
                                handleThemeChange, darkMode  }) {

    // State for the number of filters
    const [filterCount, setFilterCount] = useState(0);
    // State for the selected filter categories
    const [filterCategories, setFilterCategories] = useState([]);
    // State for the selected filter languages
    const [filterLanguages, setFilterLanguages] = useState([]);
    // State for the selected filter statuses
    const [filterStatuses, setFilterStatuses] = useState([]);
    // State for the selected filter creators
    const [filterMadeBy, setFilterMadeBy] = useState([]);
    // Array of numbers for the exercise skeletons
    const skeletons = [1, 2, 3];

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

    // Store the number of exercises made by each user
    const madeByCounts = madeBy.map((user) => {
      const count = exercises.filter((exercise) => exercise.made_by === user).length;
      return { user, count };
    });

    /**
     * Filter the exercises based on the selected categories
     * @param {Event} e - The event that triggered the function
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
     * @param {Event} e - The event that triggered the function
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
     * @param {Event} e - The event that triggered the function
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
     * @param {Event} e - The event that triggered the function
     */
    const madeByChange = (e) => {
      if (e.target.checked) {
        setFilterMadeBy([...filterMadeBy, e.target.name]);
      } else {
        setFilterMadeBy(filterMadeBy.filter((user) => user !== e.target.name));
      }
    };

    /**
     * Filter the exercises based on the selected filters
     * @param {Array} exercises - Array of exercises
     * @returns {Array} - Array of filtered exercises
     */
   const filteredExercises = exercises.filter((exercise) => {
     const score = localStorage.getItem(`${exercise.id}-userScore`);
     const totalScore = localStorage.getItem(`${exercise.id}-totalScore`);
     const status =
          score === null
         ? 'Not started'
         : score === totalScore
           ? 'Completed'
           : 'In progress';

      //Check if there are any filters selected and filter the exercises accordingly
     return (
       (filterCategories.length === 0 || filterCategories.includes(exercise.category)) &&
       (filterLanguages.length === 0 || filterLanguages.includes(exercise.language)) &&
       (filterStatuses.length === 0 || filterStatuses.includes(status)) &&
       (filterMadeBy.length === 0 || filterMadeBy.includes(exercise.made_by))
     );
   });

   /**
    * Renders the Home component.
    * This component renders the home page which contains the exercises and the filters, renders differently on mobile and desktop
    * @returns {JSX.Element} The rendered Home component.
    */
    return (
      <>
        <Drawer
          variant="permanent"
          sx={{
            [`& .MuiDrawer-paper`]: {
              width: '300px',
              boxSizing: 'border-box',
              mt: '64px',
            },
            display: { xs: 'none', md: 'block' },
          }}
        >
          <List
            sx={{
              display: 'flex',
              flexDirection: 'column',
              height: '91%',
              justifyContent: 'space-between',
            }}
          >
            <Box>
              {signedIn && (
                <>
                  <ListItemButton onClick={() => setOpenAddExercise(true)}>
                    <AddIcon sx={{ pr: 1, fontSize: '2.5rem' }} />
                    <ListItemText
                      primary="Add exercise"
                      primaryTypographyProps={{ style: { fontSize: '1.2rem' } }}
                    />
                  </ListItemButton>
                  <Divider />
                </>
              )}
              <ListItem sx={{ mt: 2 }}>
                <Badge
                  badgeContent={filterCount}
                  color="primary"
                >
                  <TuneIcon sx={{ fontSize: '2.2rem' }} />
                </Badge>
                <ListItemText
                  primary="Filters"
                  sx={{ pl: 1 }}
                  primaryTypographyProps={{ style: { fontSize: '1.2rem' } }}
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
                  </AccordionDetails>
                </Accordion>
              </ListItem>
              <ListItem disablePadding>
                <Accordion sx={{ backgroundColor: 'inherit', width: '100%' }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Languages</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
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
                  </AccordionDetails>
                </Accordion>
              </ListItem>
              <ListItem disablePadding>
                <Accordion sx={{ backgroundColor: 'inherit', width: '100%' }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Status</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {['Completed', 'In progress', 'Not started'].map(
                      (status) => {
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
                      },
                    )}
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

            <Box>
              <ListItemButton onClick={handleThemeChange}>
                {darkMode ? (
                  <LightModeIcon sx={{ pr: 1, fontSize: '2rem' }} />
                ) : (
                  <DarkModeIcon sx={{ pr: 1, fontSize: '2rem' }} />
                )}
                <ListItemText primary="Toggle Theme" />
              </ListItemButton>
            </Box>
          </List>
        </Drawer>
        <Box
          sx={{
            display: { xs: 'block', md: 'none' },
            mt: '64px',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {loading ? (
              skeletons.map((skeleton) => (
                <ExerciseCard
                  key={skeleton}
                  loading={loading}
                />
              ))
            ) : mobileFilteredExercises.length === 0 ? (
              <Typography
                variant="h6"
                sx={{ mt: '100px' }}
              >
                Oops! No exercises found.
              </Typography>
            ) : (
              mobileFilteredExercises.map((exercise) => (
                <ExerciseCard
                  key={exercise.id}
                  exerciseId={exercise.id}
                  exerciseName={exercise.name}
                  exerciseCategory={exercise.category}
                  exerciseLanguage={exercise.language}
                  signedIn={signedIn}
                  loading={loading}
                  handleReload={handleReload}
                  categories={categories}
                  madeBy={exercise.made_by}
                  modified={exercise.modified}
                />
              ))
            )}
          </Box>
        </Box>
        <Box
          sx={{
            display: { xs: 'none', md: 'block' },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              ml: '400px',
              mt: '64px',
            }}
          >
            <Grid
              container
              spacing={2}
            >
              {loading ? (
                skeletons.map((skeleton) => (
                  <Grid
                    item
                    md={12}
                    lg={6}
                    xl={4}
                    key={skeleton}
                  >
                    <ExerciseCard
                      key={skeleton}
                      loading={loading}
                    />
                  </Grid>
                ))
              ) : filteredExercises.length === 0 ? (
                <Typography
                  variant="h6"
                  sx={{ mt: '100px' }}
                >
                  Oops! No exercises found.
                </Typography>
              ) : (
                filteredExercises.map((exercise) => (
                  <Grid
                    item
                    md={12}
                    lg={6}
                    xl={4}
                    key={exercise.id}
                  >
                    <ExerciseCard
                      exerciseId={exercise.id}
                      exerciseName={exercise.name}
                      exerciseCategory={exercise.category}
                      exerciseLanguage={exercise.language}
                      signedIn={signedIn}
                      loading={loading}
                      handleReload={handleReload}
                      categories={categories}
                      madeBy={exercise.made_by}
                      modified={exercise.modified}
                    />
                  </Grid>
                ))
              )}
            </Grid>
          </Box>
        </Box>
        <AddExercise
          openAddExercise={openAddExercise}
          setOpenAddExercise={setOpenAddExercise}
          categories={categories}
          handleReload={handleReload}
        />
      </>
    );
}