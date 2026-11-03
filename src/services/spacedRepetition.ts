/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ArithmeticNode } from '../mathCurriculum';

export type SpacedCourseId = 'sociales' | 'quimica' | 'fisica' | 'matematicas';

export interface LessonReviewRecord {
  nodeId: string;
  course: SpacedCourseId;
  nodeIndex: number;
  lastReviewedAt: number; // epoch ms
  repetitionStage: number; // 0 -> 2d, 1 -> 4d, 2 -> 7d, 3 -> 14d, 4 -> 30d
  reviewCount: number;
}

export interface UserSpacedRepetitionStore {
  uid: string;
  lastLoginAt: number;
  previousLoginAt: number;
  simulatedDaysOffset: number;
  records: Record<string, LessonReviewRecord>; // key: `${course}:${nodeId}`
}

export interface SpacedRepetitionSuggestion {
  course: SpacedCourseId;
  courseLabel: string;
  courseColor: string;
  node: ArithmeticNode;
  daysSinceReview: number;
  daysSinceLogin: number;
  retentionPercent: number;
  intervalDays: number;
  repetitionStage: number;
  isOverdue: boolean;
}

const STORAGE_PREFIX = 'duo_spaced_repetition_v1_';
const DAY_MS = 24 * 60 * 60 * 1000;

// Leitner / Ebbinghaus spaced intervals in days
export const SPACED_INTERVALS_DAYS = [2, 4, 7, 14, 30];

const COURSE_META: Record<
  SpacedCourseId,
  { label: string; color: string }
> = {
  sociales: { label: 'Ciencias Sociales', color: '#FF9600' },
  quimica: { label: 'Química', color: '#00CD9C' },
  fisica: { label: 'Física', color: '#1CB0F6' },
  matematicas: { label: 'Matemáticas', color: '#58CC02' },
};

function getStorageKey(uid: string): string {
  return `${STORAGE_PREFIX}${uid}`;
}

export function loadSpacedStore(uid: string): UserSpacedRepetitionStore {
  const now = Date.now();
  try {
    const raw = localStorage.getItem(getStorageKey(uid));
    if (raw) {
      const parsed = JSON.parse(raw) as UserSpacedRepetitionStore;
      if (parsed && typeof parsed === 'object' && parsed.records) {
        return {
          uid,
          lastLoginAt: parsed.lastLoginAt || now,
          previousLoginAt: parsed.previousLoginAt || now - 4 * DAY_MS,
          simulatedDaysOffset: parsed.simulatedDaysOffset ?? 0,
          records: parsed.records,
        };
      }
    }
  } catch {
    // Ignore storage read errors
  }

  // Default initial store: sets previousLoginAt to 4 days ago so a returning user
  // with completed lessons immediately experiences the multi-day spaced repetition check
  return {
    uid,
    lastLoginAt: now,
    previousLoginAt: now - 4 * DAY_MS,
    simulatedDaysOffset: 0,
    records: {},
  };
}

export function saveSpacedStore(store: UserSpacedRepetitionStore): void {
  try {
    localStorage.setItem(getStorageKey(store.uid), JSON.stringify(store));
  } catch {
    // Ignore storage write errors
  }
}

/**
 * Registers a user login session and computes how many days elapsed since the previous login.
 * Also considers Firestore's `updatedAt` timestamp if it is older than the local timestamp.
 */
export function registerUserLoginSession(
  uid: string,
  firestoreUpdatedAtMs?: number | null
): UserSpacedRepetitionStore {
  const store = loadSpacedStore(uid);
  const now = Date.now();
  const timeSinceLastRecorded = now - store.lastLoginAt;

  // If more than 30 minutes passed since last recorded login, shift lastLoginAt -> previousLoginAt
  if (timeSinceLastRecorded > 30 * 60 * 1000) {
    store.previousLoginAt = store.lastLoginAt;
    store.lastLoginAt = now;
  }

  // If Firestore has an older timestamp from a previous session days ago, incorporate it
  if (
    firestoreUpdatedAtMs &&
    firestoreUpdatedAtMs < now - DAY_MS &&
    firestoreUpdatedAtMs < store.previousLoginAt
  ) {
    store.previousLoginAt = firestoreUpdatedAtMs;
  }

  saveSpacedStore(store);
  return store;
}

