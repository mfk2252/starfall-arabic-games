export type BlockCategory = 'shapes' | 'letters' | 'numbers' | 'nature' | 'decor';

export interface BlockItem {
  id: string;
  nameAr: string;
  nameEn: string;
  category: BlockCategory;
  type: 'cube' | 'rect' | 'triangle' | 'circle' | 'star' | 'heart' | 'roof' | 'arch' | 'cylinder' | 'letter' | 'number' | 'nature';
  label?: string; // For letters and numbers
  color: string; // Tailwind color or hex gradient base
  accentColor: string;
  width: number; // in grid units or relative px (e.g. 50, 70, 100)
  height: number;
  icon?: string;
}

export interface PlacedBlock {
  uid: string;
  blockId: string;
  type: BlockItem['type'];
  label?: string;
  color: string;
  accentColor: string;
  x: number; // relative to canvas in px
  y: number;
  width: number;
  height: number;
  rotation: number; // 0, 90, 180, 270
  zIndex: number;
  icon?: string;
}

// Visual Building Blueprint (ابنِ الشكل)
export interface ModelBlueprint {
  id: string;
  titleAr: string;
  titleEn: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  icon: string;
  descriptionAr: string;
  descriptionEn: string;
  targetCount: number;
  hintAr: string;
  requiredTypes: Array<{ type: BlockItem['type'] | string; count: number; nameAr: string }>;
  sampleImageSvg?: string;
}

// Letter Word Challenge (عالم الحروف)
export interface WordChallenge {
  id: string;
  wordAr: string;
  wordEn: string;
  language: 'ar' | 'en';
  letters: string[];
  imageIcon: string;
  hintAr: string;
  hintEn: string;
  categoryAr: string;
}

// Number Challenge (عالم الأرقام)
export interface NumberChallenge {
  id: string;
  targetNumber: number;
  type: 'count' | 'addition' | 'subtraction' | 'order';
  questionAr: string;
  questionEn: string;
  equation?: string;
  hintAr: string;
}

// Shape Challenge (عالم الأشكال)
export interface ShapeChallenge {
  id: string;
  titleAr: string;
  titleEn: string;
  icon: string;
  instructionAr: string;
  requiredShapes: Array<{ shape: BlockItem['type']; count: number; nameAr: string }>;
  hintAr: string;
}

