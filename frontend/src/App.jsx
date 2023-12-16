import { useState } from "react";
import {createTheme, ThemeProvider} from "@mui/material/styles"
import { CssBaseline } from "@mui/material";
import Box from "@mui/material/Box"

import TopAppBar from"./components/TopAppBar.jsx"

export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      ...(darkMode ? {
        background: {
          default: "#121212",
        },
        text: {
          primary: "#fff",
        },
      } : {
        background: {
          default: "#fff",
        },
        text: {
          primary: "#000",
        },
      })
    },
  });

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ flexGrow: 1 }}>
          <TopAppBar darkMode={darkMode} handleThemeChange={() => setDarkMode(!darkMode)}/>
        </Box>
      </ThemeProvider>
    </>
  )
}

