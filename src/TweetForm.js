import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Box, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import WebcamCaptureModal from './WebcamCaptureModal';
import { postTweet } from './api';
import { storeUnsyncedTweet } from './service-worker'; // Import storeUnsyncedTweet from service-worker

const TweetForm = ({ open, onClose }) => {
  const [tweetContent, setTweetContent] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); // State for image preview
  const [capturedImage, setCapturedImage] = useState(null); // State for captured image
  const [isWebcamOpen, setIsWebcamOpen] = useState(false); // State for webcam modal visibility

  // Handle file selection
  const handleImageChange = (event) => {
    const selectedImage = event.target.files[0];
    setImage(selectedImage);
    setImagePreview(URL.createObjectURL(selectedImage)); // Create temporary URL for image preview
    setCapturedImage(null); // Clear captured image if a file is selected
  };

  // Handle capturing image from webcam
  const handleCapture = (capturedImageUrl) => {
    setCapturedImage(capturedImageUrl);
    setImagePreview(capturedImageUrl); // Show captured image preview
    setIsWebcamOpen(false); // Close webcam modal after capture
  };

  // Submit the tweet (with content and image)
  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('content', tweetContent); // Add tweet content
      if (image) {
        formData.append('image', image); // Add image if selected
      } else if (capturedImage) {
        // Convert captured image to Blob and append it
        const blob = await fetch(capturedImage).then(res => res.blob());
        formData.append('image', blob, 'captured_image.jpg');
      }

      console.log('FormData to be submitted:', formData); // Log the FormData for debugging
      await postTweet(formData); // Send FormData to API
      onClose(); // Close modal after posting tweet
    } catch (error) {
      console.error('Error posting tweet:', error.response ? error.response.data : error);
      // Store tweet in IndexedDB when offline
      const tweet = { content: tweetContent, image: image || capturedImage };
      await storeUnsyncedTweet(tweet);
      onClose(); // Close modal after storing tweet
    }
  };

  // Remove image preview
  const handleImageRemove = () => {
    setImage(null);
    setImagePreview(null); // Clear preview
    setCapturedImage(null); // Clear captured image
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
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