// -------------------------------------------------------------------
// 1. PALETTE OF BLOCKS (مكعبات وقطع البناء)
// -------------------------------------------------------------------
export const PALETTE_BLOCKS: BlockItem[] = [
  // --- Geometric Basic Building Blocks ---
  {
    id: 'cube-red',
    nameAr: 'مكعب أحمر',
    nameEn: 'Red Cube',
    category: 'shapes',
    type: 'cube',
    color: '#ef4444',
    accentColor: '#b91c1c',
    width: 60,
    height: 60,
  },
  {
    id: 'cube-blue',
    nameAr: 'مكعب أزرق',
    nameEn: 'Blue Cube',
    category: 'shapes',
    type: 'cube',
    color: '#3b82f6',
    accentColor: '#1d4ed8',
    width: 60,
    height: 60,
  },
  {
    id: 'cube-yellow',
    nameAr: 'مكعب أصفر',
    nameEn: 'Yellow Cube',
    category: 'shapes',
    type: 'cube',
    color: '#eab308',
    accentColor: '#ca8a04',
    width: 60,
    height: 60,
  },
  {
    id: 'cube-green',
    nameAr: 'مكعب أخضر',
    nameEn: 'Green Cube',
    category: 'shapes',
    type: 'cube',
    color: '#22c55e',
    accentColor: '#15803d',
    width: 60,
    height: 60,
  },
  {
    id: 'cube-pink',
    nameAr: 'مكعب وردي',
    nameEn: 'Pink Cube',
    category: 'shapes',
    type: 'cube',
    color: '#ec4899',
    accentColor: '#be185d',
    width: 60,
    height: 60,
  },
  {
    id: 'cube-purple',
    nameAr: 'مكعب بنفسجي',
    nameEn: 'Purple Cube',
    category: 'shapes',
    type: 'cube',
    color: '#a855f7',
    accentColor: '#7e22ce',
    width: 60,
    height: 60,
  },

  // --- Rectangles (Planks & Pillars) ---
  {
    id: 'rect-orange',
    nameAr: 'مستطيل برتقالي',
    nameEn: 'Orange Rectangle',
    category: 'shapes',
    type: 'rect',
    color: '#f97316',
    accentColor: '#c2410c',
    width: 120,
    height: 60,
  },
  {
    id: 'rect-pillar-teal',
    nameAr: 'عمود مستطيل فيروزي',
    nameEn: 'Teal Pillar',
    category: 'shapes',
    type: 'rect',
    color: '#14b8a6',
    accentColor: '#0f766e',
    width: 60,
    height: 120,
  },
  {
    id: 'rect-wood',
    nameAr: 'لوح خشبي',
    nameEn: 'Wood Plank',
    category: 'shapes',
    type: 'rect',
    color: '#d97706',
    accentColor: '#92400e',
    width: 140,
    height: 40,
  },

  // --- Triangular Roofs & Wedges ---
  {
    id: 'roof-red',
    nameAr: 'سقف مثلث أحمر',
    nameEn: 'Red Roof Triangle',
    category: 'shapes',
    type: 'triangle',
    color: '#f43f5e',
    accentColor: '#be123c',
    width: 120,
    height: 60,
  },
  {
    id: 'triangle-green',
    nameAr: 'مثلث أخضر',
    nameEn: 'Green Triangle',
    category: 'shapes',
    type: 'triangle',
    color: '#10b981',
    accentColor: '#047857',
    width: 70,
    height: 70,
  },
  {
    id: 'triangle-yellow',
    nameAr: 'مثلث أصفر',
    nameEn: 'Yellow Triangle',
    category: 'shapes',
    type: 'triangle',
    color: '#facc15',
    accentColor: '#ca8a04',
    width: 60,
    height: 60,
  },

  // --- Curves, Arches & Circles ---
  {
    id: 'circle-cyan',
    nameAr: 'دائرة / عجلة زرقاء',
    nameEn: 'Cyan Circle / Wheel',
    category: 'shapes',
    type: 'circle',
    color: '#06b6d4',
    accentColor: '#0e7490',
    width: 60,
    height: 60,
  },
  {
    id: 'circle-gold',
    nameAr: 'دائرة / شمس ذهبية',
    nameEn: 'Gold Circle',
    category: 'shapes',
    type: 'circle',
    color: '#fbbf24',
    accentColor: '#d97706',
    width: 60,
    height: 60,
  },
  {
    id: 'arch-purple',
    nameAr: 'قوس قلعة بنفسجي',
    nameEn: 'Purple Arch',
    category: 'shapes',
    type: 'arch',
    color: '#8b5cf6',
    accentColor: '#6d28d9',
    width: 120,
    height: 60,
  },

  // --- Special Shapes: Star, Heart ---
  {
    id: 'shape-star',
    nameAr: 'نجمة ذهبية لامعة',
    nameEn: 'Golden Star',
    category: 'shapes',
    type: 'star',
    color: '#eab308',
    accentColor: '#a16207',
    width: 65,
    height: 65,
  },
  {
    id: 'shape-heart',
    nameAr: 'قلب وردي لطيف',
    nameEn: 'Pink Heart',
    category: 'shapes',
    type: 'heart',
    color: '#f43f5e',
    accentColor: '#9f1239',
    width: 65,
    height: 65,
  },

  // --- Nature and Decorative Additions ---
  {
    id: 'nature-tree-top',
    nameAr: 'قمة شجرة خضراء',
    nameEn: 'Tree Bush',
    category: 'nature',
    type: 'nature',
    color: '#22c55e',
    accentColor: '#166534',
    width: 70,
    height: 70,
    icon: '🌳',
  },
  {
    id: 'nature-flower',
    nameAr: 'زهرة ملونة',
    nameEn: 'Flower',
    category: 'nature',
    type: 'nature',
    color: '#ec4899',
    accentColor: '#9d174d',
    width: 55,
    height: 55,
    icon: '🌸',
  },
  {
    id: 'nature-cloud',
    nameAr: 'سحابة ناصعة',
    nameEn: 'White Cloud',
    category: 'nature',
    type: 'nature',
    color: '#e0f2fe',
    accentColor: '#7dd3fc',
    width: 80,
    height: 45,
    icon: '☁️',
  },
  {
    id: 'nature-flag',
    nameAr: 'راية / علم القلعة',
    nameEn: 'Castle Flag',
    category: 'nature',
    type: 'nature',
    color: '#ef4444',
    accentColor: '#991b1b',
    width: 50,
    height: 50,
    icon: '🚩',
  },
];

