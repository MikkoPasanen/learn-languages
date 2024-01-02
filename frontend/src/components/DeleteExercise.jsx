/* eslint-disable react/prop-types */
import { IconButton, Typography, Dialog, Button, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

import { useState } from 'react';

export default function DeleteExercise({ exerciseId, exerciseName, handleReload }) {
    const [open, setOpen] = useState(false);
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');

    const handleDeleteExercise = async () => {
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

        if (json.success) {
            handleReload();
        }
    };

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
          <Typography sx={{ ml: 1, fontSize: 15, color: '#d7094f' }}>
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
                setOpen(false);
                handleDeleteExercise();
              }}
              sx={{ color: '#d7094f', fontWeight: 'bold' }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
}