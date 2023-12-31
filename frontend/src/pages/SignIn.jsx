/* eslint-disable react/prop-types */
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { IconButton, InputAdornment, TextField,
        Link, Grid, Box, Typography, Container,
        Checkbox, FormControlLabel, CssBaseline,
        Avatar, Button, Snackbar, Alert, CircularProgress } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

export default function SignIn({ setSignedIn }) {
  const [showPassword, setShowPassword] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const data = new FormData(event.currentTarget);

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/credentials/signin`, {
      method: 'POST',
      body: JSON.stringify({
        username: data.get('username'),
        password: data.get('password'),
        remember: data.get('remember'),
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },

    });

    const json = await response.json();


    if(json.success) {
      if(data.get('remember')) {
        localStorage.setItem('token', json.token);
        localStorage.setItem('username', data.get('username'));
      } else {
        sessionStorage.setItem('username', data.get('username'));
        sessionStorage.setItem('token', json.token);
      }
      setSignedIn(true);
      setLoading(false);
      navigate("/");
    } else {
      setOpen(true);
      setLoading(false);
    }

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
