<script>
  import { onMount } from 'svelte';
  import { increment, decrement, reset } from '$lib/counter.js';

  let count = 0;
  let hydrated = false; // becomes true only once JS has run => click handlers are live
  let online = true;
  let log = [];

  function record(label) {
    log = [`${new Date().toLocaleTimeString()} — ${label}`, ...log].slice(0, 8);
  }

  function onIncrement() {
    count = increment(count);
    record('Increment clicked');
  }
  function onDecrement() {
    count = decrement(count);
    record('Decrement clicked');
  }
  function onReset() {
    count = reset();
    record('Reset clicked');
  }

  onMount(() => {
    hydrated = true;
    online = navigator.onLine;
    const update = () => (online = navigator.onLine);
    addEventListener('online', update);
    addEventListener('offline', update);
    return () => {
      removeEventListener('online', update);
      removeEventListener('offline', update);
    };
  });
</script>

<svelte:head>
  <title>Offline Click Demo</title>
</svelte:head>

<main>
  <h1>Offline click demo</h1>

  <p class="status">
    <span class:ok={online} class:bad={!online}>{online ? 'Online' : 'Offline'}</span>
    <span class:ok={hydrated} class:bad={!hydrated}>
      {hydrated ? 'JS loaded — clicks work' : 'JS not loaded — clicks will do nothing'}
    </span>
  </p>

  <noscript><p class="bad">JavaScript is disabled, so buttons cannot respond.</p></noscript>

  <p class="count">{count}</p>

  <div class="buttons">
    <button type="button" on:click={onDecrement} disabled={!hydrated}>−</button>
    <button type="button" on:click={onReset} disabled={!hydrated}>Reset</button>
    <button type="button" on:click={onIncrement} disabled={!hydrated}>+</button>
  </div>

  <h2>Click log</h2>
  <ul>
    {#each log as entry}
      <li>{entry}</li>
    {:else}
      <li class="muted">No clicks yet</li>
    {/each}
  </ul>
</main>

<style>
  main { max-width: 32rem; margin: 2rem auto; padding: 0 1rem; font-family: system-ui, sans-serif; }
  .status { display: flex; gap: .5rem; flex-wrap: wrap; }
  .status span { padding: .2rem .6rem; border-radius: 999px; font-size: .85rem; }
  .ok { background: #dcfce7; color: #166534; }
  .bad { background: #fee2e2; color: #991b1b; }
  .count { font-size: 4rem; text-align: center; margin: 1rem 0; }
  .buttons { display: flex; gap: .5rem; justify-content: center; }
  button { font-size: 1.25rem; padding: .5rem 1.25rem; cursor: pointer; }
  button:disabled { cursor: not-allowed; opacity: .5; }
  .muted { color: #6b7280; }
</style>
