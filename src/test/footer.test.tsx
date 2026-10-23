import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { LanguageProvider, useLanguage } from '../i18n/LanguageContext';
import { ThemeProvider } from '../theme/ThemeContext';

const TestNavbarWithLang: React.FC<{ lang?: 'ar' | 'en' }> = ({ lang = 'ar' }) => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <LangSwitcher lang={lang} />
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      </LanguageProvider>
    </ThemeProvider>
  );
};

const LangSwitcher: React.FC<{ lang: 'ar' | 'en' }> = ({ lang }) => {
  const { setLanguage } = useLanguage();
  React.useEffect(() => {
    setLanguage(lang);
  }, [lang, setLanguage]);
  return null;
};

describe('Header (Navbar) Requirements', () => {
  it('does NOT contain «احجز استشارة» or «احجز جلستك» in Header', () => {
    const { container } = render(<TestNavbarWithLang lang="ar" />);

    expect(container.textContent).not.toContain('احجز استشارة');
    expect(container.textContent).not.toContain('احجز جلستك');
  });

  it('contains the 5 essential navigation links, theme toggle, and language toggle', () => {
    const { container } = render(<TestNavbarWithLang lang="ar" />);

    const links = Array.from(container.querySelectorAll('a')).map(a => a.getAttribute('href'));
    expect(links).toContain('/');
    expect(links).toContain('/games');
    expect(links).toContain('/categories');
    expect(links).toContain('/stories');
    expect(links).toContain('/progress');

    // Theme toggle button exists
    const themeButton = container.querySelector('button[aria-label="Toggle theme"]');
    expect(themeButton).not.toBeNull();

    // Language toggle button exists
    const langButton = container.querySelector('button[aria-label="Toggle language"]');
    expect(langButton).not.toBeNull();
  });
});
