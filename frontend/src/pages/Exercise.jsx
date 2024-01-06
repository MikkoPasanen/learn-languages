import { Box, Typography, TextField, Button } from "@mui/material"
import { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";

export default function Exercise() {
    const { id } = useParams();
    const location = useLocation();
    const exerciseName = location.state?.exerciseName || "Exercise";
    const [wordPairs, setWordPairs] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(null);
    const [score, setScore] = useState(0);
    const [answer, setAnswer] = useState("");

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
        if (answer === wordPairs[currentQuestionIndex].finnish_word) {
            setScore(score + 1);
        }

        setAnswer("");
        setCurrentQuestionIndex(currentQuestionIndex + 1);
    };

    if (currentQuestionIndex === null) {
        return (
            <Box sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                mt: '100px'
            }}>
                <Typography variant="h4" sx={{mb: 3}}>{exerciseName}</Typography>
                <Typography variant="h5" sx={{mb: 3}}>Add toggle here for switching question type...</Typography>
                <Button onClick={handlePlay} variant="contained">Start</Button>
            </Box>
        );
    }

    if (currentQuestionIndex === wordPairs.length) {
        localStorage.setItem(`${id}-totalScore`, wordPairs.length);
        localStorage.setItem(`${id}-userScore`, score);
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
              sx={{ mb: 3 }}
            >
              You scored: {score}/{wordPairs.length}
            </Typography>
            <Link to="/">
              <Button variant="contained">
                <Typography sx={{ fontWeight: 'bold' }}>
                  Go back home
                </Typography>
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
        <Typography
          variant="h4"
          sx={{ mb: 3 }}
        >
          Translate the word:
        </Typography>
        <Typography
          variant="h5"
          sx={{ mb: 2 }}
        >
          {wordPairs[currentQuestionIndex].foreign_word}
        </Typography>
        <TextField
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          sx={{ mb: 3 }}
          size="small"
          placeholder="Your answer"
        />
        <Button
          onClick={handleNextQuestion}
          variant="contained"
        >
          Next
        </Button>
      </Box>
    );
}