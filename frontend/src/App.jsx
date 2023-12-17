import { useState, useEffect } from "react";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Home from "./pages/Home.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";
import TopAppBar from"./components/TopAppBar.jsx";

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/home`);
    const data = await response.json();
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
          <BrowserRouter>
            <TopAppBar darkMode={darkMode} handleThemeChange={() => setDarkMode(!darkMode)}/>
              <Routes>
                <Route path="/" element={<Home exercises={exercises}/>} />
                <Route path="*" element={<ErrorPage/>} />
              </Routes>
          </BrowserRouter>
      </ThemeProvider>
    </>
  )
}

