// Content, questions and configurations for educational games

export interface PatternQuestion {
  id: number;
  sequence: string[];
  options: { icon: string; name: string; isCorrect: boolean }[];
  explanation: string;
  explanationEn: string;
}

export const PATTERN_QUESTIONS: PatternQuestion[] = [
  {
    id: 1,
    sequence: ['🍎', '🍌', '🍎', '🍌', '🍎', '؟'],
    options: [
      { icon: '🍌', name: 'موزة صفراء', isCorrect: true },
      { icon: '🍇', name: 'عنب بنفسجي', isCorrect: false },
      { icon: '🍎', name: 'تفاحة حمراء', isCorrect: false },
    ],
    explanation: 'النمط يتكرر بالتبادل: تفاحة ثم موزة!',
    explanationEn: 'The pattern alternates: apple, then banana!',
  },
  {
    id: 2,
    sequence: ['🔴', '🔵', '🔴', '🔵', '؟'],
    options: [
      { icon: '🔴', name: 'دائرة حمراء', isCorrect: true },
      { icon: '🟡', name: 'دائرة صفراء', isCorrect: false },
      { icon: '🟢', name: 'دائرة خضراء', isCorrect: false },
    ],
    explanation: 'النمط هو دائرة حمراء ثم دائرة زرقاء، والآن دور الحمراء!',
    explanationEn: 'Red circle then blue circle, now it is red circle turn!',
  },
  {
    id: 3,
    sequence: ['⭐', '🌙', '☀️', '⭐', '🌙', '؟'],
    options: [
      { icon: '☀️', name: 'شمس مشرقة', isCorrect: true },
      { icon: '⭐', name: 'نجمة ذهبية', isCorrect: false },
      { icon: '☁️', name: 'سحابة بيضاء', isCorrect: false },
    ],
    explanation: 'النمط الثلاثي: نجمة، ثم قمر، ثم شمس!',
    explanationEn: 'Three-step pattern: Star, Moon, then Sun!',
  },
  {
    id: 4,
    sequence: ['🐱', '🐶', '🐱', '🐶', '؟'],
    options: [
      { icon: '🐱', name: 'قطة لطيفة', isCorrect: true },
      { icon: '🐰', name: 'أرنب سريع', isCorrect: false },
      { icon: '🐶', name: 'كلب وفي', isCorrect: false },
    ],
    explanation: 'قطة ثم كلب، والشكل التالي هو القطة!',
    explanationEn: 'Cat then dog, the next animal is the cat!',
  },
  {
    id: 5,
    sequence: ['🔺', '⬛', '🔺', '⬛', '؟'],
    options: [
      { icon: '🔺', name: 'مثلث أحمر', isCorrect: true },
      { icon: '🔵', name: 'دائرة زرقاء', isCorrect: false },
      { icon: '⬛', name: 'مربع أسود', isCorrect: false },
    ],
    explanation: 'مثلث ثم مربع، والشكل التالي هو المثلث!',
    explanationEn: 'Triangle then square, next comes triangle!',
  },
];

export interface OddOneOutQuestion {
  id: number;
  title: string;
  titleEn: string;
  items: { id: string; name: string; nameEn: string; icon: string; isOdd: boolean; reason: string; reasonEn: string }[];
}

