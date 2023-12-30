/* eslint-disable react/prop-types */
import { Box } from '@mui/material';
import { useState, useEffect } from 'react';

import ExerciseCard from '../components/ExerciseCard';
import AddExercise from '../components/AddExercise';

export default function Home({ signedIn }) {
    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [languages, setLanguages] = useState([]);

    const skeletons = [1, 2, 3];

    useEffect(() => {
      fetchExercises();
    }, []);

    const fetchExercises = async () => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/home`);
      const data = await response.json();
      setExercises(data);
      const categories = data.map((exercise) => exercise.category);
      const languages = data.map((exercise) => exercise.language);
      setCategories([...new Set(categories)]);
      setLanguages([...new Set(languages)]);
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
          {signedIn && <AddExercise categories={categories} languages={languages}/>}
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