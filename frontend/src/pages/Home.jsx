/* eslint-disable react/prop-types */
import { Box } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';

import ExerciseCard from '../components/ExerciseCard';
import AddExercise from '../components/AddExercise';

export default function Home({ signedIn, openAddExercise, setOpenAddExercise,
                                loading, exercises, handleReload, categories }) {
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));

    const skeletons = [1, 2, 3];


    return (
      <>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          {signedIn &&
          <AddExercise
            categories={categories}
            handleReload={handleReload}
            openAddExercise={openAddExercise}
            setOpenAddExercise={setOpenAddExercise}
            isMobile={isMobile}
            />
          }
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
      </>
    );
}