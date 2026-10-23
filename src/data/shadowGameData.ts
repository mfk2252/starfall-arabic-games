export interface ShadowQuestion {
  id: string;
  category: string;
  nameAr: string;
  nameEn: string;
  image: string; // URL to transparent vector SVG
  fallbackImage: string; // Backup CDN URL
  emoji: string;
  difficulty: 'easy' | 'medium' | 'advanced' | 'challenge';
}

const getTwemojiUrl = (code: string) => `https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/${code}.svg`;
const getFallbackUrl = (code: string) => `https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/${code}.svg`;

export const SHADOW_GAME_DATA: ShadowQuestion[] = [
  // 1. Pets (6)
  { 
    id: 'pet_dog', 
    category: 'pets', 
    nameAr: 'كلب', 
    nameEn: 'Dog', 
    image: getTwemojiUrl('1f436'), 
    fallbackImage: getFallbackUrl('1f436'), 
    emoji: '🐶', 
    difficulty: 'easy' 
  },
  { 
    id: 'pet_cat', 
    category: 'pets', 
    nameAr: 'قطة', 
    nameEn: 'Cat', 
    image: getTwemojiUrl('1f431'), 
    fallbackImage: getFallbackUrl('1f431'), 
    emoji: '🐱', 
    difficulty: 'easy' 
  },
  { 
    id: 'pet_rabbit', 
    category: 'pets', 
    nameAr: 'أرنب', 
    nameEn: 'Rabbit', 
    image: getTwemojiUrl('1f430'), 
    fallbackImage: getFallbackUrl('1f430'), 
    emoji: '🐰', 
    difficulty: 'easy' 
  },
  { 
    id: 'pet_hamster', 
    category: 'pets', 
    nameAr: 'هامستر', 
    nameEn: 'Hamster', 
    image: getTwemojiUrl('1f439'), 
    fallbackImage: getFallbackUrl('1f439'), 
    emoji: '🐹', 
    difficulty: 'medium' 
  },
  { 
    id: 'pet_parrot', 
    category: 'pets', 
    nameAr: 'ببغاء', 
    nameEn: 'Parrot', 
    image: getTwemojiUrl('1f99c'), 
    fallbackImage: getFallbackUrl('1f99c'), 
    emoji: '🦜', 
    difficulty: 'medium' 
  },
  { 
    id: 'pet_goldfish', 
    category: 'pets', 
    nameAr: 'سمكة ذهبية', 
    nameEn: 'Goldfish', 
    image: getTwemojiUrl('1f41f'), 
    fallbackImage: getFallbackUrl('1f41f'), 
    emoji: '🐟', 
    difficulty: 'easy' 
  },

  // 2. Wild Animals (10)
  { 
    id: 'wild_lion', 
    category: 'wild', 
    nameAr: 'أسد', 
    nameEn: 'Lion', 
    image: getTwemojiUrl('1f981'), 
    fallbackImage: getFallbackUrl('1f981'), 
    emoji: '🦁', 
    difficulty: 'easy' 
  },
  { 
    id: 'wild_tiger', 
    category: 'wild', 
    nameAr: 'نمر', 
    nameEn: 'Tiger', 
    image: getTwemojiUrl('1f42f'), 
    fallbackImage: getFallbackUrl('1f42f'), 
    emoji: '🐯', 
    difficulty: 'medium' 
  },
  { 
    id: 'wild_elephant', 
    category: 'wild', 
    nameAr: 'فيل', 
    nameEn: 'Elephant', 
    image: getTwemojiUrl('1f418'), 
    fallbackImage: getFallbackUrl('1f418'), 
    emoji: '🐘', 
    difficulty: 'easy' 
  },
  { 
    id: 'wild_giraffe', 
    category: 'wild', 
    nameAr: 'زرافة', 
    nameEn: 'Giraffe', 
    image: getTwemojiUrl('1f992'), 
    fallbackImage: getFallbackUrl('1f992'), 
    emoji: '🦒', 
    difficulty: 'easy' 
  },
  { 
    id: 'wild_zebra', 
    category: 'wild', 
    nameAr: 'حمار وحشي', 
    nameEn: 'Zebra', 
    image: getTwemojiUrl('1f993'), 
    fallbackImage: getFallbackUrl('1f993'), 
    emoji: '🦓', 
    difficulty: 'medium' 
  },
  { 
    id: 'wild_monkey', 
    category: 'wild', 
    nameAr: 'قرد', 
    nameEn: 'Monkey', 
    image: getTwemojiUrl('1f412'), 
    fallbackImage: getFallbackUrl('1f412'), 
    emoji: '🐒', 
    difficulty: 'easy' 
  },
  { 
    id: 'wild_bear', 
    category: 'wild', 
    nameAr: 'دب', 
    nameEn: 'Bear', 
    image: getTwemojiUrl('1f43b'), 
    fallbackImage: getFallbackUrl('1f43b'), 
    emoji: '🐻', 
    difficulty: 'easy' 
  },
  { 
    id: 'wild_fox', 
    category: 'wild', 
    nameAr: 'ثعلب', 
    nameEn: 'Fox', 
    image: getTwemojiUrl('1f98a'), 
    fallbackImage: getFallbackUrl('1f98a'), 
    emoji: '🦊', 
    difficulty: 'medium' 
  },
  { 
    id: 'wild_kangaroo', 
    category: 'wild', 
    nameAr: 'كنغر', 
    nameEn: 'Kangaroo', 
    image: getTwemojiUrl('1f998'), 
    fallbackImage: getFallbackUrl('1f998'), 
    emoji: '🦘', 
    difficulty: 'advanced' 
  },
  { 
    id: 'wild_panda', 
    category: 'wild', 
    nameAr: 'باندا', 
    nameEn: 'Panda', 
    image: getTwemojiUrl('1f43c'), 
    fallbackImage: getFallbackUrl('1f43c'), 
    emoji: '🐼', 
    difficulty: 'easy' 
  },

  // 3. Birds & Sea (8)
  { 
    id: 'sea_shark', 
    category: 'sea', 
    nameAr: 'قرش', 
    nameEn: 'Shark', 
    image: getTwemojiUrl('1f988'), 
    fallbackImage: getFallbackUrl('1f988'), 
    emoji: '🦈', 
    difficulty: 'medium' 
  },
  { 
    id: 'sea_whale', 
    category: 'sea', 
    nameAr: 'حوت', 
    nameEn: 'Whale', 
    image: getTwemojiUrl('1f40b'), 
    fallbackImage: getFallbackUrl('1f40b'), 
    emoji: '🐋', 
    difficulty: 'easy' 
  },
  { 
    id: 'sea_dolphin', 
    category: 'sea', 
    nameAr: 'دلفين', 
    nameEn: 'Dolphin', 
    image: getTwemojiUrl('1f42c'), 
    fallbackImage: getFallbackUrl('1f42c'), 
    emoji: '🐬', 
    difficulty: 'easy' 
  },
  { 
    id: 'sea_octopus', 
    category: 'sea', 
    nameAr: 'أخطبوط', 
    nameEn: 'Octopus', 
    image: getTwemojiUrl('1f419'), 
    fallbackImage: getFallbackUrl('1f419'), 
    emoji: '🐙', 
    difficulty: 'medium' 
  },
  { 
    id: 'sea_turtle', 
    category: 'sea', 
    nameAr: 'سلحفاة بحرية', 
    nameEn: 'Sea Turtle', 
    image: getTwemojiUrl('1f422'), 
    fallbackImage: getFallbackUrl('1f422'), 
    emoji: '🐢', 
    difficulty: 'medium' 
  },
  { 
    id: 'bird_eagle', 
    category: 'sea', 
    nameAr: 'نسر', 
    nameEn: 'Eagle', 
    image: getTwemojiUrl('1f985'), 
    fallbackImage: getFallbackUrl('1f985'), 
    emoji: '🦅', 
    difficulty: 'advanced' 
  },
  { 
    id: 'bird_penguin', 
    category: 'sea', 
    nameAr: 'بطريق', 
    nameEn: 'Penguin', 
    image: getTwemojiUrl('1f427'), 
    fallbackImage: getFallbackUrl('1f427'), 
    emoji: '🐧', 
    difficulty: 'easy' 
  },
  { 
    id: 'bird_owl', 
    category: 'sea', 
    nameAr: 'بومة', 
    nameEn: 'Owl', 
    image: getTwemojiUrl('1f989'), 
    fallbackImage: getFallbackUrl('1f989'), 
    emoji: '🦉', 
    difficulty: 'medium' 
  },

  // 4. Fruits (8)
  { 
    id: 'fruit_apple', 
    category: 'fruits', 
    nameAr: 'تفاح', 
    nameEn: 'Apple', 
    image: getTwemojiUrl('1f34e'), 
    fallbackImage: getFallbackUrl('1f34e'), 
    emoji: '🍎', 
    difficulty: 'easy' 
  },
  { 
    id: 'fruit_banana', 
    category: 'fruits', 
    nameAr: 'موز', 
    nameEn: 'Banana', 
    image: getTwemojiUrl('1f34c'), 
    fallbackImage: getFallbackUrl('1f34c'), 
    emoji: '🍌', 
    difficulty: 'easy' 
  },
  { 
    id: 'fruit_strawberry', 
    category: 'fruits', 
    nameAr: 'فراولة', 
    nameEn: 'Strawberry', 
    image: getTwemojiUrl('1f353'), 
    fallbackImage: getFallbackUrl('1f353'), 
    emoji: '🍓', 
    difficulty: 'easy' 
  },
  { 
    id: 'fruit_grapes', 
    category: 'fruits', 
    nameAr: 'عنب', 
    nameEn: 'Grapes', 
    image: getTwemojiUrl('1f347'), 
    fallbackImage: getFallbackUrl('1f347'), 
    emoji: '🍇', 
    difficulty: 'medium' 
  },
  { 
    id: 'fruit_watermelon', 
    category: 'fruits', 
    nameAr: 'بطيخ', 
    nameEn: 'Watermelon', 
    image: getTwemojiUrl('1f349'), 
    fallbackImage: getFallbackUrl('1f349'), 
    emoji: '🍉', 
    difficulty: 'easy' 
  },
  { 
    id: 'fruit_pineapple', 
    category: 'fruits', 
    nameAr: 'أناناس', 
    nameEn: 'Pineapple', 
    image: getTwemojiUrl('1f34d'), 
    fallbackImage: getFallbackUrl('1f34d'), 
    emoji: '🍍', 
    difficulty: 'medium' 
  },
  { 
    id: 'fruit_cherry', 
    category: 'fruits', 
    nameAr: 'كرز', 
    nameEn: 'Cherry', 
    image: getTwemojiUrl('1f352'), 
    fallbackImage: getFallbackUrl('1f352'), 
    emoji: '🍒', 
    difficulty: 'easy' 
  },
  { 
    id: 'fruit_pear', 
    category: 'fruits', 
    nameAr: 'كمثرى', 
    nameEn: 'Pear', 
    image: getTwemojiUrl('1f350'), 
    fallbackImage: getFallbackUrl('1f350'), 
    emoji: '🍐', 
    difficulty: 'medium' 
  },

  // 5. Vegetables (6)
  { 
    id: 'veg_carrot', 
    category: 'veg', 
    nameAr: 'جزر', 
    nameEn: 'Carrot', 
    image: getTwemojiUrl('1f955'), 
    fallbackImage: getFallbackUrl('1f955'), 
    emoji: '🥕', 
    difficulty: 'easy' 
  },
  { 
    id: 'veg_broccoli', 
    category: 'veg', 
    nameAr: 'بروكلي', 
    nameEn: 'Broccoli', 
    image: getTwemojiUrl('1f966'), 
    fallbackImage: getFallbackUrl('1f966'), 
    emoji: '🥦', 
    difficulty: 'medium' 
  },
  { 
    id: 'veg_corn', 
    category: 'veg', 
    nameAr: 'ذرة', 
    nameEn: 'Corn', 
    image: getTwemojiUrl('1f33d'), 
    fallbackImage: getFallbackUrl('1f33d'), 
    emoji: '🌽', 
    difficulty: 'easy' 
  },
  { 
    id: 'veg_tomato', 
    category: 'veg', 
    nameAr: 'طماطم', 
    nameEn: 'Tomato', 
    image: getTwemojiUrl('1f345'), 
    fallbackImage: getFallbackUrl('1f345'), 
    emoji: '🍅', 
    difficulty: 'easy' 
  },
  { 
    id: 'veg_eggplant', 
    category: 'veg', 
    nameAr: 'باذنجان', 
    nameEn: 'Eggplant', 
    image: getTwemojiUrl('1f346'), 
    fallbackImage: getFallbackUrl('1f346'), 
    emoji: '🍆', 
    difficulty: 'medium' 
  },
  { 
    id: 'veg_pepper', 
    category: 'veg', 
    nameAr: 'فلفل حلو', 
    nameEn: 'Bell Pepper', 
    image: getTwemojiUrl('1fad1'), 
    fallbackImage: getFallbackUrl('1fad1'), 
    emoji: '🫑', 
    difficulty: 'medium' 
  },

  // 6. Transport (6)
  { 
    id: 'trans_car', 
    category: 'transport', 
    nameAr: 'سيارة', 
    nameEn: 'Car', 
    image: getTwemojiUrl('1f697'), 
    fallbackImage: getFallbackUrl('1f697'), 
    emoji: '🚗', 
    difficulty: 'easy' 
  },
  { 
    id: 'trans_bus', 
    category: 'transport', 
    nameAr: 'حافلة', 
    nameEn: 'Bus', 
    image: getTwemojiUrl('1f68c'), 
    fallbackImage: getFallbackUrl('1f68c'), 
    emoji: '🚌', 
    difficulty: 'easy' 
  },
  { 
    id: 'trans_plane', 
    category: 'transport', 
    nameAr: 'طائرة', 
    nameEn: 'Airplane', 
    image: getTwemojiUrl('2708'), 
    fallbackImage: getFallbackUrl('2708'), 
    emoji: '✈️', 
    difficulty: 'easy' 
  },
  { 
    id: 'trans_ship', 
    category: 'transport', 
    nameAr: 'سفينة', 
    nameEn: 'Ship', 
    image: getTwemojiUrl('1f6a2'), 
    fallbackImage: getFallbackUrl('1f6a2'), 
    emoji: '🚢', 
    difficulty: 'medium' 
  },
  { 
    id: 'trans_bike', 
    category: 'transport', 
    nameAr: 'دراجة', 
    nameEn: 'Bicycle', 
    image: getTwemojiUrl('1f6b2'), 
    fallbackImage: getFallbackUrl('1f6b2'), 
    emoji: '🚲', 
    difficulty: 'easy' 
  },
  { 
    id: 'trans_train', 
    category: 'transport', 
    nameAr: 'قطار', 
    nameEn: 'Train', 
    image: getTwemojiUrl('1f686'), 
    fallbackImage: getFallbackUrl('1f686'), 
    emoji: '🚆', 
    difficulty: 'medium' 
  },

  // 7. Objects (6)
  { 
    id: 'obj_chair', 
    category: 'objects', 
    nameAr: 'كرسي', 
    nameEn: 'Chair', 
    image: getTwemojiUrl('1fa91'), 
    fallbackImage: getFallbackUrl('1fa91'), 
    emoji: '🪑', 
    difficulty: 'easy' 
  },
  { 
    id: 'obj_sofa', 
    category: 'objects', 
    nameAr: 'أريكة', 
    nameEn: 'Sofa', 
    image: getTwemojiUrl('1f6cb'), 
    fallbackImage: getFallbackUrl('1f6cb'), 
    emoji: '🛋️', 
    difficulty: 'medium' 
  },
  { 
    id: 'obj_lamp', 
    category: 'objects', 
    nameAr: 'مصباح', 
    nameEn: 'Lamp', 
    image: getTwemojiUrl('1f4a1'), 
    fallbackImage: getFallbackUrl('1f4a1'), 
    emoji: '💡', 
    difficulty: 'medium' 
  },
  { 
    id: 'obj_book', 
    category: 'objects', 
    nameAr: 'كتاب', 
    nameEn: 'Book', 
    image: getTwemojiUrl('1f4d6'), 
    fallbackImage: getFallbackUrl('1f4d6'), 
    emoji: '📖', 
    difficulty: 'easy' 
  },
  { 
    id: 'obj_clock', 
    category: 'objects', 
    nameAr: 'ساعة', 
    nameEn: 'Clock', 
    image: getTwemojiUrl('23f0'), 
    fallbackImage: getFallbackUrl('23f0'), 
    emoji: '⏰', 
    difficulty: 'easy' 
  },
  { 
    id: 'obj_phone', 
    category: 'objects', 
    nameAr: 'هاتف', 
    nameEn: 'Phone', 
    image: getTwemojiUrl('1f4f1'), 
    fallbackImage: getFallbackUrl('1f4f1'), 
    emoji: '📱', 
    difficulty: 'medium' 
  },

  // 8. Nature (6)
  { 
    id: 'nat_flower', 
    category: 'nature', 
    nameAr: 'زهرة', 
    nameEn: 'Flower', 
    image: getTwemojiUrl('1f33c'), 
    fallbackImage: getFallbackUrl('1f33c'), 
    emoji: '🌼', 
    difficulty: 'easy' 
  },
  { 
    id: 'nat_tree', 
    category: 'nature', 
    nameAr: 'شجرة', 
    nameEn: 'Tree', 
    image: getTwemojiUrl('1f333'), 
    fallbackImage: getFallbackUrl('1f333'), 
    emoji: '🌳', 
    difficulty: 'easy' 
  },
  { 
    id: 'nat_sun', 
    category: 'nature', 
    nameAr: 'شمس', 
    nameEn: 'Sun', 
    image: getTwemojiUrl('2600'), 
    fallbackImage: getFallbackUrl('2600'), 
    emoji: '☀️', 
    difficulty: 'easy' 
  },
  { 
    id: 'nat_moon', 
    category: 'nature', 
    nameAr: 'قمر', 
    nameEn: 'Moon', 
    image: getTwemojiUrl('1f319'), 
    fallbackImage: getFallbackUrl('1f319'), 
    emoji: '🌙', 
    difficulty: 'easy' 
  },
  { 
    id: 'nat_cloud', 
    category: 'nature', 
    nameAr: 'سحابة', 
    nameEn: 'Cloud', 
    image: getTwemojiUrl('2601'), 
    fallbackImage: getFallbackUrl('2601'), 
    emoji: '☁️', 
    difficulty: 'easy' 
  },
  { 
    id: 'nat_star', 
    category: 'nature', 
    nameAr: 'نجمة', 
    nameEn: 'Star', 
    image: getTwemojiUrl('2b50'), 
    fallbackImage: getFallbackUrl('2b50'), 
    emoji: '⭐', 
    difficulty: 'easy' 
  },

  // 9. Food (6)
  { 
    id: 'food_pizza', 
    category: 'food', 
    nameAr: 'بيتزا', 
    nameEn: 'Pizza', 
    image: getTwemojiUrl('1f355'), 
    fallbackImage: getFallbackUrl('1f355'), 
    emoji: '🍕', 
    difficulty: 'medium' 
  },
  { 
    id: 'food_burger', 
    category: 'food', 
    nameAr: 'برجر', 
    nameEn: 'Burger', 
    image: getTwemojiUrl('1f354'), 
    fallbackImage: getFallbackUrl('1f354'), 
    emoji: '🍔', 
    difficulty: 'easy' 
  },
  { 
    id: 'food_icecream', 
    category: 'food', 
    nameAr: 'مثلجات', 
    nameEn: 'Ice Cream', 
    image: getTwemojiUrl('1f366'), 
    fallbackImage: getFallbackUrl('1f366'), 
    emoji: '🍦', 
    difficulty: 'easy' 
  },
  { 
    id: 'food_cake', 
    category: 'food', 
    nameAr: 'كعكة', 
    nameEn: 'Cake', 
    image: getTwemojiUrl('1f382'), 
    fallbackImage: getFallbackUrl('1f382'), 
    emoji: '🎂', 
    difficulty: 'medium' 
  },
  { 
    id: 'food_donut', 
    category: 'food', 
    nameAr: 'دونات', 
    nameEn: 'Donut', 
    image: getTwemojiUrl('1f369'), 
    fallbackImage: getFallbackUrl('1f369'), 
    emoji: '🍩', 
    difficulty: 'easy' 
  },
  { 
    id: 'food_cookie', 
    category: 'food', 
    nameAr: 'بسكويت', 
    nameEn: 'Cookie', 
    image: getTwemojiUrl('1f36a'), 
    fallbackImage: getFallbackUrl('1f36a'), 
    emoji: '🍪', 
    difficulty: 'easy' 
  },

  // 10. Toys (6)
  { 
    id: 'toy_ball', 
    category: 'toys', 
    nameAr: 'كرة', 
    nameEn: 'Ball', 
    image: getTwemojiUrl('26bd'), 
    fallbackImage: getFallbackUrl('26bd'), 
    emoji: '⚽', 
    difficulty: 'easy' 
  },
  { 
    id: 'toy_doll', 
    category: 'toys', 
    nameAr: 'دمية دب', 
    nameEn: 'Teddy Bear', 
    image: getTwemojiUrl('1f9f8'), 
    fallbackImage: getFallbackUrl('1f9f8'), 
    emoji: '🧸', 
    difficulty: 'medium' 
  },
  { 
    id: 'toy_robot', 
    category: 'toys', 
    nameAr: 'روبوت', 
    nameEn: 'Robot', 
    image: getTwemojiUrl('1f916'), 
    fallbackImage: getFallbackUrl('1f916'), 
    emoji: '🤖', 
    difficulty: 'advanced' 
  },
  { 
    id: 'toy_kite', 
    category: 'toys', 
    nameAr: 'طائرة ورقية', 
    nameEn: 'Kite', 
    image: getTwemojiUrl('1fa81'), 
    fallbackImage: getFallbackUrl('1fa81'), 
    emoji: '🪁', 
    difficulty: 'medium' 
  },
  { 
    id: 'toy_yoyo', 
    category: 'toys', 
    nameAr: 'يويو', 
    nameEn: 'Yoyo', 
    image: getTwemojiUrl('1fa80'), 
    fallbackImage: getFallbackUrl('1fa80'), 
    emoji: '🪀', 
    difficulty: 'advanced' 
  },
  { 
    id: 'toy_puzzle', 
    category: 'toys', 
    nameAr: 'أحجية / بازل', 
    nameEn: 'Puzzle', 
    image: getTwemojiUrl('1f9e9'), 
    fallbackImage: getFallbackUrl('1f9e9'), 
    emoji: '🧩', 
    difficulty: 'medium' 
  }
];
