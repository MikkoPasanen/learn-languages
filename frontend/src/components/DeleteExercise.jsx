/* eslint-disable react/prop-types */
import { IconButton, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export default function DeleteExercise({ exerciseId }) {

    return (
        <>
            <IconButton sx={{ padding: 0 }}>
                <DeleteIcon sx={{ fontSize: 15, color: '#d7094f' }} />
                <Typography sx={{ ml: 1, fontSize: 15, color: '#d7094f' }}>
                    Delete
                </Typography>
            </IconButton>
        </>
    );
}