// Arabic Alphabet Blocks (أ إلى ي)
export const ARABIC_LETTERS = [
  'أ', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'هـ', 'و', 'ي'
];

// English Alphabet Blocks (A to Z)
export const ENGLISH_LETTERS = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
];

// Numbers Blocks (0 to 20)
export const NUMBER_BLOCKS_LIST = Array.from({ length: 21 }, (_, i) => i);

// -------------------------------------------------------------------
// 2. BLUEPRINTS FOR "ابنِ الشكل" (Build the Model)
// -------------------------------------------------------------------
export const MODEL_BLUEPRINTS: ModelBlueprint[] = [
  {
    id: 'house',
    titleAr: 'المنزل السعيد',
    titleEn: 'Happy House',
    difficulty: 'easy',
    category: 'buildings',
    icon: '🏠',
    descriptionAr: 'ابنِ منزلاً جميلاً بوضع الجدران المربعة مع سقف مثلث أحمر وباب مستطيل!',
    descriptionEn: 'Build a cute house with square walls, a triangle roof, and a door!',
    targetCount: 4,
    hintAr: 'ابدأ بمكعب أو مستطيل للقاعدة، ثم ضع السقف المثلث فوقه!',
    requiredTypes: [
      { type: 'cube', count: 2, nameAr: 'مكعب للجدران' },
      { type: 'triangle', count: 1, nameAr: 'سقف مثلث' },
      { type: 'rect', count: 1, nameAr: 'مستطيل للباب' },
    ],
  },
  {
    id: 'tree',
    titleAr: 'شجرة الحديقة',
    titleEn: 'Garden Tree',
    difficulty: 'easy',
    category: 'nature',
    icon: '🌳',
    descriptionAr: 'ابنِ شجرة خضراء باستخدام جذع مستطيل بني وأوراق خضراء في الأعلى!',
    descriptionEn: 'Build a garden tree using a wooden trunk and green foliage!',
    targetCount: 3,
    hintAr: 'ضع جذع الخشب في الأسفل، وركّب فوقه مثلثات أو دوائر خضراء!',
    requiredTypes: [
      { type: 'rect', count: 1, nameAr: 'عمود مستطيل للجذع' },
      { type: 'nature', count: 1, nameAr: 'شجرة خضراء' },
      { type: 'cube', count: 1, nameAr: 'قاعدة عشبية' },
    ],
  },
  {
    id: 'car',
    titleAr: 'السيارة السريعة',
    titleEn: 'Speedy Car',
    difficulty: 'medium',
    category: 'vehicles',
    icon: '🚗',
    descriptionAr: 'ركّب سيارة أنيقة باستخدام مستطيل للهيكل ودائرتين للعجلات ومكعب للنافذة!',
    descriptionEn: 'Assemble a car using a body rectangle, cube cabin, and 2 wheels!',
    targetCount: 4,
    hintAr: 'ضع المستطيل في المنتصف، العجلات الدائرية في الأسفل، والمكعب فوقه!',
    requiredTypes: [
      { type: 'rect', count: 1, nameAr: 'مستطيل لهيكل السيارة' },
      { type: 'circle', count: 2, nameAr: 'دوائر للعجلات' },
      { type: 'cube', count: 1, nameAr: 'مكعب للنافذة' },
    ],
  },
  {
    id: 'robot',
    titleAr: 'الروبوت الذكي',
    titleEn: 'Smart Robot',
    difficulty: 'medium',
    category: 'robots',
    icon: '🤖',
    descriptionAr: 'ابنِ صديقك الآلي باستخدام مكعبات للرأس والجسم، وأعمدة للأذرع والسيقان!',
    descriptionEn: 'Build a robot pal with a cube head, body, and limbs!',
    targetCount: 5,
    hintAr: 'ضع مكعب الجسم أولاً، ثم الرأس في الأعلى، وأضف الأذرع الجانبية!',
    requiredTypes: [
      { type: 'cube', count: 2, nameAr: 'مكعبات للرأس والجسم' },
      { type: 'rect', count: 2, nameAr: 'مستطيلات للأذرع' },
      { type: 'circle', count: 1, nameAr: 'قلب أو عين مضيئة' },
    ],
  },
  {
    id: 'castle',
    titleAr: 'قلعة الأميرة',
    titleEn: 'Princess Castle',
    difficulty: 'hard',
    category: 'buildings',
    icon: '🏰',
    descriptionAr: 'شيّد قلعة ملكية فخمة بأبراج عالية، وأقواس للأبواب، ورايات ترفرف في القمة!',
    descriptionEn: 'Erect a majestic castle with towers, arches, and fluttering flags!',
    targetCount: 6,
    hintAr: 'استخدم القوس البنفسجي كمدخل رئيسي، وضع الأبراج على الجانبين!',
    requiredTypes: [
      { type: 'arch', count: 1, nameAr: 'قوس للمدخل' },
      { type: 'rect', count: 2, nameAr: 'أعمدة للأبراج' },
      { type: 'triangle', count: 2, nameAr: 'أسطح الأبراج' },
      { type: 'nature', count: 1, nameAr: 'راية أو زينة' },
    ],
  },
  {
    id: 'boat',
    titleAr: 'قارب البحيرة',
    titleEn: 'Lake Boat',
    difficulty: 'medium',
    category: 'vehicles',
    icon: '⛵',
    descriptionAr: 'ركّب قارباً شراعيًا يطفو على الماء باستخدام قاعدة مستطيلة وشراع مثلث!',
    descriptionEn: 'Assemble a sailboat with a base hull and triangle sail!',
    targetCount: 4,
    hintAr: 'ضع اللوح الخشبي كقاعدة، والمثلث كسارية وشراع في الأعلى!',
    requiredTypes: [
      { type: 'rect', count: 1, nameAr: 'قاعدة القارب' },
      { type: 'triangle', count: 2, nameAr: 'أشرعة مثلثة' },
      { type: 'circle', count: 1, nameAr: 'نافذة أو طوق نجاة' },
    ],
  },
  {
    id: 'flower',
    titleAr: 'زهرة الربيع',
    titleEn: 'Spring Flower',
    difficulty: 'easy',
    category: 'nature',
    icon: '🌸',
    descriptionAr: 'شكّل زهرة جميلة باستخدام ساق مستطيل وبتلات ملونة ونجمة أو دائرة في المنتصف!',
    descriptionEn: 'Create a spring flower with a green stem and vibrant petals!',
    targetCount: 4,
    hintAr: 'ابدأ بالساق الأخضر عموديًا، ثم ضع الدائرة والبتلات في القمة!',
    requiredTypes: [
      { type: 'rect', count: 1, nameAr: 'ساق مستطيل' },
      { type: 'circle', count: 1, nameAr: 'قلب الزهرة' },
      { type: 'triangle', count: 2, nameAr: 'أوراق الشجر' },
    ],
  },
  {
    id: 'rocket',
    titleAr: 'صاروخ الفضاء',
    titleEn: 'Space Rocket',
    difficulty: 'hard',
    category: 'vehicles',
    icon: '🚀',
    descriptionAr: 'انطلق نحو النجوم بتركيب صاروخ طويل مزود برأس مدبب وأجنحة دفع!',
    descriptionEn: 'Launch into space with a tall rocket body, nose cone, and fins!',
    targetCount: 5,
    hintAr: 'رصّ مكعبين أو مستطيلاً للبدن، ثم مثلث القمة في الأعلى ومثلثات الدفع في الأسفل!',
    requiredTypes: [
      { type: 'rect', count: 1, nameAr: 'بدن الصاروخ' },
      { type: 'triangle', count: 3, nameAr: 'رأس الصاروخ والأجنحة' },
      { type: 'circle', count: 1, nameAr: 'نافذة رواد الفضاء' },
    ],
  },
];

