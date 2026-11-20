import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Volume2, Flag, Sparkles } from 'lucide-react';
import { GameHeader } from '../common/GameHeader';
import { WinCelebration } from '../common/WinCelebration';
import {
  ARABIC_HARAKAT_DATA,
  ArabicLetterHarakatSet,
  HarakaOption,
  HarakaType,
} from '../../data/arabicHarakatData';
import { RoundManager } from '../../utils/roundManager';
import { sound } from '../../utils/audio';
import { saveGameProgress } from '../../utils/storage';
import { useLanguage } from '../../i18n/LanguageContext';

const ROUND_SIZE = 8;

const PROGRESS_WIDTH_CLASSES = [
  'w-[12.5%]',
  'w-[25%]',
  'w-[37.5%]',
  'w-[50%]',
  'w-[62.5%]',
  'w-[75%]',
  'w-[87.5%]',
  'w-full',
] as const;

const LANE_THEMES = [
  {
    name: 'orange',
    archStroke: '#ea580c',
    archLight: '#fb923c',
    tunnelFill: 'rgba(249, 115, 22, 0.28)',
    cardBorder: 'border-orange-500',
    activeCardBg: 'bg-amber-50 ring-4 ring-orange-400/50 scale-105',
    inactiveCardBg: 'bg-white hover:bg-orange-50/70',
    badgeBg: 'bg-orange-100 text-orange-700',
  },
  {
    name: 'blue',
    archStroke: '#2563eb',
    archLight: '#60a5fa',
    tunnelFill: 'rgba(59, 130, 246, 0.28)',
    cardBorder: 'border-blue-500',
    activeCardBg: 'bg-amber-50 ring-4 ring-blue-400/50 scale-105',
    inactiveCardBg: 'bg-white hover:bg-blue-50/70',
    badgeBg: 'bg-blue-100 text-blue-700',
  },
  {
    name: 'purple',
    archStroke: '#9333ea',
    archLight: '#c084fc',
    tunnelFill: 'rgba(147, 51, 234, 0.28)',
    cardBorder: 'border-purple-600',
    activeCardBg: 'bg-amber-50 ring-4 ring-purple-400/50 scale-105',
    inactiveCardBg: 'bg-white hover:bg-purple-50/70',
    badgeBg: 'bg-purple-100 text-purple-700',
  },
] as const;

const CAR_LANE_POSITIONS = [
  'left-[22%] -translate-x-1/2',
  'left-1/2 -translate-x-1/2',
  'left-[78%] -translate-x-1/2',
] as const;

interface HarakatChallenge {
  letterSet: ArabicLetterHarakatSet;
  lanes: [HarakaOption, HarakaOption, HarakaOption];
  target: HarakaOption;
}

type DriveStatus = 'idle' | 'driving' | 'won' | 'wrong';

function buildRoundChallenges(manager: RoundManager<ArabicLetterHarakatSet>): HarakatChallenge[] {
  const selectedSets = manager.getNextRoundItems(ROUND_SIZE);
  const harakaCycle: HarakaType[] = manager.shuffle([
    'fatha',
    'kasra',
    'damma',
    'fatha',
    'kasra',
    'damma',
    'fatha',
    'damma',
  ]);

  return selectedSets.map((letterSet, idx) => {
    const desiredHaraka = harakaCycle[idx % harakaCycle.length];
    const target =
      letterSet.options.find((opt) => opt.haraka === desiredHaraka) ?? letterSet.options[0];
    const shuffled = manager.shuffle([...letterSet.options]) as [
      HarakaOption,
      HarakaOption,
      HarakaOption,
    ];
    return {
      letterSet,
      lanes: shuffled,
      target,
    };
  });
}

