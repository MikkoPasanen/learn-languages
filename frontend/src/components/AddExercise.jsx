import { useState } from "react";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions,
        Typography, Stepper, Step, StepLabel } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';

export default function AddExercise() {
    const [open, setOpen] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const steps = ['Name and category', 'Word pairs', 'Check and save'];

    return (
        <>
            <Button variant="contained" onClick={() => setOpen(true)} sx={{mt: 3}}>
                <AddIcon sx={{ pr: 0.5, fontSize: '2rem' }} />
                <Typography sx={{ fontWeight: 'bold', pr: 0.5 }}>Add Exercise</Typography>
            </Button>

            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                maxWidth={'sm'}
                fullWidth={true}
                >
                <DialogTitle sx={{display: 'flex', justifyContent: 'center'}}>Add Exercise</DialogTitle>
                <DialogContent>
                    <Stepper activeStep={activeStep} alternativeLabel>
                        {steps.map((label) => (
                            <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={() => setOpen(false)}>Add</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}