import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardMedia, Typography, Box, CircularProgress } from '@mui/material';
import { getTweets } from './api'; // API call to fetch tweets from your server

const TweetList = () => {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Utility to check if the app is offline
  const isOffline = () => !navigator.onLine;

  useEffect(() => {
    const fetchTweets = async () => {
      if (isOffline()) {
        // If offline, rely on the service worker to provide cached tweets
        try {
          const response = await fetch('/api/tweets/');
          const data = await response.json();
          setTweets(data);
        } catch (error) {
          console.error('Error fetching cached tweets:', error);
        }
        setLoading(false);
      } else {
        // If online, fetch tweets from the API
        try {
          const data = await getTweets();
          setTweets(data);
        } catch (error) {
          console.error('Error fetching tweets:', error);
        }
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
      {tweets.length > 0 ? (
        tweets.map((tweet) => (
          <Card key={tweet.id} sx={{ width: '100%', maxWidth: '600px', height: 'auto', borderRadius: 8 }}>
            {tweet.image && (
              <CardMedia
                component="img"
                image={tweet.image}
                alt="Tweet image"
                sx={{ width: '100%', height: '300px', objectFit: 'cover' }}
              />
            )}
            <CardContent>
              <Typography variant="body1">{tweet.content}</Typography>
            </CardContent>
          </Card>
        ))
      ) : (
        <Typography variant="body1">{!navigator.onLine ? 'No internet connection' : 'No Tweets Available'}</Typography>
      )}
    </Box>
  );
};

export default TweetList;
