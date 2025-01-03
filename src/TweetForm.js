import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Box, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MicIcon from '@mui/icons-material/Mic';
import WebcamCaptureModal from './WebcamCaptureModal';
import { postTweet } from './api';

const TweetForm = ({ open, onClose }) => {
  const [tweetContent, setTweetContent] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isWebcamOpen, setIsWebcamOpen] = useState(false);

  const handleImageChange = (event) => {
    const selectedImage = event.target.files[0];
    setImage(selectedImage);
    setImagePreview(URL.createObjectURL(selectedImage));
    setCapturedImage(null);
  };

  const handleCapture = (capturedImageUrl) => {
    setCapturedImage(capturedImageUrl);
    setImagePreview(capturedImageUrl);
    setIsWebcamOpen(false);
  };

  const handleSpeechToText = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    const SpeechRecognition =
      window.webkitSpeechRecognition || window.SpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = 'en-US'; // Set language
    recognition.interimResults = false; // Get only final results
    recognition.onstart = () => {
      console.log('Speech recognition started');
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
    };

    recognition.onresult = (event) => {
      const speechResult = event.results[0][0].transcript; // Get the recognized text
      setTweetContent((prev) => (prev ? `${prev} ${speechResult}` : speechResult)); // Append to existing text
    };

    recognition.start(); // Start recognition
  };

  const handleSubmit = async () => {
    if (!navigator.onLine) {
      alert('You are offline. Make sure you have an internet connection to post your tweet.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('content', tweetContent);
      if (image) {
        formData.append('image', image);
      } else if (capturedImage) {
        const blob = await fetch(capturedImage).then((res) => res.blob());
        formData.append('image', blob, 'captured_image.jpg');
      }

      await postTweet(formData);
      onClose();
    } catch (error) {
      console.error('Error posting tweet:', error.response ? error.response.data : error);
    }
  };

  const handleImageRemove = () => {
    setImage(null);
    setImagePreview(null);
    setCapturedImage(null);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen // Make the dialog cover the full screen
      sx={{
        '& .MuiDialog-paper': {
          margin: 0, // Remove any default margin
          width: '100%', // Make the dialog fill the screen
          height: '100%', // Set height to 100% of the screen
          maxWidth: 'none', // Remove max width limitation
        },
      }}
    >
      <DialogTitle sx={{ backgroundColor: '#1976d2', color: 'white', textAlign: 'center', py: 3 }}>
        <Typography variant="h6">Create Tweet</Typography>
      </DialogTitle>
      <DialogContent sx={{ paddingTop: 2, paddingBottom: 3 }}>
        <TextField
          label="Tweet Content"
          value={tweetContent}
          onChange={(e) => setTweetContent(e.target.value)}
          multiline
          rows={4}
          fullWidth
          variant="outlined"
          margin="normal"
        />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, marginBottom: 2 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<MicIcon />}
            onClick={handleSpeechToText}
          >
            Speak
          </Button>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {imagePreview ? (
            <Box>
              <img src={imagePreview} alt="Preview" width="100%" />
              <IconButton color="error" onClick={handleImageRemove}>
                <CloseIcon />
              </IconButton>
            </Box>
          ) : (
            <Button variant="contained" color="primary" component="label">
              Upload Image
              <input type="file" accept="image/*" hidden onChange={handleImageChange} />
            </Button>
          )}
        </Box>
        <Box sx={{ marginTop: 2 }}>
          <Button variant="contained" color="secondary" onClick={() => setIsWebcamOpen(true)}>
            Capture Image with Webcam
          </Button>
        </Box>
      </DialogContent>
      <DialogActions sx={{ padding: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={!tweetContent}>
          Post Tweet
        </Button>
      </DialogActions>
      <WebcamCaptureModal open={isWebcamOpen} onClose={() => setIsWebcamOpen(false)} onCapture={handleCapture} />
    </Dialog>
  );
};

export default TweetForm;
