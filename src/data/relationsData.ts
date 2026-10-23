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
  // 1. Tools & Uses (20 pairs)
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
  {
    id: 'scissors_paper',
    itemA: { nameAr: 'مقص', nameEn: 'Scissors', icon: '✂️' },
    itemB: { nameAr: 'ورق مقوى', nameEn: 'Cardboard', icon: '📑' },
    explanationAr: 'المقص يستخدم لقص الأوراق والورق المقوى.',
    explanationEn: 'Scissors are used to cut paper and craft sheets.',
    category: 'tools',
    difficulty: 'easy'
  },
  {
    id: 'screwdriver_screw',
    itemA: { nameAr: 'مفك براغي', nameEn: 'Screwdriver', icon: '🪛' },
    itemB: { nameAr: 'برغي', nameEn: 'Screw', icon: '⚙️' },
    explanationAr: 'المفك ينشط لربط البراغي وتثبيتها.',
    explanationEn: 'Screwdrivers turn screws to fasten parts.',
    category: 'tools',
    difficulty: 'medium'
  },
  {
    id: 'axe_tree',
    itemA: { nameAr: 'فأس', nameEn: 'Axe', icon: '🪓' },
    itemB: { nameAr: 'جذع خشبي', nameEn: 'Wooden Log', icon: '🪵' },
    explanationAr: 'الفأس أداة لتقطيع جذوع الخشب.',
    explanationEn: 'Axes are tools used for chopping wooden logs.',
    category: 'tools',
    difficulty: 'advanced'
  },
  {
    id: 'wrench_bolt',
    itemA: { nameAr: 'مفتاح ربط', nameEn: 'Wrench', icon: '🔧' },
    itemB: { nameAr: 'صامولة', nameEn: 'Nut & Bolt', icon: '🔩' },
    explanationAr: 'مفتاح الربط يشد الصواميل في الأنابيب والآلات.',
    explanationEn: 'Wrenches tighten nuts and bolts on machinery.',
    category: 'tools',
    difficulty: 'advanced'
  },
  {
    id: 'compass_map',
    itemA: { nameAr: 'بوصلة', nameEn: 'Compass', icon: '🧭' },
    itemB: { nameAr: 'خريطة', nameEn: 'Map', icon: '🗺️' },
    explanationAr: 'البوصلة والخريطة تحددان الاتجاهات والمواقع.',
    explanationEn: 'Compasses and maps help determine navigation directions.',
    category: 'tools',
    difficulty: 'medium'
  },
  {
    id: 'telescope_stars',
    itemA: { nameAr: 'منظار الفضاء', nameEn: 'Telescope', icon: '🔭' },
    itemB: { nameAr: 'كواكب ونجوم', nameEn: 'Planets', icon: '🪐' },
    explanationAr: 'التلسكوب يسمح بمراقبة النجوم والكواكب البعيدة.',
    explanationEn: 'Telescopes allow scientists to observe distant stars.',
    category: 'tools',
    difficulty: 'medium'
  },
  {
    id: 'microscope_cell',
    itemA: { nameAr: 'مجهر', nameEn: 'Microscope', icon: '🔬' },
    itemB: { nameAr: 'عينة صغرى', nameEn: 'Micro Sample', icon: '🦠' },
    explanationAr: 'المجهر يكبر الأجسام الدقيقة غير المرئية بالعين.',
    explanationEn: 'Microscopes magnify tiny organisms invisible to the eye.',
    category: 'tools',
    difficulty: 'advanced'
  },
  {
    id: 'shovel_dirt',
    itemA: { nameAr: 'مجرفة', nameEn: 'Shovel', icon: '🪏' },
    itemB: { nameAr: 'تربة زراعية', nameEn: 'Soil', icon: '🌱' },
    explanationAr: 'المجرفة تحفر التربة لغرس النباتات.',
    explanationEn: 'Shovels dig into soil to plant flowers.',
    category: 'tools',
    difficulty: 'easy'
  },
  {
    id: 'watering_can_plant',
    itemA: { nameAr: 'مرشة ماء', nameEn: 'Watering Can', icon: '🪴' },
    itemB: { nameAr: 'شتلة زهر', nameEn: 'Sprout', icon: '🌿' },
    explanationAr: 'نستخدم مرشة الماء لسقي النباتات في الحديقة.',
    explanationEn: 'We use watering cans to hydrate garden plants.',
    category: 'tools',
    difficulty: 'easy'
  },
  {
    id: 'ladder_roof',
    itemA: { nameAr: 'سلم', nameEn: 'Ladder', icon: '🪜' },
    itemB: { nameAr: 'سقف مرتفع', nameEn: 'Roof', icon: '🏠' },
    explanationAr: 'السلم يساعدنا على الصعود للأماكن المرتفعة.',
    explanationEn: 'Ladders allow us to reach high roofs safely.',
    category: 'tools',
    difficulty: 'easy'
  },
  {
    id: 'ruler_line',
    itemA: { nameAr: 'مسطرة', nameEn: 'Ruler', icon: '📏' },
    itemB: { nameAr: 'خط مستقيم', nameEn: 'Straight Line', icon: '✏️' },
    explanationAr: 'المسطرة تقيس الأطوال وتساعد في رسم خطوط مستقيمة.',
    explanationEn: 'Rulers measure length and draw straight lines.',
    category: 'tools',
    difficulty: 'easy'
  },
  {
    id: 'camera_photo',
    itemA: { nameAr: 'كاميرا', nameEn: 'Camera', icon: '📷' },
    itemB: { nameAr: 'صورة تذكارية', nameEn: 'Photograph', icon: '🖼️' },
    explanationAr: 'الكاميرا تلتقط الصور الجميلة للحظاتنا السعيدة.',
    explanationEn: 'Cameras capture beautiful photos of our memories.',
    category: 'tools',
    difficulty: 'easy'
  },
  {
    id: 'flashlight_dark',
    itemA: { nameAr: 'كشاف جيب', nameEn: 'Flashlight', icon: '🔦' },
    itemB: { nameAr: 'طريق مظلم', nameEn: 'Dark Path', icon: '🌑' },
    explanationAr: 'الكشاف يضيء عتمة الطريق في الظلام.',
    explanationEn: 'Flashlights illuminate dark paths at night.',
    category: 'tools',
    difficulty: 'easy'
  },
  {
    id: 'scale_weight',
    itemA: { nameAr: 'ميزان', nameEn: 'Scale', icon: '⚖️' },
    itemB: { nameAr: 'أثقال وأوزان', nameEn: 'Weights', icon: '🏋️' },
    explanationAr: 'الميزان يقيس أوزان الأشياء والكتل بدقة.',
    explanationEn: 'Scales measure weight and mass accurately.',
    category: 'tools',
    difficulty: 'medium'
  },
  {
    id: 'thermometer_fever',
    itemA: { nameAr: 'مقياس حرارة', nameEn: 'Thermometer', icon: '🌡️' },
    itemB: { nameAr: 'درجة حرارة', nameEn: 'Temperature', icon: '☀️' },
    explanationAr: 'مقياس الحرارة يقيس درجة حرارة الجسم والجو.',
    explanationEn: 'Thermometers gauge body and weather temperature.',
    category: 'tools',
    difficulty: 'medium'
  },

  // 2. Complementary & Daily Life (20 pairs)
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
  {
    id: 'cup_saucer',
    itemA: { nameAr: 'فنجان', nameEn: 'Tea Cup', icon: '☕' },
    itemB: { nameAr: 'صحن صغير', nameEn: 'Saucer', icon: '🍽️' },
    explanationAr: 'نضع فنجان الشاي فوق الصحن الصغير.',
    explanationEn: 'Tea cups rest securely on matching saucers.',
    category: 'daily',
    difficulty: 'easy'
  },
  {
    id: 'bow_arrow',
    itemA: { nameAr: 'قوس الرماية', nameEn: 'Bow', icon: '🏹' },
    itemB: { nameAr: 'سهم', nameEn: 'Arrow', icon: '🎯' },
    explanationAr: 'القوس يطلق السهم نحو الهدف المحدد.',
    explanationEn: 'The bow launches the arrow toward the target.',
    category: 'daily',
    difficulty: 'medium'
  },
  {
    id: 'comb_hair',
    itemA: { nameAr: 'مشط', nameEn: 'Comb', icon: '🪮' },
    itemB: { nameAr: 'شعر ناعم', nameEn: 'Hair', icon: '💇' },
    explanationAr: 'نستخدم المشط لتسريح شعرنا وترتيبه.',
    explanationEn: 'We use a comb to style and groom hair.',
    category: 'daily',
    difficulty: 'easy'
  },
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
  {
    id: 'chair_table',
    itemA: { nameAr: 'كرسي', nameEn: 'Chair', icon: '🪑' },
    itemB: { nameAr: 'طاولة', nameEn: 'Desk', icon: '🪵' },
    explanationAr: 'نجلس على الكرسي بجانب الطاولة للكتابة أو الأكل.',
    explanationEn: 'We sit on a chair by the desk to study or eat.',
    category: 'daily',
    difficulty: 'easy'
  },
  {
    id: 'needle_syringe',
    itemA: { nameAr: 'حقنة طبية', nameEn: 'Syringe', icon: '💉' },
    itemB: { nameAr: 'دواء شافي', nameEn: 'Medicine', icon: '💊' },
    explanationAr: 'الطبيب يعطي الحقنة والمصل للوقاية والعلاج.',
    explanationEn: 'Medical syringes deliver medicine for recovery.',
    category: 'daily',
    difficulty: 'advanced'
  },
  {
    id: 'broom_dustpan',
    itemA: { nameAr: 'مكنسة', nameEn: 'Broom', icon: '🧹' },
    itemB: { nameAr: 'جاروف', nameEn: 'Dustpan', icon: '🗑️' },
    explanationAr: 'نجمع الأتربة بالمكنسة ونرفعها بالجاروف.',
    explanationEn: 'Brooms sweep dust into dustpans for cleanup.',
    category: 'daily',
    difficulty: 'easy'
  },
  {
    id: 'wallet_money',
    itemA: { nameAr: 'محفظة', nameEn: 'Wallet', icon: '👛' },
    itemB: { nameAr: 'نقود', nameEn: 'Coins & Money', icon: '🪙' },
    explanationAr: 'نحفظ النقود والعملات داخل المحفظة.',
    explanationEn: 'Wallets hold cash and coins organized.',
    category: 'daily',
    difficulty: 'easy'
  },
  {
    id: 'earphone_music',
    itemA: { nameAr: 'سماعات أذن', nameEn: 'Headphones', icon: '🎧' },
    itemB: { nameAr: 'صوتيات ونغمات', nameEn: 'Audio', icon: '🎵' },
    explanationAr: 'نضع السماعات للاستماع للنغمات والأصوات.',
    explanationEn: 'Headphones let us listen to music and audio clearly.',
    category: 'daily',
    difficulty: 'easy'
  },
  {
    id: 'bucket_mop',
    itemA: { nameAr: 'دلو تنظيف', nameEn: 'Bucket', icon: '🪣' },
    itemB: { nameAr: 'ممسحة أرضيات', nameEn: 'Mop', icon: '🧽' },
    explanationAr: 'نملأ الدلو بالماء لتغسيل الممسحة وتنظيف الأرضية.',
    explanationEn: 'Buckets hold water for mops to wash floors.',
    category: 'daily',
    difficulty: 'easy'
  },
  {
    id: 'hanger_closet',
    itemA: { nameAr: 'شماعة ملابس', nameEn: 'Clothes Hanger', icon: '🪝' },
    itemB: { nameAr: 'خزانة ملابس', nameEn: 'Wardrobe', icon: '🚪' },
    explanationAr: 'نعلق الثياب بالشماعة داخل الخزانة.',
    explanationEn: 'Hangers organize clothes inside the wardrobe.',
    category: 'daily',
    difficulty: 'medium'
  },

  // 3. Animals & Habitats (18 pairs)
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
  {
    id: 'frog_pond',
    itemA: { nameAr: 'ضفدع', nameEn: 'Frog', icon: '🐸' },
    itemB: { nameAr: 'بركة ماء', nameEn: 'Pond', icon: '🪷' },
    explanationAr: 'الضفدع يقفز ويعيش قرب برك المياه.',
    explanationEn: 'Frogs leap and live around freshwater ponds.',
    category: 'habitats',
    difficulty: 'easy'
  },
  {
    id: 'bear_cave',
    itemA: { nameAr: 'دب', nameEn: 'Bear', icon: '🐻' },
    itemB: { nameAr: 'كهف جبال', nameEn: 'Cave', icon: '⛰️' },
    explanationAr: 'الدب يتخذ الكهف مأوى للنوم والسبات.',
    explanationEn: 'Bears take shelter inside mountain caves.',
    category: 'habitats',
    difficulty: 'medium'
  },
  {
    id: 'polar_bear_ice',
    itemA: { nameAr: 'دب قطبي', nameEn: 'Polar Bear', icon: '🧊' },
    itemB: { nameAr: 'جليد قطبي', nameEn: 'Arctic Ice', icon: '❄️' },
    explanationAr: 'الدب القطبي يعيش فوق المساحات الثلجية.',
    explanationEn: 'Polar bears live on icy Arctic plains.',
    category: 'habitats',
    difficulty: 'medium'
  },
  {
    id: 'beaver_dam',
    itemA: { nameAr: 'قندس', nameEn: 'Beaver', icon: '🦫' },
    itemB: { nameAr: 'سد خشب', nameEn: 'Wooden Dam', icon: '🪵' },
    explanationAr: 'القندس يبني سدوداً خشبية في النهر.',
    explanationEn: 'Beavers construct wooden dams in rivers.',
    category: 'habitats',
    difficulty: 'advanced'
  },
  {
    id: 'ant_anthill',
    itemA: { nameAr: 'نملة', nameEn: 'Ant', icon: '🐜' },
    itemB: { nameAr: 'قرية النمل', nameEn: 'Anthill', icon: '🪨' },
    explanationAr: 'النمل يبني بيوته تحت التراب بشكل قرى منظم.',
    explanationEn: 'Ants build organized colonies under the dirt.',
    category: 'habitats',
    difficulty: 'medium'
  },
  {
    id: 'kangaroo_pouch',
    itemA: { nameAr: 'كنغر', nameEn: 'Kangaroo', icon: '🦘' },
    itemB: { nameAr: 'جيب الكنغر', nameEn: 'Pouch', icon: '👶' },
    explanationAr: 'صغير الكنغر يختبئ وينام داخل جيب أمه.',
    explanationEn: 'Baby kangaroos rest safely inside their mothers pouch.',
    category: 'animals',
    difficulty: 'medium'
  },
  {
    id: 'chameleon_tree',
    itemA: { nameAr: 'حرباء', nameEn: 'Chameleon', icon: '🦎' },
    itemB: { nameAr: 'غصن ملون', nameEn: 'Tree Branch', icon: '🌿' },
    explanationAr: 'الحرباء تغير لونها ليتطابق مع أوراق الشجر.',
    explanationEn: 'Chameleons change color to blend with tree branches.',
    category: 'animals',
    difficulty: 'advanced'
  },
  {
    id: 'bat_night',
    itemA: { nameAr: 'خفاش', nameEn: 'Bat', icon: '🦇' },
    itemB: { nameAr: 'كهف مظلم', nameEn: 'Dark Cave', icon: '🌃' },
    explanationAr: 'الخفاش ينشط ليلاً وينام نهاراً في الكهف.',
    explanationEn: 'Bats fly at night and rest in caves by day.',
    category: 'habitats',
    difficulty: 'medium'
  },

  // 4. Source & Products (18 pairs)
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
  {
    id: 'bee_honey',
    itemA: { nameAr: 'خلية نحل', nameEn: 'Beehive', icon: '🐝' },
    itemB: { nameAr: 'برطمان عسل', nameEn: 'Honey Jar', icon: '🍯' },
    explanationAr: 'النحل ينتج لنا العسل الطبيعي الشافي.',
    explanationEn: 'Bees make natural honey in hives.',
    category: 'products',
    difficulty: 'easy'
  },
  {
    id: 'cocoa_chocolate',
    itemA: { nameAr: 'ثمار الكاكاو', nameEn: 'Cocoa', icon: '🫘' },
    itemB: { nameAr: 'شوكولاتة', nameEn: 'Chocolate', icon: '🍫' },
    explanationAr: 'نصنع الشوكولاتة من حبوب الكاكاو.',
    explanationEn: 'Chocolate is made from roasted cocoa beans.',
    category: 'products',
    difficulty: 'medium'
  },
  {
    id: 'olive_oil',
    itemA: { nameAr: 'غصن زيتون', nameEn: 'Olive Branch', icon: '🫒' },
    itemB: { nameAr: 'زيت زيتون', nameEn: 'Olive Oil', icon: '🫗' },
    explanationAr: 'نعصر حبات الزيتون لاستخراج زيت الزيتون الصحّي.',
    explanationEn: 'Olives are pressed to extract healthy olive oil.',
    category: 'products',
    difficulty: 'medium'
  },
  {
    id: 'grape_juice',
    itemA: { nameAr: 'عنقود عنب', nameEn: 'Grapes', icon: '🍇' },
    itemB: { nameAr: 'كأس عصير', nameEn: 'Grape Juice', icon: '🧃' },
    explanationAr: 'نعصر العنب الطازج لنحصل على العصير اللذيذ.',
    explanationEn: 'Fresh grapes are squeezed to make sweet juice.',
    category: 'products',
    difficulty: 'easy'
  },
  {
    id: 'silkworm_silk',
    itemA: { nameAr: 'دودة القز', nameEn: 'Silkworm', icon: '🐛' },
    itemB: { nameAr: 'قماش حرير', nameEn: 'Silk Fabric', icon: '👗' },
    explanationAr: 'دودة القز تصنع خيوط الحرير النظيفة.',
    explanationEn: 'Silkworms spin threads to weave fine silk.',
    category: 'products',
    difficulty: 'advanced'
  },
  {
    id: 'rubber_tire',
    itemA: { nameAr: 'شجرة المطاط', nameEn: 'Rubber Tree', icon: '🪵' },
    itemB: { nameAr: 'إطار مطاطي', nameEn: 'Tire', icon: '🛞' },
    explanationAr: 'المطاط الطبيعي يستخرج من الأشجار لصنع الإطارات.',
    explanationEn: 'Natural rubber comes from tree sap to manufacture tires.',
    category: 'products',
    difficulty: 'advanced'
  },
  {
    id: 'orange_juice',
    itemA: { nameAr: 'برتقالة', nameEn: 'Orange', icon: '🍊' },
    itemB: { nameAr: 'عصير برتقال', nameEn: 'Orange Juice', icon: '🍹' },
    explanationAr: 'نعصر البرتقال لنحصل على عصير مفعم بفيتامين ج.',
    explanationEn: 'Oranges are squeezed for fresh Vitamin C juice.',
    category: 'products',
    difficulty: 'easy'
  },
  {
    id: 'clay_pot',
    itemA: { nameAr: 'طين', nameEn: 'Clay', icon: '🧱' },
    itemB: { nameAr: 'إناء فخاري', nameEn: 'Pottery', icon: '🏺' },
    explanationAr: 'يشكل الحرفي الفخار والأواني من الطين.',
    explanationEn: 'Potters mold clay to make ceramic pots.',
    category: 'products',
    difficulty: 'medium'
  },
  {
    id: 'cotton_shirt',
    itemA: { nameAr: 'زهرة القطن', nameEn: 'Cotton Plant', icon: '☁️' },
    itemB: { nameAr: 'قميص قطني', nameEn: 'Cotton Shirt', icon: '👕' },
    explanationAr: 'نغزل زهور القطن لصناعة قمصان مريحة.',
    explanationEn: 'Cotton plants provide fibers to sew soft t-shirts.',
    category: 'products',
    difficulty: 'medium'
  },
  {
    id: 'sugarcane_sugar',
    itemA: { nameAr: 'قصب السكر', nameEn: 'Sugarcane', icon: '🎋' },
    itemB: { nameAr: 'مكعبات سكر', nameEn: 'Sugar Cubes', icon: '🧊' },
    explanationAr: 'نستخرج السكر الحلو من نبات قصب السكر.',
    explanationEn: 'Sweet sugar is extracted from sugarcane plants.',
    category: 'products',
    difficulty: 'medium'
  },
  {
    id: 'palm_dates',
    itemA: { nameAr: 'شجرة النخيل', nameEn: 'Palm Tree', icon: '🌴' },
    itemB: { nameAr: 'طبق تمر', nameEn: 'Dates', icon: '🫐' },
    explanationAr: 'النخيل يعطينا التمر المغذي واللذيذ.',
    explanationEn: 'Palm trees produce nutritious dates.',
    category: 'products',
    difficulty: 'easy'
  },
  {
    id: 'sand_glass',
    itemA: { nameAr: 'رمال الشاطئ', nameEn: 'Sand', icon: '🏖️' },
    itemB: { nameAr: 'كأس زجاجي', nameEn: 'Glassware', icon: '🫗' },
    explanationAr: 'الزجاج يصنع بصهر الرمال في درجات حرارة عالية جداً.',
    explanationEn: 'Glass is created by melting pure silica sand at high heat.',
    category: 'products',
    difficulty: 'advanced'
  },
  {
    id: 'coffee_beans_cup',
    itemA: { nameAr: 'حبوب القهوة', nameEn: 'Coffee Beans', icon: '🫘' },
    itemB: { nameAr: 'كوب قهوة', nameEn: 'Coffee Cup', icon: '☕' },
    explanationAr: 'نطحن حبوب القهوة لإعداد مشروب القهوة.',
    explanationEn: 'Coffee beans are ground to brew warm coffee.',
    category: 'products',
    difficulty: 'medium'
  },

  // 5. Part & Whole (15 pairs)
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
  {
    id: 'tree_leaf',
    itemA: { nameAr: 'شجرة كبيرة', nameEn: 'Tree', icon: '🌳' },
    itemB: { nameAr: 'ورقة شجر', nameEn: 'Leaf', icon: '🍃' },
    explanationAr: 'الأوراق الخضراء تنمو على أغصان الشجرة.',
    explanationEn: 'Green leaves grow on tree branches.',
    category: 'parts',
    difficulty: 'easy'
  },
  {
    id: 'flower_petal',
    itemA: { nameAr: 'زهور', nameEn: 'Flower', icon: '🌺' },
    itemB: { nameAr: 'بتلة ملونة', nameEn: 'Petal', icon: '🌸' },
    explanationAr: 'البتلة الملونة جزء جميل من أجزاء الزهرة.',
    explanationEn: 'Petals are colorful parts of the flower.',
    category: 'parts',
    difficulty: 'easy'
  },
  {
    id: 'face_eye',
    itemA: { nameAr: 'وجه إنسان', nameEn: 'Face', icon: '😊' },
    itemB: { nameAr: 'عين', nameEn: 'Eye', icon: '👁️' },
    explanationAr: 'العين جزء ينير وجهنا ونرى به العالم.',
    explanationEn: 'Eyes are part of our face that allow us to see.',
    category: 'parts',
    difficulty: 'easy'
  },
  {
    id: 'bird_wing',
    itemA: { nameAr: 'طائر', nameEn: 'Bird', icon: '🦅' },
    itemB: { nameAr: 'جناح', nameEn: 'Wing', icon: '🪶' },
    explanationAr: 'الجناح يساعد الطائر على التحليق في الجو.',
    explanationEn: 'Wings enable birds to soar in the sky.',
    category: 'parts',
    difficulty: 'easy'
  },
  {
    id: 'bicycle_pedal',
    itemA: { nameAr: 'دراجة', nameEn: 'Bicycle', icon: '🚲' },
    itemB: { nameAr: 'دواسة', nameEn: 'Pedal', icon: '⚙️' },
    explanationAr: 'نضغط على الدواسة لتحريك عجلة الدراجة.',
    explanationEn: 'Pedals are pushed to drive bicycle wheels.',
    category: 'parts',
    difficulty: 'medium'
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
    id: 'computer_screen',
    itemA: { nameAr: 'حاسوب مكتبي', nameEn: 'Desktop PC', icon: '🖥️' },
    itemB: { nameAr: 'شاشة عرض', nameEn: 'Monitor Screen', icon: '📺' },
    explanationAr: 'الشاشة تعرض لنا المحتوى والمعلومات من الحاسوب.',
    explanationEn: 'Monitors display visual information from computers.',
    category: 'parts',
    difficulty: 'medium'
  },
  {
    id: 'guitar_string',
    itemA: { nameAr: 'قيثارة', nameEn: 'Guitar', icon: '🎸' },
    itemB: { nameAr: 'أوتار القيثارة', nameEn: 'Guitar Strings', icon: '🎼' },
    explanationAr: 'الأوتار تصدر النغمات عند العزف على القيثارة.',
    explanationEn: 'Strings produce sounds when playing guitar.',
    category: 'parts',
    difficulty: 'medium'
  },
  {
    id: 'foot_toes',
    itemA: { nameAr: 'قدم', nameEn: 'Foot', icon: '🦶' },
    itemB: { nameAr: 'أصابع القدم', nameEn: 'Toes', icon: '👣' },
    explanationAr: 'أصابع القدم تساعدنا على التوازن أثناء المشي.',
    explanationEn: 'Toes help us maintain balance while walking.',
    category: 'parts',
    difficulty: 'easy'
  },
  {
    id: 'castle_tower',
    itemA: { nameAr: 'قلعة', nameEn: 'Castle', icon: '🏰' },
    itemB: { nameAr: 'برج القلعة', nameEn: 'Tower', icon: '🗼' },
    explanationAr: 'البرج بناء مرتفع يمثل جزءاً شامخاً من القلعة.',
    explanationEn: 'Towers are soaring features of castles.',
    category: 'parts',
    difficulty: 'medium'
  },

  // 6. Nature & Environment (14 pairs)
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
    id: 'volcano_lava',
    itemA: { nameAr: 'بركان', nameEn: 'Volcano', icon: '🌋' },
    itemB: { nameAr: 'حمم منصهرة', nameEn: 'Lava', icon: '🔥' },
    explanationAr: 'البركان يطلق الحمم المنصهرة عند ثورانه.',
    explanationEn: 'Volcanoes spew hot molten lava during eruption.',
    category: 'nature',
    difficulty: 'advanced'
  },
  {
    id: 'desert_oasis',
    itemA: { nameAr: 'صحراء رملية', nameEn: 'Desert', icon: '🏜️' },
    itemB: { nameAr: 'واحة خضراء', nameEn: 'Oasis', icon: '🌴' },
    explanationAr: 'الواحة منطقة خضراء تحتوي ماء ونخيل في وسط الصحراء.',
    explanationEn: 'Oases provide water and greenery amidst dry deserts.',
    category: 'nature',
    difficulty: 'medium'
  },
  {
    id: 'river_waterfall',
    itemA: { nameAr: 'نهر جارٍ', nameEn: 'River', icon: '🏞️' },
    itemB: { nameAr: 'شلال مياه', nameEn: 'Waterfall', icon: '🌊' },
    explanationAr: 'الشلال ينحدر عندما يصب النهر من مرتفع جلي.',
    explanationEn: 'Waterfalls cascade where rivers drop over high cliffs.',
    category: 'nature',
    difficulty: 'medium'
  },
  {
    id: 'wind_windmill',
    itemA: { nameAr: 'رياح', nameEn: 'Wind', icon: '🌬️' },
    itemB: { nameAr: 'طاحونة هواء', nameEn: 'Windmill', icon: '🌪️' },
    explanationAr: 'الرياح تحرك مراوح الطاحونة لتوليد الطاقة.',
    explanationEn: 'Wind spins windmill blades to generate power.',
    category: 'nature',
    difficulty: 'medium'
  },
  {
    id: 'autumn_leaves',
    itemA: { nameAr: 'فصل الخريف', nameEn: 'Autumn', icon: '🍁' },
    itemB: { nameAr: 'أوراق متساقطة', nameEn: 'Fallen Leaves', icon: '🍂' },
    explanationAr: 'في فصل الخريف تتساقط أوراق الأشجار الصفراء.',
    explanationEn: 'In autumn, leaves change color and drop from trees.',
    category: 'nature',
    difficulty: 'easy'
  },
  {
    id: 'spring_blossoms',
    itemA: { nameAr: 'فصل الربيع', nameEn: 'Spring', icon: '🌱' },
    itemB: { nameAr: 'زهور متفتحة', nameEn: 'Blossoms', icon: '🌸' },
    explanationAr: 'تتفتح أزهار الحديقة في فصل الربيع البديع.',
    explanationEn: 'Flowers bloom brightly during springtime.',
    category: 'nature',
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
  },
  {
    id: 'wave_surfboard',
    itemA: { nameAr: 'موجة بحر', nameEn: 'Sea Wave', icon: '🌊' },
    itemB: { nameAr: 'لوح ركوب الموج', nameEn: 'Surfboard', icon: '🏄' },
    explanationAr: 'نركب أمواج البحر بواسطة لوح التزلج المائي.',
    explanationEn: 'Surfers catch ocean waves using surfboards.',
    category: 'nature',
    difficulty: 'medium'
  }
];
