export type OppositeCategory =
  | 'size'        // الحجم
  | 'length'      // الطول والارتفاع
  | 'quantity'    // الكمية والامتلاء
  | 'speed'       // السرعة
  | 'temperature' // الحرارة
  | 'light'       // الضوء والرؤية
  | 'state'       // النظافة والحالة والملمس
  | 'direction'   // المكان والاتجاه
  | 'time'        // الزمن والترتيب
  | 'emotions'    // المشاعر والتعبيرات
  | 'weight'      // الوزن والقوة
  | 'actions';    // الأفعال والحالات المتقابلة

export type OppositeDifficulty = 'easy' | 'medium' | 'advanced';

export interface OppositeConcept {
  id: string;
  nameAr: string;
  nameEn: string;
  icon: string;
}

export interface OppositePair {
  id: string;
  category: OppositeCategory;
  difficulty: OppositeDifficulty;
  itemA: OppositeConcept;
  itemB: OppositeConcept;
  contextSentenceAr: string;
  contextSentenceEn: string;
  explanationAr: string;
  explanationEn: string;
}

export const OPPOSITE_CATEGORIES: { id: OppositeCategory; nameAr: string; nameEn: string; icon: string }[] = [
  { id: 'size', nameAr: 'الحجم', nameEn: 'Size', icon: '🐘' },
  { id: 'length', nameAr: 'الطول والارتفاع', nameEn: 'Height & Length', icon: '🦒' },
  { id: 'quantity', nameAr: 'الكمية والامتلاء', nameEn: 'Quantity & Capacity', icon: '🥛' },
  { id: 'speed', nameAr: 'السرعة', nameEn: 'Speed', icon: '🐆' },
  { id: 'temperature', nameAr: 'الحرارة', nameEn: 'Temperature', icon: '🔥' },
  { id: 'light', nameAr: 'الضوء والرؤية', nameEn: 'Light & Vision', icon: '💡' },
  { id: 'state', nameAr: 'الحالة والملمس', nameEn: 'State & Texture', icon: '🧼' },
  { id: 'direction', nameAr: 'المكان والاتجاه', nameEn: 'Direction & Place', icon: '🧭' },
  { id: 'time', nameAr: 'الزمن والترتيب', nameEn: 'Time & Order', icon: '⏰' },
  { id: 'emotions', nameAr: 'المشاعر والتعبيرات', nameEn: 'Emotions & Expressions', icon: '😊' },
  { id: 'weight', nameAr: 'الوزن والقوة', nameEn: 'Weight & Strength', icon: '🪨' },
  { id: 'actions', nameAr: 'الأفعال المتقابلة', nameEn: 'Opposite Actions', icon: '🔄' },
];

