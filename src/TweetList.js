import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardMedia, Typography, Box, CircularProgress } from '@mui/material';
import { getTweets } from './api'; // API call to fetch tweets from your server

const TweetList = () => {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Utility to check if the app is offline
  const isOffline = () => !navigator.onLine;

  // Format the date to a readable format (e.g., "Jan 3, 2025, 10:30 AM")
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    })}`;
  };

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
          <Card key={tweet.id} sx={{ width: '100%', maxWidth: '600px', height: 'auto', borderRadius: 8, boxShadow: 3, marginBottom: 2 }}>
            {tweet.image && (
              <CardMedia
                component="img"
                image={tweet.image}
                alt="Tweet image"
                sx={{
                  width: '100%',
                  height: '300px',
                  objectFit: 'cover',
                  borderTopLeftRadius: 8,
                  borderTopRightRadius: 8,
                  marginBottom: 2,
                }}
              />
            )}
            <CardContent>
              {/* Tweet date */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                  {formatDate(tweet.created_at)}
                </Typography>
              </Box>

              {/* Tweet content */}
              <Typography variant="body1" sx={{ marginBottom: 2, lineHeight: 1.6, fontSize: '1rem', color: 'text.primary' }}>
                {tweet.content}
              </Typography>

              {/* Tweet username */}
              <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'primary.main', fontSize: '1rem' }}>
                @{tweet.user.username}
              </Typography>
            </CardContent>
          </Card>
        ))
      ) : (
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          {!navigator.onLine ? 'No internet connection' : 'No Tweets Available'}
        </Typography>
      )}
    </Box>
  );
};

export default TweetList;
