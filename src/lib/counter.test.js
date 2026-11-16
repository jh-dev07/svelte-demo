import { describe, it, expect } from 'vitest';
import { increment, decrement, reset } from './counter.js';

describe('counter helpers', () => {
  it('increments', () => expect(increment(1)).toBe(2));
  it('increments by step', () => expect(increment(1, 5)).toBe(6));
  it('never goes below zero', () => expect(decrement(0)).toBe(0));
  it('decrements', () => expect(decrement(3)).toBe(2));
  it('resets', () => expect(reset()).toBe(0));
});
