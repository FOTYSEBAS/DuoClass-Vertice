/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Brain,
  ChevronRight,
  Clock,
  RotateCcw,
  Sparkles,
  X,
} from 'lucide-react';
import {
  SPACED_INTERVALS_DAYS,
  SpacedRepetitionSuggestion,
} from '../services/spacedRepetition';

interface SpacedRepetitionToastProps {
  suggestions: SpacedRepetitionSuggestion[];
  dismissed: boolean;
  simulatedDaysOffset: number;
  onDismiss: () => void;
  onStartReview: (suggestion: SpacedRepetitionSuggestion) => void;
  onSimulateDays: (days: number) => void;
  lang?: 'es' | 'en';
}

export const SpacedRepetitionToast: React.FC<SpacedRepetitionToastProps> = ({
  suggestions,
  dismissed,
  simulatedDaysOffset,
  onDismiss,
  onStartReview,
  onSimulateDays,
  lang = 'es',
}) => {
  const isEn = lang === 'en';
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (dismissed || suggestions.length === 0) {
    return null;
  }

  const safeIndex = Math.min(selectedIndex, suggestions.length - 1);
  const current = suggestions[safeIndex];
  const nextIntervalDays =
    SPACED_INTERVALS_DAYS[
      Math.min(
        current.repetitionStage + 1,
        SPACED_INTERVALS_DAYS.length - 1
      )
    ];

  const retentionColor =
    current.retentionPercent < 55
      ? 'text-[#FF4B4B]'
      : current.retentionPercent < 75
      ? 'text-[#FFC800]'
      : 'text-[#58CC02]';

  const retentionBarBg =
    current.retentionPercent < 55
      ? 'bg-[#FF4B4B]'
      : current.retentionPercent < 75
      ? 'bg-[#FFC800]'
      : 'bg-[#58CC02]';

  return (
    <div
      role="status"
      aria-live="polite"
      className="rounded-2xl bg-[#131F24]/95 backdrop-blur-md border-2 border-[#2E3E46] px-4 py-3 shadow-xl transition-all"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left: Icon + Spaced Repetition Lesson Details */}
        <div className="flex items-start sm:items-center gap-3 min-w-0">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border-b-4"
            style={{
              backgroundColor: `${current.courseColor}20`,
              borderColor: current.courseColor,
              color: current.courseColor,
            }}
            title="Curva de memoria · Repetición espaciada"
          >
            <Brain className="w-5 h-5" />
          </div>

          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-center flex-wrap gap-1.5 text-[11px] font-mono font-bold">
              <span className="text-[#FFC800] uppercase tracking-wider flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Repetición espaciada
              </span>
              <span className="text-neutral-500">·</span>
              <span className="text-neutral-300">
                Hace {current.daysSinceReview}{' '}
                {current.daysSinceReview === 1 ? 'día' : 'días'}
              </span>
              {simulatedDaysOffset > 0 && (
                <span className="px-1.5 py-0.2 rounded bg-[#CE82FF]/20 text-[#CE82FF] text-[10px]">
                  +{simulatedDaysOffset}d simulados
                </span>
              )}
              <span className="text-neutral-500">·</span>
              <span className={`${retentionColor} tabular-nums`}>
                {current.retentionPercent}% retención
              </span>
            </div>

            <div className="flex items-center gap-2 min-w-0">
              <span
                className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded text-black shrink-0"
                style={{ backgroundColor: current.courseColor }}
              >
                {current.courseLabel}
              </span>
              <p className="font-display text-xs sm:text-sm font-extrabold text-white truncate">
                Sugerencia: {current.node.title}
              </p>
            </div>

            {/* Compact Ebbinghaus retention bar + next interval preview */}
            <div className="flex items-center gap-2.5 pt-0.5">
              <div className="w-24 sm:w-28 h-1.5 rounded-full bg-[#202F36] overflow-hidden shrink-0">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${retentionBarBg}`}
                  style={{ width: `${current.retentionPercent}%` }}
                />
              </div>
              <span className="text-[10px] font-mono text-neutral-400 truncate">
                Etapa {current.repetitionStage + 1}/5 (próx. repaso en{' '}
                {nextIntervalDays}d)
              </span>
            </div>
          </div>
        </div>

        {/* Right: Actions (Review Now, Cycle/Simulate +3d, Dismiss) */}
        <div className="flex items-center justify-end gap-2 shrink-0">
          {suggestions.length > 1 && (
            <button
              type="button"
              onClick={() =>
                setSelectedIndex((prev) => (prev + 1) % suggestions.length)
              }
              className="px-2 py-1.5 rounded-xl bg-[#202F36] hover:bg-[#2A3E47] border border-[#2E3E46] text-[11px] font-mono font-bold text-neutral-300 flex items-center gap-0.5 cursor-pointer"
              title="Ver otra lección sugerida para repasar"
            >
              <span>
                {safeIndex + 1}/{suggestions.length}
              </span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={() => onSimulateDays(3)}
            className="px-2.5 py-1.5 rounded-xl bg-[#202F36] hover:bg-[#2A3E47] border border-[#2E3E46] text-[11px] font-mono font-bold text-[#1CB0F6] cursor-pointer"
            title="Simular inicio de sesión después de 3 días adicionales"
          >
            +3d
          </button>

          <button
            type="button"
            onClick={() => onStartReview(current)}
            className="px-3.5 py-2 rounded-xl bg-[#FFC800] hover:bg-[#FFD324] border-b-4 border-[#D9A300] active:border-b-0 active:translate-y-0.5 text-black font-display text-xs font-extrabold tracking-wide uppercase flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <RotateCcw className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Repasar +5 XP</span>
          </button>

          <button
            type="button"
            onClick={onDismiss}
            aria-label="Cerrar notificación de repetición espaciada"
            title="Recordar más tarde"
            className="p-1.5 rounded-xl text-neutral-400 hover:text-white hover:bg-[#202F36] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

interface SpacedRepetitionPanelCardProps {
  suggestions: SpacedRepetitionSuggestion[];
  simulatedDaysOffset: number;
  isToastDismissed: boolean;
  onStartReview: (suggestion: SpacedRepetitionSuggestion) => void;
  onSimulateDays: (days: number) => void;
  onResetSimulation: () => void;
  onRestoreToast: () => void;
  lang?: 'es' | 'en';
}

export const SpacedRepetitionPanelCard: React.FC<
  SpacedRepetitionPanelCardProps
> = ({
  suggestions,
  simulatedDaysOffset,
  isToastDismissed,
  onStartReview,
  onSimulateDays,
  onResetSimulation,
  onRestoreToast,
  lang = 'es',
}) => {
  const isEn = lang === 'en';
  return (
    <div className="rounded-2xl bg-[#131F24] border-2 border-[#26353D] p-5 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FFC800]/15 border border-[#FFC800]/40 text-[#FFC800] flex items-center justify-center shrink-0">
            <Brain className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <h3 className="font-display text-sm font-extrabold text-white">
              {isEn ? 'Memory & Spaced Repetition' : 'Memoria y Repetición Espaciada'}
            </h3>
            <p className="text-xs text-neutral-400">
              {isEn
                ? 'Leitner intervals (2d · 4d · 7d · 14d · 30d) upon sign-in'
                : 'Intervalos Leitner (2d · 4d · 7d · 14d · 30d) al iniciar sesión'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onSimulateDays(4)}
            className="px-3 py-1.5 rounded-xl bg-[#202F36] hover:bg-[#2A3E47] border border-[#2E3E46] text-xs font-mono font-bold text-[#1CB0F6] cursor-pointer"
            title={isEn ? 'Simulate return after 4 days' : 'Simular regreso tras 4 días'}
          >
            {isEn ? 'Simulate +4 days' : 'Simular +4 días'}
          </button>
          {simulatedDaysOffset > 0 && (
            <button
              type="button"
              onClick={onResetSimulation}
              className="px-2.5 py-1.5 rounded-xl bg-[#202F36] hover:bg-[#2A3E47] border border-[#2E3E46] text-xs font-mono text-neutral-400 hover:text-white cursor-pointer"
              title={isEn ? 'Reset simulated days' : 'Restablecer días simulados'}
            >
              {isEn ? 'Today' : 'Hoy'}
            </button>
          )}
        </div>
      </div>

      {suggestions.length > 0 ? (
        <div className="space-y-2">
          {suggestions.slice(0, 3).map((item) => (
            <div
              key={`${item.course}:${item.node.id}`}
              className="p-3 rounded-xl bg-[#0A0E11] border border-[#1C272D] flex items-center justify-between gap-3"
            >
              <div className="min-w-0 space-y-0.5">
                <div className="flex items-center gap-2">
                  <span
                    className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded text-black"
                    style={{ backgroundColor: item.courseColor }}
                  >
                    {item.courseLabel}
                  </span>
                  <span className="text-[11px] font-mono text-neutral-400">
                    {isEn ? `${item.daysSinceReview}d ago` : `Hace ${item.daysSinceReview}d`} · {item.retentionPercent}% {isEn ? 'retention' : 'retención'}
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-bold text-white truncate">
                  {item.node.title}
                </p>
              </div>

              <button
                type="button"
                onClick={() => onStartReview(item)}
                className="px-3 py-2 rounded-xl bg-[#FFC800] hover:bg-[#FFD324] border-b-2 border-[#D9A300] text-black font-extrabold text-xs uppercase tracking-wide shrink-0 cursor-pointer"
              >
                {isEn ? 'Review' : 'Repasar'}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-neutral-400">
          {isEn
            ? 'Your memory is up to date! Use "Simulate +4 days" to test return reminders.'
            : '¡Tu memoria está al día! Usa «Simular +4 días» para probar la alerta de regreso tras varios días.'}
        </p>
      )}

      {isToastDismissed && suggestions.length > 0 && (
        <button
          type="button"
          onClick={onRestoreToast}
          className="w-full py-2 rounded-xl bg-[#202F36] hover:bg-[#2A3E47] text-xs font-bold text-[#FFC800] flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{isEn ? 'Show review notification in skill tree' : 'Mostrar notificación de repaso en el árbol'}</span>
        </button>
      )}
    </div>
  );
};
