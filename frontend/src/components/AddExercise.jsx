import { useState } from "react";
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
        Typography, Stepper, Step, StepLabel, Divider, TextField} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';

export default function AddExercise() {
    const [open, setOpen] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const [nameError, setNameError] = useState(false);
    const [exerciseName, setExerciseName] = useState('');
    const steps = ['Name and category', 'Word pairs', 'Check and save'];


    const handleClose = () => {
        setOpen(false);
        setActiveStep(0);
        setNameError(false);
        setExerciseName('');
    }

    const handleNext = () => {
        if (activeStep < 2) {
            if (isValidName()) {
                setActiveStep((prevActiveStep) => prevActiveStep + 1);
            }
        }
    }

    const handleBack = () => {
        if (activeStep > 0) {
            setActiveStep((prevActiveStep) => prevActiveStep - 1);
        }
    }

    const isValidName = () => {
        if (exerciseName === '') {
            setNameError(true);
            return false
        } else {
            setNameError(false);
            return true
        }
    }

    return (
      <>
        <Button
          variant="contained"
          onClick={() => setOpen(true)}
          sx={{ mt: 3 }}
        >
          <AddIcon sx={{ pr: 0.5, fontSize: '2rem' }} />
          <Typography sx={{ fontWeight: 'bold', pr: 0.5 }}>
            Add Exercise
          </Typography>
        </Button>

        <Dialog
          open={open}
          onClose={handleClose}
          maxWidth={'sm'}
          fullWidth={true}
          sx={{ mt: '-30vh' }}
        >
          <DialogTitle sx={{ display: 'flex', justifyContent: 'center' }}>
            Add Exercise
          </DialogTitle>
          <DialogContent>
            <Stepper activeStep={activeStep}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <Divider sx={{mt: 2}}/>
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                {activeStep === 0 && (
                    <>
                        <TextField
                            margin="small"
                            required
                            id="exerciseName"
                            label="Exercise Name"
                            name="exerciseName"
                            error={nameError}
                            helperText={nameError ? 'Name cannot be empty' : ''}
                            autoFocus
                            value={exerciseName}
                            onChange={(e) => setExerciseName(e.target.value)}
                        />
                    </>
                )}
                {activeStep === 1 && (
                    <>
                    <Typography>Word pairs</Typography>
                    </>
                )}
                {activeStep === 2 && (
                    <>
                    <Typography>Check and save</Typography>
                    </>
                )}
            </Box>
          </DialogContent>
          <DialogActions
            sx={{ display: 'flex', justifyContent: 'space-between' }}
          >
            <Button onClick={handleClose}>Cancel</Button>
            <Box>
              <Button onClick={handleBack}>Back</Button>
              {activeStep < 2 ? (
                <Button onClick={handleNext}>Next</Button>
              ) : (
                <Button onClick={handleClose}>Save</Button>
              )}
            </Box>
          </DialogActions>
        </Dialog>
      </>
    );
}