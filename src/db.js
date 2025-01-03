// src/db.js
import { openDB } from 'idb';

const dbPromise = openDB('tweets-db', 1, {
  upgrade(db) {
    db.createObjectStore('tweets', { keyPath: 'id' });
  },
});

export const saveTweetOffline = async (tweet) => {
  const db = await dbPromise;
  return db.put('tweets', tweet); // Store tweet in IndexedDB
};

export const getTweetsOffline = async () => {
  const db = await dbPromise;
  return db.getAll('tweets'); // Get all tweets from IndexedDB
};
