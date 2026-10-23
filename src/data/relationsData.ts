export interface RelationItem {
  nameAr: string;
  nameEn: string;
  icon: string;
}

export interface RelationPair {
  id: string;
  itemA: RelationItem;
  itemB: RelationItem;
  explanationAr: string;
  explanationEn: string;
  category: 'tools' | 'nature' | 'food' | 'parts' | 'daily' | 'animals' | 'habitats' | 'products';
  difficulty: 'easy' | 'medium' | 'advanced';
}

export const RELATIONS_DATA: RelationPair[] = [
  // 1. Tools & Uses
  {
    id: 'brush_paint',
    itemA: { nameAr: 'فرشاة تلوين', nameEn: 'Paintbrush', icon: '🖌️' },
    itemB: { nameAr: 'لوحة ألوان', nameEn: 'Palette', icon: '🎨' },
    explanationAr: 'نستخدم الفرشاة مع الألوان للرسم.',
    explanationEn: 'We use the brush with colors to paint.',
    category: 'tools',
    difficulty: 'easy'
  },
  {
    id: 'hammer_nail',
    itemA: { nameAr: 'مطرقة', nameEn: 'Hammer', icon: '🔨' },
    itemB: { nameAr: 'مسمار', nameEn: 'Nail', icon: '🔩' },
    explanationAr: 'المطرقة تدق المسامير في الخشب.',
    explanationEn: 'The hammer drives nails into wood.',
    category: 'tools',
    difficulty: 'medium'
  },
  {
    id: 'key_lock',
    itemA: { nameAr: 'مفتاح', nameEn: 'Key', icon: '🔑' },
    itemB: { nameAr: 'قفل', nameEn: 'Lock', icon: '🔒' },
    explanationAr: 'المفتاح يفتح القفل المغلق.',
    explanationEn: 'The key opens the locked door.',
    category: 'tools',
    difficulty: 'easy'
  },
  {
    id: 'needle_thread',
    itemA: { nameAr: 'إبرة خياطة', nameEn: 'Needle', icon: '🪡' },
    itemB: { nameAr: 'بكرة خيط', nameEn: 'Thread', icon: '🧵' },
    explanationAr: 'نستخدم الإبرة والخيط لخياطة الملابس.',
    explanationEn: 'We use needle and thread to sew clothes.',
    category: 'tools',
    difficulty: 'advanced'
  },
  {
    id: 'saw_wood',
    itemA: { nameAr: 'منشار', nameEn: 'Saw', icon: '🪚' },
    itemB: { nameAr: 'خشب', nameEn: 'Wood', icon: '🪵' },
    explanationAr: 'المنشار يقطع الخشب لصناعة الأثاث.',
    explanationEn: 'The saw cuts wood to make furniture.',
    category: 'tools',
    difficulty: 'medium'
  },

  // 2. Complementary Objects
  {
    id: 'shoe_sock',
    itemA: { nameAr: 'حذاء', nameEn: 'Shoe', icon: '👟' },
    itemB: { nameAr: 'جوارب', nameEn: 'Socks', icon: '🧦' },
    explanationAr: 'نلبس الجوارب قبل الحذاء دائماً.',
    explanationEn: 'We always wear socks before shoes.',
    category: 'daily',
    difficulty: 'easy'
  },
  {
    id: 'racket_ball',
    itemA: { nameAr: 'مضرب', nameEn: 'Racket', icon: '🎾' },
    itemB: { nameAr: 'كرة', nameEn: 'Ball', icon: '🥎' },
    explanationAr: 'نستخدم المضرب لضرب الكرة في اللعب.',
    explanationEn: 'We use the racket to hit the ball.',
    category: 'daily',
    difficulty: 'easy'
  },
  {
    id: 'fork_knife',
    itemA: { nameAr: 'شوكة', nameEn: 'Fork', icon: '🍴' },
    itemB: { nameAr: 'سكين', nameEn: 'Knife', icon: '🔪' },
    explanationAr: 'الشوكة والسكين أدوات مائدة مترابطة.',
    explanationEn: 'Fork and knife are table tools.',
    category: 'daily',
    difficulty: 'medium'
  },
  {
    id: 'paper_pen',
    itemA: { nameAr: 'ورقة', nameEn: 'Paper', icon: '📄' },
    itemB: { nameAr: 'قلم', nameEn: 'Pen', icon: '🖊️' },
    explanationAr: 'نكتب بالقلم على الورقة البيضاء.',
    explanationEn: 'We write with the pen on paper.',
    category: 'daily',
    difficulty: 'easy'
  },
  {
    id: 'laptop_mouse',
    itemA: { nameAr: 'حاسوب', nameEn: 'Laptop', icon: '💻' },
    itemB: { nameAr: 'لوحة مفاتيح', nameEn: 'Keyboard', icon: '⌨️' },
    explanationAr: 'نستخدم لوحة المفاتيح للكتابة في الحاسوب.',
    explanationEn: 'We use the keyboard to type on the computer.',
    category: 'tools',
    difficulty: 'medium'
  },

  // 3. Animal & Habitat/Food
  {
    id: 'bee_flower',
    itemA: { nameAr: 'نحلة', nameEn: 'Bee', icon: '🐝' },
    itemB: { nameAr: 'زهرة', nameEn: 'Flower', icon: '🌸' },
    explanationAr: 'النحلة تأخذ الرحيق من الزهور.',
    explanationEn: 'Bees take nectar from flowers.',
    category: 'animals',
    difficulty: 'easy'
  },
  {
    id: 'monkey_banana',
    itemA: { nameAr: 'قرد', nameEn: 'Monkey', icon: '🐒' },
    itemB: { nameAr: 'موز', nameEn: 'Banana', icon: '🍌' },
    explanationAr: 'القرد يحب أكل الموز اللذيذ.',
    explanationEn: 'Monkeys love eating tasty bananas.',
    category: 'animals',
    difficulty: 'easy'
  },
  {
    id: 'spider_web',
    itemA: { nameAr: 'عنكبوت', nameEn: 'Spider', icon: '🕷️' },
    itemB: { nameAr: 'نسيج العنكبوت', nameEn: 'Web', icon: '🕸️' },
    explanationAr: 'العنكبوت يبني بيته من الخيوط.',
    explanationEn: 'Spiders build their homes from thread.',
    category: 'habitats',
    difficulty: 'medium'
  },
  {
    id: 'bird_nest',
    itemA: { nameAr: 'عصفور', nameEn: 'Bird', icon: '🐦' },
    itemB: { nameAr: 'عش', nameEn: 'Nest', icon: '🪹' },
    explanationAr: 'العصفور يبني عشه فوق الأشجار.',
    explanationEn: 'Birds build their nests in trees.',
    category: 'habitats',
    difficulty: 'easy'
  },
  {
    id: 'fish_ocean',
    itemA: { nameAr: 'سمكة', nameEn: 'Fish', icon: '🐟' },
    itemB: { nameAr: 'محيط', nameEn: 'Ocean', icon: '🌊' },
    explanationAr: 'الأسماك تعيش وتسبح في الماء.',
    explanationEn: 'Fish live and swim in the water.',
    category: 'habitats',
    difficulty: 'easy'
  },

  // 4. Source & Product
  {
    id: 'cow_milk',
    itemA: { nameAr: 'بقرة', nameEn: 'Cow', icon: '🐄' },
    itemB: { nameAr: 'حليب', nameEn: 'Milk', icon: '🥛' },
    explanationAr: 'نحصل على الحليب المفيد من البقرة.',
    explanationEn: 'We get healthy milk from cows.',
    category: 'products',
    difficulty: 'easy'
  },
  {
    id: 'chicken_egg',
    itemA: { nameAr: 'دجاجة', nameEn: 'Hen', icon: '🐓' },
    itemB: { nameAr: 'بيضة', nameEn: 'Egg', icon: '🥚' },
    explanationAr: 'الدجاجة تبيض لنا البيض المغذي.',
    explanationEn: 'The hen lays nutritious eggs for us.',
    category: 'products',
    difficulty: 'easy'
  },
  {
    id: 'sheep_wool',
    itemA: { nameAr: 'خروف', nameEn: 'Sheep', icon: '🐑' },
    itemB: { nameAr: 'وشاح صوف', nameEn: 'Scarf', icon: '🧣' },
    explanationAr: 'نأخذ الصوف من الخروف لصناعة الملابس الدافئة.',
    explanationEn: 'We get wool from sheep for warm clothes.',
    category: 'products',
    difficulty: 'medium'
  },
  {
    id: 'tree_apple',
    itemA: { nameAr: 'شجرة', nameEn: 'Tree', icon: '🌳' },
    itemB: { nameAr: 'تفاحة', nameEn: 'Apple', icon: '🍎' },
    explanationAr: 'الأشجار تعطينا الثمار اللذيذة كالتفاح.',
    explanationEn: 'Trees give us delicious fruit like apples.',
    category: 'products',
    difficulty: 'easy'
  },
  {
    id: 'flour_bread',
    itemA: { nameAr: 'دقيق', nameEn: 'Flour', icon: '🌾' },
    itemB: { nameAr: 'خبز', nameEn: 'Bread', icon: '🍞' },
    explanationAr: 'نصنع الخبز من الدقيق والقمح.',
    explanationEn: 'We make bread from flour and wheat.',
    category: 'products',
    difficulty: 'advanced'
  },

  // 5. Part & Whole
  {
    id: 'car_wheel',
    itemA: { nameAr: 'سيارة', nameEn: 'Car', icon: '🚗' },
    itemB: { nameAr: 'عجلة', nameEn: 'Wheel', icon: '🛞' },
    explanationAr: 'العجلة جزء أساسي من السيارة لتتحرك.',
    explanationEn: 'The wheel is a main part of the car.',
    category: 'parts',
    difficulty: 'medium'
  },
  {
    id: 'hand_fingers',
    itemA: { nameAr: 'يد', nameEn: 'Hand', icon: '🤚' },
    itemB: { nameAr: 'أصابع', nameEn: 'Fingers', icon: '🖐️' },
    explanationAr: 'الأصابع هي جزء من يدنا.',
    explanationEn: 'Fingers are part of our hand.',
    category: 'parts',
    difficulty: 'easy'
  },
  {
    id: 'book_page',
    itemA: { nameAr: 'كتاب', nameEn: 'Book', icon: '📖' },
    itemB: { nameAr: 'فاصل كتاب', nameEn: 'Bookmark', icon: '📑' },
    explanationAr: 'نستخدم الفاصل لنعرف أين وصلنا في القراءة.',
    explanationEn: 'We use bookmarks to mark our reading spot.',
    category: 'parts',
    difficulty: 'medium'
  },
  {
    id: 'house_door',
    itemA: { nameAr: 'بيت', nameEn: 'House', icon: '🏠' },
    itemB: { nameAr: 'باب', nameEn: 'Door', icon: '🚪' },
    explanationAr: 'الباب هو مدخل البيت.',
    explanationEn: 'The door is the entrance to the house.',
    category: 'parts',
    difficulty: 'easy'
  },
  {
    id: 'clock_hands',
    itemA: { nameAr: 'ساعة', nameEn: 'Clock', icon: '⏰' },
    itemB: { nameAr: 'عقارب الساعة', nameEn: 'Hands', icon: '🕐' },
    explanationAr: 'عقارب الساعة تخبرنا بالوقت.',
    explanationEn: 'Clock hands tell us the time.',
    category: 'parts',
    difficulty: 'advanced'
  },

  // 6. Daily Life Interactions
  {
    id: 'umbrella_rain',
    itemA: { nameAr: 'مظلة', nameEn: 'Umbrella', icon: '☂️' },
    itemB: { nameAr: 'مطر', nameEn: 'Rain', icon: '🌧️' },
    explanationAr: 'المظلة تحمينا من البلل في المطر.',
    explanationEn: 'An umbrella keeps us dry in the rain.',
    category: 'daily',
    difficulty: 'easy'
  },
  {
    id: 'sun_sunglasses',
    itemA: { nameAr: 'شمس', nameEn: 'Sun', icon: '☀️' },
    itemB: { nameAr: 'نظارة شمسية', nameEn: 'Sunglasses', icon: '🕶️' },
    explanationAr: 'نلبس النظارة لتحمي أعيننا من الشمس.',
    explanationEn: 'We wear glasses to protect eyes from sun.',
    category: 'daily',
    difficulty: 'medium'
  },
  {
    id: 'toothbrush_paste',
    itemA: { nameAr: 'فرشاة أسنان', nameEn: 'Toothbrush', icon: '🪥' },
    itemB: { nameAr: 'معجون أسنان', nameEn: 'Toothpaste', icon: '🧴' },
    explanationAr: 'ننظف أسناننا بالفرشاة والمعجون.',
    explanationEn: 'We clean our teeth with brush and paste.',
    category: 'daily',
    difficulty: 'easy'
  },
  {
    id: 'soap_water',
    itemA: { nameAr: 'صابون', nameEn: 'Soap', icon: '🧼' },
    itemB: { nameAr: 'صنبور ماء', nameEn: 'Faucet', icon: '🚰' },
    explanationAr: 'نغسل أيدينا بالماء والصابون.',
    explanationEn: 'We wash our hands with water and soap.',
    category: 'daily',
    difficulty: 'easy'
  },
  {
    id: 'bed_pillow',
    itemA: { nameAr: 'سرير', nameEn: 'Bed', icon: '🛏️' },
    itemB: { nameAr: 'وسادة', nameEn: 'Pillow', icon: '🛌' },
    explanationAr: 'نضع الوسادة على السرير لننام بارتياح.',
    explanationEn: 'We put the pillow on the bed to sleep.',
    category: 'daily',
    difficulty: 'easy'
  },

  // 7. Nature & Environment
  {
    id: 'cloud_lightning',
    itemA: { nameAr: 'سحاب', nameEn: 'Cloud', icon: '☁️' },
    itemB: { nameAr: 'برق', nameEn: 'Lightning', icon: '⚡' },
    explanationAr: 'البرق يخرج من السحب في العواصف.',
    explanationEn: 'Lightning comes from clouds during storms.',
    category: 'nature',
    difficulty: 'medium'
  },
  {
    id: 'moon_star',
    itemA: { nameAr: 'قمر', nameEn: 'Moon', icon: '🌙' },
    itemB: { nameAr: 'نجوم', nameEn: 'Stars', icon: '⭐' },
    explanationAr: 'القمر والنجوم يظهران في سماء الليل.',
    explanationEn: 'Moon and stars appear in the night sky.',
    category: 'nature',
    difficulty: 'easy'
  },
  {
    id: 'fire_smoke',
    itemA: { nameAr: 'نار', nameEn: 'Fire', icon: '🔥' },
    itemB: { nameAr: 'دخان', nameEn: 'Smoke', icon: '💨' },
    explanationAr: 'الدخان يتصاعد عندما تشتعل النار.',
    explanationEn: 'Smoke rises when fire burns.',
    category: 'nature',
    difficulty: 'medium'
  },
  {
    id: 'beach_sand',
    itemA: { nameAr: 'شاطئ', nameEn: 'Beach', icon: '🏖️' },
    itemB: { nameAr: 'دلو رمل', nameEn: 'Sand Bucket', icon: '🪣' },
    explanationAr: 'نلعب بالرمل على شاطئ البحر.',
    explanationEn: 'We play with sand on the beach.',
    category: 'nature',
    difficulty: 'medium'
  },
  {
    id: 'winter_snow',
    itemA: { nameAr: 'فصل الشتاء', nameEn: 'Winter', icon: '❄️' },
    itemB: { nameAr: 'رجل ثلج', nameEn: 'Snowman', icon: '☃️' },
    explanationAr: 'في الشتاء والثلج نصنع رجل الثلج.',
    explanationEn: 'In winter and snow, we make a snowman.',
    category: 'nature',
    difficulty: 'medium'
  },

  // 8. More Animals
  {
    id: 'cat_yarn',
    itemA: { nameAr: 'قطة', nameEn: 'Cat', icon: '🐱' },
    itemB: { nameAr: 'كرة صوف', nameEn: 'Yarn', icon: '🧶' },
    explanationAr: 'القطة تحب اللعب بكرات الصوف.',
    explanationEn: 'Cats love playing with yarn balls.',
    category: 'animals',
    difficulty: 'medium'
  },
  {
    id: 'dog_bone',
    itemA: { nameAr: 'كلب', nameEn: 'Dog', icon: '🐶' },
    itemB: { nameAr: 'عظمة', nameEn: 'Bone', icon: '🦴' },
    explanationAr: 'الكلب يحب أن يمسك بالعظمة.',
    explanationEn: 'Dogs love to catch bones.',
    category: 'animals',
    difficulty: 'easy'
  },
  {
    id: 'rabbit_carrot',
    itemA: { nameAr: 'أرنب', nameEn: 'Rabbit', icon: '🐰' },
    itemB: { nameAr: 'جزرة', nameEn: 'Carrot', icon: '🥕' },
    explanationAr: 'الأرنب يحب أكل الجزر المقرمش.',
    explanationEn: 'Rabbits love eating crunchy carrots.',
    category: 'animals',
    difficulty: 'easy'
  },
  {
    id: 'lion_jungle',
    itemA: { nameAr: 'أسد', nameEn: 'Lion', icon: '🦁' },
    itemB: { nameAr: 'غابة', nameEn: 'Jungle', icon: '🌳' },
    explanationAr: 'الأسد هو ملك الغابة ويعيش فيها.',
    explanationEn: 'The lion is king of the jungle.',
    category: 'habitats',
    difficulty: 'easy'
  },
  {
    id: 'camel_desert',
    itemA: { nameAr: 'جمل', nameEn: 'Camel', icon: '🐪' },
    itemB: { nameAr: 'صحراء', nameEn: 'Desert', icon: '🏜️' },
    explanationAr: 'الجمل سفينة الصحراء ويعيش فيها.',
    explanationEn: 'Camels live in the hot desert.',
    category: 'habitats',
    difficulty: 'easy'
  },

  // 9. Everyday Objects
  {
    id: 'lamp_light',
    itemA: { nameAr: 'مصباح', nameEn: 'Lamp', icon: '🛋️' },
    itemB: { nameAr: 'ضوء', nameEn: 'Light', icon: '💡' },
    explanationAr: 'المصباح يعطينا الضوء لنرى.',
    explanationEn: 'Lamps give us light to see.',
    category: 'daily',
    difficulty: 'medium'
  },
  {
    id: 'pot_ladle',
    itemA: { nameAr: 'قدر طبخ', nameEn: 'Pot', icon: '🍲' },
    itemB: { nameAr: 'مغرفة', nameEn: 'Ladle', icon: '🥄' },
    explanationAr: 'نستخدم المغرفة لسكب الطعام من القدر.',
    explanationEn: 'We use the ladle to scoop food from pots.',
    category: 'tools',
    difficulty: 'advanced'
  },
  {
    id: 'shampoo_hair',
    itemA: { nameAr: 'شامبو', nameEn: 'Shampoo', icon: '🧴' },
    itemB: { nameAr: 'شعر', nameEn: 'Hair', icon: '💇' },
    explanationAr: 'نستخدم الشامبو لغسل شعرنا.',
    explanationEn: 'We use shampoo to wash our hair.',
    category: 'daily',
    difficulty: 'medium'
  },
  {
    id: 'mirror_face',
    itemA: { nameAr: 'مرآة', nameEn: 'Mirror', icon: '🪞' },
    itemB: { nameAr: 'وجه', nameEn: 'Face', icon: '😊' },
    explanationAr: 'ننظر في المرآة لنرى وجوهنا.',
    explanationEn: 'We look in the mirror to see our faces.',
    category: 'daily',
    difficulty: 'medium'
  },
  {
    id: 'backpack_school',
    itemA: { nameAr: 'حقيبة ظهر', nameEn: 'Backpack', icon: '🎒' },
    itemB: { nameAr: 'مدرسة', nameEn: 'School', icon: '🏫' },
    explanationAr: 'نحمل حقيبتنا عندما نذهب للمدرسة.',
    explanationEn: 'We carry backpacks when going to school.',
    category: 'daily',
    difficulty: 'easy'
  },

  // 10. Advanced Logical
  {
    id: 'battery_remote',
    itemA: { nameAr: 'بطارية', nameEn: 'Battery', icon: '🔋' },
    itemB: { nameAr: 'جهاز تحكم', nameEn: 'Remote', icon: '🎮' },
    explanationAr: 'البطارية تشغل أجهزة التحكم والألعاب.',
    explanationEn: 'Batteries power remotes and toys.',
    category: 'tools',
    difficulty: 'advanced'
  },
  {
    id: 'rain_rainbow',
    itemA: { nameAr: 'مطر', nameEn: 'Rain', icon: '🌧️' },
    itemB: { nameAr: 'قوس قزح', nameEn: 'Rainbow', icon: '🌈' },
    explanationAr: 'قوس قزح يظهر بعد سقوط المطر.',
    explanationEn: 'Rainbows appear after it rains.',
    category: 'nature',
    difficulty: 'medium'
  },
  {
    id: 'plug_socket',
    itemA: { nameAr: 'قابس كهرباء', nameEn: 'Plug', icon: '🔌' },
    itemB: { nameAr: 'تلفاز', nameEn: 'Television', icon: '📺' },
    explanationAr: 'نوصل القابس بالكهرباء لتشغيل التلفاز.',
    explanationEn: 'We plug in the TV to turn it on.',
    category: 'tools',
    difficulty: 'advanced'
  },
  {
    id: 'ship_anchor',
    itemA: { nameAr: 'سفينة', nameEn: 'Ship', icon: '🚢' },
    itemB: { nameAr: 'مرساة', nameEn: 'Anchor', icon: '⚓' },
    explanationAr: 'المرساة تثبت السفينة في البحر.',
    explanationEn: 'The anchor holds the ship in place.',
    category: 'parts',
    difficulty: 'advanced'
  },
  {
    id: 'envelope_stamp',
    itemA: { nameAr: 'ظرف رسالة', nameEn: 'Envelope', icon: '✉️' },
    itemB: { nameAr: 'طابع بريد', nameEn: 'Stamp', icon: '🏷️' },
    explanationAr: 'نضع الطابع على الظرف لإرسال الرسالة.',
    explanationEn: 'We put the stamp on the envelope.',
    category: 'daily',
    difficulty: 'advanced'
  },
  {
    id: 'doctor_stethoscope',
    itemA: { nameAr: 'طبيب', nameEn: 'Doctor', icon: '🧑‍⚕️' },
    itemB: { nameAr: 'سماعة طبية', nameEn: 'Stethoscope', icon: '🩺' },
    explanationAr: 'يستخدم الطبيب السماعة لفحص المرضى.',
    explanationEn: 'Doctors use stethoscopes to check patients.',
    category: 'tools',
    difficulty: 'medium'
  },
  {
    id: 'chef_hat',
    itemA: { nameAr: 'طباخ', nameEn: 'Chef', icon: '🧑‍🍳' },
    itemB: { nameAr: 'مقلاة', nameEn: 'Frying Pan', icon: '🍳' },
    explanationAr: 'يستخدم الطباخ المقلاة لطهي الطعام.',
    explanationEn: 'The chef uses a frying pan to cook.',
    category: 'daily',
    difficulty: 'medium'
  },
  {
    id: 'astronaut_rocket',
    itemA: { nameAr: 'رائد فضاء', nameEn: 'Astronaut', icon: '👨‍🚀' },
    itemB: { nameAr: 'صاروخ', nameEn: 'Rocket', icon: '🚀' },
    explanationAr: 'رائد الفضاء يركب الصاروخ للذهاب للفضاء.',
    explanationEn: 'The astronaut rides the rocket to space.',
    category: 'tools',
    difficulty: 'advanced'
  },
  {
    id: 'honey_pancake',
    itemA: { nameAr: 'عسل', nameEn: 'Honey', icon: '🍯' },
    itemB: { nameAr: 'فطائر', nameEn: 'Pancakes', icon: '🥞' },
    explanationAr: 'نضع العسل اللذيذ فوق الفطائر.',
    explanationEn: 'We put delicious honey on pancakes.',
    category: 'food',
    difficulty: 'easy'
  },
  {
    id: 'bat_night',
    itemA: { nameAr: 'خفاش', nameEn: 'Bat', icon: '🦇' },
    itemB: { nameAr: 'كهف', nameEn: 'Cave', icon: '⛰️' },
    explanationAr: 'الخفاش ينام في الكهوف المظلمة.',
    explanationEn: 'Bats sleep in dark caves.',
    category: 'habitats',
    difficulty: 'medium'
  },
  {
    id: 'tooth_dentist',
    itemA: { nameAr: 'سن', nameEn: 'Tooth', icon: '🦷' },
    itemB: { nameAr: 'طبيب أسنان', nameEn: 'Dentist', icon: '🩺' }, // Stethoscope reused, let's change to something else
    explanationAr: 'طبيب الأسنان يعالج أسناننا.',
    explanationEn: 'The dentist treats our teeth.',
    category: 'daily',
    difficulty: 'easy'
  },
  {
    id: 'owl_moon',
    itemA: { nameAr: 'بومة', nameEn: 'Owl', icon: '🦉' },
    itemB: { nameAr: 'ليل', nameEn: 'Night', icon: '🌃' },
    explanationAr: 'البومة طائر ينشط في الليل.',
    explanationEn: 'Owls are active during the night.',
    category: 'nature',
    difficulty: 'medium'
  }
];
