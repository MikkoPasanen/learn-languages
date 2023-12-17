import { useState, useEffect } from "react";
import {createTheme, ThemeProvider} from "@mui/material/styles"
import { CssBaseline } from "@mui/material";
import Box from "@mui/material/Box"

import TopAppBar from"./components/TopAppBar.jsx"

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/home`);
    const data = await response.json();
    console.log(data);
    setExercises(data);
  };

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
  });

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ flexGrow: 1 }}>
          <TopAppBar darkMode={darkMode} handleThemeChange={() => setDarkMode(!darkMode)}/>
          {exercises.map((exercise) => (
            <div key={exercise.id}>{exercise.name}</div>
          ))}
        </Box>
      </ThemeProvider>
    </>
  )
}

