import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';
import { LanguageProvider } from '../i18n/LanguageContext';
import { HarakatCarGame } from '../components/games/HarakatCarGame';
import { ARABIC_HARAKAT_DATA } from '../data/arabicHarakatData';
import { GAMES_LIST } from '../data/games';
import { sound } from '../utils/audio';

describe('Arabic Harakat Car Race Game', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('contains all 28 Arabic letters with Fatha, Kasra, and Damma phonetic sounds including دُ -> دُو', () => {
    expect(ARABIC_HARAKAT_DATA.length).toBe(28);
    const daal = ARABIC_HARAKAT_DATA.find((item) => item.baseLetter === 'د');
    expect(daal).toBeDefined();

    const fatha = daal!.options.find((o) => o.haraka === 'fatha');
    const kasra = daal!.options.find((o) => o.haraka === 'kasra');
    const damma = daal!.options.find((o) => o.haraka === 'damma');

    expect(fatha?.display).toBe('دَ');
    expect(fatha?.phonetic).toBe('دَا');
    expect(kasra?.display).toBe('دِ');
    expect(kasra?.phonetic).toBe('دِي');
    expect(damma?.display).toBe('دُ');
    expect(damma?.phonetic).toBe('دُو');
  });

  it('is registered in GAMES_LIST under the letters category', () => {
    const entry = GAMES_LIST.find((g) => g.id === 'harakat-car');
    expect(entry).toBeDefined();
    expect(entry?.category).toBe('letters');
  });

  it('launches directly into single-level gameplay without a difficulty menu', () => {
    render(
      <LanguageProvider>
        <HarakatCarGame onGoHome={() => {}} />
      </LanguageProvider>
    );

    expect(screen.getByText('سباق الحركات العربية')).toBeDefined();
    expect(screen.getByText('1/8')).toBeDefined();
    expect(screen.getByTestId('racing-car').getAttribute('data-lane')).toBe('1');
    expect(screen.queryByText(/سهل|متوسط|صعب/)).toBeNull();
  });

  it('speaks the lane haraka sound immediately when steering left or right', () => {
    const speakSpy = vi.spyOn(sound, 'speakText');
    const popSpy = vi.spyOn(sound, 'playPop');

    render(
      <LanguageProvider>
        <HarakatCarGame onGoHome={() => {}} />
      </LanguageProvider>
    );

    const leftBtn = screen.getByLabelText('الانتقال لليسار');
    fireEvent.click(leftBtn);

    expect(screen.getByTestId('racing-car').getAttribute('data-lane')).toBe('0');
    expect(popSpy).toHaveBeenCalled();
    expect(speakSpy).toHaveBeenCalledWith(expect.any(String), 'ar');

    const rightBtn = screen.getByLabelText('الانتقال لليمين');
    fireEvent.click(rightBtn);
    expect(screen.getByTestId('racing-car').getAttribute('data-lane')).toBe('1');
    fireEvent.click(rightBtn);
    expect(screen.getByTestId('racing-car').getAttribute('data-lane')).toBe('2');
    expect(speakSpy).toHaveBeenCalledTimes(3);
  });

  it('replays the target prompt sound when clicking the yellow speaker button', () => {
    const speakSpy = vi.spyOn(sound, 'speakText');

    render(
      <LanguageProvider>
        <HarakatCarGame onGoHome={() => {}} />
      </LanguageProvider>
    );

    const speakerBtn = screen.getByLabelText('سماع الحرف المطلوب');
    fireEvent.click(speakerBtn);
    expect(speakSpy).toHaveBeenCalledWith(expect.any(String), 'ar');
  });

  it('awards +10 points and advances to round 2 when driving through the matching gate', () => {
    const matchSpy = vi.spyOn(sound, 'playMatch');

    render(
      <LanguageProvider>
        <HarakatCarGame onGoHome={() => {}} />
      </LanguageProvider>
    );

    // Find target display inside the "انطلق نحو:" prompt banner
    const promptPrefix = screen.getByText('انطلق نحو:');
    const targetDisplay = promptPrefix.nextElementSibling?.textContent?.trim();
    expect(targetDisplay).toBeTruthy();

    // Click the matching bottom card (its aria-label starts with `${display} (`)
    const matchingCard = screen.getByRole('button', {
      name: new RegExp(`^${targetDisplay} \\(`),
    });
    fireEvent.click(matchingCard);

    act(() => {
      vi.advanceTimersByTime(400);
    });

    expect(matchSpy).toHaveBeenCalledWith(false);
    expect(screen.getByText('10')).toBeDefined();

    act(() => {
      vi.advanceTimersByTime(900);
    });

    expect(screen.getByText('2/8')).toBeDefined();
  });

  it('supports English UI localization', () => {
    localStorage.setItem('taleen_lang', 'en');

    render(
      <LanguageProvider>
        <HarakatCarGame onGoHome={() => {}} />
      </LanguageProvider>
    );

    expect(screen.getByText('Arabic Harakat Car Race')).toBeDefined();
    expect(screen.getByText('Drive Through!')).toBeDefined();
  });
});
