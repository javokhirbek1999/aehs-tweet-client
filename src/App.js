import React, { useState, useEffect } from 'react';
import { Container, Button, Box, Typography, Grid, Paper } from '@mui/material';
import Register from './Register';
import Login from './Login';
import TweetForm from './TweetForm';
import TweetList from './TweetList';

function App() {
  const [isRegisterOpen, setRegisterOpen] = useState(false);
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isTweetOpen, setTweetOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);

    // Online/offline status handler
    const handleOnlineStatus = () => setIsOnline(navigator.onLine);

    // Add event listeners
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);

    // Cleanup event listeners on unmount
    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  const handleLoginSuccess = (token) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
    setLoginOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <Container sx={{ paddingTop: 4, paddingBottom: 4 }}>
      <Box sx={{ textAlign: 'center', marginBottom: 2 }}>
        <Typography
          variant="subtitle1"
          color={isOnline ? 'green' : 'red'}
          sx={{ fontWeight: 'bold' }}
        >
          {isOnline ? 'You are Online' : 'You are Offline'}
        </Typography>
      </Box>

      <Box sx={{ textAlign: 'center', marginBottom: 3 }}>
        <Typography variant="h3" color="primary" sx={{ fontWeight: 'bold' }}>
          Welcome to UEHSTweet
        </Typography>
      </Box>

      <Paper sx={{ padding: 3, backgroundColor: '#f5f5f5' }}>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            {!isAuthenticated ? (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ marginBottom: 2 }}
                  onClick={() => setRegisterOpen(true)}
                >
                  Register
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  fullWidth
                  sx={{ marginBottom: 2 }}
                  onClick={() => setLoginOpen(true)}
                >
                  Login
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="contained"
                  color="success"
                  fullWidth
                  sx={{ marginBottom: 2 }}
                  onClick={() => setTweetOpen(true)}
                >
                  Create Tweet
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  fullWidth
                  sx={{ marginBottom: 2 }}
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            )}
          </Grid>
        </Grid>
      </Paper>

      <TweetList />

      <Register open={isRegisterOpen} onClose={() => setRegisterOpen(false)} />
      <Login
        open={isLoginOpen}
        onClose={() => setLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
      <TweetForm open={isTweetOpen} onClose={() => setTweetOpen(false)} />
    </Container>
  );
}

export default App;
