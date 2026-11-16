# svelte-demo

A SvelteKit demo where button clicks keep working while the browser is offline.

## The problem

In SvelteKit, `on:click` handlers are attached by JavaScript after the page's HTML loads. Offline, the browser may still show the HTML from its cache but fail to load the JS files under `/_app/immutable/`. The buttons then render but do nothing.

## The fix

`src/service-worker.js` saves the page and every built JS/CSS file on the first online visit, then serves them from its own cache. The page therefore always becomes interactive, online or offline. SvelteKit registers the service worker automatically.

## Stack

svelte ^3.54.0 · @sveltejs/kit ^1.1.0 · @sveltejs/adapter-node ^1.1.0 · vite ^4.0.0 · vitest ^0.25.3

## Run

```bash
npm install
npm test          # unit tests (vitest)
npm run build
node build        # http://localhost:3000
```

Open the app online once, then go offline and reload: the buttons still work.

Service workers only run on `https://` or `localhost`.
