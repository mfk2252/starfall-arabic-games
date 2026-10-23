import { describe, it, expect } from 'vitest';
import { STORIES_LIST, getStoryById } from '../data/stories';

describe('Stories Data Integrity', () => {
  it('should have stories loaded with all required fields', () => {
    expect(STORIES_LIST.length).toBeGreaterThanOrEqual(3);

    STORIES_LIST.forEach((story) => {
      expect(story.id).toBeTruthy();
      expect(story.title).toBeTruthy();
      expect(story.titleEn).toBeTruthy();
      expect(story.summary).toBeTruthy();
      expect(story.moral).toBeTruthy();
      expect(story.pages.length).toBeGreaterThan(0);

      // Verify that pages have illustrations and questions if present
      story.pages.forEach((page) => {
        expect(page.pageNumber).toBeGreaterThan(0);
        expect(page.text).toBeTruthy();
        expect(page.textEn).toBeTruthy();
        expect(page.illustration).toBeTruthy();

        if (page.interactiveQuestion) {
          expect(page.interactiveQuestion.options.length).toBeGreaterThanOrEqual(2);
          const hasCorrect = page.interactiveQuestion.options.some((o) => o.isCorrect);
          expect(hasCorrect).toBe(true);
        }
      });
    });
  });

  it('should retrieve existing story by ID', () => {
    const story = getStoryById('tortoise-and-hare');
    expect(story).toBeDefined();
    expect(story?.title).toContain('الأرنب');
  });

  it('should return undefined for non-existent story ID', () => {
    const story = getStoryById('non-existent-story');
    expect(story).toBeUndefined();
  });
});
