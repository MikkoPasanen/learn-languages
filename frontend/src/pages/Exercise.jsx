import { Box, Typography, TextField, Button } from "@mui/material"
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function Exercise() {
    const { id } = useParams();
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
        console.log(data);
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
            <Box sx={{display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", mt: 7}}>
                <Typography variant="h4" sx={{mb: 3}}>Before the exercise:</Typography>
                <Typography variant="h5" sx={{mb: 3}}>Add toggle here for switching question type...</Typography>
                <Button onClick={handlePlay} variant="contained">Start</Button>
            </Box>
        );
    }

    if (currentQuestionIndex === wordPairs.length) {
        return (
            <>
                <Typography variant="h3">Your score: {score}/{wordPairs.length}</Typography>
            </>
        );
    }

    return (
     <Box>
            <Typography variant="h3">Translate the word:</Typography>
            <Typography variant="h5">{wordPairs[currentQuestionIndex].foreign_word}</Typography>
            <TextField
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
            />
            <Button onClick={handleNextQuestion}>Next</Button>
     </Box>
    )
}