/* eslint-disable no-restricted-globals */
import { openDB } from 'idb';
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst } from 'workbox-strategies';
import { BackgroundSyncPlugin } from 'workbox-background-sync';

// This is injected by CRA build process and should only be referenced once
precacheAndRoute(self.__WB_MANIFEST || []);

// Custom cache name and URLs to cache
const CACHE_NAME = 'tweet-cache-v1';
const CACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/static/js/bundle.js',
  '/static/js/main.chunk.js',
  '/static/js/1.chunk.js',
  // Add other static files and assets to cache
];

// Open IndexedDB for syncing tweets
export const dbPromise = openDB('tweetDB', 1, {
  upgrade(db) {
    db.createObjectStore('unsyncedTweets', {
      keyPath: 'id', // assuming tweets have a unique 'id' field
    });
  },
});

// Install event: Cache static files and assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CACHE_URLS);
    })
  );
});

// Fetch event: Serve cached content and cache new content
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse; // Return cached response if available
      }

      return fetch(event.request).then((networkResponse) => {
        // Cache API responses for tweets
        if (event.request.url.includes('/api/')) {
          const clonedResponse = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clonedResponse);
          });
        }

        return networkResponse; // Return network response
      });
    })
  );
});

// Activate event: Clean up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Background sync event: Sync tweets when the app goes online
self.addEventListener('sync', (event) => {
  if (event.tag === 'syncTweets') {
    event.waitUntil(syncTweets());
  }
});

// Function to sync tweets using IndexedDB when the app is online
async function syncTweets() {
  const db = await dbPromise;
  const unsyncedTweets = await db.getAll('unsyncedTweets');

  for (let tweet of unsyncedTweets) {
    // Send the tweet to the backend
    await fetch('/api/tweets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tweet),
    });

    // After successful sync, remove the tweet from IndexedDB
    await db.delete('unsyncedTweets', tweet.id);
  }
}

// Function to store an unsynced tweet in IndexedDB
export async function storeUnsyncedTweet(tweet) {
  const db = await dbPromise;
  await db.put('unsyncedTweets', tweet);
}