/**
 * Ensures all completed nodes (`index < currentNodeIndex`) in a course have review records.
 * Earlier nodes in the learning path are seeded with older timestamps so their natural
 * spaced-repetition curve reflects the order in which they were learned.
 */
export function syncCompletedNodesForCourse(
  uid: string,
  course: SpacedCourseId,
  nodes: ArithmeticNode[],
  currentNodeIndex: number,
  firestoreUpdatedAtMs?: number | null
): UserSpacedRepetitionStore {
  const store = loadSpacedStore(uid);
  const now = Date.now();
  let modified = false;

  const completedNodes = nodes.filter((n) => n.index < currentNodeIndex);

  for (const node of completedNodes) {
    const key = `${course}:${node.id}`;
    if (!store.records[key]) {
      // Stagger older lessons further back in time (e.g., 3 to 9 days ago depending on distance from currentNodeIndex)
      const distanceBehind = Math.max(1, currentNodeIndex - node.index);
      const staggeredDaysAgo = Math.min(14, Math.max(3, distanceBehind + 2));
      const baseReferenceMs =
        firestoreUpdatedAtMs && firestoreUpdatedAtMs < now
          ? firestoreUpdatedAtMs
          : now;

      store.records[key] = {
        nodeId: node.id,
        course,
        nodeIndex: node.index,
        lastReviewedAt: baseReferenceMs - staggeredDaysAgo * DAY_MS,
        repetitionStage: 0,
        reviewCount: 1,
      };
      modified = true;
    }
  }

  if (modified) {
    saveSpacedStore(store);
  }
  return store;
}

/**
 * Records that the user just completed or reviewed a lesson node.
 * Advances the lesson's repetitionStage (2d -> 4d -> 7d -> 14d -> 30d) and resets its timer.
 */
export function recordLessonReviewed(
  uid: string,
  course: SpacedCourseId,
  nodeId: string,
  nodeIndex: number
): UserSpacedRepetitionStore {
  const store = loadSpacedStore(uid);
  const key = `${course}:${nodeId}`;
  const existing = store.records[key];
  const now = Date.now();

  const nextStage = existing
    ? Math.min(SPACED_INTERVALS_DAYS.length - 1, existing.repetitionStage + 1)
    : 0;

  store.records[key] = {
    nodeId,
    course,
    nodeIndex,
    lastReviewedAt: now,
    repetitionStage: nextStage,
    reviewCount: (existing?.reviewCount ?? 0) + 1,
  };

  // Reset any simulated days offset for this freshly reviewed item by anchoring lastReviewedAt ahead of offset
  if (store.simulatedDaysOffset > 0) {
    store.records[key].lastReviewedAt =
      now + store.simulatedDaysOffset * DAY_MS;
  }

  saveSpacedStore(store);
  return store;
}

/**
 * Allows simulating returning to the app after N days so the user can test
 * the spaced repetition trigger and Ebbinghaus retention decay at any time.
 */
export function addSimulatedDaysAfterLogin(
  uid: string,
  extraDays: number
): UserSpacedRepetitionStore {
  const store = loadSpacedStore(uid);
  store.simulatedDaysOffset = Math.max(
    0,
    Math.min(60, (store.simulatedDaysOffset || 0) + extraDays)
  );
  saveSpacedStore(store);
  return store;
}

export function resetSimulatedDays(uid: string): UserSpacedRepetitionStore {
  const store = loadSpacedStore(uid);
  store.simulatedDaysOffset = 0;
  saveSpacedStore(store);
  return store;
}

/**
 * Computes Ebbinghaus memory retention percentage: R = exp(-t / S)
 */
function calculateRetentionPercent(
  daysElapsed: number,
  intervalDays: number
): number {
  if (daysElapsed <= 0) return 100;
  // At daysElapsed === intervalDays, retention is ~68% (optimal review threshold)
  const stability = intervalDays / 0.38;
  const raw = Math.round(Math.exp(-daysElapsed / stability) * 100);
  return Math.max(22, Math.min(99, raw));
}

/**
 * Evaluates all completed lessons across courses (prioritizing the active course)
 * and returns a prioritized list of spaced repetition suggestions due for review.
 */