export const OPPOSITES_DATA: OppositePair[] = [
  // ==========================================
  // 1. الحجم (Size) - 10 pairs
  // ==========================================
  {
    id: 'size_big_small',
    category: 'size',
    difficulty: 'easy',
    itemA: { id: 'big_elephant', nameAr: 'كبير', nameEn: 'Big', icon: '🐘' },
    itemB: { id: 'small_ant', nameAr: 'صغير', nameEn: 'Small', icon: '🐜' },
    contextSentenceAr: 'الفيل ضخم وكبير، لكن النملة كائن...',
    contextSentenceEn: 'The elephant is big, but the ant is...',
    explanationAr: 'الفيل كبير الحجم والنملة صغيرة الحجم.',
    explanationEn: 'The elephant is large, while the ant is small.'
  },
  {
    id: 'size_huge_tiny',
    category: 'size',
    difficulty: 'medium',
    itemA: { id: 'huge_dino', nameAr: 'ضخم', nameEn: 'Huge', icon: '🦕' },
    itemB: { id: 'tiny_beetle', nameAr: 'ضئيل', nameEn: 'Tiny', icon: '🪲' },
    contextSentenceAr: 'الديناصور كائن ضخم جداً، أما الخنفساء فجسمها...',
    contextSentenceEn: 'The dinosaur is huge, whereas the beetle is...',
    explanationAr: 'الديناصور هائل وضخم، بينما الخنفساء متناهية الصغر وضئيلة.',
    explanationEn: 'The dinosaur is massive, while the beetle is tiny.'
  },
  {
    id: 'size_wide_narrow',
    category: 'size',
    difficulty: 'easy',
    itemA: { id: 'wide_stadium', nameAr: 'واسع', nameEn: 'Wide', icon: '🏟️' },
    itemB: { id: 'narrow_door', nameAr: 'ضيق', nameEn: 'Narrow', icon: '🚪' },
    contextSentenceAr: 'ملعب الكرة فسيح وواسع، بينما ممر البيت...',
    contextSentenceEn: 'The sports stadium is wide, but the hallway is...',
    explanationAr: 'الملعب يتسع لآلاف الناس فهو واسع، والممر ضيق يتسع لشخص واحد.',
    explanationEn: 'The stadium is wide and spacious, while the hallway is narrow.'
  },
  {
    id: 'size_thick_thin',
    category: 'size',
    difficulty: 'medium',
    itemA: { id: 'thick_book', nameAr: 'سميك', nameEn: 'Thick', icon: '📚' },
    itemB: { id: 'thin_paper', nameAr: 'رفيع', nameEn: 'Thin', icon: '📄' },
    contextSentenceAr: 'المعجم كتاب ضخم وسميك، أما الورقة الواحدة فهي...',
    contextSentenceEn: 'The dictionary is thick, while a single sheet is...',
    explanationAr: 'الكتاب يحتوي صفحات كثيرة فهو سميك، والورقة رقيقة ورفيعة.',
    explanationEn: 'The dictionary is thick, while a paper sheet is thin.'
  },
  {
    id: 'size_broad_slim',
    category: 'size',
    difficulty: 'medium',
    itemA: { id: 'broad_highway', nameAr: 'عريض', nameEn: 'Broad', icon: '🛣️' },
    itemB: { id: 'slim_thread', nameAr: 'نحيف', nameEn: 'Slim', icon: '🧵' },
    contextSentenceAr: 'طريق السيارات عريض ويتسع لشاحنات، أما خيط الخياطة فهو...',
    contextSentenceEn: 'The highway is broad, but sewing thread is...',
    explanationAr: 'الطريق السريع عريض المساحة، والخيط نحيف ودقيق.',
    explanationEn: 'The highway is broad, while the thread is slender.'
  },
  {
    id: 'size_giant_mini',
    category: 'size',
    difficulty: 'easy',
    itemA: { id: 'giant_castle', nameAr: 'عملاق', nameEn: 'Giant', icon: '🏰' },
    itemB: { id: 'mini_hut', nameAr: 'قزم', nameEn: 'Miniature', icon: '🛖' },
    contextSentenceAr: 'برج القلعة عملاق ومرتفع، وكوخ الحديقة صغير و...',
    contextSentenceEn: 'The castle is giant, while the garden hut is...',
    explanationAr: 'القلعة عملاقة وكبيرة جداً، والكوخ صغير وقزم.',
    explanationEn: 'The castle is giant, whereas the garden hut is miniature.'
  },
  {
    id: 'size_deep_shallow',
    category: 'size',
    difficulty: 'advanced',
    itemA: { id: 'deep_ocean', nameAr: 'عميق', nameEn: 'Deep', icon: '🌊' },
    itemB: { id: 'shallow_bowl', nameAr: 'ضحل', nameEn: 'Shallow', icon: '🥣' },
    contextSentenceAr: 'مياه المحيط غائرة في الأعماق، أما ماء الطبق فهو...',
    contextSentenceEn: 'The ocean is very deep, but water in a bowl is...',
    explanationAr: 'البحر عميق جداً وله قاع بعيد، بينما الطبق مسطح وضحل الماء.',
    explanationEn: 'The ocean is deep, while the bowl holds shallow water.'
  },
  {
    id: 'size_spacious_cramped',
    category: 'size',
    difficulty: 'advanced',
    itemA: { id: 'spacious_park', nameAr: 'فَسِيح', nameEn: 'Spacious', icon: '🏞️' },
    itemB: { id: 'cramped_box', nameAr: 'مَضْغُوط', nameEn: 'Cramped', icon: '📦' },
    contextSentenceAr: 'الحديقة خضراء وفضاء فسيح، لكن داخل الصندوق مكان...',
    contextSentenceEn: 'The park is wide and spacious, but inside the box is...',
    explanationAr: 'المتنزه فسيح ومريح للحركة، وداخل الصندوق مضغوط ومزدحم.',
    explanationEn: 'The open park is spacious, while inside the box is cramped.'
  },
  {
    id: 'size_expanded_contracted',
    category: 'size',
    difficulty: 'advanced',
    itemA: { id: 'expanded_balloon', nameAr: 'مُنْتَفِخ', nameEn: 'Inflated', icon: '🎈' },
    itemB: { id: 'contracted_balloon', nameAr: 'مُنْكَمِش', nameEn: 'Deflated', icon: '🥀' },
    contextSentenceAr: 'البالون المنفوخ كبير ومنتفخ، والبالون المفرغ صغير و...',
    contextSentenceEn: 'An inflated balloon is blown up, while an empty one is...',
    explanationAr: 'الهواء يجعل البالون منتفخاً، وخروج الهواء يجعله منكمشاً.',
    explanationEn: 'Air expands the balloon, while losing air deflates it.'
  },
  {
    id: 'size_plump_lean',
    category: 'size',
    difficulty: 'medium',
    itemA: { id: 'plump_bear', nameAr: 'ممتلئ', nameEn: 'Plump', icon: '🐻' },
    itemB: { id: 'lean_cricket', nameAr: 'نحيل', nameEn: 'Slender', icon: '🦗' },
    contextSentenceAr: 'الدب الشتوي سمين وممتلئ الجسم، والصرصور كائن...',
    contextSentenceEn: 'The polar bear is plump, whereas the insect is...',
    explanationAr: 'جسم الدب ممتلئ ومكتنز، وجسم الحشرة نحيل ودقيق.',
    explanationEn: 'The bear has a plump build, while the insect is slender.'
  },

  // ==========================================
  // 2. الطول والارتفاع (Length & Height) - 10 pairs
  // ==========================================
  {
    id: 'length_tall_short',
    category: 'length',
    difficulty: 'easy',
    itemA: { id: 'tall_giraffe', nameAr: 'طويل', nameEn: 'Tall', icon: '🦒' },
    itemB: { id: 'short_penguin', nameAr: 'قصير', nameEn: 'Short', icon: '🐧' },
    contextSentenceAr: 'الزرافة رقبتها وقامتها طويلة، لكن البطريق طائر...',
    contextSentenceEn: 'The giraffe is tall, but the penguin is...',
    explanationAr: 'الزرافة طويلة القامة والبطريق قصير القامة.',
    explanationEn: 'The giraffe is tall, and the penguin is short.'
  },
  {
    id: 'length_high_low',
    category: 'length',
    difficulty: 'easy',
    itemA: { id: 'high_mountain', nameAr: 'مرتفع', nameEn: 'High', icon: '⛰️' },
    itemB: { id: 'low_valley', nameAr: 'منخفض', nameEn: 'Low', icon: '🏜️' },
    contextSentenceAr: 'قمة الجبل في مكان مرتفع، والوادي في مكان...',
    contextSentenceEn: 'The mountain peak is high, but the desert valley is...',
    explanationAr: 'الجبل يعلو نحو السماء فهو مرتفع، والوادي منبسط ومنخفض.',
    explanationEn: 'The mountain peak is high, and the valley floor is low.'
  },
  {
    id: 'length_long_rope_short',
    category: 'length',
    difficulty: 'easy',
    itemA: { id: 'long_rope', nameAr: 'حبل طويل', nameEn: 'Long Rope', icon: '🪢' },
    itemB: { id: 'short_thread', nameAr: 'خيط قصير', nameEn: 'Short Thread', icon: '🧵' },
    contextSentenceAr: 'حبل التسلق طويل جداً، أما قطعة الخيط فهِي...',
    contextSentenceEn: 'The climbing rope is long, while the cut string is...',
    explanationAr: 'حبل التسلق ممتد وطويل، وخيط الإبرة قصير.',
    explanationEn: 'The climbing rope is long, while the sewing thread is short.'
  },
  {
    id: 'length_towering_flat',
    category: 'length',
    difficulty: 'medium',
    itemA: { id: 'towering_eiffel', nameAr: 'شاهق', nameEn: 'Towering', icon: '🗼' },
    itemB: { id: 'flat_mat', nameAr: 'مسطح', nameEn: 'Flat', icon: '🏓' },
    contextSentenceAr: 'برج الاتصالات بناء شاهق، وبساط الأرض مفرود و...',
    contextSentenceEn: 'The telecom tower is towering, whereas the play mat is...',
    explanationAr: 'البرج شاهق الارتفاع، والبساط مسطح على الأرض.',
    explanationEn: 'The tower is soaring high, while the play mat is completely flat.'
  },
  {
    id: 'length_long_pencil_short',
    category: 'length',
    difficulty: 'easy',
    itemA: { id: 'long_pencil', nameAr: 'قلم طويل', nameEn: 'Long Pencil', icon: '✏️' },
    itemB: { id: 'short_crayon', nameAr: 'قلم قصير', nameEn: 'Short Crayon', icon: '🖍️' },
    contextSentenceAr: 'قلم الرصاص الجديد طويل، وقلم التلوين المستعمل صار...',
    contextSentenceEn: 'The brand new pencil is long, but the used crayon became...',
    explanationAr: 'القلم الجديد يحتفظ بطوله، والقلم القديم صار قصيراً بعد البري.',
    explanationEn: 'The new pencil is long, while the worn crayon is short.'
  },
  {
    id: 'length_sky_ground',
    category: 'length',
    difficulty: 'easy',
    itemA: { id: 'sky_high', nameAr: 'سماء عالية', nameEn: 'High Sky', icon: '🌤️' },
    itemB: { id: 'ground_low', nameAr: 'أرض منبسطة', nameEn: 'Low Ground', icon: '🌱' },
    contextSentenceAr: 'السحب تسبح في سماء عالية، والعشب ينبت على أرض...',
    contextSentenceEn: 'Clouds float in the high sky, and grass grows on the low...',
    explanationAr: 'السماء في الأعلى والأرض تحت أقدامنا في الأسفل.',
    explanationEn: 'The sky is up high, and the ground is down low.'
  },
  {
    id: 'length_high_jump_low',
    category: 'length',
    difficulty: 'medium',
    itemA: { id: 'high_jump_kangaroo', nameAr: 'قفزة عالية', nameEn: 'High Jump', icon: '🦘' },
    itemB: { id: 'low_crawl_snail', nameAr: 'زحف منخفض', nameEn: 'Low Crawl', icon: '🐌' },
    contextSentenceAr: 'الكنغر يقفز قفزة عالية، والحلزون يسير بزحف...',
    contextSentenceEn: 'The kangaroo leaps high, while the snail crawls...',
    explanationAr: 'وثبة الكنغر ترتفع في الهواء، وزحف الحلزون ملاصق للأرض.',
    explanationEn: 'The kangaroo jumps high, while the snail crawls low to the earth.'
  },
  {
    id: 'length_peak_base',
    category: 'length',
    difficulty: 'advanced',
    itemA: { id: 'peak_top', nameAr: 'قِمَّة', nameEn: 'Peak', icon: '🏔️' },
    itemB: { id: 'base_bottom', nameAr: 'قَاع', nameEn: 'Base', icon: '🏕️' },
    contextSentenceAr: 'الثلوج تغطي قمة الجبل، والمخيم يقع عند الـ...',
    contextSentenceEn: 'Snow covers the mountain peak, while the camp is at the...',
    explanationAr: 'القمة أعلى نقطة في الجبل، والقاع أو السفح في أسفله.',
    explanationEn: 'The peak is the very top, while the base is at the bottom.'
  },
  {
    id: 'length_long_bridge_short',
    category: 'length',
    difficulty: 'medium',
    itemA: { id: 'long_bridge', nameAr: 'جسر ممتد', nameEn: 'Long Bridge', icon: '🌉' },
    itemB: { id: 'short_plank', nameAr: 'لوح قصير', nameEn: 'Short Plank', icon: '🪵' },
    contextSentenceAr: 'جسر المدينة ممتد وطويل، أما لوح العبور فوق الجدول فهو...',
    contextSentenceEn: 'The bay bridge is very long, while the wooden plank is...',
    explanationAr: 'الجسر يعبر النهر بطول كبير، واللوح الخشبي قصير.',
    explanationEn: 'The bridge spans long distances, while the plank is short.'
  },
  {
    id: 'length_deep_well_surface',
    category: 'length',
    difficulty: 'advanced',
    itemA: { id: 'deep_well', nameAr: 'بئر غائر', nameEn: 'Deep Well', icon: '🕳️' },
    itemB: { id: 'surface_pool', nameAr: 'بركة سطحية', nameEn: 'Surface Pool', icon: '🛶' },
    contextSentenceAr: 'الماء في قاع البئر عميق وغائر، وفي البركة ماء...',
    contextSentenceEn: 'Water in the well is deep down, while in the puddle it is on the...',
    explanationAr: 'البئر يمتد لأعماق الأرض، والبركة ماؤها على السطح فقط.',
    explanationEn: 'The well goes deep down, whereas the puddle stays on the surface.'
  },

  // ==========================================
  // 3. الكمية والامتلاء (Quantity & Capacity) - 10 pairs
  // ==========================================
  {
    id: 'qty_many_few',
    category: 'quantity',
    difficulty: 'easy',
    itemA: { id: 'many_apples', nameAr: 'كثير', nameEn: 'Many', icon: '🍎' },
    itemB: { id: 'few_apple', nameAr: 'قليل', nameEn: 'Few', icon: '🍏' },
    contextSentenceAr: 'سلة الفاكهة فيها تفاح كثير، ولكن بيدي تفاح...',
    contextSentenceEn: 'The harvest basket has many apples, but I hold...',
    explanationAr: 'العدد الكبير يعني كثيراً، والعدد الصغير يعني قليلاً.',
    explanationEn: 'A high count is many, while a single or small count is few.'
  },
  {
    id: 'qty_full_empty',
    category: 'quantity',
    difficulty: 'easy',
    itemA: { id: 'full_milk', nameAr: 'ممتلئ', nameEn: 'Full', icon: '🥛' },
    itemB: { id: 'empty_glass', nameAr: 'فارغ', nameEn: 'Empty', icon: '🫗' },
    contextSentenceAr: 'كأس العصير ممتلئ حتى آخره، والكأس الآخر...',
    contextSentenceEn: 'The juice glass is full, but the other glass is...',
    explanationAr: 'الكأس الذي فيه حليب ممتلئ، والكأس الذي شربناه فارغ.',
    explanationEn: 'The glass holding milk is full, and the poured glass is empty.'
  },
  {
    id: 'qty_crowded_empty',
    category: 'quantity',
    difficulty: 'medium',
    itemA: { id: 'crowded_people', nameAr: 'مزدحم', nameEn: 'Crowded', icon: '👨‍👩‍👧‍👦' },
    itemB: { id: 'solitary_person', nameAr: 'خالٍ', nameEn: 'Deserted', icon: '🧍' },
    contextSentenceAr: 'السوق في العيد مزدحم بالناس، والشارع فجراً هادئ و...',
    contextSentenceEn: 'The festival market is crowded, but the street at dawn is...',
    explanationAr: 'المكان المزدحم مليء بالناس، والمكان الخالي ليس فيه أحد.',
    explanationEn: 'A crowded place is packed with people, while a deserted place is empty.'
  },
  {
    id: 'qty_abundant_scarce',
    category: 'quantity',
    difficulty: 'advanced',
    itemA: { id: 'abundant_wheat', nameAr: 'وافر', nameEn: 'Abundant', icon: '🌾' },
    itemB: { id: 'scarce_leaf', nameAr: 'شحيح', nameEn: 'Scarce', icon: '🍂' },
    contextSentenceAr: 'محصول القمح في الربيع وافر، والماء في الجفاف...',
    contextSentenceEn: 'Wheat during harvest is abundant, while rain during drought is...',
    explanationAr: 'الوافر موجود بكثرة وخير، والشحيح نادر وقليل جداً.',
    explanationEn: 'Abundant means plentiful, while scarce means rare and limited.'
  },
  {
    id: 'qty_all_none',
    category: 'quantity',
    difficulty: 'easy',
    itemA: { id: 'all_moon', nameAr: 'كامل', nameEn: 'All / Whole', icon: '🌕' },
    itemB: { id: 'none_moon', nameAr: 'ناقص', nameEn: 'None / Missing', icon: '🌑' },
    contextSentenceAr: 'القمر ليلة البدر مكتمل وكامل، وفي أول الشهر يبدو...',
    contextSentenceEn: 'The full moon is complete and whole, while in a new moon it is...',
    explanationAr: 'الكامل لا ينقصه شيء، والناقص يفتقد أجزاء منه.',
    explanationEn: 'Whole means complete, while missing or incomplete lacks parts.'
  },
  {
    id: 'qty_heavy_rain_drizzle',
    category: 'quantity',
    difficulty: 'medium',
    itemA: { id: 'heavy_rain', nameAr: 'غزير', nameEn: 'Torrential', icon: '🌧️' },
    itemB: { id: 'light_drizzle', nameAr: 'خفيف', nameEn: 'Drizzle', icon: '💧' },
    contextSentenceAr: 'العاصفة ماؤها غزير جداً، ورذاذ الصباح مطر...',
    contextSentenceEn: 'The storm rain is torrential and heavy, but the morning mist is...',
    explanationAr: 'المطر الغزير ينزل بكميات ضخمة، والرذاذ خفيف وبسيط.',
    explanationEn: 'Heavy rain pours in large volume, while drizzle is light drops.'
  },
  {
    id: 'qty_overflowing_dry',
    category: 'quantity',
    difficulty: 'advanced',
    itemA: { id: 'overflowing_water', nameAr: 'فائض', nameEn: 'Overflowing', icon: '🌊' },
    itemB: { id: 'dry_desert', nameAr: 'جاف', nameEn: 'Dry', icon: '🏜️' },
    contextSentenceAr: 'النهر وقت الفيضان ممتلئ وفائض، بينما رمال الصحراء عطشى و...',
    contextSentenceEn: 'The river during floods is overflowing, but desert sand is...',
    explanationAr: 'الفائض زاد عن طاقته وسال، والجاف لا ماء فيه إطلاقاً.',
    explanationEn: 'Overflowing spills over, while dry has no liquid at all.'
  },
  {
    id: 'qty_cluster_single',
    category: 'quantity',
    difficulty: 'easy',
    itemA: { id: 'cluster_grapes', nameAr: 'عنقود كثير', nameEn: 'Cluster', icon: '🍇' },
    itemB: { id: 'single_cherry', nameAr: 'حبة واحدة', nameEn: 'Single', icon: '🍒' },
    contextSentenceAr: 'عنقود العنب يحتوي حبات كثيرة، والغصن الآخر به حبة...',
    contextSentenceEn: 'A bunch of grapes has many berries, while the branch has a...',
    explanationAr: 'العنقود يضم حبات عديدة مجتمعة، والحبة الواحدة مفردة.',
    explanationEn: 'A cluster consists of many items, while single is just one.'
  },
  {
    id: 'qty_full_box_empty',
    category: 'quantity',
    difficulty: 'easy',
    itemA: { id: 'full_gift_box', nameAr: 'صندوق مليء', nameEn: 'Full Box', icon: '🎁' },
    itemB: { id: 'empty_cardboard', nameAr: 'صندوق خالٍ', nameEn: 'Empty Box', icon: '📦' },
    contextSentenceAr: 'صندوق الهدية مليء بالألعاب، وصندوق الشحن بعد تفريغه صار...',
    contextSentenceEn: 'The present box is filled with toys, but the opened carton is...',
    explanationAr: 'صندوق الهدايا محشو بالألعاب، والكرتون الفارغ ليس بداخله شيء.',
    explanationEn: 'The gift box is filled, while the unpacked box is empty.'
  },
  {
    id: 'qty_increase_decrease',
    category: 'quantity',
    difficulty: 'advanced',
    itemA: { id: 'increase_chart', nameAr: 'زيادة', nameEn: 'Increase', icon: '📈' },
    itemB: { id: 'decrease_chart', nameAr: 'نقصان', nameEn: 'Decrease', icon: '📉' },
    contextSentenceAr: 'درجات الطالب تدل على زيادة وتقدم، بينما الخط الهابط يدل على...',
    contextSentenceEn: 'The rising graph shows an increase, while the downward line shows a...',
    explanationAr: 'الزيادة تعني النمو والكثرة، والنقصان يعني التراجع والقلة.',
    explanationEn: 'Increase means growing more, while decrease means becoming less.'
  },

  // ==========================================
  // 4. السرعة (Speed) - 9 pairs
  // ==========================================
  {
    id: 'speed_fast_slow',
    category: 'speed',
    difficulty: 'easy',
    itemA: { id: 'fast_cheetah', nameAr: 'سريع', nameEn: 'Fast', icon: '🐆' },
    itemB: { id: 'slow_turtle', nameAr: 'بطيء', nameEn: 'Slow', icon: '🐢' },
    contextSentenceAr: 'الفهد يعدو بسرعة فائقة، والسلحفاة حركتها...',
    contextSentenceEn: 'The cheetah sprints fast, but the tortoise walks...',
    explanationAr: 'الفهد أسرع حيوان بري، والسلحفاة تسير ببطء شديد.',
    explanationEn: 'The cheetah moves fast, while the tortoise crawls slowly.'
  },
  {
    id: 'speed_rocket_snail',
    category: 'speed',
    difficulty: 'easy',
    itemA: { id: 'rocket_speed', nameAr: 'صاروخي', nameEn: 'Rocket Fast', icon: '🚀' },
    itemB: { id: 'snail_speed', nameAr: 'حلزوني', nameEn: 'Snail Pace', icon: '🐌' },
    contextSentenceAr: 'انطلاق الصاروخ نحو الفضاء خاطف وسريع، بينما زحف الحلزون...',
    contextSentenceEn: 'The rocket launch is blazing fast, whereas the snail moves at a...',
    explanationAr: 'الصاروخ يشق السماء بسرعة خارقة، والحلزون يقطع السنتيمترات بتأنٍ.',
    explanationEn: 'The rocket travels at extreme speed, while the snail creeps along.'
  },
  {
    id: 'speed_plane_bicycle',
    category: 'speed',
    difficulty: 'medium',
    itemA: { id: 'jet_plane', nameAr: 'طائرة نفاثة', nameEn: 'Jet Airplane', icon: '✈️' },
    itemB: { id: 'slow_bicycle', nameAr: 'دراجة عادية', nameEn: 'Bicycle', icon: '🚲' },
    contextSentenceAr: 'الطائرة تقطع القارات في ساعات لأنها سريعة، أما الدراجة فهي...',
    contextSentenceEn: 'The airplane crosses skies rapidly, while riding a bicycle is...',
    explanationAr: 'الطائرة وسيلة نقل سريعة جداً، والدراجة الهوائية وسيلة بطيئة ورياضية.',
    explanationEn: 'Airplanes travel at high speed, whereas bicycles move at leisurely speed.'
  },
  {
    id: 'speed_run_walk',
    category: 'speed',
    difficulty: 'easy',
    itemA: { id: 'running_person', nameAr: 'ركض سريع', nameEn: 'Running', icon: '🏃' },
    itemB: { id: 'walking_person', nameAr: 'مشي هادئ', nameEn: 'Walking', icon: '🚶' },
    contextSentenceAr: 'في سباق الماراثون يركض اللاعب ركضاً سريعاً، وفي الحديقة نتنزه بـ...',
    contextSentenceEn: 'In a race the athlete runs fast, but in the garden we stroll by...',
    explanationAr: 'الجري يستهلك سرعة ونشاطاً، والمشي حركة هادئة ومريحة.',
    explanationEn: 'Running moves fast, while walking is measured and slower.'
  },
  {
    id: 'speed_lightning_bloom',
    category: 'speed',
    difficulty: 'advanced',
    itemA: { id: 'instant_lightning', nameAr: 'خاطف', nameEn: 'Instant', icon: '⚡' },
    itemB: { id: 'gradual_flower', nameAr: 'تدريجي', nameEn: 'Gradual', icon: '🌸' },
    contextSentenceAr: 'وميض البرق سريع وخاطف في ثانية، وتفتح بتلات الورد أمر...',
    contextSentenceEn: 'A flash of lightning is instant, whereas a flower blooms in a...',
    explanationAr: 'البرق يلمع في لحظة خاطفة، وتفتح الزهرة يستغرق أياماً تدريجياً.',
    explanationEn: 'Lightning happens in an instant flash, while blooming is slow and gradual.'
  },
  {
    id: 'speed_hare_sloth',
    category: 'speed',
    difficulty: 'easy',
    itemA: { id: 'speedy_rabbit', nameAr: 'رشيق وسريع', nameEn: 'Speedy Hare', icon: '🐇' },
    itemB: { id: 'lazy_sloth', nameAr: 'كسول وبطيء', nameEn: 'Slow Sloth', icon: '🦥' },
    contextSentenceAr: 'الأرنب يقفز ويجري بخفة وسرعة، وحيوان الكسلان معلق وشديد الـ...',
    contextSentenceEn: 'The hare darts quickly, but the sloth hangs in the tree very...',
    explanationAr: 'الأرنب معروف بالسرعة والرشاقة، والكسلان أبطأ الثدييات حركة.',
    explanationEn: 'The rabbit is swift and energetic, while the sloth moves extremely slowly.'
  },
  {
    id: 'speed_train_cart',
    category: 'speed',
    difficulty: 'medium',
    itemA: { id: 'bullet_train', nameAr: 'قطار فائق', nameEn: 'Bullet Train', icon: '🚄' },
    itemB: { id: 'trolley_cart', nameAr: 'عربة تسوق', nameEn: 'Push Cart', icon: '🛒' },
    contextSentenceAr: 'قطار الرصاصة يطير بسرعة فوق السكة، بينما عربة التسوق تسير بـ...',
    contextSentenceEn: 'The high-speed bullet train races, while the supermarket trolley rolls...',
    explanationAr: 'قطار السفر يقطع مسافات هائلة بسرعة، وعربة السوبرماركت تسير بتمهل.',
    explanationEn: 'The bullet train is ultra-fast, while a shopping cart rolls slowly.'
  },
  {
    id: 'speed_urgent_patient',
    category: 'speed',
    difficulty: 'advanced',
    itemA: { id: 'urgent_alarm', nameAr: 'عاجل', nameEn: 'Urgent', icon: '🚨' },
    itemB: { id: 'patient_hourglass', nameAr: 'مُتَأَنٍّ', nameEn: 'Patient', icon: '⏳' },
    contextSentenceAr: 'صفارة الإسعاف تطلب تدخلاً عاجلاً وسريعاً، وبناء السفن يحتاج عملاً...',
    contextSentenceEn: 'The siren signals an urgent emergency, but fine crafting requires a...',
    explanationAr: 'العاجل يتطلب سرعة الاستجابة، والمتأني يأخذ وقته بهدوء وإتقان.',
    explanationEn: 'Urgent calls for immediate quick action, while patient proceeds with calm.'
  },
  {
    id: 'speed_whirlwind_breeze',
    category: 'speed',
    difficulty: 'medium',
    itemA: { id: 'fierce_tornado', nameAr: 'عاصف هائج', nameEn: 'Rushing Gale', icon: '🌪️' },
    itemB: { id: 'gentle_breeze', nameAr: 'نسيم هادئ', nameEn: 'Gentle Breeze', icon: '🍃' },
    contextSentenceAr: 'الإعصار رياحه عاصفة ومندفعة، ونسيم الصباح عليل و...',
    contextSentenceEn: 'The tornado winds roar rapidly, while the spring breeze blows...',
    explanationAr: 'العاصفة تتحرك بسرعة مدمرة، والنسيم يهب بهدوء ولطف.',
    explanationEn: 'A storm wind rushes fast, while a morning breeze blows gently and slowly.'
  },

  // ==========================================
  // 5. الحرارة (Temperature) - 9 pairs
  // ==========================================
  {
    id: 'temp_hot_cold',
    category: 'temperature',
    difficulty: 'easy',
    itemA: { id: 'hot_fire', nameAr: 'حار', nameEn: 'Hot', icon: '🔥' },
    itemB: { id: 'cold_snow', nameAr: 'بارد', nameEn: 'Cold', icon: '❄️' },
    contextSentenceAr: 'لهب النار مشتعل وحار، وندف الثلج في يدنا...',
    contextSentenceEn: 'The fire flame is burning hot, but snowflakes are...',
    explanationAr: 'النار مصدر للحرارة العالية، والثلج يتكون من البرودة الشديدة.',
    explanationEn: 'Fire produces intense heat, while snow comes from freezing cold.'
  },
  {
    id: 'temp_tea_icecream',
    category: 'temperature',
    difficulty: 'easy',
    itemA: { id: 'hot_tea', nameAr: 'شاي ساخن', nameEn: 'Hot Tea', icon: '☕' },
    itemB: { id: 'cold_icecream', nameAr: 'آيس كريم مثلج', nameEn: 'Cold Ice Cream', icon: '🍦' },
    contextSentenceAr: 'كوب الشاي يتصاعد منه البخار وهو ساخن، ومخروط الآيس كريم حلو و...',
    contextSentenceEn: 'The tea cup steams hot, while delicious ice cream is...',
    explanationAr: 'الشاي يحفظ ساخناً للشرب، والمثلجات تبرد بالثلج لتظل مجمدة.',
    explanationEn: 'Fresh tea is hot to drink, while ice cream stays frozen and cold.'
  },
  {
    id: 'temp_sun_snowman',
    category: 'temperature',
    difficulty: 'easy',
    itemA: { id: 'scorching_sun', nameAr: 'شمس حارقة', nameEn: 'Scorching Sun', icon: '☀️' },
    itemB: { id: 'frosty_snowman', nameAr: 'رجل ثلج بارد', nameEn: 'Frosty Snowman', icon: '⛄' },
    contextSentenceAr: 'شمس الظهيرة تدفئ الجو وتجعله حاراً، ورجل الثلج مصنوع من كرات الثلج الـ...',
    contextSentenceEn: 'The noon sun is bright and hot, while the snowman is made of...',
    explanationAr: 'الشمس تبث الدفء والحرارة، ورجل الثلج يعيش في الأجواء الباردة.',
    explanationEn: 'The sun warms the weather, while the snowman thrives in freezing cold.'
  },
  {
    id: 'temp_soup_juice',
    category: 'temperature',
    difficulty: 'easy',
    itemA: { id: 'warm_soup', nameAr: 'حساء دافئ', nameEn: 'Warm Soup', icon: '🥣' },
    itemB: { id: 'iced_drink', nameAr: 'عصير مثلج', nameEn: 'Iced Drink', icon: '🧃' },
    contextSentenceAr: 'حساء الخضار يطهى على الموقد ليقدم ساخناً، والعصير نضع فيه مكعبات ثلج ليصبح...',
    contextSentenceEn: 'Vegetable soup is cooked warm, while iced juice is refreshed...',
    explanationAr: 'شوربة الخضار تؤكل دافئة، والعصير المثلج يشرب بارداً ومنعشاً.',
    explanationEn: 'Soup is served warm, whereas iced juice is cooled with ice.'
  },
  {
    id: 'temp_boiling_frozen',
    category: 'temperature',
    difficulty: 'medium',
    itemA: { id: 'boiling_kettle', nameAr: 'يغلي', nameEn: 'Boiling', icon: '🫖' },
    itemB: { id: 'frozen_icecube', nameAr: 'متجمد', nameEn: 'Frozen', icon: '🧊' },
    contextSentenceAr: 'الماء في الإبريق يغلي لشدة الحرارة، والماء في الفريزر صار صلباً و...',
    contextSentenceEn: 'Water in the kettle is boiling hot, while in the freezer it is...',
    explanationAr: 'الغليان يحدث عند درجات الحرارة العالية، والتجمد يحدث تحت الصفر.',
    explanationEn: 'Boiling occurs at high heat, and freezing turns water into solid ice.'
  },
  {
    id: 'temp_desert_glacier',
    category: 'temperature',
    difficulty: 'medium',
    itemA: { id: 'desert_dune', nameAr: 'صحراء لاهبة', nameEn: 'Hot Desert', icon: '🏜️' },
    itemB: { id: 'polar_glacier', nameAr: 'جليد قطبي', nameEn: 'Polar Glacier', icon: '🏔️' },
    contextSentenceAr: 'صحراء الربع الخالي لاهبة الحرارة، والقطب الشمالي موطن الأنهار الـ...',
    contextSentenceEn: 'The Sahara desert is blazing hot, whereas Arctic glaciers are...',
    explanationAr: 'الصحراء تمتاز بالمناخ الحار، والقطب مغطى بالجليد المتجمد.',
    explanationEn: 'Deserts feature scorching heat, while polar zones are icy cold.'
  },
  {
    id: 'temp_summer_winter',
    category: 'temperature',
    difficulty: 'easy',
    itemA: { id: 'summer_beach', nameAr: 'صيف حار', nameEn: 'Hot Summer', icon: '🏖️' },
    itemB: { id: 'winter_snowstorm', nameAr: 'شتاء بارد', nameEn: 'Cold Winter', icon: '🌨️' },
    contextSentenceAr: 'في فصل الصيف نذهب للشاطئ لأن الجو حار، وفي فصل الشتاء نهطل الأمطار ونرتدي معاطف...',
    contextSentenceEn: 'In summer we visit sunny beaches, while in winter we dress for...',
    explanationAr: 'فصل الصيف يتميز بالحرارة والسطوع، وفصل الشتاء يتميز بالبرودة والأمطار.',
    explanationEn: 'Summer is the hot season, whereas winter brings chilly cold weather.'
  },
  {
    id: 'temp_scarf_fan',
    category: 'temperature',
    difficulty: 'medium',
    itemA: { id: 'wool_scarf', nameAr: 'تدفئة', nameEn: 'Warming', icon: '🧣' },
    itemB: { id: 'cooling_fan', nameAr: 'تبريد', nameEn: 'Cooling', icon: '🪭' },
    contextSentenceAr: 'الوشاح الصوفي نلبسه لطلب الدفء، والمروحة نهوي بها للحصول على...',
    contextSentenceEn: 'A woolen scarf keeps us cozy warm, while a handheld fan is for...',
    explanationAr: 'الملابس الصوفية تدفئنا ضد البرد، والمروحة تبردنا في الحر.',
    explanationEn: 'Scarves provide cozy warmth, while fans generate cooling breezes.'
  },
  {
    id: 'temp_glow_frost',
    category: 'temperature',
    difficulty: 'advanced',
    itemA: { id: 'volcano_lava', nameAr: 'حمم منصهرة', nameEn: 'Molten Lava', icon: '🌋' },
    itemB: { id: 'arctic_iceberg', nameAr: 'جبل جليد', nameEn: 'Frozen Iceberg', icon: '🧊' },
    contextSentenceAr: 'حمم البركان منصهرة وشديدة السخونة، بينما جبل الجليد العائم في البحر...',
    contextSentenceEn: 'Volcanic lava is molten and fiercely hot, while floating icebergs are...',
    explanationAr: 'الحمم البركانية من أشد المواد حرارة في الأرض، والجبل الجليدي كتلة متجمدة.',
    explanationEn: 'Molten lava carries immense heat, while an iceberg is frozen solid.'
  },

  // ==========================================
  // 6. الضوء والرؤية (Light & Vision) - 10 pairs
  // ==========================================
  {
    id: 'light_bright_dark',
    category: 'light',
    difficulty: 'easy',
    itemA: { id: 'bright_lamp', nameAr: 'مضيء', nameEn: 'Bright', icon: '💡' },
    itemB: { id: 'dark_room', nameAr: 'مظلم', nameEn: 'Dark', icon: '🕯️' },
    contextSentenceAr: 'المصباح الكهربائي ينشر النور وهو مضيء، وعند إطفائه تصبح الغرفة...',
    contextSentenceEn: 'The electric bulb is bright, but when turned off the room is...',
    explanationAr: 'المصباح المضاء ينير المكان، وعند غياب الضوء يسود الظلام.',
    explanationEn: 'A lit lamp makes things bright, while absence of light is dark.'
  },
  {
    id: 'light_sunny_shadow',
    category: 'light',
    difficulty: 'easy',
    itemA: { id: 'sunny_meadow', nameAr: 'مشمس ومشرق', nameEn: 'Sunny', icon: '🌞' },
    itemB: { id: 'dark_shadow', nameAr: 'ظل معتم', nameEn: 'Shady', icon: '🌑' },
    contextSentenceAr: 'الحديقة تحت أشعة الشمس مشرقة ووضاءة، وتحت الشجرة نستظل بـ...',
    contextSentenceEn: 'Under the sun the lawn is bright, but under the tree branches it is...',
    explanationAr: 'الشمس مصدر النور الساطع، والظل مكان يحجب عنه الضوء فيكون معتماً.',
    explanationEn: 'Sunshine illuminates clearly, while shadows produce dark shade.'
  },
  {
    id: 'light_clear_foggy',
    category: 'light',
    difficulty: 'medium',
    itemA: { id: 'clear_sky', nameAr: 'صافٍ', nameEn: 'Clear', icon: '☀️' },
    itemB: { id: 'foggy_cloud', nameAr: 'ضبابي', nameEn: 'Foggy', icon: '🌫️' },
    contextSentenceAr: 'الأفق الصباحي واضح والجو صافٍ، وعند نزول الضباب يصبح المنظر...',
    contextSentenceEn: 'The horizon is bright and clear, but in dense fog vision is...',
    explanationAr: 'الجو الصافي يسمح برؤية كل شيء بوضوح، والضباب يحجب معالم الطريق.',
    explanationEn: 'Clear conditions allow full visibility, whereas fog obscures view.'
  },
  {
    id: 'light_shiny_dull',
    category: 'light',
    difficulty: 'medium',
    itemA: { id: 'shiny_gem', nameAr: 'لامع وبراق', nameEn: 'Shiny', icon: '✨' },
    itemB: { id: 'dull_stone', nameAr: 'باهت', nameEn: 'Dull', icon: '🪨' },
    contextSentenceAr: 'الخاتم الذهبي يلمع ببريق ساحر، أما صخرة الطين فلها مظهر...',
    contextSentenceEn: 'Polished gold is shiny and sparkling, while muddy rock looks...',
    explanationAr: 'الذهب يعكس الضوء ببريق لامع، والصخرة لا تعكس الضوء ولونها باهت.',
    explanationEn: 'Polished jewels shine brightly, while untreated stone looks dull.'
  },
  {
    id: 'light_transparent_opaque',
    category: 'light',
    difficulty: 'advanced',
    itemA: { id: 'transparent_window', nameAr: 'شفاف', nameEn: 'Transparent', icon: '🪟' },
    itemB: { id: 'opaque_brick', nameAr: 'مُعْتِم', nameEn: 'Opaque', icon: '🧱' },
    contextSentenceAr: 'زجاج النافذة نرى ما وراءه لأنه شفاف، وجدار الطوب يمنع الرؤية لأنه...',
    contextSentenceEn: 'Glass window allows us to see through because it is transparent, but brick is...',
    explanationAr: 'الزجاج الشفاف ينفذ الضوء ونرى ما خلفه، والجدار المعتم يحجب الرؤية تماماً.',
    explanationEn: 'Transparent glass transmits light, while opaque bricks block light.'
  },
  {
    id: 'light_lit_candle_blown',
    category: 'light',
    difficulty: 'easy',
    itemA: { id: 'lit_flame', nameAr: 'شمعة مضاءة', nameEn: 'Lit Candle', icon: '🕯️' },
    itemB: { id: 'blown_candle', nameAr: 'شمعة مطفأة', nameEn: 'Extinguished', icon: '🪔' },
    contextSentenceAr: 'شمعة كعكة العيد مشتعلة وتضيء، وبعد أن ننفخ فيها تصبح...',
    contextSentenceEn: 'The birthday candle is glowing bright, but once we blow on it, it becomes...',
    explanationAr: 'الشمعة المشتعلة تعطي نوراً، وإطفاؤها يذهب بنورها.',
    explanationEn: 'A burning candle shines light, while extinguishing puts the light out.'
  },
  {
    id: 'light_daylight_nightsky',
    category: 'light',
    difficulty: 'easy',
    itemA: { id: 'daylight_sky', nameAr: 'ضوء النهار', nameEn: 'Daylight', icon: '🌅' },
    itemB: { id: 'nightsky_dark', nameAr: 'ظلمة الليل', nameEn: 'Night Darkness', icon: '🌌' },
    contextSentenceAr: 'ضوء الصباح ينير الكون كله، وفي المساء تحل...',
    contextSentenceEn: 'Morning sunlight lights the whole world, but at evening arrives the...',
    explanationAr: 'النهار ينيره ضوء الشمس، والليل يعمه الظلام وتسهر النجوم.',
    explanationEn: 'Daylight bathes the earth in brightness, while night brings darkness.'
  },
  {
    id: 'light_open_eye_closed',
    category: 'light',
    difficulty: 'easy',
    itemA: { id: 'open_eye', nameAr: 'عين مفتوحة', nameEn: 'Open Eye', icon: '👁️' },
    itemB: { id: 'closed_eye', nameAr: 'عين مغمضة', nameEn: 'Closed Eye', icon: '🙈' },
    contextSentenceAr: 'العين المفتوحة تبصر الألوان والأشياء، وعندما نغمض أعيننا تصبح الرؤية...',
    contextSentenceEn: 'An open eye sees colorful sights, but closing our eyes makes things...',
    explanationAr: 'فتح العينين يتيح لنا الإبصار، وإغماضهما يحجب الرؤية.',
    explanationEn: 'Opening eyes lets us see light, while closing them blocks vision.'
  },
  {
    id: 'light_flashlight_on_off',
    category: 'light',
    difficulty: 'medium',
    itemA: { id: 'torch_on', nameAr: 'كشاف منير', nameEn: 'Beam of Light', icon: '🔦' },
    itemB: { id: 'torch_off', nameAr: 'ظلام دامس', nameEn: 'Pitch Dark', icon: '🌑' },
    contextSentenceAr: 'كشاف الجيب يشع حزمة من النور، وفي الكهف غير المضاء يسود...',
    contextSentenceEn: 'The flashlight shines a bright beam, while inside the dark cave reigns...',
    explanationAr: 'الكشاف يضيء عتمة الطريق، والكهف المظلم خالٍ من أي نور.',
    explanationEn: 'A torch casts a beam of light, while an unlit cave remains pitch dark.'
  },
  {
    id: 'light_sparkle_shadow',
    category: 'light',
    difficulty: 'advanced',
    itemA: { id: 'sparkling_star', nameAr: 'وَضَّاح', nameEn: 'Radiant', icon: '⭐' },
    itemB: { id: 'shadowy_figure', nameAr: 'شاحب ومعتم', nameEn: 'Shadowy', icon: '👤' },
    contextSentenceAr: 'النجم في السماء وضاح وساطع، وخيال الشخص في الحائط شبح...',
    contextSentenceEn: 'The star shines radiant in the night, while a person silhouette is...',
    explanationAr: 'الشيء الوضاح يفيض إشراقاً، والخيال شبح مظلم بلا ملامح.',
    explanationEn: 'Radiant objects glow with light, while silhouettes appear as dark shadows.'
  },

  // ==========================================
  // 7. الحالة والنظافة والملمس (State, Cleanliness & Texture) - 10 pairs
  // ==========================================
  {
    id: 'state_clean_dirty',
    category: 'state',
    difficulty: 'easy',
    itemA: { id: 'clean_soap', nameAr: 'نظيف', nameEn: 'Clean', icon: '🧼' },
    itemB: { id: 'dirty_sock', nameAr: 'متسخ', nameEn: 'Dirty', icon: '🧦' },
    contextSentenceAr: 'الملابس بعد الغسيل ناصعة ونظيفة، والجورب بعد اللعب في التراب صار...',
    contextSentenceEn: 'Freshly washed clothes are clean, but socks played in mud became...',
    explanationAr: 'النظافة تقي من الجراثيم، والأوساخ تحتاج إلى ماء وصابون لإزالتها.',
    explanationEn: 'Clean means washed and pure, while dirty has soil or mud.'
  },
  {
    id: 'state_dry_wet',
    category: 'state',
    difficulty: 'easy',
    itemA: { id: 'dry_towel', nameAr: 'جاف', nameEn: 'Dry', icon: '🏖️' },
    itemB: { id: 'wet_sponge', nameAr: 'مبلل', nameEn: 'Wet', icon: '💦' },
    contextSentenceAr: 'المنشفة قبل الاستحمام جافة تماماً، والإسفنجة المغمورة في الماء تصبح...',
    contextSentenceEn: 'The towel before shower is dry, while a sponge soaked in water is...',
    explanationAr: 'الجاف لا رطوبة فيه، والمبلل مشبع بقطرات الماء.',
    explanationEn: 'Dry has no moisture, while wet is soaked with water.'
  },
  {
    id: 'state_new_old',
    category: 'state',
    difficulty: 'easy',
    itemA: { id: 'new_gift', nameAr: 'جديد', nameEn: 'New', icon: '✨' },
    itemB: { id: 'old_radio', nameAr: 'قديم', nameEn: 'Old', icon: '📻' },
    contextSentenceAr: 'حقيبة المدرسة التي اشتريتها اليوم جديدة، والمذياع في بيت جدي جهاز...',
    contextSentenceEn: 'The backpack bought today is new, but grandpa vintage radio is...',
    explanationAr: 'الجديد تم صنعه حديثاً ولامع، والقديم عريق ومستعمل منذ زمن طويل.',
    explanationEn: 'New means freshly made, while old has been around for many years.'
  },
  {
    id: 'state_soft_hard',
    category: 'state',
    difficulty: 'easy',
    itemA: { id: 'soft_teddy', nameAr: 'ناعم وطري', nameEn: 'Soft', icon: '🧸' },
    itemB: { id: 'hard_stone', nameAr: 'صلب وقاسٍ', nameEn: 'Hard', icon: '🪨' },
    contextSentenceAr: 'دب الصوف ناعم الملمس وطري، وحجر الحديقة صلب و...',
    contextSentenceEn: 'The stuffed teddy is soft to cuddle, while a garden stone is...',
    explanationAr: 'الوسادة والدبدوب لهما ملمس ناعم وطري، والصخرة صلبة لا تنثني.',
    explanationEn: 'The teddy bear is soft, whereas a garden rock is rigid and hard.'
  },
  {
    id: 'state_smooth_rough',
    category: 'state',
    difficulty: 'medium',
    itemA: { id: 'smooth_mirror', nameAr: 'أملس', nameEn: 'Smooth', icon: '🪞' },
    itemB: { id: 'rough_bark', nameAr: 'خشن', nameEn: 'Rough', icon: '🪵' },
    contextSentenceAr: 'سطح المرآة والزجاج أملس تماماً، وجذع الشجرة القديمة لحاؤه...',
    contextSentenceEn: 'The mirror glass feels smooth, but tree bark feels...',
    explanationAr: 'السطح الأملس ينزلق الإصبع عليه بنعومة، والسطح الخشن فيه نتوءات وتعرجات.',
    explanationEn: 'Glass surfaces are smooth, while tree bark has rough ridges.'
  },
  {
    id: 'state_intact_broken',
    category: 'state',
    difficulty: 'easy',
    itemA: { id: 'intact_egg', nameAr: 'سليم', nameEn: 'Intact', icon: '🥚' },
    itemB: { id: 'broken_egg', nameAr: 'مكسور', nameEn: 'Broken', icon: '🍳' },
    contextSentenceAr: 'البيضة في الصندوق سليمة وكاملة، وعند سقوطها على الأرض تصبح...',
    contextSentenceEn: 'The egg in the carton is intact, but dropping on the floor makes it...',
    explanationAr: 'الشيء السليم محتفظ بهيئته الأصلية، والشيء المكسور تشظى وفقد تماسكه.',
    explanationEn: 'Intact means whole and undamaged, while broken has shattered.'
  },
  {
    id: 'state_tidy_messy',
    category: 'state',
    difficulty: 'medium',
    itemA: { id: 'tidy_bookshelf', nameAr: 'مرتب', nameEn: 'Tidy', icon: '📚' },
    itemB: { id: 'messy_room', nameAr: 'فوضوي', nameEn: 'Messy', icon: '🌪️' },
    contextSentenceAr: 'رف الكتب منسق ومرتب، وألعاب الطفل الملقاة في كل زاوية مظهرها...',
    contextSentenceEn: 'The book shelf is organized and tidy, but toys scattered around are...',
    explanationAr: 'الترتيب يضع كل غرض في مكانه الصحيح، والفوضى تبعثر الأشياء.',
    explanationEn: 'Tidy keeps things in order, while messy scatters items everywhere.'
  },
  {
    id: 'state_fresh_stale',
    category: 'state',
    difficulty: 'medium',
    itemA: { id: 'fresh_apple', nameAr: 'طازج', nameEn: 'Fresh', icon: '🍎' },
    itemB: { id: 'stale_leaf', nameAr: 'ذابل', nameEn: 'Wilted', icon: '🍂' },
    contextSentenceAr: 'التفاحة المقطوفة تواً من البستان طازجة، وورقة الخريف على الأرض جافة و...',
    contextSentenceEn: 'An apple picked from the orchard is fresh, while an autumn leaf is...',
    explanationAr: 'الطعام الطازج لذيذ ومفعم بالنضارة، والنبات الذابل فقد رطوبته وحيويته.',
    explanationEn: 'Fresh fruits are crisp and ripe, while wilted leaves have dried out.'
  },
  {
    id: 'state_sharp_blunt',
    category: 'state',
    difficulty: 'medium',
    itemA: { id: 'sharp_knife', nameAr: 'حاد', nameEn: 'Sharp', icon: '🔪' },
    itemB: { id: 'blunt_spoon', nameAr: 'غير حاد', nameEn: 'Blunt', icon: '🥄' },
    contextSentenceAr: 'نصل السكين حاد ويقطع الأشياء، وحافة ملعقة الطعام ناعمة و...',
    contextSentenceEn: 'The knife edge is sharp for slicing, whereas a soup spoon edge is...',
    explanationAr: 'الأدوات الحادة تقطع بسهولة وتتطلب حذراً، والأدوات غير الحادة آمنة ومستديرة الحواف.',
    explanationEn: 'Sharp tools slice easily, while blunt edges are rounded and safe.'
  },
  {
    id: 'state_straight_curved',
    category: 'state',
    difficulty: 'easy',
    itemA: { id: 'straight_ruler', nameAr: 'مستقيم', nameEn: 'Straight', icon: '📏' },
    itemB: { id: 'curved_wave', nameAr: 'متعرج', nameEn: 'Curved', icon: '〰️' },
    contextSentenceAr: 'المسطرة تصنع خطاً مستقيماً، وسير الأفعى يصنع خطاً...',
    contextSentenceEn: 'A wooden ruler draws a straight line, while a snake moves in a...',
    explanationAr: 'المستقيم لا انحناء فيه، والمتعرج فيه التواءات ومنحنيات.',
    explanationEn: 'Straight has no bends, while curved or wavy bends repeatedly.'
  },

  // ==========================================
  // 8. المكان والاتجاه (Direction & Place) - 10 pairs
  // ==========================================
  {
    id: 'dir_up_down',
    category: 'direction',
    difficulty: 'easy',
    itemA: { id: 'arrow_up', nameAr: 'فوق / أعلى', nameEn: 'Up / Above', icon: '⬆️' },
    itemB: { id: 'arrow_down', nameAr: 'تحت / أسفل', nameEn: 'Down / Below', icon: '⬇️' },
    contextSentenceAr: 'السهم يشير إلى فوق السحاب، والسهم المقابل يشير إلى...',
    contextSentenceEn: 'The arrow points up into the sky, and the other points...',
    explanationAr: 'فوق يعني الاتجاه للأعلى، وتحت يعني الاتجاه للأسفل.',
    explanationEn: 'Up points toward the sky, while down points toward the ground.'
  },
  {
    id: 'dir_in_out',
    category: 'direction',
    difficulty: 'easy',
    itemA: { id: 'in_box', nameAr: 'داخل', nameEn: 'Inside', icon: '📥' },
    itemB: { id: 'out_box', nameAr: 'خارج', nameEn: 'Outside', icon: '📤' },
    contextSentenceAr: 'القطة تجلس داخل السلة، والعصفور يطير حراً في الـ...',
    contextSentenceEn: 'The kitten sits inside the basket, but the bird flies in the...',
    explanationAr: 'داخل يعني ضمن الشيء ومحاطاً به، وخارج يعني في الفضاء الطلق.',
    explanationEn: 'Inside is contained within bounds, while outside is outdoors or out.'
  },
  {
    id: 'dir_front_back',
    category: 'direction',
    difficulty: 'easy',
    itemA: { id: 'front_car', nameAr: 'أمام', nameEn: 'Front', icon: '🚗' },
    itemB: { id: 'back_car', nameAr: 'خلف', nameEn: 'Behind', icon: '🚙' },
    contextSentenceAr: 'المعلم يقف في مقدمة الفصل في الأمام، والسبورة تقع في الـ...',
    contextSentenceEn: 'The teacher stands at the front, while pupils sit toward the...',
    explanationAr: 'أمام يقابل وجه الشخص وبصره، وخلف يقع في جهة الظهر وراءه.',
    explanationEn: 'Front is what faces forward, and back or behind is at the rear.'
  },
  {
    id: 'dir_near_far',
    category: 'direction',
    difficulty: 'easy',
    itemA: { id: 'near_home', nameAr: 'قريب', nameEn: 'Near', icon: '🏠' },
    itemB: { id: 'far_planet', nameAr: 'بعيد', nameEn: 'Far', icon: '🪐' },
    contextSentenceAr: 'مدرستنا قريبة نصلها بالمشي، أما الكواكب في الفضاء فهي بمكان...',
    contextSentenceEn: 'Our neighborhood school is near, but planets in outer space are very...',
    explanationAr: 'القريب تفصلنا عنه مسافة قصيرة، والبعيد يحتاج سفراً ومسافة شاسعة.',
    explanationEn: 'Near is close by, while far requires traveling vast distances.'
  },
  {
    id: 'dir_right_left',
    category: 'direction',
    difficulty: 'easy',
    itemA: { id: 'pointing_right', nameAr: 'يمين', nameEn: 'Right', icon: '👉' },
    itemB: { id: 'pointing_left', nameAr: 'يسار', nameEn: 'Left', icon: '👈' },
    contextSentenceAr: 'نكتب بأيدينا ونسلم باليمين، واليد المقابلة هي يد الـ...',
    contextSentenceEn: 'We wave with our right hand, and the opposite hand is our...',
    explanationAr: 'اليمين واليسار جهتان متقابلتان تحددان الاتجاهات.',
    explanationEn: 'Right and left are opposite horizontal directions.'
  },
  {
    id: 'dir_top_bottom',
    category: 'direction',
    difficulty: 'medium',
    itemA: { id: 'top_crown', nameAr: 'أعلى الشجرة', nameEn: 'Tree Crown', icon: '🌳' },
    itemB: { id: 'bottom_roots', nameAr: 'جذور تحت الأرض', nameEn: 'Roots Below', icon: '🪴' },
    contextSentenceAr: 'أغصان الشجرة وثمارها تتألق في الأعلى، وجذورها تتغلغل في الـ...',
    contextSentenceEn: 'Apples grow high in the top branches, while roots spread deep in the...',
    explanationAr: 'الأغصان في قمة الشجرة بالأعلى، والجذور في التربة بالأسفل.',
    explanationEn: 'Branches reach high up, while roots embed deep down in the soil.'
  },
  {
    id: 'dir_center_edge',
    category: 'direction',
    difficulty: 'advanced',
    itemA: { id: 'center_bullseye', nameAr: 'مَرْكَز', nameEn: 'Center', icon: '🎯' },
    itemB: { id: 'outer_edge', nameAr: 'طَرَف', nameEn: 'Edge', icon: '⭕' },
    contextSentenceAr: 'السهم أصاب نقطة الهدف في المركز، والدائرة الخارجية تمثل الـ...',
    contextSentenceEn: 'The dart hit the bullseye in the center, whereas the boundary is the...',
    explanationAr: 'المركز نقطة المنتصف الداخلية، والطرف هو الحافة الخارجية المحيطة.',
    explanationEn: 'The center is the middle point, and the edge is the perimeter boundary.'
  },
  {
    id: 'dir_east_west',
    category: 'direction',
    difficulty: 'medium',
    itemA: { id: 'sunrise_east', nameAr: 'مَشْرِق', nameEn: 'East', icon: '🌅' },
    itemB: { id: 'sunset_west', nameAr: 'مَغْرِب', nameEn: 'West', icon: '🌇' },
    contextSentenceAr: 'الشمس تشرق صباحاً من جهة المشرق، وتغرب مساءً في جهة الـ...',
    contextSentenceEn: 'The morning sun rises in the east, and sets at evening in the...',
    explanationAr: 'الشرق جهة شروق الشمس، والغرب جهة مغيبها.',
    explanationEn: 'East is where the sun rises, and west is where it sets.'
  },
  {
    id: 'dir_entrance_exit',
    category: 'direction',
    difficulty: 'easy',
    itemA: { id: 'door_enter', nameAr: 'مَدْخَل', nameEn: 'Entrance', icon: '🚪' },
    itemB: { id: 'door_exit', nameAr: 'مَخْرَج', nameEn: 'Exit', icon: '🏃' },
    contextSentenceAr: 'ندخل إلى المتجر عبر باب المدخل، ونغادره عند التسوق من باب الـ...',
    contextSentenceEn: 'We enter the store through the entrance, and leave via the...',
    explanationAr: 'المدخل للولوج إلى المكان، والمخرج للمغادرة والرجوع.',
    explanationEn: 'The entrance allows entry, while the exit is for leaving.'
  },
  {
    id: 'dir_sky_sea',
    category: 'direction',
    difficulty: 'medium',
    itemA: { id: 'eagle_sky', nameAr: 'طائر في السماء', nameEn: 'High Flying Bird', icon: '🦅' },
    itemB: { id: 'fish_sea', nameAr: 'سمكة في الأعماق', nameEn: 'Deep Sea Fish', icon: '🐟' },
    contextSentenceAr: 'النسر يحلق في أعالي الفضاء فوق، والسمكة تسبح في البحر بـ...',
    contextSentenceEn: 'The eagle soars up high in the sky, but the fish swims deep...',
    explanationAr: 'النسر يعلو في أجواء السماء، والسمكة تغوص في أعماق المياه.',
    explanationEn: 'Eagles fly high in the atmosphere, while fish swim below in the depths.'
  },

  // ==========================================
  // 9. الزمن والترتيب (Time & Order) - 10 pairs
  // ==========================================
  {
    id: 'time_day_night',
    category: 'time',
    difficulty: 'easy',
    itemA: { id: 'sunny_day', nameAr: 'نهار', nameEn: 'Day', icon: '☀️' },
    itemB: { id: 'crescent_night', nameAr: 'ليل', nameEn: 'Night', icon: '🌙' },
    contextSentenceAr: 'في النهار نستيقظ للتعلم واللعب، وفي الليل ننام تحت ضوء الـ...',
    contextSentenceEn: 'During the day we play and learn, and at night we rest under the...',
    explanationAr: 'النهار مشرق بالشمس وفترة نشاط، والليل هادئ ومظلم للراحة والنوم.',
    explanationEn: 'Day is sunlit for activity, while night is peaceful for sleeping.'
  },
  {
    id: 'time_morning_evening',
    category: 'time',
    difficulty: 'easy',
    itemA: { id: 'breakfast_morning', nameAr: 'صباح', nameEn: 'Morning', icon: '🍳' },
    itemB: { id: 'bedtime_evening', nameAr: 'مساء', nameEn: 'Evening', icon: '🛏️' },
    contextSentenceAr: 'نبدأ يومنا بتناول وجبة الفطور في الصباح، ونعود لأسرّتنا لنرتاح في الـ...',
    contextSentenceEn: 'We start our day with breakfast in the morning, and go to sleep in the...',
    explanationAr: 'الصباح مطلع اليوم وبداية العمل، والمساء ختام اليوم وحلول السكون.',
    explanationEn: 'Morning is the dawn of the day, and evening is when dusk settles.'
  },
  {
    id: 'time_before_after',
    category: 'time',
    difficulty: 'easy',
    itemA: { id: 'egg_before', nameAr: 'قَبْل', nameEn: 'Before', icon: '🥚' },
    itemB: { id: 'chick_after', nameAr: 'بَعْد', nameEn: 'After', icon: '🐣' },
    contextSentenceAr: 'البيضة كانت موجودة أولاً من قبل، والصوص خرج منها فصارت...',
    contextSentenceEn: 'The whole egg came first before, and hatching into a chick came...',
    explanationAr: 'قبل يشير إلى الترتيب الزمني الأسبق، وبعد يشير إلى ما يليه تالياً.',
    explanationEn: 'Before indicates an earlier time, while after comes chronologically next.'
  },
  {
    id: 'time_first_last',
    category: 'time',
    difficulty: 'easy',
    itemA: { id: 'gold_first', nameAr: 'أَوَّل', nameEn: 'First', icon: '🥇' },
    itemB: { id: 'bronze_last', nameAr: 'أَخِير', nameEn: 'Last', icon: '🥉' },
    contextSentenceAr: 'المتسابق الفائز بالسباق وصل أولاً، والمتسابق في ذيل القافلة وصل...',
    contextSentenceEn: 'The champion crossed the finish line first, while the trailing runner was...',
    explanationAr: 'الأول يفتتح الترتيب ويكون في الصدارة، والأخير يختم الترتيب.',
    explanationEn: 'First leads at the head of the order, while last concludes at the end.'
  },
  {
    id: 'time_early_late',
    category: 'time',
    difficulty: 'medium',
    itemA: { id: 'alarm_early', nameAr: 'مُبَكِّر', nameEn: 'Early', icon: '⏰' },
    itemB: { id: 'sand_late', nameAr: 'مُتَأَخِّر', nameEn: 'Late', icon: '⌛' },
    contextSentenceAr: 'الطالب المجتهد يستيقظ مبكراً مع الفجر، ومن لا يضبط ساعته يصل...',
    contextSentenceEn: 'The diligent student wakes up early, whereas sleeping through makes one...',
    explanationAr: 'المبكر يسبق الوقت المحدد، والمتأخر يأتي بعد فوات الموعد.',
    explanationEn: 'Early arrives ahead of schedule, while late arrives after the appointed time.'
  },
  {
    id: 'time_past_future',
    category: 'time',
    difficulty: 'advanced',
    itemA: { id: 'vintage_clock', nameAr: 'ماضٍ', nameEn: 'Past', icon: '🕰️' },
    itemB: { id: 'flying_spaceship', nameAr: 'مستقبل', nameEn: 'Future', icon: '🛸' },
    contextSentenceAr: 'أيام أجدادنا وتاريخهم حدثت في الماضي، ومركبات الفضاء والمدن الذكية في الـ...',
    contextSentenceEn: 'Tales of historical ancestors belong to the past, while starcrafts belong to the...',
    explanationAr: 'الماضي هو ما مضى وانقضى من الزمن، والمستقبل هو ما سيأتي غداً وبعده.',
    explanationEn: 'The past is time already elapsed, while the future is time yet to arrive.'
  },
  {
    id: 'time_beginning_end',
    category: 'time',
    difficulty: 'medium',
    itemA: { id: 'seed_beginning', nameAr: 'بِدَايَة', nameEn: 'Beginning', icon: '🌱' },
    itemB: { id: 'fruit_end', nameAr: 'نِهَايَة', nameEn: 'End', icon: '🍎' },
    contextSentenceAr: 'غرس البذرة وسقايتها يمثل بداية الرحلة، وقطف الثمار الطيبة هو الـ...',
    contextSentenceEn: 'Planting the tiny seed marks the beginning, and picking the fruit is the...',
    explanationAr: 'البداية نقطة الانطلاق الأولى، والنهاية ختام العمل واكتمال النتيجة.',
    explanationEn: 'Beginning starts a process, while end completes the finished journey.'
  },
  {
    id: 'time_young_old',
    category: 'time',
    difficulty: 'easy',
    itemA: { id: 'young_boy', nameAr: 'صغير السن', nameEn: 'Young', icon: '🧒' },
    itemB: { id: 'old_grandpa', nameAr: 'كبير السن', nameEn: 'Elderly', icon: '👴' },
    contextSentenceAr: 'الولد الصغير في ريعان الطفولة، وجده الحكيم ذو اللحية البيضاء رجل...',
    contextSentenceEn: 'The energetic toddler is young, while wise grandfather is...',
    explanationAr: 'صغير السن في بداية عمره، والمسن عاش سنيناً طويلة واكتسب الحكمة.',
    explanationEn: 'Young is in early stages of life, while elderly has lived many decades.'
  },
  {
    id: 'time_now_later',
    category: 'time',
    difficulty: 'medium',
    itemA: { id: 'now_action', nameAr: 'الآن', nameEn: 'Now', icon: '⚡' },
    itemB: { id: 'later_calendar', nameAr: 'لاحِقاً', nameEn: 'Later', icon: '📅' },
    contextSentenceAr: 'سنبدأ مراجعة دروسنا حالاً والآن، وموعد الرحلة الترفيهية سيكون...',
    contextSentenceEn: 'We start our lesson right now, while the weekend excursion takes place...',
    explanationAr: 'الآن يعني اللحظة الحالية المباشرة، ولاحقاً يعني في وقت قادم.',
    explanationEn: 'Now is the present moment, whereas later is at a subsequent time.'
  },
  {
    id: 'time_ancient_modern',
    category: 'time',
    difficulty: 'advanced',
    itemA: { id: 'ancient_pyramid', nameAr: 'قَدِيم وأَثَرِيّ', nameEn: 'Ancient', icon: '🏛️' },
    itemB: { id: 'modern_skyscraper', nameAr: 'حَدِيث وعَصْرِيّ', nameEn: 'Modern', icon: '🏙️' },
    contextSentenceAr: 'الأهرامات والمعابد آثار قديمة من آلاف السنين، وناطحات السحاب مبانٍ...',
    contextSentenceEn: 'The stone pyramids are ancient monuments, while city towers are...',
    explanationAr: 'القديم الأثري يعود لأزمنة خلت، والحديث يواكب التطور المعاصر اليوم.',
    explanationEn: 'Ancient stems from thousands of years ago, while modern is contemporary.'
  },

  // ==========================================
  // 10. المشاعر والتعبيرات (Emotions & Expressions) - 10 pairs
  // ==========================================
  {
    id: 'emo_happy_sad',
    category: 'emotions',
    difficulty: 'easy',
    itemA: { id: 'happy_smile', nameAr: 'سعيد', nameEn: 'Happy', icon: '😊' },
    itemB: { id: 'sad_tear', nameAr: 'حزين', nameEn: 'Sad', icon: '😢' },
    contextSentenceAr: 'الطفل الفائز بالجائزة يبتسم وهو سعيد، أما من ضاعت لعبته فهو...',
    contextSentenceEn: 'The winner smiles happily, but whoever lost their favorite toy feels...',
    explanationAr: 'السعادة ترسم ابتسامة وفرحاً، والحزن ترافقه الدموع وضيق الصدر.',
    explanationEn: 'Happiness brings smiles and joy, while sadness brings tears.'
  },
  {
    id: 'emo_calm_angry',
    category: 'emotions',
    difficulty: 'easy',
    itemA: { id: 'calm_face', nameAr: 'هادئ ومطمئن', nameEn: 'Calm', icon: '😌' },
    itemB: { id: 'angry_face', nameAr: 'غاضب ومنفعل', nameEn: 'Angry', icon: '😡' },
    contextSentenceAr: 'من يتنفس بعمق يكون هادئاً، ومن يفقد صبره ويصرخ يكون...',
    contextSentenceEn: 'Taking deep breaths keeps us calm, but losing patience makes one...',
    explanationAr: 'الهدوء يمنح سكينة وسلاماً، والغضب انفعال وصراخ ينبغي تجنبه.',
    explanationEn: 'Calm brings peace and serenity, while anger is upset and frustrated.'
  },
  {
    id: 'emo_brave_scared',
    category: 'emotions',
    difficulty: 'easy',
    itemA: { id: 'brave_lion', nameAr: 'شجاع وجريء', nameEn: 'Brave', icon: '🦁' },
    itemB: { id: 'scared_mouse', nameAr: 'خائف ومذعور', nameEn: 'Scared', icon: '🐭' },
    contextSentenceAr: 'ملك الغابة الأسد حيوان شجاع لا يخاف، والفأر الصغير يهرب وهو...',
    contextSentenceEn: 'The lion faces danger bravely, while the little mouse scurries...',
    explanationAr: 'الشجاع يواجه الصعاب بجرأة، والخائف يرتعد ويبحث عن أمان.',
    explanationEn: 'Brave shows courage, while scared trembles and retreats.'
  },
  {
    id: 'emo_laughing_crying',
    category: 'emotions',
    difficulty: 'easy',
    itemA: { id: 'laughing_joy', nameAr: 'ضاحك', nameEn: 'Laughing', icon: '😄' },
    itemB: { id: 'crying_sadness', nameAr: 'باكٍ', nameEn: 'Crying', icon: '😭' },
    contextSentenceAr: 'عند سماع نكتة طريفة يكون وجهنا ضاحكاً ومبتهجاً، وعند الألم نكون...',
    contextSentenceEn: 'Listening to funny tales makes us laughing, but hurting our knee makes us...',
    explanationAr: 'الضحك تعبير عن المرح والسرور، والبكاء تعبير عن الحزن أو الألم.',
    explanationEn: 'Laughing expresses delight and fun, while crying reflects sorrow or distress.'
  },
  {
    id: 'emo_active_sleepy',
    category: 'emotions',
    difficulty: 'medium',
    itemA: { id: 'energetic_bolt', nameAr: 'نشيط ومفعم بالحيوية', nameEn: 'Energetic', icon: '⚡' },
    itemB: { id: 'sleepy_zzz', nameAr: 'نعسان وكسول', nameEn: 'Sleepy', icon: '😴' },
    contextSentenceAr: 'الطفل الرياضي في الصباح نشيط يقفز، وفي المساء يشعر بأنه نعسان و...',
    contextSentenceEn: 'The morning kid jumps full of energy, but by night feels sleepy and...',
    explanationAr: 'النشاط طاقة وحركة وإقبال، والنعاس رغبة في الخلود إلى النوم والراحة.',
    explanationEn: 'Energetic is vibrant and active, while sleepy longs for rest and bed.'
  },
  {
    id: 'emo_friendly_fierce',
    category: 'emotions',
    difficulty: 'medium',
    itemA: { id: 'gentle_kitten', nameAr: 'أليف ووديع', nameEn: 'Gentle', icon: '🐱' },
    itemB: { id: 'fierce_wolf', nameAr: 'مفترس وشرس', nameEn: 'Fierce', icon: '🐺' },
    contextSentenceAr: 'القطة المنزلية حيوان أليف ووديع يحب الملاعبة، أما الذئب في الغابة فهو...',
    contextSentenceEn: 'The kitten is gentle and sweet, whereas the wild wolf in woods is...',
    explanationAr: 'الأليف مسالم يحب الصحبة، والمفترس شرس يعيش في البرية ويهاجم.',
    explanationEn: 'Gentle animals are friendly pets, whereas fierce predators are untamed.'
  },
  {
    id: 'emo_patient_impatient',
    category: 'emotions',
    difficulty: 'advanced',
    itemA: { id: 'patient_meditator', nameAr: 'صَبُور', nameEn: 'Patient', icon: '🧘' },
    itemB: { id: 'impatient_clock', nameAr: 'مُتَعَجِّل', nameEn: 'Impatient', icon: '⏱️' },
    contextSentenceAr: 'الصياد ينتظر الصنارة بهدوء وهو صبور، ومن لا يطيق الانتظار فهو...',
    contextSentenceEn: 'The fisherman waits calmly being patient, while who cannot wait is...',
    explanationAr: 'الصبر خلق كريم يعين على التأني، والتعجل يدفع إلى التوتر والاستعجال.',
    explanationEn: 'Patient endures waiting serenely, while impatient gets restless quickly.'
  },
  {
    id: 'emo_loving_hostile',
    category: 'emotions',
    difficulty: 'medium',
    itemA: { id: 'heart_love', nameAr: 'مُحِبّ ولَطِيف', nameEn: 'Loving', icon: '❤️' },
    itemB: { id: 'broken_hate', nameAr: 'كاره ومنزعج', nameEn: 'Hostile', icon: '💔' },
    contextSentenceAr: 'القلب الودود يعامل أصدقاءه بحب ولطف، وعكس الحب هو أن يكون الشخص...',
    contextSentenceEn: 'A warm heart treats pals with kindness and love, opposite to being...',
    explanationAr: 'الحب ينشر التآلف والمودة، والكره يجلب النفور والقطيعة.',
    explanationEn: 'Loving spreads warmth and companionship, opposite to feeling hostile.'
  },
  {
    id: 'emo_confident_shy',
    category: 'emotions',
    difficulty: 'advanced',
    itemA: { id: 'confident_hero', nameAr: 'وَاثِق', nameEn: 'Confident', icon: '🦸' },
    itemB: { id: 'shy_peeking', nameAr: 'خَجُول', nameEn: 'Shy', icon: '🫣' },
    contextSentenceAr: 'الخطيب على المسرح يتكلم بجرأة وثقة، والطفل الصغير أمام الغرباء يبدو...',
    contextSentenceEn: 'The presenter speaks with confidence, while the small child feels...',
    explanationAr: 'الواثق يؤمن بقدراته ويعبر بلا تردد، والخجول يستحي ويتردد في الظهور.',
    explanationEn: 'Confident speaks up with assurance, while shy feels hesitant in public.'
  },
  {
    id: 'emo_hopeful_despair',
    category: 'emotions',
    difficulty: 'advanced',
    itemA: { id: 'hope_rainbow', nameAr: 'مُتَفَائِل ومُسْتَبْشِر', nameEn: 'Hopeful', icon: '🌈' },
    itemB: { id: 'despair_cloud', nameAr: 'يَائِس ومُحْبَط', nameEn: 'Despairing', icon: '🌧️' },
    contextSentenceAr: 'قوس قزح يبعث على التفاؤل والأمل، والاستسلام للصعاب يوقع في الـ...',
    contextSentenceEn: 'The bright rainbow brings hope, while giving up too easily brings...',
    explanationAr: 'التفاؤل يرى النور في الغد، واليأس استسلام للأفكار السلبية.',
    explanationEn: 'Hope looks forward to positive outcomes, whereas despair gives up prematurely.'
  },

  // ==========================================
  // 11. الوزن والقوة (Weight & Strength) - 10 pairs
  // ==========================================
  {
    id: 'weight_heavy_light',
    category: 'weight',
    difficulty: 'easy',
    itemA: { id: 'heavy_boulder', nameAr: 'ثقيل', nameEn: 'Heavy', icon: '🪨' },
    itemB: { id: 'light_feather', nameAr: 'خفيف', nameEn: 'Lightweight', icon: '🪶' },
    contextSentenceAr: 'صخرة الجبل الكبيرة ثقيلة جداً، وريشة الحمامة تطير في الهواء لأنها...',
    contextSentenceEn: 'The mountain boulder is heavy, but the pigeon feather flies because it is...',
    explanationAr: 'الصخرة ثقيلة الوزن يصعب رفعها، والريشة خفيفة تسبح مع النسيم.',
    explanationEn: 'Boulders are heavy to lift, while feathers are featherweight and light.'
  },
  {
    id: 'weight_strong_weak',
    category: 'weight',
    difficulty: 'easy',
    itemA: { id: 'strong_bicep', nameAr: 'قوي', nameEn: 'Strong', icon: '💪' },
    itemB: { id: 'weak_flower', nameAr: 'ضعيف', nameEn: 'Weak', icon: '🥀' },
    contextSentenceAr: 'البطل الرياضي يملك جسماً قوياً، والغصن الذابل هش و...',
    contextSentenceEn: 'The weightlifter has a strong build, while the dry twig is brittle and...',
    explanationAr: 'القوي يمتلك طاقة وقدرة على التحمل، والضعيف يسهل كسره ويحتاج مساعدة.',
    explanationEn: 'Strong exerts power and resistance, whereas weak is frail and easily broken.'
  },
  {
    id: 'weight_sturdy_fragile',
    category: 'weight',
    difficulty: 'medium',
    itemA: { id: 'sturdy_shield', nameAr: 'متين وصلب', nameEn: 'Sturdy', icon: '🛡️' },
    itemB: { id: 'fragile_bubble', nameAr: 'هش وقابل للكسر', nameEn: 'Fragile', icon: '🫧' },
    contextSentenceAr: 'درع الفارس متين يحميه، وفقاعة الصابون رقيقة و...',
    contextSentenceEn: 'The knight steel shield is sturdy, but a floating soap bubble is...',
    explanationAr: 'الدرع المتين يقاوم الصدمات، وفقاعة الصابون هشة تنفجر بلمسة واحدة.',
    explanationEn: 'Sturdy resists impacts, while fragile items or bubbles burst at a touch.'
  },
  {
    id: 'weight_anchor_balloon',
    category: 'weight',
    difficulty: 'easy',
    itemA: { id: 'heavy_anchor', nameAr: 'مرساة غاطسة', nameEn: 'Heavy Anchor', icon: '⚓' },
    itemB: { id: 'floating_balloon', nameAr: 'بالون طائر', nameEn: 'Floating Balloon', icon: '🎈' },
    contextSentenceAr: 'مرساة السفينة ثقيلة وتغوص إلى قاع البحر، وبالون الهيليوم خفيف و...',
    contextSentenceEn: 'The steel anchor is heavy and drops to the seabed, while the balloon is light and...',
    explanationAr: 'المرساة الحديدية ثقيلة الوزن لتمسك السفينة، والبالون خفيف يرتفع لأعلى.',
    explanationEn: 'The anchor is weighed down heavily, while the balloon rises lightly.'
  },
  {
    id: 'weight_iron_cotton',
    category: 'weight',
    difficulty: 'medium',
    itemA: { id: 'iron_chain', nameAr: 'حديد متين', nameEn: 'Iron Chain', icon: '⛓️' },
    itemB: { id: 'cotton_cloud', nameAr: 'قطن هش', nameEn: 'Fluffy Cotton', icon: '☁️' },
    contextSentenceAr: 'سلسلة الحديد صلبة ومتينة، وكرة القطن هشة ولينة و...',
    contextSentenceEn: 'The iron chain link is dense and hard, while fluffy cotton is gentle and...',
    explanationAr: 'الحديد معدن ثقيل شديد التماسك، والقطن ألياف ناعمة خفيفة الوزن.',
    explanationEn: 'Iron is heavy and rugged, while cotton puffs are lightweight and soft.'
  },
  {
    id: 'weight_oak_reed',
    category: 'weight',
    difficulty: 'advanced',
    itemA: { id: 'giant_oak', nameAr: 'شَامِخ رَاسِخ', nameEn: 'Mighty', icon: '🌲' },
    itemB: { id: 'slender_reed', nameAr: 'نَحِيل يَنْحَنِي', nameEn: 'Pliant Reed', icon: '🌾' },
    contextSentenceAr: 'شجرة البلوط العظيمة راسخة وقوية، وسنبلة القمح في الريح نحيلة و...',
    contextSentenceEn: 'The giant oak tree stands mighty, while slender stalks sway and bend...',
    explanationAr: 'شجرة البلوط قوية الجذع لا تهزها الريح، ونبتة القمح رشيقة تنحني مع النسيم.',
    explanationEn: 'Mighty trees stand firm against storms, while pliant reeds bend with winds.'
  },
  {
    id: 'weight_brick_pillow',
    category: 'weight',
    difficulty: 'easy',
    itemA: { id: 'solid_brick', nameAr: 'قالب طوب ثقيل', nameEn: 'Heavy Brick', icon: '🧱' },
    itemB: { id: 'soft_pillow', nameAr: 'وسادة خفيفة', nameEn: 'Feather Pillow', icon: '🛏️' },
    contextSentenceAr: 'قالب الطوب في البناء ثقيل الوزن، ووسادة النوم ريشية و...',
    contextSentenceEn: 'The construction brick is dense and heavy, but our bedtime pillow is...',
    explanationAr: 'الطوب مصنوع من الطين الصلب فهو ثقيل، والوسادة محشوة ريشاً ناعماً وخفيفاً.',
    explanationEn: 'Bricks are weighty and solid, while bed pillows are light and cushiony.'
  },
  {
    id: 'weight_solid_hollow',
    category: 'weight',
    difficulty: 'advanced',
    itemA: { id: 'solid_core', nameAr: 'مُصْمَت', nameEn: 'Solid Core', icon: '🧱' },
    itemB: { id: 'hollow_pipe', nameAr: 'مُجَوَّف', nameEn: 'Hollow', icon: '🪈' },
    contextSentenceAr: 'حجر الصوان مصمت مليء من الداخل، والناي الموسيقي فارغ من الداخل و...',
    contextSentenceEn: 'A solid stone is filled inside, while a musical flute is empty and...',
    explanationAr: 'المصمت مليء بالكامل دون فراغ، والمجوف أسطوانة مفرغة من الداخل.',
    explanationEn: 'Solid is completely filled, whereas hollow has an empty cavity within.'
  },
  {
    id: 'weight_anvil_kite',
    category: 'weight',
    difficulty: 'medium',
    itemA: { id: 'iron_anvil', nameAr: 'سِندان ثقيل', nameEn: 'Heavy Anvil', icon: '🔨' },
    itemB: { id: 'flying_kite', nameAr: 'طائرة ورقية', nameEn: 'Paper Kite', icon: '🪁' },
    contextSentenceAr: 'سندان الحداد كتلته ثقيلة جداً، والطائرة الورقية ورقة خفيفة ترتفع في الـ...',
    contextSentenceEn: 'The blacksmith anvil is extremely heavy, while a paper kite is so light it takes to the...',
    explanationAr: 'السندان كتلة معدنية ضخمة لا تتزحزح، والطائرة الورقية يحملها الهواء لخفتها.',
    explanationEn: 'Anvils are massive and heavy, while kites are light enough to soar in breezes.'
  },
  {
    id: 'weight_elephant_butterfly',
    category: 'weight',
    difficulty: 'easy',
    itemA: { id: 'huge_pachyderm', nameAr: 'فيل ثقيل الوزن', nameEn: 'Heavy Elephant', icon: '🐘' },
    itemB: { id: 'tiny_butterfly', nameAr: 'فراشة خفيفة الوزن', nameEn: 'Light Butterfly', icon: '🦋' },
    contextSentenceAr: 'خطوات الفيل على الأرض تهز المكان لثقله، بينما الفراشة تحط على الزهر بخفة و...',
    contextSentenceEn: 'Elephant steps press heavy on earth, while a butterfly perches on blossoms with...',
    explanationAr: 'الفيل من أثقل حيوانات اليابسة وزناً، والفراشة كائن رقيق خفيف لا يكاد يوزن.',
    explanationEn: 'Elephants carry tremendous weight, while butterflies weigh almost nothing.'
  },

  // ==========================================
  // 12. الأفعال والحالات المتقابلة (Opposite Actions & States) - 17 pairs
  // ==========================================
  {
    id: 'act_open_close',
    category: 'actions',
    difficulty: 'easy',
    itemA: { id: 'open_book', nameAr: 'يَفْتَح', nameEn: 'Open', icon: '📖' },
    itemB: { id: 'closed_book', nameAr: 'يُغْلِق', nameEn: 'Close', icon: '📕' },
    contextSentenceAr: 'التلميذ يفتح الكتاب ليتعلم، وعند الانتهاء من القراءة...',
    contextSentenceEn: 'The student opens the textbook to study, and upon finishing he will...',
    explanationAr: 'الفتح يكشف المحتوى، والإغلاق يضمه ويستره.',
    explanationEn: 'Opening exposes the contents, and closing shuts them safely.'
  },
  {
    id: 'act_ascend_descend',
    category: 'actions',
    difficulty: 'medium',
    itemA: { id: 'climber_up', nameAr: 'يَصْعَد', nameEn: 'Ascend / Climb', icon: '🧗' },
    itemB: { id: 'parachute_down', nameAr: 'يَهْبِط', nameEn: 'Descend', icon: '🪂' },
    contextSentenceAr: 'المتسلق يصعد نحو قمة الجبل، والمظلي في الجو...',
    contextSentenceEn: 'The climber ascends toward the peak, while the parachutist...',
    explanationAr: 'الصعود هو الارتقاء للأعلى، والهبوط هو النزول التدريجي للأسفل.',
    explanationEn: 'Ascending goes upwards, while descending travels downwards.'
  },
  {
    id: 'act_sit_stand',
    category: 'actions',
    difficulty: 'easy',
    itemA: { id: 'sit_chair', nameAr: 'يَجْلِس', nameEn: 'Sit', icon: '🪑' },
    itemB: { id: 'stand_person', nameAr: 'يَقِف', nameEn: 'Stand', icon: '🧍' },
    contextSentenceAr: 'المتعلم يجلس على كرسيه باحترام، وعند إلقاء النشيد الوطني...',
    contextSentenceEn: 'The student sits on the chair, but when the national anthem plays he will...',
    explanationAr: 'الجلوس هو الاستقرار على المقعد، والوقوف هو الانتصاب على القدمين.',
    explanationEn: 'Sitting rests on a seat, while standing is upright on two feet.'
  },
  {
    id: 'act_sleep_wake',
    category: 'actions',
    difficulty: 'easy',
    itemA: { id: 'sleep_bed', nameAr: 'يَنَام', nameEn: 'Sleep', icon: '🛌' },
    itemB: { id: 'wake_alarm', nameAr: 'يَسْتَيْقِظ', nameEn: 'Wake Up', icon: '⏰' },
    contextSentenceAr: 'عند حلول الظلام ننام لنرتاح، ومع شروق الشمس...',
    contextSentenceEn: 'At nightfall we sleep to rest, and as the morning bell rings we...',
    explanationAr: 'النوم استرخاء واستراحة للجسد، والاستيقاظ يقظة وبدء النشاط اليومي.',
    explanationEn: 'Sleeping recharges the body in dreamland, while waking up welcomes the day.'
  },
  {
    id: 'act_give_take',
    category: 'actions',
    difficulty: 'easy',
    itemA: { id: 'give_gift', nameAr: 'يُعْطِي', nameEn: 'Give', icon: '🎁' },
    itemB: { id: 'take_hands', nameAr: 'يَأْخُذ', nameEn: 'Take', icon: '🤲' },
    contextSentenceAr: 'الكريم يعطي الهدايا ليسعد غيره، والمحتاج يمد يده لـ...',
    contextSentenceEn: 'The generous giver presents a gift, while the recipient receives and...',
    explanationAr: 'العطاء بذل وإحسان، والأخذ قبول وتلقٍّ.',
    explanationEn: 'Giving provides something to others, while taking receives it.'
  },
  {
    id: 'act_push_pull',
    category: 'actions',
    difficulty: 'easy',
    itemA: { id: 'push_action', nameAr: 'يَدْفَع', nameEn: 'Push', icon: '🛒' },
    itemB: { id: 'pull_luggage', nameAr: 'يَسْحَب', nameEn: 'Pull', icon: '🧳' },
    contextSentenceAr: 'المتسوق يدفع عربة البضائع أمامه، والمسافر يمسك حقيبته و...',
    contextSentenceEn: 'The shopper pushes the cart forward, while the traveler grips the suitcase and...',
    explanationAr: 'الدفع توجيه القوة لإبعاد الشيء للأمام، والسحب جر الشيء وجذبه نحوك.',
    explanationEn: 'Pushing moves an object away from you, while pulling draws it closer.'
  },
  {
    id: 'act_float_sink',
    category: 'actions',
    difficulty: 'medium',
    itemA: { id: 'float_boat', nameAr: 'يَطْفُو', nameEn: 'Float', icon: '⛵' },
    itemB: { id: 'sink_anchor', nameAr: 'يَغُوص', nameEn: 'Sink', icon: '⚓' },
    contextSentenceAr: 'القارب الخشبي يطفو على سطح الماء، والمسمار الحديدي يسقط في القاع و...',
    contextSentenceEn: 'A wooden sailboat floats on the surface, while a metal anchor falls and...',
    explanationAr: 'الطفو بقاء الجسم على سطح السائل، والغوص نزوله واستقراره في الأعماق.',
    explanationEn: 'Floating remains on top of liquid, whereas sinking drops down to depths.'
  },
  {
    id: 'act_turn_on_off',
    category: 'actions',
    difficulty: 'easy',
    itemA: { id: 'light_turn_on', nameAr: 'يُشْعِل / يُشَغِّل', nameEn: 'Turn On', icon: '💡' },
    itemB: { id: 'light_turn_off', nameAr: 'يُطْفِئ', nameEn: 'Turn Off', icon: '🔌' },
    contextSentenceAr: 'عندما نحتاج النور نشعل المصباح، وقبل مغادرة الغرفة نتذكر أن...',
    contextSentenceEn: 'When we need illumination we turn on the light, and when leaving we...',
    explanationAr: 'التشغيل يوصل الطاقة ويفعل الجهاز، والإطفاء يوقف سريان التيار ويوفر الكهرباء.',
    explanationEn: 'Turning on activates the power, and turning off saves power.'
  },
  {
    id: 'act_tie_untie',
    category: 'actions',
    difficulty: 'medium',
    itemA: { id: 'tie_knot', nameAr: 'يَرْبِط', nameEn: 'Tie', icon: '🪢' },
    itemB: { id: 'untie_cut', nameAr: 'يَفُكّ', nameEn: 'Untie', icon: '✂️' },
    contextSentenceAr: 'الرياضي يربط رباط حذائه بإحكام، وعند خلع الحذاء في البيت يقوم بـ...',
    contextSentenceEn: 'The runner ties shoe laces snugly, and to take them off he will...',
    explanationAr: 'الربط يعقد الطرفين ليتماسكا، والفك يحرر العقدة ويعيد الحبل طليقاً.',
    explanationEn: 'Tying binds ends into a knot, while untying releases the bond.'
  },
  {
    id: 'act_build_demolish',
    category: 'actions',
    difficulty: 'medium',
    itemA: { id: 'build_crane', nameAr: 'يَبْنِي', nameEn: 'Build', icon: '🏗️' },
    itemB: { id: 'demolish_hammer', nameAr: 'يَهْدِم', nameEn: 'Demolish', icon: '🔨' },
    contextSentenceAr: 'المهندس والعمال يضعون الطوب ويبنون برجاً، والمطرقة الثقيلة للجدار القديم...',
    contextSentenceEn: 'Masons lay stones to build a tall tower, while wrecking crews...',
    explanationAr: 'البناء إنشاء وعمارة وتشييد، والهدم إزالة وتحطيم للمبنى القديم.',
    explanationEn: 'Building constructs upwards, while demolishing tears down structures.'
  },
  {
    id: 'act_buy_sell',
    category: 'actions',
    difficulty: 'medium',
    itemA: { id: 'buy_cart', nameAr: 'يَشْتَرِي', nameEn: 'Buy', icon: '🛍️' },
    itemB: { id: 'sell_tag', nameAr: 'يَبِيع', nameEn: 'Sell', icon: '🏷️' },
    contextSentenceAr: 'الزبون يدفع النقود ويشتري الألعاب، والتاجر يعرض البضائع و...',
    contextSentenceEn: 'Customers pay coins to buy toys, while the merchant puts up wares to...',
    explanationAr: 'الشراء دفع المال للحصول على سلعة، والبيع تقديم السلعة مقابل ثمنها.',
    explanationEn: 'Buying acquires items with money, while selling offers items for trade.'
  },
  {
    id: 'act_freeze_melt',
    category: 'actions',
    difficulty: 'medium',
    itemA: { id: 'freeze_ice', nameAr: 'يَتَجَمَّد', nameEn: 'Freeze', icon: '🧊' },
    itemB: { id: 'melt_drop', nameAr: 'يَذُوب', nameEn: 'Melt', icon: '💧' },
    contextSentenceAr: 'الماء في البرد الشديد يتجمد ويصير صلباً، ومكعب الثلج في الشمس الساطعة...',
    contextSentenceEn: 'Cold water freezes into solid ice, while an ice cube under warm sun...',
    explanationAr: 'التجمد يحول السائل لصلب بالبرودة، والذوبان يحول الصلب لسائل بالحرارة.',
    explanationEn: 'Freezing turns liquids to ice, while melting liquefies ice under warmth.'
  },
  {
    id: 'act_throw_catch',
    category: 'actions',
    difficulty: 'easy',
    itemA: { id: 'throw_ball', nameAr: 'يَرْمِي', nameEn: 'Throw', icon: '⚾' },
    itemB: { id: 'catch_glove', nameAr: 'يُمْسِك', nameEn: 'Catch', icon: '🧤' },
    contextSentenceAr: 'اللاعب يرمي الكرة في الهواء لزميله، والزميل بالقفاز يراقبها و...',
    contextSentenceEn: 'The pitcher throws the ball to a teammate, whose leather glove ready to...',
    explanationAr: 'الرمي قذف الشيء بعيداً، والإمساك تلقيه والقبض عليه باليدين.',
    explanationEn: 'Throwing pitches an object into the air, and catching captures it safely.'
  },
  {
    id: 'act_fly_crawl',
    category: 'actions',
    difficulty: 'easy',
    itemA: { id: 'fly_eagle', nameAr: 'يَطِير', nameEn: 'Fly', icon: '🕊️' },
    itemB: { id: 'crawl_caterpillar', nameAr: 'يَزْحَف', nameEn: 'Crawl', icon: '🐛' },
    contextSentenceAr: 'الحمامة ترفرف بجناحيها وتطير في الجو، واليرقة الصغيرة على الأرض...',
    contextSentenceEn: 'The dove flaps wings to fly in the air, but the small caterpillar...',
    explanationAr: 'الطيران حركة في الهواء بجناحين، والزحف حركة ملاصقة للأرض.',
    explanationEn: 'Flying glides in the sky, while crawling moves closely along ground.'
  },
  {
    id: 'act_plant_harvest',
    category: 'actions',
    difficulty: 'medium',
    itemA: { id: 'plant_seedling', nameAr: 'يَزْرَع', nameEn: 'Plant', icon: '🌱' },
    itemB: { id: 'harvest_sickle', nameAr: 'يَحْصُد', nameEn: 'Harvest', icon: '🌾' },
    contextSentenceAr: 'الفلاح في أول الربيع يزرع البذور في الحقل، وفي الخريف يجمع السنابل و...',
    contextSentenceEn: 'In spring farmers plant seeds in soil, and in autumn they reap and...',
    explanationAr: 'الزراعة غرس البذور في التربة، والحصاد قطاف وجني الثمار بعد نضجها.',
    explanationEn: 'Planting places seeds in soil, and harvesting gathers mature crops.'
  },
  {
    id: 'act_remember_forget',
    category: 'actions',
    difficulty: 'advanced',
    itemA: { id: 'remember_brain', nameAr: 'يَتَذَكَّر', nameEn: 'Remember', icon: '🧠' },
    itemB: { id: 'forget_scratch', nameAr: 'يَنْسَى', nameEn: 'Forget', icon: '❓' },
    contextSentenceAr: 'الطالب الذي يراجع دروسه يتذكر الإجابة، ومن لم يركز قد...',
    contextSentenceEn: 'Studying helps the pupil remember answers, whereas being distracted may cause him to...',
    explanationAr: 'التذكر استحضار المعلومات من الذاكرة، والنسيان غيابها عن الذهن.',
    explanationEn: 'Remembering recalls knowledge from memory, while forgetting loses track.'
  },
  {
    id: 'act_win_lose',
    category: 'actions',
    difficulty: 'easy',
    itemA: { id: 'win_trophy', nameAr: 'يَفُوز', nameEn: 'Win', icon: '🏆' },
    itemB: { id: 'lose_medal', nameAr: 'يَخْسَر', nameEn: 'Lose', icon: '🥈' },
    contextSentenceAr: 'من يتدرب بجدية يفوز بالكأس الذهبي، وفي المنافسة الرياضية طرف ينتصر وطرف...',
    contextSentenceEn: 'The determined team wins the trophy, and in friendly sport one wins and one...',
    explanationAr: 'الفوز تحقيق المركز الأول والنصر، والخسارة فرصة للتعلم والمحاولة من جديد.',
    explanationEn: 'Winning captures the prize, while losing is a chance to train and improve.'
  }
];
