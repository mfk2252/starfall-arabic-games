export type ListenChooseType = 'sound' | 'word';

export interface ListenChooseQuestion {
  id: string;
  category: 'pets' | 'wild' | 'sea' | 'transport' | 'home' | 'objects' | 'food' | 'nature';
  type: ListenChooseType;
  nameAr: string;
  nameEn: string;
  audioUrl: string;
  imageUrl: string;
  difficulty: 'easy' | 'medium' | 'advanced' | 'challenge';
}

export const LISTEN_CHOOSE_DATA: ListenChooseQuestion[] = [
  // --- SOUNDS MODE (أصوات) ---
  // Using stable GitHub-hosted assets for sounds
  { id: 's_cat', category: 'pets', type: 'sound', nameAr: 'قطة', nameEn: 'Cat', audioUrl: 'https://cdn.jsdelivr.net/gh/rafaelrinaldi/animal-sounds/sounds/cat.mp3', imageUrl: 'https://img.icons8.com/color/240/cat.png', difficulty: 'easy' },
  { id: 's_dog', category: 'pets', type: 'sound', nameAr: 'كلب', nameEn: 'Dog', audioUrl: 'https://cdn.jsdelivr.net/gh/rafaelrinaldi/animal-sounds/sounds/dog.mp3', imageUrl: 'https://img.icons8.com/color/240/dog.png', difficulty: 'easy' },
  { id: 's_rooster', category: 'pets', type: 'sound', nameAr: 'ديك', nameEn: 'Rooster', audioUrl: 'https://cdn.jsdelivr.net/gh/rafaelrinaldi/animal-sounds/sounds/rooster.mp3', imageUrl: 'https://img.icons8.com/color/240/rooster.png', difficulty: 'medium' },
  { id: 's_sheep', category: 'pets', type: 'sound', nameAr: 'خروف', nameEn: 'Sheep', audioUrl: 'https://cdn.jsdelivr.net/gh/rafaelrinaldi/animal-sounds/sounds/sheep.mp3', imageUrl: 'https://img.icons8.com/color/240/sheep.png', difficulty: 'easy' },
  { id: 's_cow', category: 'pets', type: 'sound', nameAr: 'بقرة', nameEn: 'Cow', audioUrl: 'https://cdn.jsdelivr.net/gh/rafaelrinaldi/animal-sounds/sounds/cow.mp3', imageUrl: 'https://img.icons8.com/color/240/cow.png', difficulty: 'easy' },
  { id: 's_horse', category: 'pets', type: 'sound', nameAr: 'حصان', nameEn: 'Horse', audioUrl: 'https://cdn.jsdelivr.net/gh/rafaelrinaldi/animal-sounds/sounds/horse.mp3', imageUrl: 'https://img.icons8.com/color/240/horse.png', difficulty: 'medium' },
  { id: 's_duck', category: 'pets', type: 'sound', nameAr: 'بطة', nameEn: 'Duck', audioUrl: 'https://cdn.jsdelivr.net/gh/rafaelrinaldi/animal-sounds/sounds/duck.mp3', imageUrl: 'https://img.icons8.com/color/240/duck.png', difficulty: 'easy' },
  { id: 's_lion', category: 'wild', type: 'sound', nameAr: 'أسد', nameEn: 'Lion', audioUrl: 'https://cdn.jsdelivr.net/gh/rafaelrinaldi/animal-sounds/sounds/lion.mp3', imageUrl: 'https://img.icons8.com/color/240/lion.png', difficulty: 'easy' },
  { id: 's_elephant', category: 'wild', type: 'sound', nameAr: 'فيل', nameEn: 'Elephant', audioUrl: 'https://cdn.jsdelivr.net/gh/rafaelrinaldi/animal-sounds/sounds/elephant.mp3', imageUrl: 'https://img.icons8.com/color/240/elephant.png', difficulty: 'medium' },
  { id: 's_monkey', category: 'wild', type: 'sound', nameAr: 'قرد', nameEn: 'Monkey', audioUrl: 'https://cdn.jsdelivr.net/gh/rafaelrinaldi/animal-sounds/sounds/monkey.mp3', imageUrl: 'https://img.icons8.com/color/240/monkey.png', difficulty: 'advanced' },
  { id: 's_snake', category: 'wild', type: 'sound', nameAr: 'ثعبان', nameEn: 'Snake', audioUrl: 'https://cdn.jsdelivr.net/gh/rafaelrinaldi/animal-sounds/sounds/snake.mp3', imageUrl: 'https://img.icons8.com/color/240/snake.png', difficulty: 'challenge' },
  { id: 's_owl', category: 'wild', type: 'sound', nameAr: 'بومة', nameEn: 'Owl', audioUrl: 'https://cdn.jsdelivr.net/gh/rafaelrinaldi/animal-sounds/sounds/owl.mp3', imageUrl: 'https://img.icons8.com/color/240/owl.png', difficulty: 'advanced' },
  { id: 's_wolf', category: 'wild', type: 'sound', nameAr: 'ذئب', nameEn: 'Wolf', audioUrl: 'https://cdn.jsdelivr.net/gh/rafaelrinaldi/animal-sounds/sounds/wolf.mp3', imageUrl: 'https://img.icons8.com/color/240/wolf.png', difficulty: 'advanced' },
  { id: 's_frog', category: 'pets', type: 'sound', nameAr: 'ضفدع', nameEn: 'Frog', audioUrl: 'https://cdn.jsdelivr.net/gh/rafaelrinaldi/animal-sounds/sounds/frog.mp3', imageUrl: 'https://img.icons8.com/color/240/frog.png', difficulty: 'medium' },
  { id: 's_bee', category: 'pets', type: 'sound', nameAr: 'نحلة', nameEn: 'Bee', audioUrl: 'https://cdn.jsdelivr.net/gh/rafaelrinaldi/animal-sounds/sounds/bee.mp3', imageUrl: 'https://img.icons8.com/color/240/bee.png', difficulty: 'medium' },
  { id: 's_bird', category: 'pets', type: 'sound', nameAr: 'عصفور', nameEn: 'Bird', audioUrl: 'https://cdn.jsdelivr.net/gh/rafaelrinaldi/animal-sounds/sounds/bird.mp3', imageUrl: 'https://img.icons8.com/color/240/bird.png', difficulty: 'easy' },
  
  // Transport and common sounds (reliable fallback or known assets)
  { id: 's_car', category: 'transport', type: 'sound', nameAr: 'سيارة', nameEn: 'Car', audioUrl: 'https://www.w3schools.com/html/horse.mp3', imageUrl: 'https://img.icons8.com/color/240/car.png', difficulty: 'easy' }, // Placeholders that are known to work
  { id: 's_phone', category: 'home', type: 'sound', nameAr: 'هاتف', nameEn: 'Phone', audioUrl: 'https://cdn.jsdelivr.net/gh/shashi-007/Animal-Sounds/sounds/telephone.mp3', imageUrl: 'https://img.icons8.com/color/240/phone.png', difficulty: 'easy' },
  { id: 's_clock', category: 'home', type: 'sound', nameAr: 'ساعة', nameEn: 'Clock', audioUrl: 'https://cdn.jsdelivr.net/gh/shashi-007/Animal-Sounds/sounds/clock.mp3', imageUrl: 'https://img.icons8.com/color/240/clock.png', difficulty: 'medium' },

  // --- WORDS MODE (كلمات) ---
  // For words, we use robust SpeechSynthesis with the native Arabic voice for clear instruction
  { id: 'w_apple', category: 'food', type: 'word', nameAr: 'تفاحة', nameEn: 'Apple', audioUrl: '', imageUrl: 'https://img.icons8.com/color/240/apple.png', difficulty: 'easy' },
  { id: 'w_banana', category: 'food', type: 'word', nameAr: 'موزة', nameEn: 'Banana', audioUrl: '', imageUrl: 'https://img.icons8.com/color/240/banana.png', difficulty: 'easy' },
  { id: 'w_orange', category: 'food', type: 'word', nameAr: 'برتقالة', nameEn: 'Orange', audioUrl: '', imageUrl: 'https://img.icons8.com/color/240/orange.png', difficulty: 'easy' },
  { id: 'w_strawberry', category: 'food', type: 'word', nameAr: 'فراولة', nameEn: 'Strawberry', audioUrl: '', imageUrl: 'https://img.icons8.com/color/240/strawberry.png', difficulty: 'medium' },
  { id: 'w_watermelon', category: 'food', type: 'word', nameAr: 'بطيخ', nameEn: 'Watermelon', audioUrl: '', imageUrl: 'https://img.icons8.com/color/240/watermelon.png', difficulty: 'medium' },
  { id: 'w_grapes', category: 'food', type: 'word', nameAr: 'عنب', nameEn: 'Grapes', audioUrl: '', imageUrl: 'https://img.icons8.com/color/240/grapes.png', difficulty: 'medium' },
  { id: 'w_carrot', category: 'food', type: 'word', nameAr: 'جزرة', nameEn: 'Carrot', audioUrl: '', imageUrl: 'https://img.icons8.com/color/240/carrot.png', difficulty: 'easy' },
  { id: 'w_tomato', category: 'food', type: 'word', nameAr: 'طماطم', nameEn: 'Tomato', audioUrl: '', imageUrl: 'https://img.icons8.com/color/240/tomato.png', difficulty: 'easy' },
  { id: 'w_book', category: 'objects', type: 'word', nameAr: 'كتاب', nameEn: 'Book', audioUrl: '', imageUrl: 'https://img.icons8.com/color/240/book.png', difficulty: 'easy' },
  { id: 'w_chair', category: 'objects', type: 'word', nameAr: 'كرسي', nameEn: 'Chair', audioUrl: '', imageUrl: 'https://img.icons8.com/color/240/chair.png', difficulty: 'easy' },
  { id: 'w_table', category: 'objects', type: 'word', nameAr: 'طاولة', nameEn: 'Table', audioUrl: '', imageUrl: 'https://img.icons8.com/color/240/table.png', difficulty: 'medium' },
  { id: 'w_ball', category: 'objects', type: 'word', nameAr: 'كرة', nameEn: 'Ball', audioUrl: '', imageUrl: 'https://img.icons8.com/color/240/ball.png', difficulty: 'easy' },
  { id: 'w_doll', category: 'objects', type: 'word', nameAr: 'دمية', nameEn: 'Doll', audioUrl: '', imageUrl: 'https://img.icons8.com/color/240/doll.png', difficulty: 'medium' },
  { id: 'w_robot', category: 'objects', type: 'word', nameAr: 'روبوت', nameEn: 'Robot', audioUrl: '', imageUrl: 'https://img.icons8.com/color/240/robot.png', difficulty: 'advanced' },
  { id: 'w_sun', category: 'nature', type: 'word', nameAr: 'شمس', nameEn: 'Sun', audioUrl: '', imageUrl: 'https://img.icons8.com/color/240/sun.png', difficulty: 'easy' },
  { id: 'w_moon', category: 'nature', type: 'word', nameAr: 'قمر', nameEn: 'Moon', audioUrl: '', imageUrl: 'https://img.icons8.com/color/240/moon.png', difficulty: 'easy' },
  { id: 'w_star', category: 'nature', type: 'word', nameAr: 'نجمة', nameEn: 'Star', audioUrl: '', imageUrl: 'https://img.icons8.com/color/240/star.png', difficulty: 'easy' },
  { id: 'w_tree', category: 'nature', type: 'word', nameAr: 'شجرة', nameEn: 'Tree', audioUrl: '', imageUrl: 'https://img.icons8.com/color/240/tree.png', difficulty: 'easy' },
  { id: 'w_flower', category: 'nature', type: 'word', nameAr: 'زهرة', nameEn: 'Flower', audioUrl: '', imageUrl: 'https://img.icons8.com/color/240/flower.png', difficulty: 'easy' },
  { id: 'w_baby', category: 'objects', type: 'word', nameAr: 'طفل', nameEn: 'Baby', audioUrl: '', imageUrl: 'https://img.icons8.com/color/240/baby.png', difficulty: 'medium' },
  { id: 'w_boy', category: 'objects', type: 'word', nameAr: 'ولد', nameEn: 'Boy', audioUrl: '', imageUrl: 'https://img.icons8.com/color/240/boy.png', difficulty: 'easy' },
  { id: 'w_girl', category: 'objects', type: 'word', nameAr: 'بنت', nameEn: 'Girl', audioUrl: '', imageUrl: 'https://img.icons8.com/color/240/girl.png', difficulty: 'easy' },
  { id: 'w_hat', category: 'objects', type: 'word', nameAr: 'قبعة', nameEn: 'Hat', audioUrl: '', imageUrl: 'https://img.icons8.com/color/240/hat.png', difficulty: 'medium' },
  { id: 'w_shoes', category: 'objects', type: 'word', nameAr: 'حذاء', nameEn: 'Shoes', audioUrl: '', imageUrl: 'https://img.icons8.com/color/240/shoes.png', difficulty: 'medium' },
  { id: 'w_fish', category: 'pets', type: 'word', nameAr: 'سمكة', nameEn: 'Fish', audioUrl: '', imageUrl: 'https://img.icons8.com/color/240/fish.png', difficulty: 'easy' },
  { id: 'w_butterfly', category: 'pets', type: 'word', nameAr: 'فراشة', nameEn: 'Butterfly', audioUrl: '', imageUrl: 'https://img.icons8.com/color/240/butterfly.png', difficulty: 'medium' },
  { id: 'w_whale', category: 'sea', type: 'word', nameAr: 'حوت', nameEn: 'Whale', audioUrl: '', imageUrl: 'https://img.icons8.com/color/240/whale.png', difficulty: 'easy' },
  { id: 'w_shark', category: 'sea', type: 'word', nameAr: 'قرش', nameEn: 'Shark', audioUrl: '', imageUrl: 'https://img.icons8.com/color/240/shark.png', difficulty: 'medium' },
  { id: 'w_octopus', category: 'sea', type: 'word', nameAr: 'أخطبوط', nameEn: 'Octopus', audioUrl: '', imageUrl: 'https://img.icons8.com/color/240/octopus.png', difficulty: 'advanced' },
  { id: 'w_ship', category: 'transport', type: 'word', nameAr: 'سفينة', nameEn: 'Ship', audioUrl: '', imageUrl: 'https://img.icons8.com/color/240/ship.png', difficulty: 'medium' },
  { id: 'w_bicycle', category: 'transport', type: 'word', nameAr: 'دراجة', nameEn: 'Bicycle', audioUrl: '', imageUrl: 'https://img.icons8.com/color/240/bicycle.png', difficulty: 'easy' },
  { id: 'w_bus', category: 'transport', type: 'word', nameAr: 'حافلة', nameEn: 'Bus', audioUrl: '', imageUrl: 'https://img.icons8.com/color/240/bus.png', difficulty: 'easy' },
  { id: 'w_umbrella', category: 'objects', type: 'word', nameAr: 'مظلة', nameEn: 'Umbrella', audioUrl: '', imageUrl: 'https://img.icons8.com/color/240/umbrella.png', difficulty: 'medium' },
  { id: 'w_key', category: 'objects', type: 'word', nameAr: 'مفتاح', nameEn: 'Key', audioUrl: '', imageUrl: 'https://img.icons8.com/color/240/key.png', difficulty: 'easy' },
  { id: 'w_pencil', category: 'objects', type: 'word', nameAr: 'قلم', nameEn: 'Pencil', audioUrl: '', imageUrl: 'https://img.icons8.com/color/240/pencil.png', difficulty: 'easy' },
];
