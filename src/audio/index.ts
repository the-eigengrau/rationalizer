import { playFile, stopAll } from './player.js';
import { SoundEffect, getSoundPath } from './sounds.js';

export { SoundEffect } from './sounds.js';

interface AudioConfig {
  audioEnabled: boolean;
  startupMusic: 'always' | 'daily' | 'never';
}

let enabled = false;
let startupMode: AudioConfig['startupMusic'] = 'always';

export function initAudio(config: AudioConfig): void {
  // Auto-disable in CI environments
  if (process.env.CI) {
    enabled = false;
    return;
  }
  enabled = config.audioEnabled;
  startupMode = config.startupMusic;
}

export function play(sound: SoundEffect): void {
  if (!enabled) return;
  playFile(getSoundPath(sound));
}

export function stopAudio(): void {
  stopAll();
}

export function isAudioEnabled(): boolean {
  return enabled;
}

export function getStartupMode(): AudioConfig['startupMusic'] {
  return startupMode;
}
