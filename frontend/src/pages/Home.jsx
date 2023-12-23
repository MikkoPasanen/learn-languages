/* eslint-disable react/prop-types */
import { Box } from '@mui/material';
import { useState, useEffect } from 'react';

import ExerciseCard from '../components/ExerciseCard';

export default function Home() {
    const [exercises, setExercises] = useState([]);
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');

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
            flexDirection: 'column',
          }}
        >
          {token && <h1>Logged in</h1>}
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