# البنية المعمارية لمنصة ستار فل بالعربي (Architecture Documentation)

## 1. المبادئ المعمارية (Architectural Principles)
- **Component-Driven Modular Architecture**: تجزئة الواجهات إلى مكونات مشتركة قابلة لإعادة الاستخدام في مجلدات `components/`، مع عزل منطق الألعاب في `components/games/` و`features/`.
- **Declarative Route Management**: استخدام `react-router-dom` مع مسارات صريحة ومكون تخطيط عام (`AppLayout`) يحوي رأس الصفحة التفاعلي وشريط التنقل والتذييل ومحدد اللغة ونظام الصوت.
- **Centralized Content Store (`src/data/`)**: فصل جميع نصوص الأسئلة والمستويات والخيارات عن مكونات العرض، مما يتيح التوسع بسهولة وإضافة ألعاب جديدة وتحديث اللغات بدون لمس كود المنطق.
- **Child-Centered Accessibility & UX**:
  - أحجام نقر لا تقل عن 48px بالأبعاد القياسية.
  - ألوان متباينة تحفز التركيز.
  - إشارات نصية وأيقونية مصاحبة للألوان لدعم التمييز البصري.
  - مؤثرات صوتية مبنية عبر Web Audio API بدون تحميل أي ملفات صوت خارجية مهددة بالفقدان أو التأخير.
- **Zero-Backend Privacy Compliance**:
  - لا حاجة لتسجيل الدخول أو جمع بيانات شخصية عن الأطفال.
  - حفظ النجوم والدرجات محلياً في `localStorage` مع معالجة آمنة لحالات الفشل وزر مسح للبيانات عند رغبة ولي الأمر أو المعلم.

---

## 2. هيكل المجلدات المطبق (Folder Structure)

```
src/
├── components/          # المكونات المشتركة
│   ├── common/          # مكونات الرأس والأصوات والاحتفال
│   ├── games/           # مكونات الألعاب التفاعلية (18 لعبة)
│   ├── layout/          # الهيدر، الفوتر، وشريط التنقل
│   └── ui/              # بطاقات وأزرار وشارات
├── data/                # محتوى الألعاب والمستويات والبيانات
│   ├── games.ts         # فهرس ومعلومات جميع الألعاب
│   └── gameContent.ts   # الأسئلة والمفردات والأنماط
├── i18n/                # محرك الترجمة والقواميس
│   ├── ar.ts            # القاموس العربي
│   ├── en.ts            # القاموس الإنجليزي
│   └── index.ts         # سياق وهوك الترجمة وتغيير الاتجاه
├── pages/               # صفحات التطبيق والمسارات
│   ├── HomePage.tsx
│   ├── AllGamesPage.tsx
│   ├── CategoryPage.tsx
│   ├── CategoriesOverviewPage.tsx
│   ├── GamePlayPage.tsx
│   ├── ProgressPage.tsx
│   └── AboutPage.tsx
├── test/                # إعدادات واختبارات Vitest
├── types/               # تعريفات TypeScript
└── utils/               # الصوت والتخزين المساعد
```

---

## 3. إرشادات إضافة لعبة جديدة (Adding a New Game)
1. عرّف معرف اللعبة الجديد `GameId` في `src/types/index.ts`.
2. أضف تفاصيل وبيانات اللعبة وفئتها في `src/data/games.ts` مع العنوان والوصف والأيقونة والأعمار.
3. أضف أسئلة ومستويات اللعبة في `src/data/gameContent.ts`.
4. أنشئ مكون اللعبة داخل `src/components/games/YourNewGame.tsx` مستخدماً `GameHeader` و`WinCelebration` ومساعد الصوت `sound`.
5. اربط اللعبة في صفحة تشغيل الألعاب `src/pages/GamePlayPage.tsx`.
6. أضف اختباراً بسيطاً لمنطق اللعبة في `src/test/games.test.tsx`.
