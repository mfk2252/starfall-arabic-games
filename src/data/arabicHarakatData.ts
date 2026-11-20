export type HarakaType = 'fatha' | 'kasra' | 'damma';

export interface HarakaOption {
  id: string;
  baseLetter: string;
  haraka: HarakaType;
  harakaNameAr: string;
  harakaNameEn: string;
  harakaSymbol: string;
  display: string;
  /** Phonetic Arabic spelling tuned so SpeechSynthesis pronounces the short vowel clearly (e.g. دُ -> دُو / دو) */
  phonetic: string;
  spokenHintAr: string;
  spokenHintEn: string;
}

export interface ArabicLetterHarakatSet {
  id: string;
  baseLetter: string;
  letterNameAr: string;
  options: [HarakaOption, HarakaOption, HarakaOption];
}

interface RawLetterSpec {
  id: string;
  baseLetter: string;
  letterNameAr: string;
  fathaDisplay?: string;
  fathaPhonetic: string;
  kasraDisplay?: string;
  kasraPhonetic: string;
  dammaDisplay?: string;
  dammaPhonetic: string;
}

const RAW_LETTERS: RawLetterSpec[] = [
  { id: 'alif', baseLetter: 'أ', letterNameAr: 'ألف', fathaDisplay: 'أَ', fathaPhonetic: 'أَا', kasraDisplay: 'إِ', kasraPhonetic: 'إِي', dammaDisplay: 'أُ', dammaPhonetic: 'أُو' },
  { id: 'baa', baseLetter: 'ب', letterNameAr: 'باء', fathaPhonetic: 'بَا', kasraPhonetic: 'بِي', dammaPhonetic: 'بُو' },
  { id: 'taa', baseLetter: 'ت', letterNameAr: 'تاء', fathaPhonetic: 'تَا', kasraPhonetic: 'تِي', dammaPhonetic: 'تُو' },
  { id: 'thaa', baseLetter: 'ث', letterNameAr: 'ثاء', fathaPhonetic: 'ثَا', kasraPhonetic: 'ثِي', dammaPhonetic: 'ثُو' },
  { id: 'jeem', baseLetter: 'ج', letterNameAr: 'جيم', fathaPhonetic: 'جَا', kasraPhonetic: 'جِي', dammaPhonetic: 'جُو' },
  { id: 'haa', baseLetter: 'ح', letterNameAr: 'حاء', fathaPhonetic: 'حَا', kasraPhonetic: 'حِي', dammaPhonetic: 'حُو' },
  { id: 'khaa', baseLetter: 'خ', letterNameAr: 'خاء', fathaPhonetic: 'خَا', kasraPhonetic: 'خِي', dammaPhonetic: 'خُو' },
  { id: 'daal', baseLetter: 'د', letterNameAr: 'دال', fathaPhonetic: 'دَا', kasraPhonetic: 'دِي', dammaPhonetic: 'دُو' },
  { id: 'dhaal', baseLetter: 'ذ', letterNameAr: 'ذال', fathaPhonetic: 'ذَا', kasraPhonetic: 'ذِي', dammaPhonetic: 'ذُو' },
  { id: 'raa', baseLetter: 'ر', letterNameAr: 'راء', fathaPhonetic: 'رَا', kasraPhonetic: 'رِي', dammaPhonetic: 'رُو' },
  { id: 'zaay', baseLetter: 'ز', letterNameAr: 'زاي', fathaPhonetic: 'زَا', kasraPhonetic: 'زِي', dammaPhonetic: 'زُو' },
  { id: 'seen', baseLetter: 'س', letterNameAr: 'سين', fathaPhonetic: 'سَا', kasraPhonetic: 'سِي', dammaPhonetic: 'سُو' },
  { id: 'sheen', baseLetter: 'ش', letterNameAr: 'شين', fathaPhonetic: 'شَا', kasraPhonetic: 'شِي', dammaPhonetic: 'شُو' },
  { id: 'saad', baseLetter: 'ص', letterNameAr: 'صاد', fathaPhonetic: 'صَا', kasraPhonetic: 'صِي', dammaPhonetic: 'صُو' },
  { id: 'daad', baseLetter: 'ض', letterNameAr: 'ضاد', fathaPhonetic: 'ضَا', kasraPhonetic: 'ضِي', dammaPhonetic: 'ضُو' },
  { id: 'taa_emph', baseLetter: 'ط', letterNameAr: 'طاء', fathaPhonetic: 'طَا', kasraPhonetic: 'طِي', dammaPhonetic: 'طُو' },
  { id: 'dhaa_emph', baseLetter: 'ظ', letterNameAr: 'ظاء', fathaPhonetic: 'ظَا', kasraPhonetic: 'ظِي', dammaPhonetic: 'ظُو' },
  { id: 'ayn', baseLetter: 'ع', letterNameAr: 'عين', fathaPhonetic: 'عَا', kasraPhonetic: 'عِي', dammaPhonetic: 'عُو' },
  { id: 'ghayn', baseLetter: 'غ', letterNameAr: 'غين', fathaPhonetic: 'غَا', kasraPhonetic: 'غِي', dammaPhonetic: 'غُو' },
  { id: 'faa', baseLetter: 'ف', letterNameAr: 'فاء', fathaPhonetic: 'فَا', kasraPhonetic: 'فِي', dammaPhonetic: 'فُو' },
  { id: 'qaaf', baseLetter: 'ق', letterNameAr: 'قاف', fathaPhonetic: 'قَا', kasraPhonetic: 'قِي', dammaPhonetic: 'قُو' },
  { id: 'kaaf', baseLetter: 'ك', letterNameAr: 'كاف', fathaPhonetic: 'كَا', kasraPhonetic: 'كِي', dammaPhonetic: 'كُو' },
  { id: 'laam', baseLetter: 'ل', letterNameAr: 'لام', fathaPhonetic: 'لَا', kasraPhonetic: 'لِي', dammaPhonetic: 'لُو' },
  { id: 'meem', baseLetter: 'م', letterNameAr: 'ميم', fathaPhonetic: 'مَا', kasraPhonetic: 'مِي', dammaPhonetic: 'مُو' },
  { id: 'noon', baseLetter: 'ن', letterNameAr: 'نون', fathaPhonetic: 'نَا', kasraPhonetic: 'نِي', dammaPhonetic: 'نُو' },
  { id: 'haa_soft', baseLetter: 'ه', letterNameAr: 'هاء', fathaPhonetic: 'هَا', kasraPhonetic: 'هِي', dammaPhonetic: 'هُو' },
  { id: 'waaw', baseLetter: 'و', letterNameAr: 'واو', fathaPhonetic: 'وَا', kasraPhonetic: 'وِي', dammaPhonetic: 'وُو' },
  { id: 'yaa', baseLetter: 'ي', letterNameAr: 'ياء', fathaPhonetic: 'يَا', kasraPhonetic: 'يِي', dammaPhonetic: 'يُو' },
];

