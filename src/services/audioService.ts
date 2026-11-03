/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

const STORAGE_KEY_MUTED = 'academia_audio_muted';
const STORAGE_KEY_VOLUME = 'academia_audio_volume';

let sharedAudioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!sharedAudioContext) {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (AudioCtx) {
      sharedAudioContext = new AudioCtx();
    }
  }
  if (sharedAudioContext && sharedAudioContext.state === 'suspended') {
    sharedAudioContext.resume().catch(() => {
      // Ignore autoplay restrictions until user gesture
    });
  }
  return sharedAudioContext;
}

export function isAudioMuted(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.localStorage.getItem(STORAGE_KEY_MUTED) === 'true';
  } catch {
    return false;
  }
}

export function setAudioMuted(muted: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY_MUTED, muted ? 'true' : 'false');
  } catch {
    // Ignore storage errors
  }
}

export function getAudioVolume(): number {
  if (typeof window === 'undefined') return 0.6;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY_VOLUME);
    if (raw === null) return 0.6;
    const parsed = parseFloat(raw);
    if (Number.isNaN(parsed)) return 0.6;
    return Math.max(0, Math.min(1, parsed));
  } catch {
    return 0.6;
  }
}

export function setAudioVolume(volume: number): void {
  if (typeof window === 'undefined') return;
  const clamped = Math.max(0, Math.min(1, volume));
  try {
    window.localStorage.setItem(STORAGE_KEY_VOLUME, String(clamped));
  } catch {
    // Ignore storage errors
  }
}

interface ToneStep {
  freq: number;
  startOffset: number;
  duration: number;
  type?: OscillatorType;
  gainMultiplier?: number;
}

function playToneSequence(steps: ToneStep[]): void {
  if (isAudioMuted()) return;
  const masterVolume = getAudioVolume();
  if (masterVolume <= 0.001) return;

  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  steps.forEach((step) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = step.type || 'sine';
    osc.frequency.setValueAtTime(step.freq, now + step.startOffset);

    // Subtle peak gain so sound effects are gentle and never harsh
    const peakGain = Math.min(
      0.35,
      0.16 * masterVolume * (step.gainMultiplier ?? 1)
    );
    const startTime = now + step.startOffset;
    const endTime = startTime + step.duration;

    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.linearRampToValueAtTime(peakGain, startTime + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, endTime);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(endTime + 0.01);
  });
}

/**
 * Subtle two-note ascending chime when the user gets a correct answer.
 */
export function playCorrectSound(): void {
  playToneSequence([
    { freq: 587.33, startOffset: 0, duration: 0.11, type: 'sine', gainMultiplier: 0.9 }, // D5
    { freq: 880.0, startOffset: 0.08, duration: 0.22, type: 'triangle', gainMultiplier: 1.0 }, // A5
  ]);
}

/**
 * Gentle, low two-tone feedback when an answer is incorrect.
 */
export function playWrongSound(): void {
  playToneSequence([
    { freq: 311.13, startOffset: 0, duration: 0.12, type: 'triangle', gainMultiplier: 0.7 }, // D#4
    { freq: 246.94, startOffset: 0.09, duration: 0.2, type: 'sine', gainMultiplier: 0.7 }, // B3
  ]);
}

/**
 * Bright, subtle ascending harmonic arpeggio when unlocking a new level or node.
 */
export function playLevelUpSound(): void {
  playToneSequence([
    { freq: 523.25, startOffset: 0, duration: 0.12, type: 'triangle', gainMultiplier: 0.85 }, // C5
    { freq: 659.25, startOffset: 0.09, duration: 0.12, type: 'triangle', gainMultiplier: 0.9 }, // E5
    { freq: 783.99, startOffset: 0.18, duration: 0.14, type: 'triangle', gainMultiplier: 0.95 }, // G5
    { freq: 1046.5, startOffset: 0.27, duration: 0.36, type: 'sine', gainMultiplier: 1.1 }, // C6
  ]);
}

/**
 * Celebratory chord chime when completing a lesson or placement exam.
 */
export function playLessonCompleteSound(): void {
  playToneSequence([
    { freq: 523.25, startOffset: 0, duration: 0.11, type: 'sine', gainMultiplier: 0.85 }, // C5
    { freq: 587.33, startOffset: 0.08, duration: 0.11, type: 'sine', gainMultiplier: 0.9 }, // D5
    { freq: 659.25, startOffset: 0.16, duration: 0.13, type: 'triangle', gainMultiplier: 0.95 }, // E5
    { freq: 783.99, startOffset: 0.25, duration: 0.16, type: 'triangle', gainMultiplier: 1.0 }, // G5
    { freq: 1046.5, startOffset: 0.35, duration: 0.42, type: 'sine', gainMultiplier: 1.15 }, // C6
    { freq: 659.25, startOffset: 0.35, duration: 0.42, type: 'sine', gainMultiplier: 0.55 }, // E5 harmony
  ]);
}
