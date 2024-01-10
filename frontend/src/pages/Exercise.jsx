/**
 * @fileoverview Exercise page component
 * @component
 * @description This component renders the exercise page and handles the logic
 * for the exercise.
 * @requires NPM:react
 * @requires NPM:@mui/material
 * @requires NPM:react-router-dom
 */

import { Box, Typography, TextField, Button, ToggleButton, ToggleButtonGroup,
          Card, CardHeader, CardContent, CardActions,
          Table, TableBody, TableHead, TableRow, TableCell,
          TableContainer} from "@mui/material"
import { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";

/**
 * Exercise page component - renders the exercise page and handles the logic
 * @returns {JSX.Element} Exercise page component
 */
export default function Exercise() {
    // Get the exercise id from the url
    const { id } = useParams();
    // Get the exercise name and language from the location state
    const location = useLocation();
    const exerciseName = location.state?.exerciseName || "Exercise";
    const exerciseLanguage = location.state?.language || "Foreign";

    // Word pairs contain the words to be translated
    const [wordPairs, setWordPairs] = useState([]);
    // Current question index is the index of the current word pair
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(null);
    // Score is the number of correct answers
    const [score, setScore] = useState(0);
    // Answer is the user's answer
    const [answer, setAnswer] = useState("");
    // Answer language is the language the user is answering in
    const [answerLanguage, setAnswerLanguage] = useState('english');
    // Answered questions is an array of objects containing the word and whether the answer was correct
    const [answeredQuestions , setAnsweredQuestions] = useState([]);

    /**
     * Handles the change of the answer language
     * @param {Event} event - The event that triggered the change
     * @param {string} newLanguage - The new language
    */
    const handleLanguageChange = (event, newLanguage) => {
      setAnswerLanguage(newLanguage);
    };

    /**
     * Fetches the word pairs from the backend when the component is mounted
     */
    useEffect(() => {
        fetchWordPairs(id);
    }, [id]);

    /**
     * Fetches the word pairs from the backend and sets the word pairs state
     * @param {string} id - The id of the exercise
     */
    const fetchWordPairs = async (id) => {
        const hr = await fetch(`${import.meta.env.VITE_API_URL}/api/exercise/${id}`);
        const data = await hr.json();
        setWordPairs(data);
    };

    /**
     * Handles the start of the exercise by setting the current question index from null to 0
    */
    const handlePlay = () => {
        setCurrentQuestionIndex(0);
    };

    /**
     * Handles the play again button by resetting the states
    */
    const handlePlayAgain = () => {
        setCurrentQuestionIndex(null);
        setScore(0);
        setAnsweredQuestions([]);
        setAnswer("");
    };

    /**
     * Handles the next question button by checking if the answer is correct and
     * updating the score and answered questions states accordingly
     */
    const handleNextQuestion = () => {
        let correct;
        // Check if the answer is correct depending on the answer language
        if (answerLanguage === "english") {
            correct = answer.toLowerCase() === wordPairs[currentQuestionIndex].english_word.toLowerCase();
        } else {
            correct = answer.toLowerCase() === wordPairs[currentQuestionIndex].foreign_word.toLowerCase();
        }

        // Add 1 to the score if the answer is correct
        if (correct) {
          setScore(score + 1);
        }

        // Save the word and whether the answer was correct to the answered questions state
        const wordToSave =
          answerLanguage === "english"
          ? wordPairs[currentQuestionIndex].foreign_word
          : wordPairs[currentQuestionIndex].english_word;

        setAnsweredQuestions([...answeredQuestions, {
          word : wordToSave,
          correct: correct,
        }]);

        setAnswer("");
        setCurrentQuestionIndex(currentQuestionIndex + 1);
    };

    /**
     * If the current question index is null, render the start exercise page.
     * @returns {JSX.Element} Start exercise page
     */
    if (currentQuestionIndex === null) {
        return (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              mt: '120px',
            }}
          >
            <Typography
              variant="h4"
              sx={{ mb: 3 }}
            >
              {exerciseName}
            </Typography>
            <Typography
              variant="h5"
              sx={{ mb: 3 }}
            >
              Choose how you want to answer
            </Typography>
            <ToggleButtonGroup
              value={answerLanguage}
              exclusive
              onChange={handleLanguageChange}
              sx={{ mb: 3 }}
            >
              <ToggleButton
                value="english"
                aria-label="english"
              >
                <strong>English</strong>
              </ToggleButton>
              <ToggleButton
                value="foreign"
                aria-label="foreign"
              >
                <strong>{exerciseLanguage}</strong>
              </ToggleButton>
            </ToggleButtonGroup>
            <Button
              onClick={handlePlay}
              variant="contained"
            >
              Start exericse
            </Button>
          </Box>
        );
    }

    /**
     * If the current question index is equal to the length of the word pairs,
     * render the end exercise page.
     * @returns {JSX.Element} End exercise page
    */
    if (currentQuestionIndex === wordPairs.length) {
      // Save the score to local storage if it is higher than the previous score
      if (
        localStorage.getItem(`${id}-userScore`) === null ||
        localStorage.getItem(`${id}-userScore`) < score
        ) {
          localStorage.setItem(`${id}-userScore`, score);
        }

      localStorage.setItem(`${id}-totalScore`, wordPairs.length);

      return (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            mt: '100px',
          }}
        >
          <Typography
            variant="h5"
            sx={{ mb: 1 }}
          >
            You scored: {score}/{wordPairs.length}
          </Typography>
          <Typography sx={{ mb: 3 }}>
            {score === 0
              ? 'Better luck next time!'
              : score === wordPairs.length
                ? 'Perfect!'
                : 'You can do better!'}
          </Typography>
          <TableContainer sx={{ width: 300, mb: 5 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">Word</TableCell>
                  <TableCell align="center">Correct</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {answeredQuestions.map((question, index) => (
                  <TableRow key={index}>
                    <TableCell align="center">{question.word}</TableCell>
                    <TableCell align="center">
                      {question.correct ? '✅' : '❌'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box>
            <Link to="/">
              <Button variant="contained">
                <Typography sx={{ fontWeight: 'bold' }}>Go back home</Typography>
              </Button>
            </Link>
            <Button
              onClick={handlePlayAgain}
              variant="contained"
              sx={{ ml: 2 }}
            >
              <Typography sx={{ fontWeight: 'bold' }}>Play again</Typography>
            </Button>
          </Box>
        </Box>
      );
    }

    /**
     * Render the exercise page.
     * The exercise page contains the current word pair and a text field for
     * the user to type in their answer.
     * @returns {JSX.Element} Exercise page
     */
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          mt: '100px',
        }}
      >
        <Card>
          <CardHeader
            sx={{ borderRadius: 4, width: 400 }}
            title={'Translate the word'}
            action={`Question: ${currentQuestionIndex + 1}/${wordPairs.length}`}
          ></CardHeader>
          <CardContent
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',

            }}
          >
            <Typography
              variant="h4"
              sx={{ mb: 3 }}
            >
              {answerLanguage === 'english'
                ? wordPairs[currentQuestionIndex].foreign_word
                : wordPairs[currentQuestionIndex].english_word}
            </Typography>
            <TextField
              label="Answer"
              variant="outlined"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
          </CardContent>
          <CardActions
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mb: 1,
            }}
          >
            <Button
              onClick={handleNextQuestion}
              sx={{
                borderRadius: 2,
                fontWeight: 'bold',
                fontSize: 16,
                mt: 2
              }}
            >
              Next
            </Button>
          </CardActions>
        </Card>
      </Box>
    );
}