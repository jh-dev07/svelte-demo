import adapter from '@sveltejs/adapter-node';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter(),
    // SvelteKit registers src/service-worker.js automatically (default: true)
    serviceWorker: { register: true }
  }
};

export default config;
