/* eslint-disable react/prop-types */
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

export default function Home({ signedIn, openAddExercise, setOpenAddExercise,
                                loading, exercises, handleReload, categories,
                                languages, mobileFilteredExercises }) {
    const [filterCount, setFilterCount] = useState(0);
    const [filterCategories, setFilterCategories] = useState([]);
    const [filterLanguages, setFilterLanguages] = useState([]);
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

    // Filter the exercises based on the selected categories and languages
    const filteredExercises = exercises.filter(
      (exercise) =>
        (filterCategories.length === 0 ||
          filterCategories.includes(exercise.category)) &&
        (filterLanguages.length === 0 ||
          filterLanguages.includes(exercise.language)),
    );

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
          <List>
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
                    (status) => (
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
                              );
                            }}
                          />
                          {status}
                        </Box>
                      </Box>
                    ),
                  )}
                </AccordionDetails>
              </Accordion>
            </ListItem>
            <ListItem disablePadding>
              <Accordion sx={{ backgroundColor: 'inherit', width: '100%' }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Created by</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    Some users here
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </ListItem>
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
            {loading
              ? skeletons.map((skeleton) => (
                  <ExerciseCard
                    key={skeleton}
                    loading={loading}
                  />
                ))
              : mobileFilteredExercises.map((exercise) => (
                  <ExerciseCard
                    key={exercise.id}
                    exerciseId={exercise.id}
                    exerciseName={exercise.name}
                    exerciseCategory={exercise.category}
                    exerciseLanguage={exercise.language}
                    signedIn={signedIn}
                    loading={loading}
                    handleReload={handleReload}
                  />
                ))}
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
              {loading
                ? skeletons.map((skeleton) => (
                    <ExerciseCard
                      key={skeleton}
                      loading={loading}
                    />
                  ))
                : filteredExercises.map((exercise) => (
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
                      />
                    </Grid>
                  ))}
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