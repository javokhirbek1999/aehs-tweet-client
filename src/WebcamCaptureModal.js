import React, { useEffect, useRef } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';

const WebcamCaptureModal = ({ open, onClose, onCapture }) => {
  const webcamRef = useRef(null); // Reference to the webcam video element
  const canvasRef = useRef(null); // Reference to the canvas for capturing the image

  // Start the webcam when the modal is opened
  useEffect(() => {
    if (open) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          if (webcamRef.current) {
            webcamRef.current.srcObject = stream; // Set the webcam feed as the video source
          }
        })
        .catch((err) => {
          console.error('Error accessing webcam:', err);
        });
    } else {
      // Stop the webcam stream when the modal is closed
      const stream = webcamRef.current?.srcObject;
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop()); // Stop each track
      }
    }

    return () => {
      // Clean up webcam stream when component is unmounted
      const stream = webcamRef.current?.srcObject;
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [open]);

  // Capture the image from the webcam feed
  const handleCapture = () => {
    const canvas = canvasRef.current;
    const video = webcamRef.current;

    const ctx = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0); // Draw the video feed onto the canvas

    const capturedImageUrl = canvas.toDataURL('image/png');
    onCapture(capturedImageUrl); // Send the captured image URL back to the parent component
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ backgroundColor: '#1976d2', color: 'white', textAlign: 'center', py: 3 }}>
        Capture Photo from Webcam
      </DialogTitle>
      <DialogContent sx={{ paddingTop: 2, paddingBottom: 3 }}>
        {/* Video element to display webcam feed */}
        <video
          ref={webcamRef}
          autoPlay
          playsInline
          width="100%"
          height="auto"
          style={{ borderRadius: '8px', objectFit: 'cover' }}
        />

        <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
      </DialogContent>
      <DialogActions sx={{ paddingX: 3, paddingBottom: 2 }}>
        <Button
          variant="outlined"
          sx={{ borderRadius: '20px', fontWeight: 'bold', color: '#1976d2', borderColor: '#1976d2', '&:hover': { borderColor: '#1565c0', color: '#1565c0' } }}
          onClick={onClose}
        >
          Close
        </Button>
        <Button
          variant="contained"
          color="success"
          sx={{
            borderRadius: '20px',
            fontWeight: 'bold',
            backgroundColor: '#1976d2',
            '&:hover': { backgroundColor: '#1565c0' },
          }}
          onClick={handleCapture}
        >
          Capture Photo
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WebcamCaptureModal;
