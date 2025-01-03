/* eslint-disable no-restricted-globals */
import { openDB } from 'idb';
import { precacheAndRoute } from 'workbox-precaching';

// This is injected by CRA build process and should only be referenced once
precacheAndRoute(self.__WB_MANIFEST || []);

// Open IndexedDB for caching tweets
export const dbPromise = openDB('tweetDB', 1, {
  upgrade(db) {
    db.createObjectStore('cachedTweets', {
      keyPath: 'id', // assuming tweets have a unique 'id' field
    });
  },
});

// Install event: Cache essential assets and handle initial setup
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open('static-cache').then((cache) => {
      console.log('Caching assets...');
      return cache.addAll([
        `${window.location.origin}/`,
        `${window.location.origin}/index.html`,
        `${window.location.origin}/static/media/logo192.png`,
        `${window.location.origin}/static/media/logo512.png`,
        `${window.location.origin}/static/js/main.js`,
        `${window.location.origin}/static/css/main.css`,
      ]);
    }).catch((error) => {
      console.error('Failed to cache some resources:', error);
    })
  );
});


// Fetch event: Cache tweets and images in IndexedDB and serve when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response; // Return from cache if available
      }

      // Handle API request to cache tweets and images
      return fetch(event.request).then((networkResponse) => {
        if (event.request.url.includes('/api/tweets/')) {
          // Cache the response if it's for the tweets API
          caches.open('static-cache').then((cache) => {
            cache.put(event.request, networkResponse.clone());
          });

          // Store tweets in IndexedDB and cache tweet images
          networkResponse.clone().json().then((tweets) => {
            storeTweetsInIndexedDB(tweets);
            // Cache tweet images
            tweets.forEach((tweet) => {
              if (tweet.image) {
                cacheImage(tweet.image);
              }
            });
          });
        }

        return networkResponse;
      }).catch(() => {
        // Return cached tweets if available when offline
        if (event.request.url.includes('/api/tweets/')) {
          return getCachedTweets(); // Return cached tweets
        }

        // If image request, serve it from cache
        if (event.request.url.includes('image')) {
          return caches.match(event.request);
        }
      });
    })
  );
});

// Function to store tweets in IndexedDB (cachedTweets store)
async function storeTweetsInIndexedDB(tweets) {
  const db = await dbPromise;
  const store = db.transaction('cachedTweets', 'readwrite').objectStore('cachedTweets');
  tweets.forEach(async (tweet) => {
    await store.put(tweet); // Store tweet by its unique id
  });
}

// Function to get cached tweets from IndexedDB
async function getCachedTweets() {
  const db = await dbPromise;
  const storedTweets = await db.getAll('cachedTweets');
  return new Response(JSON.stringify(storedTweets), {
    headers: { 'Content-Type': 'application/json' },
  });
}

// Function to cache image files
function cacheImage(imageUrl) {
  fetch(imageUrl).then((response) => {
    if (response.ok) {
      caches.open('image-cache').then((cache) => {
        cache.put(imageUrl, response);
      });
    }
  });
}
