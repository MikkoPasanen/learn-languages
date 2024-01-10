/* eslint-disable react/prop-types */
/**
 * @fileoverview SignIn page component
 * @description This component renders the sign in form and handles the sign in process
 * @component
 * @requires npm:@mui/material
 * @requires npm:@mui/icons-material
 * @requires npm:@react-router-dom
 * @requires npm:react
 * @returns {JSX.Element} - Rendered component
 */

import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {
  IconButton,
  InputAdornment,
  TextField,
  Link,
  Grid,
  Box,
  Typography,
  Container,
  Checkbox,
  FormControlLabel,
  CssBaseline,
  Avatar,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

/**
 * SignIn component - renders the sign in form
 * @param {Function} props.setSignedIn - Function to set the signed in state
 * @returns {React.Component} - Returns the component
 */
export default function SignIn({ setSignedIn }) {
  // State for the password visibility
  const [showPassword, setShowPassword] = useState(false);

  // State for the snackbar
  const [open, setOpen] = useState(false);

  // State for the loading spinner
  const [loading, setLoading] = useState(false);

  // Hook for navigation
  const navigate = useNavigate();

  /**
   * Handles the closing of the snackbar
   * @param {Event} event - The event that triggered the function
   * @param {string} reason - The reason for the function call
   */
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  /**
   * Handles the submission of the sign in form
   * @param {Event} event - The event that triggered the function
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    // Create a new FormData object from the form
    const data = new FormData(event.currentTarget);

    // Send POST request to backend
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/credentials/signin`,
      {
        method: 'POST',
        body: JSON.stringify({
          username: data.get('username'),
          password: data.get('password'),
          remember: data.get('remember'),
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      },
    );

    // Get the response as JSON
    const json = await response.json();

    // If the response is success
    if (json.success) {
      // Store the token and username in local or session storage depending on the remember me checkbox
      if (data.get('remember')) {
        localStorage.setItem('token', json.token);
        localStorage.setItem('username', data.get('username'));
      } else {
        sessionStorage.setItem('username', data.get('username'));
        sessionStorage.setItem('token', json.token);
      }
      // Set the signed in state to true and navigate to the home page
      setSignedIn(true);
      setLoading(false);
      navigate('/');
    } else {
      // If the response is not success, show the error snackbar
      setOpen(true);
      setLoading(false);
    }
  };

  /**
   * Renders the SignIn component.
   * @returns {JSX.Element} The rendered SignIn component.
   */
  return (
    <>
      <Container
        component="main"
        maxWidth="xs"
      >
        <CssBaseline />
        <Box
          sx={{
            marginTop: '90px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography
            component="h1"
            variant="h5"
            sx={{ mb: 1 }}
          >
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              sx={{ mt: 0 }}
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  value="remember"
                  color="primary"
                  name="remember"
                />
              }
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {loading ? (
                <>
                  Signing in...
                  <CircularProgress
                    size={20}
                    sx={{ ml: 2 }}
                    color="inherit"
                  />
                </>
              ) : (
                'Sign In'
              )}
            </Button>
            <Grid container>
              <Grid item>
                <Link
                  component={RouterLink}
                  to="/signup"
                  variant="body2"
                >
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
      <Snackbar
        open={open}
        autoHideDuration={8000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleClose}
          severity="error"
          sx={{ width: '100%', fontSize: '1.2rem', mt: '10vh' }}
        >
          Invalid username or password.
        </Alert>
      </Snackbar>
    </>
  );
}
