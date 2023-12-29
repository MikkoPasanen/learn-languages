/* eslint-disable react/prop-types */
import { useState } from "react";
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
        Typography, Stepper, Step, StepLabel, Divider, TextField, Autocomplete } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';

export default function AddExercise({ categories }) {
    const [open, setOpen] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const [exerciseName, setExerciseName] = useState('');
    const [category, setCategory] = useState('');

    const [nameError, setNameError] = useState(false);
    const [categoryError, setCategoryError] = useState(false);

    const steps = ['Name and category', 'Word pairs', 'Check and save'];


    const handleClose = () => {
        setOpen(false);
        setActiveStep(0);
        setNameError(false);
        setExerciseName('');
        setCategory('');
        setCategoryError(false);
    }

    const handleNext = () => {
        if (activeStep < 2) {
            if (isValidName() && isValidCategory()) {
                setActiveStep((prevActiveStep) => prevActiveStep + 1);
                console.log(exerciseName);
                console.log(category);
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

    const isValidCategory = () => {
        if (category === '') {
            setCategoryError(true);
            return false
        } else {
            setCategoryError(false);
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
          sx={{ mt: '-10vh' }}
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
            <Box sx={{ mt: 3 }}>
                {activeStep === 0 && (
                    <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                        <TextField
                            required
                            id="exerciseName"
                            label="Exercise Name"
                            name="exerciseName"
                            sx={{width: '50%', mb: 2}}
                            error={nameError}
                            helperText={nameError ? 'Name cannot be empty' : ''}
                            autoFocus
                            value={exerciseName}
                            onChange={(e) => setExerciseName(e.target.value)}
                        />
                        <Autocomplete
                            value={category}
                            onChange={(event, newValue) => {
                                if(newValue === null) {
                                    setCategory('');
                                } else {
                                    setCategory(newValue);
                                }
                            }}
                            inputValue={category}
                            onInputChange={(event, newInputValue) => {
                                setCategory(newInputValue);
                            }}
                            freeSolo
                            options={categories}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Category"
                                    required
                                    error={categoryError}
                                    helperText={categoryError ? 'Category cannot be empty' : ''}
                                    />
                            )}
                            sx={[{width: '50%'}, {mb: 2}]}
                        >
                        </Autocomplete>
                    </Box>
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