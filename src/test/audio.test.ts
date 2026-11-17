import { describe, it, expect, beforeEach } from 'vitest';
import { sound, CC0_SOUND_PATHS } from '../utils/audio';

describe('Open-Source Audio Engine & CC0 Assets', () => {
  beforeEach(() => {
    if (!sound.isEnabled()) {
      sound.toggleSound();
    }
  });

  it('registers curated CC0 sound paths for achievements, try-again, sparkles, victory, and clicks', () => {
    expect(CC0_SOUND_PATHS.achievements.length).toBeGreaterThanOrEqual(8);
    expect(CC0_SOUND_PATHS.tryAgain.length).toBeGreaterThanOrEqual(8);
    expect(CC0_SOUND_PATHS.sparkles.length).toBeGreaterThanOrEqual(4);
    expect(CC0_SOUND_PATHS.victories.length).toBeGreaterThanOrEqual(2);
    expect(CC0_SOUND_PATHS.clicks.length).toBeGreaterThanOrEqual(4);

    const allPaths = [
      ...CC0_SOUND_PATHS.clicks,
      ...CC0_SOUND_PATHS.achievements,
      ...CC0_SOUND_PATHS.sparkles,
      ...CC0_SOUND_PATHS.victories,
      ...CC0_SOUND_PATHS.tryAgain,
    ];

    allPaths.forEach((p) => {
      expect(p.startsWith('/sounds/')).toBe(true);
      expect(p.endsWith('.wav') || p.endsWith('.mp3')).toBe(true);
    });
  });

  it('safely triggers achievement, try-again, sparkle, victory, and click cues without throwing', () => {
    expect(() => {
      sound.playClick();
      sound.playFlip();
      sound.playPop();
      sound.playMatch();
      sound.playAchievement();
      sound.playSparkle();
      sound.playWrong();
      sound.playWin();
      sound.playPraise('ar');
      sound.playTryAgain('ar');
      sound.speakText('أحسنت', 'ar');
    }).not.toThrow();
  });

  it('toggles sound enabled state cleanly and avoids throwing when muted', () => {
    expect(sound.isEnabled()).toBe(true);
    const afterMute = sound.toggleSound();
    expect(afterMute).toBe(false);
    expect(sound.isEnabled()).toBe(false);

    expect(() => {
      sound.playMatch();
      sound.playWrong();
      sound.playWin();
    }).not.toThrow();

    const afterUnmute = sound.toggleSound();
    expect(afterUnmute).toBe(true);
  });
});
