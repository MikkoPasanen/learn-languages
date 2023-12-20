/* eslint-disable react/prop-types */
import { Box, Card, CardHeader, CardContent, Typography, IconButton, Chip, Menu, MenuItem} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
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
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {exercises.map((exercise) => (
            <Card
              key={exercise.id}
              sx={{ mt: 3, borderRadius: 4 }}
            >
              <CardHeader
                action={
                  <IconButton
                    aria-label="settings"
                    sx={{ ml: 2 }}
                    onClick={handleOptionsClick}
                  >
                    <MoreVertIcon />
                  </IconButton>
                }
                title={exercise.name}
                subheader={
                  <Box sx={{ mt: 1 }}>
                    <Chip
                      sx={{ mr: 1 }}
                      label={exercise.category}
                    />
                    <Chip label={exercise.language} />
                  </Box>
                }
              ></CardHeader>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleOptionsClose}
              >
                <MenuItem onClick={handleOptionsClose}>
                  <IconButton sx={{ padding: 0 }}>
                    <EditIcon sx={{ fontSize: 15 }} />
                    <Typography sx={{ ml: 1, fontSize: 15 }}>Edit</Typography>
                  </IconButton>
                </MenuItem>

                <MenuItem onClick={handleOptionsClose}>
                  <IconButton sx={{ padding: 0 }}>
                    <DeleteIcon sx={{ fontSize: 15, color: '#d7094f' }} />
                    <Typography sx={{ ml: 1, fontSize: 15, color: '#d7094f' }}>
                      Delete
                    </Typography>
                  </IconButton>
                </MenuItem>
              </Menu>
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