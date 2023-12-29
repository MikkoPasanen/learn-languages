import { useState } from "react";
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
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

    const handleNext = () => {
        if (activeStep < 2) {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }
    }

    const handleBack = () => {
        if (activeStep > 0) {
            setActiveStep((prevActiveStep) => prevActiveStep - 1);
        }
    }
    return (
        <>
            <Button variant="contained" onClick={() => setOpen(true)} sx={{mt: 3}}>
                <AddIcon sx={{ pr: 0.5, fontSize: '2rem' }} />
                <Typography sx={{ fontWeight: 'bold', pr: 0.5 }}>Add Exercise</Typography>
            </Button>

            <Dialog
                open={open}
                onClose={handleClose}
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

                    <Box sx={{mt: 3}}>

                    </Box>
                </DialogContent>
                <DialogActions sx={{display: 'flex', justifyContent: 'space-between'}}>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Box>
                        <Button onClick={handleBack}>Back</Button>
                        <Button onClick={handleNext}>Next</Button>
                    </Box>
                </DialogActions>
            </Dialog>
        </>
    );
}