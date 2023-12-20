import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import { Link as RouterLink } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useState } from 'react';


export default function SignUp() {
  const [nameError, setNameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [passwordRepeatError, setPasswordRepeatError] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const isValidUserName = validateUsername(data.get('username'));
    const isValidPassword = validatePassword(data.get('password'));
    const isValidPasswordCheck = validatePasswordRepeat(data.get('password'), data.get('repeat-password'));

    if (!isValidUserName && !isValidPassword && !isValidPasswordCheck) {
      console.log({
        username: data.get('username'),
        password: data.get('password'),
      });
    }

  }

  const validateUsername = (username) => {
    if (username.length < 3) {
      setNameError(true);
      return true;
    }

    setNameError(false);
    return false;
  };

  const validatePassword = (password) => {
    if (password.length < 8) {
      setPasswordError(true);
      return true;
    }

    setPasswordError(false);
    return false;
  };

  const validatePasswordRepeat = (password, passwordRepeat) => {
    if (password !== passwordRepeat) {
      setPasswordRepeatError(true);
      return true;
    }

    setPasswordRepeatError(false);
    return false;

  };

  return (
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
                type="password"
                id="password"
                helperText="Password must be at least 8 characters long"
                error={passwordError}
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
                type="password"
                id="repeat-password"
                error={passwordRepeatError}
                helperText={passwordRepeatError ? "Passwords don't match" : null}
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
  );
}
