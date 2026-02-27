/**
 * ASCEND / AGENT99 — SCORING CONFIG v3.0 (Frontend)
 * ══════════════════════════════════════════════════
 * Updated for 12Q Blueprint v7.1 (28 Feb 2026)
 * 3 fields (debtBand, atoLatestAction, idealOutcome) moved to 4Q onboarding
 * Scoring now based on 12
cat > src/lib/scoring-config.ts << 'SCOREEOF'
/**
 * ASCEND / AGENT99 — SCORING CONFIG v3.0 (Frontend)
 * ══════════════════════════════════════════════════
 * Updated for 12Q Blueprint v7.1 (28 Feb 2026)
 * 3 fields (debtBand, atoLatestAction, idealOutcome) moved to 4Q onboarding
 * Scoring now based on 12 voice questions only
 */

export const THRESHOLDS = {
  HIGH: 66,
  MODERATE: 31,
};

export const BASE_SCORE = 50;
export const MIN_ANSWERS = 8;

export const SCORING_MAP: Record<string, Record<string, number>> = {
  q1: { "Negotiate ATO Debt / Avoid insolvency": 2, "Wind down responsibly": 0 },
  q2: { "Individual": 3, "Sole Trader": 3, "Partnership": 1, "Company": 2, "Trust": 0 },
  q3: { "Less than 12 months": 4, "1 – 2 years": 1, "2 – 5 years": -2, "5+ years": -4 },
  q4: { "Unsure": -1, "Partially lodged": -2, "Lodged and up to date": 6, "Never lodged": -5 },
  q5: { "Yes": -3, "No": 4, "Unsure": -1 },
  q6: { "Unsure": -1, "Partially lodged": -2, "Lodged and up to date": 4, "Never lodged": -4 },
  q7: { "Never": 1, "In current payment plan": 3, "Yes but defaulted": -3, "Attempted but rejected": -2 },
  q8: { "Yes, I am": 1, "No, I'm not": 0 },
  q9: { "Yes, I can": 4, "No, I can't": -4, "Potentially / Maybe": 0 },
  q10: { "Up to 1 year": 2, "1 – 2 years": 1, "2 – 3 years": 0 },
  q11: { "Growing": 4, "Stable": 2, "Declining": -2 },
  q12: { "Not yet urgent / planning ahead": 4, "Moderate urgency": 1, "Very urgent": -2 },
};

export const STRENGTH_MAP: Record<string, { answers: string[]; message: string }> = {
  q2: { answers: ["Individual", "Sole Trader"], message: "Simpler structure reduces compliance complexity" },
  q3: { answers: ["Less than 12 months"], message: "Early intervention significantly improves outcomes" },
  q4: { answers: ["Lodged and up to date"], message: "Strong BAS compliance demonstrates good faith to the ATO" },
  q5: { answers: ["No"], message: "No outstanding superannuation simplifies your position" },
  q6: { answers: ["Lodged and up to date"], message: "Complete tax return history strengthens your position" },
  q7: { answers: ["In current payment plan"], message: "Active payment plan shows commitment to the ATO" },
  q9: { answers: ["Yes, I can"], message: "Strong payment capacity supports favorable plan terms" },
  q11: { answers: ["Growing", "Stable"], message: "Stable or growing income supports sustainable arrangements" },
  q12: { answers: ["Not yet urgent / planning ahead"], message: "Proactive approach gives maximum time for negotiation" },
};

export const ACTION_MAP: Record<string, { question: string; answers: string[]; message: string }> = {
  q4_neverlodged: { question: "q4", answers: ["Never lodged"], message: "Prioritise lodging outstanding BAS returns before ATO negotiation" },
  q4_partial: { question: "q4", answers: ["Partially lodged"], message: "Complete outstanding BAS lodgements to strengthen your negotiation position" },
  q5_super: { question: "q5", answers: ["Yes"], message: "Outstanding superannuation must be addressed — this is a priority for the ATO" },
  q6_neverlodged: { question: "q6", answers: ["Never lodged"], message: "Lodge outstanding income tax returns to unlock negotiation options" },
  q6_partial: { question: "q6", answers: ["Partially lodged"], message: "Complete outstanding tax return lodgements before engaging the ATO" },
  q7_defaulted: { question: "q7", answers: ["Yes but defaulted"], message: "Previous default will be considered — prepare explanation of changed circumstances" },
  q9_nocapacity: { question: "q9", answers: ["No, I can't"], message: "Limited payment capacity may require debt reduction negotiation or alternative arrangements" },
  q11_declining: { question: "q11", answers: ["Declining"], message: "Declining income — prepare cash flow projections for ATO negotiation" },
  q12_veryurgent: { question: "q12", answers: ["Very urgent"], message: "Engage professional support promptly to preserve negotiation options" },
};
