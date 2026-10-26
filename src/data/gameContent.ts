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

export { ANIMAL_HABITATS, type AnimalHabitatQuestion, type AnimalHabitatOption } from './animalHabitatsData';


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

