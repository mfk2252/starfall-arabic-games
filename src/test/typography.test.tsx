import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { LanguageProvider } from '../i18n/LanguageContext';
import { ThemeProvider } from '../theme/ThemeContext';
import { Navbar } from '../components/layout/Navbar';
import { GameHeader } from '../components/common/GameHeader';

describe('Typography & Almarai Font Integration', () => {
  it('renders the brand heading with font-heading class in Navbar', () => {
    const { container } = render(
      <ThemeProvider>
        <LanguageProvider>
          <BrowserRouter>
            <Navbar />
          </BrowserRouter>
        </LanguageProvider>
      </ThemeProvider>
    );

    const brandSpan = container.querySelector('.font-heading');
    expect(brandSpan).not.toBeNull();
    expect(brandSpan?.textContent).toBe('تالين');
  });

  it('renders the game header with font-heading class on h1', () => {
    const { container } = render(
      <LanguageProvider>
        <GameHeader
          title="لعبة الأرقام"
          icon="🔢"
          score={10}
          onRestart={() => {}}
          onGoHome={() => {}}
        />
      </LanguageProvider>
    );

    const heading = container.querySelector('h1.font-heading');
    expect(heading).not.toBeNull();
    expect(heading?.textContent).toContain('لعبة الأرقام');
  });
});
