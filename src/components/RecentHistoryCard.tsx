import React from 'react';
import { Calendar, CheckCircle2, Clock, FileText, RotateCcw, Trophy, Zap } from 'lucide-react';
import { ArithmeticNode } from '../mathCurriculum';

export type RecentCourseId = 'sociales' | 'quimica' | 'fisica' | 'matematicas';

export interface RecentLessonHistoryItem {
  id: string;
  course: RecentCourseId;
  courseLabel: string;
  courseColor: string;
  nodeId: string;
  nodeIndex: number;
  title: string;
  subtitle: string;
  completedAt: number; // timestamp in ms
  scorePts: number; // 0 - 100
  xpEarned: number;
  correctCount: number;
  totalQuestions: number;
}

const STORAGE_PREFIX = 'duo_recent_lessons_history_v1_';

export const COURSE_DISPLAY_META: Record<
  RecentCourseId,
  { label: string; color: string }
> = {
  sociales: { label: 'Ciencias Sociales', color: '#FF9600' },
  quimica: { label: 'Química', color: '#CE82FF' },
  fisica: { label: 'Física', color: '#58CC02' },
  matematicas: { label: 'Matemáticas', color: '#1CB0F6' },
};

function getStorageKey(uid: string): string {
  return `${STORAGE_PREFIX}${uid}`;
}

/**
 * Loads only genuine user-completed lessons from localStorage.
 * Automatically purges any legacy synthetic `seed_` entries if present.
 */
export function loadStoredRecentHistory(uid: string): RecentLessonHistoryItem[] {
  if (!uid || typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(getStorageKey(uid));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const realItems = parsed.filter(
      (item): item is RecentLessonHistoryItem =>
        Boolean(item) &&
        typeof item.id === 'string' &&
        !item.id.startsWith('seed_') &&
        typeof item.completedAt === 'number' &&
        typeof item.scorePts === 'number'
    );
    if (realItems.length !== parsed.length) {
      window.localStorage.setItem(getStorageKey(uid), JSON.stringify(realItems));
    }
    return realItems;
  } catch {
    return [];
  }
}

export function saveStoredRecentHistory(
  uid: string,
  items: RecentLessonHistoryItem[]
): void {
  if (!uid || typeof window === 'undefined') return;
  try {
    const clean = items.filter((item) => !item.id.startsWith('seed_'));
    window.localStorage.setItem(getStorageKey(uid), JSON.stringify(clean.slice(0, 15)));
  } catch {
    // Ignore storage quota errors
  }
}

/**
 * Records a newly completed lesson at the top of the user's recent history
 * using the exact real accuracy score and timestamp.
 */
export function recordRecentLessonCompletion(
  uid: string,
  params: {
    course: RecentCourseId;
    node: ArithmeticNode;
    mistakesCount: number;
    xpEarned: number;
  }
): RecentLessonHistoryItem[] {
  if (!uid) return [];
  const existing = loadStoredRecentHistory(uid);
  const totalQ = Math.max(1, params.node.questions.length);
  const correctCount = Math.max(0, totalQ - params.mistakesCount);
  const rawPct = Math.round((correctCount / totalQ) * 100);
  const scorePts = Math.max(0, Math.min(100, rawPct));
  const meta = COURSE_DISPLAY_META[params.course];

  const newEntry: RecentLessonHistoryItem = {
    id: `${params.course}_${params.node.id}_${Date.now()}`,
    course: params.course,
    courseLabel: meta.label,
    courseColor: meta.color,
    nodeId: params.node.id,
    nodeIndex: params.node.index,
    title: params.node.title,
    subtitle: params.node.subtitle,
    completedAt: Date.now(),
    scorePts,
    xpEarned: params.xpEarned,
    correctCount,
    totalQuestions: totalQ,
  };

  const updated = [newEntry, ...existing].slice(0, 15);
  saveStoredRecentHistory(uid, updated);
  return updated.slice(0, 5);
}

/**
 * Returns up to the latest 5 genuinely completed lessons for the user.
 * Does NOT invent, seed, or fabricate any fallback data.
 */
