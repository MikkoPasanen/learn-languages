/* eslint-disable react/prop-types */

/**
 * @fileoverview AddExercise component, a button that adds an exercise
 * @requires React
 * @requires @mui/material
 * @requires @mui/icons-material
 * @requires ../data/languages
 */
import { useState } from "react";
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
        Typography, Stepper, Step, StepLabel, Divider, TextField, Autocomplete,
        IconButton, Snackbar, Alert, CircularProgress } from "@mui/material";

import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';

import languages from '../data/languages';

/**
 * AddExercise button component
 * @component
 * @param {Object} props
 * @param {Array} props.categories - categories array
 * @param {function} props.handleReload - reload function
 * @param {boolean} props.openAddExercise - open state
 * @param {function} props.setOpenAddExercise - open state setter
 * @returns {JSX.Element} AddExercise component
*/
export default function AddExercise({ categories, handleReload, openAddExercise,
                                      setOpenAddExercise }) {

    // Get the language names from the languages array for language options
    const languageOptions = languages.map((language) => language.name);

    // Get token from local storage or session storage
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');

    // States for the exercise info
    const [exerciseName, setExerciseName] = useState('');
    const [category, setCategory] = useState('');
    const [language, setLanguage] = useState(null);

    // State for the word pairs
    const [wordPairs, setWordPairs] = useState([{ english: '', foreign: '' }]);

    // States for the errors
    const [nameError, setNameError] = useState(false);
    const [categoryError, setCategoryError] = useState(false);
    const [languageError, setLanguageError] = useState(false);
    const [wordPairsError, setWordPairsError] = useState(false);

    // State for the loading spinner
    const [loading, setLoading] = useState(false);

    // State for the active step of the stepper
    const [activeStep, setActiveStep] = useState(0);
    // Stepper steps
    const steps = ['Exercise info', 'Word pairs', 'Check and save'];


    /**
     * Handles the closing of the dialog and resets the states
     */
    const handleCloseDialog = () => {
        setOpenAddExercise(false);
        setActiveStep(0);
        setNameError(false);
        setExerciseName('');
        setCategory('');
        setCategoryError(false);
        setLanguage(null);
        setLanguageError(false);
        setWordPairs([{ english: '', foreign: '' }]);
        setWordPairsError(false);
        setLoading(false);
    }

    /**
     * Handles the next step of the stepper
     */
    const handleNext = () => {
      // If the active step is 0, check if the name, category and language are valid
      // If the active step is 1, check if the word pairs are valid
      // If the active step is 2, save the exercise
        if (activeStep < 2) {
            if (activeStep === 0 && isValidName() && isValidCategory() && isValidLanguage()) {
                setActiveStep((prevActiveStep) => prevActiveStep + 1);
            }
            else if (activeStep === 1 && isValidWordPairs()) {
                setActiveStep((prevActiveStep) => prevActiveStep + 1);
            }
        }
    }

    /**
     * Handles the closing of the word pairs error alert
     * @param {Event} event - The event that triggered the function
     * @param {string} reason - The reason for the function call
     */
    const handleCloseAlert = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
      setWordPairsError(false);
    };

    /**
     * Handles the back step of the stepper
     * If the active step is greater than 0, decrease the active step by 1
     */
    const handleBack = () => {
        if (activeStep > 0) {
            setActiveStep((prevActiveStep) => prevActiveStep - 1);
        }
    }

    /**
     * Checks if the exercise name is valid
     * @returns {boolean} - true if the exercise name is valid, false otherwise
     */
    const isValidName = () => {
        if (exerciseName === '') {
            setNameError(true);
            return false
        } else {
            setNameError(false);
            return true
        }
    }

    /**
     * Checks if the category is valid
     * @returns {boolean} - true if the category is valid, false otherwise
     */
    const isValidCategory = () => {
        if (category === '') {
            setCategoryError(true);
            return false
        } else {
            setCategoryError(false);
            return true
        }
    }

    /**
     * Checks if the language is valid
     * @returns {boolean} - true if the language is valid, false otherwise
     */
    const isValidLanguage = () => {
        if (language === null) {
            setLanguageError(true);
            return false
        } else {
            setLanguageError(false);
            return true
        }
    }

    /**
     * Checks if the word pairs are valid
     * @returns {boolean} - true if the word pairs are valid, false otherwise
     */
    const isValidWordPairs = () => {
        if (wordPairs.some((pair) => pair.english === '' || pair.foreign === '')) {
            setWordPairsError(true);
            return false
        } else {
            setWordPairsError(false);
            return true
        }
    }

    /**
     * Handles the change of the word pairs
     * @param {Event} e - The event that triggered the function
     * @param {number} index - The index of the word pair
     * @param {string} language - The language of the word pair
     */
    const handleWordChange = (e, index, language) => {
      // Create a copy of the word pairs array and change the value of the word pair at the given index
      const newWordPairs = [...wordPairs];
      newWordPairs[index][language] = e.target.value;
      setWordPairs(newWordPairs);
    }

    /**
     * Handles the addition of a word pair
     */
    const handleAddPair = () => {
      setWordPairs([...wordPairs, { english: '', foreign: '' }]);
    }

    /**
     * Handles the removal of a word pair
     * @param {number} index - The index of the word pair
     */
    const handleRemovePair = (index) => {
      // If there are more than one word pairs, create a copy of the word pairs array and remove the word pair at the given index
      if (wordPairs.length > 1) {
        const newWordPairs = [...wordPairs];
        newWordPairs.splice(index, 1);
        setWordPairs(newWordPairs);
      }
    }

    /**
     * Handles the saving of the exercise
     * @async
     * @returns {Promise} - Promise object that represents the result of the HTTP request
     */
    const handleSaveExercise = async () => {
      setLoading(true);
      // Send a POST request to the server to save the exercise
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/add-exercise`,
        {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            exerciseName: exerciseName,
            category: category,
            language: language,
            wordPairs: wordPairs,
            madeBy: localStorage.getItem('username') || sessionStorage.getItem('username'),
            modified: null
          }),
        },
      );

      const json = await response.json();

      // If the response is successful, reload the exercises and close the dialog
      if(json.success) {
        handleReload();
        handleCloseDialog();
      } else {
        setLoading(false);
      }
    }

    return (
      <>
        <Dialog
          open={openAddExercise}
          maxWidth={'sm'}
          fullWidth={true}
          sx={{ mt: '-10vh' }}
          scroll="paper"
        >
          <DialogTitle>
            <Typography
              sx={{
                fontWeight: 'bold',
                fontSize: '1.2rem',
                textAlign: 'center',
                mb: 1,
              }}
            >
              Add new exercise
            </Typography>
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
          </DialogTitle>
          <DialogContent sx={{ maxHeight: '47vh' }}>
            <Divider />
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
                      setLanguage(newValue);
                    }}
                    options={languageOptions}
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
                    alignItems: 'center',
                  }}
                >
                  {wordPairs.map((pair, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 1,
                      }}
                    >
                      <TextField
                        label="English word"
                        required
                        value={pair.english}
                        onChange={(e) => handleWordChange(e, index, 'english')}
                        sx={{ mr: 2 }}
                      />
                      <TextField
                        label={`${language} word`}
                        required
                        value={pair.foreign}
                        onChange={(e) => handleWordChange(e, index, 'foreign')}
                        sx={{ mr: 2 }}
                      />
                      <IconButton
                        onClick={() => handleRemovePair(index)}
                        sx={{ p: 0 }}
                      >
                        <ClearIcon sx={{ color: 'red', fontSize: '2rem' }} />
                      </IconButton>
                    </Box>
                  ))}
                  <Button
                    variant="contained"
                    onClick={handleAddPair}
                    sx={{ mt: 3, borderRadius: 4, p: 0.5 }}
                  >
                    <AddIcon sx={{ pr: 0.5, fontSize: '2rem' }} />
                    <Typography sx={{ fontWeight: 'bold', pr: 0.5 }}>
                      Add pair
                    </Typography>
                  </Button>
                </Box>
              )}
              {activeStep === 2 && (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <Typography
                    sx={{ fontWeight: 'bold', fontSize: '1.3rem', mb: 1 }}
                  >
                    {steps[0]}
                  </Typography>
                  <Typography sx={{ mb: 0.5 }}>{exerciseName}</Typography>
                  <Typography sx={{ mb: 0.5 }}>{category}</Typography>
                  <Typography>{language}</Typography>
                  <Typography
                    sx={{
                      fontWeight: 'bold',
                      fontSize: '1.3rem',
                      mb: 1,
                      mt: 2,
                    }}
                  >
                    {steps[1]}
                  </Typography>
                  {wordPairs.map((pair, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 0.5,
                      }}
                    >
                      <Typography sx={{ mr: 1 }}>{pair.english}</Typography>
                      <Typography sx={{ mr: 1 }}>-</Typography>
                      <Typography>{pair.foreign}</Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          </DialogContent>
          <DialogActions
            sx={{ display: 'flex', justifyContent: 'space-between' }}
          >
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Box sx={{ display: 'flex' }}>
              <Button onClick={handleBack}>Back</Button>
              {activeStep < 2 ? (
                <Button onClick={handleNext}>Next</Button>
              ) : (
                <Button onClick={handleSaveExercise}>
                  {loading ? (
                    <>
                      Saving...
                      <CircularProgress
                        size={20}
                        sx={{ ml: 1 }}
                        color="inherit"
                      />
                    </>
                  ) : (
                    'Save'
                  )}
                </Button>
              )}
            </Box>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={wordPairsError}
          autoHideDuration={5000}
          onClose={handleCloseAlert}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          sx={{ mt: '5vh' }}
        >
          <Alert
            onClose={handleCloseAlert}
            severity="error"
            sx={{ width: '100%', fontSize: '1.2rem', mt: '11vh' }}
          >
            Word pairs cannot be empty.
          </Alert>
        </Snackbar>
      </>
    );
}