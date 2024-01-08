/* eslint-disable react/prop-types */
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

export default function AddExercise({
    exerciseId,
    exerciseName,
    exerciseCategory,
    exerciseLanguage,
    categories,
    handleReload,
}) {
    const [activeStep, setActiveStep] = useState(0);
    const languageOptions = languages.map((language) => language.name);

    const token =
        localStorage.getItem('token') || sessionStorage.getItem('token');

    const [name, setName] = useState(exerciseName);
    const [category, setCategory] = useState(exerciseCategory);
    const [language, setLanguage] = useState(exerciseLanguage);

    const [wordPairs, setWordPairs] = useState(null);
    const [originalWordPairs, setOriginalWordPairs] = useState(null);
    const [wordPairsToDelete, setWordPairsToDelete] = useState([]);

    const [nameError, setNameError] = useState(false);
    const [categoryError, setCategoryError] = useState(false);
    const [languageError, setLanguageError] = useState(false);
    const [wordPairsError, setWordPairsError] = useState(false);

    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);


    const steps = ['Exercise info', 'Word pairs', 'Check and save'];

    const handleOpenDialog = async () => {
        setOpen(true);
        await fetchWordPairs(exerciseId);
    };

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

    const handleNext = () => {
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

    const handleCloseAlert = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setWordPairsError(false);
    };

    const handleBack = () => {
        if (activeStep > 0) {
            setActiveStep((prevActiveStep) => prevActiveStep - 1);
        }
    };

    const isValidName = () => {
        if (exerciseName === '') {
            setNameError(true);
            return false;
        } else {
            setNameError(false);
            return true;
        }
    };

    const isValidCategory = () => {
        if (category === '') {
            setCategoryError(true);
            return false;
        } else {
            setCategoryError(false);
            return true;
        }
    };

    const isValidLanguage = () => {
        if (language === null) {
            setLanguageError(true);
            return false;
        } else {
            setLanguageError(false);
            return true;
        }
    };

    const isValidWordPairs = () => {
        if (wordPairs.some((pair) => pair.english === '' || pair.foreign === '')) {
        setWordPairsError(true);
        return false;
        } else {
        setWordPairsError(false);
        return true;
        }
    };

    const handleWordChange = (e, index, language) => {
        const newWordPairs = [...wordPairs];
        newWordPairs[index][language] = e.target.value;
        setWordPairs(newWordPairs);
    };

    const handleAddPair = () => {
        setWordPairs([...wordPairs, { english: '', foreign: '' }]);
    };

    const handleRemovePair = (index) => {
        if (wordPairs.length > 1) {
            if(wordPairs[index].id !== undefined) {
                const idToDelete = wordPairs[index].id;
                setWordPairsToDelete((prevWordPairsToDelete) => [...prevWordPairsToDelete, idToDelete]);
            }
            const newWordPairs = [...wordPairs];
            newWordPairs.splice(index, 1);
            setWordPairs(newWordPairs);
        }
    };

    const fetchWordPairs = async (id) => {
        const hr = await fetch(
            `${import.meta.env.VITE_API_URL}/api/exercise/${id}`,
        );
        const data = await hr.json();
        const wordPairs = data.map((pair) => {
            return {
            id: pair.id,
            english: pair.foreign_word,
            foreign: pair.finnish_word,
            };
        });
        setWordPairs(wordPairs);
        setOriginalWordPairs(JSON.parse(JSON.stringify(wordPairs)));
    };

    const handleSaveExercise = async () => {
        setLoading(true);

        let wordPairsToUpdate = [];
        let wordPairsToAdd = [];

        wordPairs.forEach((pair) => {
            if (pair.id) {
                wordPairsToUpdate.push(pair);
            } else {
                wordPairsToAdd.push(pair);
            }
        });

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
            }),
        });

        const json = await hr.json();

        if (json.success) {
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
