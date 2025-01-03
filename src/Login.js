import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Box } from '@mui/material';
import { loginUser } from './api'; 

const Login = ({ open, onClose, onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async () => {
    // Check if the user is offline
    if (!navigator.onLine) {
      alert('You are offline, make sure you have an internet connection.');
      return;
    }

    try {
      const response = await loginUser(username, password);
      const token = response.access; // Assuming the JWT token is in `access` field
      onLoginSuccess(token);
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen // Makes the dialog cover the whole screen
      sx={{
        '& .MuiDialog-paper': {
          margin: 0, // Remove any default margin
          width: '100%', // Make the dialog fill the screen
          height: '100%', // Set height to 100% of the screen
          maxWidth: 'none', // Remove max width limitation
        },
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold' }}>Login</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box sx={{ width: '80%', marginBottom: 2 }}>
          <TextField
            label="Username"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
          />
        </Box>
        <Box sx={{ width: '80%', marginBottom: 2 }}>
          <TextField
            label="Password"
            variant="outlined"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center' }}>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Login
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Login;
