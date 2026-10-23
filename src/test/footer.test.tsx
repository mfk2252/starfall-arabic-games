import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Footer } from '../components/layout/Footer';
import { Navbar } from '../components/layout/Navbar';
import { LanguageProvider, useLanguage } from '../i18n/LanguageContext';
import { ThemeProvider } from '../theme/ThemeContext';

const TestFooterWithLang: React.FC<{ lang?: 'ar' | 'en' }> = ({ lang = 'ar' }) => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <LangSwitcher lang={lang} />
        <BrowserRouter>
          <Footer />
        </BrowserRouter>
      </LanguageProvider>
    </ThemeProvider>
  );
};

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

describe('Footer Redesign Requirements', () => {
  it('displays ONLY «تالين» in Arabic without English name or subtitle', () => {
    const { container } = render(<TestFooterWithLang lang="ar" />);

    const brandElement = container.querySelector('a[aria-label="تالين"]');
    expect(brandElement).not.toBeNull();
    expect(brandElement?.textContent).toContain('تالين');
    expect(brandElement?.textContent).not.toContain('TALEEN');

    expect(container.textContent).not.toContain('منصة تالين التعليمية للأطفال');

    const currentYear = new Date().getFullYear().toString();
    expect(container.textContent).toContain(`© ${currentYear}`);
  });

  it('displays ONLY «TALEEN» in English without Arabic name or subtitle', () => {
    const { container } = render(<TestFooterWithLang lang="en" />);

    const brandElement = container.querySelector('a[aria-label="TALEEN"]');
    expect(brandElement).not.toBeNull();
    expect(brandElement?.textContent).toContain('TALEEN');
    expect(brandElement?.textContent).not.toContain('تالين');

    expect(container.textContent).not.toContain('منصة تالين التعليمية للأطفال');
    expect(container.textContent).not.toContain('TALEEN Kids Learning Platform');

    const currentYear = new Date().getFullYear().toString();
    expect(container.textContent).toContain(`© ${currentYear}`);
  });

  it('contains the butterfly icon inside the brand logo', () => {
    const { container } = render(<TestFooterWithLang lang="ar" />);
    const butterflyElement = container.querySelector('a[aria-label="تالين"] img, a[aria-label="تالين"] svg');
    expect(butterflyElement).not.toBeNull();
    expect(container.textContent).not.toContain('⭐');
  });

  it('contains founder portfolio link and legal links', () => {
    const { container } = render(<TestFooterWithLang lang="ar" />);
    
    const links = Array.from(container.querySelectorAll('a')).map(a => a.getAttribute('href'));
    expect(links).toContain('https://mfekry.vercel.app/');
    expect(links).toContain('/about');
    expect(links).toContain('/privacy');
    expect(links).toContain('/terms');
    expect(links).toContain('/consultation');
  });

  it('contains both «احجز استشارة» and «احجز جلستك» action buttons in footer', () => {
    const { container } = render(<TestFooterWithLang lang="ar" />);

    expect(container.textContent).toContain('احجز جلستك');
    expect(container.textContent).toContain('احجز استشارة');
  });
});

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
