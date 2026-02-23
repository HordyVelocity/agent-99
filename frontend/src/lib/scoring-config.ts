/**
 * ASCEND / AGENT99 — SCORING CONFIG v2.0 (Frontend)
 * ══════════════════════════════════════════════════
 * Ported from backend/functions/scoring-config.js
 * Zelly edits weights here — logic lives in scoring.ts
 */

export const THRESHOLDS = {
  HIGH: 66,
  MODERATE: 31,
};

export const BASE_SCORE = 50;
export const MIN_ANSWERS = 10;

export const SCORING_MAP: Record<string, Record<string, number>> = {
  q1: { "Individual / Sole Trader": 3, "Company": 2, "Partnership": 1, "Trust": 0 },
  q2: { "$15,000 to $250,000": 5, "$10k-$50k": 2, "$50k-$200k": -2, "$1,000,000+": -4 },
  q3: { "Less than 6 months": 4, "6 months to 1 year": 1, "1 to 2 years": -2, "Over 2 years": -4 },
  q4: { "None": 5, "Overdue notice": 2, "ATO Garnishee": -2, "Statutory demand": -4, "Wind-up notice": -5, "Bankruptcy notice": -6 },
  q5: { "Yes - all current": 6, "Mostly current": 2, "Partially lodged": -2, "Not current": -5 },
  q6: { "All lodged": 4, "Small arrears": 1, "Large arrears": -2, "Never lodged": -4 },
  q7: { "No": 1, "Yes - successful": 3, "Yes - defaulted": -3, "Attempted - rejected": -2 },
  q8: { "Yes": 1, "No": 0, "Recently resigned": -2 },
  q9: { "No": 5, "Yes - non-lockdown": -3, "Yes - lockdown": -6, "Unsure": -1 },
  q10: { "No": 3, "Small amount": 1, "Significant": -2, "Overwhelming": -4 },
  q11: { "Under $500": -4, "$500-$1,500": 0, "$1,500-$3,000": 3, "Over $3,000": 5 },
  q12: { "Less than a year": 2, "1 to 2 years": 1, "2 to 3 years": 0, "Over 3 years": -1 },
  q13: { "Growing": 4, "Stable": 2, "Declining": -2, "No income": -4 },
  q14: { "Keep business trading": 2, "Negotiate debt reduction": 1, "Wind down responsibly": 0, "Avoid bankruptcy": -1 },
  q15: { "Planning ahead": 4, "Moderate urgency": 1, "Very urgent": -2, "ATO Action": -4 },
};

export const STRENGTH_MAP: Record<string, { answers: string[]; message: string }> = {
  q1: { answers: ["Individual / Sole Trader"], message: "Simpler structure reduces compliance complexity" },
  q2: { answers: ["$15,000 to $250,000"], message: "Debt amount is within manageable negotiation range" },
  q3: { answers: ["Less than 6 months"], message: "Early intervention significantly improves outcomes" },
  q5: { answers: ["Yes - all current", "Mostly current"], message: "Strong BAS compliance demonstrates good faith to the ATO" },
  q6: { answers: ["All lodged"], message: "Complete tax return history strengthens your position" },
  q7: { answers: ["Yes - successful"], message: "Previous successful payment plan shows track record" },
  q9: { answers: ["No"], message: "No Director Penalty Notice — full range of options available" },
  q10: { answers: ["No"], message: "No personal liabilities simplifies resolution path" },
  q11: { answers: ["$1,500-$3,000", "Over $3,000"], message: "Strong payment capacity supports favorable plan terms" },
  q13: { answers: ["Growing", "Stable"], message: "Stable or growing income supports sustainable arrangements" },
  q15: { answers: ["Planning ahead"], message: "Proactive approach gives maximum time for negotiation" },
};

export const ACTION_MAP: Record<string, { question: string; answers: string[]; message: string }> = {
  q4_garnishee: { question: "q4", answers: ["ATO Garnishee"], message: "Seek immediate legal advice — garnishee notice requires urgent response" },
  q4_statutory: { question: "q4", answers: ["Statutory demand"], message: "URGENT: You have 21 days to respond to a statutory demand" },
  q4_windup: { question: "q4", answers: ["Wind-up notice"], message: "CRITICAL: Wind-up proceedings require immediate professional assistance" },
  q4_bankruptcy: { question: "q4", answers: ["Bankruptcy notice"], message: "CRITICAL: Bankruptcy notice — engage insolvency practitioner immediately" },
  q5_notcurrent: { question: "q5", answers: ["Not current", "Partially lodged"], message: "Prioritise lodging outstanding BAS returns before ATO negotiation" },
  q6_arrears: { question: "q6", answers: ["Large arrears", "Never lodged"], message: "Lodge outstanding income tax returns to unlock negotiation options" },
  q7_defaulted: { question: "q7", answers: ["Yes - defaulted"], message: "Previous default will be considered — prepare explanation of changed circumstances" },
  q9_lockdown: { question: "q9", answers: ["Yes - lockdown"], message: "CRITICAL: Lockdown DPN — directors face personal liability. Seek specialist advice immediately" },
  q9_nonlockdown: { question: "q9", answers: ["Yes - non-lockdown"], message: "Non-lockdown DPN — you still have options but must act within timeframe" },
  q10_overwhelming: { question: "q10", answers: ["Overwhelming"], message: "Consider formal insolvency advice to assess all available options" },
  q11_low: { question: "q11", answers: ["Under $500"], message: "Low payment capacity may require debt reduction negotiation or alternative arrangements" },
  q13_noincome: { question: "q13", answers: ["No income"], message: "No income stream — consider whether voluntary administration may be appropriate" },
  q13_declining: { question: "q13", answers: ["Declining"], message: "Declining income — prepare cash flow projections for ATO negotiation" },
  q15_critical: { question: "q15", answers: ["ATO Action"], message: "ATO enforcement imminent — seek professional representation before responding" },
  q15_high: { question: "q15", answers: ["Very urgent"], message: "Engage professional support promptly to preserve negotiation options" },
};
