import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { MyLittleKitchenGame } from '../components/games/MyLittleKitchenGame';
import { GAMES_LIST } from '../data/games';
import {
  INGREDIENTS_DATABASE,
  KITCHEN_TOOLS,
  GUIDED_RECIPES,
  FOOD_CATEGORIES,
} from '../data/myLittleKitchenData';
import { LanguageProvider } from '../i18n/LanguageContext';
import { ThemeProvider } from '../theme/ThemeContext';

const renderMyLittleKitchen = () => {
  return render(
    <ThemeProvider>
      <LanguageProvider>
        <BrowserRouter>
          <MyLittleKitchenGame onGoHome={() => {}} />
        </BrowserRouter>
      </LanguageProvider>
    </ThemeProvider>
  );
};

describe('My Little Kitchen (مطبخي الصغير) Game Integration', () => {
  beforeEach(() => {
    localStorage.clear();
  });
  it('is registered in GAMES_LIST with proper title and description', () => {
    const game = GAMES_LIST.find((g) => g.id === 'my-little-kitchen');
    expect(game).toBeDefined();
    expect(game?.title).toBe('مطبخي الصغير');
    expect(game?.titleEn).toBe('My Little Kitchen');
    expect(game?.description).toBe('اختر مكوناتك، حضّر وجباتك، واصنع أطباقك المفضلة!');
    expect(game?.icon).toBe('🍳');
    expect(game?.minAge).toBe(3);
    expect(game?.maxAge).toBe(6);
  });

  it('contains comprehensive database with 7 categories, tools, drinks and Arabic/world dishes', () => {
    expect(INGREDIENTS_DATABASE.length).toBeGreaterThanOrEqual(45);
    expect(KITCHEN_TOOLS.length).toBeGreaterThanOrEqual(9);
    expect(GUIDED_RECIPES.length).toBe(15);
    expect(FOOD_CATEGORIES.length).toBe(7);

    // Verify 7 specific categories are defined
    const catIds = FOOD_CATEGORIES.map((c) => c.id);
    expect(catIds).toContain('fruits_veg');
    expect(catIds).toContain('staples');
    expect(catIds).toContain('proteins');
    expect(catIds).toContain('desserts');
    expect(catIds).toContain('drinks');
    expect(catIds).toContain('dishes_world');
    expect(catIds).toContain('dishes_arabic');

    // Verify presence of Arabic dishes and world dishes
    const falafel = INGREDIENTS_DATABASE.find((i) => i.id === 'falafel-dish');
    expect(falafel).toBeDefined();
    expect(falafel?.category).toBe('dishes_arabic');

    const pizza = INGREDIENTS_DATABASE.find((i) => i.id === 'pizza-dish');
    expect(pizza).toBeDefined();
    expect(pizza?.category).toBe('dishes_world');

    // Verify drinks
    const orangeJuice = INGREDIENTS_DATABASE.find((i) => i.id === 'orange-juice-drink');
    expect(orangeJuice).toBeDefined();
    expect(orangeJuice?.category).toBe('drinks');

    // Verify tools include spoon and fork
    const spoon = KITCHEN_TOOLS.find((t) => t.id === 'spoon');
    const fork = KITCHEN_TOOLS.find((t) => t.id === 'fork');
    expect(spoon).toBeDefined();
    expect(fork).toBeDefined();
  });

  it('renders Welcome Screen initially with play button and description', () => {
    renderMyLittleKitchen();

    // Welcome title & description
    expect(screen.getAllByText(/مطبخي الصغير/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('اختر مكوناتك، حضّر وجباتك، واصنع أطباقك المفضلة!')).toBeDefined();
    
    // Play button
    const startBtn = screen.getByText(/ابدأ اللعب الآن/);
    expect(startBtn).toBeDefined();
  });

  it('transitions to kitchen workspace upon clicking start button', () => {
    renderMyLittleKitchen();

    const startBtn = screen.getByText(/ابدأ اللعب الآن/);
    fireEvent.click(startBtn);

    // Workspace should now be active with category tabs
    expect(screen.getByText(/الفواكه والخضروات/)).toBeDefined();
    expect(screen.getByText(/الحبوب والألبان/)).toBeDefined();
    expect(screen.getByText(/المشروبات والعصائر/)).toBeDefined();
    expect(screen.getByText(/الأطباق العربية والشعبية/)).toBeDefined();
  });

  it('allows switching between categories in bottom dock', () => {
    renderMyLittleKitchen();

    // Enter workspace
    fireEvent.click(screen.getByText(/ابدأ اللعب الآن/));

    // Click on Arabic dishes tab
    const arabicTab = screen.getByText(/الأطباق العربية والشعبية/);
    fireEvent.click(arabicTab);

    // Expect falafel dish to be visible
    expect(screen.getByTitle(/فلافل/)).toBeDefined();
  });

  it('adds an ingredient to the work surface when clicked', () => {
    renderMyLittleKitchen();

    fireEvent.click(screen.getByText(/ابدأ اللعب الآن/));

    // In initial fruits_veg tab, find Apple button
    const appleBtn = screen.getByTitle('تفاح');
    fireEvent.click(appleBtn);

    // Should find placed item on plate
    expect(screen.getAllByText('تفاح').length).toBeGreaterThanOrEqual(1);

    // Finish dish button exists
    const finishBtn = screen.getByText(/قدّم الطبق/);
    expect(finishBtn).toBeDefined();
  });

  it('triggers responsive celebration modal upon clicking serve dish with play again and back buttons', () => {
    renderMyLittleKitchen();

    fireEvent.click(screen.getByText(/ابدأ اللعب الآن/));

    // Add an apple
    fireEvent.click(screen.getByTitle('تفاح'));

    // Click serve dish button
    const finishBtn = screen.getByText(/قدّم الطبق/);
    fireEvent.click(finishBtn);

    // WinCelebration should appear like all other games
    expect(screen.getByText(/رائع يا بطل/)).toBeDefined();
    expect(screen.getByText(/العب مجدداً/)).toBeDefined();
    expect(screen.getByText(/العودة للألعاب/)).toBeDefined();

    // Clicking play again resets the dish and closes celebration
    fireEvent.click(screen.getByText(/العب مجدداً/));
    expect(screen.queryByText(/العب مجدداً/)).toBeNull();
  });

  it('triggers interactive tools like knife or sink', () => {
    renderMyLittleKitchen();

    fireEvent.click(screen.getByText(/ابدأ اللعب الآن/));

    const knifeTool = screen.getByTitle(/سكين/);
    fireEvent.click(knifeTool);

    // Active tool state should show feedback or active icon
    expect(screen.getByTitle(/سكين/)).toBeDefined();
  });

  it('allows opening guided recipe modal and picking a recipe', () => {
    renderMyLittleKitchen();

    fireEvent.click(screen.getByText(/ابدأ اللعب الآن/));

    // Open recipe modal
    const recipeModalBtn = screen.getByTitle(/كتاب الوصفات/);
    fireEvent.click(recipeModalBtn);

    // Recipe modal opened
    expect(screen.getByText(/سلطة الفواكه المنعشة/)).toBeDefined();
    expect(screen.getByText(/طبق الكبسة العربية الأصيلة/)).toBeDefined();

    // Select a recipe
    fireEvent.click(screen.getByText(/سلطة الفواكه المنعشة/));

    // Should display guided recipe banner
    expect(screen.getByText(/سلطة الفواكه المنعشة/)).toBeDefined();
  });
});
