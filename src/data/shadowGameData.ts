export interface ShadowQuestion {
  id: string;
  category: string;
  nameAr: string;
  nameEn: string;
  image: string; // URL to transparent PNG
  difficulty: 'easy' | 'medium' | 'advanced' | 'challenge';
}

export const SHADOW_GAME_DATA: ShadowQuestion[] = [
  // 1. Pets (6)
  { id: 'pet_dog', category: 'pets', nameAr: 'كلب', nameEn: 'Dog', image: 'https://img.icons8.com/color/240/dog.png', difficulty: 'easy' },
  { id: 'pet_cat', category: 'pets', nameAr: 'قطة', nameEn: 'Cat', image: 'https://img.icons8.com/color/240/cat.png', difficulty: 'easy' },
  { id: 'pet_rabbit', category: 'pets', nameAr: 'أرنب', nameEn: 'Rabbit', image: 'https://img.icons8.com/color/240/rabbit.png', difficulty: 'easy' },
  { id: 'pet_hamster', category: 'pets', nameAr: 'هامستر', nameEn: 'Hamster', image: 'https://img.icons8.com/color/240/hamster.png', difficulty: 'medium' },
  { id: 'pet_parrot', category: 'pets', nameAr: 'ببغاء', nameEn: 'Parrot', image: 'https://img.icons8.com/color/240/parrot.png', difficulty: 'medium' },
  { id: 'pet_goldfish', category: 'pets', nameAr: 'سمكة ذهبية', nameEn: 'Goldfish', image: 'https://img.icons8.com/color/240/goldfish.png', difficulty: 'easy' },

  // 2. Wild Animals (10)
  { id: 'wild_lion', category: 'wild', nameAr: 'أسد', nameEn: 'Lion', image: 'https://img.icons8.com/color/240/lion.png', difficulty: 'easy' },
  { id: 'wild_tiger', category: 'wild', nameAr: 'نمر', nameEn: 'Tiger', image: 'https://img.icons8.com/color/240/tiger.png', difficulty: 'medium' },
  { id: 'wild_elephant', category: 'wild', nameAr: 'فيل', nameEn: 'Elephant', image: 'https://img.icons8.com/color/240/elephant.png', difficulty: 'easy' },
  { id: 'wild_giraffe', category: 'wild', nameAr: 'زرافة', nameEn: 'Giraffe', image: 'https://img.icons8.com/color/240/giraffe.png', difficulty: 'easy' },
  { id: 'wild_zebra', category: 'wild', nameAr: 'حمار وحشي', nameEn: 'Zebra', image: 'https://img.icons8.com/color/240/zebra.png', difficulty: 'medium' },
  { id: 'wild_monkey', category: 'wild', nameAr: 'قرد', nameEn: 'Monkey', image: 'https://img.icons8.com/color/240/monkey.png', difficulty: 'easy' },
  { id: 'wild_bear', category: 'wild', nameAr: 'دب', nameEn: 'Bear', image: 'https://img.icons8.com/color/240/bear.png', difficulty: 'easy' },
  { id: 'wild_fox', category: 'wild', nameAr: 'ثعلب', nameEn: 'Fox', image: 'https://img.icons8.com/color/240/fox.png', difficulty: 'medium' },
  { id: 'wild_kangaroo', category: 'wild', nameAr: 'كنغر', nameEn: 'Kangaroo', image: 'https://img.icons8.com/color/240/kangaroo.png', difficulty: 'advanced' },
  { id: 'wild_panda', category: 'wild', nameAr: 'باندا', nameEn: 'Panda', image: 'https://img.icons8.com/color/240/panda.png', difficulty: 'easy' },

  // 3. Birds & Sea (8)
  { id: 'sea_shark', category: 'sea', nameAr: 'قرش', nameEn: 'Shark', image: 'https://img.icons8.com/color/240/shark.png', difficulty: 'medium' },
  { id: 'sea_whale', category: 'sea', nameAr: 'حوت', nameEn: 'Whale', image: 'https://img.icons8.com/color/240/whale.png', difficulty: 'easy' },
  { id: 'sea_dolphin', category: 'sea', nameAr: 'دلفين', nameEn: 'Dolphin', image: 'https://img.icons8.com/color/240/dolphin.png', difficulty: 'easy' },
  { id: 'sea_octopus', category: 'sea', nameAr: 'أخطبوط', nameEn: 'Octopus', image: 'https://img.icons8.com/color/240/octopus.png', difficulty: 'medium' },
  { id: 'sea_turtle', category: 'sea', nameAr: 'سلحفاة بحرية', nameEn: 'Sea Turtle', image: 'https://img.icons8.com/color/240/sea-turtle.png', difficulty: 'medium' },
  { id: 'bird_eagle', category: 'sea', nameAr: 'نسر', nameEn: 'Eagle', image: 'https://img.icons8.com/color/240/eagle.png', difficulty: 'advanced' },
  { id: 'bird_penguin', category: 'sea', nameAr: 'بطريق', nameEn: 'Penguin', image: 'https://img.icons8.com/color/240/penguin.png', difficulty: 'easy' },
  { id: 'bird_owl', category: 'sea', nameAr: 'بومة', nameEn: 'Owl', image: 'https://img.icons8.com/color/240/owl.png', difficulty: 'medium' },

  // 4. Fruits (8)
  { id: 'fruit_apple', category: 'fruits', nameAr: 'تفاح', nameEn: 'Apple', image: 'https://img.icons8.com/color/240/apple.png', difficulty: 'easy' },
  { id: 'fruit_banana', category: 'fruits', nameAr: 'موز', nameEn: 'Banana', image: 'https://img.icons8.com/color/240/banana.png', difficulty: 'easy' },
  { id: 'fruit_strawberry', category: 'fruits', nameAr: 'فراولة', nameEn: 'Strawberry', image: 'https://img.icons8.com/color/240/strawberry.png', difficulty: 'easy' },
  { id: 'fruit_grapes', category: 'fruits', nameAr: 'عنب', nameEn: 'Grapes', image: 'https://img.icons8.com/color/240/grapes.png', difficulty: 'medium' },
  { id: 'fruit_watermelon', category: 'fruits', nameAr: 'بطيخ', nameEn: 'Watermelon', image: 'https://img.icons8.com/color/240/watermelon.png', difficulty: 'easy' },
  { id: 'fruit_pineapple', category: 'fruits', nameAr: 'أناناس', nameEn: 'Pineapple', image: 'https://img.icons8.com/color/240/pineapple.png', difficulty: 'medium' },
  { id: 'fruit_cherry', category: 'fruits', nameAr: 'كرز', nameEn: 'Cherry', image: 'https://img.icons8.com/color/240/cherry.png', difficulty: 'easy' },
  { id: 'fruit_pear', category: 'fruits', nameAr: 'كمثرى', nameEn: 'Pear', image: 'https://img.icons8.com/color/240/pear.png', difficulty: 'medium' },

  // 5. Vegetables (6)
  { id: 'veg_carrot', category: 'veg', nameAr: 'جزر', nameEn: 'Carrot', image: 'https://img.icons8.com/color/240/carrot.png', difficulty: 'easy' },
  { id: 'veg_broccoli', category: 'veg', nameAr: 'بروكلي', nameEn: 'Broccoli', image: 'https://img.icons8.com/color/240/broccoli.png', difficulty: 'medium' },
  { id: 'veg_corn', category: 'veg', nameAr: 'ذرة', nameEn: 'Corn', image: 'https://img.icons8.com/color/240/corn.png', difficulty: 'easy' },
  { id: 'veg_tomato', category: 'veg', nameAr: 'طماطم', nameEn: 'Tomato', image: 'https://img.icons8.com/color/240/tomato.png', difficulty: 'easy' },
  { id: 'veg_eggplant', category: 'veg', nameAr: 'باذنجان', nameEn: 'Eggplant', image: 'https://img.icons8.com/color/240/eggplant.png', difficulty: 'medium' },
  { id: 'veg_pepper', category: 'veg', nameAr: 'فلفل', nameEn: 'Bell Pepper', image: 'https://img.icons8.com/color/240/pepper.png', difficulty: 'medium' },

  // 6. Transport (6)
  { id: 'trans_car', category: 'transport', nameAr: 'سيارة', nameEn: 'Car', image: 'https://img.icons8.com/color/240/car.png', difficulty: 'easy' },
  { id: 'trans_bus', category: 'transport', nameAr: 'حافلة', nameEn: 'Bus', image: 'https://img.icons8.com/color/240/bus.png', difficulty: 'easy' },
  { id: 'trans_plane', category: 'transport', nameAr: 'طائرة', nameEn: 'Airplane', image: 'https://img.icons8.com/color/240/airplane.png', difficulty: 'easy' },
  { id: 'trans_ship', category: 'transport', nameAr: 'سفينة', nameEn: 'Ship', image: 'https://img.icons8.com/color/240/ship.png', difficulty: 'medium' },
  { id: 'trans_bike', category: 'transport', nameAr: 'دراجة', nameEn: 'Bicycle', image: 'https://img.icons8.com/color/240/bicycle.png', difficulty: 'easy' },
  { id: 'trans_train', category: 'transport', nameAr: 'قطار', nameEn: 'Train', image: 'https://img.icons8.com/color/240/train.png', difficulty: 'medium' },

  // 7. Objects (6)
  { id: 'obj_chair', category: 'objects', nameAr: 'كرسي', nameEn: 'Chair', image: 'https://img.icons8.com/color/240/chair.png', difficulty: 'easy' },
  { id: 'obj_table', category: 'objects', nameAr: 'طاولة', nameEn: 'Table', image: 'https://img.icons8.com/color/240/table.png', difficulty: 'easy' },
  { id: 'obj_lamp', category: 'objects', nameAr: 'مصباح', nameEn: 'Lamp', image: 'https://img.icons8.com/color/240/lamp.png', difficulty: 'medium' },
  { id: 'obj_book', category: 'objects', nameAr: 'كتاب', nameEn: 'Book', image: 'https://img.icons8.com/color/240/book.png', difficulty: 'easy' },
  { id: 'obj_clock', category: 'objects', nameAr: 'ساعة', nameEn: 'Clock', image: 'https://img.icons8.com/color/240/clock.png', difficulty: 'easy' },
  { id: 'obj_phone', category: 'objects', nameAr: 'هاتف', nameEn: 'Phone', image: 'https://img.icons8.com/color/240/phone.png', difficulty: 'medium' },

  // 8. Nature (6)
  { id: 'nat_flower', category: 'nature', nameAr: 'زهرة', nameEn: 'Flower', image: 'https://img.icons8.com/color/240/flower.png', difficulty: 'easy' },
  { id: 'nat_tree', category: 'nature', nameAr: 'شجرة', nameEn: 'Tree', image: 'https://img.icons8.com/color/240/tree.png', difficulty: 'easy' },
  { id: 'nat_sun', category: 'nature', nameAr: 'شمس', nameEn: 'Sun', image: 'https://img.icons8.com/color/240/sun.png', difficulty: 'easy' },
  { id: 'nat_moon', category: 'nature', nameAr: 'قمر', nameEn: 'Moon', image: 'https://img.icons8.com/color/240/moon.png', difficulty: 'easy' },
  { id: 'nat_cloud', category: 'nature', nameAr: 'سحابة', nameEn: 'Cloud', image: 'https://img.icons8.com/color/240/cloud.png', difficulty: 'easy' },
  { id: 'nat_star', category: 'nature', nameAr: 'نجمة', nameEn: 'Star', image: 'https://img.icons8.com/color/240/star.png', difficulty: 'easy' },

  // 9. Food (6)
  { id: 'food_pizza', category: 'food', nameAr: 'بيتزا', nameEn: 'Pizza', image: 'https://img.icons8.com/color/240/pizza.png', difficulty: 'medium' },
  { id: 'food_burger', category: 'food', nameAr: 'برجر', nameEn: 'Burger', image: 'https://img.icons8.com/color/240/hamburger.png', difficulty: 'easy' },
  { id: 'food_icecream', category: 'food', nameAr: 'مثلجات', nameEn: 'Ice Cream', image: 'https://img.icons8.com/color/240/ice-cream.png', difficulty: 'easy' },
  { id: 'food_cake', category: 'food', nameAr: 'كعكة', nameEn: 'Cake', image: 'https://img.icons8.com/color/240/cake.png', difficulty: 'medium' },
  { id: 'food_donut', category: 'food', nameAr: 'دونات', nameEn: 'Donut', image: 'https://img.icons8.com/color/240/donut.png', difficulty: 'easy' },
  { id: 'food_cookie', category: 'food', nameAr: 'بسكويت', nameEn: 'Cookie', image: 'https://img.icons8.com/color/240/cookie.png', difficulty: 'easy' },

  // 10. Toys (6)
  { id: 'toy_ball', category: 'toys', nameAr: 'كرة', nameEn: 'Ball', image: 'https://img.icons8.com/color/240/ball.png', difficulty: 'easy' },
  { id: 'toy_doll', category: 'toys', nameAr: 'دمية', nameEn: 'Doll', image: 'https://img.icons8.com/color/240/doll.png', difficulty: 'medium' },
  { id: 'toy_robot', category: 'toys', nameAr: 'روبوت', nameEn: 'Robot', image: 'https://img.icons8.com/color/240/robot.png', difficulty: 'advanced' },
  { id: 'toy_kite', category: 'toys', nameAr: 'طائرة ورقية', nameEn: 'Kite', image: 'https://img.icons8.com/color/240/kite.png', difficulty: 'medium' },
  { id: 'toy_yoyo', category: 'toys', nameAr: 'يويو', nameEn: 'Yoyo', image: 'https://img.icons8.com/color/240/yoyo.png', difficulty: 'advanced' },
  { id: 'toy_blocks', category: 'toys', nameAr: 'مكعبات', nameEn: 'Blocks', image: 'https://img.icons8.com/color/240/blocks.png', difficulty: 'medium' },
];
