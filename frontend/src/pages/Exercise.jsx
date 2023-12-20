import { Box, Typography, TextField, Button } from "@mui/material"
import { useState, useEffect } from "react";

export default function Exercise({ id }) {
    const [wordPairs, setWordPairs] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(null);
    const [score, setScore] = useState(0);
    const [answer, setAnswer] = useState("");

    useEffect(() => {
        fetchWordPairs();
    });

    const fetchWordPairs = async () => {
        const hr = await fetch(`${import.meta.env.VITE_API_URL}/api/exercise/${id}`);
        const data = await hr.json();
        setWordPairs(data);
    };


    return (
        <>
        <Box>
            <Typography variant="h3">Exercise</Typography>
        </Box>
        </>
    )
}