/**
 * @fileoverview Sign up page component
 * @component
 * @description Renders the sign up page and handles the sign up process
 * @requires react
 * @requires react-router-dom
 * @requires @mui/material
 * @requires @mui/material/styles
 * @requires @mui/icons-material/LockOutlined
 */

import { Link as RouterLink, useNavigate } from 'react-router-dom';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useState } from 'react';
import { IconButton, InputAdornment, TextField,
        Avatar, Button, CssBaseline, Container,
        Typography, Box, Grid, Link, Snackbar,
        Alert, CircularProgress} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

/**
 * Sign up page component - renders the sign up form
 * @returns {JSX.Element} - Rendered component
 */
export default function SignUp() {
  // State for the username error
  const [nameError, setNameError] = useState(false);
  // State for the password error
  const [passwordError, setPasswordError] = useState(false);
  // State for the password repeat error
  const [passwordRepeatError, setPasswordRepeatError] = useState(false);
  // State for the password visibility
  const [showPassword, setShowPassword] = useState(false);
  // State for the password repeat visibility
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  // State for the success snackbar
  const [openSuccess, setOpenSuccess] = useState(false);
  // State for the error snackbar
  const [openError, setOpenError] = useState(false);
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

    setOpenSuccess(false);
    setOpenError(false);
  };

  /**
   * Handles the sign up form submit
   * @param {Event} event - The event that triggered the function
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    // Create a new FormData object from the form
    const data = new FormData(event.currentTarget);

    // Validate the username, password and password repeat
    const isValidUserName = validateUsername(data.get('username'));
    const isValidPassword = validatePassword(data.get('password'));
    const isValidPasswordCheck = validatePasswordRepeat(
      data.get('password'),
      data.get('repeat-password'),
    );

    // If all the fields are valid, send the sign up request
    if (isValidUserName && isValidPassword && isValidPasswordCheck) {
      setLoading(true);

      // Send POST request to backend
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/credentials/signup`,
        {
          method: 'POST',
          body: JSON.stringify({
            username: data.get('username'),
            password: data.get('password'),
          }),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        },
      );

      // Get the response as JSON
      const responseData = await response.json();

      // If the response is success, redirect to sign in page
      if (responseData.affectedRows === 1) {
        setOpenSuccess(true);
        // Redirect to sign in page after 5 seconds
        setTimeout(() => {
          navigate('/signin');
        }, 5000);
      }
      // If the response is not success, show the error snackbar
      if (responseData.userExists) {
        setOpenError(true);
      }
      setLoading(false);
    }
  };

  /**
   * Validates the username
   * @param {string} username - The username to validate
   * @returns {boolean} - True if the username is valid, false otherwise
   */
  const validateUsername = (username) => {
    if (username.length < 3) {
      setNameError(true);
      return false;
    }

    setNameError(false);
    return true;
  };

  /**
   * Validates the password
   * @param {string} password - The password to validate
   * @returns {boolean} - True if the password is valid, false otherwise
   */
  const validatePassword = (password) => {
    if (password.length < 8) {
      setPasswordError(true);
      return false;
    }

    setPasswordError(false);
    return true;
  };

  /**
   * Validates the password repeat
   * @param {string} password - The password to validate
   * @param {string} passwordRepeat - The password repeat to validate
   * @returns {boolean} - True if the password repeat is valid, false otherwise
  */
  const validatePasswordRepeat = (password, passwordRepeat) => {
    if (password !== passwordRepeat) {
      setPasswordRepeatError(true);
      return false;
    }

    setPasswordRepeatError(false);
    return true;

  };

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
            marginBottom: 5,
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
          >
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid
              container
              spacing={2}
            >
              <Grid
                item
                xs={12}
              >
                <TextField
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  helperText="Username must be at least 3 characters long"
                  error={nameError}
                />
              </Grid>
              <Grid
                item
                xs={12}
              >
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  helperText="Password must be at least 8 characters long"
                  error={passwordError}
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
              </Grid>
              <Grid
                item
                xs={12}
              >
                <TextField
                  required
                  fullWidth
                  name="repeat-password"
                  label="Password again"
                  type={showRepeatPassword ? 'text' : 'password'}
                  id="repeat-password"
                  error={passwordRepeatError}
                  helperText={
                    passwordRepeatError ? "Passwords don't match" : null
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() =>
                            setShowRepeatPassword(!showRepeatPassword)
                          }
                          onMouseDown={(e) => e.preventDefault()}
                        >
                          {showRepeatPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {loading ? (
                <>
                  Signing up...
                  <CircularProgress
                    size={20}
                    sx={{ ml: 2 }}
                    color="inherit"
                  />
                </>
              ) : (
                'Sign Up'
              )}
            </Button>
            <Grid
              container
              justifyContent="flex-start"
            >
              <Grid item>
                <Link
                  component={RouterLink}
                  to="/signin"
                  variant="body2"
                >
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
      <Snackbar
        open={openSuccess}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center', mt: '5vh' }}
      >
        <Alert
          onClose={handleClose}
          severity="success"
          sx={{ width: '100%', fontSize: '1.2rem', mt: '10vh' }}
        >
          Successfully signed up!
          <br />
          Redirecting to sign in page...
        </Alert>
      </Snackbar>
      <Snackbar
        open={openError}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleClose}
          severity="error"
          sx={{ width: '100%', fontSize: '1.2rem', mt: '10vh' }}
        >
          A user with this username already exists.
        </Alert>
      </Snackbar>
    </>
  );
}
