import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Box } from '@mui/material';
import { registerUser } from './api'; // API to call your Django backend

const Register = ({ open, onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null); // State to store error message

  const handleSubmit = async () => {
    try {
      // Validate if username and password are filled
      if (!username || !password) {
        setError("Username and Password are required.");
        return;
      }

      // Clear previous error
      setError(null);
      
      // Call the API to register the user
      await registerUser(username, password);
      onClose(); // Close the dialog on successful registration
    } catch (error) {
      console.error('Error registering:', error);

      // Check if the backend has a specific error message for username
      if (error.response && error.response.data) {
        if (error.response.data.username) {
          setError(error.response.data.username); // Show error related to username
        } else if (error.response.data.password) {
          setError(error.response.data.password); // Show error related to password
        } else {
          setError('An error occurred.'); // Generic error message if no specific error found
        }
      } else {
        setError('An error occurred.'); // In case of no response or another error
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ textAlign: 'center' }}>Register</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box sx={{ width: '100%', marginBottom: 2 }}>
          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            variant="outlined"
            sx={{ marginBottom: 2 }}
          />
        </Box>
        <Box sx={{ width: '100%', marginBottom: 2 }}>
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            variant="outlined"
          />
        </Box>
        {/* Show error message if there is any */}
        {error && (
          <Box sx={{ color: 'red', marginBottom: 2 }}>
            <p>{error}</p>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center' }}>
        <Button variant="outlined" onClick={onClose}>Cancel</Button>
        <Button variant="contained" color="primary" onClick={handleSubmit}>Register</Button>
      </DialogActions>
    </Dialog>
  );
};

export default Register;
