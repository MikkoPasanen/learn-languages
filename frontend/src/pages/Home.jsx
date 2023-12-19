/* eslint-disable react/prop-types */
import { Box, Card, CardHeader, CardContent, Typography, IconButton, Chip, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useState, useEffect } from 'react';

export default function Home() {
    const [exercises, setExercises] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);

    useEffect(() => {
      fetchExercises();
    }, []);

    const fetchExercises = async () => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/home`);
      const data = await response.json();
      setExercises(data);
    };

    const handleOptionsClick = (e) => {
        setAnchorEl(e.currentTarget);
    };

    const handleOptionsClose = () => {
        setAnchorEl(null);
    };

    return (
      <>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          {exercises.map((exercise) => (
            <Card key={exercise.id} sx={{mt: 3, borderRadius: 4}}>
              <CardHeader
                action={
                  <IconButton aria-label="settings" sx={{ml: 2}} onClick={handleOptionsClick}>
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