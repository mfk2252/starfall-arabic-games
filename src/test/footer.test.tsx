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

describe('Footer Info Mark Requirements', () => {
  it('has completely removed the old bulky footer card and redundant buttons', () => {
    const { container } = render(<TestFooterWithLang lang="ar" />);

    // Old large card elements must be gone
    expect(container.textContent).not.toContain('احجز استشارة');
    expect(container.textContent).not.toContain('احجز جلستك');
    expect(container.textContent).not.toContain('سياسة الخصوصية');
    expect(container.textContent).not.toContain('شروط الاستخدام');
    expect(container.textContent).not.toContain('الموقع الشخصي للمطور');
  });

  it('renders the Info mark linking to developer information page (/about) in Arabic', () => {
    const { container } = render(<TestFooterWithLang lang="ar" />);

    const link = container.querySelector('a[href="/about"]');
    expect(link).not.toBeNull();
    expect(link?.getAttribute('aria-label')).toBe('معلومات المطور والمنصة');

    // Contains svg info icon
    const svgIcon = link?.querySelector('svg');
    expect(svgIcon).not.toBeNull();
  });

  it('renders the Info mark with English labels when language is English', () => {
    const { container } = render(<TestFooterWithLang lang="en" />);

    const link = container.querySelector('a[href="/about"]');
    expect(link).not.toBeNull();
    expect(link?.getAttribute('aria-label')).toBe('Developer & Platform Info');
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
