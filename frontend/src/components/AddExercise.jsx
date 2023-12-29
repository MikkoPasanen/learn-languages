import { useState } from "react";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';

export default function AddExercise() {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button variant="contained" onClick={() => setOpen(true)} sx={{mt: 3}}>
                <AddIcon sx={{ pr: 0.5, fontSize: '2rem' }} />
                <Typography sx={{ fontWeight: 'bold', pr: 0.5 }}>Add Exercise</Typography>
            </Button>

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth={'md'} fullWidth={true}>
                <DialogTitle>Add Exercise</DialogTitle>
                <DialogContent>
                    <Typography>Content</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={() => setOpen(false)}>Add</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}