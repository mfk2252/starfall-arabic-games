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
  {
    id: 6,
    sequence: ['🚗', '🚲', '🚗', '🚲', '؟'],
    options: [
      { icon: '🚗', name: 'سيارة حمراء', isCorrect: true },
      { icon: '✈️', name: 'طائرة سريعة', isCorrect: false },
      { icon: '🚲', name: 'دراجة هوائية', isCorrect: false },
    ],
    explanation: 'النمط يتكرر: سيارة ثم دراجة!',
    explanationEn: 'Alternating pattern: Car then bicycle!',
  },
  {
    id: 7,
    sequence: ['🟢', '🟡', '🔴', '🟢', '🟡', '؟'],
    options: [
      { icon: '🔴', name: 'دائرة حمراء', isCorrect: true },
      { icon: '🟢', name: 'دائرة خضراء', isCorrect: false },
      { icon: '🔵', name: 'دائرة زرقاء', isCorrect: false },
    ],
    explanation: 'إشارة المرور: أخضر ثم أصفر ثم أحمر!',
    explanationEn: 'Traffic light pattern: Green, yellow, then red!',
  },
  {
    id: 8,
    sequence: ['🍦', '🍩', '🍦', '🍩', '؟'],
    options: [
      { icon: '🍦', name: 'آيس كريم', isCorrect: true },
      { icon: '🍰', name: 'كعكة حلوة', isCorrect: false },
      { icon: '🍩', name: 'دونات', isCorrect: false },
    ],
    explanation: 'مثلجات ثم دونات، التالي هو الآيس كريم!',
    explanationEn: 'Ice cream then donut, next is ice cream!',
  },
  {
    id: 9,
    sequence: ['⚽', '🏀', '⚽', '🏀', '؟'],
    options: [
      { icon: '⚽', name: 'كرة قدم', isCorrect: true },
      { icon: '🎾', name: 'كرة مضرب', isCorrect: false },
      { icon: '🏀', name: 'كرة سلة', isCorrect: false },
    ],
    explanation: 'كرة قدم ثم كرة سلة، النمط ينادي كرة القدم!',
    explanationEn: 'Soccer ball then basketball, next is soccer ball!',
  },
  {
    id: 10,
    sequence: ['🌷', '🌻', '🌷', '🌻', '؟'],
    options: [
      { icon: '🌷', name: 'زهرة توليب', isCorrect: true },
      { icon: '🌹', name: 'وردة حمراء', isCorrect: false },
      { icon: '🌻', name: 'دوار الشمس', isCorrect: false },
    ],
    explanation: 'توليب ثم عباد الشمس، التالي زهرة التوليب!',
    explanationEn: 'Tulip then sunflower, next comes tulip!',
  },
  {
    id: 11,
    sequence: ['🐟', '🐬', '🐙', '🐟', '🐬', '؟'],
    options: [
      { icon: '🐙', name: 'أخطبوط بنفسجي', isCorrect: true },
      { icon: '🐟', name: 'سمكة صغيرة', isCorrect: false },
      { icon: '🐬', name: 'دلفين ذكي', isCorrect: false },
    ],
    explanation: 'نمط الكائنات البحرية: سمكة، دلفين، أخطبوط!',
    explanationEn: 'Sea creature sequence: Fish, dolphin, octopus!',
  },
  {
    id: 12,
    sequence: ['🎈', '🎁', '🎈', '🎁', '؟'],
    options: [
      { icon: '🎈', name: 'بالون مبهج', isCorrect: true },
      { icon: '🎉', name: 'حفلة', isCorrect: false },
      { icon: '🎁', name: 'هدية مغلفة', isCorrect: false },
    ],
    explanation: 'بالون ثم هدية، النمط التالي بالون!',
    explanationEn: 'Balloon then present, next is balloon!',
  },
  {
    id: 13,
    sequence: ['🌧️', '🌈', '☀️', '🌧️', '🌈', '؟'],
    options: [
      { icon: '☀️', name: 'شمس مشرقة', isCorrect: true },
      { icon: '🌩️', name: 'برق ورعد', isCorrect: false },
      { icon: '🌧️', name: 'مطر غزير', isCorrect: false },
    ],
    explanation: 'النمط الطبيعي: مطر، قوس قزح، شمس!',
    explanationEn: 'Weather cycle: Rain, rainbow, sun!',
  },
  {
    id: 14,
    sequence: ['🦁', '🐯', '🦁', '🐯', '؟'],
    options: [
      { icon: '🦁', name: 'أسد ملك', isCorrect: true },
      { icon: '🐻', name: 'دب ضخم', isCorrect: false },
      { icon: '🐯', name: 'نمر مخطط', isCorrect: false },
    ],
    explanation: 'أسد ثم نمر، الشكل التالي هو الأسد!',
    explanationEn: 'Lion then tiger, next animal is lion!',
  },
  {
    id: 15,
    sequence: ['📕', '📗', '📘', '📕', '📗', '؟'],
    options: [
      { icon: '📘', name: 'كتاب أزرق', isCorrect: true },
      { icon: '📙', name: 'كتاب برتقالي', isCorrect: false },
      { icon: '📕', name: 'كتاب أحمر', isCorrect: false },
    ],
    explanation: 'نمط الكتب: أحمر، أخضر، أزرق!',
    explanationEn: 'Book color pattern: Red, green, blue!',
  },
  {
    id: 16,
    sequence: ['🐝', '🌸', '🐝', '🌸', '؟'],
    options: [
      { icon: '🐝', name: 'نحلة نشيطة', isCorrect: true },
      { icon: '🦋', name: 'فراشة رقيقة', isCorrect: false },
      { icon: '🌸', name: 'زهرة وردية', isCorrect: false },
    ],
    explanation: 'نحلة ثم زهرة، التالي هو النحلة!',
    explanationEn: 'Bee then flower, next is bee!',
  },
  {
    id: 17,
    sequence: ['🍔', '🍟', '🍔', '🍟', '؟'],
    options: [
      { icon: '🍔', name: 'برجر', isCorrect: true },
      { icon: '🍕', name: 'بيتزا', isCorrect: false },
      { icon: '🍟', name: 'بطاطس مقلية', isCorrect: false },
    ],
    explanation: 'برجر ثم بطاطس مقلية، التالي هو البرجر!',
    explanationEn: 'Burger then fries, next is burger!',
  },
  {
    id: 18,
    sequence: ['🚀', '🛸', '🚀', '🛸', '؟'],
    options: [
      { icon: '🚀', name: 'صاروخ فضاء', isCorrect: true },
      { icon: '🌙', name: 'قمر', isCorrect: false },
      { icon: '🛸', name: 'مركبة فضائية', isCorrect: false },
    ],
    explanation: 'صاروخ ثم مركبة فضائية، التالي هو الصاروخ!',
    explanationEn: 'Rocket then spaceship, next is rocket!',
  },
  {
    id: 19,
    sequence: ['🍏', '🍐', '🍊', '🍏', '🍐', '؟'],
    options: [
      { icon: '🍊', name: 'برتقالة', isCorrect: true },
      { icon: '🍏', name: 'تفاحة خضراء', isCorrect: false },
      { icon: '🍐', name: 'كمثرى', isCorrect: false },
    ],
    explanation: 'تفاح أخضر، كمثرى، برتقال!',
    explanationEn: 'Green apple, pear, orange sequence!',
  },
  {
    id: 20,
    sequence: ['⭐', '⭐', '🌙', '⭐', '⭐', '؟'],
    options: [
      { icon: '🌙', name: 'قمر مضيء', isCorrect: true },
      { icon: '☀️', name: 'شمس', isCorrect: false },
      { icon: '⭐', name: 'نجمة', isCorrect: false },
    ],
    explanation: 'نجمتان ثم قمر واحد!',
    explanationEn: 'Two stars then one moon!',
  }
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
  {
    id: 5,
    title: 'أي شكل ليس له أضلاع مستقيمة؟',
    titleEn: 'Which shape has no straight sides?',
    items: [
      { id: '1', name: 'مربع', nameEn: 'Square', icon: '⬛', isOdd: false, reason: 'له أضلاع مستقيمة', reasonEn: 'Has straight sides' },
      { id: '2', name: 'مثلث', nameEn: 'Triangle', icon: '🔺', isOdd: false, reason: 'له ٣ أضلاع', reasonEn: 'Has 3 sides' },
      { id: '3', name: 'دائرة', nameEn: 'Circle', icon: '🔴', isOdd: true, reason: 'الدائرة منحنى دائري مغلق ليس له أي أضلاع مستقيمة!', reasonEn: 'Circle is a round curve with no straight sides!' },
      { id: '4', name: 'مستطيل', nameEn: 'Rectangle', icon: '🟧', isOdd: false, reason: 'له أضلاع مستقيمة', reasonEn: 'Has straight sides' },
    ],
  },
  {
    id: 6,
    title: 'أي حيوان ليس من المفترسات البرية؟',
    titleEn: 'Which animal is not a wild predator?',
    items: [
      { id: '1', name: 'أسد', nameEn: 'Lion', icon: '🦁', isOdd: false, reason: 'حيوان مفترس', reasonEn: 'Predator' },
      { id: '2', name: 'نمر', nameEn: 'Tiger', icon: '🐯', isOdd: false, reason: 'حيوان مفترس', reasonEn: 'Predator' },
      { id: '3', name: 'أرنب', nameEn: 'Rabbit', icon: '🐰', isOdd: true, reason: 'الأرنب حيوان أليف ولطيف يتغذى على النباتات والاعشاب!', reasonEn: 'Rabbit is a gentle herbivore that eats plants!' },
      { id: '4', name: 'ذئب', nameEn: 'Wolf', icon: '🐺', isOdd: false, reason: 'حيوان مفترس', reasonEn: 'Predator' },
    ],
  },
  {
    id: 7,
    title: 'أي أداة ليست للمطبخ والطهي؟',
    titleEn: 'Which tool is not for the kitchen?',
    items: [
      { id: '1', name: 'ملعقة', nameEn: 'Spoon', icon: '🥄', isOdd: false, reason: 'أداة طعام', reasonEn: 'Eating tool' },
      { id: '2', name: 'قدر طبخ', nameEn: 'Pot', icon: '🍲', isOdd: false, reason: 'أداة طهي', reasonEn: 'Cooking pot' },
      { id: '3', name: 'مطرقة', nameEn: 'Hammer', icon: '🔨', isOdd: true, reason: 'المطرقة أداة نجارة ودق مسامير وليست للمطبخ!', reasonEn: 'Hammer is a carpentry tool, not for cooking!' },
      { id: '4', name: 'شوكة', nameEn: 'Fork', icon: '🍴', isOdd: false, reason: 'أداة طعام', reasonEn: 'Eating tool' },
    ],
  },
  {
    id: 8,
    title: 'أي كوكب ليس من كواكب المجموعة الشمسية؟',
    titleEn: 'Which object is not a planet in solar system?',
    items: [
      { id: '1', name: 'الأرض', nameEn: 'Earth', icon: '🌍', isOdd: false, reason: 'كوكبنا العجيب', reasonEn: 'Our home planet' },
      { id: '2', name: 'المريخ', nameEn: 'Mars', icon: '🪐', isOdd: false, reason: 'الكوكب الأحمر', reasonEn: 'Red planet' },
      { id: '3', name: 'شجرة', nameEn: 'Tree', icon: '🌳', isOdd: true, reason: 'الشجرة نبات ينبت على الأرض وليست كوكباً فضائياً!', reasonEn: 'A tree is a terrestrial plant, not a space planet!' },
      { id: '4', name: 'المشتري', nameEn: 'Jupiter', icon: '🌕', isOdd: false, reason: 'عملاق غازي', reasonEn: 'Gas giant' },
    ],
  },
  {
    id: 9,
    title: 'أي طعام يعتبر من المشروبات؟',
    titleEn: 'Which item is a drinkable liquid?',
    items: [
      { id: '1', name: 'خبز', nameEn: 'Bread', icon: '🍞', isOdd: false, reason: 'طعام صلب', reasonEn: 'Solid food' },
      { id: '2', name: 'تفاحة', nameEn: 'Apple', icon: '🍎', isOdd: false, reason: 'فاكهة تأكل', reasonEn: 'Eaten fruit' },
      { id: '3', name: 'عصير برتقال', nameEn: 'Orange Juice', icon: '🧃', isOdd: true, reason: 'عصير البرتقال مشروب سائل نشربه بالكأس!', reasonEn: 'Orange juice is a liquid drink!' },
      { id: '4', name: 'أرز', nameEn: 'Rice', icon: '🍚', isOdd: false, reason: 'طعام يؤكل', reasonEn: 'Eaten food' },
    ],
  },
  {
    id: 10,
    title: 'أي شيء لا نراه في سماء الليل؟',
    titleEn: 'Which item is not seen in the night sky?',
    items: [
      { id: '1', name: 'قمر', nameEn: 'Moon', icon: '🌙', isOdd: false, reason: 'يضيء الليل', reasonEn: 'Shines at night' },
      { id: '2', name: 'نجوم', nameEn: 'Stars', icon: '⭐', isOdd: false, reason: 'تتألق ليلاً', reasonEn: 'Glows at night' },
      { id: '3', name: 'شمس ساطعة', nameEn: 'Bright Sun', icon: '☀️', isOdd: true, reason: 'الشمس تشرق في النهار فقط وتغيب في الليل!', reasonEn: 'The sun only shines during the day!' },
      { id: '4', name: 'شهاب', nameEn: 'Shooting Star', icon: '☄️', isOdd: false, reason: 'يلمع في الليل', reasonEn: 'Glows at night' },
    ],
  },
  {
    id: 11,
    title: 'أي حشرة تفرز عسلاً شاقياً؟',
    titleEn: 'Which insect does NOT make honey?',
    items: [
      { id: '1', name: 'نحلة', nameEn: 'Bee', icon: '🐝', isOdd: false, reason: 'تصنع العسل', reasonEn: 'Makes honey' },
      { id: '2', name: 'ذباب', nameEn: 'Fly', icon: '🪰', isOdd: true, reason: 'الذبابة حشرة طائرة وليست من صناع العسل كالنحل!', reasonEn: 'Flies do not create honey like bees do!' },
      { id: '3', name: 'نحلة عسل', nameEn: 'Honeybee', icon: '🐝', isOdd: false, reason: 'تصنع العسل', reasonEn: 'Makes honey' },
      { id: '4', name: 'ملكة النحل', nameEn: 'Queen Bee', icon: '🐝', isOdd: false, reason: 'تعيش في الخلية', reasonEn: 'Lives in hive' },
    ],
  },
  {
    id: 12,
    title: 'أي شيء ليس من الأدوات المدرسية؟',
    titleEn: 'Which item is not a school supply?',
    items: [
      { id: '1', name: 'قلم رصاص', nameEn: 'Pencil', icon: '✏️', isOdd: false, reason: 'أداة كتابة', reasonEn: 'Writing tool' },
      { id: '2', name: 'دفتر', nameEn: 'Notebook', icon: '📓', isOdd: false, reason: 'للكتابة والتدوين', reasonEn: 'For notes' },
      { id: '3', name: 'وسادة نوم', nameEn: 'Bed Pillow', icon: '🛏️', isOdd: true, reason: 'الوسادة لنوم والراحة في السرير وليست للمدرسة!', reasonEn: 'Pillows are for sleeping at home!' },
      { id: '4', name: 'حقيبة مدرسية', nameEn: 'Schoolbag', icon: '🎒', isOdd: false, reason: 'نحمل بها أكتُبنا', reasonEn: 'Carries books' },
    ],
  },
  {
    id: 13,
    title: 'أي لعبة نلعب بها بالمضرب؟',
    titleEn: 'Which sport does not use a racket?',
    items: [
      { id: '1', name: 'كرة التنس', nameEn: 'Tennis', icon: '🎾', isOdd: false, reason: 'تُلعب بالمضرب', reasonEn: 'Uses racket' },
      { id: '2', name: 'كرة السلة', nameEn: 'Basketball', icon: '🏀', isOdd: true, reason: 'كرة السلة نرميها بالأيدي نحو السلة ولا تحتاج مضرباً!', reasonEn: 'Basketball is thrown with hands into a hoop!' },
      { id: '3', name: 'كرة الريشة', nameEn: 'Badminton', icon: '🏸', isOdd: false, reason: 'تُلعب بالمضرب', reasonEn: 'Uses racket' },
      { id: '4', name: 'تنس الطاولة', nameEn: 'Ping Pong', icon: '🏓', isOdd: false, reason: 'تُلعب بمضرب صغير', reasonEn: 'Uses small paddle' },
    ],
  },
  {
    id: 14,
    title: 'أي حيوان ليس له أجنحة ولا يطير؟',
    titleEn: 'Which animal has no wings and cannot fly?',
    items: [
      { id: '1', name: 'عصفور', nameEn: 'Bird', icon: '🐦', isOdd: false, reason: 'طائر يحلق', reasonEn: 'Flying bird' },
      { id: '2', name: 'فراشة', nameEn: 'Butterfly', icon: '🦋', isOdd: false, reason: 'تطير في البستان', reasonEn: 'Flies in gardens' },
      { id: '3', name: 'فيل', nameEn: 'Elephant', icon: '🐘', isOdd: true, reason: 'الفيل حيوان ضخم يمشي على ٤ أقدام وليس له أجنحة!', reasonEn: 'Elephant is a heavy land mammal without wings!' },
      { id: '4', name: 'نسر', nameEn: 'Eagle', icon: '🦅', isOdd: false, reason: 'طائر قوي', reasonEn: 'Strong bird' },
    ],
  },
  {
    id: 15,
    title: 'أي فصل ليس من فصول السنة الأربعة؟',
    titleEn: 'Which option is not one of the 4 seasons?',
    items: [
      { id: '1', name: 'الشتاء', nameEn: 'Winter', icon: '❄️', isOdd: false, reason: 'فصل المطر والبرد', reasonEn: 'Winter season' },
      { id: '2', name: 'الربيع', nameEn: 'Spring', icon: '🌸', isOdd: false, reason: 'فصل الزهور', reasonEn: 'Spring season' },
      { id: '3', name: 'الليل', nameEn: 'Nighttime', icon: '🌙', isOdd: true, reason: 'الليل وقت من اليوم وليس فصلاً من فصول السنة!', reasonEn: 'Night is a time of day, not a yearly season!' },
      { id: '4', name: 'الصيف', nameEn: 'Summer', icon: '🏖️', isOdd: false, reason: 'فصل الدفء', reasonEn: 'Summer season' },
    ],
  }
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
  {
    id: 5,
    animal: { name: 'الأسد الشجاع', nameEn: 'Lion', icon: '🦁' },
    habitats: [
      { id: 'savanna', name: 'سهول السافانا', nameEn: 'Savanna Plains', icon: '🌾', isCorrect: true },
      { id: 'ocean', name: 'أعماق البحار', nameEn: 'Ocean Depths', icon: '🌊', isCorrect: false },
      { id: 'ice', name: 'الجليد الشديد', nameEn: 'Glacier', icon: '❄️', isCorrect: false },
    ],
    favoriteFood: { name: 'اللحوم', nameEn: 'Meat', icon: '🥩' },
    funFact: 'زئير الأسد قوي جداً ويمكن سماعه على بعد ٨ كيلومترات!',
    funFactEn: 'A lion roar can be heard up to 8 kilometers away!',
  },
  {
    id: 6,
    animal: { name: 'الدب القطبي', nameEn: 'Polar Bear', icon: '🐻‍❄️' },
    habitats: [
      { id: 'arctic', name: 'القطب الشمالي الجليدي', nameEn: 'Arctic Ice', icon: '❄️', isCorrect: true },
      { id: 'desert', name: 'الصحراء الحارة', nameEn: 'Sahara Desert', icon: '🏜️', isCorrect: false },
      { id: 'jungle', name: 'الغابة الاستوائية', nameEn: 'Jungle', icon: '🌴', isCorrect: false },
    ],
    favoriteFood: { name: 'الأسماك وفقمة الجليد', nameEn: 'Fish & Seals', icon: '🐟' },
    funFact: 'الدب القطبي يملك طبقة سميكة من الدهون والفراء لتحميه من البرد الفائق!',
    funFactEn: 'Polar bears have thick blubber and dense fur to brave freezing cold!',
  },
  {
    id: 7,
    animal: { name: 'الضفدع القافز', nameEn: 'Frog', icon: '🐸' },
    habitats: [
      { id: 'pond', name: 'بركة الماء العذبة', nameEn: 'Freshwater Pond', icon: '🪷', isCorrect: true },
      { id: 'desert', name: 'صحراء قاحلة', nameEn: 'Arid Desert', icon: '🏜️', isCorrect: false },
      { id: 'sky', name: 'أعالي السماء', nameEn: 'High Sky', icon: '☁️', isCorrect: false },
    ],
    favoriteFood: { name: 'الحشرات والذباب', nameEn: 'Flies & Insects', icon: '🪰' },
    funFact: 'الضفادع تمتص الماء والأكسجين عبر جلدها الرطب مباشرة!',
    funFactEn: 'Frogs absorb water and oxygen through their moist skin!',
  },
  {
    id: 8,
    animal: { name: 'النحلة الذهبية', nameEn: 'Honeybee', icon: '🐝' },
    habitats: [
      { id: 'garden', name: 'بستان الزهور والخلية', nameEn: 'Flower Garden & Hive', icon: '🌸', isCorrect: true },
      { id: 'ocean', name: 'المحيط', nameEn: 'Ocean', icon: '🌊', isCorrect: false },
      { id: 'cave', name: 'كهف متجمد', nameEn: 'Frozen Cave', icon: '🧊', isCorrect: false },
    ],
    favoriteFood: { name: 'رحيق الأزهار', nameEn: 'Flower Nectar', icon: '🌻' },
    funFact: 'تطير النحلة بين آلاف الزهور لتصنع لنا العسل الحلو الشافي!',
    funFactEn: 'Bees visit thousands of blossoms to manufacture pure honey!',
  },
  {
    id: 9,
    animal: { name: 'البومة الساهرة', nameEn: 'Owl', icon: '🦉' },
    habitats: [
      { id: 'forest', name: 'تجويف الأشجار العتيقة', nameEn: 'Forest Hollow Tree', icon: '🌲', isCorrect: true },
      { id: 'ocean', name: 'شاطئ البحر', nameEn: 'Sea Coast', icon: '🏖️', isCorrect: false },
      { id: 'desert', name: 'رمال الصحراء', nameEn: 'Desert Dunes', icon: '🏜️', isCorrect: false },
    ],
    favoriteFood: { name: 'صغار القوارض', nameEn: 'Small Rodents', icon: '🐭' },
    funFact: 'تستطيع البومة تدوير رأسها ٢٧٠ درجة لرؤية ما حولها ببراعة!',
    funFactEn: 'Owls can turn their heads 270 degrees to scan surroundings!',
  },
  {
    id: 10,
    animal: { name: 'السلحفاة البحرية', nameEn: 'Sea Turtle', icon: '🐢' },
    habitats: [
      { id: 'coral', name: 'الشعاب المرجانية بالبحر', nameEn: 'Coral Reefs', icon: '🪸', isCorrect: true },
      { id: 'mountain', name: 'قمم الجبال', nameEn: 'Mountain Peaks', icon: '⛰️', isCorrect: false },
      { id: 'sky', name: 'الغيم بالسماء', nameEn: 'Clouds', icon: '☁️', isCorrect: false },
    ],
    favoriteFood: { name: 'قناديل البحر والأعشاب', nameEn: 'Jellyfish & Seagrass', icon: '🪼' },
    funFact: 'السلاحف البحرية تقطع آلاف الكيلومترات في المحيط وتعود لنفس الشاطئ لتضع بيضها!',
    funFactEn: 'Sea turtles navigate thousands of ocean miles to nest on their birthplace beaches!',
  },
  {
    id: 11,
    animal: { name: 'الفيل الإفريقي', nameEn: 'Elephant', icon: '🐘' },
    habitats: [
      { id: 'forest', name: 'غابات الأدغال والغابات', nameEn: 'Jungle & Forests', icon: '🌳', isCorrect: true },
      { id: 'ice', name: 'القطب المتجمد', nameEn: 'Icy Pole', icon: '🧊', isCorrect: false },
      { id: 'ocean', name: 'قاع المحيط', nameEn: 'Ocean Floor', icon: '🌊', isCorrect: false },
    ],
    favoriteFood: { name: 'أوراق الأشجار والأعشاب', nameEn: 'Tree Leaves & Grass', icon: '🌿' },
    funFact: 'خرطوم الفيل يحتوي على أكثر من ٤٠ ألف عضلة ويستعمله لشرب الماء والأكل!',
    funFactEn: 'An elephant trunk contains over 40,000 muscles used for breathing and drinking!',
  },
  {
    id: 12,
    animal: { name: 'النسر الشامخ', nameEn: 'Eagle', icon: '🦅' },
    habitats: [
      { id: 'mountain', name: 'قمم الجبال الشاهقة', nameEn: 'High Mountain Crags', icon: '🏔️', isCorrect: true },
      { id: 'pond', name: 'بركة الطين', nameEn: 'Mud Puddle', icon: '🪷', isCorrect: false },
      { id: 'underground', name: 'جحور تحت الأرض', nameEn: 'Underground Burrows', icon: '🕳️', isCorrect: false },
    ],
    favoriteFood: { name: 'الأسماك والقوارض', nameEn: 'Fish & Small Game', icon: '🐟' },
    funFact: 'النسر يملك بصراً حاداً جداً يستطيع رؤية فريسته من ارتفاع آلاف الأمتار!',
    funFactEn: 'Eagles possess remarkable eyesight, spotting prey from thousands of feet high!',
  },
  {
    id: 13,
    animal: { name: 'العنكبوت الماهر', nameEn: 'Spider', icon: '🕷️' },
    habitats: [
      { id: 'web', name: 'نسيج خيوط العنكبوت', nameEn: 'Spider Web', icon: '🕸️', isCorrect: true },
      { id: 'cloud', name: 'السحاب بالسماء', nameEn: 'Clouds', icon: '☁️', isCorrect: false },
      { id: 'deep_sea', name: 'أعماق البحار', nameEn: 'Deep Sea', icon: '🌊', isCorrect: false },
    ],
    favoriteFood: { name: 'البعوض والحشرات', nameEn: 'Mosquitoes & Insects', icon: '🦟' },
    funFact: 'خيوط العنكبوت أقوى بخمس مرات من خيوط الصلب بنفس السمك!',
    funFactEn: 'Spider silk is five times stronger than steel wire of the same thickness!',
  },
  {
    id: 14,
    animal: { name: 'الأرنب السريع', nameEn: 'Rabbit', icon: '🐰' },
    habitats: [
      { id: 'meadow', name: 'جحور المروج الخضراء', nameEn: 'Meadow Burrows', icon: '🌱', isCorrect: true },
      { id: 'coral', name: 'الشعاب المرجانية', nameEn: 'Coral Reefs', icon: '🪸', isCorrect: false },
      { id: 'glacier', name: 'الأنهار الجليدية', nameEn: 'Glaciers', icon: '🧊', isCorrect: false },
    ],
    favoriteFood: { name: 'الجزر والأعشاب المقرمشة', nameEn: 'Carrots & Fresh Greens', icon: '🥕' },
    funFact: 'آذان الأرنب الطويلة تساعده على الاستماع الدقيق لأي حركة وتبريد جسمه!',
    funFactEn: 'A rabbit long ears help detect distant sounds and regulate body temperature!',
  },
  {
    id: 15,
    animal: { name: 'الكانغر الأسترالي', nameEn: 'Kangaroo', icon: '🦘' },
    habitats: [
      { id: 'outback', name: 'سهول أستراليا المفتوحة', nameEn: 'Australian Outback', icon: '🌾', isCorrect: true },
      { id: 'ice', name: 'الجليد القطبي', nameEn: 'Polar Ice', icon: '❄️', isCorrect: false },
      { id: 'river', name: 'قاع النهر', nameEn: 'Riverbed', icon: '🌊', isCorrect: false },
    ],
    favoriteFood: { name: 'أعشاب الشجيرات', nameEn: 'Shrubs & Grass', icon: '🌿' },
    funFact: 'الكنغر يستعين بذيله القوي للتوازن أثناء القفز لمسافات طويلة!',
    funFactEn: 'Kangaroos use their muscular tail for balance during high jumps!',
  }
];

export interface EmotionItem {
  id: string;
  emoji: string;
  labelAr: string;
  labelEn: string;
}

export const EMOTIONS_DATA: EmotionItem[] = [
  { id: 'happy', emoji: '😊', labelAr: 'مبتسم', labelEn: 'Smiling' },
  { id: 'sad', emoji: '😢', labelAr: 'حزين', labelEn: 'Sad' },
  { id: 'angry', emoji: '😡', labelAr: 'غاضب', labelEn: 'Angry' },
  { id: 'surprised', emoji: '😲', labelAr: 'متفاجئ', labelEn: 'Surprised' },
  { id: 'calm', emoji: '😌', labelAr: 'هادئ', labelEn: 'Calm' },
  { id: 'bored', emoji: '🥱', labelAr: 'منزعج', labelEn: 'Bored' },
  { id: 'scared', emoji: '😨', labelAr: 'خائف', labelEn: 'Scared' },
  { id: 'love', emoji: '😍', labelAr: 'محب', labelEn: 'Loving' },
  { id: 'laugh', emoji: '😂', labelAr: 'يضحك', labelEn: 'Laughing' },
  { id: 'shy', emoji: '😊', labelAr: 'خجول', labelEn: 'Shy' },
];
