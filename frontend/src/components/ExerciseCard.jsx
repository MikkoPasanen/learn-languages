/* eslint-disable react/prop-types */
import { Card, Box, CardHeader, CardContent,
        Typography, IconButton, Button, Chip,
        Menu, MenuItem, Skeleton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';

import DeleteExercise from './DeleteExercise';

import { useState} from 'react';
import { Link } from 'react-router-dom';

export default function ExerciseCard({ exerciseName, exerciseCategory,
                                       exerciseLanguage, exerciseId,
                                       signedIn, loading, handleReload }) {
    const [anchorEl, setAnchorEl] = useState(null);

   const handleOptionsClick = (e) => {
     setAnchorEl(e.currentTarget);
   };

   const handleOptionsClose = () => {
     setAnchorEl(null);
   };

   const action = signedIn ? (
     <IconButton
       aria-label="settings"
       onClick={handleOptionsClick}
       sx={{ ml: 2}}
     >
       <MoreVertIcon />
     </IconButton>
    ) : null;

    return (
      <>
        <Card
          key={exerciseId}
          sx={{ mt: 3, borderRadius: 4, width: 350}}
        >
          <CardHeader
            action={action}
            title={
              loading ? (
                <Skeleton
                  animation="wave"
                  height={30}
                  width="80%"
                  style={{ marginBottom: 6 }}
                />
              ) : (
                  exerciseName
              )}
            subheader={
              loading ? (
                <Skeleton
                  animation="wave"
                  height={20}
                  width="40%"
                />
              ) : (
              <Box sx={{ mt: 1 }}>
                <Chip
                  sx={{ mr: 1 }}
                  label={exerciseCategory}
                />
                <Chip label={exerciseLanguage} />
              </Box>
            )}
          ></CardHeader>
          {signedIn && (
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
                <DeleteExercise
                  exerciseId={exerciseId}
                  exerciseName={exerciseName}
                  handleReload={handleReload}/>
              </MenuItem>
            </Menu>
          )}
          <CardContent>
            {loading ? (
              <Skeleton
                animation="wave"
                variant='rounded'
                height={40}
                width={90}
              />
            ) : (
              <Button
                variant="contained"
                sx={{ borderRadius: 2 }}
              >
                <Link
                  to={`/exercise/${exerciseId}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                  state={{ exerciseName: exerciseName }}
                >
                  Study🎓
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      </>
    );
}