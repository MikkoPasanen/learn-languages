/* eslint-disable react/prop-types */
import { Box, Drawer, List, ListItemButton,
        ListItemText, ListItem, Divider,
        Accordion, AccordionSummary, AccordionDetails,
        Checkbox, Chip, Badge, Typography} from '@mui/material';

import ExerciseCard from '../components/ExerciseCard';
import AddExercise from '../components/AddExercise';

import { useState } from 'react';

import AddIcon from '@mui/icons-material/Add';
import TuneIcon from '@mui/icons-material/Tune';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function Home({ signedIn, openAddExercise, setOpenAddExercise,
                                loading, exercises, handleReload, categories,
                                languages }) {
    const [filterCount, setFilterCount] = useState(0);
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
              <ListItemButton onClick={() => setOpenAddExercise(true)}>
                <AddIcon sx={{ pr: 1, fontSize: '2.5rem' }} />
                <ListItemText primary="Add exercise" />
              </ListItemButton>
            )}
            <Divider />
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
                            onChange={(e) => {
                              setFilterCount(
                                e.target.checked
                                  ? filterCount + 1
                                  : filterCount - 1,
                              );
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
                            onChange={(e) => {
                              setFilterCount(
                                e.target.checked
                                  ? filterCount + 1
                                  : filterCount - 1,
                              );
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
          </List>
        </Drawer>
        <Box
          sx={{
            display: { xs: 'block', md: 'none' },
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
              : exercises.map((exercise) => (
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
              ml: '300px',
              mt: '32px',
            }}
          >
            {loading
              ? skeletons.map((skeleton) => (
                  <ExerciseCard
                    key={skeleton}
                    loading={loading}
                  />
                ))
              : exercises.map((exercise) => (
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
        <AddExercise
          openAddExercise={openAddExercise}
          setOpenAddExercise={setOpenAddExercise}
          categories={categories}
          handleReload={handleReload}
        />
      </>
    );
}