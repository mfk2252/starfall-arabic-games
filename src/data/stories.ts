export interface StoryPage {
  pageNumber: number;
  text: string;
  textEn: string;
  illustration: string; // Rich emoji/visual composition
  interactiveQuestion?: {
    question: string;
    questionEn: string;
    options: { text: string; textEn: string; isCorrect: boolean }[];
    hint: string;
    hintEn: string;
  };
}

export interface StoryInfo {
  id: string;
  title: string;
  titleEn: string;
  summary: string;
  summaryEn: string;
  coverIcon: string;
  gradient: string;
  ageRange: string;
  ageRangeEn: string;
  duration: string;
  durationEn: string;
  moral: string;
  moralEn: string;
  pages: StoryPage[];
}

export const STORIES_LIST: StoryInfo[] = [
  {
    id: 'tortoise-and-hare',
    title: 'الأرنب السريع والسلحفاة الصبورة',
    titleEn: 'The Fast Hare and The Patient Tortoise',
    summary: 'قصة ملهمة تعلم الأطفال قيمة الصبر والاستمرار وعدم الغرور',
    summaryEn: 'An inspiring story teaching children the value of patience, perseverance, and modesty',
    coverIcon: '🐢🐇',
    gradient: 'from-amber-400 to-orange-500',
    ageRange: '٣-٧ سنوات',
    ageRangeEn: '3-7 years',
    duration: '٤ دقائق',
    durationEn: '4 mins',
    moral: 'الاستمرار والهدوء يوصلان إلى النجاح دائماً!',
    moralEn: 'Slow and steady perseverance always achieves the goal!',
    pages: [
      {
        pageNumber: 1,
        text: 'في غابة خضراء جميلة، كان الأرنب السريع يتفاخر دائماً بأنه أسرع حيوان في الغابة كلها.',
        textEn: 'In a lush green forest, the speedy hare always bragged about being the fastest creature around.',
        illustration: '🌳🐇🌳💨',
        interactiveQuestion: {
          question: 'بماذا كان الأرنب يتفاخر أمام أصدقائه؟',
          questionEn: 'What did the hare always brag about?',
          options: [
            { text: 'بسرعته الكبيرة', textEn: 'His great speed', isCorrect: true },
            { text: 'بأنه يستطيع الطيران', textEn: 'That he can fly', isCorrect: false },
            { text: 'بلون فرائه', textEn: 'His fur color', isCorrect: false },
          ],
          hint: 'الأرنب مشهور بالقفز والركض السريع!',
          hintEn: 'Hares are famous for jumping and running fast!',
        },
      },
      {
        pageNumber: 2,
        text: 'ابتسمت السلحفاة الطيبة بهدوء وقالت: "يا أرنب، ما رأيك أن نتسابق حتى شجرة البلوط الكبيرة؟"',
        textEn: 'The kind tortoise smiled peacefully and said: "Friend hare, shall we race to the big oak tree?"',
        illustration: '🐢✨🌳🌲',
        interactiveQuestion: {
          question: 'إلى أين اتفقا على أن يكون خط النهاية؟',
          questionEn: 'Where was the finish line decided?',
          options: [
            { text: 'شجرة البلوط الكبيرة', textEn: 'The big oak tree', isCorrect: true },
            { text: 'قمة الجبل الثلجي', textEn: 'The snowy mountain', isCorrect: false },
            { text: 'شاطئ البحر', textEn: 'The seashore', isCorrect: false },
          ],
          hint: 'شجرة عظيمة في وسط الغابة!',
          hintEn: 'A magnificent tree in the middle of the woods!',
        },
      },
      {
        pageNumber: 3,
        text: 'انطلق الأرنب بسرعة فائقة، ثم نظر خلفه فرأى السلحفاة تسير ببطء. قال لنفسه: "سأنام قليلاً تحت ظل الشجرة، فلن تلحق بي أبداً!"',
        textEn: 'The hare dashed ahead. Looking back, he saw the tortoise far behind. He thought: "I can take a cozy nap under the shade, she will never catch up!"',
        illustration: '😴🐇💤🌳.......🐢',
        interactiveQuestion: {
          question: 'ماذا قرر الأرنب أن يفعل أثناء السباق؟',
          questionEn: 'What did the hare decide to do during the race?',
          options: [
            { text: 'النوم والراحة تحت الشجرة', textEn: 'Nap under the tree', isCorrect: true },
            { text: 'إكمال السباق دون توقف', textEn: 'Continue without stopping', isCorrect: false },
            { text: 'الرجوع إلى بيته', textEn: 'Go back home', isCorrect: false },
          ],
          hint: 'ظن الأرنب أن الفوز مضمون فنام!',
          hintEn: 'He thought victory was guaranteed and fell asleep!',
        },
      },
      {
        pageNumber: 4,
        text: 'بينما كان الأرنب نائماً، واصلت السلحفاة السير بخطوات ثابتة وصبر كبير، حتى وصلت إلى خط النهاية وفازت بالسباق وسط تشجيع حيوانات الغابة!',
        textEn: 'While the hare slept, the tortoise kept walking step by step with great patience, until she crossed the finish line to the cheering of all forest friends!',
        illustration: '🎉🐢🏆👏🌳🐇❗',
      },
    ],
  },
  {
    id: 'busy-bee',
    title: 'النحلة زينة وزهرة الربيع',
    titleEn: 'Zeina the Busy Bee and The Spring Flower',
    summary: 'رحلة استكشافية ملونة لتعريف الطفل بالعمل الجماعي وأهمية الأزهار في صنع العسل اللذيذ',
    summaryEn: 'A colorful journey introducing children to teamwork, spring blossoms, and honey making',
    coverIcon: '🐝🌸',
    gradient: 'from-emerald-400 to-teal-600',
    ageRange: '٢-٥ سنوات',
    ageRangeEn: '2-5 years',
    duration: '٣ دقائق',
    durationEn: '3 mins',
    moral: 'التعاون والنشاط يجلبان أطيب الثمار والخير للجميع!',
    moralEn: 'Cooperation and activity bring the sweetest outcomes for everyone!',
    pages: [
      {
        pageNumber: 1,
        text: 'استيقظت النحلة زينة مع إشراقة شمس الصباح الدافئة، ونفضت قطرات الندى عن جناحيها بحيوية.',
        textEn: 'Zeina the little bee woke up with the warm morning sunrise, cheerfully shaking dew drops off her wings.',
        illustration: '☀️🌻🐝✨',
        interactiveQuestion: {
          question: 'متى تستيقظ النحلة النشيطة لبدء عملها؟',
          questionEn: 'When does the busy bee wake up to begin work?',
          options: [
            { text: 'في الصباح الباكر مع شروق الشمس', textEn: 'Early morning at sunrise', isCorrect: true },
            { text: 'في منتصف الليل', textEn: 'In the middle of the night', isCorrect: false },
          ],
          hint: 'وقت النشاط والضوء الجميل!',
          hintEn: 'The time of daylight and fresh energy!',
        },
      },
      {
        pageNumber: 2,
        text: 'طارت زينة إلى بستان مليء بالأزهار الملونة: أزهار حمراء، وزرقاء، وصفراء. حطت برقة على زهرة ياسمين بيضاء.',
        textEn: 'Zeina flew over a blooming meadow with red, blue, and yellow blossoms. She gently rested on a fragrant white jasmine.',
        illustration: '🌸🌷🐝🌺🌼',
        interactiveQuestion: {
          question: 'ماذا تمتص النحلة من الأزهار؟',
          questionEn: 'What does the bee sip from blossoms?',
          options: [
            { text: 'الرحيق الحلو', textEn: 'Sweet nectar', isCorrect: true },
            { text: 'أوراق الشجر الجافة', textEn: 'Dry leaves', isCorrect: false },
          ],
          hint: 'سائل حلو المذاق تصنع منه العسل!',
          hintEn: 'Sweet liquid transformed into golden honey!',
        },
      },
      {
        pageNumber: 3,
        text: 'عادت زينة إلى خلية النحل مع رفيقاتها، وتعاون الجميع في صناعة العسل الذهبي اللذيذ والمفيد لصحة الأطفال!',
        textEn: 'Zeina returned to the hive with her bee friends, working together to produce delicious golden honey that keeps children healthy!',
        illustration: '🍯🐝💛🐝🍯',
      },
    ],
  },
  {
    id: 'raindrop-adventure',
    title: 'مغامرة قطرة المطر «ندى»',
    titleEn: 'The Adventure of Nada the Raindrop',
    summary: 'قصة علمية مبسطة تشرح دورة الماء في الطبيعة بأسلوب خيالي شيق',
    summaryEn: 'A delightful scientific story explaining the water cycle in nature through imaginative storytelling',
    coverIcon: '💧🌈',
    gradient: 'from-sky-400 to-blue-600',
    ageRange: '٤-٧ سنوات',
    ageRangeEn: '4-7 years',
    duration: '٤ دقائق',
    durationEn: '4 mins',
    moral: 'الماء نعمة غالية تسقي الأرض وتنشر الحياة والجمال!',
    moralEn: 'Water is a precious blessing that enlivens the earth and brings joy!',
    pages: [
      {
        pageNumber: 1,
        text: 'كانت القطرة ندى تسبح في مياه البحر الزرقاء الصافية، وتلعب مع الأسماك والدلافين بمرح.',
        textEn: 'Nada the droplet was swimming in the clear blue sea, playfully floating alongside little fish and dolphins.',
        illustration: '🌊💧🐟🐬🌊',
      },
      {
        pageNumber: 2,
        text: 'عندما أشرقت شمس الصيف الدافئة، شعرت ندى بأنها خفيفة جداً، فتبخرت وصعدت إلى السماء لتلتقي بغيمة بيضاء قطنية.',
        textEn: 'When the warm summer sun shone, Nada felt weightless, turning into gentle vapor rising into a fluffy white cloud.',
        illustration: '☀️☁️💧☁️✨',
        interactiveQuestion: {
          question: 'كيف تصعد قطرات الماء إلى السحب في السماء؟',
          questionEn: 'How do water droplets rise up to the clouds?',
          options: [
            { text: 'بالتبخر بفعل حرارة الشمس', textEn: 'Evaporating via sun warmth', isCorrect: true },
            { text: 'باستخدام صاروخ فضاء', textEn: 'Using a spaceship', isCorrect: false },
          ],
          hint: 'حرارة الشمس تجعل الماء بخاراً خفيفاً!',
          hintEn: 'Sun warmth turns water into light vapor!',
        },
      },
      {
        pageNumber: 3,
        text: 'هبت ريح لطيفة، فهطلت ندى ورفيقاتها مطراً عذباً روى الزهور وعشب الحديقة، وظهر قوس قزح بألوانه السبعة الساحرة!',
        textEn: 'A cool breeze blew, and Nada danced down as sweet raindrops watering garden grass, welcoming a breathtaking seven-colored rainbow!',
        illustration: '🌧️🌈🌱🌸💧',
      },
    ],
  },
];

export const getStoryById = (id: string): StoryInfo | undefined => {
  return STORIES_LIST.find((s) => s.id === id);
};
