/**
 * @fileoverview App component is the main component of the application.
 * @requires react
 * @requires react-router-dom
 * @requires @mui/material
 * @requires @mui/material/styles
 * @requires Home
 *
 */

import { useState, useEffect } from "react";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Home from "./pages/Home.jsx";
import Exercise from "./pages/Exercise.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";
import TopAppBar from"./components/TopAppBar.jsx";
import SignIn from "./pages/SignIn.jsx";
import SignUp from "./pages/SignUp.jsx";


/**
 * App component - renders the main component of the application
 * @returns {JSX.Element} - Rendered component
*/
export default function App() {
  // State for the theme
  const [darkMode, setDarkMode] = useState(true);
  // State for the sign in status
  const [signedIn, setSignedIn] = useState(false);
  // State for the add exercise dialog
  const [openAddExercise, setOpenAddExercise] = useState(false);
  // State for the exercises
  const [exercises, setExercises] = useState([]);
  // State for the loading spinner
  const [loading, setLoading] = useState(true);
  // State for the unique categories
  const [categories, setCategories] = useState([]);
  // State for the unique languages
  const [languages, setLanguages] = useState([]);
  // State for the creators of the exercises
  const [madeBy, setMadeBy] = useState([]);
  // State for exercises filtered by mobile
  const [mobileFilteredExercises, setMobileFilteredExercises] = useState([]);

  // Create a theme with the dark or light mode
  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
  });

  /**
   * Effect hook for setting the signed in state and fetching exercises.
   * Runs once on component mount.
   */
  useEffect(() => {
    // Get the token from local storage or session storage
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    // If the token exists, set the signed in state to true
    if (token) {
      setSignedIn(true);
    }
    // Fetch the exercises
    fetchExercises();
  }, []);

  /**
   * Handles the reloading of the exercises by fetching them again
   * @async
  */
  const handleReload = async () => {
    fetchExercises();
  };

  /**
   * Fetches the exercises from the backend and sets the states
   * @async
   */
  const fetchExercises = async () => {
    // Send GET request to backend
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/home`);
    // Get the response as JSON
    const data = await response.json();
    setExercises(data);

    // Get the categories, languages and creators
    const categories = data.map((exercise) => exercise.category);
    const languages = data.map((exercise) => exercise.language);
    const madeBy = data.map((exercise) => exercise.made_by);

    // Set the states with the unique values
    setCategories([...new Set(categories)]);
    setLanguages([...new Set(languages)]);
    setMadeBy([...new Set(madeBy)]);
    setLoading(false);
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <TopAppBar
            darkMode={darkMode}
            handleThemeChange={() => setDarkMode(!darkMode)}
            signedIn={signedIn}
            setSignedIn={setSignedIn}
            setOpenAddExercise={setOpenAddExercise}
            categories={categories}
            languages={languages}
            madeBy={madeBy}
            exercises={exercises}
            setMobileFilteredExercises={setMobileFilteredExercises}
          />
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  signedIn={signedIn}
                  openAddExercise={openAddExercise}
                  setOpenAddExercise={setOpenAddExercise}
                  categories={categories}
                  languages={languages}
                  madeBy={madeBy}
                  exercises={exercises}
                  loading={loading}
                  handleReload={handleReload}
                  mobileFilteredExercises={mobileFilteredExercises}
                  handleThemeChange={() => setDarkMode(!darkMode)}
                  darkMode={darkMode}
                />
              }
            />
            <Route
              path="/exercise/:id"
              element={<Exercise />}
            />
            <Route
              path="/signin"
              element={<SignIn setSignedIn={setSignedIn} />}
            />
            <Route
              path="/signup"
              element={<SignUp />}
            />
            <Route
              path="*"
              element={<ErrorPage />}
            />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </>
  );
}