export function getSpacedRepetitionSuggestions(
  uid: string,
  activeCourse: SpacedCourseId,
  courseCatalogNodes: Record<SpacedCourseId, ArithmeticNode[]>,
  courseProgressIndices: Record<SpacedCourseId, number>
): SpacedRepetitionSuggestion[] {
  const store = loadSpacedStore(uid);
  const effectiveNow =
    Date.now() + (store.simulatedDaysOffset || 0) * DAY_MS;

  const rawDaysSinceLogin = Math.max(
    1,
    Math.floor((effectiveNow - store.previousLoginAt) / DAY_MS)
  );

  const suggestions: SpacedRepetitionSuggestion[] = [];
  const coursesOrder: SpacedCourseId[] = [
    activeCourse,
    ...(['sociales', 'quimica', 'fisica', 'matematicas'] as SpacedCourseId[]).filter(
      (c) => c !== activeCourse
    ),
  ];

  for (const course of coursesOrder) {
    const nodes = courseCatalogNodes[course] || [];
    const maxCompletedIndex = courseProgressIndices[course] || 0;
    if (maxCompletedIndex <= 0) continue;

    for (const node of nodes) {
      if (node.index >= maxCompletedIndex) continue;

      const key = `${course}:${node.id}`;
      const record = store.records[key];
      const stage = record?.repetitionStage ?? 0;
      const intervalDays =
        SPACED_INTERVALS_DAYS[
          Math.min(stage, SPACED_INTERVALS_DAYS.length - 1)
        ];

      const lastReviewed =
        record?.lastReviewedAt ??
        Date.now() - Math.max(3, maxCompletedIndex - node.index + 2) * DAY_MS;

      const daysSinceReview = Math.max(
        0,
        Math.floor((effectiveNow - lastReviewed) / DAY_MS)
      );

      const isOverdue = daysSinceReview >= intervalDays;
      const retentionPercent = calculateRetentionPercent(
        daysSinceReview,
        intervalDays
      );

      if (isOverdue || daysSinceReview >= 2) {
        suggestions.push({
          course,
          courseLabel: COURSE_META[course].label,
          courseColor: COURSE_META[course].color,
          node,
          daysSinceReview,
          daysSinceLogin: rawDaysSinceLogin,
          retentionPercent,
          intervalDays,
          repetitionStage: stage,
          isOverdue,
        });
      }
    }
  }

  // Sort: prioritize activeCourse first, then overdue items with lowest retention / longest time since review
  suggestions.sort((a, b) => {
    const aIsActive = a.course === activeCourse ? 1 : 0;
    const bIsActive = b.course === activeCourse ? 1 : 0;
    if (aIsActive !== bIsActive) return bIsActive - aIsActive;
    if (a.isOverdue !== b.isOverdue) return a.isOverdue ? -1 : 1;
    return b.daysSinceReview - a.daysSinceReview;
  });

  // Fallback: if the user has not unlocked node > 0 yet in any course (or all are at 0),
  // suggest reviewing the foundational concept of the active course if not reviewed today
  if (suggestions.length === 0) {
    const activeNodes = courseCatalogNodes[activeCourse] || [];
    const firstNode = activeNodes[0];
    if (firstNode) {
      const key = `${activeCourse}:${firstNode.id}`;
      const record = store.records[key];
      const stage = record?.repetitionStage ?? 0;
      const intervalDays =
        SPACED_INTERVALS_DAYS[
          Math.min(stage, SPACED_INTERVALS_DAYS.length - 1)
        ];
      const lastReviewed =
        record?.lastReviewedAt ?? Date.now() - 4 * DAY_MS;
      const daysSinceReview = Math.max(
        0,
        Math.floor((effectiveNow - lastReviewed) / DAY_MS)
      );

      if (daysSinceReview >= 2) {
        suggestions.push({
          course: activeCourse,
          courseLabel: COURSE_META[activeCourse].label,
          courseColor: COURSE_META[activeCourse].color,
          node: firstNode,
          daysSinceReview,
          daysSinceLogin: Math.max(3, rawDaysSinceLogin),
          retentionPercent: calculateRetentionPercent(
            daysSinceReview,
            intervalDays
          ),
          intervalDays,
          repetitionStage: stage,
          isOverdue: daysSinceReview >= intervalDays,
        });
      }
    }
  }

  return suggestions;
}
