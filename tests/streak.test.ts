import { describe, it, expect } from 'vitest';
import { formatStreak, getStreakEmoji } from '../src/gamification/streak.js';

describe('streak formatting', () => {
  it('should format zero streak', () => {
    expect(formatStreak(0)).toBe('No active streak');
  });

  it('should format 1 day singular', () => {
    expect(formatStreak(1)).toBe('1 day');
  });

  it('should format multiple days plural', () => {
    expect(formatStreak(5)).toBe('5 days');
    expect(formatStreak(100)).toBe('100 days');
  });
});

describe('streak emoji', () => {
  it('should return empty for zero streak', () => {
    expect(getStreakEmoji(0)).toBe('');
  });

  it('should return fire for short streaks', () => {
    expect(getStreakEmoji(1)).toContain('🔥');
    expect(getStreakEmoji(2)).toContain('🔥');
  });

  it('should increase fires for longer streaks', () => {
    const short = getStreakEmoji(2);
    const medium = getStreakEmoji(5);
    const long = getStreakEmoji(10);
    expect(medium.length).toBeGreaterThan(short.length);
    expect(long.length).toBeGreaterThan(medium.length);
  });
});