export const ARABIC_HARAKAT_DATA: ArabicLetterHarakatSet[] = RAW_LETTERS.map((spec) => {
  const fathaDisplay = spec.fathaDisplay ?? `${spec.baseLetter}\u064E`;
  const kasraDisplay = spec.kasraDisplay ?? `${spec.baseLetter}\u0650`;
  const dammaDisplay = spec.dammaDisplay ?? `${spec.baseLetter}\u064F`;

  return {
    id: spec.id,
    baseLetter: spec.baseLetter,
    letterNameAr: spec.letterNameAr,
    options: [
      {
        id: `${spec.id}-fatha`,
        baseLetter: spec.baseLetter,
        haraka: 'fatha',
        harakaNameAr: 'الفتحة',
        harakaNameEn: 'Fatha',
        harakaSymbol: 'ـَ',
        display: fathaDisplay,
        phonetic: spec.fathaPhonetic,
        spokenHintAr: `${spec.letterNameAr} بالفتحة: ${spec.fathaPhonetic}`,
        spokenHintEn: `Fatha (${spec.fathaPhonetic})`,
      },
      {
        id: `${spec.id}-kasra`,
        baseLetter: spec.baseLetter,
        haraka: 'kasra',
        harakaNameAr: 'الكسرة',
        harakaNameEn: 'Kasra',
        harakaSymbol: 'ـِ',
        display: kasraDisplay,
        phonetic: spec.kasraPhonetic,
        spokenHintAr: `${spec.letterNameAr} بالكسرة: ${spec.kasraPhonetic}`,
        spokenHintEn: `Kasra (${spec.kasraPhonetic})`,
      },
      {
        id: `${spec.id}-damma`,
        baseLetter: spec.baseLetter,
        haraka: 'damma',
        harakaNameAr: 'الضمة',
        harakaNameEn: 'Damma',
        harakaSymbol: 'ـُ',
        display: dammaDisplay,
        phonetic: spec.dammaPhonetic,
        spokenHintAr: `${spec.letterNameAr} بالضمة: ${spec.dammaPhonetic}`,
        spokenHintEn: `Damma (${spec.dammaPhonetic})`,
      },
    ],
  };
});