// -------------------------------------------------------------------
// 3. WORD CHALLENGES FOR "عالم الحروف"
// -------------------------------------------------------------------
export const WORD_CHALLENGES: WordChallenge[] = [
  // Arabic Words
  {
    id: 'ar-bab',
    wordAr: 'باب',
    wordEn: 'Door',
    language: 'ar',
    letters: ['ب', 'ا', 'ب'],
    imageIcon: '🚪',
    hintAr: 'ندخل منه إلى الغرفة والمنزل',
    hintEn: 'We enter the room through it',
    categoryAr: 'المنزل',
  },
  {
    id: 'ar-bayt',
    wordAr: 'بيت',
    wordEn: 'House',
    language: 'ar',
    letters: ['ب', 'ي', 'ت'],
    imageIcon: '🏠',
    hintAr: 'المكان الدافئ الذي نعيش فيه مع العائلة',
    hintEn: 'Where we live happily with family',
    categoryAr: 'المكان',
  },
  {
    id: 'ar-shams',
    wordAr: 'شمس',
    wordEn: 'Sun',
    language: 'ar',
    letters: ['ش', 'م', 'س'],
    imageIcon: '☀️',
    hintAr: 'تضيء سماء النهار وتمدنا بالدفء',
    hintEn: 'Lights up our daytime sky',
    categoryAr: 'الطبيعة',
  },
  {
    id: 'ar-qamar',
    wordAr: 'قمر',
    wordEn: 'Moon',
    language: 'ar',
    letters: ['ق', 'م', 'ر'],
    imageIcon: '🌙',
    hintAr: 'يضيء سماء الليل الهادئة مع النجوم',
    hintEn: 'Shines in the peaceful night sky',
    categoryAr: 'الطبيعة',
  },
  {
    id: 'ar-qalam',
    wordAr: 'قلم',
    wordEn: 'Pen',
    language: 'ar',
    letters: ['ق', 'ل', 'م'],
    imageIcon: '✏️',
    hintAr: 'نكتب ونرسم به في كراستنا المدرسية',
    hintEn: 'We write and draw with it',
    categoryAr: 'المدرسة',
  },
  {
    id: 'ar-asad',
    wordAr: 'أسد',
    wordEn: 'Lion',
    language: 'ar',
    letters: ['أ', 'س', 'د'],
    imageIcon: '🦁',
    hintAr: 'ملك الغابة القوي ذو الزئير العالي',
    hintEn: 'King of the jungle with a mighty roar',
    categoryAr: 'الحيوانات',
  },
  {
    id: 'ar-warda',
    wordAr: 'ورد',
    wordEn: 'Flowers',
    language: 'ar',
    letters: ['و', 'ر', 'د'],
    imageIcon: '🌸',
    hintAr: 'أزهار ملونة تفوح برائحة زكية في الربيع',
    hintEn: 'Vibrant blooming flowers in spring',
    categoryAr: 'الطبيعة',
  },

  // English Words
  {
    id: 'en-cat',
    wordAr: 'قطة',
    wordEn: 'CAT',
    language: 'en',
    letters: ['C', 'A', 'T'],
    imageIcon: '🐱',
    hintAr: 'حيوان أليف يحب المواء واللعب',
    hintEn: 'Cute friendly pet that meows',
    categoryAr: 'Animals',
  },
  {
    id: 'en-dog',
    wordAr: 'كلب',
    wordEn: 'DOG',
    language: 'en',
    letters: ['D', 'O', 'G'],
    imageIcon: '🐶',
    hintAr: 'صديق وفي للإنسان يحرس المكان',
    hintEn: 'Loyal best friend that barks',
    categoryAr: 'Animals',
  },
  {
    id: 'en-sun',
    wordAr: 'شمس',
    wordEn: 'SUN',
    language: 'en',
    letters: ['S', 'U', 'N'],
    imageIcon: '☀️',
    hintAr: 'تشرق في الصباح وتنشر الضياء',
    hintEn: 'Bright warm star in our sky',
    categoryAr: 'Nature',
  },
  {
    id: 'en-car',
    wordAr: 'سيارة',
    wordEn: 'CAR',
    language: 'en',
    letters: ['C', 'A', 'R'],
    imageIcon: '🚗',
    hintAr: 'مركبة ذات عجلات نسافر بها على الطريق',
    hintEn: 'Wheeled vehicle on the road',
    categoryAr: 'Vehicles',
  },
  {
    id: 'en-box',
    wordAr: 'صندوق',
    wordEn: 'BOX',
    language: 'en',
    letters: ['B', 'O', 'X'],
    imageIcon: '📦',
    hintAr: 'نحفظ فيه الألعاب والمكعبات الجميلة',
    hintEn: 'Container for toys and blocks',
    categoryAr: 'Objects',
  },
];

