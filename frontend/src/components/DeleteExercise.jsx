/* eslint-disable react/prop-types */

/**
 * @fileoverview DeleteExercise component, a button that deletes an exercise
 * @requires React
 * @requires @mui/material
 */
import { IconButton, Typography, Dialog, Button, DialogActions,
        DialogContent, DialogTitle, CircularProgress } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

import { useState } from 'react';

/**
 * DeleteExercise button component
 * @component
 * @param {Object} props
 * @param {string} props.exerciseId - exercise id
 * @param {string} props.exerciseName - exercise name
 * @param {function} props.handleReload - reload function
 * @returns {JSX.Element} DeleteExercise component
 */
export default function DeleteExercise({ exerciseId, exerciseName, handleReload }) {

    // State for the dialog open state
    const [open, setOpen] = useState(false);
    // State for the loading spinner
    const [loading, setLoading] = useState(false);

    // Get token from local storage or session storage
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');

    /**
     * Handles the deletion of the exercise
     * @async
     * @returns {Promise<void>} - Promise representing the success/failure of the deletion
     */
    const handleDeleteExercise = async () => {
        setLoading(true);
        // Send a DELETE request to the server
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/admin/delete-exercise/${exerciseId}`,
          {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const json = await response.json();

        // If the request was successful, reload the exercises and close the dialog
        if (json.success) {
            await handleReload();
            localStorage.removeItem(`${exerciseId}-totalScore`);
            localStorage.removeItem(`${exerciseId}-userScore`);
            setOpen(false);
            setLoading(false);
        }
    };

    /**
     * DeleteExercise component
     * @returns {JSX.Element}
     */
    return (
      <>
        <IconButton
          sx={{ padding: 0 }}
          onClick={(e) => {
            e.stopPropagation();
            setOpen(true);
          }}
        >
          <DeleteIcon sx={{ fontSize: 15, color: '#d7094f' }} />
          <Typography sx={{ ml: 1, fontSize: 15, color: '#d7094f', fontWeight: 'bold' }}>
            Delete
          </Typography>
        </IconButton>
        <Dialog
          open={open}
          maxWidth={'xs'}
          fullWidth={true}
          sx={{ mt: '-10vh' }}
        >
          <DialogTitle sx={{ textAlign: 'center' }}>
            Delete {exerciseName}?
          </DialogTitle>
          <DialogContent sx={{ textAlign: 'center' }}>
            This action cannot be undone.
          </DialogContent>
          <DialogActions
            sx={{ display: 'flex', justifyContent: 'space-between' }}
          >
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button
              onClick={() => {
                handleDeleteExercise();
              }}
              sx={{ color: '#d7094f', fontWeight: 'bold' }}
            >
              {loading ? (
                <>
                  Deleting...
                  <CircularProgress
                    size={20}
                    sx={{ ml: 1 }}
                    color="inherit"
                  />
                </>
              ) : (
                'Delete'
              )}
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
}