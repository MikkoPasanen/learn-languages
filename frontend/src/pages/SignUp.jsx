import { Link as RouterLink } from 'react-router-dom';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useState } from 'react';
import { IconButton, InputAdornment, TextField, Avatar, Button, CssBaseline, Container, Typography, Box, Grid, Link, Snackbar, Alert} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

export default function SignUp() {
  const [nameError, setNameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [passwordRepeatError, setPasswordRepeatError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openError, setOpenError] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSuccess(false);
    setOpenError(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const isValidUserName = validateUsername(data.get('username'));
    const isValidPassword = validatePassword(data.get('password'));
    const isValidPasswordCheck = validatePasswordRepeat(data.get('password'), data.get('repeat-password'));

    if (isValidUserName && isValidPassword && isValidPasswordCheck) {

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/signup`, {
        method: 'POST',
        body: JSON.stringify({
          username: data.get('username'),
          password: data.get('password'),
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });

      const responseData = await response.json();

      if (responseData.affectedRows === 1) {
        setOpenSuccess(true);
      }
      if (responseData.userExists) {
        setOpenError(true);
      }
    }
  };

  const validateUsername = (username) => {
    if (username.length < 3) {
      setNameError(true);
      return false;
    }

    setNameError(false);
    return true;
  };

  const validatePassword = (password) => {
    if (password.length < 8) {
      setPasswordError(true);
      return false;
    }

    setPasswordError(false);
    return true;
  };

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
            marginTop: 3,
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
              Sign Up
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
        autoHideDuration={8000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleClose}
          severity="success"
          sx={{ width: '100%' }}
        >
          Successfully signed up! You can now sign in.
        </Alert>
      </Snackbar>
      <Snackbar
        open={openError}
        autoHideDuration={8000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleClose}
          severity="error"
          sx={{ width: '100%' }}
        >
          A user with this username already exists.
        </Alert>
      </Snackbar>
    </>
  );
}
