/**
 * ASCEND / AGENT99 — SCORING CONFIG v2.0
 * ═══════════════════════════════════════
 * 
 * THIS IS THE ONLY FILE ZELLY NEEDS TO EDIT.
 * 
 * Change weights, thresholds, strengths, or actions here.
 * Scoring engine (scoring.js) reads this config — no logic changes needed.
 * 
 * After editing: run regression tests (3 band scenarios)
 * Expected rework for weight changes: 30-60 minutes
 * 
 * Date: 22 Feb 2026
 * Version: 2.0 (initial)
 * Owner: Zelly (Director) — weights & thresholds
 *         Claude (Lead Dev) — structure & validation
 */

// ── THRESHOLDS ──
// These control the category boundaries
// Frontend getLabel() must match: score >= HIGH → "High Readiness"
const THRESHOLDS = {
  HIGH: 66,      // Score >= 66 = "High Readiness"
  MODERATE: 31,  // Score >= 31 = "Moderate Readiness"
  // Below 31 = "Low Readiness"
};

// ── BASE SCORE ──
// Starting point before any question adjustments
const BASE_SCORE = 50;

// ── MINIMUM ANSWERS REQUIRED ──
// User must answer at least this many questions to receive a score
const MIN_ANSWERS = 10;

// ── QUESTION WEIGHTS ──
// Each question ID maps answer text → point adjustment from BASE_SCORE
// Positive = strengthens case, Negative = weakens case
// 
// WEIGHT GUIDE FOR ZELLY:
//   Critical factor:  ±5 to ±6 points
//   High factor:      ±4 to ±5 points
//   Moderate factor:  ±2 to ±3 points
//   Low factor:       ±1 to ±2 points
//
// Total possible positive: ~57 (base 50 + 57 = 100 cap)
// Total possible negative: ~55 (base 50 - 55 = 0 floor)

const SCORING_MAP = {

  // ──────────────────────────────────────
  // Q1: Business Structure
  // WHY: Simpler structures = easier ATO negotiation
  // WEIGHT: Moderate (max ±3)
  // ──────────────────────────────────────
  q1: {
    'Sole Trader':   3,
    'Company':       1,
    'Trust':         0,
    'Partnership':   1,
  },

  // ──────────────────────────────────────
  // Q2: ATO Debt Amount
  // WHY: Lower debt = significantly easier to resolve
  // WEIGHT: High (max ±5)
  // ──────────────────────────────────────
  q2: {
    'Under $10k':    5,
    '$10k-$50k':     2,
    '$50k-$200k':   -1,
    'Over $200k':   -4,
  },

  // ──────────────────────────────────────
  // Q3: Debt Age
  // WHY: Fresh debt = ATO more willing to negotiate
  // WEIGHT: High (max ±4)
  // ──────────────────────────────────────
  q3: {
    'Under 6 months':  4,
    '6-12 months':     1,
    '1-2 years':      -2,
    'Over 2 years':   -4,
  },

  // ──────────────────────────────────────
  // Q4: ATO Notices Received
  // WHY: Escalation level = how aggressive ATO is being
  // WEIGHT: Critical (max ±6)
  // ──────────────────────────────────────
  q4: {
    'None':               5,
    'Overdue notice':     2,
    'Garnishee notice':  -1,
    'Statutory demand':  -4,
    'Wind-up notice':    -5,
    'Bankruptcy notice': -6,
  },

  // ──────────────────────────────────────
  // Q5: BAS Returns Status
  // WHY: #1 compliance factor ATO considers in negotiations
  // WEIGHT: Critical (max ±6)
  // ──────────────────────────────────────
  q5: {
    'Yes - all current':  6,
    'Mostly current':     3,
    'Partially lodged':  -2,
    'Not current':       -5,
  },

  // ──────────────────────────────────────
  // Q6: Income Tax Returns
  // WHY: Second compliance indicator ATO checks
  // WEIGHT: High (max ±4)
  // ──────────────────────────────────────
  q6: {
    'All lodged':           4,
    'Minor arrears':        2,
    'Significant arrears': -2,
    'Never lodged':        -4,
  },

  // ──────────────────────────────────────
  // Q7: Payment Plan History
  // WHY: ATO tracks payment plan compliance — defaulting is a red flag
  // WEIGHT: Moderate (max ±3)
  // ──────────────────────────────────────
  q7: {
    'No':                    1,
    'Yes - successful':      3,
    'Yes - defaulted':      -3,
    'Attempted - rejected': -2,
  },

  // ──────────────────────────────────────
  // Q8: Director Status
  // WHY: Resignation timing can trigger DPN issues
  // WEIGHT: Low (max ±2)
  // ──────────────────────────────────────
  q8: {
    'Yes':                1,
    'No':                 0,
    'Recently resigned': -2,
  },

  // ──────────────────────────────────────
  // Q9: Director Penalty Notice (DPN)
  // WHY: Most severe personal liability trigger in ATO enforcement
  // WEIGHT: Critical (max ±6)
  // ──────────────────────────────────────
  q9: {
    'No':                 5,
    'Yes - lockdown':    -6,
    'Yes - non-lockdown':-4,
    'Unsure':            -1,
  },

  // ──────────────────────────────────────
  // Q10: Personal Liabilities / Guarantees
  // WHY: Affects overall capacity to service ATO debt
  // WEIGHT: Moderate (max ±4)
  // ──────────────────────────────────────
  q10: {
    'No':            3,
    'Minor':         1,
    'Significant':  -2,
    'Overwhelming': -4,
  },

  // ──────────────────────────────────────
  // Q11: Monthly Payment Capacity
  // WHY: ATO needs to see you can actually pay
  // WEIGHT: High (max ±5)
  // ──────────────────────────────────────
  q11: {
    'Under $500':      -4,
    '$500-$1,500':      1,
    '$1,500-$3,000':    3,
    'Over $3,000':      5,
  },

  // ──────────────────────────────────────
  // Q12: Payment Timeframe Preference
  // WHY: Shorter timeframes show commitment
  // WEIGHT: Low (max ±2)
  // ──────────────────────────────────────
  q12: {
    'Under 12 months':  2,
    '12-24 months':     1,
    '24-36 months':     0,
    'Over 36 months':  -1,
  },

  // ──────────────────────────────────────
  // Q13: Business Income Stability
  // WHY: ATO wants confidence the payment plan won't default
  // WEIGHT: High (max ±4)
  // ──────────────────────────────────────
  q13: {
    'Growing':     4,
    'Stable':      2,
    'Declining':  -2,
    'No income':  -4,
  },

  // ──────────────────────────────────────
  // Q14: Primary Goal
  // WHY: Informs recommendations more than score
  // WEIGHT: Low (max ±2)
  // ──────────────────────────────────────
  q14: {
    'Keep business trading':     2,
    'Negotiate debt reduction':  1,
    'Wind down responsibly':     0,
    'Avoid bankruptcy':         -1,
  },

  // ──────────────────────────────────────
  // Q15: Urgency Level
  // WHY: Proactive engagement = better outcomes with ATO
  // WEIGHT: High (max ±4)
  // ──────────────────────────────────────
  q15: {
    'Planning ahead':                      4,
    'Moderate urgency':                    1,
    'High urgency':                       -2,
    'Critical - ATO threatening action':  -4,
  },
};


