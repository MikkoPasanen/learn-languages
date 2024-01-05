/* eslint-disable react/prop-types */
import { Box, Drawer, List, ListItemButton,
        ListItemText, ListItem, Divider,
        Accordion, AccordionSummary, AccordionDetails,
        Checkbox, Chip, Badge} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';

import ExerciseCard from '../components/ExerciseCard';
import AddExercise from '../components/AddExercise';

import AddIcon from '@mui/icons-material/Add';

export default function Home({ signedIn, openAddExercise, setOpenAddExercise,
                                loading, exercises, handleReload, categories }) {
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));

    const skeletons = [1, 2, 3];


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
              <ListItemButton
                onClick={() => setOpenAddExercise(true)}
              >
                <AddIcon sx={{ pr: 1, fontSize: '2rem' }} />
                <ListItemText primary="Add exercise" />
              </ListItemButton>
            )}
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