export function getRecentFiveLessons(
  uid: string,
  _courseNodesByCourse?: Record<RecentCourseId, ArithmeticNode[]>,
  _courseIndices?: Record<RecentCourseId, number>
): RecentLessonHistoryItem[] {
  const stored = loadStoredRecentHistory(uid);
  return stored
    .slice()
    .sort((a, b) => b.completedAt - a.completedAt)
    .slice(0, 5);
}

export function formatSpanishDateAndTime(timestampMs: number): {
  fullDate: string;
  relativeLabel: string;
} {
  const date = new Date(timestampMs);
  const now = new Date();

  const dayFormatter = new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const timeFormatter = new Intl.DateTimeFormat('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const fullDate = `${dayFormatter.format(date)} · ${timeFormatter.format(date)}`;

  const diffMs = Math.max(0, now.getTime() - timestampMs);
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  let relativeLabel = 'Hoy';
  if (diffMinutes < 2) {
    relativeLabel = 'Hace instantes';
  } else if (diffHours < 1) {
    relativeLabel = `Hace ${diffMinutes} min`;
  } else if (diffDays === 0) {
    relativeLabel = `Hoy · Hace ${diffHours} h`;
  } else if (diffDays === 1) {
    relativeLabel = 'Ayer';
  } else {
    relativeLabel = `Hace ${diffDays} días`;
  }

  return { fullDate, relativeLabel };
}

interface RecentHistoryCardProps {
  items: RecentLessonHistoryItem[];
  onReplayLesson: (item: RecentLessonHistoryItem) => void;
  lang?: 'es' | 'en';
}

export const RecentHistoryCard: React.FC<RecentHistoryCardProps> = ({
  items,
  onReplayLesson,
  lang = 'es',
}) => {
  const isEn = lang === 'en';
  const recentFive = items.slice(0, 5);
  const averageScore =
    recentFive.length > 0
      ? Math.round(
          recentFive.reduce((sum, item) => sum + item.scorePts, 0) /
            recentFive.length
        )
      : 0;
  const totalRecentXp = recentFive.reduce((sum, item) => sum + item.xpEarned, 0);

  return (
    <div className="rounded-2xl bg-[#131F24] border-2 border-[#26353D] p-5 space-y-4">
      {/* Cabecera de Historial Reciente */}
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#26353D] pb-3.5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#58CC02]/15 border border-[#58CC02]/40 flex items-center justify-center text-[#58CC02] shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div className="space-y-0.5">
            <h3 className="font-display text-sm sm:text-base font-extrabold text-white tracking-tight">
              {isEn ? 'Recent History (Real Data)' : 'Historial Reciente (Datos Reales)'}
            </h3>
            <p className="text-[11px] text-neutral-400">
              {isEn
                ? 'Last 5 completed lessons · Exact date and real score obtained'
                : 'Últimas 5 lecciones completadas por ti · Fecha exacta y puntaje real obtenido'}
            </p>
          </div>
        </div>

        {/* Resumen numérico solo cuando existen registros reales */}
        {recentFive.length > 0 ? (
          <div className="flex items-center gap-3 text-[11px] font-mono tabular-nums text-neutral-300 bg-[#0A1114] border border-[#26353D] rounded-xl px-3 py-1.5">
            <span className="flex items-center gap-1 text-[#FFC800] font-bold">
              <Trophy className="w-3.5 h-3.5" />
              {isEn ? 'Avg.' : 'Prom.'} {averageScore}/100 pts
            </span>
            <span className="text-neutral-600">·</span>
            <span className="flex items-center gap-1 text-[#58CC02] font-bold">
              <Zap className="w-3.5 h-3.5" />
              +{totalRecentXp} XP
            </span>
          </div>
        ) : (
          <span className="text-[11px] font-mono text-neutral-400 bg-[#0A1114] border border-[#26353D] rounded-xl px-2.5 py-1">
            0 / 5 {isEn ? 'logged' : 'registradas'}
          </span>
        )}
      </div>

      {/* Estado vacío honesto si aún no se han completado lecciones reales */}
      {recentFive.length === 0 ? (
        <div className="rounded-xl bg-[#0A1114]/90 border border-[#26353D] p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-neutral-200">
            <FileText className="w-4 h-4 text-[#1CB0F6] shrink-0" />
            <span>
              {isEn
                ? 'No completed lessons in your recent history yet'
                : 'Aún no hay lecciones completadas en tu historial reciente'}
            </span>
          </div>
          <p className="text-[11px] text-neutral-400 leading-relaxed">
            {isEn
              ? 'This log exclusively shows lessons you genuinely complete during your study sessions. When you finish a lesson, it will appear here with its timestamp and score.'
              : 'Este registro muestra únicamente las lecciones que completes de forma real durante tus sesiones de estudio (sin datos prellenados ni simulados). Cuando termines una lección en Ciencias Sociales, Química, Física o Matemáticas, aparecerá aquí con su fecha, hora exacta y puntaje obtenido.'}
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {recentFive.map((item, idx) => {
            const { fullDate, relativeLabel } = formatSpanishDateAndTime(
              item.completedAt
            );
            const isExcellent = item.scorePts >= 90;
            const isGood = item.scorePts >= 80 && item.scorePts < 90;
            const scoreColor = isExcellent
              ? '#58CC02'
              : isGood
              ? '#FFC800'
              : '#1CB0F6';

            return (
              <div
                key={item.id}
                className="group rounded-xl bg-[#0A1114]/90 border border-[#26353D] hover:border-[#374B55] p-3.5 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                {/* Izquierda: Índice, curso, título y fecha */}
                <div className="flex items-start gap-3 min-w-0">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center font-mono text-[11px] font-extrabold shrink-0 mt-0.5 border"
                    style={{
                      backgroundColor: `${item.courseColor}18`,
                      borderColor: `${item.courseColor}55`,
                      color: item.courseColor,
                    }}
                  >
                    #{idx + 1}
                  </div>

                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-bold tracking-wide">
                      <span style={{ color: item.courseColor }} className="uppercase">
                        {item.courseLabel}
                      </span>
                      <span className="text-neutral-600">·</span>
                      <span className="text-neutral-400 truncate">
                        {item.subtitle}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm font-extrabold text-white truncate">
                      {item.title}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono tabular-nums text-neutral-400">
                      <span className="inline-flex items-center gap-1 text-neutral-300">
                        <Calendar className="w-3 h-3 text-[#1CB0F6]" />
                        {fullDate}
                      </span>
                      <span className="text-neutral-600">·</span>
                      <span className="text-neutral-400">{relativeLabel}</span>
                    </div>
                  </div>
                </div>

                {/* Derecha: Puntaje real obtenido + botón de repaso */}
                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#1D2B32] shrink-0">
                  <div className="text-left sm:text-right space-y-0.5">
                    <div className="flex items-center sm:justify-end gap-1.5">
                      <CheckCircle2
                        className="w-3.5 h-3.5 shrink-0"
                        style={{ color: scoreColor }}
                      />
                      <span
                        className="font-mono tabular-nums text-xs sm:text-sm font-extrabold"
                        style={{ color: scoreColor }}
                      >
                        {item.scorePts}/100 pts ({item.scorePts}%)
                      </span>
                    </div>
                    <div className="flex items-center sm:justify-end gap-1.5 text-[10px] font-mono tabular-nums text-neutral-400">
                      <span>
                        {item.correctCount}/{item.totalQuestions} aciertos
                      </span>
                      <span className="text-neutral-600">·</span>
                      <span className="text-[#FFC800] font-bold">
                        +{item.xpEarned} XP
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onReplayLesson(item)}
                    title={`Repasar ${item.title}`}
                    className="px-2.5 py-1.5 rounded-xl bg-[#202F36] hover:bg-[#2A3E47] border-b-2 border-[#0E171B] text-[10px] font-extrabold uppercase tracking-wider text-[#1CB0F6] flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Repasar</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
