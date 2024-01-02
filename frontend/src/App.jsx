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

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [signedIn, setSignedIn] = useState(false);

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
  });

  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      setSignedIn(true);
    }
  }, [])


  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
          <BrowserRouter>
            <TopAppBar darkMode={darkMode} handleThemeChange={() => setDarkMode(!darkMode)} signedIn={signedIn} setSignedIn={setSignedIn}/>
              <Routes>
                <Route path="/" element={<Home signedIn={signedIn}/>} />
                <Route path="/exercise/:id" element={<Exercise/>} />
                <Route path="/signin" element={<SignIn setSignedIn={setSignedIn}/>} />
                <Route path="/signup" element={<SignUp/>} />
                <Route path="/error" element={<ErrorPage/>} />
              </Routes>
          </BrowserRouter>
      </ThemeProvider>
    </>
  )
}

