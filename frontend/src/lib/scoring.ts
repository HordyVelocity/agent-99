/**
 * ASCEND / AGENT99 — LOCAL SCORING ENGINE v2.0
 * ═════════════════════════════════════════════
 * Runs entirely in browser. No backend dependency.
 * Config lives in scoring-config.ts (Zelly edits there).
 */

import {
  THRESHOLDS,
  BASE_SCORE,
  MIN_ANSWERS,
  SCORING_MAP,
  STRENGTH_MAP,
  ACTION_MAP,
} from "./scoring-config"

export interface ScoringResult {
  success: boolean
  score: number
  category: string
  strengths: string[]
  actions: string[]
  answeredCount: number
  error?: string
}

export function calculateScoreLocal(answers: Record<string, string>): ScoringResult {
  // Count answered questions
  const answeredCount = Object.keys(answers).filter(k => answers[k]).length

  if (answeredCount < MIN_ANSWERS) {
    return {
      success: false,
      score: 0,
      category: "",
      strengths: [],
      actions: [],
      answeredCount,
      error: `Please answer at least ${MIN_ANSWERS} questions (${answeredCount} answered)`,
    }
  }

  // Calculate score from config map
  let adjustment = 0
  for (const [qId, optionScores] of Object.entries(SCORING_MAP)) {
    const answer = answers[qId]
    if (!answer) continue
    const points = optionScores[answer]
    if (points !== undefined) adjustment += points
  }

  const raw = BASE_SCORE + adjustment
  const score = Math.max(0, Math.min(100, Math.round(raw)))

  // Determine category
  const category =
    score >= THRESHOLDS.HIGH
      ? "High Readiness"
      : score >= THRESHOLDS.MODERATE
        ? "Moderate Readiness"
        : "Low Readiness"

  // Gather strengths
  const strengths: string[] = []
  for (const [qId, rule] of Object.entries(STRENGTH_MAP)) {
    const answer = answers[qId]
    if (answer && rule.answers.includes(answer)) {
      strengths.push(rule.message)
    }
  }

  // Gather actions
  const actions: string[] = []
  for (const [, rule] of Object.entries(ACTION_MAP)) {
    const answer = answers[rule.question]
    if (answer && rule.answers.includes(answer)) {
      actions.push(rule.message)
    }
  }

  return {
    success: true,
    score,
    category,
    strengths,
    actions,
    answeredCount,
  }
}
