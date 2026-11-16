/// <reference types="@sveltejs/kit" />
// Why this file exists:
// Button clicks in SvelteKit are wired up by JavaScript during *hydration*.
// When the browser is offline and the JS chunks under /_app/immutable/ can't be
// fetched, the page still shows (from the HTTP cache / SSR HTML) but hydration
// never runs, so no on:click handler is ever attached. Some browsers happen to
// keep those chunks in their HTTP cache; others don't. This service worker makes
// it deterministic: it precaches the app shell and every built JS/CSS file so the
// page always hydrates, online or offline.
import { build, files, prerendered, version } from '$service-worker';

const CACHE = `app-cache-${version}`;
// Set: '/' may already be in `prerendered`, and cache.addAll() rejects duplicates.
const ASSETS = [...new Set([...build, ...files, ...prerendered, '/'])];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Built assets and static files never change for a given version: cache first.
  if (ASSETS.includes(url.pathname)) {
    event.respondWith(caches.match(url.pathname).then((hit) => hit || fetch(request)));
    return;
  }

  // Pages / data: network first, fall back to cache (or the app shell) when offline.
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE);
      try {
        const response = await fetch(request);
        if (response.ok) cache.put(request, response.clone());
        return response;
      } catch {
        const cached = await cache.match(request);
        if (cached) return cached;
        if (request.mode === 'navigate') {
          const shell = await cache.match('/');
          if (shell) return shell;
        }
        return new Response('Offline', { status: 503, statusText: 'Offline' });
      }
    })()
  );
});