// -------------------------------------------------------------------
// 4. NUMBER CHALLENGES FOR "عالم الأرقام"
// -------------------------------------------------------------------
export const NUMBER_CHALLENGES: NumberChallenge[] = [
  {
    id: 'count-3',
    targetNumber: 3,
    type: 'count',
    questionAr: 'ضع ٣ مكعبات في مساحة البناء 🧱',
    questionEn: 'Place 3 blocks in the building area 🧱',
    hintAr: 'اسحب ٣ مكعبات ملونة وضعها بجانب بعضها أو فوق بعضها!',
  },
  {
    id: 'count-5',
    targetNumber: 5,
    type: 'count',
    questionAr: 'ضع ٥ قطع بناء لتكوين برج خماسي 🏰',
    questionEn: 'Place 5 building blocks to form a 5-block tower 🏰',
    hintAr: 'عدّ مع تالين: ١، ٢، ٣، ٤، ٥!',
  },
  {
    id: 'add-2-2',
    targetNumber: 4,
    type: 'addition',
    equation: '٢ + ٢ = ؟',
    questionAr: 'كم يساوي ٢ + ٢؟ كوّن النتيجة بالمكعبات!',
    questionEn: 'What is 2 + 2? Represent the answer with blocks!',
    hintAr: 'إذا كان لديك مكعبان وأضفت مكعبين، كم يصبح المجموع؟ ٤ مكعبات!',
  },
  {
    id: 'count-7',
    targetNumber: 7,
    type: 'count',
    questionAr: 'ابنِ سلماً جميلاً باستخدام ٧ قطع 🪜',
    questionEn: 'Build a stair step using 7 blocks 🪜',
    hintAr: 'ضع ٧ قطع ملونة داخل ساحة البناء!',
  },
  {
    id: 'add-3-3',
    targetNumber: 6,
    type: 'addition',
    equation: '٣ + ٣ = ؟',
    questionAr: 'احسب: ٣ + ٣ = ؟ وضع عدد المكعبات الصحيح!',
    questionEn: 'Calculate: 3 + 3 = ? Place the correct number of blocks!',
    hintAr: '٣ مكعبات زائد ٣ مكعبات تساوي ٦ مكعبات!',
  },
  {
    id: 'sub-5-2',
    targetNumber: 3,
    type: 'subtraction',
    equation: '٥ - ٢ = ؟',
    questionAr: 'كان لدينا ٥ مكعبات، أخذنا منها ٢، كم مكعباً تبقى؟',
    questionEn: 'We had 5 blocks, removed 2, how many remain?',
    hintAr: '٥ ناقص ٢ يساوي ٣! ضع ٣ مكعبات في الساحة.',
  },
  {
    id: 'count-10',
    targetNumber: 10,
    type: 'count',
    questionAr: 'تحدي الأبطال: ضع ١٠ مكعبات لبناء سور عظيم! 🧱',
    questionEn: 'Super Challenge: Place 10 blocks to build a great wall! 🧱',
    hintAr: 'عدّ العشرات: ١، ٢، ٣، ٤، ٥، ٦، ٧، ٨، ٩، ١٠!',
  },
];

