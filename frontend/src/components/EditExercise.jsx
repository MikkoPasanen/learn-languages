/* eslint-disable react/prop-types */

/**
 * @fileoverview Edit exercise component. This component is used to edit an exercise.
 * @component
 * @requires NPM:@mui/material
 * @requires NPM:react
 * @requires ../data/languages
 */
import { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Divider,
  TextField,
  Autocomplete,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';

import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';

import languages from '../data/languages';

/**
 * Edit exercise component
 * @param {Object} props
 * @param {string} props.exerciseId Exercise ID
 * @param {string} props.exerciseName Exercise name
 * @param {string} props.exerciseCategory Exercise category
 * @param {string} props.exerciseLanguage Exercise language
 * @param {Array} props.categories Categories array
 * @param {function} props.handleReload Function to reload the exercises
 * @returns {JSX.Element} Edit exercise component
*/
export default function EditExercise({
                          exerciseId,
                          exerciseName,
                          exerciseCategory,
                          exerciseLanguage,
                          categories,
                          handleReload,}) {

    // State for the active step
    const [activeStep, setActiveStep] = useState(0);
    // Language options array
    const languageOptions = languages.map((language) => language.name);

    // Get the token from the local storage or session storage to make requests to the API
    const token =
        localStorage.getItem('token') || sessionStorage.getItem('token');

    // States for the exercise info
    const [name, setName] = useState(exerciseName);
    const [category, setCategory] = useState(exerciseCategory);
    const [language, setLanguage] = useState(exerciseLanguage);

    // States for the word pairs
    const [wordPairs, setWordPairs] = useState(null);
    const [originalWordPairs, setOriginalWordPairs] = useState(null);
    const [wordPairsToDelete, setWordPairsToDelete] = useState([]);

    // States for the errors
    const [nameError, setNameError] = useState(false);
    const [categoryError, setCategoryError] = useState(false);
    const [languageError, setLanguageError] = useState(false);
    const [wordPairsError, setWordPairsError] = useState(false);

    // State for the loading state
    const [loading, setLoading] = useState(false);
    // State for the dialog open state
    const [open, setOpen] = useState(false);
    // Steps array for the stepper
    const steps = ['Exercise info', 'Word pairs', 'Check and save'];

    /**
     * Handle the dialog open, fetch the word pairs
     * @async
     * @returns {Promise<void>}
     *
    */
    const handleOpenDialog = async () => {
        setOpen(true);
        await fetchWordPairs(exerciseId);
    };

    /**
     * Handle the dialog close, reset the states
     */
    const handleCloseDialog = () => {
        setActiveStep(0);
        setOpen(false);
        setNameError(false);
        setCategoryError(false);
        setLanguageError(false);
        setWordPairsError(false);
        setLoading(false);
        setWordPairs(wordPairs);
        setName(exerciseName);
        setCategory(exerciseCategory);
        setLanguage(exerciseLanguage);
        setWordPairsToDelete([]);
        setOriginalWordPairs(null);
    };

    /**
     * Handle the next step of the stepper
     */
    const handleNext = () => {
      // If the active step is 0, check if the name, category and language are valid
      // If the active step is 1, check if the word pairs are valid
      // If the active step is 2, save the exercise
        if (activeStep < 2) {
        if (
            activeStep === 0 &&
            isValidName() &&
            isValidCategory() &&
            isValidLanguage()
        ) {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        } else if (activeStep === 1 && isValidWordPairs()) {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }
        }
    };

    /**
     * Handle the alert close
     * @param {Object} event Event object that triggered the function
     * @param {string} reason Reason why the alert closed
    */
    const handleCloseAlert = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setWordPairsError(false);
    };

    /**
     * Handle the back step of the stepper
     * If the active step is greater than 0, go back one step
    */
    const handleBack = () => {
        if (activeStep > 0) {
            setActiveStep((prevActiveStep) => prevActiveStep - 1);
        }
    };

    /**
     * Check if the name is valid
     * @returns {boolean} Whether the name is valid or not
    */
    const isValidName = () => {
        if (exerciseName === '') {
            setNameError(true);
            return false;
        } else {
            setNameError(false);
            return true;
        }
    };

    /**
     * Check if the category is valid
     * @returns {boolean} Whether the category is valid or not
     */
    const isValidCategory = () => {
        if (category === '') {
            setCategoryError(true);
            return false;
        } else {
            setCategoryError(false);
            return true;
        }
    };

    /**
     * Check if the language is valid
     * @returns {boolean} Whether the language is valid or not
     */
    const isValidLanguage = () => {
        if (language === null) {
            setLanguageError(true);
            return false;
        } else {
            setLanguageError(false);
            return true;
        }
    };

    /**
     * Check if the word pairs are valid
     * @returns {boolean} Whether the word pairs are valid or not
     */
    const isValidWordPairs = () => {
        if (wordPairs.some((pair) => pair.english === '' || pair.foreign === '')) {
        setWordPairsError(true);
        return false;
        } else {
        setWordPairsError(false);
        return true;
        }
    };

    /**
     * Handle the word change of the word pairs
     * @param {Object} e Event object that triggered the function
     * @param {number} index Index of the word pair
     * @param {string} language Language of the word pair
     */
   const handleWordChange = (e, index, language) => {
     const newWordPairs = [...wordPairs];
     newWordPairs[index][language] = e.target.value;
     setWordPairs(newWordPairs);
   };

    /**
     * Handle the add pair button
     * Add a new empty word pair to the word pairs array
    */
    const handleAddPair = () => {
        setWordPairs([...wordPairs, { english: '', foreign: '' }]);
    };

    /**
     * Handle the remove pair button
     * @param {number} index Index of the word pair
     * Remove the word pair from the word pairs array
     */
    const handleRemovePair = (index) => {
      // If the word pairs array has more than one word pair, remove the word pair from the word pairs array
        if (wordPairs.length > 1) {
          // If the word pair has an ID, add the ID to the word pairs to delete array to delete the word pair from the database
            if(wordPairs[index].id !== undefined) {
                const idToDelete = wordPairs[index].id;
                setWordPairsToDelete((prevWordPairsToDelete) => [...prevWordPairsToDelete, idToDelete]);
            }
            // Remove the word pair from the word pairs array
            const newWordPairs = [...wordPairs];
            newWordPairs.splice(index, 1);
            setWordPairs(newWordPairs);
        }
    };

    /**
     * Fetch the word pairs
     * @async
     * @param {string} id Exercise ID
     * @returns {Promise<void>}
     */
    const fetchWordPairs = async (id) => {
      // Fetch the word pairs from the database and set the word pairs and original word pairs states
        const hr = await fetch(
            `${import.meta.env.VITE_API_URL}/api/exercise/${id}`,
        );
        const data = await hr.json();
        const wordPairs = data.map((pair) => {
            return {
            id: pair.id,
            english: pair.english_word,
            foreign: pair.foreign_word,
            };
        });
        setWordPairs(wordPairs);

        // Create a copy of the word pairs array to compare the word pairs later
        setOriginalWordPairs(JSON.parse(JSON.stringify(wordPairs)));
    };

    /**
     * Handle the save exercise button
     * @async
     * @returns {Promise<void>}
     */
    const handleSaveExercise = async () => {
        // If the word pairs are valid, save the exercise
        setLoading(true);

        let wordPairsToUpdate = [];
        let wordPairsToAdd = [];

        // Check if pairs exist in the original word pairs array
        wordPairs.forEach((pair) => {
          // If the pair exists, add it to the word pairs to update array
            if (pair.id) {
                wordPairsToUpdate.push(pair);
            // If the pair doesn't exist, add it to the word pairs to add array
            } else {
                wordPairsToAdd.push(pair);
            }
        });

        // Format the date to dd/mm/yyyy so it can be saved in the database
        const currentDate = new Date();
        const formattedDate = `${currentDate
          .getDate()
          .toString()
          .padStart(2, '0')}/${(currentDate.getMonth() + 1)
          .toString()
          .padStart(2, '0')}/${currentDate.getFullYear().toString()}`;

        // Send a PUT request to the API to update the exercise
        const hr = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/edit-exercise/${exerciseId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                name,
                category,
                language,
                wordPairsToUpdate,
                wordPairsToAdd,
                wordPairsToDelete,
                modified: formattedDate,
            }),
        });

        const json = await hr.json();

        // If the request was successful, reload the exercises and close the dialog
        if (json.success) {
          // If the word pairs are different from the original word pairs, remove the total score and the user score from the local storage
            if (JSON.stringify(wordPairs) !== JSON.stringify(originalWordPairs)) {
                localStorage.removeItem(`${exerciseId}-totalScore`);
                localStorage.removeItem(`${exerciseId}-userScore`);
            }
            handleReload();
            handleCloseDialog();
        } else {
            setLoading(false);
        }
    };

    /**
     * Render edit exercise component
     * @returns {JSX.Element} Edit exercise component
     */
  return (
    <>
      <IconButton
        sx={{ padding: 0 }}
        onClick={(e) => {
          e.stopPropagation();
          handleOpenDialog();
        }}
      >
        <EditIcon sx={{ fontSize: 15}} />
        <Typography
          sx={{ ml: 1, fontSize: 15, fontWeight: 'bold' }}
        >
          Edit
        </Typography>
      </IconButton>
      <Dialog
        open={open}
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
            Edit {exerciseName}
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
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
                />
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
                />
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
                <Typography sx={{ mb: 0.5 }}>{name}</Typography>
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
