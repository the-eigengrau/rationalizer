import { describe, it, expect } from 'vitest';
import { getLevel, getNextLevel, getLevelProgress, LEVELS } from '../src/gamification/levels.js';

describe('levels', () => {
  it('should return Neophyte for 0 days', () => {
    const level = getLevel(0);
    expect(level.name).toBe('Neophyte');
  });

  it('should return Asketes for 3 days', () => {
    const level = getLevel(3);
    expect(level.name).toBe('Asketes');
  });

  it('should return Asketes for 6 days (between thresholds)', () => {
    const level = getLevel(6);
    expect(level.name).toBe('Asketes');
  });

  it('should return Philosophos for 7 days', () => {
    const level = getLevel(7);
    expect(level.name).toBe('Philosophos');
  });

  it('should return Dialektikos for 30 days', () => {
    const level = getLevel(30);
    expect(level.name).toBe('Dialektikos');
  });

  it('should return Epistemon for 365+ days', () => {
    const level = getLevel(365);
    expect(level.name).toBe('Epistemon');
    const level500 = getLevel(500);
    expect(level500.name).toBe('Epistemon');
  });

  it('should return correct next level', () => {
    expect(getNextLevel(0)?.name).toBe('Asketes');
    expect(getNextLevel(3)?.name).toBe('Philosophos');
    expect(getNextLevel(100)?.name).toBe('Sophos');
    expect(getNextLevel(365)).toBeNull();
  });

  it('should calculate progress correctly', () => {
    const { current, next, progress } = getLevelProgress(5);
    expect(current.name).toBe('Asketes');
    expect(next?.name).toBe('Philosophos');
    // 5 days, Asketes starts at 3, Philosophos at 7 -> (5-3)/(7-3) = 0.5
    expect(progress).toBe(0.5);
  });

  it('should return 100% progress at max level', () => {
    const { progress, next } = getLevelProgress(400);
    expect(progress).toBe(1);
    expect(next).toBeNull();
  });

  it('should have 9 levels defined', () => {
    expect(LEVELS).toHaveLength(9);
  });

  it('should have levels in ascending order', () => {
    for (let i = 1; i < LEVELS.length; i++) {
      expect(LEVELS[i].requiredDays).toBeGreaterThan(LEVELS[i - 1].requiredDays);
    }
  });
});
