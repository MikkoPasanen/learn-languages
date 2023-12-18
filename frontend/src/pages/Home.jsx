/* eslint-disable react/prop-types */
import { Box, Card, CardHeader, CardContent, Typography, IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useState, useEffect } from 'react';

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
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          {exercises.map((exercise) => (
            <Card key={exercise.id} sx={{mt: 3}}>
              <CardHeader
                action={
                  <IconButton aria-label="settings" sx={{ml: 2}}>
                    <MoreVertIcon />
                  </IconButton>
                }
                title={exercise.name}
                subheader="Test"
              />
              <CardContent>
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Moro
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </>
    );
}