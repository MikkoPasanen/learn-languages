/* eslint-disable react/prop-types */
import { useState } from "react";
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
        Typography, Stepper, Step, StepLabel, Divider, TextField, Autocomplete,
        IconButton } from "@mui/material";

import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';

export default function AddExercise({ categories, languages }) {
    const [open, setOpen] = useState(false);
    const [activeStep, setActiveStep] = useState(0);

    const [exerciseName, setExerciseName] = useState('');
    const [category, setCategory] = useState('');
    const [language, setLanguage] = useState('');

    const [wordPairs, setWordPairs] = useState([{ english: '', foreign: '' }]);

    const [nameError, setNameError] = useState(false);
    const [categoryError, setCategoryError] = useState(false);
    const [languageError, setLanguageError] = useState(false);
    const [wordPairsError, setWordPairsError] = useState(false);

    const steps = ['Exercise info', 'Word pairs', 'Check and save'];


    const handleClose = () => {
        setOpen(false);
        setActiveStep(0);
        setNameError(false);
        setExerciseName('');
        setCategory('');
        setCategoryError(false);
        setLanguage('');
        setLanguageError(false);
        setWordPairs([{ english: '', foreign: '' }]);
        setWordPairsError(false);
    }

    const handleNext = () => {
        if (activeStep < 2) {
            if (activeStep === 0 && isValidName() && isValidCategory() && isValidLanguage()) {
                setActiveStep((prevActiveStep) => prevActiveStep + 1);
            }
            else if (activeStep === 1 && isValidWordPairs()) {
                setActiveStep((prevActiveStep) => prevActiveStep + 1);
            }
        }
    }

    const handleBack = () => {
        if (activeStep > 0) {
            setActiveStep((prevActiveStep) => prevActiveStep - 1);
            setWordPairsError(false);
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

    const isValidLanguage = () => {
        if (language === '') {
            setLanguageError(true);
            return false
        } else {
            setLanguageError(false);
            return true
        }
    }

    const isValidWordPairs = () => {
        if (wordPairs.some((pair) => pair.english === '' || pair.foreign === '')) {
            setWordPairsError(true);
            return false
        } else {
            setWordPairsError(false);
            return true
        }
    }

    function handleWordChange(e, index, language) {
      const newWordPairs = [...wordPairs];
      newWordPairs[index][language] = e.target.value;
      setWordPairs(newWordPairs);
    }

    function handleAddPair() {
      setWordPairs([...wordPairs, { english: '', foreign: '' }]);
    }

    function handleRemovePair(index) {
      if (wordPairs.length > 1) {
        const newWordPairs = [...wordPairs];
        newWordPairs.splice(index, 1);
        setWordPairs(newWordPairs);
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
          maxWidth={'sm'}
          fullWidth={true}
          sx={{ mt: '-10vh' }}
          scroll="paper"
        >
          <DialogTitle sx={{ display: 'flex', justifyContent: 'center' }}>
            Add Exercise
          </DialogTitle>
          <DialogContent sx={{maxHeight: '61vh'}}>
            <Stepper
              activeStep={activeStep}
              alternativeLabel
            >
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <Divider sx={{ mt: 2 }} />
            <Box sx={{ mt: 3 }}>
              {activeStep === 0 && (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <TextField
                    required
                    id="exerciseName"
                    label="Exercise Name"
                    name="exerciseName"
                    sx={{ width: '80%', mb: 2 }}
                    error={nameError}
                    helperText={nameError ? 'Name cannot be empty' : ''}
                    autoFocus
                    value={exerciseName}
                    onChange={(e) => setExerciseName(e.target.value)}
                  />
                  <Autocomplete
                    value={category}
                    onChange={(event, newValue) => {
                      if (newValue === null) {
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
                        helperText={
                          categoryError ? 'Category cannot be empty' : ''
                        }
                      />
                    )}
                    sx={[{ width: '80%' }, { mb: 2 }]}
                  ></Autocomplete>
                  <Autocomplete
                    value={language}
                    onChange={(event, newValue) => {
                      if (newValue === null) {
                        setLanguage('');
                      } else {
                        setLanguage(newValue);
                      }
                    }}
                    inputValue={language}
                    onInputChange={(event, newInputValue) => {
                      setLanguage(newInputValue);
                    }}
                    freeSolo
                    options={languages}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Language"
                        required
                        error={languageError}
                        helperText={
                          languageError ? 'Language cannot be empty' : ''
                        }
                      />
                    )}
                    sx={[{ width: '80%' }, { mb: 2 }]}
                  ></Autocomplete>
                </Box>
              )}
              {activeStep === 1 && (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'}}
                  >
                  {wordPairs.map((pair, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <TextField
                          label="English word"
                          required
                          value={pair.english}
                          onChange={(e) => handleWordChange(e, index, 'english')}
                          sx={{ mr: 2}}
                        />
                        <TextField
                          label={`${language} word`}
                          required
                          value={pair.foreign}
                          onChange={(e) => handleWordChange(e, index, 'foreign')}
                          sx={{ mr: 2}}
                        />
                        <IconButton
                          onClick={() => handleRemovePair(index)}
                          sx={{p: 0}}
                        >
                          <ClearIcon sx={{color: 'red', fontSize: '2rem'}}/>
                        </IconButton>
                    </Box>
                  ))}
                  <Button
                    variant="contained"
                    onClick={handleAddPair}
                    sx={{ mt: 3, borderRadius: 4, p: 0.5 }}
                  >
                    <AddIcon sx={{ pr: 0.5, fontSize: '2rem' }} />
                    <Typography sx={{ fontWeight: 'bold', pr: 0.5 }}>Add pair</Typography>
                  </Button>
                </Box>
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
            <Box sx={{display: 'flex'}}>
              {wordPairsError && (
                <Typography sx={{ color: 'red', mt: 1}}>
                  Word pairs cannot be empty
                </Typography>
              )}
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