export const ODD_ONE_OUT_QUESTIONS: OddOneOutQuestion[] = [
  {
    id: 1,
    title: 'أي عنصر لا ينتمي لمجموعة الفواكه؟',
    titleEn: 'Which item is not a fruit?',
    items: [
      { id: '1', name: 'تفاحة', nameEn: 'Apple', icon: '🍎', isOdd: false, reason: 'فاكهة لذيذة', reasonEn: 'Delicious fruit' },
      { id: '2', name: 'موزة', nameEn: 'Banana', icon: '🍌', isOdd: false, reason: 'فاكهة لذيذة', reasonEn: 'Delicious fruit' },
      { id: '3', name: 'جزرة', nameEn: 'Carrot', icon: '🥕', isOdd: true, reason: 'الجزرة خضار تنمو تحت الأرض وليست فاكهة!', reasonEn: 'Carrot is a vegetable, not a fruit!' },
      { id: '4', name: 'عنب', nameEn: 'Grapes', icon: '🍇', isOdd: false, reason: 'فاكهة لذيذة', reasonEn: 'Delicious fruit' },
    ],
  },
  {
    id: 2,
    title: 'أي وسيلة مواصلات لا تطير في السماء؟',
    titleEn: 'Which vehicle cannot fly in the sky?',
    items: [
      { id: '1', name: 'طائرة', nameEn: 'Airplane', icon: '✈️', isOdd: false, reason: 'تطير في السماء', reasonEn: 'Flies in the sky' },
      { id: '2', name: 'مروحية', nameEn: 'Helicopter', icon: '🚁', isOdd: false, reason: 'تطير في السماء', reasonEn: 'Flies in the sky' },
      { id: '3', name: 'صاروخ', nameEn: 'Rocket', icon: '🚀', isOdd: false, reason: 'ينطلق للفضاء', reasonEn: 'Launches into space' },
      { id: '4', name: 'سيارة', nameEn: 'Car', icon: '🚗', isOdd: true, reason: 'السيارة تسير على عجلات في الشارع ولا تطير!', reasonEn: 'Car drives on the ground and does not fly!' },
    ],
  },
  {
    id: 3,
    title: 'أي كائن لا يعيش ويسبح في الماء؟',
    titleEn: 'Which creature does not live in water?',
    items: [
      { id: '1', name: 'سمكة', nameEn: 'Fish', icon: '🐟', isOdd: false, reason: 'تعيش في الماء', reasonEn: 'Lives in water' },
      { id: '2', name: 'دلفين', nameEn: 'Dolphin', icon: '🐬', isOdd: false, reason: 'يسبح في البحر', reasonEn: 'Swims in ocean' },
      { id: '3', name: 'نسر', nameEn: 'Eagle', icon: '🦅', isOdd: true, reason: 'النسر طائر ذو أجنحة يحلق في الجو ويبني عشه في الجبال!', reasonEn: 'Eagle is a bird that flies in the air, not in water!' },
      { id: '4', name: 'أخطبوط', nameEn: 'Octopus', icon: '🐙', isOdd: false, reason: 'يعيش في أعماق البحر', reasonEn: 'Lives deep in the sea' },
    ],
  },
  {
    id: 4,
    title: 'أي شيء لا نرتديه كملابس؟',
    titleEn: 'Which item is not wearable clothing?',
    items: [
      { id: '1', name: 'قميص', nameEn: 'Shirt', icon: '👕', isOdd: false, reason: 'ملابس نرتديها', reasonEn: 'Clothes we wear' },
      { id: '2', name: 'بنطال', nameEn: 'Pants', icon: '👖', isOdd: false, reason: 'ملابس نرتديها', reasonEn: 'Clothes we wear' },
      { id: '3', name: 'كرة قدم', nameEn: 'Soccer Ball', icon: '⚽', isOdd: true, reason: 'كرة القدم لعبة نلعب بها ونركلها وليست ملابس!', reasonEn: 'A soccer ball is a toy to play with, not clothes!' },
      { id: '4', name: 'فستان', nameEn: 'Dress', icon: '👗', isOdd: false, reason: 'ملابس نرتديها', reasonEn: 'Clothes we wear' },
    ],
  },
];

export interface AnimalHabitatQuestion {
  id: number;
  animal: { name: string; nameEn: string; icon: string };
  habitats: { id: string; name: string; nameEn: string; icon: string; isCorrect: boolean }[];
  favoriteFood: { name: string; nameEn: string; icon: string };
  funFact: string;
  funFactEn: string;
}

