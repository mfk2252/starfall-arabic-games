import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { ScrollToTop } from '../components/common/ScrollToTop';

describe('ScrollToTop behavior across routes', () => {
  let scrollToSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    scrollToSpy = vi.fn();
    window.scrollTo = scrollToSpy as unknown as typeof window.scrollTo;
    document.documentElement.scrollTop = 1200;
    document.body.scrollTop = 1200;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('immediately scrolls window to (0, 0) with behavior instant on route change', () => {
    render(
      <MemoryRouter initialEntries={['/games/numbers']}>
        <ScrollToTop />
      </MemoryRouter>
    );

    expect(scrollToSpy).toHaveBeenCalledWith({
      top: 0,
      left: 0,
      behavior: 'instant',
    });
    expect(document.documentElement.scrollTop).toBe(0);
    expect(document.body.scrollTop).toBe(0);
  });

  it('resets scroll to top when opening a game directly via URL', () => {
    render(
      <MemoryRouter initialEntries={['/games/seasons']}>
        <ScrollToTop />
      </MemoryRouter>
    );

    expect(scrollToSpy).toHaveBeenCalledWith({
      top: 0,
      left: 0,
      behavior: 'instant',
    });
  });

  it('scrolls to element when anchor hash is present', () => {
    const targetDiv = document.createElement('div');
    targetDiv.id = 'featured-games';
    const scrollIntoViewSpy = vi.fn();
    targetDiv.scrollIntoView = scrollIntoViewSpy;
    document.body.appendChild(targetDiv);

    render(
      <MemoryRouter initialEntries={['/#featured-games']}>
        <ScrollToTop />
      </MemoryRouter>
    );

    expect(scrollIntoViewSpy).toHaveBeenCalledWith({ behavior: 'instant' });
    document.body.removeChild(targetDiv);
  });
});
