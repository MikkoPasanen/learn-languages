import { Box, Typography, TextField, Button } from "@mui/material"
import { useState, useEffect } from "react";

export default function Exercise({ id }) {
    const [wordPairs, setWordPairs] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(null);
    const [score, setScore] = useState(0);
    const [answer, setAnswer] = useState("");

    return (
        <>
        <Box>
            <Typography variant="h3">Exercise</Typography>
        </Box>
        </>
    )
}