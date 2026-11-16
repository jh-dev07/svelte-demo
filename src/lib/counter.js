/** Pure helpers used by the page (and unit-tested with vitest). */
export const increment = (n, step = 1) => n + step;
export const decrement = (n, step = 1) => Math.max(0, n - step);
export const reset = () => 0;
