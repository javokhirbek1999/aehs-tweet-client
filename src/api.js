import axios from 'axios';

const API_URL = 'https://uehs-tweet-backend.onrender.com/api/'; // Replace with your Django API endpoint

// Get the JWT token from localStorage (or wherever you store it)
const getAuthToken = () => localStorage.getItem('access_token');

// Register user
export const registerUser = async (username, password) => {
  const response = await axios.post(`${API_URL}auth/register/`, {'username': username, 'password': password });
  return response.data;
};

// Login user
export const loginUser = async (username, password) => {
  const response = await axios.post(`${API_URL}auth/login/`, { username, password });
  // Store the JWT token after successful login
  localStorage.setItem('access_token', response.data.access);
  return response.data;
};

// Post tweet with FormData (to handle content and image upload)
export const postTweet = async (formData) => {
  const token = getAuthToken();  // Get the token from localStorage

  const response = await axios.post(`${API_URL}tweets/`, formData, {
    headers: {
      'Authorization': `Bearer ${token}`,  // Add Authorization header with token
      // Do NOT specify 'Content-Type' here; the browser will handle it automatically for FormData
    },
  });

  return response.data;
};


export const getTweets = async () => {
  const token = getAuthToken();  // Get the token from localStorage

  // Only add Authorization header if the token exists (authenticated user)
  const headers = token ? {
    Authorization: `Bearer ${token}`,
  } : {};

  const response = await axios.get(`${API_URL}tweets/`, {
    headers: headers,
  });

  return response.data; // Returning tweet data (list of tweets)
};