/* eslint-disable react/prop-types */

/**
 * @fileoverview Exercise card component. This component is used to display an exercise in the home page.
 * @component
 * @requires NPM:@mui/material
 * @requires NPM:react-router-dom
 * @requires NPM:react
 */

import { Card, Box, CardHeader, CardContent,
        Typography, IconButton, Button, Chip,
        Menu, MenuItem, Skeleton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import DeleteExercise from './DeleteExercise';
import EditExercise from './EditExercise';

import { useState} from 'react';
import { Link } from 'react-router-dom';

/**
 * Exercise card component
 * @param {Object} props
 * @param {string} props.exerciseName Exercise name
 * @param {string} props.exerciseCategory Exercise category
 * @param {string} props.exerciseLanguage Exercise language
 * @param {string} props.exerciseId Exercise ID
 * @param {boolean} props.signedIn Whether the user is signed in or not
 * @param {boolean} props.loading Whether the exercise is loading or not
 * @param {function} props.handleReload Function to reload the exercises
 * @param {Array} props.categories Categories array
 * @param {string} props.madeBy The user who made the exercise
 * @param {string} props.modified The date when the exercise was last modified
 * @returns {JSX.Element} Exercise card component
 */
export default function ExerciseCard({ exerciseName, exerciseCategory,
                                       exerciseLanguage, exerciseId,
                                       signedIn, loading, handleReload,
                                       categories, madeBy, modified }) {

  // State for the options menu
  const [anchorEl, setAnchorEl] = useState(null);

  // Get the user score and the total score from the local storage to determine the status of the exercise
  const userScore = localStorage.getItem(`${exerciseId}-userScore`);
  const totalScore = localStorage.getItem(`${exerciseId}-totalScore`);

  /**
   * Handle the options menu click
   * @param {Object} e Event object that triggered the function
   */
  const handleOptionsClick = (e) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  /**
   * Handle the options menu close
   * @param {Object} e Event object that triggered the function
  */
  const handleOptionsClose = (e) => {
    e.stopPropagation();
    setAnchorEl(null);
  };

  // Get the username from the local storage or the session storage to determine if the user is the admin or the user who made the exercise
  const user = localStorage.getItem('username') || sessionStorage.getItem('username');

  /**
   * Action component
   * If the user is signed in and the user is the admin or the user who made the exercise, display the options menu
   * @returns {JSX.Element}
   */
  const action = signedIn ? (
    user === 'admin' ? (
      <IconButton
        aria-label="settings"
        onClick={handleOptionsClick}
        sx={{ ml: 2}}
      >
        <MoreVertIcon />
      </IconButton>
    ) : user === madeBy ? (
      <IconButton
        aria-label="settings"
        onClick={handleOptionsClick}
        sx={{ ml: 2}}
      >
        <MoreVertIcon />
      </IconButton>
    ) : (
      null
    )
    ) : null;


  /**
   * Exercise card component
   * @returns {JSX.Element}
   */
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
                   Made by: <strong>{madeBy}</strong>
                 </Typography>
                 <Typography>
                   {modified ? (
                     <small>Last modified: {modified}</small>
                   ) : (
                     ''
                   )}
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
             onClose={(e) => handleOptionsClose(e)}
           >
             <MenuItem onClick={(e) => handleOptionsClose(e)}>
               <EditExercise
                 exerciseId={exerciseId}
                 exerciseName={exerciseName}
                 exerciseCategory={exerciseCategory}
                 exerciseLanguage={exerciseLanguage}
                 categories={categories}
                 handleReload={handleReload}
               />
             </MenuItem>

             <MenuItem onClick={(e) => handleOptionsClose(e)}>
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
                 state={{ exerciseName: exerciseName, language: exerciseLanguage }}
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