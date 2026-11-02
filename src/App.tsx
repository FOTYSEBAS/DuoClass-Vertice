/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  User,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
  writeBatch,
} from 'firebase/firestore';
import {
  AlertCircle,
  BarChart3,
  BookOpen,
  Check,
  ChevronDown,
  ChevronUp,
  Dumbbell,
  FastForward,
  Flame,
  Heart,
  Home,
  Keyboard,
  Lock,
  LogOut,
  MoreHorizontal,
  RotateCcw,
  Sparkles,
  Star,
  Trophy,
  X,
  Zap,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  auth,
  db,
  generateSafeId,
  googleProvider,
  handleFirestoreError,
  OperationType,
  sanitizeString,
  VALIDATION_CONSTANTS,
} from './firebase';
import {
  ARITHMETIC_NODES,
  ARITHMETIC_SECTIONS,
  ArithmeticNode,
  ArithmeticSection,
} from './mathCurriculum';
import { PHYSICS_NODES, PHYSICS_SECTIONS } from './physicsCurriculum';
import { CHEMISTRY_NODES, CHEMISTRY_SECTIONS } from './chemistryCurriculum';
import { SOCIALES_NODES, SOCIALES_SECTIONS } from './socialesCurriculum';

type CourseId = 'sociales' | 'quimica' | 'fisica' | 'matematicas';
type ModuleId = 1 | 2 | 3 | 4 | 5;

interface CourseMetaInfo {
  id: CourseId;
  title: string;
  shortLabel: string;
  badgeColor: string;
  accentText: string;
  modulesCount: number;
  sectionsCount: number;
  collectionName:
    | 'socialesProgress'
    | 'chemistryProgress'
    | 'physicsProgress'
    | 'mathProgress';
}

const COURSES_CATALOG: CourseMetaInfo[] = [
  {
    id: 'sociales',
    title: 'Ciencias Sociales',
    shortLabel: 'SOCIALES',
    badgeColor: '#FF9600',
    accentText: 'text-[#FF9600]',
    modulesCount: 5,
    sectionsCount: 20,
    collectionName: 'socialesProgress',
  },
  {
    id: 'quimica',
    title: 'Química',
    shortLabel: 'QUÍMICA',
    badgeColor: '#00CD9C',
    accentText: 'text-[#00CD9C]',
    modulesCount: 3,
    sectionsCount: 22,
    collectionName: 'chemistryProgress',
  },
  {
    id: 'fisica',
    title: 'Física',
    shortLabel: 'FÍSICA',
    badgeColor: '#1CB0F6',
    accentText: 'text-[#1CB0F6]',
    modulesCount: 3,
    sectionsCount: 20,
    collectionName: 'physicsProgress',
  },
  {
    id: 'matematicas',
    title: 'Matemáticas',
    shortLabel: 'MATEMÁTICAS',
    badgeColor: '#58CC02',
    accentText: 'text-[#58CC02]',
    modulesCount: 3,
    sectionsCount: 20,
    collectionName: 'mathProgress',
  },
];

/**
 * Duolingo-style rounded rectangular course flag/icon badge matching the user's screenshots
 */
function CourseFlagBadge({
  course,
  size = 'md',
}: {
  course: CourseId;
  size?: 'sm' | 'md';
}) {
  const dims = size === 'sm' ? 'w-8 h-6 rounded-md' : 'w-9 h-7 rounded-lg';

  if (course === 'sociales') {
    return (
      <div
        className={`${dims} bg-[#FF9600] border-2 border-white/90 shadow-sm flex items-center justify-center shrink-0 overflow-hidden relative`}
        aria-hidden="true"
      >
        {/* Colombian History / Social Sciences Tricolor Accent + Dove/Book Icon */}
        <div className="absolute inset-x-0 top-0 h-1 bg-[#FFC800]" />
        <div className="absolute inset-x-0 bottom-0 h-1 bg-[#1CB0F6]" />
        <svg className="w-4 h-4 text-white relative z-10" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 3L2 8l10 5 10-5-10-5zm-6 7.5v5.2c0 1.8 2.7 3.3 6 3.3s6-1.5 6-3.3v-5.2l-6 3-6-3z" />
        </svg>
      </div>
    );
  }

  if (course === 'quimica') {
    return (
      <div
        className={`${dims} bg-[#00CD9C] border-2 border-white/90 shadow-sm flex items-center justify-center shrink-0`}
        aria-hidden="true"
      >
        {/* Erlenmeyer Flask / Atomic Chemistry Icon */}
        <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9 3h6v2h-1v3.3l4.6 7.7A3 3 0 0 1 16.03 20H7.97a3 3 0 0 1-2.57-4.54L10 8.3V5H9V3zm3 7.1L8.1 16.5a1 1 0 0 0 .86 1.5h6.08a1 1 0 0 0 .86-1.5L12 10.1z" />
        </svg>
      </div>
    );
  }

  if (course === 'fisica') {
    return (
      <div
        className={`${dims} bg-[#1CB0F6] border-2 border-white/90 shadow-sm flex items-center justify-center shrink-0`}
        aria-hidden="true"
      >
        <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />
        </svg>
      </div>
    );
  }

  return (
    <div
      className={`${dims} bg-[#58CC02] border-2 border-white/90 shadow-sm flex items-center justify-center shrink-0 font-mono font-extrabold text-[11px] text-white leading-none`}
      aria-hidden="true"
    >
      ∑±
    </div>
  );
}

/**
 * Interactive Course Icon + Duolingo-style 'MIS CURSOS' Popover Menu
 * Matches image_f7da1fd4.png (top status bar badge + level counter)
 * and image_4899740f.png (dropdown menu with MIS CURSOS, course list, and '+ Agrega un nuevo curso').
 */
