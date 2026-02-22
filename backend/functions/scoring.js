/**
 * ASCEND / AGENT99 — SCORING ENGINE v2.0
 * 
 * THIS FILE CONTAINS LOGIC ONLY — NO WEIGHTS OR THRESHOLDS.
 * All scoring data lives in scoring-config.js
 * 
 * When Zelly updates weights: edit scoring-config.js only.
 * When logic needs changing: edit this file only.
 * Neither change breaks the other.
 * 
 * Date: 22 Feb 2026
 * Author: Claude (Lead Dev)
 */

const admin = require('firebase-admin');
const db = admin.firestore();

const {
  THRESHOLDS,
  BASE_SCORE,
  MIN_ANSWERS,
  SCORING_MAP,
  STRENGTH_MAP,
  ACTION_MAP,
} = require('./scoring-config');


exports.calculateScore = async (caseId, answers) => {

  // GUARD: caseId required
  if (!caseId || typeof caseId !== 'string') {
    return { success: false, error: 'Missing or invalid caseId' };
  }

  // GUARD: answers must be an object
  if (!answers || typeof answers !== 'object') {
    return { success: false, error: 'Missing or invalid answers' };
  }

  // GUARD: minimum answer gate
  const answeredQuestions = Object.keys(answers).filter(
    k => k.startsWith('q') && answers[k]
  );

  if (answeredQuestions.length < MIN_ANSWERS) {
    return {
      success: false,
      error: `Insufficient answers: ${answeredQuestions.length}/15 provided (minimum ${MIN_ANSWERS} required)`,
      answeredCount: answeredQuestions.length,
    };
  }

  // CALCULATE SCORE
  let adjustments = 0;

  for (const [questionId, optionMap] of Object.entries(SCORING_MAP)) {
    const answer = answers[questionId];
    if (answer && optionMap[answer] !== undefined) {
      adjustments += optionMap[answer];
    }
  }

  const rawScore = BASE_SCORE + adjustments;
  const score = Math.max(0, Math.min(100, Math.round(rawScore)));

  // CATEGORY (from config thresholds)
  const category = score >= THRESHOLDS.HIGH
    ? 'High'
    : score >= THRESHOLDS.MODERATE
      ? 'Moderate'
      : 'Low';

  // COLLECT STRENGTHS
  const strengths = [];
  for (const [questionId, optionMap] of Object.entries(STRENGTH_MAP)) {
    const answer = answers[questionId];
    if (answer && optionMap[answer]) {
      strengths.push(optionMap[answer]);
    }
  }

  // COLLECT IMMEDIATE ACTIONS
  const immediateActions = [];
  for (const [questionId, optionMap] of Object.entries(ACTION_MAP)) {
    const answer = answers[questionId];
    if (answer && optionMap[answer]) {
      immediateActions.push(optionMap[answer]);
    }
  }

  // PERSIST TO FIRESTORE
  try {
    await db.collection('cases').doc(caseId).collection('ai').doc('scores').set({
      score,
      category,
      strengths,
      immediateActions,
      answeredCount: answeredQuestions.length,
      totalQuestions: 15,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      version: '2.0',
    });
  } catch (firestoreError) {
    console.error('Firestore write failed:', firestoreError);
  }

  // RETURN
  return {
    success: true,
    score,
    category,
    strengths,
    immediateActions,
    answeredCount: answeredQuestions.length,
  };
};
