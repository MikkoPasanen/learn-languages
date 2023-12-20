/* eslint-disable react/prop-types */
import { Card, Box, CardHeader, CardContent, Typography, IconButton, Button, Chip, Menu, MenuItem} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { useState} from 'react';
import { Link } from 'react-router-dom';

export default function ExerciseCard({ exerciseName, exerciseCategory, exerciseLanguage, exerciseId }) {
    const [anchorEl, setAnchorEl] = useState(null);

   const handleOptionsClick = (e) => {
     setAnchorEl(e.currentTarget);
   };

   const handleOptionsClose = () => {
     setAnchorEl(null);
   };

    return (
      <>
        <Card
          key={exerciseId}
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
            title={exerciseName}
            subheader={
              <Box sx={{ mt: 1 }}>
                <Chip
                  sx={{ mr: 1 }}
                  label={exerciseCategory}
                />
                <Chip label={exerciseLanguage} />
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
            <Button variant='contained' sx={{borderRadius: 2}}>
              <Link
                to={`/exercise/${exerciseId}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                Study🎓
              </Link>
            </Button>
          </CardContent>
        </Card>
      </>
    );
}