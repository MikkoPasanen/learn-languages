/* eslint-disable react/prop-types */
import { IconButton, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export default function DeleteExercise({ exerciseId, handleReload }) {

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
            <IconButton sx={{ padding: 0 }} onClick={handleDeleteExercise}>
                <DeleteIcon sx={{ fontSize: 15, color: '#d7094f' }} />
                <Typography sx={{ ml: 1, fontSize: 15, color: '#d7094f' }}>
                    Delete
                </Typography>
            </IconButton>
        </>
    );
}