// -------------------------------------------------------------------
// 5. SHAPE CHALLENGES FOR "عالم الأشكال"
// -------------------------------------------------------------------
export const SHAPE_CHALLENGES: ShapeChallenge[] = [
  {
    id: 'shape-house-trio',
    titleAr: 'تحدي المنزل الهندسي',
    titleEn: 'Geometric House Challenge',
    icon: '🏠',
    instructionAr: 'ابنِ شكلاً يحتوي على: مربع واحد، مثلث واحد، ومستطيل واحد!',
    requiredShapes: [
      { shape: 'cube', count: 1, nameAr: 'مربع / مكعب' },
      { shape: 'triangle', count: 1, nameAr: 'مثلث' },
      { shape: 'rect', count: 1, nameAr: 'مستطيل' },
    ],
    hintAr: 'المربع هو الجدار، المثلث هو السطح، والمستطيل هو الباب أو المدخنة!',
  },
  {
    id: 'shape-traffic-light',
    titleAr: 'إشارة المرور والدوائر',
    titleEn: 'Traffic Light & Circles',
    icon: '🚦',
    instructionAr: 'استخدم مستطيلاً طويلاً وضع بداخله أو فوقه دائرتين!',
    requiredShapes: [
      { shape: 'rect', count: 1, nameAr: 'مستطيل العمود' },
      { shape: 'circle', count: 2, nameAr: 'دوائر ملونة' },
    ],
    hintAr: 'المستطيل عمودي والدوائر الملونة تمثل إشارات الضوء!',
  },
  {
    id: 'shape-crown',
    titleAr: 'تاج الأميرة الذهبي',
    titleEn: 'Golden Princess Crown',
    icon: '👑',
    instructionAr: 'اصنع تاجاً أنيقاً باستخدام قاعدة مستطيلة، ومثلثين، ونجمة في القمة!',
    requiredShapes: [
      { shape: 'rect', count: 1, nameAr: 'مستطيل القاعدة' },
      { shape: 'triangle', count: 2, nameAr: 'مثلثات التاج' },
      { shape: 'star', count: 1, nameAr: 'نجمة ذهبية' },
    ],
    hintAr: 'ضع المستطيل أولاً، رصّ المثلثات فوقه، وزيّنه بالنجمة اللامعة!',
  },
  {
    id: 'shape-heart-flower',
    titleAr: 'زهرة القلوب والمربعات',
    titleEn: 'Heart Flower Challenge',
    icon: '💖',
    instructionAr: 'كوّن تصميماً رقيقاً باستخدام مكعبين وقلب واحد ونجمة!',
    requiredShapes: [
      { shape: 'cube', count: 2, nameAr: 'مكعبات' },
      { shape: 'heart', count: 1, nameAr: 'قلب وردي' },
      { shape: 'star', count: 1, nameAr: 'نجمة' },
    ],
    hintAr: 'رتب الأشكال المتناغمة بلمساتك الإبداعية الخاصة!',
  },
];
