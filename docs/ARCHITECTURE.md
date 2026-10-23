# البنية المعمارية لمنصة تالين التعليمية للأطفال (TALEEN Architecture)

## 1. المبادئ المعمارية لمنصة تالين (Architectural Principles)
- **Component-Driven Modular Architecture**: تجزئة الواجهات إلى مكونات مشتركة قابلة لإعادة الاستخدام في مجلدات `components/`، مع عزل منطق الألعاب في `components/games/` والقصص في `data/stories.ts` و`pages/`.
- **Declarative Route Management**: استخدام `react-router-dom` مع مكوّن `ScrollToTop` لضمان بدء كل صفحة من الأعلى فورياً بدون مشكلات التمرير التلقائي.
- **Centralized Content Store (`src/data/`)**:
  - `games.ts` & `gameContent.ts`: تصنيف الـ 18 لعبة والأسئلة التعليمية.
  - `stories.ts`: القصص التفاعلية، نصوص الصفحات، وأسئلة الفهم والاستيعاب.
- **Child-Centered Accessibility & UX**:
  - أحجام نقر واسعة لا تقل عن 48px بالأبعاد القياسية لسهولة اللمس.
  - ألوان متباينة تحفز التركيز دون إجهاد بصري.
  - مؤثرات صوتية داخلية مولدة عبر Web Audio API مع دعم كتم الصوت بنقرة واحدة.
- **Founder & Clinical Consultation Integration**:
  - الربط الصريح والآمن مع بوابة الأخصائي ومؤسس المنصة **محمد فكري الكفافي** ([https://mfekry.vercel.app/](https://mfekry.vercel.app/)).
  - خلو التطبيق من جمع بيانات الدفع أو الحسابات؛ مما يضمن الامتثال الكامل لخصوصية وأمن الطفل.
- **Enhanced Arabic SEO & Schema.org**:
  - تكامل وسوم Meta وOpen Graph وTwitter Cards ومخطط Schema.org المنظم في `index.html`.
  - ملفات `robots.txt` و`sitemap.xml` في المجلد العام `public/`.

---

## 2. هيكل المجلدات المطبق (Folder Structure)

```
src/
├── components/          # المكونات المشتركة
│   ├── common/          # ScrollToTop, GameHeader, WinCelebration
│   ├── games/           # مكونات الألعاب التفاعلية الـ 18
│   ├── layout/          # الهيدر (Navbar)، الفوتر (Footer)، والتخطيط (AppLayout)
│   └── ui/              # بطاقات الألعاب، الأزرار، والشارات
├── data/                # محتوى الألعاب والقصص
│   ├── games.ts         # فهرس ومعلومات جميع الألعاب
│   ├── gameContent.ts   # الأسئلة والمفردات والأنماط
│   └── stories.ts       # محتوى القصص التفاعلية وأسئلة الاستيعاب
├── i18n/                # محرك الترجمة والقواميس
│   ├── ar.ts            # القاموس العربي المحدث لهوية تالين
│   ├── en.ts            # القاموس الإنجليزي
│   ├── types.ts         # واجهة الأنواع والقواميس
│   └── LanguageContext.tsx # سياق اللغة وتغيير الاتجاه (RTL/LTR)
├── pages/               # صفحات التطبيق والمسارات
│   ├── HomePage.tsx               # الصفحة الرئيسية
│   ├── AllGamesPage.tsx           # جميع الألعاب
│   ├── CategoriesOverviewPage.tsx # المسارات التعليمية
│   ├── CategoryPage.tsx           # ألعاب مسار محدد
│   ├── GamePlayPage.tsx           # تشغيل اللعبة
│   ├── StoriesPage.tsx            # مكتبة القصص المصورة
│   ├── StoryViewPage.tsx          # قراءة القصة وأسئلة الاستيعاب
│   ├── ConsultationPage.tsx       # الاستشارات وحجز الجلسات
│   ├── ProgressPage.tsx           # لوحة الإنجازات
│   └── AboutPage.tsx              # عن المنصة والمؤسس
├── test/                # اختبارات Vitest التلقائية
├── types/               # تعريفات TypeScript
└── utils/               # الصوت والتخزين المساعد
```

---

## 3. دورة حياة التمرير واستعادة الموضع (Scroll Lifecycle)
يتم تركيب المكون `<ScrollToTop />` مباشرة داخل `<BrowserRouter>` في `src/App.tsx`. عند أي تغير في `location.pathname` أو `location.search`:
- إذا وُجد وسم تجزئة (`#hash`)، يتم التمرير السلس إلى العنصر المستهدف.
- وإلا، يتم استدعاء `window.scrollTo({ top: 0, left: 0, behavior: 'instant' })` مع إعادة ضبط حاوية التمرير الرئيسية، لضمان ظهور الصفحة من بدايتها العلوية فور الانتقال أو التحديث.