export const HarakatCarGame: React.FC<{ onGoHome: () => void }> = ({ onGoHome }) => {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const roundManagerRef = useRef<RoundManager<ArabicLetterHarakatSet> | null>(null);
  if (!roundManagerRef.current) {
    roundManagerRef.current = new RoundManager<ArabicLetterHarakatSet>(ARABIC_HARAKAT_DATA, 24);
  }

  const timersRef = useRef<number[]>([]);
  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  }, []);

  const scheduleTimer = useCallback((fn: () => void, delayMs: number) => {
    const id = window.setTimeout(() => {
      timersRef.current = timersRef.current.filter((item) => item !== id);
      fn();
    }, delayMs);
    timersRef.current.push(id);
  }, []);

  const [challenges, setChallenges] = useState<HarakatChallenge[]>(() =>
    buildRoundChallenges(roundManagerRef.current!)
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeLane, setActiveLane] = useState<0 | 1 | 2>(1);
  const [steerTilt, setSteerTilt] = useState<'left' | 'right' | 'none'>('none');
  const [driveStatus, setDriveStatus] = useState<DriveStatus>('idle');
  const [wrongLane, setWrongLane] = useState<number | null>(null);
  const [feedbackNote, setFeedbackNote] = useState<{
    type: 'prompt' | 'success' | 'tryAgain';
    text: string;
  } | null>(null);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  const currentChallenge = challenges[currentIndex];

  const speakTarget = useCallback((challenge: HarakatChallenge | undefined) => {
    if (!challenge) return;
    sound.speakText(challenge.target.phonetic, 'ar');
  }, []);

  // Automatically pronounce the target haraka when a new question appears
  useEffect(() => {
    if (isGameOver || !currentChallenge) return;
    const tId = window.setTimeout(() => {
      speakTarget(currentChallenge);
    }, 240);
    return () => window.clearTimeout(tId);
  }, [currentIndex, isGameOver, currentChallenge, speakTarget]);

  // Cleanup timers and speech on unmount
  useEffect(() => {
    return () => {
      clearAllTimers();
      sound.stopSpeech();
    };
  }, [clearAllTimers]);

  const handleRestart = useCallback(() => {
    clearAllTimers();
    sound.stopSpeech();
    const nextChallenges = buildRoundChallenges(roundManagerRef.current!);
    setChallenges(nextChallenges);
    setCurrentIndex(0);
    setActiveLane(1);
    setSteerTilt('none');
    setDriveStatus('idle');
    setWrongLane(null);
    setFeedbackNote(null);
    setScore(0);
    setIsGameOver(false);
  }, [clearAllTimers]);

  const steerToLane = useCallback(
    (nextLane: 0 | 1 | 2, direction: 'left' | 'right' | 'none') => {
      if (driveStatus === 'driving' || driveStatus === 'won' || isGameOver) return;
      if (!currentChallenge) return;

      setActiveLane(nextLane);
      setWrongLane(null);
      setSteerTilt(direction);
      setFeedbackNote(null);

      // Pronounce the sound of the letter in the entered lane immediately
      const laneOption = currentChallenge.lanes[nextLane];
      sound.playPop();
      sound.speakText(laneOption.phonetic, 'ar');

      if (direction !== 'none') {
        scheduleTimer(() => setSteerTilt('none'), 220);
      }
    },
    [currentChallenge, driveStatus, isGameOver, scheduleTimer]
  );

  const handleSteerLeft = useCallback(() => {
    const nextLane = (activeLane > 0 ? activeLane - 1 : 0) as 0 | 1 | 2;
    steerToLane(nextLane, 'left');
  }, [activeLane, steerToLane]);

  const handleSteerRight = useCallback(() => {
    const nextLane = (activeLane < 2 ? activeLane + 1 : 2) as 0 | 1 | 2;
    steerToLane(nextLane, 'right');
  }, [activeLane, steerToLane]);

  const enterGate = useCallback(
    (laneIndex: 0 | 1 | 2) => {
      if (driveStatus !== 'idle' || isGameOver || !currentChallenge) return;

      const tiltDirection =
        laneIndex < activeLane ? 'left' : laneIndex > activeLane ? 'right' : 'none';
      setActiveLane(laneIndex);
      setSteerTilt(tiltDirection);
      setWrongLane(null);
      setDriveStatus('driving');

      const chosen = currentChallenge.lanes[laneIndex];
      const target = currentChallenge.target;

      // Speak the selected lane's haraka sound immediately upon moving/selecting
      sound.speakText(chosen.phonetic, 'ar');

      scheduleTimer(() => {
        setSteerTilt('none');

        if (chosen.id === target.id) {
          const nextScore = score + 10;
          setScore(nextScore);
          setDriveStatus('won');
          setFeedbackNote({
            type: 'success',
            text: isAr
              ? `أحسنت! ${chosen.display} (${chosen.harakaNameAr})`
              : `Great! ${chosen.display} (${chosen.harakaNameEn})`,
          });
          sound.playMatch(false);

          scheduleTimer(() => {
            if (currentIndex + 1 >= challenges.length) {
              saveGameProgress('harakat-car', nextScore, true);
              setIsGameOver(true);
            } else {
              setCurrentIndex((prev) => prev + 1);
              setActiveLane(1);
              setDriveStatus('idle');
              setFeedbackNote(null);
            }
          }, 850);
        } else {
          setDriveStatus('wrong');
          setWrongLane(laneIndex);
          setFeedbackNote({
            type: 'tryAgain',
            text: isAr
              ? `هذه ${chosen.display} (${chosen.harakaNameAr}) — اتجه نحو ${target.display}`
              : `That is ${chosen.display} (${chosen.harakaNameEn}) — steer to ${target.display}`,
          });
          sound.playWrong(false);

          scheduleTimer(() => {
            setDriveStatus('idle');
          }, 600);
        }
      }, 360);
    },
    [
      activeLane,
      challenges.length,
      currentChallenge,
      currentIndex,
      driveStatus,
      isAr,
      isGameOver,
      scheduleTimer,
      score,
    ]
  );

  const progressWidthClass =
    PROGRESS_WIDTH_CLASSES[Math.min(currentIndex, PROGRESS_WIDTH_CLASSES.length - 1)];

  return (
    <div className="flex flex-col items-center w-full px-2 sm:px-4 py-2 sm:py-3">
      <GameHeader
        title={isAr ? 'سباق الحركات العربية' : 'Arabic Harakat Car Race'}
        icon="🚗"
        score={score}
        onRestart={handleRestart}
        onGoHome={onGoHome}
        accentGradient="from-[#f97316] via-[#3b82f6] to-[#9333ea]"
        badgeText={isAr ? 'الفتحة • الكسرة • الضمة' : 'Fatha • Kasra • Damma'}
      />

      {/* Main Racing World Container */}
      <div
        dir="ltr"
        className="relative w-full max-w-xl mx-auto rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800 bg-sky-300 select-none flex flex-col"
      >
        {/* === SKY + CITY + HILLS + HIGHWAY STAGE === */}
        <div className="relative w-full h-[360px] sm:h-[420px] overflow-hidden bg-gradient-to-b from-[#29b6f6] via-[#67d5fa] to-[#b3e5fc]">
          {/* Decorative Sky Backdrop SVG: Clouds, City Skyline, Green Hills, Trees, Road & Red/White Curbs */}
          <svg
            viewBox="0 0 600 420"
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full pointer-events-none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="harakatRoadGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#64748b" />
                <stop offset="45%" stopColor="#475569" />
                <stop offset="100%" stopColor="#334155" />
              </linearGradient>
              <linearGradient id="harakatHillGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#86efac" />
                <stop offset="100%" stopColor="#22c55e" />
              </linearGradient>
            </defs>

            {/* Fluffy Clouds */}
            <g fill="#ffffff" opacity="0.9">
              <ellipse cx="105" cy="52" rx="36" ry="15" />
              <circle cx="92" cy="44" r="14" />
              <circle cx="114" cy="42" r="16" />

              <ellipse cx="485" cy="64" rx="40" ry="14" />
              <circle cx="472" cy="55" r="14" />
              <circle cx="496" cy="54" r="16" />
            </g>

            {/* Stylized Distant City Buildings (Right & Left) */}
            <g fill="#93c5fd" opacity="0.55">
              <rect x="20" y="95" width="38" height="95" rx="4" />
              <rect x="64" y="115" width="28" height="75" rx="4" />
              <rect x="440" y="102" width="34" height="88" rx="4" />
              <rect x="528" y="88" width="44" height="102" rx="4" />
            </g>
            {/* Foreground Blue Tower Right */}
            <g>
              <rect x="478" y="64" width="52" height="135" rx="5" fill="#60a5fa" />
              <rect x="484" y="74" width="40" height="8" rx="2" fill="#dbeafe" opacity="0.85" />
              <rect x="484" y="90" width="40" height="8" rx="2" fill="#dbeafe" opacity="0.85" />
              <rect x="484" y="106" width="40" height="8" rx="2" fill="#dbeafe" opacity="0.85" />
              <rect x="484" y="122" width="40" height="8" rx="2" fill="#dbeafe" opacity="0.85" />
              <rect x="484" y="138" width="40" height="8" rx="2" fill="#dbeafe" opacity="0.85" />
            </g>

            {/* Green Hills */}
            <path d="M0 190 Q110 145 240 185 L600 185 L600 420 L0 420 Z" fill="url(#harakatHillGrad)" />
            <path d="M270 185 Q420 140 600 180 L600 220 L270 220 Z" fill="#4ade80" />

            {/* Stylized Green Roadside Trees */}
            <g>
              {/* Left trees */}
              <rect x="26" y="218" width="10" height="28" rx="3" fill="#78350f" />
              <circle cx="31" cy="206" r="22" fill="#16a34a" />
              <circle cx="24" cy="198" r="14" fill="#22c55e" />

              <rect x="64" y="196" width="8" height="20" rx="2" fill="#78350f" />
              <circle cx="68" cy="186" r="16" fill="#15803d" />

              {/* Right trees */}
              <rect x="556" y="214" width="10" height="30" rx="3" fill="#78350f" />
              <circle cx="561" cy="202" r="23" fill="#16a34a" />
              <circle cx="554" cy="194" r="14" fill="#22c55e" />

              <rect x="518" y="192" width="8" height="20" rx="2" fill="#78350f" />
              <circle cx="522" cy="182" r="15" fill="#15803d" />
            </g>

            {/* Perspective 3-Lane Highway */}
            <polygon points="168,178 432,178 585,420 15,420" fill="url(#harakatRoadGrad)" />

            {/* Red & White Racing Curbs (Left & Right Edges) */}
            <polygon points="154,178 168,178 15,420 -4,420" fill="#ffffff" />
            <polygon
              points="154,178 168,178 15,420 -4,420"
              fill="none"
              stroke="#ef4444"
              strokeWidth="18"
              strokeDasharray="24 24"
            />
            <polygon points="432,178 446,178 604,420 585,420" fill="#ffffff" />
            <polygon
              points="432,178 446,178 604,420 585,420"
              fill="none"
              stroke="#ef4444"
              strokeWidth="18"
              strokeDasharray="24 24"
            />

            {/* Animated White Dashed Lane Dividers */}
            <line
              x1="256"
              y1="178"
              x2="200"
              y2="420"
              stroke="#ffffff"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray="24 24"
              className="animate-road-dash"
            />
            <line
              x1="344"
              y1="178"
              x2="400"
              y2="420"
              stroke="#ffffff"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray="24 24"
              className="animate-road-dash"
            />
          </svg>

          {/* Top Progress Pill + Target Audio Banner */}
          <div className="relative z-20 flex flex-col items-center pt-2.5 sm:pt-3 px-3 gap-2">
            {/* White Progress Bar Pill matching screenshot */}
            <div className="flex items-center gap-2.5 bg-white/95 backdrop-blur-xs px-3.5 py-1.5 rounded-full shadow-md border-2 border-white">
              <div className="w-28 sm:w-36 h-3 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r from-sky-400 to-blue-600 rounded-full transition-all duration-300 ${progressWidthClass}`}
                />
              </div>
              <span className="text-xs font-black text-slate-700 tabular-nums">
                {currentIndex + 1}/{challenges.length}
              </span>
            </div>

            {/* Clear Target Haraka Prompt Pill */}
            {currentChallenge && (
              <div
                dir={isAr ? 'rtl' : 'ltr'}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-2xl shadow-lg border-2 transition-all duration-200 ${
                  feedbackNote?.type === 'success'
                    ? 'bg-emerald-500 text-white border-emerald-200 scale-105'
                    : feedbackNote?.type === 'tryAgain'
                    ? 'bg-amber-500 text-white border-amber-200'
                    : 'bg-white/95 text-slate-800 border-sky-200'
                }`}
              >
                {feedbackNote ? (
                  <span className="text-xs sm:text-sm font-black flex items-center gap-1.5">
                    {feedbackNote.type === 'success' && <Sparkles className="w-4 h-4 shrink-0" />}
                    {feedbackNote.text}
                  </span>
                ) : (
                  <>
                    <span className="text-xs sm:text-sm font-extrabold text-slate-600">
                      {isAr ? 'انطلق نحو:' : 'Drive to:'}
                    </span>
                    <span
                      dir="rtl"
                      className="text-xl sm:text-2xl font-black text-blue-700 bg-sky-100 px-2.5 py-0.5 rounded-xl border border-sky-200 leading-none"
                    >
                      {currentChallenge.target.display}
                    </span>
                    <span className="text-[11px] sm:text-xs font-bold text-slate-500">
                      ({isAr ? currentChallenge.target.harakaNameAr : currentChallenge.target.harakaNameEn})
                    </span>
                  </>
                )}
              </div>
            )}
          </div>

          {/* === 3 OVERHEAD COLOR-CODED HIGHWAY ARCHES === */}
          <div className="relative z-10 mt-3 sm:mt-4 mx-auto w-[90%] max-w-[440px] grid grid-cols-3 gap-0.5 sm:gap-1 items-end">
            {currentChallenge?.lanes.map((option, laneIdx) => {
              const theme = LANE_THEMES[laneIdx];
              const isSelected = activeLane === laneIdx;
              const isWinnerGate = driveStatus === 'won' && option.id === currentChallenge.target.id;
              const isWrongGate = wrongLane === laneIdx && driveStatus === 'wrong';

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => enterGate(laneIdx as 0 | 1 | 2)}
                  disabled={driveStatus === 'driving' || driveStatus === 'won'}
                  aria-label={`${option.display} - ${isAr ? option.harakaNameAr : option.harakaNameEn}`}
                  className={`group relative flex flex-col items-center focus:outline-none cursor-pointer transition-transform duration-200 ${
                    isSelected ? '-translate-y-0.5' : ''
                  } ${isWrongGate ? 'animate-shake' : ''}`}
                >
                  {/* Top Signboard Card inside Colored Frame */}
                  <div
                    className={`w-full rounded-2xl p-1.5 sm:p-2 shadow-lg transition-all border-2 ${
                      isWinnerGate
                        ? 'bg-emerald-500 border-emerald-200 scale-105'
                        : laneIdx === 0
                        ? 'bg-gradient-to-b from-orange-400 to-orange-600 border-orange-300'
                        : laneIdx === 1
                        ? 'bg-gradient-to-b from-blue-400 to-blue-600 border-blue-300'
                        : 'bg-gradient-to-b from-purple-400 to-purple-700 border-purple-300'
                    }`}
                  >
                    <div
                      dir="rtl"
                      className={`w-full rounded-xl py-2 sm:py-2.5 flex flex-col items-center justify-center shadow-inner transition-colors ${
                        isWinnerGate
                          ? 'bg-emerald-50 text-emerald-700'
                          : isSelected
                          ? 'bg-amber-50 text-slate-900'
                          : 'bg-white text-slate-900 group-hover:bg-slate-50'
                      }`}
                    >
                      <span className="font-heading text-3xl sm:text-4xl font-black leading-none tracking-normal">
                        {option.display}
                      </span>
                    </div>
                  </div>

                  {/* Arch Pillars + Curved Tunnel Portal */}
                  <div className="relative w-full h-16 sm:h-20 flex justify-between items-stretch px-0.5">
                    {/* Left Pillar */}
                    <div
                      className={`w-2.5 sm:w-3 rounded-b-md shadow-md ${
                        laneIdx === 0
                          ? 'bg-orange-500'
                          : laneIdx === 1
                          ? 'bg-blue-500'
                          : 'bg-purple-600'
                      }`}
                    />
                    {/* Tunnel Glow */}
                    <div
                      className={`flex-1 mx-0.5 rounded-t-full border-t-4 transition-opacity ${
                        laneIdx === 0
                          ? 'border-orange-400 bg-orange-500/25'
                          : laneIdx === 1
                          ? 'border-blue-400 bg-blue-500/25'
                          : 'border-purple-400 bg-purple-600/25'
                      } ${isSelected ? 'opacity-100' : 'opacity-75'}`}
                    />
                    {/* Right Pillar */}
                    <div
                      className={`w-2.5 sm:w-3 rounded-b-md shadow-md ${
                        laneIdx === 0
                          ? 'bg-orange-500'
                          : laneIdx === 1
                          ? 'bg-blue-500'
                          : 'bg-purple-600'
                      }`}
                    />

                    {/* Cute decorative cloud dots at arch joints matching screenshot */}
                    <span className="absolute -top-1.5 -left-1 w-4 h-3 rounded-full bg-white/95 shadow-xs pointer-events-none" />
                    <span className="absolute -top-1.5 -right-1 w-4 h-3 rounded-full bg-white/95 shadow-xs pointer-events-none" />
                  </div>
                </button>
              );
            })}
          </div>

          {/* === CUTE RED CAR ON THE 3-LANE HIGHWAY === */}
          <div
            data-testid="racing-car"
            data-lane={activeLane}
            className={`absolute bottom-5 sm:bottom-6 z-20 w-24 sm:w-28 transition-all duration-300 ease-out pointer-events-none ${
              CAR_LANE_POSITIONS[activeLane]
            } ${
              driveStatus === 'driving' || driveStatus === 'won'
                ? '-translate-y-20 scale-75'
                : driveStatus === 'wrong'
                ? 'animate-shake'
                : steerTilt === 'left'
                ? '-rotate-6 scale-105'
                : steerTilt === 'right'
                ? 'rotate-6 scale-105'
                : 'translate-y-0 scale-100'
            }`}
          >
            {/* Cute Rear-View Red Toy Car SVG */}
            <svg viewBox="0 0 120 92" className="w-full h-auto drop-shadow-xl" aria-hidden="true">
              {/* Road Shadow */}
              <ellipse cx="60" cy="82" rx="44" ry="8" fill="rgba(15, 23, 42, 0.45)" />

              {/* Tires */}
              <rect x="14" y="54" width="16" height="24" rx="6" fill="#0f172a" />
              <rect x="90" y="54" width="16" height="24" rx="6" fill="#0f172a" />
              <rect x="18" y="60" width="6" height="10" rx="2" fill="#334155" />
              <rect x="96" y="60" width="6" height="10" rx="2" fill="#334155" />

              {/* Car Cabin / Roof */}
              <path
                d="M28 36 Q32 10 60 10 Q88 10 92 36 Z"
                fill="#dc2626"
                stroke="#b91c1c"
                strokeWidth="2"
              />
              {/* White Roof Accent */}
              <path d="M36 16 Q60 11 84 16 L82 22 Q60 18 38 22 Z" fill="#f8fafc" />
              {/* Rear Windshield */}
              <path
                d="M34 36 Q38 20 60 20 Q82 20 86 36 Z"
                fill="#e2e8f0"
                stroke="#94a3b8"
                strokeWidth="1.5"
              />

              {/* Main Lower Car Body */}
              <rect
                x="14"
                y="34"
                width="92"
                height="36"
                rx="14"
                fill="#ef4444"
                stroke="#b91c1c"
                strokeWidth="2"
              />
              {/* Gloss Highlight */}
              <rect x="24" y="38" width="72" height="6" rx="3" fill="#fca5a5" opacity="0.55" />

              {/* Rear Tail Lights */}
              <circle cx="29" cy="52" r="7" fill="#fef08a" stroke="#dc2626" strokeWidth="2.5" />
              <circle cx="29" cy="52" r="3.5" fill="#fb7185" />
              <circle cx="91" cy="52" r="7" fill="#fef08a" stroke="#dc2626" strokeWidth="2.5" />
              <circle cx="91" cy="52" r="3.5" fill="#fb7185" />

              {/* License Plate / Rear Emblem */}
              <rect x="46" y="48" width="28" height="11" rx="4" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
              <rect x="52" y="52" width="16" height="3" rx="1.5" fill="#94a3b8" />

              {/* Rear Bumper */}
              <rect x="18" y="64" width="84" height="8" rx="4" fill="#cbd5e1" />
            </svg>
          </div>
        </div>

        {/* === BOTTOM CONTROL DOCK (Matching Screenshot: < | 3 Colored Cards | > + Speaker) === */}
        <div className="bg-gradient-to-b from-[#334155] to-[#1e293b] px-2.5 sm:px-4 pt-3 pb-4 flex flex-col items-center gap-3">
          <div className="w-full flex items-center justify-between gap-1.5 sm:gap-2.5">
            {/* Steer Left Button (<) */}
            <button
              type="button"
              onClick={handleSteerLeft}
              disabled={driveStatus === 'driving' || driveStatus === 'won'}
              aria-label={isAr ? 'الانتقال لليسار' : 'Move left'}
              className="w-11 h-11 sm:w-13 sm:h-13 shrink-0 rounded-full bg-white hover:bg-slate-100 active:scale-90 text-slate-800 shadow-lg border-2 border-slate-200 flex items-center justify-center transition-all cursor-pointer disabled:opacity-50"
            >
              <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.75]" />
            </button>

            {/* 3 Lane Color-Coded Letter Cards */}
            <div className="flex-1 grid grid-cols-3 gap-1.5 sm:gap-2.5">
              {currentChallenge?.lanes.map((option, laneIdx) => {
                const theme = LANE_THEMES[laneIdx];
                const isSelected = activeLane === laneIdx;
                const isWrongCard = wrongLane === laneIdx && driveStatus === 'wrong';

                return (
                  <button
                    key={option.id}
                    type="button"
                    dir="rtl"
                    onClick={() => enterGate(laneIdx as 0 | 1 | 2)}
                    disabled={driveStatus === 'driving' || driveStatus === 'won'}
                    aria-label={`${option.display} (${option.phonetic})`}
                    className={`rounded-2xl py-2 sm:py-2.5 px-1 border-4 shadow-lg flex flex-col items-center justify-center transition-all cursor-pointer active:scale-95 ${
                      theme.cardBorder
                    } ${isSelected ? theme.activeCardBg : theme.inactiveCardBg} ${
                      isWrongCard ? 'animate-shake' : ''
                    }`}
                  >
                    <span className="font-heading text-2xl sm:text-3xl font-black text-slate-900 leading-none">
                      {option.display}
                    </span>
                    <span className={`mt-1 text-[10px] sm:text-[11px] font-extrabold px-2 py-0.5 rounded-full ${theme.badgeBg}`}>
                      {isAr ? option.harakaNameAr : option.harakaNameEn}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Steer Right Button (>) */}
            <button
              type="button"
              onClick={handleSteerRight}
              disabled={driveStatus === 'driving' || driveStatus === 'won'}
              aria-label={isAr ? 'الانتقال لليمين' : 'Move right'}
              className="w-11 h-11 sm:w-13 sm:h-13 shrink-0 rounded-full bg-white hover:bg-slate-100 active:scale-90 text-slate-800 shadow-lg border-2 border-slate-200 flex items-center justify-center transition-all cursor-pointer disabled:opacity-50"
            >
              <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.75]" />
            </button>
          </div>

          {/* Yellow Circular Speaker Button (center) + Go/Confirm Current Lane Button */}
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                speakTarget(currentChallenge);
              }}
              aria-label={isAr ? 'سماع الحرف المطلوب' : 'Hear target sound'}
              title={isAr ? 'سماع الحرف المطلوب' : 'Hear target sound'}
              className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-gradient-to-b from-amber-300 to-amber-500 hover:from-amber-200 hover:to-amber-400 active:scale-90 text-slate-900 shadow-xl border-4 border-amber-200 flex items-center justify-center transition-all cursor-pointer"
            >
              <Volume2 className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.5]" />
            </button>

            <button
              type="button"
              onClick={() => enterGate(activeLane)}
              disabled={driveStatus === 'driving' || driveStatus === 'won'}
              dir={isAr ? 'rtl' : 'ltr'}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 active:scale-95 text-white font-black text-sm sm:text-base px-5 py-2.5 rounded-full shadow-lg border-2 border-emerald-300 transition-all cursor-pointer disabled:opacity-50"
            >
              <Flag className="w-4 h-4" />
              <span>{isAr ? 'انطلق للبوابة!' : 'Drive Through!'}</span>
            </button>
          </div>
        </div>
      </div>

      {isGameOver && (
        <WinCelebration
          score={score}
          message={
            isAr
              ? '🎉 رائع يا بطل! أتممت سباق الفتحة والكسرة والضمة ببراعة!'
              : '🎉 Awesome! You mastered Arabic Fatha, Kasra, and Damma!'
          }
          onRestart={handleRestart}
          onGoHome={onGoHome}
          stars={score >= 70 ? 3 : score >= 50 ? 2 : 1}
        />
      )}
    </div>
  );
};