export const ANIMAL_HABITATS: AnimalHabitatQuestion[] = [
  {
    id: 1,
    animal: { name: 'الجمل العربي', nameEn: 'Camel', icon: '🐪' },
    habitats: [
      { id: 'desert', name: 'الصحراء الرملية', nameEn: 'Desert', icon: '🏜️', isCorrect: true },
      { id: 'ocean', name: 'المحيط العميق', nameEn: 'Ocean', icon: '🌊', isCorrect: false },
      { id: 'arctic', name: 'الجليد المتجمد', nameEn: 'Ice Arctic', icon: '🧊', isCorrect: false },
    ],
    favoriteFood: { name: 'النباتات والشوك', nameEn: 'Desert Plants', icon: '🌵' },
    funFact: 'الجمل يسمى سفينة الصحراء لأنه يتحمل العطش لعدة أيام!',
    funFactEn: 'Camel is called ship of the desert because it can endure days without water!',
  },
  {
    id: 2,
    animal: { name: 'الدلفين الذكي', nameEn: 'Dolphin', icon: '🐬' },
    habitats: [
      { id: 'ocean', name: 'البحر والمحيط', nameEn: 'Sea & Ocean', icon: '🌊', isCorrect: true },
      { id: 'forest', name: 'الغابة الكثيفة', nameEn: 'Jungle Forest', icon: '🌲', isCorrect: false },
      { id: 'desert', name: 'الصحراء', nameEn: 'Desert', icon: '🏜️', isCorrect: false },
    ],
    favoriteFood: { name: 'الأسماك الصغيرة', nameEn: 'Small fish', icon: '🐟' },
    funFact: 'الدلافين حيوانات ذكية ولطيفة جداً وتتواصل بالصفير!',
    funFactEn: 'Dolphins are very friendly mammals that communicate with whistles!',
  },
  {
    id: 3,
    animal: { name: 'البطريق الظريف', nameEn: 'Penguin', icon: '🐧' },
    habitats: [
      { id: 'arctic', name: 'القطب الجليدي البارد', nameEn: 'Cold Arctic Ice', icon: '❄️', isCorrect: true },
      { id: 'desert', name: 'الصحراء الحارة', nameEn: 'Hot Desert', icon: '🏜️', isCorrect: false },
      { id: 'meadow', name: 'المزرعة العشبية', nameEn: 'Grassland', icon: '🌾', isCorrect: false },
    ],
    favoriteFood: { name: 'الأسماك والروبيان', nameEn: 'Fish & Krill', icon: '🦐' },
    funFact: 'البطريق طائر سباح ماهر في الماء المتجمد!',
    funFactEn: 'Penguins are expert swimmers in icy Antarctic waters!',
  },
  {
    id: 4,
    animal: { name: 'القرد النشيط', nameEn: 'Monkey', icon: '🐒' },
    habitats: [
      { id: 'jungle', name: 'الغابات الاستوائية', nameEn: 'Tropical Jungle', icon: '🌴', isCorrect: true },
      { id: 'arctic', name: 'القطب الثلجي', nameEn: 'Snowy Polar', icon: '🧊', isCorrect: false },
      { id: 'desert', name: 'الكثبان الرملية', nameEn: 'Sand Dunes', icon: '🏜️', isCorrect: false },
    ],
    favoriteFood: { name: 'الموز والفواكه', nameEn: 'Bananas & fruits', icon: '🍌' },
    funFact: 'القرود تستخدم ذيلها وأطرافها للتأرجح بين أغصان الأشجار بخفة!',
    funFactEn: 'Monkeys use their strong tails and limbs to swing gracefully on branches!',
  },
];

export interface EmotionScenario {
  id: number;
  situation: string;
  situationEn: string;
  options: {
    emotion: string;
    emotionEn: string;
    icon: string;
    isCorrect: boolean;
    explanation: string;
    explanationEn: string;
  }[];
}

