import { useState } from "react";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions,
        Typography, Stepper, Step, StepLabel } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';

export default function AddExercise() {
    const [open, setOpen] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const steps = ['Name and category', 'Word pairs', 'Check and save'];

    const handleClose = () => {
        setOpen(false);
        setActiveStep(0);
    }
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
                sx={{mt: '-30vh'}}
                >
                <DialogTitle sx={{display: 'flex', justifyContent: 'center'}}>Add Exercise</DialogTitle>
                <DialogContent>
                    <Stepper activeStep={activeStep}>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </DialogContent>
                <DialogActions sx={{display: 'flex', justifyContent: 'space-between'}}>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={() => setActiveStep(activeStep + 1)}>Next</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}