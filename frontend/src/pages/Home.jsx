/* eslint-disable react/prop-types */
import { Box } from '@mui/material';
import { useState, useEffect } from 'react';

import ExerciseCard from '../components/ExerciseCard';

export default function Home() {
    const [exercises, setExercises] = useState([]);

    useEffect(() => {
      fetchExercises();
    }, []);

    const fetchExercises = async () => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/home`);
      const data = await response.json();
      setExercises(data);
    };

    return (
      <>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {exercises.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              exerciseId={exercise.id}
              exerciseName={exercise.name}
              exerciseCategory={exercise.category}
              exerciseLanguage={exercise.language}
            />
          ))}
        </Box>
      </>
    );
}