export const EMOTION_SCENARIOS: EmotionScenario[] = [
  {
    id: 1,
    situation: 'تلقى أحمد هدية جميلة ومفاجأة مبهجة في يوم ميلاده!',
    situationEn: 'Ahmad received a wonderful surprise gift on his birthday!',
    options: [
      { emotion: 'سعيد ومبتهج', emotionEn: 'Happy & Joyful', icon: '😊', isCorrect: true, explanation: 'المفاجآت السارة تجعلنا نشعر بالسعادة والبهجة وابتسامة جميلة!', explanationEn: 'Pleasant surprises bring big smiles and happiness!' },
      { emotion: 'غاضب', emotionEn: 'Angry', icon: '😡', isCorrect: false, explanation: 'الهدايا اللطيفة تسعدنا ولا تغضبنا', explanationEn: 'Nice gifts make us happy, not angry' },
      { emotion: 'حزين', emotionEn: 'Sad', icon: '😢', isCorrect: false, explanation: 'الاحتفال بيوم الميلاد مناسبة سعيدة', explanationEn: 'Birthday is a joyful event' },
    ],
  },
  {
    id: 2,
    situation: 'سقط برج المكعبات الذي بنته سارة باجتهاد!',
    situationEn: 'Sara worked hard to build a block tower, but it accidentally fell down!',
    options: [
      { emotion: 'حزينة وتحتاج تشجيعاً', emotionEn: 'Sad & Needs Encouragement', icon: '😢', isCorrect: true, explanation: 'من الطبيعي أن نحزن قليلاً عندما يقع ما بنيناه، ثم نشجع أنفسنا ونبنيه من جديد!', explanationEn: 'It is okay to feel sad, then take a deep breath and rebuild it stronger!' },
      { emotion: 'متحمسة جداً', emotionEn: 'Super Excited', icon: '🤩', isCorrect: false, explanation: 'سقوط البرج يسبب الحزن لحظياً', explanationEn: 'The tower falling causes momentary sadness' },
      { emotion: 'نائمة', emotionEn: 'Sleeping', icon: '😴', isCorrect: false, explanation: 'سارة مستيقظة وتلعب', explanationEn: 'Sara is awake and playing' },
    ],
  },
  {
    id: 3,
    situation: 'سمع عمر صوت رعد مفاجئ وقوي من النافذة!',
    situationEn: 'Omar heard a sudden, loud thunder rumble outside the window!',
    options: [
      { emotion: 'متفاجئ وخائف قليلاً', emotionEn: 'Surprised & A Bit Scared', icon: '😲', isCorrect: true, explanation: 'الأصوات المفاجئة تفاجئنا، ويمكننا مسك يد أمنا أو أبينا لنشعر بالأمان!', explanationEn: 'Sudden loud sounds surprise us, holding a parent hand brings comfort!' },
      { emotion: 'يضحك بصوت عالٍ', emotionEn: 'Laughing aloud', icon: '😂', isCorrect: false, explanation: 'الرعد القوي صوت مفاجئ', explanationEn: 'Thunder is sudden and loud' },
      { emotion: 'يشعر بالملل', emotionEn: 'Bored', icon: '🥱', isCorrect: false, explanation: 'الصوت المفاجئ جذب انتباهه فوراً', explanationEn: 'The loud sound caught his immediate attention' },
    ],
  },
  {
    id: 4,
    situation: 'يجلس الطفل في حديقة هادئة مع نسيم عليل وأصوات زقزقة العصافير.',
    situationEn: 'The child sits in a quiet park enjoying gentle breeze and chirping birds.',
    options: [
      { emotion: 'هادئ ومطمئن', emotionEn: 'Calm & Peaceful', icon: '😌', isCorrect: true, explanation: 'الطبيعة والهدوء يمنحانا شعوراً بالراحة والسكينة والاطمئنان!', explanationEn: 'Peaceful nature fills our hearts with calm and tranquility!' },
      { emotion: 'غضبان', emotionEn: 'Furious', icon: '😡', isCorrect: false, explanation: 'الحديقة الهادئة مكان للراحة', explanationEn: 'A calm garden is a place for rest' },
      { emotion: 'باكٍ', emotionEn: 'Crying', icon: '😭', isCorrect: false, explanation: 'النسيم والعصافير يبعثان على السكينة', explanationEn: 'Birds chirping brings pleasant peace' },
    ],
  },
];
