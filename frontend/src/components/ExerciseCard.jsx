/* eslint-disable react/prop-types */
import { Card, Box, CardHeader, CardContent,
        Typography, IconButton, Button, Chip,
        Menu, MenuItem, Skeleton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import DeleteExercise from './DeleteExercise';
import EditExercise from './EditExercise';

import { useState} from 'react';
import { Link } from 'react-router-dom';

export default function ExerciseCard({ exerciseName, exerciseCategory,
                                       exerciseLanguage, exerciseId,
                                       signedIn, loading, handleReload,
                                       categories }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const userScore = localStorage.getItem(`${exerciseId}-userScore`);
  const totalScore = localStorage.getItem(`${exerciseId}-totalScore`);

  const handleOptionsClick = (e) => {
    setAnchorEl(e.currentTarget);
  };
  const handleOptionsClose = () => {
    setAnchorEl(null);
  };

  const handleEditExercise = () => {

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

  const currentDate = new Date();
  const formattedDate =
  `${currentDate.getDate().toString().padStart(2, '0')}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getFullYear().toString()}`;

   return (
     <>
       <Card
         key={exerciseId}
         sx={{ mt: 3, borderRadius: 4, width: 380 }}
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
             )
           }
           subheader={
             loading ? (
               <>
                 <Skeleton
                   animation="wave"
                   height={20}
                   width="40%"
                 />
                 <Skeleton
                   animation="wave"
                   height={20}
                   width="40%"
                 />
               </>
             ) : (
               <>
                 <Typography>
                   Made by: <strong>{localStorage.getItem('username')}</strong>
                 </Typography>
                  <Typography>
                    <small>Last modified: {formattedDate}</small>
                  </Typography>
                 <Box sx={{ mt: 1.5 }}>
                   <Chip
                     sx={{ mr: 1 }}
                     label={exerciseCategory}
                   />
                   <Chip label={exerciseLanguage} />
                 </Box>
               </>
             )
           }
         ></CardHeader>
         {signedIn && (
           <Menu
             anchorEl={anchorEl}
             open={Boolean(anchorEl)}
             onClose={handleOptionsClose}
           >
             <MenuItem onClick={handleEditExercise}>
               <EditExercise
                 exerciseId={exerciseId}
                 exerciseName={exerciseName}
                 exerciseCategory={exerciseCategory}
                 exerciseLanguage={exerciseLanguage}
                 categories={categories}
                 handleReload={handleReload}
               />
             </MenuItem>

             <MenuItem onClick={handleOptionsClose}>
               <DeleteExercise
                 exerciseId={exerciseId}
                 exerciseName={exerciseName}
                 handleReload={handleReload}
               />
             </MenuItem>
           </Menu>
         )}
         <CardContent>
           {loading ? (
             <Skeleton
               animation="wave"
               variant="rounded"
               height={40}
               width={90}
             />
           ) : (
             <Box
               sx={{
                 display: 'flex',
                 justifyContent: 'space-between',
                 alignItems: 'center',
               }}
             >
               <Link
                 to={`/exercise/${exerciseId}`}
                 style={{ textDecoration: 'none', color: 'inherit' }}
                 state={{ exerciseName: exerciseName }}
               >
                <Button
                  variant="contained"
                  sx={{ borderRadius: 2, width: 170 }}
                >
                    Study🎓
                </Button>
                </Link>
               <Typography sx={{ mr: 1 }}>
                 Status:
                 {(() => {
                   if (userScore === null) {
                     return (
                       <Typography sx={{ fontWeight: 'bold', color: 'red' }}>
                         Not started❌
                       </Typography>
                     );
                   } else if (userScore === totalScore) {
                     return (
                       <Typography sx={{ fontWeight: 'bold', color: 'green' }}>
                         Completed🎉
                       </Typography>
                     );
                   } else {
                     return (
                       <Typography sx={{ fontWeight: 'bold', color: 'orange' }}>
                         In progress⌛
                       </Typography>
                     );
                   }
                 })()}
               </Typography>
             </Box>
           )}
         </CardContent>
       </Card>
     </>
   );
}