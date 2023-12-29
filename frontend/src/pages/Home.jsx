/* eslint-disable react/prop-types */
import { Box, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useState, useEffect } from 'react';

import ExerciseCard from '../components/ExerciseCard';

export default function Home({ signedIn }) {
    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(true);

    const skeletons = [1, 2, 3];

    useEffect(() => {
      fetchExercises();
    }, []);

    const fetchExercises = async () => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/home`);
      const data = await response.json();
      setExercises(data);
      setLoading(false);
    };

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
          {signedIn && (
            <Button
              variant='contained'
              sx={{ p: 0.5, borderRadiud: 4, mt: 3}}
              >
                <AddIcon sx={{ pr: 0.5, fontSize: '2rem' }} />
                <Typography sx={{fontWeight: 'bold', pr: 0.5}}>Add Exercise</Typography>
            </Button>
          )}
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
                />
              ))}
        </Box>
      </>
    );
}