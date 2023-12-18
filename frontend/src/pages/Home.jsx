/* eslint-disable react/prop-types */
import { Box, Card, CardHeader, CardContent, Typography, IconButton, Chip } from '@mui/material';
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
            <Card key={exercise.id} sx={{mt: 3, borderRadius: 4}}>
              <CardHeader
                action={
                  <IconButton aria-label="settings" sx={{ml: 2}}>
                    <MoreVertIcon />
                  </IconButton>
                }

                title={exercise.name}
                subheader={
                <Box sx={{mt: 1}}>
                    <Chip sx={{mr: 1}} label={exercise.category}/>
                    <Chip label={exercise.language}/>
                </Box>
                }
                >
              </CardHeader>
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