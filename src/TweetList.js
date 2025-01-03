import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardMedia, Typography, Box, CircularProgress } from '@mui/material';
import { getTweets } from './api';

const TweetList = () => {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTweets = async () => {
      try {
        const data = await getTweets();
        setTweets(data);
      } catch (error) {
        console.error("Error fetching tweets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTweets();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', padding: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 2, display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'center' }}>
      {tweets.map((tweet) => (
        <Card
          key={tweet.id}
          sx={{
            width: '100%',
            maxWidth: '600px',
            height: 'auto',
            borderRadius: 8,
            boxShadow: '0 6px 15px rgba(0, 0, 0, 0.1)',
            backgroundColor: '#ffffff',
            border: '1px solid #ddd',
            transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
            '&:hover': {
              transform: 'scale(1.02)',
              boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
            },
            overflow: 'hidden',
          }}
        >
          {tweet.image && (
            <CardMedia
              component="img"
              image={tweet.image}
              alt="Tweet image"
              sx={{
                width: '100%',
                height: '300px',
                objectFit: 'cover',
              }}
            />
          )}

          <CardContent sx={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Tweet Content */}
            <Typography
              variant="body1"
              sx={{
                fontSize: tweet.image ? '1.2rem' : '1.4rem', // Make text slightly bigger if no image
                color: '#333',
                lineHeight: 1.8,
                fontFamily: `'Roboto', sans-serif`,
                fontWeight: '600', // Bold font weight for prominence
                wordWrap: 'break-word',
                whiteSpace: 'pre-wrap',
                letterSpacing: '0.8px', // Increase letter spacing for better readability
                marginBottom: '15px', // Create space after content for separation
                textTransform: 'none',
                overflowWrap: 'break-word', // Prevent overflow of text
              }}
            >
              {tweet.content}
            </Typography>

            {/* User and Created Date Information */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <Typography
                variant="body2"
                sx={{
                  color: '#1976d2',
                  fontWeight: '600',
                  fontSize: '1rem', // Adjusted font size
                }}
              >
                @{tweet.user.username}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: '#888',
                  fontSize: '0.9rem',
                  marginTop: '5px',
                  fontStyle: 'italic',
                }}
              >
                {new Date(tweet.created_at).toLocaleString()}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default TweetList;