function CourseSelectorDropdown({
  activeCourse,
  levelCount,
  isOpen,
  onToggle,
  onSelectCourse,
  align = 'left',
}: {
  activeCourse: CourseId;
  levelCount: number;
  isOpen: boolean;
  onToggle: () => void;
  onSelectCourse: (course: CourseId) => void;
  align?: 'left' | 'right';
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        onToggle();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onToggle]);

  return (
    <div ref={containerRef} className="relative inline-block select-none">
      {/* Top Bar Trigger: [Course Flag Badge] + [Count] exactly like image_f7da1fd4.png */}
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-[#202F36]/70 transition-colors cursor-pointer"
        title="Mis cursos: escoger entre Química, Física y Matemáticas (Tecla C)"
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <CourseFlagBadge course={activeCourse} />
        <span className="font-mono font-extrabold text-sm sm:text-base text-white tabular-nums">
          {levelCount}
        </span>
      </button>

      {/* Dropdown Popover matching image_4899740f.png */}
      {isOpen && (
        <div
          role="menu"
          className={`absolute top-full mt-3 w-64 rounded-2xl bg-[#131F24] border-2 border-[#26353D] shadow-2xl z-50 overflow-visible ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
        >
          {/* Top Caret Arrow pointing to the Course Icon */}
          <div
            className={`w-3.5 h-3.5 bg-[#131F24] border-l-2 border-t-2 border-[#26353D] rotate-45 absolute -top-2 ${
              align === 'right' ? 'right-7' : 'left-6'
            }`}
          />

          {/* Header: MIS CURSOS */}
          <div className="px-5 py-3.5 border-b-2 border-[#26353D]">
            <span className="font-display text-xs font-extrabold uppercase tracking-wider text-[#52656D]">
              MIS CURSOS
            </span>
          </div>

          {/* Course List */}
          <div className="max-h-64 overflow-y-auto divide-y divide-[#202F36]/60">
            {COURSES_CATALOG.map((item) => {
              const isSelected = item.id === activeCourse;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    onSelectCourse(item.id);
                    onToggle();
                  }}
                  className={`w-full px-5 py-3.5 flex items-center justify-between gap-3.5 transition-colors cursor-pointer text-left ${
                    isSelected
                      ? 'bg-[#182B34]'
                      : 'hover:bg-[#202F36]/60'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <CourseFlagBadge course={item.id} />
                    <div className="truncate">
                      <span
                        className={`font-display text-sm sm:text-base font-extrabold block leading-tight ${
                          isSelected ? 'text-[#1CB0F6]' : 'text-white'
                        }`}
                      >
                        {item.title}
                      </span>
                      <span className="text-[10px] font-mono text-neutral-400">
                        {item.modulesCount} módulos · {item.sectionsCount} secciones
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Bottom Row: + Agrega un nuevo curso */}
          <button
            type="button"
            onClick={() => {
              const order: CourseId[] = [
                'sociales',
                'quimica',
                'fisica',
                'matematicas',
              ];
              const nextCourse =
                order[(order.indexOf(activeCourse) + 1) % order.length];
              onSelectCourse(nextCourse);
              onToggle();
            }}
            className="w-full px-5 py-3.5 border-t-2 border-[#26353D] hover:bg-[#202F36]/60 flex items-center gap-3.5 transition-colors cursor-pointer text-left rounded-b-2xl"
          >
            <div className="w-9 h-7 rounded-lg border-2 border-[#37464F] flex items-center justify-center text-[#52656D] font-mono text-lg font-extrabold shrink-0">
              +
            </div>
            <span className="font-display text-sm font-extrabold text-white leading-tight">
              Agrega un nuevo curso
            </span>
          </button>
        </div>
      )}
    </div>
  );
}

interface CourseProgressData {
  uid: string;
  course: CourseId;
  currentNodeIndex: number;
  xp: number;
  streak: number;
  gems: number;
  hearts: number;
  completedLessonsCount: number;
}

type BottomTab = 'aprender' | 'practica' | 'guia' | 'logros' | 'perfil';

const DAILY_XP_GOAL = 50;

function detectDeviceSummary(): string {
  if (typeof navigator === 'undefined') return 'Navegador Web';
  const ua = navigator.userAgent;
  const browser = ua.includes('Edg')
    ? 'Edge'
    : ua.includes('Chrome')
    ? 'Chrome'
    : ua.includes('Firefox')
    ? 'Firefox'
    : ua.includes('Safari')
    ? 'Safari'
    : 'Navegador';
  return sanitizeString(browser, VALIDATION_CONSTANTS.MAX_DEVICE_LABEL, 'Web');
}

function normalizeMathAnswer(val: string): string {
  return val.trim().replace(/\s+/g, '').toLowerCase();
}

/** Custom SVG Gem Icon matching Duolingo blue gem */
function GemIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 3H18L22 9L12 21L2 9L6 3Z"
        fill="#1CB0F6"
        stroke="#1185BA"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M6 3L12 9L18 3M2 9H22M12 9V21"
        stroke="#72D1FC"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Custom SVG Donut / Ring Chart for the 'Meta diaria' card
 * Animates smoothly from 0% to target percentage on application load and XP updates.
 */
function DailyGoalRingChart({
  xp,
  goal = DAILY_XP_GOAL,
}: {
  xp: number;
  goal?: number;
}) {
  const targetPercent = Math.min(100, Math.max(0, Math.round((xp / goal) * 100)));
  const [animatedPercent, setAnimatedPercent] = useState(0);

  useEffect(() => {
    const timer = requestAnimationFrame(() => {
      const timeout = setTimeout(() => {
        setAnimatedPercent(targetPercent);
      }, 80);
      return () => clearTimeout(timeout);
    });
    return () => cancelAnimationFrame(timer);
  }, [targetPercent]);

  const size = 96;
  const strokeWidth = 10;
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (animatedPercent / 100) * circumference;

  const isCompleted = targetPercent >= 100;
  const ringColor = isCompleted ? '#58CC02' : '#FFC800';
  const secondaryRingColor = isCompleted ? '#78E026' : '#FFE066';

  return (
    <div className="rounded-2xl bg-[#131F24] border-2 border-[#26353D] p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display text-sm font-extrabold text-white">
            Meta diaria
          </h3>
          <p className="text-[11px] text-neutral-400">
            {isCompleted
              ? '¡Objetivo de hoy completado!'
              : `Faltan ${Math.max(0, goal - xp)} XP para tu meta`}
          </p>
        </div>
        <span
          className={`font-mono text-xs font-extrabold px-2.5 py-1 rounded-lg tabular-nums ${
            isCompleted
              ? 'bg-[#58CC02]/15 text-[#58CC02]'
              : 'bg-[#FFC800]/15 text-[#FFC800]'
          }`}
        >
          {Math.min(goal, xp)} / {goal} XP
        </span>
      </div>

      <div className="flex items-center gap-4">
        {/* Custom SVG Donut Ring Chart */}
        <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className="-rotate-90 transform overflow-visible"
            role="img"
            aria-label={`Progreso de meta diaria: ${targetPercent}%`}
          >
            <defs>
              <linearGradient id="dailyGoalRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={secondaryRingColor} />
                <stop offset="100%" stopColor={ringColor} />
              </linearGradient>
            </defs>

            {/* Background Track Ring */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="transparent"
              stroke="#202F36"
              strokeWidth={strokeWidth}
            />

            {/* Animated Foreground Progress Ring */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="transparent"
              stroke="url(#dailyGoalRingGrad)"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{
                transition: 'stroke-dashoffset 1.1s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            />
          </svg>

          {/* Center Percentage Readout */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none">
            <span
              className="font-mono text-lg font-extrabold tabular-nums leading-none"
              style={{ color: ringColor }}
            >
              {animatedPercent}%
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mt-0.5">
              XP
            </span>
          </div>
        </div>

        {/* Right Side Legend & Status Breakdown */}
        <div className="flex-1 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-400 flex items-center gap-1.5">
              <Zap
                className="w-3.5 h-3.5 shrink-0"
                style={{ color: ringColor, fill: ringColor }}
              />
              <span>Completado</span>
            </span>
            <span className="font-mono font-extrabold text-white tabular-nums">
              {targetPercent}%
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-400">Total acumulado</span>
            <span className="font-mono font-extrabold text-[#FFC800] tabular-nums">
              {xp} XP
            </span>
          </div>

          <div className="pt-1 border-t border-[#26353D] flex items-center justify-between text-[11px]">
            <span className="text-neutral-400">Estado</span>
            <span
              className={`font-bold ${
                isCompleted ? 'text-[#58CC02]' : 'text-[#FFC800]'
              }`}
            >
              {isCompleted ? 'Meta superada' : 'En progreso'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * ============================================================================
 * UI FEATURE 1 FROM IMAGE (`image_045d50ab.png`):
 * "Potenciadores" -> "Protector de racha" (`2 / 2 EQUIPADOS`)
 * ============================================================================
 */
function StreakFreezeCrystalSvg({ className = 'w-14 h-16' }: { className?: string }) {
  return (
    <svg
      className={`${className} shrink-0 select-none`}
      viewBox="0 0 64 76"
      fill="none"
      aria-hidden="true"
    >
      {/* Outer Icy Crystal Body with bottom icicle drips */}
      <path
        d="M32 4L44 18L50 14L56 34V54L50 62V69C50 70.7 47.5 70.7 47.5 69V63L41 67L35 63V68C35 69.5 32.5 69.5 32.5 68V63L26 67V73C26 74.8 23 74.8 23 73V65L16 61V54L10 46V20L20 24L32 4Z"
        fill="#72D1FC"
        stroke="#49B9F9"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Inner Facet Highlight */}
      <path
        d="M32 9L42 22L48 19L52 34L44 52L22 54L14 43V25L22 28L32 9Z"
        fill="#49B9F9"
      />
      {/* Inner Flame Drop Frozen Inside */}
      <path
        d="M33 28C33 28 23 38 25 46C26.5 52 34 54 39 49C43 45 40 36 33 28Z"
        fill="#0A96EA"
      />
      <path
        d="M32 34C32 34 27 40 28 45C29 48.5 33.5 49.5 36 46.5C38 44 36 38.5 32 34Z"
        fill="#1CB0F6"
      />
      {/* White Diamond Sparkles */}
      <rect
        x="18"
        y="30"
        width="6"
        height="6"
        transform="rotate(45 18 30)"
        fill="#FFFFFF"
      />
      <rect
        x="43"
        y="43"
        width="5.5"
        height="5.5"
        transform="rotate(45 43 43)"
        fill="#FFFFFF"
      />
    </svg>
  );
}

function PotenciadoresStreakFreezeSection({
  equippedCount,
  maxCount = 2,
  onToggleOrRefill,
}: {
  equippedCount: number;
  maxCount?: number;
  onToggleOrRefill: () => void;
}) {
  const isFullyEquipped = equippedCount >= maxCount;
  return (
    <div className="rounded-2xl bg-[#131F24] border-2 border-[#26353D] p-4 sm:p-5 space-y-4">
      {/* Header: Potenciadores + Divider matching image_045d50ab.png */}
      <div className="pb-3 border-b-2 border-[#26353D]">
        <h3 className="font-display text-lg font-extrabold text-white tracking-tight">
          Potenciadores
        </h3>
      </div>

      {/* Protector de racha wide horizontal row matching image_045d50ab.png without vertical text cramping */}
      <div className="flex items-center justify-between gap-3.5 pt-1">
        <div className="flex items-center gap-3.5 min-w-0 flex-1">
          <StreakFreezeCrystalSvg className="w-12 h-14 shrink-0" />
          <div className="space-y-1.5 min-w-0 flex-1">
            <div className="flex items-center flex-wrap gap-2">
              <span className="font-display text-[15px] sm:text-base font-extrabold text-white whitespace-nowrap leading-tight">
                Protector de racha
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#1E2F23] border border-[#2D4833] font-mono text-[10px] font-extrabold uppercase tracking-wider text-[#78E026] whitespace-nowrap">
                {equippedCount} / {maxCount} EQUIPADOS
              </span>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Te permite mantener tu racha cuando no usas la app por un día.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onToggleOrRefill}
          className={`px-4 py-2.5 rounded-2xl border-2 font-display text-[11px] font-extrabold uppercase tracking-widest shrink-0 whitespace-nowrap transition-all cursor-pointer ${
            isFullyEquipped
              ? 'bg-transparent border-[#2E3E46] text-[#52656D] hover:border-[#37464F] hover:text-neutral-400'
              : 'bg-[#1CB0F6] hover:bg-[#35B9F8] border-[#1185BA] border-b-4 text-black'
          }`}
          title={
            isFullyEquipped
              ? 'Protector de racha equipado (clic para simular uso/recarga)'
              : 'Equipar protector de racha (2/2)'
          }
        >
          {isFullyEquipped ? 'EQUIPADO' : 'EQUIPAR'}
        </button>
      </div>
    </div>
  );
}

/**
 * ============================================================================
 * UI FEATURE 2 FROM IMAGE (`image_628b9824.png`):
 * "Desafíos del día" (Aleatorios del día) with Lightning, Target, Owl & Chests
 * ============================================================================
 */
interface DailyChallengeSpec {
  id: string;
  slot: 1 | 2 | 3;
  title: string;
  target: number;
  current: number;
  chestTier: 'bronze' | 'silver' | 'gold';
}

function DailyChestSvg({ tier }: { tier: 'bronze' | 'silver' | 'gold' }) {
  const palette =
    tier === 'bronze'
      ? {
          outer: '#F2B880',
          inner: '#C97A40',
          band: '#8F4F22',
          lock: '#FFF3E6',
        }
      : tier === 'silver'
      ? {
          outer: '#D0E1ED',
          inner: '#9FB6C6',
          band: '#6A8294',
          lock: '#FFFFFF',
        }
      : {
          outer: '#FFE033',
          inner: '#FFC800',
          band: '#CC9600',
          lock: '#FFF8CC',
        };

  return (
    <svg
      className="w-8 h-7 shrink-0 select-none"
      viewBox="0 0 36 32"
      fill="none"
      aria-hidden="true"
    >
      {/* Chest Base */}
      <rect
        x="2"
        y="4"
        width="32"
        height="25"
        rx="3"
        fill={palette.outer}
      />
      {/* Inner recessed wood/metal panel */}
      <rect
        x="6"
        y="7"
        width="24"
        height="19"
        rx="1.5"
        fill={palette.inner}
      />
      {/* Horizontal middle lock band */}
      <rect x="6" y="14" width="24" height="4" fill={palette.band} />
      {/* Center keyhole plate */}
      <rect
        x="14"
        y="12"
        width="8"
        height="8"
        rx="2"
        fill={palette.outer}
      />
      <circle cx="18" cy="15.2" r="1.4" fill={palette.band} />
      <path d="M17.2 16H18.8L19.2 18.5H16.8L17.2 16Z" fill={palette.band} />
    </svg>
  );
}

function DailyRandomChallengesCard({
  seedOffset,
  onRandomizeSeed,
  sessionXpEarned,
  highAccuracyLessonsCount,
  comboFiveLessonsCount,
}: {
  seedOffset: number;
  onRandomizeSeed: () => void;
  sessionXpEarned: number;
  highAccuracyLessonsCount: number;
  comboFiveLessonsCount: number;
}) {
  // Deterministic daily seed from current YYYY-MM-DD + user's manual shuffle offset
  const todayStr = new Date().toISOString().slice(0, 10);
  let dateHash = 0;
  for (let i = 0; i < todayStr.length; i++) {
    dateHash = (dateHash * 31 + todayStr.charCodeAt(i)) % 10000;
  }

  // Pool of random daily challenges for Slot 1 (XP / Lightning), Slot 2 (Target / Accuracy), Slot 3 (Owl / Streak)
  // Note: index 0 of each pool matches the exact text of image_628b9824.png!
  const slot1Pool = [
    { title: 'Gana 50 EXP', target: 50 },
    { title: 'Gana 30 EXP', target: 30 },
    { title: 'Gana 40 EXP', target: 40 },
    { title: 'Gana 60 EXP', target: 60 },
  ];
  const slot2Pool = [
    { title: 'Obtén un puntaje de 90 % o más en 3 lecciones', target: 3 },
    { title: 'Obtén un puntaje de 90 % o más en 2 lecciones', target: 2 },
    { title: 'Completa 3 lecciones con 90 % o más de precisión', target: 3 },
    { title: 'Supera 4 lecciones con puntaje de 90 % o más', target: 4 },
  ];
  const slot3Pool = [
    {
      title: 'Responde correctamente 5 veces seguidas en 5 lecciones',
      target: 5,
    },
    {
      title: 'Responde correctamente 5 veces seguidas en 3 lecciones',
      target: 3,
    },
    {
      title: 'Responde correctamente 5 veces seguidas en 4 lecciones',
      target: 4,
    },
    {
      title: 'Responde correctamente 5 veces seguidas en 2 lecciones',
      target: 2,
    },
  ];

  const idx1 = seedOffset === 0 ? 0 : (dateHash + seedOffset) % slot1Pool.length;
  const idx2 =
    seedOffset === 0 ? 0 : (dateHash * 3 + seedOffset) % slot2Pool.length;
  const idx3 =
    seedOffset === 0 ? 0 : (dateHash * 7 + seedOffset) % slot3Pool.length;

  const challenges: DailyChallengeSpec[] = [
    {
      id: 'daily_q1',
      slot: 1,
      title: slot1Pool[idx1].title,
      target: slot1Pool[idx1].target,
      current: Math.min(slot1Pool[idx1].target, sessionXpEarned),
      chestTier: 'bronze',
    },
    {
      id: 'daily_q2',
      slot: 2,
      title: slot2Pool[idx2].title,
      target: slot2Pool[idx2].target,
      current: Math.min(slot2Pool[idx2].target, highAccuracyLessonsCount),
      chestTier: 'silver',
    },
    {
      id: 'daily_q3',
      slot: 3,
      title: slot3Pool[idx3].title,
      target: slot3Pool[idx3].target,
      current: Math.min(slot3Pool[idx3].target, comboFiveLessonsCount),
      chestTier: 'gold',
    },
  ];

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between px-1">
        <h3 className="font-display text-sm sm:text-base font-extrabold text-white">
          Desafíos del día
        </h3>
        <button
          type="button"
          onClick={onRandomizeSeed}
          className="text-[11px] font-mono font-bold text-[#1CB0F6] hover:underline cursor-pointer flex items-center gap-1"
          title="Sortear nuevos desafíos aleatorios del día"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Aleatorios hoy</span>
        </button>
      </div>

      {/* Card matching image_628b9824.png */}
      <div className="rounded-2xl bg-[#131F24] border-2 border-[#26353D] divide-y-2 divide-[#26353D] overflow-hidden">
        {challenges.map((ch) => {
          const pct = Math.min(100, Math.round((ch.current / ch.target) * 100));
          return (
            <div
              key={ch.id}
              className="p-4 sm:p-5 flex items-center gap-4"
            >
              {/* Left Custom Icon matching image_628b9824.png */}
              <div className="w-11 h-11 shrink-0 flex items-center justify-center">
                {ch.slot === 1 && (
                  /* Yellow 3D Lightning Bolt */
                  <svg className="w-9 h-9" viewBox="0 0 36 36" fill="none">
                    <path
                      d="M21 3L7 20H18L15 33L29 16H18L21 3Z"
                      fill="#FFC800"
                      stroke="#E5A400"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
                {ch.slot === 2 && (
                  /* Green Bullseye Target with Arrow */
                  <svg className="w-10 h-10" viewBox="0 0 40 40" fill="none">
                    <circle cx="19" cy="21" r="14" fill="#58CC02" />
                    <circle cx="19" cy="21" r="10" fill="#FFFFFF" />
                    <circle cx="19" cy="21" r="6" fill="#58CC02" />
                    <circle cx="19" cy="21" r="2.5" fill="#FFFFFF" />
                    <path
                      d="M20 20L32 8M32 8L27 9M32 8L31 13"
                      stroke="#46A302"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
                {ch.slot === 3 && (
                  /* Green Mascot Owl Icon */
                  <svg className="w-11 h-10" viewBox="0 0 48 44" fill="none">
                    <path
                      d="M8 22C3 19 3 14 7 14C10 14 12 18 12 22H8Z"
                      fill="#58CC02"
                    />
                    <path
                      d="M40 22C45 19 45 14 41 14C38 14 36 18 36 22H40Z"
                      fill="#58CC02"
                    />
                    <rect
                      x="11"
                      y="8"
                      width="26"
                      height="28"
                      rx="12"
                      fill="#58CC02"
                    />
                    <circle cx="19" cy="19" r="5" fill="#FFFFFF" />
                    <circle cx="29" cy="19" r="5" fill="#FFFFFF" />
                    <circle cx="19.5" cy="19" r="2.5" fill="#131F24" />
                    <circle cx="28.5" cy="19" r="2.5" fill="#131F24" />
                    <path d="M22 22H26L24 25.5L22 22Z" fill="#FFC800" />
                    <rect x="17" y="35" width="5" height="3" rx="1.5" fill="#FF9600" />
                    <rect x="26" y="35" width="5" height="3" rx="1.5" fill="#FF9600" />
                  </svg>
                )}
              </div>

              {/* Right Title + Progress Bar + Chest */}
              <div className="flex-1 min-w-0 space-y-2.5">
                <p className="font-display text-xs sm:text-sm font-extrabold text-white leading-snug">
                  {ch.title}
                </p>

                <div className="flex items-center">
                  {/* Progress Bar Track */}
                  <div className="flex-1 h-5 bg-[#26353D] rounded-l-full relative overflow-hidden flex items-center justify-center">
                    <div
                      className="absolute inset-y-0 left-0 bg-[#FFC800] transition-all duration-500 rounded-l-full"
                      style={{ width: `${pct}%` }}
                    />
                    <span className="relative z-10 font-mono text-[11px] font-extrabold text-neutral-300 tabular-nums drop-shadow">
                      {ch.current} / {ch.target}
                    </span>
                  </div>

                  {/* Chest Icon attached to the right end */}
                  <div className="-ml-1 z-10">
                    <DailyChestSvg tier={ch.chestTier} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface ModuleXpChartItem {
  moduleId: ModuleId;
  name: string;
  shortName: string;
  subtitle: string;
  xpAlcanzado: number;
  xpMeta: number;
  porcentaje: number;
  nodosCompletados: number;
  nodosTotales: number;
  color: string;
}

/**
 * Componente de tarjeta 'Resumen de Módulos' con gráfico de barras comparativo (Recharts)
 * que muestra el progreso de XP alcanzado en cada uno de los módulos del curso (5 en Sociales, 3 en los demás).
 */
function ModuleSummaryCard({
  activeCourse,
  sections,
  nodes: courseNodes,
  currentNodeIndex,
  totalUserXp,
  selectedModuleFilter,
  onSelectModule,
}: {
  activeCourse: CourseId;
  sections: ArithmeticSection[];
  nodes: ArithmeticNode[];
  currentNodeIndex: number;
  totalUserXp: number;
  selectedModuleFilter: ModuleId;
  onSelectModule: (mod: ModuleId) => void;
}) {
  const moduleMeta: {
    id: ModuleId;
    name: string;
    shortName: string;
    subtitle: string;
    color: string;
  }[] =
    activeCourse === 'sociales'
      ? [
          {
            id: 1,
            name: 'Módulo 1',
            shortName: 'Mód. 1',
            subtitle: 'Años 50 y 60 en Colombia',
            color: '#FF9600',
          },
          {
            id: 2,
            name: 'Módulo 2',
            shortName: 'Mód. 2',
            subtitle: 'Tierra y Mov. Sociales',
            color: '#00CD9C',
          },
          {
            id: 3,
            name: 'Módulo 3',
            shortName: 'Mód. 3',
            subtitle: 'Surgimiento del ELN',
            color: '#CE82FF',
          },
          {
            id: 4,
            name: 'Módulo 4',
            shortName: 'Mód. 4',
            subtitle: 'Territorio y Comunidades',
            color: '#1CB0F6',
          },
          {
            id: 5,
            name: 'Módulo 5',
            shortName: 'Mód. 5',
            subtitle: 'Memoria, DD. HH. y Paz',
            color: '#58CC02',
          },
        ]
      : activeCourse === 'quimica'
      ? [
          {
            id: 1,
            name: 'Módulo 1',
            shortName: 'Mód. 1',
            subtitle: 'Materia y Energía',
            color: '#00CD9C',
          },
          {
            id: 2,
            name: 'Módulo 2',
            shortName: 'Mód. 2',
            subtitle: 'Termoquímica y Tabla',
            color: '#CE82FF',
          },
          {
            id: 3,
            name: 'Módulo 3',
            shortName: 'Mód. 3',
            subtitle: 'Partículas, Quarks y Rad.',
            color: '#FF9600',
          },
        ]
      : activeCourse === 'fisica'
      ? [
          {
            id: 1,
            name: 'Módulo 1',
            shortName: 'Mód. 1',
            subtitle: 'Trabajo, Ek, Ep y Transf.',
            color: '#1CB0F6',
          },
          {
            id: 2,
            name: 'Módulo 2',
            shortName: 'Mód. 2',
            subtitle: 'Conservación, Cinemática y Newton',
            color: '#CE82FF',
          },
          {
            id: 3,
            name: 'Módulo 3',
            shortName: 'Mód. 3',
            subtitle: 'Fluidos, Termo, Ondas y Elec.',
            color: '#FF9600',
          },
        ]
      : [
          {
            id: 1,
            name: 'Módulo 1',
            shortName: 'Mód. 1',
            subtitle: 'Fundamentos y Álgebra',
            color: '#1CB0F6',
          },
          {
            id: 2,
            name: 'Módulo 2',
            shortName: 'Mód. 2',
            subtitle: 'Funciones y Geometría',
            color: '#CE82FF',
          },
          {
            id: 3,
            name: 'Módulo 3',
            shortName: 'Mód. 3',
            subtitle: 'Cálculo y EDOs',
            color: '#FF9600',
          },
        ];

  const sectionModuleMap = new Map<number, ModuleId>();
  sections.forEach((sec) => {
    sectionModuleMap.set(sec.id, (sec.moduleId ?? 1) as ModuleId);
  });

  const rawStats = moduleMeta.map((m) => {
    const nodes = courseNodes.filter(
      (n) => (sectionModuleMap.get(n.sectionId) ?? 1) === m.id
    );
    const completedNodes = nodes.filter((n) => n.index < currentNodeIndex);
    const xpMeta = nodes.reduce((acc, n) => acc + n.xpReward, 0);
    const nodeXp = completedNodes.reduce((acc, n) => acc + n.xpReward, 0);
    return {
      ...m,
      nodes,
      nodosCompletados: completedNodes.length,
      nodosTotales: nodes.length,
      xpMeta,
      nodeXp,
    };
  });

  const sumNodeXp = rawStats.reduce((acc, s) => acc + s.nodeXp, 0);
  const extraPracticeXp = Math.max(0, totalUserXp - sumNodeXp);

  const activeNode =
    courseNodes[Math.min(currentNodeIndex, courseNodes.length - 1)];
  const activeModuleId = activeNode
    ? sectionModuleMap.get(activeNode.sectionId) ?? 1
    : (moduleMeta[moduleMeta.length - 1]?.id ?? 3);

  const chartData: ModuleXpChartItem[] = rawStats.map((s) => {
    const bonus = s.id === activeModuleId ? extraPracticeXp : 0;
    const xpAlcanzado = Math.min(s.xpMeta, s.nodeXp + bonus);
    const porcentaje =
      s.xpMeta > 0 ? Math.min(100, Math.round((xpAlcanzado / s.xpMeta) * 100)) : 0;
    return {
      moduleId: s.id,
      name: s.name,
      shortName: s.shortName,
      subtitle: s.subtitle,
      xpAlcanzado,
      xpMeta: s.xpMeta,
      porcentaje,
      nodosCompletados: s.nodosCompletados,
      nodosTotales: s.nodosTotales,
      color: s.color,
    };
  });

  const totalCourseXpMeta = chartData.reduce((acc, d) => acc + d.xpMeta, 0);
  const totalCourseXpAlcanzado = chartData.reduce((acc, d) => acc + d.xpAlcanzado, 0);

  return (
    <div className="rounded-2xl bg-[#131F24] border-2 border-[#26353D] p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-[#58CC02] shrink-0" />
          <h3 className="font-display text-sm font-extrabold text-white">
            Resumen de Módulos
          </h3>
        </div>

        <span className="font-mono text-xs font-bold text-neutral-400 tabular-nums">
          <strong className="text-[#58CC02]">{totalCourseXpAlcanzado}</strong> / {totalCourseXpMeta} XP
        </span>
      </div>

      {/* Comparative Recharts BarChart */}
      <div className="w-full h-44">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 8, right: 6, left: -18, bottom: 0 }}
            barGap={6}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#202F36"
              vertical={false}
            />
            <XAxis
              dataKey="shortName"
              tick={{ fill: '#D1D5DB', fontSize: 11, fontWeight: 700 }}
              axisLine={{ stroke: '#26353D' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#9CA3AF', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              cursor={{ fill: 'rgba(255, 255, 255, 0.04)' }}
              content={({ active, payload }) => {
                if (!active || !payload || payload.length === 0) return null;
                const item = payload[0].payload as ModuleXpChartItem;
                return (
                  <div className="rounded-xl bg-[#0A0E11] border border-[#2E3E46] p-3 shadow-xl space-y-1 text-xs">
                    <div className="flex items-center justify-between gap-4">
                      <span
                        className="font-display font-extrabold"
                        style={{ color: item.color }}
                      >
                        {item.name}
                      </span>
                      <span className="font-mono font-extrabold text-white tabular-nums">
                        {item.porcentaje}%
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-400">{item.subtitle}</p>
                    <p className="pt-1 border-t border-[#1C272D] font-mono text-[11px] text-neutral-300 tabular-nums">
                      <span className="text-[#58CC02] font-bold">{item.xpAlcanzado} XP</span>
                      {' · '}Meta {item.xpMeta} XP{' · '}
                      {item.nodosCompletados}/{item.nodosTotales} nodos
                    </p>
                  </div>
                );
              }}
            />
            <Bar
              dataKey="xpMeta"
              name="Meta del Módulo (XP)"
              fill="#202F36"
              radius={[6, 6, 0, 0]}
              maxBarSize={28}
            />
            <Bar
              dataKey="xpAlcanzado"
              name="XP Alcanzado"
              radius={[6, 6, 0, 0]}
              maxBarSize={28}
              onClick={(_data, index) => {
                const item = chartData[index];
                if (item) {
                  onSelectModule(item.moduleId);
                }
              }}
              className="cursor-pointer"
            >
              {chartData.map((entry) => (
                <Cell key={`cell-${entry.moduleId}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Clean Unboxed Module Breakdown List (Zero-Pill / Hairline Divider Discipline) */}
      <div className="divide-y divide-[#202F36] border-t border-[#202F36] pt-1">
        {chartData.map((item) => {
          const isSelected = selectedModuleFilter === item.moduleId;
          return (
            <button
              key={item.moduleId}
              type="button"
              onClick={() => onSelectModule(item.moduleId)}
              className={`w-full py-2.5 px-2 flex flex-col gap-1.5 text-left transition-colors cursor-pointer rounded-lg ${
                isSelected ? 'bg-[#202F36]/70' : 'hover:bg-[#202F36]/35'
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-display font-extrabold text-white">
                  <span style={{ color: item.color }}>{item.name}</span>
                  <span className="text-neutral-500">·</span>
                  <span className="text-[11px] font-normal text-neutral-400 truncate max-w-[135px]">
                    {item.subtitle}
                  </span>
                </span>
                <span className="font-mono text-[11px] text-neutral-300 tabular-nums shrink-0">
                  {item.xpAlcanzado}/{item.xpMeta} XP ({item.porcentaje}%)
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[#0A0E11] overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${item.porcentaje}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Custom SVG Math Owl/Cube Mascot inspired by the reference image */
function MathMascotSvg({ className = 'w-24 h-24' }: { className?: string }) {
  return (
    <svg
      className={`${className} drop-shadow-lg select-none`}
      viewBox="0 0 120 120"
      fill="none"
      aria-hidden="true"
    >
      {/* Shadow */}
      <ellipse cx="60" cy="108" rx="28" ry="6" fill="#000000" fillOpacity="0.45" />
      {/* Left waving wing */}
      <path
        d="M22 62C12 50 14 34 24 30C30 28 34 38 34 48L22 62Z"
        fill="#58CC02"
        stroke="#46A302"
        strokeWidth="3"
      />
      {/* Body */}
      <rect
        x="26"
        y="30"
        width="68"
        height="66"
        rx="30"
        fill="#58CC02"
        stroke="#46A302"
        strokeWidth="4"
      />
      {/* Belly feather markings */}
      <path
        d="M46 76C49 79 53 79 56 76M64 76C67 79 71 79 74 76M55 84C58 87 62 87 65 84"
        stroke="#78E026"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Right wing */}
      <path
        d="M94 54C104 58 106 74 96 82C90 86 86 78 88 66L94 54Z"
        fill="#46A302"
      />
      {/* Eyes mask */}
      <circle cx="46" cy="52" r="13" fill="#FFFFFF" />
      <circle cx="74" cy="52" r="13" fill="#FFFFFF" />
      {/* Pupils */}
      <circle cx="48" cy="52" r="6.5" fill="#131F24" />
      <circle cx="72" cy="52" r="6.5" fill="#131F24" />
      <circle cx="50" cy="49" r="2.2" fill="#FFFFFF" />
      <circle cx="74" cy="49" r="2.2" fill="#FFFFFF" />
      {/* Beak */}
      <path
        d="M55 58H65L60 66L55 58Z"
        fill="#FFC800"
        stroke="#E59000"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Feet */}
      <rect x="42" y="94" width="12" height="7" rx="3.5" fill="#FF9600" />
      <rect x="66" y="94" width="12" height="7" rx="3.5" fill="#FF9600" />
      {/* Floating arithmetic symbols */}
      <text x="10" y="24" fill="#FFC800" fontSize="16" fontWeight="bold" fontFamily="monospace">
        +
      </text>
      <text x="96" y="28" fill="#1CB0F6" fontSize="16" fontWeight="bold" fontFamily="monospace">
        ÷
      </text>
    </svg>
  );
}

/** Visual 2x2 or 2x3 Matrix Bracket Renderer for Section 6 (Matrices) */
function MatrixBracketBox({
  matrix,
  label,
  accentColor,
}: {
  matrix: (number | string)[][];
  label: string;
  accentColor: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative flex items-center px-3 py-2.5 bg-[#0A0E11] rounded-xl border border-[#2E3E46]">
        {/* Left Matrix Bracket */}
        <div
          className="w-2.5 self-stretch border-l-2 border-t-2 border-b-2 rounded-l-sm mr-1.5"
          style={{ borderColor: accentColor }}
        />
        <div
          className="grid gap-x-4 gap-y-1.5 font-mono text-base sm:text-lg font-extrabold text-white tabular-nums"
          style={{
            gridTemplateColumns: `repeat(${matrix[0]?.length || 2}, minmax(24px, 1fr))`,
          }}
        >
          {matrix.map((row, rIdx) =>
            row.map((val, cIdx) => (
              <span key={`${rIdx}-${cIdx}`} className="text-center">
                {val}
              </span>
            ))
          )}
        </div>
        {/* Right Matrix Bracket */}
        <div
          className="w-2.5 self-stretch border-r-2 border-t-2 border-b-2 rounded-r-sm ml-1.5"
          style={{ borderColor: accentColor }}
        />
      </div>
      <span className="text-[11px] text-neutral-400 font-mono">{label}</span>
    </div>
  );
}

/** Custom SVG Right Triangle for Section 4 of Module 2 (Introducción a la Trigonometría) */
function RightTriangleTrigBox({
  opposite,
  adjacent,
  hypotenuse,
  angleLabel,
  accentColor,
}: {
  opposite: number | string;
  adjacent: number | string;
  hypotenuse: number | string;
  angleLabel: string;
  accentColor: string;
}) {
  return (
    <div className="my-4 p-5 sm:p-6 rounded-2xl bg-[#131F24] border-2 border-[#26353D] flex flex-col sm:flex-row items-center justify-center gap-6">
      <svg
        viewBox="0 0 240 160"
        className="w-56 h-36 sm:w-64 sm:h-40 shrink-0 overflow-visible"
        role="img"
        aria-label="Triángulo rectángulo trigonométrico"
      >
        {/* Right-angle square marker at bottom-right (190, 130) */}
        <rect
          x="174"
          y="114"
          width="16"
          height="16"
          fill="none"
          stroke="#52656D"
          strokeWidth="2"
        />
        {/* Angle arc at bottom-left vertex (40, 130) */}
        <path
          d="M 76 130 A 36 36 0 0 0 69 109"
          fill="none"
          stroke="#FFC800"
          strokeWidth="2.5"
        />
        <text
          x="82"
          y="123"
          fill="#FFC800"
          fontSize="14"
          fontWeight="bold"
          fontFamily="monospace"
        >
          {angleLabel}
        </text>

        {/* Triangle Polygon: (40,130) -> (190,130) -> (190,30) */}
        <polygon
          points="40,130 190,130 190,30"
          fill="#00CD9C"
          fillOpacity="0.1"
          stroke={accentColor}
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* Hypotenuse label */}
        <text
          x="96"
          y="68"
          fill="#1CB0F6"
          fontSize="14"
          fontWeight="bold"
          fontFamily="monospace"
        >
          hip = {hypotenuse}
        </text>

        {/* Opposite side label (right vertical leg) */}
        <text
          x="198"
          y="85"
          fill="#58CC02"
          fontSize="14"
          fontWeight="bold"
          fontFamily="monospace"
        >
          op = {opposite}
        </text>

        {/* Adjacent side label (bottom horizontal leg) */}
        <text
          x="95"
          y="150"
          fill="#FF9600"
          fontSize="14"
          fontWeight="bold"
          fontFamily="monospace"
        >
          ady = {adjacent}
        </text>
      </svg>

      <div className="space-y-1.5 text-xs font-mono text-neutral-300 bg-[#0A0E11] p-3.5 rounded-xl border border-[#26353D]">
        <p className="text-[#58CC02] font-bold">Cateto opuesto = {opposite}</p>
        <p className="text-[#FF9600] font-bold">Cateto adyacente = {adjacent}</p>
        <p className="text-[#1CB0F6] font-bold">Hipotenusa = {hypotenuse}</p>
      </div>
    </div>
  );
}

/** Visual Arithmetic / Algebraic / Matrix / Function / Trigonometry Illustration inside lessons */
function QuestionVisualIllustration({
  leftCount,
  rightCount,
  operator,
  accentColor,
  matrixA,
  matrixB,
  trigTriangle,
}: {
  leftCount: number | string;
  rightCount: number | string;
  operator: '+' | '−' | '×' | '÷' | '^' | '√' | '/' | '=' | '→';
  accentColor: string;
  matrixA?: (number | string)[][];
  matrixB?: (number | string)[][];
  trigTriangle?: {
    opposite: number | string;
    adjacent: number | string;
    hypotenuse: number | string;
    angleLabel: string;
  };
}) {
  if (trigTriangle) {
    return (
      <RightTriangleTrigBox
        opposite={trigTriangle.opposite}
        adjacent={trigTriangle.adjacent}
        hypotenuse={trigTriangle.hypotenuse}
        angleLabel={trigTriangle.angleLabel}
        accentColor={accentColor}
      />
    );
  }

  if (matrixA) {
    return (
      <div className="my-4 p-5 sm:p-6 rounded-2xl bg-[#131F24] border-2 border-[#26353D] flex flex-wrap items-center justify-center gap-4 sm:gap-7">
        <MatrixBracketBox
          matrix={matrixA}
          label={String(leftCount)}
          accentColor={accentColor}
        />

        {matrixB ? (
          <>
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#202F36] border border-[#37464F] flex items-center justify-center text-lg sm:text-xl font-bold font-mono text-white">
              {operator}
            </div>
            <MatrixBracketBox
              matrix={matrixB}
              label={String(rightCount)}
              accentColor="#1CB0F6"
            />
          </>
        ) : (
          <div className="flex flex-col items-center gap-1">
            <div className="px-3.5 py-2 rounded-xl bg-[#202F36] border border-[#37464F] font-mono text-xs sm:text-sm font-bold text-[#00CD9C]">
              Dimensión / Operador: {rightCount}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="my-4 p-5 sm:p-6 rounded-2xl bg-[#131F24] border-2 border-[#26353D] flex items-center justify-center gap-5 sm:gap-8">
      <div className="flex flex-col items-center gap-1.5">
        <div
          className="px-4 min-w-[64px] h-16 sm:min-w-[80px] sm:h-20 rounded-2xl flex items-center justify-center text-lg sm:text-2xl font-bold font-mono text-black shadow-md"
          style={{ backgroundColor: accentColor }}
        >
          {leftCount}
        </div>
        <span className="text-[11px] text-neutral-400 font-mono">
          {operator === '→' ? 'Entrada x' : 'Término A'}
        </span>
      </div>

      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#202F36] border border-[#37464F] flex items-center justify-center text-xl sm:text-2xl font-bold font-mono text-white">
        {operator}
      </div>

      <div className="flex flex-col items-center gap-1.5">
        <div className="px-4 min-w-[64px] h-16 sm:min-w-[80px] sm:h-20 rounded-2xl bg-[#1CB0F6] flex items-center justify-center text-lg sm:text-2xl font-bold font-mono text-black shadow-md">
          {rightCount}
        </div>
        <span className="text-[11px] text-neutral-400 font-mono">
          {operator === '→' ? 'Regla f(x)' : 'Término B'}
        </span>
      </div>
    </div>
  );
}

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Active course state: defaults to 'sociales' (new Social Sciences course: 5 Modules, 20 Sections)
  const [activeCourse, setActiveCourse] = useState<CourseId>('sociales');
  const [courseMenuLocation, setCourseMenuLocation] = useState<
    'none' | 'mobile' | 'desktop_right' | 'desktop_left'
  >('none');

  const currentCourseCollection =
    activeCourse === 'sociales'
      ? 'socialesProgress'
      : activeCourse === 'quimica'
      ? 'chemistryProgress'
      : activeCourse === 'fisica'
      ? 'physicsProgress'
      : 'mathProgress';
  const currentCourseSections =
    activeCourse === 'sociales'
      ? SOCIALES_SECTIONS
      : activeCourse === 'quimica'
      ? CHEMISTRY_SECTIONS
      : activeCourse === 'fisica'
      ? PHYSICS_SECTIONS
      : ARITHMETIC_SECTIONS;
  const currentCourseNodes =
    activeCourse === 'sociales'
      ? SOCIALES_NODES
      : activeCourse === 'quimica'
      ? CHEMISTRY_NODES
      : activeCourse === 'fisica'
      ? PHYSICS_NODES
      : ARITHMETIC_NODES;

  // Persistent Progress from Firestore (starts at 0 so first node is normal active green)
  const [progress, setProgress] = useState<CourseProgressData>({
    uid: '',
    course: 'sociales',
    currentNodeIndex: 0,
    xp: 0,
    streak: 1,
    gems: 100,
    hearts: 5,
    completedLessonsCount: 0,
  });

  // Navigation & UI state (shows 1 active module at a time to avoid clutter)
  const [activeTab, setActiveTab] = useState<BottomTab>('aprender');
  const [selectedModuleFilter, setSelectedModuleFilter] = useState<ModuleId>(1);
  const [showMobileStats, setShowMobileStats] = useState(false);
  const [selectedNode, setSelectedNode] = useState<ArithmeticNode | null>(null);
  const [lockedMessageNodeId, setLockedMessageNodeId] = useState<string | null>(null);
  const [guideModalSection, setGuideModalSection] = useState<ArithmeticSection | null>(null);
  const lastSyncedCourseNodeRef = useRef<string | null>(null);

  // Potenciadores ("Protector de racha" 2 / 2 EQUIPADOS) & Desafíos Aleatorios del Día state
  const [streakFreezesEquipped, setStreakFreezesEquipped] = useState<number>(2);
  const [dailyChallengeSeedOffset, setDailyChallengeSeedOffset] = useState<number>(0);
  const [highAccuracyLessonsCount, setHighAccuracyLessonsCount] = useState<number>(0);
  const [comboFiveLessonsCount, setComboFiveLessonsCount] = useState<number>(0);
  const [currentStreakInLesson, setCurrentStreakInLesson] = useState<number>(0);

  // Active Lesson Modal State
  const [activeLessonNode, setActiveLessonNode] = useState<ArithmeticNode | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [checkStatus, setCheckStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [lessonCompleted, setLessonCompleted] = useState(false);
  const [mistakesInLesson, setMistakesInLesson] = useState(0);

  // Quick mental practice state (Tab 2)
  const [drillA, setDrillA] = useState(12);
  const [drillB, setDrillB] = useState(8);
  const [drillOp, setDrillOp] = useState<'+' | '−' | '×'>('+');
  const [drillOptions, setDrillOptions] = useState<string[]>(['18', '20', '22', '24']);
  const [drillTyped, setDrillTyped] = useState('');
  const [drillFeedback, setDrillFeedback] = useState<string | null>(null);

  // Refs for auto-focusing keyboard input in lessons and practice
  const lessonInputRef = useRef<HTMLInputElement | null>(null);
  const drillInputRef = useRef<HTMLInputElement | null>(null);

  // Switch between Ciencias Sociales, Química, Física, and Matemáticas cleanly
  const handleSwitchCourse = (nextCourse: CourseId) => {
    setCourseMenuLocation('none');
    if (nextCourse === activeCourse) return;
    setSelectedNode(null);
    setLockedMessageNodeId(null);
    setGuideModalSection(null);
    setActiveLessonNode(null);
    setSelectedModuleFilter(1);
    setActiveCourse(nextCourse);
  };

  // Bootstrap user, mathProgress, physicsProgress, chemistryProgress, and socialesProgress in Firestore on sign-in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setAuthReady(true);
      setAuthError(null);

      if (!user) return;

      const userDocRef = doc(db, 'users', user.uid);
      const privateDocRef = doc(db, 'users', user.uid, 'private', 'info');
      const mathDocRef = doc(db, 'mathProgress', user.uid);
      const physicsDocRef = doc(db, 'physicsProgress', user.uid);
      const chemistryDocRef = doc(db, 'chemistryProgress', user.uid);
      const socialesDocRef = doc(db, 'socialesProgress', user.uid);

      try {
        const [
          userSnap,
          mathSnap,
          physicsSnap,
          chemistrySnap,
          socialesSnap,
        ] = await Promise.all([
          getDoc(userDocRef),
          getDoc(mathDocRef),
          getDoc(physicsDocRef),
          getDoc(chemistryDocRef),
          getDoc(socialesDocRef),
        ]);

        const batch = writeBatch(db);
        let needsCommit = false;

        if (!userSnap.exists()) {
          needsCommit = true;
          const safeDisplayName = sanitizeString(
            user.displayName || user.email?.split('@')[0] || 'Estudiante',
            VALIDATION_CONSTANTS.MAX_DISPLAY_NAME,
            'Estudiante'
          );
          const safeEmail = sanitizeString(
            user.email || 'estudiante@app.local',
            VALIDATION_CONSTANTS.MAX_EMAIL,
            'estudiante@app.local'
          );

          batch.set(userDocRef, {
            uid: user.uid,
            displayName: safeDisplayName,
            jobTitle: 'Estudiante de Sociales, Química, Física y Matemáticas',
            department: 'Ciencias Sociales, Exactas y Naturales',
            organization: 'Academia Interactiva',
            bio: '',
            themePreference: 'dark',
            notificationsEnabled: true,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });

          batch.set(privateDocRef, {
            uid: user.uid,
            email: safeEmail,
            phone: '',
            recoveryLocation: '',
            updatedAt: serverTimestamp(),
          });

          const sessionId = generateSafeId('sess');
          batch.set(doc(db, 'sessions', sessionId), {
            uid: user.uid,
            deviceLabel: detectDeviceSummary(),
            actionType: 'inicio_sesion',
            note: 'Inicio de sesión en Sociales, Química, Física y Matemáticas',
            createdAt: serverTimestamp(),
          });
        }

        if (!mathSnap.exists()) {
          needsCommit = true;
          batch.set(mathDocRef, {
            uid: user.uid,
            course: 'matematicas',
            currentNodeIndex: 0,
            xp: 0,
            streak: 1,
            gems: 100,
            hearts: 5,
            completedLessonsCount: 0,
            updatedAt: serverTimestamp(),
          });
        }

        if (!physicsSnap.exists()) {
          needsCommit = true;
          batch.set(physicsDocRef, {
            uid: user.uid,
            course: 'fisica',
            currentNodeIndex: 0,
            xp: 0,
            streak: 1,
            gems: 100,
            hearts: 5,
            completedLessonsCount: 0,
            updatedAt: serverTimestamp(),
          });
        }

        if (!chemistrySnap.exists()) {
          needsCommit = true;
          batch.set(chemistryDocRef, {
            uid: user.uid,
            course: 'quimica',
            currentNodeIndex: 0,
            xp: 0,
            streak: 1,
            gems: 100,
            hearts: 5,
            completedLessonsCount: 0,
            updatedAt: serverTimestamp(),
          });
        }

        if (!socialesSnap.exists()) {
          needsCommit = true;
          batch.set(socialesDocRef, {
            uid: user.uid,
            course: 'sociales',
            currentNodeIndex: 0,
            xp: 0,
            streak: 1,
            gems: 100,
            hearts: 5,
            completedLessonsCount: 0,
            updatedAt: serverTimestamp(),
          });
        }

        if (needsCommit) {
          await batch.commit();
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `socialesProgress/${user.uid}`);
      }
    });

    return () => unsubscribe();
  }, []);

  // Real-time listener for the currently active course
  useEffect(() => {
    if (!authReady || !currentUser) return;

    const uid = currentUser.uid;
    const collectionName =
      activeCourse === 'sociales'
        ? 'socialesProgress'
        : activeCourse === 'quimica'
        ? 'chemistryProgress'
        : activeCourse === 'fisica'
        ? 'physicsProgress'
        : 'mathProgress';
    const nodesList =
      activeCourse === 'sociales'
        ? SOCIALES_NODES
        : activeCourse === 'quimica'
        ? CHEMISTRY_NODES
        : activeCourse === 'fisica'
        ? PHYSICS_NODES
        : ARITHMETIC_NODES;
    const sectionsList =
      activeCourse === 'sociales'
        ? SOCIALES_SECTIONS
        : activeCourse === 'quimica'
        ? CHEMISTRY_SECTIONS
        : activeCourse === 'fisica'
        ? PHYSICS_SECTIONS
        : ARITHMETIC_SECTIONS;

    const unsub = onSnapshot(
      doc(db, collectionName, uid),
      (snap) => {
        if (snap.exists()) {
          const data = snap.data() as CourseProgressData;
          setProgress(data);

          const syncKey = `${activeCourse}:${data.currentNodeIndex}`;
          if (lastSyncedCourseNodeRef.current !== syncKey) {
            lastSyncedCourseNodeRef.current = syncKey;
            const currentNode =
              nodesList[Math.min(data.currentNodeIndex, nodesList.length - 1)];
            if (currentNode) {
              const sec = sectionsList.find(
                (s) => s.id === currentNode.sectionId
              );
              const modId = (sec?.moduleId ?? 1) as ModuleId;
              setSelectedModuleFilter(modId);
            }
          }
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, `${collectionName}/${uid}`);
      }
    );

    return () => unsub();
  }, [authReady, currentUser, activeCourse]);

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    setAuthError(null);
    try {
      const credential = await signInWithPopup(auth, googleProvider);
      const user = credential.user;
      const userSnap = await getDoc(doc(db, 'users', user.uid));
      if (userSnap.exists()) {
        const sessionId = generateSafeId('sess');
        await setDoc(doc(db, 'sessions', sessionId), {
          uid: user.uid,
          deviceLabel: detectDeviceSummary(),
          actionType: 'inicio_sesion',
          note: 'Acceso a Química, Física y Matemáticas',
          createdAt: serverTimestamp(),
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '';
      if (msg.includes('popup-closed-by-user')) {
        setAuthError('Se cerró la ventana antes de completar el inicio de sesión.');
      } else {
        setAuthError('No se pudo iniciar sesión con Google.');
      }
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
  };

  // Reset all progress of active course to 0 ("Reiniciar progreso")
  const handleResetProgress = async () => {
    if (!currentUser) return;
    try {
      await updateDoc(doc(db, currentCourseCollection, currentUser.uid), {
        currentNodeIndex: 0,
        xp: 0,
        completedLessonsCount: 0,
        hearts: 5,
        updatedAt: serverTimestamp(),
      });
      setSelectedNode(null);
      setSelectedModuleFilter(1);
      setActiveTab('aprender');
    } catch (error) {
      handleFirestoreError(
        error,
        OperationType.UPDATE,
        `${currentCourseCollection}/${currentUser.uid}`
      );
    }
  };

  // Start a regular lesson from a node
  const startLesson = (node: ArithmeticNode) => {
    if (progress.hearts <= 0) {
      setActiveTab('perfil');
      return;
    }
    setSelectedNode(null);
    setLockedMessageNodeId(null);
    setActiveLessonNode(node);
    setQuestionIndex(0);
    setSelectedOption(null);
    setCheckStatus('idle');
    setLessonCompleted(false);
    setMistakesInLesson(0);
  };

  // Start a Section Skip Placement Exam ("Saltar con un examen a otra sección")
  const startSkipExam = (section: ArithmeticSection) => {
    if (!section.skipExamQuestions || section.skipExamQuestions.length === 0) return;
    if (progress.hearts <= 0) {
      setActiveTab('perfil');
      return;
    }
    const sectionNodes = currentCourseNodes.filter((n) => n.sectionId === section.id);
    if (sectionNodes.length === 0) return;
    const firstNodeIndex = sectionNodes[0].index;

    const skipTitle = section.moduleId
      ? `Examen de Salto · Módulo ${section.moduleId} (Sección ${section.moduleSectionNumber || 1})`
      : `Examen de Salto · Sección ${section.id}`;

    const skipExamNode: ArithmeticNode = {
      index: firstNodeIndex,
      id: `skip_exam_${activeCourse}_section_${section.id}`,
      sectionId: section.id,
      title: skipTitle,
      subtitle: section.previousSectionLabel
        ? `Evalúa tema anterior: ${section.previousSectionLabel}`
        : section.title,
      xpReward: 50,
      gemsReward: 25,
      offsetX: 0,
      isSkipExam: true,
      targetUnlockNodeIndex: firstNodeIndex,
      questions: section.skipExamQuestions,
    };

    startLesson(skipExamNode);
  };

  // Verify selected or typed answer in active lesson
  const handleCheckAnswer = async () => {
    if (!activeLessonNode || !selectedOption || !currentUser) return;
    const currentQuestion = activeLessonNode.questions[questionIndex];

    const isMatch =
      normalizeMathAnswer(selectedOption) ===
      normalizeMathAnswer(currentQuestion.correctAnswer);

    if (isMatch) {
      setCheckStatus('correct');
      setCurrentStreakInLesson((prev) => prev + 1);
    } else {
      setCheckStatus('wrong');
      setMistakesInLesson((prev) => prev + 1);
      setCurrentStreakInLesson(0);
      const nextHearts = Math.max(0, progress.hearts - 1);
      try {
        await updateDoc(doc(db, currentCourseCollection, currentUser.uid), {
          hearts: nextHearts,
          updatedAt: serverTimestamp(),
        });
      } catch (error) {
        handleFirestoreError(
          error,
          OperationType.UPDATE,
          `${currentCourseCollection}/${currentUser.uid}`
        );
      }
    }
  };

  // Advance to next question or finish lesson (including Skip Exam unlocking!)
  const handleContinueLesson = async () => {
    if (!activeLessonNode || !currentUser) return;

    if (progress.hearts <= 0 && checkStatus === 'wrong') {
      setActiveLessonNode(null);
      setActiveTab('perfil');
      return;
    }

    const nextIdx = questionIndex + 1;
    if (nextIdx < activeLessonNode.questions.length) {
      setQuestionIndex(nextIdx);
      setSelectedOption(null);
      setCheckStatus('idle');
    } else {
      const totalQ = activeLessonNode.questions.length;
      const accuracyPct = Math.round(((totalQ - mistakesInLesson) / totalQ) * 100);
      if (accuracyPct >= 90) {
        setHighAccuracyLessonsCount((prev) => prev + 1);
      }
      if (mistakesInLesson === 0 || currentStreakInLesson >= 2) {
        setComboFiveLessonsCount((prev) => prev + 1);
      }

      let nextNodeIndex = progress.currentNodeIndex;
      let earnedXp = 5;
      let earnedGems = 2;

      if (
        activeLessonNode.isSkipExam &&
        typeof activeLessonNode.targetUnlockNodeIndex === 'number'
      ) {
        // Jumping ahead via Section Placement Exam!
        nextNodeIndex = Math.min(
          currentCourseNodes.length,
          Math.max(progress.currentNodeIndex, activeLessonNode.targetUnlockNodeIndex)
        );
        earnedXp = activeLessonNode.xpReward;
        earnedGems = activeLessonNode.gemsReward;
      } else {
        const isNewUnlock = activeLessonNode.index === progress.currentNodeIndex;
        nextNodeIndex = isNewUnlock
          ? Math.min(currentCourseNodes.length, progress.currentNodeIndex + 1)
          : progress.currentNodeIndex;
        earnedXp = isNewUnlock ? activeLessonNode.xpReward : 5;
        earnedGems = isNewUnlock ? activeLessonNode.gemsReward : 2;
      }

      try {
        await updateDoc(doc(db, currentCourseCollection, currentUser.uid), {
          currentNodeIndex: nextNodeIndex,
          xp: Math.min(1000000, progress.xp + earnedXp),
          gems: Math.min(1000000, progress.gems + earnedGems),
          completedLessonsCount: Math.min(100000, progress.completedLessonsCount + 1),
          updatedAt: serverTimestamp(),
        });
        setLessonCompleted(true);
      } catch (error) {
        handleFirestoreError(
          error,
          OperationType.UPDATE,
          `${currentCourseCollection}/${currentUser.uid}`
        );
      }
    }
  };

  // Refill hearts using gems
  const handleRefillHearts = async () => {
    if (!currentUser || progress.hearts >= 5) return;
    const gemCost = 20;
    const nextGems = progress.gems >= gemCost ? progress.gems - gemCost : progress.gems;
    try {
      await updateDoc(doc(db, currentCourseCollection, currentUser.uid), {
        hearts: 5,
        gems: nextGems,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(
        error,
        OperationType.UPDATE,
        `${currentCourseCollection}/${currentUser.uid}`
      );
    }
  };

  // Generate new quick mental calculation question
  const generateNextDrill = () => {
    const ops: ('+' | '−' | '×')[] = ['+', '−', '×'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    const a = op === '×' ? Math.floor(Math.random() * 9) + 2 : Math.floor(Math.random() * 35) + 10;
    const b = op === '×' ? Math.floor(Math.random() * 9) + 2 : Math.floor(Math.random() * (a - 2)) + 2;
    const ans = op === '+' ? a + b : op === '−' ? a - b : a * b;
    const opts = Array.from(
      new Set([
        String(ans),
        String(ans + 2),
        String(Math.max(1, ans - 3)),
        String(ans + 10),
      ])
    ).sort(() => Math.random() - 0.5);

    setDrillA(a);
    setDrillB(b);
    setDrillOp(op);
    setDrillOptions(opts);
    setDrillTyped('');
  };

  const handleAnswerDrill = async (choice: string) => {
    if (!currentUser || !choice.trim()) return;
    const correct =
      drillOp === '+' ? drillA + drillB : drillOp === '−' ? drillA - drillB : drillA * drillB;
    if (normalizeMathAnswer(choice) === normalizeMathAnswer(String(correct))) {
      setDrillFeedback('¡Correcto! +5 XP y +1 vida recuperada');
      try {
        await updateDoc(doc(db, currentCourseCollection, currentUser.uid), {
          xp: Math.min(1000000, progress.xp + 5),
          hearts: Math.min(5, progress.hearts + 1),
          updatedAt: serverTimestamp(),
        });
      } catch (error) {
        handleFirestoreError(
          error,
          OperationType.UPDATE,
          `${currentCourseCollection}/${currentUser.uid}`
        );
      }
      generateNextDrill();
    } else {
      setDrillFeedback(`Casi: ${drillA} ${drillOp} ${drillB} = ${correct}. ¡Sigue intentando!`);
      setDrillTyped('');
    }
  };

  // Auto-focus the lesson keyboard input whenever a new question appears
  useEffect(() => {
    if (activeLessonNode && !lessonCompleted && checkStatus === 'idle') {
      const timer = setTimeout(() => {
        lessonInputRef.current?.focus();
      }, 40);
      return () => clearTimeout(timer);
    }
  }, [activeLessonNode, questionIndex, lessonCompleted, checkStatus]);

  // Auto-focus the mental-math practice input when switching to 'practica'
  useEffect(() => {
    if (activeTab === 'practica' && !activeLessonNode) {
      const timer = setTimeout(() => {
        drillInputRef.current?.focus();
      }, 40);
      return () => clearTimeout(timer);
    }
  }, [activeTab, activeLessonNode, drillA, drillB]);

  // ============================================================================
  // GLOBAL KEYBOARD NAVIGATION & SHORTCUTS ("que todo sea con teclado")
  // ============================================================================
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. Unauthenticated Login screen: Enter signs in
      if (!currentUser) {
        if (e.key === 'Enter' && !isSigningIn) {
          e.preventDefault();
          handleGoogleSignIn();
        }
        return;
      }

      // 2. Inside Active Lesson or Skip Exam
      if (activeLessonNode) {
        if (e.key === 'Escape') {
          e.preventDefault();
          setActiveLessonNode(null);
          return;
        }

        if (lessonCompleted) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setActiveLessonNode(null);
          }
          return;
        }

        const currentQuestion = activeLessonNode.questions[questionIndex];
        const opts = currentQuestion.options;

        // Arrow keys cycle through option tiles seamlessly even while input is focused
        if (
          checkStatus === 'idle' &&
          (e.key === 'ArrowRight' ||
            e.key === 'ArrowDown' ||
            e.key === 'ArrowLeft' ||
            e.key === 'ArrowUp')
        ) {
          e.preventDefault();
          const currentIdx = selectedOption ? opts.indexOf(selectedOption) : -1;
          if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            const nextIdx = currentIdx < opts.length - 1 ? currentIdx + 1 : 0;
            setSelectedOption(opts[nextIdx]);
          } else {
            const prevIdx = currentIdx > 0 ? currentIdx - 1 : opts.length - 1;
            setSelectedOption(opts[prevIdx]);
          }
          return;
        }

        // Alt+1..4 or F1..F4 selects option 1..4 immediately
        if (
          checkStatus === 'idle' &&
          ((e.altKey && ['1', '2', '3', '4'].includes(e.key)) ||
            ['F1', 'F2', 'F3', 'F4'].includes(e.key))
        ) {
          e.preventDefault();
          const idx = e.key.startsWith('F')
            ? parseInt(e.key.slice(1), 10) - 1
            : parseInt(e.key, 10) - 1;
          if (opts[idx]) {
            setSelectedOption(opts[idx]);
          }
          return;
        }

        // Number keys 1..4 when NOT focused inside the text input select option 1..4
        const activeTag = document.activeElement?.tagName.toLowerCase();
        if (
          checkStatus === 'idle' &&
          activeTag !== 'input' &&
          ['1', '2', '3', '4'].includes(e.key)
        ) {
          const idx = parseInt(e.key, 10) - 1;
          if (opts[idx]) {
            e.preventDefault();
            setSelectedOption(opts[idx]);
            return;
          }
        }

        // Enter key checks answer or continues to next question
        if (e.key === 'Enter') {
          e.preventDefault();
          if (checkStatus === 'idle') {
            if (selectedOption && selectedOption.trim().length > 0) {
              handleCheckAnswer();
            }
          } else {
            handleContinueLesson();
          }
          return;
        }

        return;
      }

      // 3. Guide Modal open: Escape or Enter closes it
      if (guideModalSection) {
        if (e.key === 'Escape' || e.key === 'Enter') {
          e.preventDefault();
          setGuideModalSection(null);
        }
        return;
      }

      // 4. Main Shell Keyboard Navigation
      const isInputFocused =
        document.activeElement?.tagName.toLowerCase() === 'input' ||
        document.activeElement?.tagName.toLowerCase() === 'textarea';

      if (isInputFocused) {
        if (e.key === 'Escape') {
          (document.activeElement as HTMLElement)?.blur();
        }
        return;
      }

      // Switch tabs with keys 1..5
      if (e.key === '1') {
        e.preventDefault();
        setActiveTab('aprender');
        return;
      }
      if (e.key === '2') {
        e.preventDefault();
        setActiveTab('practica');
        return;
      }
      if (e.key === '3') {
        e.preventDefault();
        setActiveTab('guia');
        return;
      }
      if (e.key === '4') {
        e.preventDefault();
        setActiveTab('logros');
        return;
      }
      if (e.key === '5') {
        e.preventDefault();
        setActiveTab('perfil');
        return;
      }

      if (e.key === 'Escape') {
        setSelectedNode(null);
        setLockedMessageNodeId(null);
        setCourseMenuLocation('none');
        return;
      }

      // Press 'c' or 'C' to cycle between Sociales -> Química -> Física -> Matemáticas
      if (e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        const order: CourseId[] = ['sociales', 'quimica', 'fisica', 'matematicas'];
        const nextCourse = order[(order.indexOf(activeCourse) + 1) % order.length];
        handleSwitchCourse(nextCourse);
        return;
      }

      // Press 'm' or 'M' to cycle between modules (1..5 for Sociales, 1..3 for the rest)
      if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        const maxModules = activeCourse === 'sociales' ? 5 : 3;
        setSelectedModuleFilter((prev) =>
          prev < maxModules ? ((prev + 1) as ModuleId) : 1
        );
        return;
      }

      // Tree navigation when on 'aprender' tab
      if (activeTab === 'aprender') {
        const maxUnlockedIdx = Math.min(
          progress.currentNodeIndex,
          currentCourseNodes.length - 1
        );

        if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === 'j') {
          e.preventDefault();
          const currIdx = selectedNode ? selectedNode.index : maxUnlockedIdx;
          const nextIdx = Math.min(maxUnlockedIdx, currIdx + 1);
          const nextNode = currentCourseNodes[nextIdx];
          setSelectedNode(nextNode);
          if (nextNode) {
            const sec = currentCourseSections.find((s) => s.id === nextNode.sectionId);
            if (sec?.moduleId) setSelectedModuleFilter(sec.moduleId as ModuleId);
          }
          return;
        }

        if (e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'k') {
          e.preventDefault();
          const currIdx = selectedNode ? selectedNode.index : maxUnlockedIdx;
          const prevIdx = Math.max(0, currIdx - 1);
          const prevNode = currentCourseNodes[prevIdx];
          setSelectedNode(prevNode);
          if (prevNode) {
            const sec = currentCourseSections.find((s) => s.id === prevNode.sectionId);
            if (sec?.moduleId) setSelectedModuleFilter(sec.moduleId as ModuleId);
          }
          return;
        }

        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const targetNode =
            selectedNode ||
            currentCourseNodes[
              Math.min(progress.currentNodeIndex, currentCourseNodes.length - 1)
            ];
          if (targetNode && targetNode.index <= progress.currentNodeIndex) {
            startLesson(targetNode);
          }
          return;
        }

        // Press 's' or 'S' to jump to the next locked section's Skip Exam
        if (e.key === 's' || e.key === 'S') {
          e.preventDefault();
          const nextLockedSection = currentCourseSections.find((sec) => {
            const secNodes = currentCourseNodes.filter((n) => n.sectionId === sec.id);
            return (
              secNodes.length > 0 &&
              secNodes[0].index > progress.currentNodeIndex &&
              sec.skipExamQuestions &&
              sec.skipExamQuestions.length > 0
            );
          });
          if (nextLockedSection) {
            startSkipExam(nextLockedSection);
          }
          return;
        }
      }

      // Profile tab shortcuts: 'r' to refill hearts
      if (activeTab === 'perfil' && (e.key === 'r' || e.key === 'R')) {
        e.preventDefault();
        handleRefillHearts();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  if (!authReady) {
    return <div className="min-h-screen bg-black" />;
  }

  // ============================================================================
  // 1. UNAUTHENTICATED VIEW: PURE BLACK LOGIN (RESPONSIVE MOBILE & PC)
  // ============================================================================
  if (!currentUser) {
    return (
      <main className="min-h-screen w-full bg-black text-white flex items-center justify-center p-6">
        <div className="w-full max-w-sm sm:max-w-md space-y-6 bg-[#0A0E11] sm:border-2 sm:border-[#1C272D] sm:p-8 sm:rounded-3xl">
          <div className="space-y-2 text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-[#00CD9C] border-b-4 border-[#00A37C] flex items-center justify-center text-2xl font-extrabold font-mono text-black mb-4">
              ΔH°
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Iniciar sesión
            </h1>
            <p className="text-sm text-neutral-400">
              Cursos de Química, Física y Matemáticas
            </p>
          </div>

          {authError && (
            <div
              role="alert"
              className="flex items-center gap-2.5 p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-[#FF4B4B]"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isSigningIn}
            className="w-full flex items-center justify-center gap-3 px-5 py-3.5 text-sm font-bold text-black bg-[#58CC02] hover:bg-[#61E002] border-b-4 border-[#46A302] active:border-b-0 active:translate-y-1 rounded-2xl transition-all cursor-pointer disabled:opacity-50 whitespace-nowrap"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81Z"
              />
            </svg>
            <span>{isSigningIn ? 'Conectando...' : 'CONTINUAR CON GOOGLE (ENTER)'}</span>
          </button>
        </div>
      </main>
    );
  }

  // ============================================================================
  // 2. INTERACTIVE LESSON & SECTION SKIP EXAM SCREEN (FULL KEYBOARD CONTROL)
  // ============================================================================
  if (activeLessonNode) {
    const totalQuestions = activeLessonNode.questions.length;
    const currentQuestion = activeLessonNode.questions[questionIndex];
    const progressPercent = lessonCompleted
      ? 100
      : Math.round(((questionIndex + (checkStatus === 'correct' ? 1 : 0)) / totalQuestions) * 100);

    if (lessonCompleted) {
      const accuracy = Math.max(
        60,
        Math.round(((totalQuestions - mistakesInLesson) / totalQuestions) * 100)
      );
      return (
        <div className="min-h-screen bg-[#0A0E11] text-white flex flex-col justify-between">
          <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-xl w-full mx-auto text-center space-y-6">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-[#FFC800] border-b-8 border-[#E59000] flex items-center justify-center text-black shadow-lg">
              {activeLessonNode.isSkipExam ? (
                <FastForward className="w-12 h-12 sm:w-14 sm:h-14 stroke-[2.5]" />
              ) : (
                <Trophy className="w-12 h-12 sm:w-14 sm:h-14 stroke-[2.5]" />
              )}
            </div>
            <div className="space-y-2">
              <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[#FFC800] tracking-tight">
                {activeLessonNode.isSkipExam
                  ? '¡Salto de sección superado!'
                  : '¡Lección completada!'}
              </h1>
              <p className="text-sm sm:text-base text-neutral-400">
                {activeLessonNode.isSkipExam ? (
                  <>
                    Has desbloqueado directamente{' '}
                    <span className="text-white font-semibold">
                      {activeLessonNode.subtitle}
                    </span>
                  </>
                ) : (
                  <>
                    Has dominado{' '}
                    <span className="text-white font-semibold">
                      {activeLessonNode.title}
                    </span>
                  </>
                )}
              </p>
            </div>

            {/* Stat boxes */}
            <div className="w-full grid grid-cols-3 gap-3 sm:gap-4 pt-2">
              <div className="rounded-2xl bg-[#FFC800] p-0.5">
                <div className="bg-[#FFC800] text-black text-[10px] sm:text-xs font-extrabold uppercase py-1.5 rounded-t-xl">
                  EXP Total
                </div>
                <div className="bg-[#131F24] rounded-b-xl py-3.5 sm:py-4 font-mono text-lg sm:text-2xl font-extrabold text-[#FFC800] tabular-nums">
                  +{activeLessonNode.xpReward}
                </div>
              </div>

              <div className="rounded-2xl bg-[#58CC02] p-0.5">
                <div className="bg-[#58CC02] text-black text-[10px] sm:text-xs font-extrabold uppercase py-1.5 rounded-t-xl">
                  Precisión
                </div>
                <div className="bg-[#131F24] rounded-b-xl py-3.5 sm:py-4 font-mono text-lg sm:text-2xl font-extrabold text-[#58CC02] tabular-nums">
                  {accuracy}%
                </div>
              </div>

              <div className="rounded-2xl bg-[#1CB0F6] p-0.5">
                <div className="bg-[#1CB0F6] text-black text-[10px] sm:text-xs font-extrabold uppercase py-1.5 rounded-t-xl">
                  Gemas
                </div>
                <div className="bg-[#131F24] rounded-b-xl py-3.5 sm:py-4 font-mono text-lg sm:text-2xl font-extrabold text-[#1CB0F6] tabular-nums">
                  +{activeLessonNode.gemsReward}
                </div>
              </div>
            </div>
          </div>

          <div className="border-t-2 border-[#1C272D] p-5 sm:py-6">
            <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
              <span className="hidden sm:inline-flex items-center gap-2 text-xs font-mono text-neutral-400">
                <Keyboard className="w-4 h-4 text-[#58CC02]" />
                Presiona Enter o Esc para volver al árbol
              </span>
              <button
                type="button"
                onClick={() => setActiveLessonNode(null)}
                className="w-full sm:w-56 py-3.5 rounded-2xl bg-[#58CC02] hover:bg-[#61E002] border-b-4 border-[#46A302] active:border-b-0 active:translate-y-1 text-black font-extrabold text-sm tracking-wider uppercase transition-all cursor-pointer"
              >
                CONTINUAR (ENTER)
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-[#0A0E11] text-white flex flex-col justify-between">
        {/* Top Progress Header */}
        <header className="w-full max-w-4xl mx-auto px-5 sm:px-8 pt-6 sm:pt-8 pb-3 flex items-center gap-4 sm:gap-6">
          <button
            type="button"
            onClick={() => setActiveLessonNode(null)}
            className="text-neutral-500 hover:text-neutral-300 transition-colors cursor-pointer flex items-center gap-1"
            aria-label="Salir de la lección (Esc)"
            title="Salir (Esc)"
          >
            <X className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.5]" />
            <span className="hidden sm:inline font-mono text-[11px] text-neutral-500">
              ESC
            </span>
          </button>

          {/* Duolingo Green Progress Bar with inner shine */}
          <div className="flex-1 h-4 bg-[#202F36] rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-[#58CC02] rounded-full transition-all duration-300 relative"
              style={{ width: `${Math.max(10, progressPercent)}%` }}
            >
              <div className="absolute top-0.5 left-2 right-2 h-1 bg-[#78E026] rounded-full opacity-80" />
            </div>
          </div>

          {activeLessonNode.isSkipExam && (
            <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#FFC800]/15 text-[#FFC800] font-mono text-xs font-extrabold">
              <FastForward className="w-3.5 h-3.5" />
              SALTO SECCIÓN {activeLessonNode.sectionId}
            </span>
          )}

          {/* Red Heart Counter */}
          <div className="flex items-center gap-1.5 text-[#FF4B4B] font-extrabold font-mono tabular-nums text-sm sm:text-base">
            <Heart className="w-5 h-5 sm:w-6 sm:h-6 fill-[#FF4B4B]" />
            <span>{progress.hearts}</span>
          </div>
        </header>

        {/* Main Question Body */}
        <main className="flex-1 w-full max-w-2xl mx-auto px-5 sm:px-8 py-4 sm:py-6 flex flex-col justify-center gap-6">
          <div className="space-y-5">
            <div className="space-y-1">
              <h2 className="font-display text-xl sm:text-3xl font-extrabold text-white leading-snug">
                {currentQuestion.prompt}
              </h2>
              <p className="text-xs font-mono text-neutral-400 flex items-center gap-1.5">
                <Keyboard className="w-3.5 h-3.5 text-[#1CB0F6]" />
                <span>
                  Escribe la respuesta directamente con tu teclado, usa las flechas{' '}
                  <strong className="text-neutral-200">← →</strong> para elegir opción y presiona{' '}
                  <strong className="text-[#58CC02]">Enter</strong>
                </span>
              </p>
            </div>

            {/* Question Layout A: Stacked Pattern Table */}
            {currentQuestion.type === 'pattern_table' && currentQuestion.tableRows && (
              <div className="rounded-2xl border-2 border-[#26353D] bg-[#131F24] divide-y-2 divide-[#26353D] overflow-hidden">
                {currentQuestion.tableRows.map((row, idx) => (
                  <div
                    key={idx}
                    className="px-5 sm:px-7 py-4 sm:py-5 font-mono text-lg sm:text-xl font-bold tracking-wide flex items-center flex-wrap gap-2"
                  >
                    <span className="text-neutral-200">{row.prefix}</span>
                    {row.highlight && (
                      <span className="text-[#CE82FF] underline decoration-dotted underline-offset-4">
                        {row.highlight}
                      </span>
                    )}
                    {row.isBlankRow && (
                      <input
                        ref={lessonInputRef}
                        type="text"
                        value={selectedOption ?? ''}
                        disabled={checkStatus !== 'idle'}
                        onChange={(e) => setSelectedOption(e.target.value)}
                        placeholder="?"
                        aria-label="Escribe tu respuesta con el teclado"
                        className="w-28 sm:w-32 h-11 px-3 rounded-xl bg-[#0A0E11] border-2 border-[#1CB0F6] text-center font-mono text-lg sm:text-xl font-extrabold text-[#1CB0F6] placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-[#58CC02]"
                      />
                    )}
                    {row.suffix && <span className="text-neutral-200">{row.suffix}</span>}
                  </div>
                ))}
              </div>
            )}

            {/* Question Layout B: Visual Illustration + Equation with Keyboard Input */}
            {currentQuestion.type !== 'pattern_table' && (
              <div className="space-y-5">
                {currentQuestion.visualData && (
                  <QuestionVisualIllustration
                    leftCount={currentQuestion.visualData.leftCount}
                    rightCount={currentQuestion.visualData.rightCount}
                    operator={currentQuestion.visualData.operator}
                    accentColor={currentQuestion.visualData.accentColor}
                    matrixA={currentQuestion.visualData.matrixA}
                    matrixB={currentQuestion.visualData.matrixB}
                    trigTriangle={currentQuestion.visualData.trigTriangle}
                  />
                )}

                <div className="p-5 sm:p-7 rounded-2xl bg-[#131F24] border-2 border-[#26353D] flex items-center justify-center flex-wrap gap-2.5 font-mono text-2xl sm:text-3xl font-extrabold">
                  <span className="text-white">{currentQuestion.equationPrefix}</span>
                  <input
                    ref={lessonInputRef}
                    type="text"
                    value={selectedOption ?? ''}
                    disabled={checkStatus !== 'idle'}
                    onChange={(e) => setSelectedOption(e.target.value)}
                    placeholder="?"
                    aria-label="Escribe tu respuesta con el teclado"
                    className="w-28 sm:w-36 h-12 px-3 rounded-xl bg-[#0A0E11] border-2 border-[#1CB0F6] text-center font-mono text-2xl sm:text-3xl font-extrabold text-[#1CB0F6] placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-[#58CC02]"
                  />
                  {currentQuestion.equationSuffix && (
                    <span className="text-white">{currentQuestion.equationSuffix}</span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Tactile 3D Option Tiles with Keyboard Shortcut Indicators */}
          <div className="py-1 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            {currentQuestion.options.map((option, idx) => {
              const isSelected =
                selectedOption !== null &&
                normalizeMathAnswer(selectedOption) === normalizeMathAnswer(option);
              return (
                <button
                  key={option}
                  type="button"
                  disabled={checkStatus !== 'idle'}
                  onClick={() => {
                    setSelectedOption(option);
                    lessonInputRef.current?.focus();
                  }}
                  className={`min-w-[96px] sm:min-w-[116px] px-5 py-3.5 sm:py-4 rounded-2xl font-mono text-lg sm:text-xl font-extrabold transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-[#1CB0F6]/20 border-2 border-b-4 border-[#1CB0F6] text-[#1CB0F6]'
                      : 'bg-[#131F24] hover:bg-[#1A2A32] border-2 border-b-4 border-[#2E3E46] text-white active:border-b-2 active:translate-y-0.5'
                  }`}
                >
                  <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-[#0A0E11] text-neutral-400 border border-[#26353D]">
                    {idx + 1}
                  </span>
                  <span className="flex-1 text-center">{option}</span>
                </button>
              );
            })}
          </div>
        </main>

        {/* Bottom Check / Feedback Bar */}
        <footer
          className={`w-full border-t-2 transition-colors p-5 sm:py-6 ${
            checkStatus === 'correct'
              ? 'bg-[#0F291E] border-[#58CC02]'
              : checkStatus === 'wrong'
              ? 'bg-[#2D1215] border-[#FF4B4B]'
              : 'bg-[#0A0E11] border-[#1C272D]'
          }`}
        >
          <div className="max-w-4xl mx-auto">
            {checkStatus === 'idle' ? (
              <div className="flex items-center justify-between gap-4">
                <span className="hidden sm:inline text-xs font-mono text-neutral-400">
                  Teclado: escribe el valor o usa ← → y pulsa Enter
                </span>
                <button
                  type="button"
                  disabled={!selectedOption || !selectedOption.trim()}
                  onClick={handleCheckAnswer}
                  className={`w-full sm:w-56 py-3.5 rounded-2xl font-extrabold text-sm tracking-wider uppercase transition-all ${
                    selectedOption && selectedOption.trim()
                      ? 'bg-[#58CC02] hover:bg-[#61E002] border-b-4 border-[#46A302] text-black cursor-pointer active:border-b-0 active:translate-y-1'
                      : 'bg-[#202F36] text-[#52656D] cursor-not-allowed'
                  }`}
                >
                  COMPROBAR (ENTER)
                </button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start sm:items-center gap-3.5">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      checkStatus === 'correct'
                        ? 'bg-[#58CC02] text-black'
                        : 'bg-[#FF4B4B] text-white'
                    }`}
                  >
                    {checkStatus === 'correct' ? (
                      <Check className="w-6 h-6 stroke-[3]" />
                    ) : (
                      <X className="w-6 h-6 stroke-[3]" />
                    )}
                  </div>
                  <div className="space-y-0.5">
                    <p
                      className={`font-display font-extrabold text-base sm:text-lg ${
                        checkStatus === 'correct' ? 'text-[#58CC02]' : 'text-[#FF4B4B]'
                      }`}
                    >
                      {checkStatus === 'correct'
                        ? '¡Excelente trabajo!'
                        : `Respuesta correcta: ${currentQuestion.correctAnswer}`}
                    </p>
                    <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                      {currentQuestion.explanation}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleContinueLesson}
                  className={`w-full sm:w-56 py-3.5 rounded-2xl font-extrabold text-sm tracking-wider uppercase transition-all cursor-pointer active:translate-y-0.5 shrink-0 ${
                    checkStatus === 'correct'
                      ? 'bg-[#58CC02] hover:bg-[#61E002] border-b-4 border-[#46A302] text-black'
                      : 'bg-[#FF4B4B] hover:bg-[#FF6262] border-b-4 border-[#CC3B3B] text-white'
                  }`}
                >
                  CONTINUAR (ENTER)
                </button>
              </div>
            )}
          </div>
        </footer>
      </div>
    );
  }

  // ============================================================================
  // 3. MAIN DUOLINGO DARK MODE SHELL (RESPONSIVE MOBILE + DESKTOP 3-COLUMN)
  // ============================================================================
  const currentActiveNode =
    currentCourseNodes[Math.min(progress.currentNodeIndex, currentCourseNodes.length - 1)];

  const navItems: {
    id: BottomTab;
    keyNum: string;
    label: string;
    icon: React.ReactNode;
    inactiveColor: string;
  }[] = [
    {
      id: 'aprender',
      keyNum: '1',
      label: 'APRENDER',
      icon: <Home className="w-6 h-6 shrink-0" />,
      inactiveColor: 'text-neutral-400',
    },
    {
      id: 'practica',
      keyNum: '2',
      label: 'PRÁCTICA',
      icon: <Dumbbell className="w-6 h-6 shrink-0" />,
      inactiveColor: 'text-[#1CB0F6]',
    },
    {
      id: 'guia',
      keyNum: '3',
      label: 'GUÍA',
      icon: <BookOpen className="w-6 h-6 shrink-0" />,
      inactiveColor: 'text-[#CE82FF]',
    },
    {
      id: 'logros',
      keyNum: '4',
      label: 'LOGROS',
      icon: <Trophy className="w-6 h-6 shrink-0" />,
      inactiveColor: 'text-[#FFC800]',
    },
    {
      id: 'perfil',
      keyNum: '5',
      label: 'PERFIL',
      icon: <MoreHorizontal className="w-6 h-6 shrink-0" />,
      inactiveColor: 'text-[#CE82FF]',
    },
  ];

  const moduleTabsMeta: {
    id: ModuleId;
    label: string;
    sub: string;
    activeBg: string;
  }[] =
    activeCourse === 'sociales'
      ? [
          {
            id: 1,
            label: 'Mód. 1',
            sub: 'Años 50–60',
            activeBg: 'bg-[#FF9600] text-black',
          },
          {
            id: 2,
            label: 'Mód. 2',
            sub: 'Tierra y Mov.',
            activeBg: 'bg-[#00CD9C] text-black',
          },
          {
            id: 3,
            label: 'Mód. 3',
            sub: 'Origen ELN',
            activeBg: 'bg-[#CE82FF] text-black',
          },
          {
            id: 4,
            label: 'Mód. 4',
            sub: 'Territorio',
            activeBg: 'bg-[#1CB0F6] text-black',
          },
          {
            id: 5,
            label: 'Mód. 5',
            sub: 'DD. HH. y Paz',
            activeBg: 'bg-[#58CC02] text-black',
          },
        ]
      : activeCourse === 'quimica'
      ? [
          {
            id: 1,
            label: 'Módulo 1',
            sub: 'Materia y Energía',
            activeBg: 'bg-[#00CD9C] text-black',
          },
          {
            id: 2,
            label: 'Módulo 2',
            sub: 'Termoquímica y Tabla',
            activeBg: 'bg-[#CE82FF] text-black',
          },
          {
            id: 3,
            label: 'Módulo 3',
            sub: 'Partículas y Rad.',
            activeBg: 'bg-[#FF9600] text-black',
          },
        ]
      : activeCourse === 'fisica'
      ? [
          {
            id: 1,
            label: 'Módulo 1',
            sub: 'Trabajo y Energía',
            activeBg: 'bg-[#1CB0F6] text-black',
          },
          {
            id: 2,
            label: 'Módulo 2',
            sub: 'Cinemática y Newton',
            activeBg: 'bg-[#CE82FF] text-black',
          },
          {
            id: 3,
            label: 'Módulo 3',
            sub: 'Termo, Ondas y Elec.',
            activeBg: 'bg-[#FF9600] text-black',
          },
        ]
      : [
          {
            id: 1,
            label: 'Módulo 1',
            sub: 'Fundamentos',
            activeBg: 'bg-[#1CB0F6] text-black',
          },
          {
            id: 2,
            label: 'Módulo 2',
            sub: 'Funciones y Geom.',
            activeBg: 'bg-[#CE82FF] text-black',
          },
          {
            id: 3,
            label: 'Módulo 3',
            sub: 'Cálculo y EDOs',
            activeBg: 'bg-[#FF9600] text-black',
          },
        ];

  const activeCourseLevelCount = Math.max(1, progress.currentNodeIndex);

  return (
    <div className="min-h-screen bg-[#0A0E11] text-white flex flex-col md:flex-row">
      {/* ==================================================================== */}
      {/* DESKTOP LEFT SIDEBAR (Visible on md+ / PC screens)                   */}
      {/* ==================================================================== */}
      <aside className="hidden md:flex md:w-60 lg:w-64 shrink-0 flex-col justify-between border-r-2 border-[#1C272D] bg-[#0A0E11] px-4 py-6 sticky top-0 h-screen select-none">
        <div className="space-y-6">
          {/* Brand Header + Course Icon Popover Trigger */}
          <div className="space-y-3">
            <div className="px-1 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <CourseSelectorDropdown
                  activeCourse={activeCourse}
                  levelCount={activeCourseLevelCount}
                  isOpen={courseMenuLocation === 'desktop_left'}
                  onToggle={() =>
                    setCourseMenuLocation((prev) =>
                      prev === 'desktop_left' ? 'none' : 'desktop_left'
                    )
                  }
                  onSelectCourse={handleSwitchCourse}
                  align="left"
                />
                <div className="truncate">
                  <span
                    className={`font-display text-lg font-extrabold tracking-tight block leading-none truncate ${
                      activeCourse === 'sociales'
                        ? 'text-[#FF9600]'
                        : activeCourse === 'quimica'
                        ? 'text-[#00CD9C]'
                        : activeCourse === 'fisica'
                        ? 'text-[#1CB0F6]'
                        : 'text-[#58CC02]'
                    }`}
                  >
                    {activeCourse === 'sociales'
                      ? 'sociales'
                      : activeCourse === 'quimica'
                      ? 'química'
                      : activeCourse === 'fisica'
                      ? 'física'
                      : 'matemáticas'}
                  </span>
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mt-0.5">
                    {activeCourse === 'sociales'
                      ? '5 Mód. · 20 Secc.'
                      : activeCourse === 'quimica'
                      ? '3 Mód. · 22 Secc.'
                      : '3 Mód. · 20 Secc.'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Links with Keyboard Numbers 1..5 */}
          <nav className="space-y-2" aria-label="Navegación de escritorio">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl border-2 font-display text-xs font-extrabold tracking-wider uppercase transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-[#1CB0F6]/15 border-[#1CB0F6] text-[#1CB0F6]'
                      : `border-transparent hover:bg-[#131F24] ${item.inactiveColor} text-neutral-300`
                  }`}
                >
                  <span className="flex items-center gap-3.5">
                    <span className={isActive ? 'text-[#1CB0F6]' : item.inactiveColor}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </span>
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#131F24] border border-[#26353D] text-neutral-400">
                    {item.keyNum}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Keyboard Controls Cheat Sheet on Desktop Sidebar */}
          <div className="px-3 py-3 rounded-2xl bg-[#131F24] border border-[#26353D] space-y-2 text-[11px] text-neutral-400">
            <div className="flex items-center gap-1.5 font-bold text-white">
              <Keyboard className="w-3.5 h-3.5 text-[#58CC02]" />
              <span>Atajos de Teclado</span>
            </div>
            <div className="space-y-1 font-mono text-[10px]">
              <p className="flex justify-between">
                <span>Empezar lección:</span>
                <span className="text-[#58CC02]">Enter</span>
              </p>
              <p className="flex justify-between">
                <span>Mover por nodos:</span>
                <span className="text-[#1CB0F6]">↑ ↓</span>
              </p>
              <p className="flex justify-between">
                <span>Examen de salto:</span>
                <span className="text-[#FFC800]">Tecla S</span>
              </p>
              <p className="flex justify-between">
                <span>Cambiar módulo:</span>
                <span className="text-[#CE82FF]">Tecla M</span>
              </p>
              <p className="flex justify-between">
                <span>Cambiar curso:</span>
                <span className="text-[#00CD9C]">Tecla C</span>
              </p>
              <p className="flex justify-between">
                <span>Cambiar pestaña:</span>
                <span className="text-neutral-200">1 - 5</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom User Summary & Sign Out on Desktop */}
        <div className="pt-4 border-t-2 border-[#1C272D] space-y-3 px-2">
          <div className="truncate">
            <p className="text-xs font-extrabold text-white truncate">
              {currentUser.displayName || 'Estudiante'}
            </p>
            <p className="text-[11px] font-mono text-neutral-500 truncate">
              {currentUser.email}
            </p>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            className="w-full py-2.5 px-3 rounded-xl bg-[#131F24] hover:bg-[#2D1215] border border-[#26353D] hover:border-[#FF4B4B]/40 text-xs font-extrabold text-neutral-400 hover:text-[#FF4B4B] flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>

      {/* ==================================================================== */}
      {/* MOBILE TOP STATUS BAR (Hidden on xl where right sidebar shows it)    */}
      {/* Matches image_f7da1fd4.png & image_4899740f.png                      */}
      {/* ==================================================================== */}
      <header className="xl:hidden sticky top-0 z-30 bg-[#0A0E11]/95 backdrop-blur-md border-b border-[#1C272D] px-4 py-2.5 flex items-center justify-between">
        <CourseSelectorDropdown
          activeCourse={activeCourse}
          levelCount={activeCourseLevelCount}
          isOpen={courseMenuLocation === 'mobile'}
          onToggle={() =>
            setCourseMenuLocation((prev) =>
              prev === 'mobile' ? 'none' : 'mobile'
            )
          }
          onSelectCourse={handleSwitchCourse}
          align="left"
        />

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5 font-mono font-extrabold text-sm sm:text-base tabular-nums text-[#FF9600]">
            <Flame className="w-5 h-5 fill-[#FF9600] text-[#FF9600]" />
            <span>{progress.streak}</span>
          </div>

          <div className="flex items-center gap-1.5 font-mono font-extrabold text-sm sm:text-base tabular-nums text-[#1CB0F6]">
            <GemIcon className="w-5 h-5" />
            <span>{progress.gems}</span>
          </div>

          <button
            type="button"
            onClick={() => setActiveTab('perfil')}
            className="flex items-center gap-1.5 font-mono font-extrabold text-sm sm:text-base tabular-nums text-[#FF4B4B] cursor-pointer"
            title="Vidas disponibles"
          >
            <Heart className="w-5 h-5 fill-[#FF4B4B] text-[#FF4B4B]" />
            <span>{progress.hearts}</span>
          </button>
        </div>
      </header>

      {/* ==================================================================== */}
      {/* CENTER CONTENT STAGE + RIGHT WIDGETS SIDEBAR ON PC                   */}
      {/* ==================================================================== */}
      <div className="flex-1 flex justify-center min-w-0">
        <div className="w-full max-w-7xl flex justify-center gap-8 px-4 sm:px-6 lg:px-8 py-6 md:py-10">
          {/* Center Column: Node Tree or Selected Tab View */}
          <main className="w-full max-w-2xl pb-28 md:pb-16">
            {/* ============================================================== */}
            {/* TAB 1: ÁRBOL DE NODOS DEL CURSO ACTIVO (1 MÓDULO A LA VEZ)     */}
            {/* ============================================================== */}
            {activeTab === 'aprender' && (
              <div className="space-y-12">
                {/* Top Bar: Clean 3-Module Segmented Switcher + Mobile Stats Drawer Toggle */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div
                      className={`flex-1 rounded-2xl bg-[#131F24] border-2 border-[#26353D] p-1.5 grid gap-1.5 ${
                        activeCourse === 'sociales'
                          ? 'grid-cols-2 sm:grid-cols-5'
                          : 'grid-cols-3'
                      }`}
                    >
                      {moduleTabsMeta.map((tab) => {
                        const isActive = selectedModuleFilter === tab.id;
                        return (
                          <button
                            key={tab.id}
                            type="button"
                            onClick={() => setSelectedModuleFilter(tab.id)}
                            className={`py-2.5 px-2.5 rounded-xl font-display text-xs sm:text-sm font-extrabold tracking-wide transition-all cursor-pointer whitespace-nowrap truncate ${
                              isActive
                                ? `${tab.activeBg} shadow-sm`
                                : 'text-neutral-300 hover:bg-[#202F36] hover:text-white'
                            }`}
                          >
                            <span>{tab.label}</span>
                            <span
                              className={`hidden lg:inline font-normal text-xs ml-1 ${
                                isActive ? 'text-black/80' : 'text-neutral-400'
                              }`}
                            >
                              · {tab.sub}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Collapsible Stats Toggle for Mobile / Tablet (< xl) */}
                    <button
                      type="button"
                      onClick={() => setShowMobileStats((prev) => !prev)}
                      className="xl:hidden px-3.5 py-3 rounded-2xl bg-[#131F24] hover:bg-[#202F36] border-2 border-[#26353D] text-xs font-extrabold text-neutral-200 flex items-center gap-1.5 shrink-0 cursor-pointer whitespace-nowrap"
                      title="Mostrar u ocultar desafíos del día, potenciadores y progreso"
                    >
                      <BarChart3 className="w-4 h-4 text-[#58CC02]" />
                      <span className="hidden sm:inline">Desafíos</span>
                      {showMobileStats ? (
                        <ChevronUp className="w-4 h-4 text-neutral-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-neutral-400" />
                      )}
                    </button>
                  </div>

                  {/* Mobile / Tablet Collapsible Drawer with Daily Quests, Potenciadores & Module Summary */}
                  {showMobileStats && (
                    <div className="xl:hidden space-y-4 pt-1">
                      <DailyRandomChallengesCard
                        seedOffset={dailyChallengeSeedOffset}
                        onRandomizeSeed={() =>
                          setDailyChallengeSeedOffset((prev) => prev + 1)
                        }
                        sessionXpEarned={progress.xp}
                        highAccuracyLessonsCount={
                          highAccuracyLessonsCount + progress.completedLessonsCount
                        }
                        comboFiveLessonsCount={
                          comboFiveLessonsCount + progress.completedLessonsCount
                        }
                      />
                      <PotenciadoresStreakFreezeSection
                        equippedCount={streakFreezesEquipped}
                        maxCount={2}
                        onToggleOrRefill={() =>
                          setStreakFreezesEquipped((prev) => (prev >= 2 ? 1 : 2))
                        }
                      />
                      <DailyGoalRingChart xp={progress.xp} goal={DAILY_XP_GOAL} />
                      <ModuleSummaryCard
                        activeCourse={activeCourse}
                        sections={currentCourseSections}
                        nodes={currentCourseNodes}
                        currentNodeIndex={progress.currentNodeIndex}
                        totalUserXp={progress.xp}
                        selectedModuleFilter={selectedModuleFilter}
                        onSelectModule={(mod) => {
                          setSelectedModuleFilter(mod);
                          setShowMobileStats(false);
                        }}
                      />
                    </div>
                  )}

                  {/* Subtle Active Module Title Strip */}
                  <div className="flex items-center justify-between px-1 pt-1 text-xs text-neutral-400">
                    <span className="font-medium">
                      {activeCourse === 'sociales' ? (
                        <>
                          {selectedModuleFilter === 1 &&
                            'Módulo 1 · Contexto Político y Social de Colombia en las Décadas de 1950 y 1960'}
                          {selectedModuleFilter === 2 &&
                            'Módulo 2 · Causas, Tensiones Agrarias y Movimientos Sociales del Conflicto'}
                          {selectedModuleFilter === 3 &&
                            'Módulo 3 · Antecedentes y Surgimiento Histórico del ELN (1964–1965)'}
                          {selectedModuleFilter === 4 &&
                            'Módulo 4 · Transformaciones Territoriales y Efectos en Comunidades'}
                          {selectedModuleFilter === 5 &&
                            'Módulo 5 · Memoria Histórica, Derechos Humanos, No Repetición y Paz'}
                        </>
                      ) : activeCourse === 'quimica' ? (
                        <>
                          {selectedModuleFilter === 1 &&
                            'Módulo 1 · Cambios Físicos y Químicos, Materia-Energía y Transferencia I'}
                          {selectedModuleFilter === 2 &&
                            'Módulo 2 · Calorimetría, Reacciones Exo/Endotérmicas y Tabla Periódica'}
                          {selectedModuleFilter === 3 &&
                            'Módulo 3 · Partículas Fundamentales, Quarks, Radiación y Semidesintegración'}
                        </>
                      ) : activeCourse === 'fisica' ? (
                        <>
                          {selectedModuleFilter === 1 &&
                            'Módulo 1 · Trabajo Mecánico, Energía Cinética, Potencial y Transformación'}
                          {selectedModuleFilter === 2 &&
                            'Módulo 2 · Conservación, Eficiencia, Cinemática, Leyes de Newton y Gravitación'}
                          {selectedModuleFilter === 3 &&
                            'Módulo 3 · Hidrostática, Termodinámica, Ondas, Electrostática, Circuitos y Óptica'}
                        </>
                      ) : (
                        <>
                          {selectedModuleFilter === 1 &&
                            'Módulo 1 · Aritmética, Potencias, Fracciones, Álgebra y Matrices'}
                          {selectedModuleFilter === 2 &&
                            'Módulo 2 · Funciones, Geometría Plana, Trigonometría y Teoremas'}
                          {selectedModuleFilter === 3 &&
                            'Módulo 3 · Derivadas, Integrales, Límites, Cálculo y EDOs'}
                        </>
                      )}
                    </span>
                    <span className="font-mono text-[11px] text-neutral-500 whitespace-nowrap ml-2">
                      {activeCourse === 'sociales'
                        ? '4 secciones'
                        : activeCourse === 'quimica'
                        ? selectedModuleFilter === 2
                          ? '8 secciones'
                          : '7 secciones'
                        : selectedModuleFilter === 1
                        ? '6 secciones'
                        : '7 secciones'}{' '}
                      · Tecla M
                    </span>
                  </div>
                </div>

                {/* Sections of the Currently Active Module with Generous Breathing Room */}
                <div className="space-y-16">
                  {currentCourseSections
                    .filter((sec) => (sec.moduleId ?? 1) === selectedModuleFilter)
                    .map((section) => {
                      const sectionNodes = currentCourseNodes.filter(
                        (n) => n.sectionId === section.id
                      );
                    const firstNodeOfSection = sectionNodes[0];
                    const isSectionLocked =
                      firstNodeOfSection &&
                      firstNodeOfSection.index > progress.currentNodeIndex;
                    const modId = section.moduleId ?? 1;
                    const displaySecNumber = section.moduleSectionNumber ?? section.id;
                    const cleanSectionTitle = section.title.replace(
                      /^Sección\s+\d+\s*·\s*/i,
                      ''
                    );
                    const canSkipSection =
                      isSectionLocked &&
                      section.skipExamQuestions &&
                      section.skipExamQuestions.length > 0;

                    return (
                      <section key={section.id} className="space-y-10">
                        {/* Clean Section Header Banner with Integrated Skip & Guide Actions */}
                        <div
                          className="rounded-2xl px-5 py-4 sm:px-6 sm:py-5 border-b-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md"
                          style={{
                            backgroundColor: section.colorHex,
                            borderColor: section.borderHex,
                          }}
                        >
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-2 text-xs font-mono font-bold text-black/80">
                              <span>Módulo {modId}</span>
                              <span aria-hidden="true">·</span>
                              <span>Sección {displaySecNumber}</span>
                              {canSkipSection && section.previousSectionLabel && (
                                <>
                                  <span aria-hidden="true">·</span>
                                  <span className="truncate text-black/75">
                                    Evalúa: {section.previousSectionLabel}
                                  </span>
                                </>
                              )}
                            </div>
                            <h3 className="font-display text-lg sm:text-xl font-extrabold text-white tracking-tight">
                              {cleanSectionTitle}
                            </h3>
                            <p className="text-xs sm:text-sm font-medium text-white/90 leading-snug">
                              {section.subtitle}
                            </p>
                          </div>

                          <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
                            {/* Integrated Skip Exam Button when Section is Locked */}
                            {canSkipSection && (
                              <button
                                type="button"
                                onClick={() => startSkipExam(section)}
                                className="h-11 px-3.5 rounded-xl border-2 border-b-4 bg-black/20 hover:bg-black/30 text-white font-display text-xs font-extrabold tracking-wide flex items-center gap-1.5 cursor-pointer active:translate-y-0.5 transition-all whitespace-nowrap"
                                style={{
                                  borderColor: section.borderHex,
                                }}
                                title={
                                  section.previousSectionLabel
                                    ? `Saltar aprobando evaluación de: ${section.previousSectionLabel}`
                                    : 'Saltar a esta sección con un examen'
                                }
                              >
                                <FastForward className="w-4 h-4 stroke-[2.4]" />
                                <span>Saltar</span>
                              </button>
                            )}

                            {/* Guidebook Notebook Button */}
                            <button
                              type="button"
                              onClick={() => setGuideModalSection(section)}
                              className="h-11 px-3.5 rounded-xl border-2 border-b-4 flex items-center gap-1.5 text-white shrink-0 cursor-pointer active:translate-y-0.5 transition-all bg-black/15 hover:bg-black/25 whitespace-nowrap"
                              style={{
                                borderColor: section.borderHex,
                              }}
                              title="Abrir guía de fórmulas de la sección"
                            >
                              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
                              <span className="text-xs font-extrabold">Guía</span>
                            </button>
                          </div>
                        </div>

                        {/* Spacious Winding S-Curve Node Tree */}
                        <div className="relative flex flex-col items-center space-y-11 py-4">
                          {sectionNodes.map((node, localIdx) => {
                            const isCompleted = node.index < progress.currentNodeIndex;
                            const isCurrent = node.index === progress.currentNodeIndex;
                            const isLocked = node.index > progress.currentNodeIndex;
                            const isSelected = selectedNode?.id === node.id;

                            return (
                              <div
                                key={node.id}
                                className="relative w-full flex flex-col items-center"
                              >
                                {/* Show Mascot beside the path near the active node */}
                                {isCurrent && (
                                  <div
                                    className="absolute -top-2 z-10 pointer-events-none"
                                    style={{
                                      right: node.offsetX <= 0 ? '6%' : 'auto',
                                      left: node.offsetX > 0 ? '6%' : 'auto',
                                    }}
                                  >
                                    <MathMascotSvg className="w-24 h-24 sm:w-28 sm:h-28" />
                                  </div>
                                )}

                                {/* Node Wrapper with generous horizontal S-curve offset */}
                                <div
                                  className="relative flex flex-col items-center"
                                  style={{ transform: `translateX(${node.offsetX * 1.65}px)` }}
                                >
                                  {/* Floating "¡EMPEZAR!" callout above current node */}
                                  {isCurrent && !isSelected && (
                                    <div className="mb-3 px-4 py-1.5 rounded-xl bg-[#131F24] border-2 border-[#2E3E46] text-[#58CC02] font-extrabold text-xs tracking-wider uppercase shadow-lg animate-bounce">
                                      ¡EMPEZAR! (ENTER)
                                    </div>
                                  )}

                                  {/* Outer Progress Halo Ring around Current Active or Selected Node */}
                                  <div
                                    className={`rounded-full p-2 ${
                                      isSelected
                                        ? 'ring-4 ring-[#1CB0F6]/50 bg-[#1CB0F6]/10'
                                        : isCurrent
                                        ? 'ring-4 ring-[#58CC02]/35 bg-[#58CC02]/10'
                                        : ''
                                    }`}
                                  >
                                    {/* 3D Circular Tactile Node Button */}
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (isLocked) {
                                          setLockedMessageNodeId(
                                            lockedMessageNodeId === node.id ? null : node.id
                                          );
                                          setSelectedNode(null);
                                        } else {
                                          setLockedMessageNodeId(null);
                                          setSelectedNode(isSelected ? null : node);
                                        }
                                      }}
                                      className={`w-20 h-20 sm:w-[86px] sm:h-[86px] rounded-full flex items-center justify-center relative overflow-hidden transition-transform cursor-pointer select-none active:translate-y-1 ${
                                        isCompleted
                                          ? 'bg-[#FFC800] border-b-[7px] border-[#D9A300] text-[#8C6200] shadow-lg'
                                          : isCurrent
                                          ? 'bg-[#58CC02] border-b-[7px] border-[#46A302] text-white shadow-lg'
                                          : 'bg-[#202F36] border-b-[7px] border-[#131F24] text-[#52656D]'
                                      }`}
                                      aria-label={node.title}
                                    >
                                      {/* Diagonal Gold Shine stripe on completed nodes */}
                                      {isCompleted && (
                                        <div className="w-24 h-4 bg-white/30 -rotate-45 absolute top-4 -left-4 pointer-events-none" />
                                      )}

                                      {isCompleted ? (
                                        <Check className="w-9 h-9 stroke-[3.5] text-[#8A5A00]" />
                                      ) : isCurrent ? (
                                        node.isCheckpoint ? (
                                          <Trophy className="w-9 h-9 fill-white text-white" />
                                        ) : (
                                          <Star className="w-9 h-9 fill-white text-white" />
                                        )
                                      ) : (
                                        <Lock className="w-8 h-8 stroke-[2.5] text-[#52656D]" />
                                      )}
                                    </button>
                                  </div>

                                  {/* Node subtitle label */}
                                  <span
                                    className={`mt-2 text-xs sm:text-sm font-bold tracking-wide ${
                                      isCompleted
                                        ? 'text-[#FFC800]'
                                        : isCurrent
                                        ? 'text-[#58CC02]'
                                        : 'text-neutral-400'
                                    }`}
                                  >
                                    {node.title}
                                  </span>
                                </div>

                                {/* Popover for Unlocked Node */}
                                {isSelected && !isLocked && (
                                  <div className="mt-4 w-72 sm:w-80 rounded-2xl bg-[#131F24] border-2 border-[#2E3E46] p-4 shadow-2xl z-20 space-y-3 text-center">
                                    <div className="space-y-1">
                                      <p className="font-display font-extrabold text-base text-white">
                                        {node.title}
                                      </p>
                                      <p className="text-xs text-neutral-400">{node.subtitle}</p>
                                    </div>

                                    <button
                                      type="button"
                                      onClick={() => startLesson(node)}
                                      className={`w-full py-3 rounded-xl font-extrabold text-xs tracking-wider uppercase border-b-4 transition-all cursor-pointer active:border-b-0 active:translate-y-1 ${
                                        isCompleted
                                          ? 'bg-[#FFC800] hover:bg-[#FFD324] border-[#D9A300] text-black'
                                          : 'bg-[#58CC02] hover:bg-[#61E002] border-[#46A302] text-black'
                                      }`}
                                    >
                                      {isCompleted
                                        ? 'REPASAR +5 XP (ENTER)'
                                        : `¡EMPEZAR +${node.xpReward} XP! (ENTER)`}
                                    </button>
                                  </div>
                                )}

                                {/* Popover for Locked Node (with shortcut to Section Skip Exam if applicable) */}
                                {lockedMessageNodeId === node.id && isLocked && (
                                  <div className="mt-4 w-64 sm:w-72 rounded-2xl bg-[#131F24] border-2 border-[#26353D] p-4 text-center space-y-2.5 z-20">
                                    <p className="text-xs font-extrabold text-neutral-200">
                                      {node.title} (Bloqueado)
                                    </p>
                                    <p className="text-[11px] text-neutral-400">
                                      Completa los niveles anteriores o salta a esta sección aprobando el tema previo.
                                    </p>
                                    {section.skipExamQuestions &&
                                      section.skipExamQuestions.length > 0 && (
                                        <button
                                          type="button"
                                          onClick={() => startSkipExam(section)}
                                          className="w-full py-2.5 rounded-xl bg-[#FFC800] hover:bg-[#FFD324] border-b-4 border-[#D9A300] text-black font-extrabold text-[11px] uppercase tracking-wider cursor-pointer"
                                        >
                                          Saltar a M{modId} · Sección {displaySecNumber}
                                        </button>
                                      )}
                                  </div>
                                )}

                                {/* Subtle path connector between nodes */}
                                {localIdx < sectionNodes.length - 1 && (
                                  <div className="mt-5 flex flex-col items-center gap-1.5">
                                    <div className="w-2 h-2 rounded-full bg-[#26353D]" />
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#1C272D]" />
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </section>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* TAB 2: PRÁCTICA RÁPIDA DE CÁLCULO MENTAL (CON TECLADO)         */}
            {/* ============================================================== */}
            {activeTab === 'practica' && (
              <div className="space-y-6">
                <div className="rounded-2xl bg-[#1CB0F6] border-b-4 border-[#1185BA] p-5 text-white space-y-1">
                  <h2 className="font-display text-lg sm:text-xl font-extrabold">
                    Entrenamiento de Cálculo Mental con Teclado
                  </h2>
                  <p className="text-xs sm:text-sm font-medium text-white/90">
                    Escribe el resultado y presiona Enter para ganar +5 XP y recuperar vidas gratis.
                  </p>
                </div>

                {drillFeedback && (
                  <div className="p-3.5 rounded-2xl bg-[#131F24] border-2 border-[#26353D] text-xs sm:text-sm font-bold text-[#58CC02] text-center">
                    {drillFeedback}
                  </div>
                )}

                <div className="rounded-2xl bg-[#131F24] border-2 border-[#26353D] p-8 sm:p-10 text-center space-y-6">
                  <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                    Escribe el resultado exacto y presiona Enter
                  </p>
                  <div className="font-mono text-3xl sm:text-5xl font-extrabold text-white tracking-wider flex items-center justify-center flex-wrap gap-3">
                    <span>
                      {drillA} {drillOp} {drillB} =
                    </span>
                    <input
                      ref={drillInputRef}
                      type="text"
                      value={drillTyped}
                      onChange={(e) => setDrillTyped(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && drillTyped.trim()) {
                          e.preventDefault();
                          handleAnswerDrill(drillTyped);
                        }
                      }}
                      placeholder="?"
                      aria-label="Respuesta de cálculo mental"
                      className="w-28 sm:w-32 h-14 px-3 rounded-2xl bg-[#0A0E11] border-2 border-[#1CB0F6] text-center font-mono text-3xl sm:text-4xl font-extrabold text-[#1CB0F6] focus:outline-none focus:ring-2 focus:ring-[#58CC02]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-2">
                    {drillOptions.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleAnswerDrill(opt)}
                        className="py-4 rounded-2xl bg-[#202F36] hover:bg-[#2A3E47] border-2 border-b-4 border-[#37464F] font-mono text-xl sm:text-2xl font-extrabold text-white active:border-b-2 active:translate-y-0.5 cursor-pointer"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* TAB 3: GUÍA DE LOS MÓDULOS DEL CURSO ACTIVO                    */}
            {/* ============================================================== */}
            {activeTab === 'guia' && (
              <div className="space-y-6">
                <div className="space-y-1">
                  <h2 className="font-display text-xl sm:text-2xl font-extrabold text-white">
                    {activeCourse === 'sociales'
                      ? 'Cuaderno de Ciencias Sociales (5 Módulos · 20 Secciones)'
                      : activeCourse === 'quimica'
                      ? 'Cuaderno de Química (Módulos 1, 2 y 3 · 22 Secciones)'
                      : activeCourse === 'fisica'
                      ? 'Cuaderno de Física (Módulos 1, 2 y 3 · 20 Secciones)'
                      : 'Cuaderno de Matemáticas (Módulos 1, 2 y 3 · 20 Secciones)'}
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-400">
                    {activeCourse === 'sociales'
                      ? 'Contexto de los años 50–60, movimientos sociales, surgimiento histórico del ELN, transformaciones territoriales, derechos humanos, memoria histórica y construcción de paz.'
                      : activeCourse === 'quimica'
                      ? 'Energía en procesos químicos, reacciones exo/endotérmicas, tabla periódica, partículas fundamentales, quarks, radiación y semidesintegración.'
                      : activeCourse === 'fisica'
                      ? 'Fórmulas clave de Trabajo, Energía, Cinemática, Leyes de Newton, Fluidos, Termodinámica, Ondas y Electricidad de las 20 secciones.'
                      : 'Fórmulas clave, propiedades y ejemplos de las 20 secciones del curso.'}
                  </p>
                </div>

                {currentCourseSections.map((sec) => (
                  <div
                    key={sec.id}
                    className="rounded-2xl bg-[#131F24] border-2 border-[#26353D] overflow-hidden"
                  >
                    <div
                      className="px-5 py-3.5 font-display font-extrabold text-sm sm:text-base text-white flex items-center justify-between"
                      style={{ backgroundColor: sec.colorHex }}
                    >
                      <span>{sec.guideTitle}</span>
                      <span className="font-mono text-xs bg-black/20 px-2.5 py-0.5 rounded-md">
                        Módulo {sec.moduleId ?? 1}
                      </span>
                    </div>
                    <div className="p-5 space-y-4 divide-y divide-[#26353D]">
                      {sec.guideTips.map((tip, i) => (
                        <div key={i} className={i > 0 ? 'pt-4 space-y-1.5' : 'space-y-1.5'}>
                          <p className="font-mono text-sm sm:text-base font-extrabold text-[#FFC800]">
                            {tip.formula}
                          </p>
                          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                            {tip.rule}
                          </p>
                          <p className="text-xs sm:text-sm font-mono text-[#58CC02] bg-[#0A0E11] px-3.5 py-2 rounded-xl">
                            Ejemplo: {tip.example}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ============================================================== */}
            {/* TAB 4: LOGROS, DESAFÍOS DEL DÍA Y POTENCIADORES                */}
            {/* ============================================================== */}
            {activeTab === 'logros' && (
              <div className="space-y-6">
                <div className="rounded-2xl bg-[#FFC800] border-b-4 border-[#D9A300] p-5 text-black flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h2 className="font-display text-lg sm:text-xl font-extrabold">
                      {activeCourse === 'sociales'
                        ? 'Dominio de Ciencias Sociales'
                        : activeCourse === 'quimica'
                        ? 'Dominio de Química'
                        : activeCourse === 'fisica'
                        ? 'Dominio de Física'
                        : 'Dominio de Matemáticas'}
                    </h2>
                    <p className="text-xs sm:text-sm font-semibold text-black/80">
                      {progress.currentNodeIndex} de {currentCourseNodes.length} nodos completados en oro (
                      {activeCourse === 'sociales' ? '5 Módulos · 20 Secciones' : 'Módulos 1, 2 y 3'})
                    </p>
                  </div>
                  <Trophy className="w-10 h-10 stroke-[2.2]" />
                </div>

                {/* Desafíos Aleatorios del Día (image_628b9824.png) */}
                <DailyRandomChallengesCard
                  seedOffset={dailyChallengeSeedOffset}
                  onRandomizeSeed={() =>
                    setDailyChallengeSeedOffset((prev) => prev + 1)
                  }
                  sessionXpEarned={progress.xp}
                  highAccuracyLessonsCount={
                    highAccuracyLessonsCount + progress.completedLessonsCount
                  }
                  comboFiveLessonsCount={
                    comboFiveLessonsCount + progress.completedLessonsCount
                  }
                />

                {/* Potenciadores: Protector de racha 2/2 EQUIPADOS (image_045d50ab.png) */}
                <PotenciadoresStreakFreezeSection
                  equippedCount={streakFreezesEquipped}
                  maxCount={2}
                  onToggleOrRefill={() =>
                    setStreakFreezesEquipped((prev) => (prev >= 2 ? 1 : 2))
                  }
                />

                {/* Daily Goal Ring Chart inside Logros */}
                <DailyGoalRingChart xp={progress.xp} goal={DAILY_XP_GOAL} />

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="rounded-2xl bg-[#131F24] border-2 border-[#26353D] p-4 sm:p-5 space-y-1">
                    <span className="text-xs text-neutral-400">Experiencia total</span>
                    <p className="font-mono text-2xl sm:text-3xl font-extrabold text-[#FFC800] tabular-nums">
                      {progress.xp} XP
                    </p>
                  </div>
                  <div className="rounded-2xl bg-[#131F24] border-2 border-[#26353D] p-4 sm:p-5 space-y-1">
                    <span className="text-xs text-neutral-400">Lecciones superadas</span>
                    <p className="font-mono text-2xl sm:text-3xl font-extrabold text-[#58CC02] tabular-nums">
                      {progress.completedLessonsCount}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl bg-[#131F24] border-2 border-[#26353D] p-5 space-y-3">
                  <h3 className="font-display text-sm sm:text-base font-extrabold text-white">
                    Estado de los Nodos del Curso (
                    {activeCourse === 'sociales' ? 'Módulos 1 a 5' : 'Módulos 1, 2 y 3'})
                  </h3>
                  <div className="space-y-2">
                    {currentCourseNodes.map((node) => {
                      const done = node.index < progress.currentNodeIndex;
                      const active = node.index === progress.currentNodeIndex;
                      const sec = currentCourseSections.find((s) => s.id === node.sectionId);
                      const modId = sec?.moduleId ?? 1;
                      return (
                        <div
                          key={node.id}
                          className="flex items-center justify-between p-3 rounded-xl bg-[#0A0E11] border border-[#1C272D]"
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold ${
                                done
                                  ? 'bg-[#FFC800] text-black'
                                  : active
                                  ? 'bg-[#58CC02] text-black'
                                  : 'bg-[#202F36] text-neutral-500'
                              }`}
                            >
                              {done ? '✓' : node.index + 1}
                            </span>
                            <div>
                              <p className="text-xs sm:text-sm font-bold text-white">
                                {node.title}{' '}
                                <span className="text-[10px] font-mono text-neutral-400">
                                  (M{modId})
                                </span>
                              </p>
                              <p className="text-[11px] sm:text-xs text-neutral-400">{node.subtitle}</p>
                            </div>
                          </div>
                          <span className="font-mono text-xs text-neutral-400 tabular-nums">
                            +{node.xpReward} XP
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* TAB 5: PERFIL, POTENCIADORES, VIDAS, REINICIAR Y SESIÓN        */}
            {/* ============================================================== */}
            {activeTab === 'perfil' && (
              <div className="space-y-6">
                <div className="rounded-2xl bg-[#131F24] border-2 border-[#26353D] p-5 space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#58CC02]">
                    Estudiante Verificado
                  </p>
                  <h2 className="font-display text-xl font-extrabold text-white truncate">
                    {currentUser.displayName || 'Estudiante'}
                  </h2>
                  <p className="text-xs font-mono text-neutral-400 truncate">
                    {currentUser.email}
                  </p>
                </div>

                {/* Potenciadores: Protector de racha 2 / 2 EQUIPADOS (image_045d50ab.png) */}
                <PotenciadoresStreakFreezeSection
                  equippedCount={streakFreezesEquipped}
                  maxCount={2}
                  onToggleOrRefill={() =>
                    setStreakFreezesEquipped((prev) => (prev >= 2 ? 1 : 2))
                  }
                />

                {/* Desafíos del día inside Perfil as well */}
                <DailyRandomChallengesCard
                  seedOffset={dailyChallengeSeedOffset}
                  onRandomizeSeed={() =>
                    setDailyChallengeSeedOffset((prev) => prev + 1)
                  }
                  sessionXpEarned={progress.xp}
                  highAccuracyLessonsCount={
                    highAccuracyLessonsCount + progress.completedLessonsCount
                  }
                  comboFiveLessonsCount={
                    comboFiveLessonsCount + progress.completedLessonsCount
                  }
                />

                {/* Heart Refill Station */}
                <div className="rounded-2xl bg-[#131F24] border-2 border-[#26353D] p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h3 className="font-display text-sm font-extrabold text-white">
                        Estación de Vidas
                      </h3>
                      <p className="text-xs text-neutral-400">
                        Tienes {progress.hearts} de 5 vidas disponibles
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Heart
                          key={i}
                          className={`w-5 h-5 ${
                            i <= progress.hearts
                              ? 'fill-[#FF4B4B] text-[#FF4B4B]'
                              : 'text-[#26353D]'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={progress.hearts >= 5}
                    onClick={handleRefillHearts}
                    className={`w-full py-3 rounded-xl font-extrabold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all ${
                      progress.hearts < 5
                        ? 'bg-[#1CB0F6] hover:bg-[#35B9F8] border-b-4 border-[#1185BA] text-black cursor-pointer'
                        : 'bg-[#202F36] text-neutral-500 cursor-not-allowed'
                    }`}
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>
                      {progress.hearts >= 5
                        ? 'VIDAS AL MÁXIMO (5/5)'
                        : 'RECARGAR 5 VIDAS (20 GEMAS)'}
                    </span>
                  </button>
                </div>

                {/* Reiniciar progreso & Cerrar sesión */}
                <div className="rounded-2xl bg-[#131F24] border-2 border-[#26353D] p-5 space-y-3">
                  <button
                    type="button"
                    onClick={handleResetProgress}
                    className="w-full py-3 rounded-xl bg-[#202F36] hover:bg-[#2A3E47] border-b-4 border-[#131F24] text-xs font-extrabold text-neutral-200 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>
                      Reiniciar progreso (
                      {activeCourse === 'sociales'
                        ? 'Ciencias Sociales'
                        : activeCourse === 'quimica'
                        ? 'Química'
                        : activeCourse === 'fisica'
                        ? 'Física'
                        : 'Matemáticas'}
                      )
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="w-full py-3 rounded-xl bg-[#2D1215] hover:bg-[#3D181C] border-b-4 border-[#1F0B0D] text-xs font-extrabold text-[#FF4B4B] flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>CERRAR SESIÓN</span>
                  </button>
                </div>
              </div>
            )}
          </main>

          {/* ================================================================ */}
          {/* DESKTOP RIGHT WIDGETS SIDEBAR (Visible on xl+ PC screens)        */}
          {/* Top Status Strip matches image_f7da1fd4.png & image_4899740f.png */}
          {/* Includes Desafíos del día (image_628b9824.png) & Potenciadores   */}
          {/* ================================================================ */}
          <aside className="hidden xl:flex xl:w-[440px] shrink-0 flex-col gap-5 sticky top-8 h-fit select-none">
            {/* Top Stats Strip on PC: [Course Icon + Count] [Flame] [Gems] [Hearts] */}
            <div className="flex items-center justify-between px-2 py-1">
              <CourseSelectorDropdown
                activeCourse={activeCourse}
                levelCount={activeCourseLevelCount}
                isOpen={courseMenuLocation === 'desktop_right'}
                onToggle={() =>
                  setCourseMenuLocation((prev) =>
                    prev === 'desktop_right' ? 'none' : 'desktop_right'
                  )
                }
                onSelectCourse={handleSwitchCourse}
                align="left"
              />

              <div className="flex items-center gap-1.5 font-mono font-extrabold text-sm sm:text-base tabular-nums text-[#FF9600]">
                <Flame className="w-5 h-5 fill-[#FF9600]" />
                <span>{progress.streak}</span>
              </div>

              <div className="flex items-center gap-1.5 font-mono font-extrabold text-sm sm:text-base tabular-nums text-[#1CB0F6]">
                <GemIcon className="w-5 h-5" />
                <span>{progress.gems}</span>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('perfil')}
                className="flex items-center gap-1.5 font-mono font-extrabold text-sm sm:text-base tabular-nums text-[#FF4B4B] cursor-pointer"
              >
                <Heart className="w-5 h-5 fill-[#FF4B4B]" />
                <span>{progress.hearts}</span>
              </button>
            </div>

            {/* Desafíos Aleatorios del Día (image_628b9824.png) */}
            <DailyRandomChallengesCard
              seedOffset={dailyChallengeSeedOffset}
              onRandomizeSeed={() =>
                setDailyChallengeSeedOffset((prev) => prev + 1)
              }
              sessionXpEarned={progress.xp}
              highAccuracyLessonsCount={
                highAccuracyLessonsCount + progress.completedLessonsCount
              }
              comboFiveLessonsCount={
                comboFiveLessonsCount + progress.completedLessonsCount
              }
            />

            {/* Potenciadores: Protector de racha 2 / 2 EQUIPADOS (image_045d50ab.png) */}
            <PotenciadoresStreakFreezeSection
              equippedCount={streakFreezesEquipped}
              maxCount={2}
              onToggleOrRefill={() =>
                setStreakFreezesEquipped((prev) => (prev >= 2 ? 1 : 2))
              }
            />

            {/* Daily XP Goal Card with Animated Custom SVG Ring Chart */}
            <DailyGoalRingChart xp={progress.xp} goal={DAILY_XP_GOAL} />

            {/* Tarjeta 'Resumen de Módulos' (Recharts) en el panel derecho */}
            <ModuleSummaryCard
              activeCourse={activeCourse}
              sections={currentCourseSections}
              nodes={currentCourseNodes}
              currentNodeIndex={progress.currentNodeIndex}
              totalUserXp={progress.xp}
              selectedModuleFilter={selectedModuleFilter}
              onSelectModule={(mod) => {
                setSelectedModuleFilter(mod);
                setActiveTab('aprender');
              }}
            />

            {/* Active Next Lesson Card */}
            {currentActiveNode && (
              <div className="rounded-2xl bg-[#131F24] border-2 border-[#26353D] p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#58CC02]">
                    Siguiente lección
                  </span>
                  <span className="font-mono text-xs font-bold text-[#FFC800] tabular-nums">
                    +{currentActiveNode.xpReward} XP
                  </span>
                </div>
                <div className="space-y-1">
                  <h3 className="font-display text-base font-extrabold text-white">
                    {currentActiveNode.title}
                  </h3>
                  <p className="text-xs text-neutral-400">
                    {currentActiveNode.subtitle}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => startLesson(currentActiveNode)}
                  className="w-full py-3 rounded-xl bg-[#58CC02] hover:bg-[#61E002] border-b-4 border-[#46A302] active:border-b-0 active:translate-y-1 text-black font-extrabold text-xs tracking-wider uppercase transition-all cursor-pointer"
                >
                  ¡EMPEZAR LECCIÓN! (ENTER)
                </button>
              </div>
            )}
          </aside>
        </div>
      </div>

      {/* Section Guidebook Modal */}
      {guideModalSection && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#131F24] border-2 border-[#2E3E46] overflow-hidden shadow-2xl">
            <div
              className="p-4 flex items-center justify-between text-white"
              style={{ backgroundColor: guideModalSection.colorHex }}
            >
              <h3 className="font-display font-extrabold text-sm sm:text-base">
                {guideModalSection.guideTitle}
              </h3>
              <button
                type="button"
                onClick={() => setGuideModalSection(null)}
                className="p-1 rounded-lg bg-black/20 hover:bg-black/30 cursor-pointer"
                title="Cerrar (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              {guideModalSection.guideTips.map((tip, idx) => (
                <div
                  key={idx}
                  className="space-y-1 border-b border-[#26353D] pb-3 last:border-b-0 last:pb-0"
                >
                  <p className="font-mono text-xs sm:text-sm font-extrabold text-[#FFC800]">
                    {tip.formula}
                  </p>
                  <p className="text-xs sm:text-sm text-neutral-300">{tip.rule}</p>
                  <p className="text-xs font-mono text-[#58CC02]">{tip.example}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MOBILE BOTTOM NAVIGATION BAR (Hidden on md+ PC screens)              */}
      {/* ==================================================================== */}
      <nav
        aria-label="Navegación móvil"
        className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#0A0E11] border-t-2 border-[#1C272D] px-4 py-2.5 flex items-center justify-around"
      >
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={`p-2.5 rounded-xl border-2 transition-colors cursor-pointer ${
                isActive
                  ? 'bg-[#1CB0F6]/15 border-[#1CB0F6] text-[#1CB0F6]'
                  : `border-transparent ${item.inactiveColor} hover:bg-[#131F24]`
              }`}
              title={item.label}
            >
              {item.icon}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
