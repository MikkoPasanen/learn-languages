import { Box, Typography, TextField, Button, ToggleButton, ToggleButtonGroup,
          Card, CardHeader, CardContent, CardActions,
          Table, TableBody, TableHead, TableRow, TableCell,
          TableContainer} from "@mui/material"
import { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";

export default function Exercise() {
    const { id } = useParams();
    const location = useLocation();
    const exerciseName = location.state?.exerciseName || "Exercise";
    const exerciseLanguage = location.state?.language || "Foreign";
    const [wordPairs, setWordPairs] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(null);
    const [score, setScore] = useState(0);
    const [answer, setAnswer] = useState("");
    const [answerLanguage, setAnswerLanguage] = useState('english');
    const [answeredQuestions , setAnsweredQuestions] = useState([]);

    const handleLanguageChange = (event, newLanguage) => {
      setAnswerLanguage(newLanguage);
    };

    useEffect(() => {
        fetchWordPairs(id);
    }, [id]);

    const fetchWordPairs = async (id) => {
        const hr = await fetch(`${import.meta.env.VITE_API_URL}/api/exercise/${id}`);
        const data = await hr.json();
        setWordPairs(data);
    };

    const handlePlay = () => {
        setCurrentQuestionIndex(0);
    };

    const handleNextQuestion = () => {
        let correct;
        if (answerLanguage === "english") {
            correct = answer.toLowerCase() === wordPairs[currentQuestionIndex].english_word.toLowerCase();
        } else {
            correct = answer.toLowerCase() === wordPairs[currentQuestionIndex].foreign_word.toLowerCase();
        }

        if (correct) {
          setScore(score + 1);
        }

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

    if (currentQuestionIndex === wordPairs.length) {
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
          <Link to="/">
            <Button variant="contained">
              <Typography sx={{ fontWeight: 'bold' }}>Go back home</Typography>
            </Button>
          </Link>
        </Box>
      );
    }

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
              sx={{ borderRadius: 2, fontWeight: 'bold', fontSize: 16}}
            >
              Next
            </Button>
          </CardActions>
        </Card>
      </Box>
    );
}