// ── STRENGTHS ──
// Maps specific answers → strength messages shown on results page
// Zelly: add/remove/edit text freely. Keys must match QUESTIONS option text exactly.
const STRENGTH_MAP = {
  q1:  { 'Sole Trader': 'Simpler business structure reduces negotiation complexity' },
  q2:  { 'Under $10k': 'Debt under $10k qualifies for streamlined payment arrangements' },
  q3:  { 'Under 6 months': 'Recent debt — ATO typically more flexible on fresh obligations' },
  q4:  { 'None': 'No ATO enforcement notices — early engagement is a strong advantage' },
  q5:  { 'Yes - all current': 'BAS fully current — this is the ATO\'s #1 compliance indicator' },
  q6:  { 'All lodged': 'All income tax returns lodged — strong compliance position' },
  q7:  { 'Yes - successful': 'Prior successful payment plan demonstrates reliability to ATO' },
  q9:  { 'No': 'No Director Penalty Notice — no personal liability escalation' },
  q11: { 'Over $3,000': 'Strong payment capacity supports favourable terms', '$1,500-$3,000': 'Solid monthly contribution capacity' },
  q13: { 'Growing': 'Growing income strengthens payment plan credibility', 'Stable': 'Stable income supports consistent payment commitments' },
  q15: { 'Planning ahead': 'Proactive engagement — ATO responds well to early action' },
};


// ── IMMEDIATE ACTIONS ──
// Maps specific answers → priority action items shown on results page
// These fire when answers indicate risk factors requiring urgent attention
// Zelly: add/remove/edit text freely. Keys must match QUESTIONS option text exactly.
const ACTION_MAP = {
  q4: {
    'Garnishee notice':  'Respond to garnishee notice within 14 days — seek specialist advice immediately',
    'Statutory demand':  'Statutory demand requires response within 21 days — urgent legal review needed',
    'Wind-up notice':    'Wind-up proceedings initiated — immediate specialist intervention required',
    'Bankruptcy notice': 'Bankruptcy notice active — engage insolvency specialist before deadline',
  },
  q5: {
    'Partially lodged': 'Lodge outstanding BAS returns before engaging ATO on payment plan',
    'Not current':      'Priority: Lodge all outstanding BAS returns — ATO will not negotiate until compliant',
  },
  q6: {
    'Significant arrears': 'Lodge outstanding income tax returns to strengthen negotiation position',
    'Never lodged':        'Critical: Lodge all income tax returns — this is a prerequisite for ATO negotiation',
  },
  q7: {
    'Yes - defaulted': 'Prepare explanation for prior default — ATO will require evidence of changed circumstances',
  },
  q8: {
    'Recently resigned': 'Review director resignation date against DPN timelines — may still carry personal liability',
  },
  q9: {
    'Yes - lockdown':     'Lockdown DPN issued — personal liability cannot be discharged by resignation. Seek specialist advice.',
    'Yes - non-lockdown': 'Non-lockdown DPN active — time-critical response required to avoid personal assessment',
    'Unsure':             'Confirm DPN status with ATO immediately — this affects your personal liability exposure',
  },
  q10: {
    'Overwhelming': 'Consider formal debt review or Part IX agreement before ATO negotiation',
  },
  q11: {
    'Under $500': 'Explore options to increase payment capacity — ATO may require higher minimum',
  },
  q13: {
    'Declining': 'Document reasons for income decline — ATO may accept hardship variation',
    'No income': 'Apply for ATO hardship provisions before negotiating payment plan',
  },
  q15: {
    'Critical - ATO threatening action': 'Contact ATO immediately to request hold on enforcement while preparing negotiation',
  },
};


// ── EXPORT ──
module.exports = {
  THRESHOLDS,
  BASE_SCORE,
  MIN_ANSWERS,
  SCORING_MAP,
  STRENGTH_MAP,
  ACTION_MAP,
};
