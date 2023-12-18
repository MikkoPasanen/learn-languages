import { useState } from "react";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Home from "./pages/Home.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";
import TopAppBar from"./components/TopAppBar.jsx";

export default function App() {
  const [darkMode, setDarkMode] = useState(true);

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
                <Route path="/" element={<Home/>} />
                <Route path="*" element={<ErrorPage/>} />
              </Routes>
          </BrowserRouter>
      </ThemeProvider>
    </>
  )
}

