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
  // 1. Pets
  { id: 's_cat', category: 'pets', type: 'sound', nameAr: 'قطة', nameEn: 'Cat', audioUrl: 'https://www.soundjay.com/animal/cat-meow-01.mp3', imageUrl: 'https://img.icons8.com/color/240/cat.png', difficulty: 'easy' },
  { id: 's_dog', category: 'pets', type: 'sound', nameAr: 'كلب', nameEn: 'Dog', audioUrl: 'https://www.soundjay.com/animal/dog-bark-01.mp3', imageUrl: 'https://img.icons8.com/color/240/dog.png', difficulty: 'easy' },
  { id: 's_rooster', category: 'pets', type: 'sound', nameAr: 'ديك', nameEn: 'Rooster', audioUrl: 'https://www.soundjay.com/animal/rooster-crowing-01.mp3', imageUrl: 'https://img.icons8.com/color/240/rooster.png', difficulty: 'medium' },
  { id: 's_sheep', category: 'pets', type: 'sound', nameAr: 'خروف', nameEn: 'Sheep', audioUrl: 'https://www.soundjay.com/animal/sheep-bleat-01.mp3', imageUrl: 'https://img.icons8.com/color/240/sheep.png', difficulty: 'easy' },
  { id: 's_cow', category: 'pets', type: 'sound', nameAr: 'بقرة', nameEn: 'Cow', audioUrl: 'https://www.soundjay.com/animal/cow-moo-01.mp3', imageUrl: 'https://img.icons8.com/color/240/cow.png', difficulty: 'easy' },
  { id: 's_horse', category: 'pets', type: 'sound', nameAr: 'حصان', nameEn: 'Horse', audioUrl: 'https://www.soundjay.com/animal/horse-neigh-01.mp3', imageUrl: 'https://img.icons8.com/color/240/horse.png', difficulty: 'medium' },

  // 2. Wild
  { id: 's_lion', category: 'wild', type: 'sound', nameAr: 'أسد', nameEn: 'Lion', audioUrl: 'https://www.soundjay.com/animal/lion-roar-01.mp3', imageUrl: 'https://img.icons8.com/color/240/lion.png', difficulty: 'easy' },
  { id: 's_elephant', category: 'wild', type: 'sound', nameAr: 'فيل', nameEn: 'Elephant', audioUrl: 'https://www.soundjay.com/animal/elephant-trumpet-01.mp3', imageUrl: 'https://img.icons8.com/color/240/elephant.png', difficulty: 'medium' },
  { id: 's_monkey', category: 'wild', type: 'sound', nameAr: 'قرد', nameEn: 'Monkey', audioUrl: 'https://www.soundjay.com/animal/monkey-chatter-01.mp3', imageUrl: 'https://img.icons8.com/color/240/monkey.png', difficulty: 'advanced' },
  { id: 's_snake', category: 'wild', type: 'sound', nameAr: 'ثعبان', nameEn: 'Snake', audioUrl: 'https://www.soundjay.com/animal/snake-hissing-01.mp3', imageUrl: 'https://img.icons8.com/color/240/snake.png', difficulty: 'challenge' },
  { id: 's_owl', category: 'wild', type: 'sound', nameAr: 'بومة', nameEn: 'Owl', audioUrl: 'https://www.soundjay.com/animal/owl-hooting-01.mp3', imageUrl: 'https://img.icons8.com/color/240/owl.png', difficulty: 'advanced' },

  // 3. Transport
  { id: 's_car', category: 'transport', type: 'sound', nameAr: 'سيارة', nameEn: 'Car', audioUrl: 'https://www.soundjay.com/transportation/car-horn-01.mp3', imageUrl: 'https://img.icons8.com/color/240/car.png', difficulty: 'easy' },
  { id: 's_plane', category: 'transport', type: 'sound', nameAr: 'طائرة', nameEn: 'Airplane', audioUrl: 'https://www.soundjay.com/transportation/airplane-take-off-01.mp3', imageUrl: 'https://img.icons8.com/color/240/airplane.png', difficulty: 'medium' },
  { id: 's_train', category: 'transport', type: 'sound', nameAr: 'قطار', nameEn: 'Train', audioUrl: 'https://www.soundjay.com/transportation/train-steam-whistle-01.mp3', imageUrl: 'https://img.icons8.com/color/240/train.png', difficulty: 'easy' },
  { id: 's_ambulance', category: 'transport', type: 'sound', nameAr: 'إسعاف', nameEn: 'Ambulance', audioUrl: 'https://www.soundjay.com/transportation/ambulance-siren-01.mp3', imageUrl: 'https://img.icons8.com/color/240/ambulance.png', difficulty: 'medium' },
  { id: 's_police', category: 'transport', type: 'sound', nameAr: 'شرطة', nameEn: 'Police Car', audioUrl: 'https://www.soundjay.com/transportation/police-car-siren-01.mp3', imageUrl: 'https://img.icons8.com/color/240/police-car.png', difficulty: 'medium' },

  // 4. Home & Environment
  { id: 's_doorbell', category: 'home', type: 'sound', nameAr: 'جرس الباب', nameEn: 'Doorbell', audioUrl: 'https://www.soundjay.com/mechanical/doorbell-1.mp3', imageUrl: 'https://img.icons8.com/color/240/doorbell.png', difficulty: 'easy' },
  { id: 's_phone', category: 'home', type: 'sound', nameAr: 'هاتف', nameEn: 'Phone', audioUrl: 'https://www.soundjay.com/phone/phone-ringing-01.mp3', imageUrl: 'https://img.icons8.com/color/240/phone.png', difficulty: 'easy' },
  { id: 's_clock', category: 'home', type: 'sound', nameAr: 'ساعة', nameEn: 'Clock', audioUrl: 'https://www.soundjay.com/clock/clock-ticking-1.mp3', imageUrl: 'https://img.icons8.com/color/240/clock.png', difficulty: 'medium' },
  { id: 's_thunder', category: 'nature', type: 'sound', nameAr: 'رعد', nameEn: 'Thunder', audioUrl: 'https://www.soundjay.com/nature/thunder-01.mp3', imageUrl: 'https://img.icons8.com/color/240/thunderstorm.png', difficulty: 'advanced' },
  { id: 's_rain', category: 'nature', type: 'sound', nameAr: 'مطر', nameEn: 'Rain', audioUrl: 'https://www.soundjay.com/nature/rain-01.mp3', imageUrl: 'https://img.icons8.com/color/240/rain.png', difficulty: 'advanced' },

  // --- WORDS MODE (كلمات) ---
  // Using empty audioUrl for words; logic will use SpeechSynthesis as requested for "Spoken Word" if file unavailable
  // 5. Fruits & Veg
  { id: 'w_apple', category: 'food', type: 'word', nameAr: 'تفاحة', nameEn: 'Apple', audioUrl: '', imageUrl: 'https://img.icons8.com/color/240/apple.png', difficulty: 'easy' },
  { id: 'w_banana', category: 'food', type: 'word', nameAr: 'موزة', nameEn: 'Banana', audioUrl: '', imageUrl: 'https://img.icons8.com/color/240/banana.png', difficulty: 'easy' },
  { id: 'w_orange', category: 'food', type: 'word', nameAr: 'برتقالة', nameEn: 'Orange', audioUrl: '', imageUrl: 'https://img.icons8.com/color/240/orange.png', difficulty: 'easy' },
  { id: 'w_strawberry', category: 'food', type: 'word', nameAr: 'فراولة', nameEn: 'Strawberry', audioUrl: '', imageUrl: 'https://img.icons8.com/color/240/strawberry.png', difficulty: 'medium' },
  { id: 'w_carrot', category: 'food', type: 'word', nameAr: 'جزرة', nameEn: 'Carrot', audioUrl: '', imageUrl: 'https://img.icons8.com/color/240/carrot.png', difficulty: 'easy' },
  { id: 'w_corn', category: 'food', type: 'word', nameAr: 'ذرة', nameEn: 'Corn', audioUrl: '', imageUrl: 'https://img.icons8.com/color/240/corn.png', difficulty: 'medium' },
  { id: 'w_tomato', category: 'food', type: 'word', nameAr: 'طماطم', nameEn: 'Tomato', audioUrl: '', imageUrl: 'https://img.icons8.com/color/240/tomato.png', difficulty: 'easy' },

  // 6. Objects & Toys
  { id: 'w_book', category: 'objects', type: 'word', nameAr: 'كتاب', nameEn: 'Book', audioUrl: '', imageUrl: 'https://img.icons8.com/color/240/book.png', difficulty: 'easy' },
  { id: 'w_chair', category: 'objects', type: 'word', nameAr: 'كرسي', nameEn: 'Chair', audioUrl: '', imageUrl: 'https://img.icons8.com/color/240/chair.png', difficulty: 'easy' },
  { id: 'w_table', category: 'objects', type: 'word', nameAr: 'طاولة', nameEn: 'Table', audioUrl: '', imageUrl: 'https://img.icons8.com/color/240/table.png', difficulty: 'medium' },
  { id: 'w_ball', category: 'objects', type: 'word', nameAr: 'كرة', nameEn: 'Ball', audioUrl: '', imageUrl: 'https://img.icons8.com/color/240/ball.png', difficulty: 'easy' },
  { id: 'w_doll', category: 'objects', type: 'word', nameAr: 'دمية', nameEn: 'Doll', audioUrl: '', imageUrl: 'https://img.icons8.com/color/240/doll.png', difficulty: 'medium' },
  { id: 'w_robot', category: 'objects', type: 'word', nameAr: 'روبوت', nameEn: 'Robot', audioUrl: '', imageUrl: 'https://img.icons8.com/color/240/robot.png', difficulty: 'advanced' },
  { id: 'w_kite', category: 'objects', type: 'word', nameAr: 'طائرة ورقية', nameEn: 'Kite', audioUrl: '', imageUrl: 'https://img.icons8.com/color/240/kite.png', difficulty: 'advanced' },

  // 7. Nature
  { id: 'w_sun', category: 'nature', type: 'word', nameAr: 'شمس', nameEn: 'Sun', audioUrl: '', imageUrl: 'https://img.icons8.com/color/240/sun.png', difficulty: 'easy' },
  { id: 'w_moon', category: 'nature', type: 'word', nameAr: 'قمر', nameEn: 'Moon', audioUrl: '', imageUrl: 'https://img.icons8.com/color/240/moon.png', difficulty: 'easy' },
  { id: 'w_star', category: 'nature', type: 'word', nameAr: 'نجمة', nameEn: 'Star', audioUrl: '', imageUrl: 'https://img.icons8.com/color/240/star.png', difficulty: 'easy' },
  { id: 'w_tree', category: 'nature', type: 'word', nameAr: 'شجرة', nameEn: 'Tree', audioUrl: '', imageUrl: 'https://img.icons8.com/color/240/tree.png', difficulty: 'easy' },
  { id: 'w_flower', category: 'nature', type: 'word', nameAr: 'زهرة', nameEn: 'Flower', audioUrl: '', imageUrl: 'https://img.icons8.com/color/240/flower.png', difficulty: 'easy' },

  // 8. People & Clothes
  { id: 'w_baby', category: 'objects', type: 'word', nameAr: 'طفل', nameEn: 'Baby', audioUrl: '', imageUrl: 'https://img.icons8.com/color/240/baby.png', difficulty: 'medium' },
  { id: 'w_boy', category: 'objects', type: 'word', nameAr: 'ولد', nameEn: 'Boy', audioUrl: '', imageUrl: 'https://img.icons8.com/color/240/boy.png', difficulty: 'easy' },
  { id: 'w_girl', category: 'objects', type: 'word', nameAr: 'بنت', nameEn: 'Girl', audioUrl: '', imageUrl: 'https://img.icons8.com/color/240/girl.png', difficulty: 'easy' },
  { id: 'w_hat', category: 'objects', type: 'word', nameAr: 'قبعة', nameEn: 'Hat', audioUrl: '', imageUrl: 'https://img.icons8.com/color/240/hat.png', difficulty: 'medium' },
  { id: 'w_shoes', category: 'objects', type: 'word', nameAr: 'حذاء', nameEn: 'Shoes', audioUrl: '', imageUrl: 'https://img.icons8.com/color/240/shoes.png', difficulty: 'medium' },

  // More to reach ~60
  { id: 's_duck', category: 'pets', type: 'sound', nameAr: 'بطة', nameEn: 'Duck', audioUrl: 'https://www.soundjay.com/animal/duck-quack-1.mp3', imageUrl: 'https://img.icons8.com/color/240/duck.png', difficulty: 'easy' },
  { id: 's_bee', category: 'pets', type: 'sound', nameAr: 'نحلة', nameEn: 'Bee', audioUrl: 'https://www.soundjay.com/animal/bee-buzzing-01.mp3', imageUrl: 'https://img.icons8.com/color/240/bee.png', difficulty: 'medium' },
  { id: 's_helicopter', category: 'transport', type: 'sound', nameAr: 'مروحية', nameEn: 'Helicopter', audioUrl: 'https://www.soundjay.com/transportation/helicopter-fly-over-01.mp3', imageUrl: 'https://img.icons8.com/color/240/helicopter.png', difficulty: 'advanced' },
  { id: 'w_watermelon', category: 'food', type: 'word', nameAr: 'بطيخ', nameEn: 'Watermelon', audioUrl: '', imageUrl: 'https://img.icons8.com/color/240/watermelon.png', difficulty: 'medium' },
  { id: 'w_grapes', category: 'food', type: 'word', nameAr: 'عنب', nameEn: 'Grapes', audioUrl: '', imageUrl: 'https://img.icons8.com/color/240/grapes.png', difficulty: 'medium' },
  { id: 'w_pineapple', category: 'food', type: 'word', nameAr: 'أناناس', nameEn: 'Pineapple', audioUrl: '', imageUrl: 'https://img.icons8.com/color/240/pineapple.png', difficulty: 'advanced' },
  { id: 'w_eggplant', category: 'food', type: 'word', nameAr: 'باذنجان', nameEn: 'Eggplant', audioUrl: '', imageUrl: 'https://img.icons8.com/color/240/eggplant.png', difficulty: 'advanced' },
  { id: 'w_broccoli', category: 'food', type: 'word', nameAr: 'بروكلي', nameEn: 'Broccoli', audioUrl: '', imageUrl: 'https://img.icons8.com/color/240/broccoli.png', difficulty: 'challenge' },
  { id: 'w_pizza', category: 'food', type: 'word', nameAr: 'بيتزا', nameEn: 'Pizza', audioUrl: '', imageUrl: 'https://img.icons8.com/color/240/pizza.png', difficulty: 'easy' },
  { id: 'w_burger', category: 'food', type: 'word', nameAr: 'برجر', nameEn: 'Burger', audioUrl: '', imageUrl: 'https://img.icons8.com/color/240/hamburger.png', difficulty: 'medium' },
  { id: 'w_icecream', category: 'food', type: 'word', nameAr: 'مثلجات', nameEn: 'Ice Cream', audioUrl: '', imageUrl: 'https://img.icons8.com/color/240/ice-cream.png', difficulty: 'easy' },
  { id: 'w_cake', category: 'food', type: 'word', nameAr: 'كعكة', nameEn: 'Cake', audioUrl: '', imageUrl: 'https://img.icons8.com/color/240/cake.png', difficulty: 'medium' },
  { id: 'w_fish', category: 'pets', type: 'word', nameAr: 'سمكة', nameEn: 'Fish', audioUrl: '', imageUrl: 'https://img.icons8.com/color/240/fish.png', difficulty: 'easy' },
  { id: 'w_butterfly', category: 'pets', type: 'word', nameAr: 'فراشة', nameEn: 'Butterfly', audioUrl: '', imageUrl: 'https://img.icons8.com/color/240/butterfly.png', difficulty: 'medium' },
  { id: 'w_whale', category: 'sea', type: 'word', nameAr: 'حوت', nameEn: 'Whale', audioUrl: '', imageUrl: 'https://img.icons8.com/color/240/whale.png', difficulty: 'easy' },
  { id: 'w_shark', category: 'sea', type: 'word', nameAr: 'قرش', nameEn: 'Shark', audioUrl: '', imageUrl: 'https://img.icons8.com/color/240/shark.png', difficulty: 'medium' },
  { id: 'w_octopus', category: 'sea', type: 'word', nameAr: 'أخطبوط', nameEn: 'Octopus', audioUrl: '', imageUrl: 'https://img.icons8.com/color/240/octopus.png', difficulty: 'advanced' },
  { id: 'w_ship', category: 'transport', type: 'word', nameAr: 'سفينة', nameEn: 'Ship', audioUrl: '', imageUrl: 'https://img.icons8.com/color/240/ship.png', difficulty: 'medium' },
  { id: 'w_bicycle', category: 'transport', type: 'word', nameAr: 'دراجة', nameEn: 'Bicycle', audioUrl: '', imageUrl: 'https://img.icons8.com/color/240/bicycle.png', difficulty: 'easy' },
  { id: 'w_bus', category: 'transport', type: 'word', nameAr: 'حافلة', nameEn: 'Bus', audioUrl: '', imageUrl: 'https://img.icons8.com/color/240/bus.png', difficulty: 'easy' },
  { id: 'w_tractor', category: 'transport', type: 'word', nameAr: 'جرار', nameEn: 'Tractor', audioUrl: '', imageUrl: 'https://img.icons8.com/color/240/tractor.png', difficulty: 'advanced' },
  { id: 'w_umbrella', category: 'objects', type: 'word', nameAr: 'مظلة', nameEn: 'Umbrella', audioUrl: '', imageUrl: 'https://img.icons8.com/color/240/umbrella.png', difficulty: 'medium' },
  { id: 'w_key', category: 'objects', type: 'word', nameAr: 'مفتاح', nameEn: 'Key', audioUrl: '', imageUrl: 'https://img.icons8.com/color/240/key.png', difficulty: 'easy' },
  { id: 'w_pencil', category: 'objects', type: 'word', nameAr: 'قلم', nameEn: 'Pencil', audioUrl: '', imageUrl: 'https://img.icons8.com/color/240/pencil.png', difficulty: 'easy' },
  { id: 'w_lamp', category: 'objects', type: 'word', nameAr: 'مصباح', nameEn: 'Lamp', audioUrl: '', imageUrl: 'https://img.icons8.com/color/240/lamp.png', difficulty: 'medium' },
];
